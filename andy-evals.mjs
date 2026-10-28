#!/usr/bin/env node
/**
 * Andy Routing Eval Suite
 * 
 * Kiểm tra xem skill-dispatcher.md có route đúng không
 * bằng cách so khớp keywords từ test cases với nội dung dispatcher.
 *
 * Usage: node andy-evals.mjs
 */

import { readFileSync } from 'fs';

const dispatcher = readFileSync('skill-dispatcher.md', 'utf-8');

// ============================================================
// TEST CASES: [input_phrase, expected_skill, description]
// Đây là bộ câu hỏi thực tế người dùng hay nói
// ============================================================
const TEST_CASES = [
  // Performance
  ['trang này tải chậm quá LCP 3.8s', 'fe-perf', 'Slow page → fe-perf'],
  ['bundle size quá lớn treeshaking không ăn', 'fe-perf', 'Bundle size → fe-perf'],
  ['có re-render vô tội vạ', 'fe-perf', 'Re-render → fe-perf'],

  // Layout
  ['spacing bị sai padding lộn xộn', 'fe-layout', 'Spacing issue → fe-layout'],
  ['dark mode bị vỡ trên Safari', 'fe-layout', 'Dark mode → fe-layout'],
  ['card height không đều nhau', 'fe-layout', 'Layout alignment → fe-layout'],

  // A11y
  ['focus trap bị mất sau khi đóng modal', 'fe-a11y', 'Focus trap → fe-a11y'],
  ['screen reader đọc sai thứ tự', 'fe-a11y', 'Screen reader → fe-a11y'],
  ['tab vào form không được', 'fe-a11y', 'Keyboard nav → fe-a11y'],

  // Security
  ['key API bị lộ trong bundle', 'fe-sec', 'Secret leakage → fe-sec'],
  ['XSS có thể xảy ra ở đây không', 'fe-sec', 'XSS risk → fe-sec'],
  ['source map đang public trên production', 'fe-sec', 'Source map → fe-sec'],

  // Code
  ['tạo một card component mới cho block', 'fe-code', 'New component → fe-code'],
  ['viết hook cho pagination', 'fe-code', 'New hook → fe-code'],
  ['scaffold trang dashboard mới', 'fe-code', 'New page → fe-code'],

  // Clean
  ['component này quá lớn cần refactor', 'fe-clean', 'God component → fe-clean'],
  ['dọn tech debt trong folder features', 'fe-clean', 'Tech debt → fe-clean'],
  ['có dead code và dead import cần xóa', 'fe-clean', 'Dead code → fe-clean'],

  // Data
  ['fetch bị duplicate request', 'fe-data', 'Duplicate fetch → fe-data'],
  ['cần cancel request khi unmount', 'fe-data', 'Request cancel → fe-data'],
  ['waterfall API request quá chậm', 'fe-data', 'Waterfall → fe-data'],

  // i18n
  ['key dịch bị thiếu cho tiếng Nhật', 'fe-i18n', 'Missing translation → fe-i18n'],
  ['format tiền tệ theo locale chưa đúng', 'fe-i18n', 'Currency format → fe-i18n'],

  // Skeleton
  ['thêm skeleton loading state cho list', 'fe-skel', 'Skeleton → fe-skel'],
  ['bị layout shift khi data load', 'fe-skel', 'CLS on load → fe-skel'],

  // Motion
  ['animation GSAP bị giật khi scroll', 'fe-motion', 'GSAP jank → fe-motion'],
  ['ScrollTrigger bị leak memory', 'fe-motion', 'ScrollTrigger → fe-motion'],

  // Contrast
  ['màu text này đủ tương phản không', 'fe-contrast', 'Contrast check → fe-contrast'],

  // UX
  ['brainstorm layout mới cho trang checkout', 'fe-ux', 'Layout brainstorm → fe-ux'],
  ['copy lỗi của form này chưa rõ', 'fe-ux', 'Error copy → fe-ux'],

  // Viz
  ['thêm biểu đồ doanh thu theo tháng', 'fe-viz', 'Chart → fe-viz'],
  ['chart đang bị slow với 10k data points', 'fe-viz', 'Chart perf → fe-viz'],

  // Ship
  ['chuẩn bị release checklist', 'fe-ship', 'Release → fe-ship'],
  ['sitemap chưa có hreflang', 'fe-ship', 'SEO/sitemap → fe-ship'],

  // PWA
  ['app cần hoạt động offline', 'fe-pwa', 'Offline → fe-pwa'],
  ['user thấy bản cũ sau khi deploy', 'fe-pwa', 'Stale SW → fe-pwa'],

  // MFE
  ['cần tách frontend ra cho 2 team deploy độc lập', 'fe-mfe', 'MFE → fe-mfe'],
  ['remote module không load được', 'fe-mfe', 'Remote fail → fe-mfe'],

  // Test
  ['viết E2E test cho flow checkout', 'fe-test', 'E2E test → fe-test'],
  ['chạy accessibility axe trước khi PR', 'fe-test', 'Axe test → fe-test'],

  // Review
  ['pattern này còn best practice không', 'fe-review', 'Best practice check → fe-review'],

  // Recon
  ['repo này dùng gì mình chưa biết', 'fe-recon', 'Unknown repo → fe-recon'],

  // Learn
  ['nhớ pattern này cho lần sau', 'fe-learn', 'Learn pattern → fe-learn'],
  ['cập nhật skill set từ session này', 'fe-learn', 'Update skills → fe-learn'],
];

