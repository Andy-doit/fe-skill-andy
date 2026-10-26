/**
 * Pre-deploy build-output check for fe-sec (zero dependencies, Node 18+).
 * Scans public client build output for:
 *   - source map files (*.map)                                   → error
 *   - JS/CSS files with a sourceMappingURL comment               → error if the map exists next to it, warning otherwise
 *   - secret-looking patterns                                    → error (reports file + pattern NAME, never the value)
 *   - values of non-public env vars from --env <file>            → error (reports the variable NAME only)
 *
 * Usage: node check-build-output.mjs [--env .env.production] [dir ...]
 *   default dirs (whichever exist): .next/static  dist  out  build
 * Exit code: 1 on any error, else 0. Warnings do not fail.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
let envFile = null;
const dirs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--env") envFile = args[++i];
  else dirs.push(args[i]);
}
if (!dirs.length) dirs.push(".next/static", "dist", "out", "build");
const roots = dirs.map((d) => path.resolve(process.cwd(), d)).filter((d) => fs.existsSync(d));
if (!roots.length) {
  console.error(`[Error] No build output found in: ${dirs.join(", ")} (run the production build first)`);
  process.exit(1);
}

const PUBLIC_PREFIX = /^(NEXT_PUBLIC|VITE|PUBLIC|REACT_APP|EXPO_PUBLIC|NUXT_PUBLIC)_/;
const SECRET_PATTERNS = [
  { name: "Stripe secret key", re: /\bsk_(live|test)_[A-Za-z0-9]{10,}/, level: "error" },
  { name: "AWS access key id", re: /\bAKIA[0-9A-Z]{16}\b/, level: "error" },
  { name: "GitHub token", re: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/, level: "error" },
  { name: "GitLab token", re: /\bglpat-[A-Za-z0-9_-]{20,}\b/, level: "error" },
  { name: "Slack token", re: /\bxox[abpr]-[A-Za-z0-9-]{10,}\b/, level: "error" },
  { name: "Private key block", re: /-----BEGIN (RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY( BLOCK)?-----/, level: "error" },
  { name: "JWT literal", re: /\beyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{10,}\b/, level: "error" },
  { name: "Google API key (public for Maps; confirm restriction)", re: /\bAIza[0-9A-Za-z_-]{35}\b/, level: "warning" },
  { name: "Generic 'secret'/'password' assignment", re: /(secret|password|passwd)["']?\s*[:=]\s*["'][^"']{8,}["']/i, level: "warning" },
];
const TEXT_EXT = new Set([".js", ".mjs", ".cjs", ".css", ".html", ".json", ".txt", ".map"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

// Non-public env values to search for (kept in memory only; never printed).
const envValues = [];
if (envFile) {
  const envPath = path.resolve(process.cwd(), envFile);
  if (!fs.existsSync(envPath)) {
    console.error(`[Error] env file not found: ${envFile}`);
    process.exit(1);
  }
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const name = m[1];
    const value = m[2].trim().replace(/^["']|["']$/g, "");
    if (PUBLIC_PREFIX.test(name) || value.length < 8 || /^(true|false|\d+|localhost|development|production)$/i.test(value)) continue;
    envValues.push({ name, value });
  }
}

const errors = [];
const warnings = [];
let scanned = 0;

for (const root of roots) {
  for (const file of walk(root)) {
    const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");
    const ext = path.extname(file).toLowerCase();
    if (ext === ".map") {
      errors.push(`${rel}: source map in public build output`);
      continue;
    }
    if (!TEXT_EXT.has(ext)) continue;
    scanned++;
    const body = fs.readFileSync(file, "utf8");

    const sm = body.match(/\/[/*]#\s*sourceMappingURL=([^\s*]+)/);
    if (sm) {
      const target = sm[1];
      if (target.startsWith("data:")) errors.push(`${rel}: inline source map (sourceMappingURL=data:)`);
      else if (fs.existsSync(path.resolve(path.dirname(file), target))) errors.push(`${rel}: sourceMappingURL points to an existing map (${target})`);
      else warnings.push(`${rel}: sourceMappingURL comment left in output (${target} not present)`);
    }

    for (const { name, re, level } of SECRET_PATTERNS) {
      if (re.test(body)) (level === "error" ? errors : warnings).push(`${rel}: matches pattern "${name}"`);
    }
    for (const { name, value } of envValues) {
      if (body.includes(value)) errors.push(`${rel}: contains the value of non-public env var ${name}`);
    }
  }
}

console.log("===============================================================================");
console.log(` BUILD OUTPUT CHECK: ${roots.map((r) => path.relative(process.cwd(), r) || ".").join(", ")} (${scanned} text files)`);
console.log("===============================================================================");
for (const e of errors) console.log(`❌ ${e}`);
for (const w of warnings) console.log(`⚠️  ${w}`);
console.log(`\nResult: ${errors.length} error(s), ${warnings.length} warning(s) → ${errors.length ? "FAIL" : "PASS"}`);
process.exit(errors.length ? 1 : 0);
