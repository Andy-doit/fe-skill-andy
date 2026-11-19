# Project Profile — fe-skill-andy

> Official project profile for `fe-skill-andy` (Andy Autonomous Frontend Agent Harness & 21-Skill Ecosystem).
> Read by Andy at the start of every engineering and governance session (BW-P1, BW-P3).

Last reviewed: 2026-11-19

---

## 1. Stack & Runtime
| Item | Value |
|---|---|
| Project Type | AI Coding Agent Skill Set & Architecture Harness |
| Target AI Tools | Claude Code (`~/.claude/skills`), Codex (`~/.agents/skills`), Antigravity CLI, Antigravity Plugin |
| Scripting Runtime | Node.js 24+ (Native ES Modules, Zero npm dependencies) |
| Shell / Automation | PowerShell 5.1 / 7+ (Windows junction linking, cross-tool sync) |
| Asset Formats | Vector SVG (Banner, Architecture Flow, Badges), Markdown (GitHub GFM) |
| Character Encoding | UTF-8 Strict (No BOM, LF normalized) |
| Licensing | MIT License (Andy-doit) |

---

## 2. Core Commands & Verification
| Purpose | Command | Success Invariant |
|---|---|---|
| Structural Integrity Check | `node skills/fe-andy/scripts/check-skills.mjs` | 0 errors, 0 warnings (Validates frontmatter, relative links, folder structure) |
| Zero Loosening Gate Scan | `node skills/fe-andy/scripts/check-loosening.mjs` | 0 markers found (Rejects `@ts-ignore`, `eslint-disable`, `it.skip`, `\|\| true`) |
| Heuristic Routing Benchmark | `node andy-evals.mjs` | Suite A (56 cases) & Suite B (44 cases) automated evaluation |
| Cross-Tool Installation & Sync | `powershell -ExecutionPolicy Bypass -File scripts/install-skills.ps1 -Tools all` | Links all 21 skills to Claude, Codex, Antigravity CLI, and registers clean plugin |

---

## 3. Directory Layout & Architecture Layers
- `skills/`: The sovereign 21 frontend skill directories (`fe-recon`, `fe-layout`, `fe-clean`, `fe-code`, `fe-data`, etc.).
  - `skills/fe-andy/`: Router hub, conventions, check scripts, and eval datasets.
  - `skills/fe-andy/references/`: Universal conventions, learning loop, and project profile templates.
- `scripts/`: Platform installer (`install-skills.ps1`) and cross-agent linking utilities.
- `.antigravity-plugin/`: Antigravity IDE manifest (`plugin.json`) and system persona rules (`rules/AGENTS.md`).
- `assets/`: Mathematical precision vector SVGs (`andy-banner.svg`, `architecture-flow.svg`) replacing fragile ASCII box art.
- Root Configuration: `AGENTS.md` (universal agent instructions), `CLAUDE.md` (native Claude Code entrypoint).

---

## 4. Protected Zones (Explicit Confirmation Required)
Never modify or bypass without explicit user instruction:
- `skills/fe-andy/references/conventions.md` (Constitutional frontend laws across all skills).
- `.antigravity-plugin/rules/AGENTS.md` & `andy-persona.md` (Core safety boundaries and zero-loosening invariants).
- Secret Safety: Zero tokens, API keys, or private credential strings in skills, examples, or logs.
- Portability Rules: Relative markdown links only; zero machine-specific hardcoded paths in `skills/`.

---

## 5. Governance & Evaluation Targets
| Metric | Benchmark Target | Current Measured Status |
|---|---|---|
| Structural Integrity | 100% Pass (0 errors) | **PASS** (`check-skills.mjs`) |
| Loosening Gate Scan | 0 markers | **0 found — PASS** (`check-loosening.mjs`) |
| Conversational Routing (Suite B) | $\ge 95\%$ | **97.7% (43/44 passed)** (`andy-evals.mjs`) |
| Adversarial Boundary Routing (Suite A) | Baseline $\ge 50\%$ (Heuristic) / Target $\ge 95\%$ (LLM) | **51.8% (29/56 passed)** (Heuristic Engine) |
| Execution Quality (Tier 2) | $\ge 90/100$ + 4/4 Hard Gates | **97.6 / 100** (Session Sample Audits) |

---

## 6. Security Notes & Policies
- **Source Maps:** Pure Markdown and Node script ecosystem; no compiled web client bundles emitted. For target web projects, source maps are blocked by default unless a fully qualified 6-field waiver is present.
- **Waiver Schema Enforced:**
  Any source map waiver in target projects must include: `owner`, `expiration` ($\le 90$ days for non-OSS), `audience`, `data_classification`, `compensating_controls`, and `threat_model_rationale`.
- **UI Affordance Rule:** Client role-checks shape UX only; server always authorizes.

---

## 7. Known Architectural Decisions
- `2026-11-19` — Replaced brittle Unicode ASCII box art in README with precision vector SVGs (`assets/*.svg`) to guarantee 100% mathematical alignment across all browser font fallbacks.
- `2026-11-19` — Established Fast-Path Composition Exception in `skill-dispatcher.md`: Multi-skill tasks where each sub-task is $\le 5$ lines cosmetic execute in one turn without blocking approval ceremony.
- `2026-11-19` — Bifurcated routing evals into Suite A (Adversarial Boundaries, 56 cases) and Suite B (Conversational Developer Prompts, 44 cases) with transparent distinction between Heuristic Keyword Baseline and Semantic LLM Intent Parsing.
