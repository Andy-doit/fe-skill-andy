/**
 * Automated Verification Script: i18n Dictionary Parity & Missing Key Scanner
 * Compares two JSON dictionaries (e.g. en.json vs vi.json) recursively and reports:
 * - Missing keys in target
 * - Extra/Orphan keys in target
 * - Empty string values
 * Pure Node.js built-in (Zero external dependencies).
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function getFlatKeys(obj, prefix = "") {
  let keys = {};
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(keys, getFlatKeys(v, fullKey));
    } else {
      keys[fullKey] = v;
    }
  }
  return keys;
}

const args = process.argv.slice(2);
let sourceFile = args[0] || "messages/en.json";
let targetFile = args[1] || "messages/vi.json";

sourceFile = path.resolve(process.cwd(), sourceFile);
targetFile = path.resolve(process.cwd(), targetFile);

if (!fs.existsSync(sourceFile) || !fs.existsSync(targetFile)) {
  console.error(`[Error] Dictionary file not found:`);
  console.error(`- Source: ${sourceFile} (${fs.existsSync(sourceFile) ? "FOUND" : "MISSING"})`);
  console.error(`- Target: ${targetFile} (${fs.existsSync(targetFile) ? "FOUND" : "MISSING"})`);
  process.exit(1);
}

const sourceData = JSON.parse(fs.readFileSync(sourceFile, "utf-8"));
const targetData = JSON.parse(fs.readFileSync(targetFile, "utf-8"));

const sourceKeys = getFlatKeys(sourceData);
const targetKeys = getFlatKeys(targetData);

const missingInTarget = [];
const orphanInTarget = [];
const emptyValues = [];

for (const [k, v] of Object.entries(sourceKeys)) {
  if (!(k in targetKeys)) {
    missingInTarget.push(k);
  } else if (typeof targetKeys[k] === "string" && targetKeys[k].trim() === "") {
    emptyValues.push(k);
  }
}

for (const k of Object.keys(targetKeys)) {
  if (!(k in sourceKeys)) {
    orphanInTarget.push(k);
  }
}

console.log("===============================================================================");
console.log(` i18n PARITY AUDIT: ${path.basename(sourceFile)} <--> ${path.basename(targetFile)}`);
console.log("===============================================================================\n");

console.log(`Total Keys in Source (${path.basename(sourceFile)}): ${Object.keys(sourceKeys).length}`);
console.log(`Total Keys in Target (${path.basename(targetFile)}): ${Object.keys(targetKeys).length}\n`);

let passed = true;

if (missingInTarget.length > 0) {
  passed = false;
  console.log(`❌ MISSING IN ${path.basename(targetFile)} (${missingInTarget.length} keys):`);
  missingInTarget.forEach((k) => console.log(`   - ${k}`));
  console.log("");
}

if (orphanInTarget.length > 0) {
  passed = false;
  console.log(`⚠️ ORPHAN/EXTRA IN ${path.basename(targetFile)} (${orphanInTarget.length} keys):`);
  orphanInTarget.forEach((k) => console.log(`   - ${k}`));
  console.log("");
}

if (emptyValues.length > 0) {
  passed = false;
  console.log(`⚠️ EMPTY TRANSLATIONS (${emptyValues.length} keys):`);
  emptyValues.forEach((k) => console.log(`   - ${k}`));
  console.log("");
}

if (passed) {
  console.log("✓ PASS: All translation keys are 100% synchronized and populated!");
} else {
  console.log("FAILED: Dictionaries are not in parity. Please resolve missing/orphan keys.");
}
console.log("===============================================================================\n");

process.exit(passed ? 0 : 1);
