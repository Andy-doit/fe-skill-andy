#!/usr/bin/env node
/**
 * Andy Routing Eval Suite
 * 
 * Kiểm tra khả năng định tuyến (Routing Accuracy) của Andy dựa trên:
 * - Suite A: 56 English Cross-Domain Boundary Test Cases (Adversarial Ambiguity Benchmark)
 * - Suite B: 44 Vietnamese Conversational Test Cases (Real-World Developer Phrasings)
 *
 * Usage:
 *   node andy-evals.mjs             # Run both suites
 *   node andy-evals.mjs --suite=a   # Run Suite A only
 *   node andy-evals.mjs --suite=b   # Run Suite B only
 */

import { readFileSync } from 'fs';

const dispatcher = readFileSync('skill-dispatcher.md', 'utf-8');

// Parse rules from skill-dispatcher table
const rules = [];
for (const line of dispatcher.split('\n')) {
  const match = line.match(/\|\s*([^|]+)\|\s*([^|]+)\|\s*\*\*(fe-[a-z0-9]+)\*\*\s*\|\s*([^|]+)\|/);
  if (match) {
    const desc = match[1].trim().toLowerCase();
    const rawSignals = match[2].trim();
    const skill = match[3].trim();
    const signals = [];
    const sigRegex = /"([^"]+)"/g;
    let sm;
    while ((sm = sigRegex.exec(rawSignals)) !== null) {
      signals.push(sm[1].toLowerCase());
    }
    rules.push({ skill, desc, signals });
  }
}

// Stop words to prevent diluting signal weights
const STOP_WORDS = new Set([
  'này', 'cho', 'của', 'trong', 'được', 'không', 'với', 'khi', 'sau', 'ở', 'đây', 'có', 'thể', 'vào', 'ra', 'qua', 'bị', 'là', 'gì',
  'the', 'and', 'this', 'that', 'with', 'for', 'from', 'our', 'when', 'does', 'can', 'are', 'what', 'how', 'have', 'been', 'which'
]);

