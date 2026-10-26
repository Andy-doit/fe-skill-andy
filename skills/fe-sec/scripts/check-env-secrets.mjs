/**
 * Env secret quality check for fe-sec (zero dependencies, Node 18+).
 * Reads an env file and reports secret-looking variables that are weak. Reports variable NAMES only — never values.
 * Flags:
 *   - value shorter than 32 characters
 *   - low Shannon entropy (< 3.0 bits/char) or letters-only values (dictionary-like)
 *   - default/common values (password, changeme, admin, secret, 123456, ...)
 *   - secret-looking name with a public prefix (NEXT_PUBLIC_, VITE_, ...), excluding *PUBLISHABLE* / *PUBLIC_KEY*
 *   - empty value
 * Heuristics: a flagged variable is a review item, not proof of a weak secret (e.g. a numeric port named *_KEY).
 *
 * Usage: node check-env-secrets.mjs [envFile]   (default: .env.production)
 * Exit code: 1 if any variable is flagged, else 0.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const file = path.resolve(process.cwd(), process.argv[2] ?? ".env.production");
if (!fs.existsSync(file)) {
  console.error(`[Error] env file not found: ${file}`);
  process.exit(1);
}

const SECRET_NAME = /(SECRET|PRIVATE|KEY|TOKEN|PASSWORD|PASSWD|PASS\b|SALT|SIGNING|JWT|CREDENTIAL|AUTH)/i;
const NOT_SECRET_NAME = /(PUBLISHABLE|PUBLIC_KEY|KEY_ID|_URL|_HOST|(^|_)PORT(_|$)|_NAME|_PATH|KEYS?_DIR|CACHE_KEY_PREFIX|_TTL|_TIMEOUT|_LENGTH)/i;
const PUBLIC_PREFIX = /^(NEXT_PUBLIC|VITE|PUBLIC|REACT_APP|EXPO_PUBLIC|NUXT_PUBLIC)_/;
const WEAK_VALUES = new Set([
  "password", "passw0rd", "password123", "admin", "administrator", "root", "changeme", "change-me", "secret",
  "mysecret", "supersecret", "123456", "12345678", "123456789", "qwerty", "letmein", "test", "testing", "default",
  "example", "placeholder", "todo", "xxx", "null", "undefined", "none",
]);
const MIN_LENGTH = 32;
const MIN_ENTROPY = 3.0;

function entropy(s) {
  const freq = new Map();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  let h = 0;
  for (const n of freq.values()) {
    const p = n / s.length;
    h -= p * Math.log2(p);
  }
  return h;
}

const findings = [];
let checked = 0;

for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (!m) continue;
  const name = m[1];
  if (!SECRET_NAME.test(name) || NOT_SECRET_NAME.test(name)) continue;
  checked++;
  const value = m[2].trim().replace(/^["']|["']$/g, "").replace(/\s+#.*$/, "");
  const problems = [];

  if (PUBLIC_PREFIX.test(name)) problems.push("public prefix on a secret-looking name (confirm it is meant to be public)");
  if (value.length === 0) problems.push("empty value");
  else {
    if (value.length < MIN_LENGTH) problems.push(`length ${value.length} < ${MIN_LENGTH}`);
    if (WEAK_VALUES.has(value.toLowerCase())) problems.push("default/common value");
    const h = entropy(value);
    if (h < MIN_ENTROPY) problems.push(`low entropy (${h.toFixed(2)} bits/char < ${MIN_ENTROPY})`);
    if (/^[a-z]+$/i.test(value) && value.length < 48) problems.push("letters-only value (dictionary-like)");
    if (/^\$\{?[A-Z_]+\}?$/.test(value)) problems.length = 0; // reference to another variable; skip
  }
  if (problems.length) findings.push(`${name}: ${problems.join("; ")}`);
}

console.log("===============================================================================");
console.log(` ENV SECRET QUALITY: ${path.relative(process.cwd(), file) || file} (${checked} secret-looking variable(s))`);
console.log("===============================================================================");
for (const f of findings) console.log(`❌ ${f}`);
console.log(`\nResult: ${findings.length} flagged → ${findings.length ? "FAIL" : "PASS"}`);
process.exit(findings.length ? 1 : 0);
