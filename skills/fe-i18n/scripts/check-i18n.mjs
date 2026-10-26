/**
 * i18n Dictionary Parity Check
 * Compares a source JSON dictionary with one or more target dictionaries and reports per target:
 * - missing keys, orphan keys, empty values
 * - placeholder mismatches ({name}, {count}, ICU argument names)
 * Arrays are compared by index (key.0, key.1, ...).
 * Pure Node.js built-ins (zero external dependencies).
 *
 * Usage: node check-i18n.mjs <source.json> <target.json> [<target2.json> ...]
 * Default (no args): messages/en.json messages/vi.json relative to the current folder.
 * Exit code: 1 on any problem or unreadable file; else 0.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function flatten(obj, prefix = "", out = {}) {
  const entries = Array.isArray(obj) ? obj.map((v, i) => [String(i), v]) : Object.entries(obj);
  for (const [k, v] of entries) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object") flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

// Top-level argument names: "{name}", "{count, plural, ...}" → name, count. Ignores "#" and nested branch text.
function placeholders(value) {
  if (typeof value !== "string") return [];
  const names = new Set();
  let depth = 0;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "{") {
      if (depth === 0) {
        const m = value.slice(i + 1).match(/^\s*([A-Za-z_][\w]*)\s*[,}]/);
        if (m) names.add(m[1]);
      }
      depth++;
    } else if (ch === "}") depth = Math.max(0, depth - 1);
  }
  return [...names].sort();
}

function load(file) {
  const p = path.resolve(process.cwd(), file);
  if (!fs.existsSync(p)) {
    console.error(`[Error] File not found: ${p}`);
    process.exit(1);
  }
  try {
    return { p, data: flatten(JSON.parse(fs.readFileSync(p, "utf-8"))) };
  } catch (e) {
    console.error(`[Error] Invalid JSON in ${p}: ${e.message}`);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const files = args.length >= 2 ? args : ["messages/en.json", "messages/vi.json"];
const source = load(files[0]);
let allPass = true;

console.log("===============================================================================");
console.log(` i18n PARITY: source ${path.basename(source.p)} (${Object.keys(source.data).length} keys)`);
console.log("===============================================================================");

for (const file of files.slice(1)) {
  const target = load(file);
  const name = path.basename(target.p);
  const missing = [];
  const empty = [];
  const mismatch = [];
  for (const [k, v] of Object.entries(source.data)) {
    if (!(k in target.data)) {
      missing.push(k);
      continue;
    }
    const tv = target.data[k];
    if (typeof tv === "string" && tv.trim() === "") empty.push(k);
    const a = placeholders(v).join(",");
    const b = placeholders(tv).join(",");
    if (a !== b) mismatch.push(`${k}  (source {${a}} vs target {${b}})`);
  }
  const orphan = Object.keys(target.data).filter((k) => !(k in source.data));
  const pass = !missing.length && !empty.length && !mismatch.length && !orphan.length;
  if (!pass) allPass = false;

  console.log(`\n--- ${name}: ${Object.keys(target.data).length} keys → ${pass ? "✓ PASS" : "✗ FAIL"}`);
  const section = (title, list) => {
    if (!list.length) return;
    console.log(`${title} (${list.length}):`);
    list.forEach((k) => console.log(`   - ${k}`));
  };
  section("❌ Missing", missing);
  section("⚠️ Orphan/extra", orphan);
  section("⚠️ Empty", empty);
  section("⚠️ Placeholder mismatch", mismatch);
}

console.log("\n===============================================================================");
console.log(`Result: ${allPass ? "PASS" : "FAIL"}`);
process.exit(allPass ? 0 : 1);