function route(prompt) {
  const lower = prompt.toLowerCase();
  const words = lower.split(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]+/).filter(w => w.length > 0);
  const scores = {};

  for (const rule of rules) {
    let score = 0;

    // 1. Exact phrase matches in signals (highest weight: 5 points)
    for (const sig of rule.signals) {
      if (lower.includes(sig)) {
        score += 5;
      }
    }

    // 2. Exact phrase in description
    if (lower.includes(rule.desc)) {
      score += 4;
    }

    // 3. Token matches
    for (const word of words) {
      if (STOP_WORDS.has(word)) continue;
      if (word.length >= 3) {
        for (const sig of rule.signals) {
          const sigWords = sig.split(/\s+/);
          if (sigWords.includes(word)) {
            score += 2;
          }
        }
        if (rule.desc.includes(word)) {
          score += 1;
        }
      }
    }

    if (score > 0) {
      scores[rule.skill] = score;
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return { topSkill: sorted[0]?.[0] || 'none', scores };
}

// ============================================================
// SUITE A: 56 English Cross-Domain Boundary Test Cases (R01–R56)
// Designed to test ambiguous/adversarial cross-domain boundaries
// ============================================================
const SUITE_A = [
  ['R01', 'Scroll feels laggy and GSAP animations stutter on mobile.', 'fe-motion', 'motion vs perf'],
  ['R02', 'The page takes 4.5 s to load and LCP is 3.8 s on 4G.', 'fe-perf', 'load perf'],
  ['R03', 'Is our frosted header text readable over the white cards when scrolling?', 'fe-contrast', 'contrast vs a11y'],
  ['R04', 'Blind users can\'t use our modal with Tab and a screen reader.', 'fe-a11y', 'a11y vs contrast'],
  ['R05', 'Pricing cards have different heights because plan 2 has more bullets.', 'fe-layout', 'layout vs skel'],
  ['R06', 'The pricing section shifts the page down while data loads.', 'fe-skel', 'loading CLS vs perf CLS'],
  ['R07', 'Our CLS in Search Console is 0.31 on mobile; find the causes.', 'fe-perf', 'perf CLS vs skel'],
  ['R08', 'Clean up this 400-line component with mixed state and inline styles.', 'fe-clean', 'refactor vs author'],
  ['R09', 'Create a new OrderSummaryCard block and use it in Checkout.', 'fe-code', 'author vs refactor'],
  ['R10', 'Propose 3 layouts for our comparison table with mockups.', 'fe-ux', 'brainstorm mode'],
  ['R11', 'Numbers in the live dashboard jump sideways every second.', 'fe-ux', 'tabular-nums vs i18n'],
  ['R12', 'Format VND as 250.000 ₫ and check vi.json has all en.json keys.', 'fe-i18n', 'i18n vs ux'],
  ['R13', 'Make sure our forms don\'t leak API keys or allow script injection.', 'fe-sec', 'security'],
  ['R14', 'Cancel the old search request when the user types again.', 'fe-data', 'data vs perf'],
  ['R15', 'Survey this new repo and tell me the stack.', 'fe-recon', 'recon vs clean'],
  ['R16', 'Run lint, types and Playwright before I open the PR.', 'fe-test', 'test vs ship'],
  ['R17', 'Which skill should I use to make the site faster and prettier?', 'fe-andy', 'router'],
  ['R18', 'Remember this fix for next time: next/image needs sizes for the hero.', 'fe-learn', 'capture lesson'],
  ['R19', 'Promote the learned notes into the skills.', 'fe-learn', 'promotion'],
  ['R29', 'Collect what we learned in this project and update the skill set — show me the plan first.', 'fe-learn', 'collect & check'],
  ['R30', 'We keep building charts; create a new skill for data visualization.', 'fe-learn', 'new skill'],
  ['R20', 'Set up a release checklist and Sentry for the app.', 'fe-ship', 'ship vs test'],
  ['R21', 'Add a sitemap and canonical tags.', 'fe-ship', 'SEO owner'],
  ['R22', 'Our refresh token logic logs users out randomly.', 'fe-sec', 'frontend auth flow'],
  ['R23', 'Add dark mode with a system option.', 'fe-layout', 'theming owner'],
  ['R24', 'Write the error and empty-state text for the invoices page.', 'fe-ux', 'UX writing'],
  ['R25', 'The memoized list still re-renders on every keystroke — profiler shows 120 ms commits.', 'fe-perf', 'measured re-renders vs fe-clean'],
  ['R26', 'WebSocket disconnects and the ticker freezes.', 'fe-data', 'realtime'],
  ['R27', 'Add unit and component tests for the signup form.', 'fe-test', 'writing tests vs fe-code'],
  ['R28', 'Hydration error: text content does not match server.', 'fe-perf', 'Next.js hydration'],
  ['R31', 'Users still see the old version after we deploy; we have a service worker.', 'fe-pwa', 'SW update vs fe-ship'],
  ['R32', 'Inspectors need to fill forms offline and sync when back online.', 'fe-pwa', 'durable offline vs fe-data'],
  ['R33', 'The search results come back out of order when offline then online.', 'fe-data', 'in-tab races vs fe-pwa'],
  ['R34', 'Four teams want to deploy their parts of the storefront independently.', 'fe-mfe', 'MFE vs fe-code'],
  ['R35', 'After loading the checkout remote we get \'Invalid hook call\'.', 'fe-mfe', 'shared singletons vs fe-perf'],
  ['R36', 'A blog says to wrap every callback in useCallback in React 19 — is that still right?', 'fe-review', 'knowledge review vs fe-perf'],
  ['R37', 'Before we adopt this state library, check it against current best practice.', 'fe-review', 'adoption review vs fe-code'],
  ['R38', 'Someone found our original TypeScript by opening a .js.map URL on the live site.', 'fe-sec', 'source-map leakage (fe-ship owns pipeline)'],
  ['R39', 'We package the dashboard with Electron; the preload exposes ipcRenderer on window — is that OK?', 'fe-sec', 'desktop hardening vs fe-code'],
  ['R40', 'We hide the Delete button for non-admins, so the API doesn\'t need a check, right?', 'fe-sec', 'UI is only affordance vs fe-data'],
  ['R41', 'Add a CI step that fails the build if a source map ends up in dist/.', 'fe-ship', 'pipeline gate vs fe-sec'],
  ['R42', 'Generate a typed client from our OpenAPI spec and wire it into TanStack Query.', 'fe-data', 'API contracts vs fe-code'],
  ['R43', 'Set up login with the company\'s OIDC provider using PKCE.', 'fe-sec', 'login protocol vs fe-data'],
  ['R44', 'A third-party stylesheet keeps overriding our Tailwind utilities.', 'fe-layout', 'cascade layers vs fe-clean'],
  ['R45', 'Animate the move from the product grid to the product page.', 'fe-motion', 'View Transitions vs fe-perf'],
  ['R46', 'Open a product in a modal from the grid, but the URL must be shareable and survive refresh.', 'fe-code', 'intercepting routes vs fe-ux'],
  ['R47', 'Write an ADR for moving from Redux to TanStack Query and give the team a PR template.', 'fe-andy', 'engineering workflow vs fe-review'],
  ['R48', 'Deadlines show one day early for users in New York.', 'fe-i18n', 'time zones vs fe-data'],
  ['R49', 'Let users upload 2 GB videos with progress and resume after a dropped connection.', 'fe-code', 'file handling vs fe-data'],
  ['R50', 'Add Storybook stories and interaction tests for the Button and Card blocks.', 'fe-code', 'component docs vs fe-test'],
  ['R51', 'Split the repo into apps/ and packages/ and publish the ui package internally.', 'fe-ship', 'monorepo vs fe-clean'],
  ['R52', 'Run an A/B test on the new checkout button without any layout flicker.', 'fe-ship', 'experimentation vs fe-ux'],
  ['R53', 'Checkout has been failing since the deploy 20 minutes ago — what do we do first?', 'fe-ship', 'incident response vs fe-sec'],
  ['R54', 'Add a revenue-per-day chart to the dashboard with dark mode support.', 'fe-viz', 'chart vs fe-code'],
  ['R55', 'Our scatter plot with 50,000 points freezes on hover.', 'fe-viz', 'chart rendering tech vs fe-motion'],
  ['R56', 'The pie chart legend is colour-only and axe flags it.', 'fe-viz', 'chart a11y vs fe-a11y / fe-contrast']
];

// ============================================================
// SUITE B: 44 Vietnamese Conversational Test Cases (V01–V44)
// Real-world developer phrasings and terminology in Vietnamese
// ============================================================
const SUITE_B = [
  ['V01', 'trang này tải chậm quá LCP 3.8s', 'fe-perf', 'Slow page → fe-perf'],
  ['V02', 'bundle size quá lớn treeshaking không ăn', 'fe-perf', 'Bundle size → fe-perf'],
  ['V03', 'có re-render vô tội vạ', 'fe-perf', 'Re-render → fe-perf'],
  ['V04', 'spacing bị sai padding lộn xộn', 'fe-layout', 'Spacing issue → fe-layout'],
  ['V05', 'dark mode bị vỡ trên Safari', 'fe-layout', 'Dark mode → fe-layout'],
  ['V06', 'card height không đều nhau', 'fe-layout', 'Layout alignment → fe-layout'],
  ['V07', 'focus trap bị mất sau khi đóng modal', 'fe-a11y', 'Focus trap → fe-a11y'],
  ['V08', 'screen reader đọc sai thứ tự', 'fe-a11y', 'Screen reader → fe-a11y'],
  ['V09', 'tab vào form không được', 'fe-a11y', 'Keyboard nav → fe-a11y'],
  ['V10', 'key API bị lộ trong bundle', 'fe-sec', 'Secret leakage → fe-sec'],
  ['V11', 'XSS có thể xảy ra ở đây không', 'fe-sec', 'XSS risk → fe-sec'],
  ['V12', 'source map đang public trên production', 'fe-sec', 'Source map → fe-sec'],
  ['V13', 'tạo một card component mới cho block', 'fe-code', 'New component → fe-code'],
  ['V14', 'viết hook cho pagination', 'fe-code', 'New hook → fe-code'],
  ['V15', 'scaffold trang dashboard mới', 'fe-code', 'New page → fe-code'],
  ['V16', 'component này quá lớn cần refactor', 'fe-clean', 'God component → fe-clean'],
  ['V17', 'dọn tech debt trong folder features', 'fe-clean', 'Tech debt → fe-clean'],
  ['V18', 'có dead code và dead import cần xóa', 'fe-clean', 'Dead code → fe-clean'],
  ['V19', 'fetch bị duplicate request', 'fe-data', 'Duplicate fetch → fe-data'],
  ['V20', 'cần cancel request khi unmount', 'fe-data', 'Request cancel → fe-data'],
  ['V21', 'waterfall API request quá chậm', 'fe-data', 'Waterfall → fe-data'],
  ['V22', 'key dịch bị thiếu cho tiếng Nhật', 'fe-i18n', 'Missing translation → fe-i18n'],
  ['V23', 'format tiền tệ theo locale chưa đúng', 'fe-i18n', 'Currency format → fe-i18n'],
  ['V24', 'thêm skeleton loading state cho list', 'fe-skel', 'Skeleton → fe-skel'],
  ['V25', 'bị layout shift khi data load', 'fe-skel', 'CLS on load → fe-skel'],
  ['V26', 'animation GSAP bị giật khi scroll', 'fe-motion', 'GSAP jank → fe-motion'],
  ['V27', 'ScrollTrigger bị leak memory', 'fe-motion', 'ScrollTrigger → fe-motion'],
  ['V28', 'màu text này đủ tương phản không', 'fe-contrast', 'Contrast check → fe-contrast'],
  ['V29', 'brainstorm layout mới cho trang checkout', 'fe-ux', 'Layout brainstorm → fe-ux'],
  ['V30', 'copy lỗi của form này chưa rõ', 'fe-ux', 'Error copy → fe-ux'],
  ['V31', 'thêm biểu đồ doanh thu theo tháng', 'fe-viz', 'Chart → fe-viz'],
  ['V32', 'chart đang bị slow với 10k data points', 'fe-viz', 'Chart perf → fe-viz'],
  ['V33', 'chuẩn bị release checklist', 'fe-ship', 'Release → fe-ship'],
  ['V34', 'sitemap chưa có hreflang', 'fe-ship', 'SEO/sitemap → fe-ship'],
  ['V35', 'app cần hoạt động offline', 'fe-pwa', 'Offline → fe-pwa'],
  ['V36', 'user thấy bản cũ sau khi deploy', 'fe-pwa', 'Stale SW → fe-pwa'],
  ['V37', 'cần tách frontend ra cho 2 team deploy độc lập', 'fe-mfe', 'MFE → fe-mfe'],
  ['V38', 'remote module không load được', 'fe-mfe', 'Remote fail → fe-mfe'],
  ['V39', 'viết E2E test cho flow checkout', 'fe-test', 'E2E test → fe-test'],
  ['V40', 'chạy accessibility axe trước khi PR', 'fe-test', 'Axe test → fe-test'],
  ['V41', 'pattern này còn best practice không', 'fe-review', 'Best practice check → fe-review'],
  ['V42', 'repo này dùng gì mình chưa biết', 'fe-recon', 'Unknown repo → fe-recon'],
  ['V43', 'nhớ pattern này cho lần sau', 'fe-learn', 'Learn pattern → fe-learn'],
  ['V44', 'cập nhật skill set từ session này', 'fe-learn', 'Update skills → fe-learn']
];

function runSuite(name, suite) {
  let p = 0;
  const fails = [];
  console.log('='.repeat(70));
  console.log(` ${name.toUpperCase()}`);
  console.log('='.repeat(70));

  for (const [id, prompt, expected, desc] of suite) {
    const { topSkill, scores } = route(prompt);
    if (topSkill === expected) {
      p++;
      console.log(`  ✅ PASS  [${id}] ${desc || prompt.slice(0, 45)}`);
    } else {
      fails.push({ id, prompt, expected, got: topSkill, scores, desc });
      console.log(`  ❌ FAIL  [${id}] ${desc || prompt.slice(0, 45)}`);
      console.log(`         Expected: ${expected}`);
      console.log(`         Got:      ${topSkill} (scores: ${JSON.stringify(scores)})`);
    }
  }

  const pct = Math.round((p / suite.length) * 100);
  console.log('-'.repeat(70));
  console.log(` RESULT: ${p}/${suite.length} passed (${pct}%)`);
  return { p, total: suite.length, pct, fails };
}

const args = process.argv.slice(2);
const suiteArg = args.find(a => a.startsWith('--suite='))?.split('=')[1]?.toLowerCase();

let resA = null;
let resB = null;

if (!suiteArg || suiteArg === 'a') {
  resA = runSuite('Suite A: 56 English Cross-Domain Boundary Benchmark', SUITE_A);
}
if (!suiteArg || suiteArg === 'b') {
  resB = runSuite('Suite B: 44 Vietnamese Conversational Benchmark', SUITE_B);
}

if (!suiteArg) {
  console.log();
  console.log('='.repeat(70));
  console.log(' OVERALL BENCHMARK COMPARISON');
  console.log('='.repeat(70));
  console.log(`  • Suite A (56 Adversarial English Boundaries): ${resA.p}/${resA.total} (${resA.pct}%) [Keyword Heuristic Baseline]`);
  console.log(`  • Suite B (44 Vietnamese Real-World Prompts):    ${resB.p}/${resB.total} (${resB.pct}%) [Conversational Dispatch]`);
  console.log('='.repeat(70));
}
