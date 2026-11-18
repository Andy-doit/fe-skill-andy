#!/usr/bin/env node
/**
 * check-loosening.mjs — scans source files for banned loosening markers.
 *
 * Banned markers:
 *   - eslint-disable, stylelint-disable
 *   - @ts-ignore, @ts-nocheck, @ts-expect-error
 *   - // NOSONAR, // nosonar
 *   - xit, xdescribe, it.skip, test.skip, describe.skip
 *   - it.only, describe.only, test.only
 *   - || true patterns
 *
 * Usage:
 *   node skills/fe-andy/scripts/check-loosening.mjs [path]
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const TARGET_DIR = process.argv[2] || process.cwd();

const BANNED_PATTERNS = [
  { id: 'eslint-disable', regex: /eslint-disable(?:-next-line|-line)?\b/, label: 'ESLint suppression' },
  { id: 'stylelint-disable', regex: /stylelint-disable(?:-next-line|-line)?\b/, label: 'Stylelint suppression' },
  { id: 'ts-ignore', regex: /@ts-ignore\b/, label: 'TypeScript @ts-ignore' },
  { id: 'ts-nocheck', regex: /@ts-nocheck\b/, label: 'TypeScript @ts-nocheck' },
  { id: 'ts-expect-error', regex: /@ts-expect-error\b/, label: 'TypeScript @ts-expect-error' },
  { id: 'nosonar', regex: /\/\/\s*nosonar\b/i, label: 'Sonar suppression' },
  { id: 'skipped-test', regex: /\b(?:xit|xdescribe|(?:it|test|describe)\.skip)\s*\(/, label: 'Skipped test' },
  { id: 'focused-test', regex: /\b(?:it|test|describe)\.only\s*\(/, label: 'Focused test (.only)' },
  { id: 'or-true', regex: /\|\|\s*true\b/, label: 'Short-circuit || true' },
];

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'out',
  'coverage',
  '.turbo',
  '.cache',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.vue',
  '.svelte',
  '.css',
  '.scss',
]);

// Exclude this script itself or doc/fixture files that describe loosening
function isSelfOrExempt(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  if (normalized.includes('check-loosening.mjs')) return true;
  if (normalized.endsWith('.md')) return true; // documentation may mention markers
  if (normalized.includes('/fixtures/') || normalized.includes('/templates/')) return true;
  return false;
}

function scanDir(dir, findings) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return;
  }

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;

    const fullPath = join(dir, entry.name);
    const relPath = relative(TARGET_DIR, fullPath);

    if (entry.isDirectory()) {
      scanDir(fullPath, findings);
    } else if (entry.isFile()) {
      if (!ALLOWED_EXTENSIONS.has(extname(entry.name))) continue;
      if (isSelfOrExempt(relPath)) continue;

      let content;
      try {
        content = readFileSync(fullPath, 'utf8');
      } catch {
        continue;
      }

      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const pattern of BANNED_PATTERNS) {
          if (pattern.regex.test(line)) {
            findings.push({
              file: relPath.replace(/\\/g, '/'),
              line: i + 1,
              id: pattern.id,
              label: pattern.label,
              text: line.trim(),
            });
          }
        }
      }
    }
  }
}

console.log('===============================================================================');
console.log(' BANNED LOOSENING MARKERS SCAN');
console.log(` Target: ${TARGET_DIR}`);
console.log('===============================================================================\n');

const findings = [];
scanDir(TARGET_DIR, findings);

if (findings.length === 0) {
  console.log('Result: 0 loosening marker(s) found. All gates intact → PASS\n');
  process.exit(0);
} else {
  console.log(`Found ${findings.length} loosening marker(s):\n`);
  for (const f of findings) {
    console.log(`❌ ${f.file}:${f.line} [${f.id}] ${f.label}`);
    console.log(`   ${f.text}\n`);
  }
  console.log('Rule: Never leave suppression markers in code. If required, declare in policy/loosening.yaml.\n');
  process.exit(1);
}