// ============================================================
// RUNNER
// ============================================================
let pass = 0;
let fail = 0;
const failures = [];

console.log('='.repeat(70));
console.log(' ANDY ROUTING EVAL SUITE');
console.log('='.repeat(70));
console.log();

for (const [input, expectedSkill, description] of TEST_CASES) {
  // Tìm tất cả skill được nhắc đến trong dispatcher theo ngữ cảnh của keywords
  // Chiến lược: tìm đoạn text trong dispatcher gần với keyword nhất
  const lowerInput = input.toLowerCase();
  const words = lowerInput.split(/\s+/);
  
  // Tìm tất cả dòng trong dispatcher có chứa từ khóa từ input
  const lines = dispatcher.split('\n');
  const scoredSkills = {};
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    let matchScore = 0;
    
    for (const word of words) {
      if (word.length > 3 && lowerLine.includes(word)) {
        matchScore++;
      }
    }
    
    if (matchScore > 0) {
      // Tìm skill được đề cập trên cùng dòng hoặc gần nhất
      const skillMatch = line.match(/\*\*(fe-[a-z]+)\*\*/);
      if (skillMatch) {
        const skill = skillMatch[1];
        scoredSkills[skill] = (scoredSkills[skill] || 0) + matchScore;
      }
    }
  }

  // Tìm skill có điểm cao nhất
  const topSkill = Object.entries(scoredSkills)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  const isPass = topSkill === expectedSkill;
  
  if (isPass) {
    pass++;
    console.log(`  ✅ PASS  ${description}`);
  } else {
    fail++;
    failures.push({ description, input, expectedSkill, topSkill, scoredSkills });
    console.log(`  ❌ FAIL  ${description}`);
    console.log(`         Expected: ${expectedSkill}`);
    console.log(`         Got:      ${topSkill || 'none'} (all scores: ${JSON.stringify(scoredSkills)})`);
  }
}

console.log();
console.log('='.repeat(70));
console.log(` RESULT: ${pass}/${TEST_CASES.length} passed`);
const pct = Math.round(pass / TEST_CASES.length * 100);
console.log(` Accuracy: ${pct}%`);

if (pct >= 90) {
  console.log(' Status: ✅ PASS (≥ 90%)');
} else if (pct >= 70) {
  console.log(' Status: ⚠️  WARNING (70–89%) — cần review các test bị fail');
} else {
  console.log(' Status: ❌ FAIL (< 70%) — dispatcher cần bổ sung keywords');
}

if (failures.length > 0) {
  console.log();
  console.log(' Failures summary:');
  for (const f of failures) {
    console.log(`   - "${f.input}" → expected ${f.expectedSkill}, got ${f.topSkill || 'none'}`);
  }
}

console.log('='.repeat(70));
