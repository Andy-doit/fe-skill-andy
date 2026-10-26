/**
 * Bundle Size Check: sums JS and CSS in a build output folder (raw + gzip) and compares with a budget.
 * Pure Node.js built-ins (zero external dependencies).
 *
 * Usage:
 *   node check-bundle-size.mjs <build-dir> [--budget <KB gzip total JS>] [--top <n>]
 * Examples:
 *   node check-bundle-size.mjs ../../my-app/.next/static --budget 400
 *   node check-bundle-size.mjs ./dist --budget 250 --top 15
 * Exit code: 1 if the build dir is missing or gzip JS total exceeds the budget; else 0.
 * Note: totals cover every file in the folder, not one route; use the framework's per-route output for route budgets.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import zlib from "node:zlib";

const args = process.argv.slice(2);
const dirArg = args.find((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
const flag = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
};
const budgetKb = flag("--budget") ? Number(flag("--budget")) : undefined;
const top = flag("--top") ? Number(flag("--top")) : 10;

if (!dirArg) {
  console.error("[Error] Usage: node check-bundle-size.mjs <build-dir> [--budget <KB>] [--top <n>]");
  process.exit(1);
}
const dir = path.resolve(process.cwd(), dirArg);
if (!fs.existsSync(dir)) {
  console.error(`[Error] Build folder not found: ${dir} (run the project's build first)`);
  process.exit(1);
}

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const files = walk(dir)
  .filter((f) => /\.(m?js|css)$/.test(f) && !f.endsWith(".map"))
  .map((f) => {
    const buf = fs.readFileSync(f);
    return {
      file: path.relative(dir, f).replace(/\\/g, "/"),
      type: f.endsWith(".css") ? "css" : "js",
      raw: buf.length,
      gzip: zlib.gzipSync(buf, { level: 9 }).length,
    };
  });

const kb = (n) => (n / 1024).toFixed(1);
const sum = (type, key) => files.filter((f) => f.type === type).reduce((a, f) => a + f[key], 0);
const jsGzip = sum("js", "gzip");

console.log("===============================================================================");
console.log(` BUNDLE SIZE: ${path.basename(dir)}/  (${files.length} JS/CSS files)`);
console.log("===============================================================================");
console.log(`JS : ${kb(sum("js", "raw"))} KB raw | ${kb(jsGzip)} KB gzip`);
console.log(`CSS: ${kb(sum("css", "raw"))} KB raw | ${kb(sum("css", "gzip"))} KB gzip\n`);
console.log(`Top ${top} files by gzip size:`);
console.log("| gzip KB | raw KB | file |");
console.log("|---|---|---|");
for (const f of [...files].sort((a, b) => b.gzip - a.gzip).slice(0, top)) {
  console.log(`| ${kb(f.gzip)} | ${kb(f.raw)} | ${f.file} |`);
}

let pass = true;
if (budgetKb !== undefined) {
  pass = jsGzip / 1024 <= budgetKb;
  console.log(`\nBudget (JS gzip total): ${budgetKb} KB → ${pass ? "✓ PASS" : "✗ FAIL"} (${kb(jsGzip)} KB)`);
} else {
  console.log("\nNo --budget given: report only.");
}
process.exit(pass ? 0 : 1);
