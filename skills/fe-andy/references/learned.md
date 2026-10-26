# Learned notes — fe-andy (routing & shared conventions)

Append-only. Written by any skill's learning loop ([learning-loop.md](./learning-loop.md)); folded into the skill by the fe-learn skill.
Notes about routing mistakes, boundary conflicts, or workflow rules belong here.

<!-- Add notes below this line, newest at the bottom. -->

### 2026-10-26: Fast-path protocol eliminates friction for micro-edits (<= 5 lines)
- Context: Strict 6-step proposal ceremony created unnecessary latency and user fatigue when applying trivial cosmetic tweaks (e.g. single Tailwind utility change, label typo).
- Pattern / Rule: Introduced Fast-Path in conventions §1.1: for changes <= 5 lines in 1 file that are isolated cosmetic or explicit typo/import fixes without touching auth, payment, router, or shared contracts, agent skips formal proposal/approval pause, applies the surgical edit, and returns diff + verification in one turn.
- Status: promoted (2026-10-26 -> conventions.md)

### 2026-10-26: Antigravity IDE global skill discovery requires sync with skills.json
- Context: Renaming the skill set repository broke IDE `/` autocomplete because `~/.gemini/config/skills.json` still held the legacy path (`starci-fe-skills`), even though NTFS junctions were present in `~/.gemini/config/skills/`.
- Pattern / Rule: Antigravity uses `~/.gemini/config/skills.json` as the manifest for global skill discovery. Installers (`install-skills.ps1` and `install-skills.sh`) must register/update the active skills directory in `skills.json` in addition to creating filesystem junctions.
- Status: promoted (2026-10-26 -> install-skills.ps1, install-skills.sh)
