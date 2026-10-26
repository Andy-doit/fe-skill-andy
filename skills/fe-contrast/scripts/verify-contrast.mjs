/**
 * WCAG Contrast Verification (pairs mode + translucent-header scroll mode).
 * Pure Node.js built-ins (zero external dependencies).
 *
 * Usage:
 *   node verify-contrast.mjs --config <path>        config: see ../references/config-schema.md
 *   node verify-contrast.mjs --fg "#333" --bg "#fff" [--size large] [--level AAA]
 * Options:
 *   --level AA|AAA   override the config level (default AA)
 * Exit code: 1 if any check fails or the input is invalid; else 0.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
};

function fail(msg) {
  console.error(`[Error] ${msg}`);
  process.exit(1);
}

function parseColor(c, where) {
  if (c && typeof c === "object" && ["r", "g", "b"].every((k) => typeof c[k] === "number")) return c;
  if (typeof c === "string") {
    let h = c.trim().replace(/^#/, "");
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    if (/^[0-9a-fA-F]{6}$/.test(h)) {
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
    }
  }
  fail(`Invalid colour at ${where}: ${JSON.stringify(c)} (use "#RRGGBB" or {r,g,b})`);
}

const toHex = ({ r, g, b }) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
const lin = (v) => {
  const n = v / 255;
  return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
};
const luminance = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const composite = (fg, bg, alpha) => ({
  r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
  g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
  b: Math.round(fg.b * alpha + bg.b * (1 - alpha)),
});

// WCAG 2.x thresholds (1.4.3 AA, 1.4.6 AAA, 1.4.11 non-text).
function required(size, level) {
  if (size === "ui") return 3;
  if (size === "large") return level === "AAA" ? 4.5 : 3;
  return level === "AAA" ? 7 : 4.5;
}

let config;
const configArg = flag("--config");
if (configArg) {
  const p = path.resolve(process.cwd(), configArg);
  if (!fs.existsSync(p)) fail(`Configuration file not found: ${p}`);
  try {
    config = JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (e) {
    fail(`Invalid JSON in ${p}: ${e.message}`);
  }
} else if (flag("--fg") && flag("--bg")) {
  config = { title: "Single pair", pairs: [{ name: "pair", fg: flag("--fg"), bg: flag("--bg"), size: flag("--size") || "normal" }] };
} else {
  fail('Usage: --config <file>  or  --fg "#RRGGBB" --bg "#RRGGBB" [--size normal|large|ui] [--level AA|AAA]');
}

const level = (flag("--level") || config.level || "AA").toUpperCase();
if (!["AA", "AAA"].includes(level)) fail(`Invalid level "${level}" (AA or AAA)`);

const rows = [];

// Mode 1: explicit pairs.
for (const [i, p] of (config.pairs || []).entries()) {
  const fg = parseColor(p.fg, `pairs[${i}].fg`);
  let bg = parseColor(p.bg, `pairs[${i}].bg`);
  if (p.bgAlpha !== undefined) bg = composite(bg, parseColor(p.under, `pairs[${i}].under`), p.bgAlpha);
  const size = p.size || "normal";
  const r = ratio(fg, bg);
  rows.push({ context: p.name || `pair ${i + 1}`, fg: toHex(fg), bg: toHex(bg), size, ratio: r, need: required(size, level) });
}

// Mode 2: translucent header over scroll-ranged sections.
if (config.header) {
  const h = config.header;
  const surface = parseColor(h.surface, "header.surface");
  if (!h.alphas || typeof h.alphas.top !== "number" || typeof h.alphas.scrolled !== "number") {
    fail("header.alphas.top and header.alphas.scrolled must be numbers between 0 and 1");
  }
  if (!Array.isArray(h.sections) || !h.sections.length) fail("header.sections must be a non-empty array");
  const texts = Object.entries(h.texts || {}).map(([name, c]) => [name, parseColor(c, `header.texts.${name}`)]);
  if (!texts.length) fail("header.texts must define at least one text colour");
  const { min = 0, max = 3000, step = 100, scrolledThreshold = 24 } = h.scroll || {};
  for (let y = min; y <= max; y += step) {
    const state = y > scrolledThreshold ? "scrolled" : "top";
    const section = h.sections.find((s) => y >= s.range[0] && y <= s.range[1]);
    if (!section) continue;
    const bg = composite(surface, parseColor(section.color, `section ${section.name}`), h.alphas[state]);
    for (const [name, fg] of texts) {
      rows.push({ context: `${y}px ${state} · ${section.name} · ${name}`, fg: toHex(fg), bg: toHex(bg), size: h.size || "normal", ratio: ratio(fg, bg), need: required(h.size || "normal", level) });
    }
  }
}

if (!rows.length) fail('Config has no checks: add "pairs" and/or "header" (see references/config-schema.md)');

console.log("===============================================================================");
console.log(` ${config.title || "CONTRAST REPORT"} — level ${level}`);
console.log("===============================================================================");
console.log("| Context | FG | BG | Size | Ratio | Needs | Result |");
console.log("|---|---|---|---|---|---|---|");
let failed = 0;
for (const r of rows) {
  const ok = r.ratio >= r.need;
  if (!ok) failed++;
  console.log(`| ${r.context} | ${r.fg} | ${r.bg} | ${r.size} | ${r.ratio.toFixed(2)}:1 | ${r.need}:1 | ${ok ? "✓ PASS" : "✗ FAIL"} |`);
}
const worst = rows.reduce((a, b) => (b.ratio - b.need < a.ratio - a.need ? b : a));
console.log("-------------------------------------------------------------------------------");
console.log(`Checks: ${rows.length} | Passed: ${rows.length - failed} | Failed: ${failed}`);
console.log(`Lowest margin: ${worst.ratio.toFixed(2)}:1 (needs ${worst.need}:1) at "${worst.context}"`);
console.log(`Result: ${failed ? "FAIL" : "PASS"}`);
process.exit(failed ? 1 : 0);
