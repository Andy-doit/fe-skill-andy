/**
 * Skill-set health check for fe-skill-andy (portable across Claude Code, Codex, Antigravity).
 * Checks every <root>/<skill>/SKILL.md for:
 * - frontmatter `name` (lowercase/digits/hyphens, <= 64 chars, equals folder) and `description` (<= 1024 chars)
 * - SKILL.md length (<= 500 lines)
 * - relative links that do not resolve
 * - absolute paths (drive letters, file:///, /Users/, /home/)
 * - slash-command style skill references (tool-specific invocation syntax)
 * - extra files under references/ scripts/ evals/ assets/ not linked from SKILL.md
 * - pending learned notes (Status: new) per skill
 * Pure Node.js built-ins (zero external dependencies).
 *
 * Usage: node check-skills.mjs [skills-root]   (default: the folder two levels above this script)
 * Exit code: 1 if any error, else 0. Warnings do not fail.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(process.cwd(), process.argv[2] || path.resolve(__dirname, "../.."));

if (!fs.existsSync(root)) {
  console.error(`[Error] Skills root not found: ${root}`);
  process.exit(1);
}

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ABS_RE = /([A-Za-z]:[\\/][^\s`'")]*|file:\/\/\/\S+|\/Users\/\S+|\/home\/\S+)/g;
const SLASH_RE = /(^|[\s`(|])\/(fe-[a-z0-9-]+)/g;
const LINK_RE = /\]\(([^)\s]+)\)/g;
const EXTRA_DIRS = ["references", "scripts", "evals", "assets", "examples", "resources"];

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const lines = m[1].split(/\r?\n/);
  const out = {};
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (value === ">" || value === "|" || value === ">-" || value === "|-") {
      const block = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) block.push(lines[++i].trim());
      value = block.join(" ");
    }
    out[kv[1]] = value.replace(/^["']|["']$/g, "");
  }
  return out;
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? listFiles(p) : [p];
  });
}

const errors = [];
const warnings = [];
const pending = [];
const skills = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((e) => e.isDirectory() && fs.existsSync(path.join(root, e.name, "SKILL.md")))
  .map((e) => e.name)
  .sort();

for (const skill of skills) {
  const dir = path.join(root, skill);
  const skillFile = path.join(dir, "SKILL.md");
  const text = fs.readFileSync(skillFile, "utf-8");
  const lines = text.split(/\r?\n/);
  const fm = parseFrontmatter(text);
  const where = `${skill}/SKILL.md`;

  if (!fm) {
    errors.push(`${where}: missing frontmatter`);
  } else {
    if (!fm.name) errors.push(`${where}: missing name`);
    else {
      if (!NAME_RE.test(fm.name) || fm.name.length > 64) errors.push(`${where}: invalid name "${fm.name}"`);
      if (fm.name !== skill) errors.push(`${where}: name "${fm.name}" != folder "${skill}"`);
    }
    if (!fm.description) errors.push(`${where}: missing description`);
    else if (fm.description.length > 1024) errors.push(`${where}: description ${fm.description.length} chars (> 1024)`);
    else if (!/DO NOT USE/i.test(fm.description)) warnings.push(`${where}: description has no "DO NOT USE FOR" boundary`);
  }
  if (lines.length > 500) warnings.push(`${where}: ${lines.length} lines (> 500), move detail to references/`);

  // Scan SKILL.md and every markdown file in the skill for links, absolute paths, slash commands.
  const mdFiles = [skillFile, ...listFiles(dir).filter((f) => f.endsWith(".md") && f !== skillFile)];
  for (const file of mdFiles) {
    const rel = path.relative(root, file).replace(/\\/g, "/");
    const body = fs.readFileSync(file, "utf-8");
    let fence = 0; // length of the open code fence (0 = outside); links and paths inside code samples are not checked
    body.split(/\r?\n/).forEach((line, idx) => {
      const f = line.match(/^\s*(`{3,}|~{3,})/);
      if (f) {
        if (!fence) fence = f[1].length;
        else if (f[1].length >= fence && line.trim() === f[1]) fence = 0;
        return;
      }
      if (fence) return;
      for (const m of line.matchAll(LINK_RE)) {
        const target = m[1].split("#")[0];
        if (!target || /^[a-z]+:/i.test(target)) continue;
        if (!fs.existsSync(path.resolve(path.dirname(file), target))) {
          errors.push(`${rel}:${idx + 1}: broken link ${m[1]}`);
        }
      }
      for (const m of line.matchAll(ABS_RE)) {
        if (/^[A-Za-z]:[\\/]/.test(m[1]) && /<|example|path\\to/i.test(line)) continue;
        errors.push(`${rel}:${idx + 1}: absolute path ${m[1]}`);
      }
      for (const m of line.matchAll(SLASH_RE)) {
        warnings.push(`${rel}:${idx + 1}: slash-command reference /${m[2]} (use the plain skill name)`);
      }
    });
    if (file.endsWith(path.join("references", "learned.md"))) {
      const count = (body.match(/\*\*Status:\*\*\s*new/gi) || []).length;
      if (count) pending.push(`${skill}: ${count}`);
    }
  }

  // Every extra file must be linked (by relative path) from SKILL.md.
  for (const d of EXTRA_DIRS) {
    for (const f of listFiles(path.join(dir, d))) {
      const relToSkill = path.relative(dir, f).replace(/\\/g, "/");
      if (!text.includes(relToSkill)) warnings.push(`${where}: ${relToSkill} not linked from SKILL.md`);
    }
  }
  if (!fs.existsSync(path.join(dir, "references", "learned.md"))) {
    warnings.push(`${where}: no references/learned.md (learning loop target)`);
  }
}

console.log("===============================================================================");
console.log(` SKILL-SET HEALTH CHECK: ${skills.length} skills in ${path.basename(root)}/`);
console.log("===============================================================================");
for (const e of errors) console.log(`❌ ${e}`);
for (const w of warnings) console.log(`⚠️  ${w}`);
console.log(`\nPending learned notes (Status: new): ${pending.length ? pending.join(", ") : "none"}`);
console.log(`Result: ${errors.length} error(s), ${warnings.length} warning(s) → ${errors.length ? "FAIL" : "PASS"}`);
process.exit(errors.length ? 1 : 0);
