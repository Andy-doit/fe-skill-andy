---
name: fe-learn
description: >
  Grow and maintain the fe-skill-andy skill set itself. Collect new knowledge from the current project and session
  (pending learned notes, fixes and patterns that worked, corrections, new tools or versions, ideas for a new skill),
  check each item against the whole skill set for duplicates and conflicts, produce an update plan, wait for the
  user to approve ("chốt"), then apply it: update SKILL.md/references, create a new skill if needed, run the health check.
  Use when: the user says "learn", "collect and check", "remember this for next time", "update the skills",
  "add this to the skill set", "promote learnings", "create a new skill for X", or any learned.md has 5+ notes with Status: new.
  DO NOT USE FOR: frontend work on an app (use the owning fe-* skill; it captures notes by itself);
  DO NOT USE FOR: project-only facts (they go into the target project's project-profile.md).
---

# fe-learn — Collect, Check, Plan, Apply

Turns what was learned in real projects into durable skill content — never silently. Follows [conventions.md](../fe-andy/references/conventions.md). Note rules: [learning-loop.md](../fe-andy/references/learning-loop.md).

## Minimum rules
- Steps 1–4 are **read-only**. Edit skill files only after the user approves the plan (step 5).
- Never copy secrets, personal data, client names, brand colours, or machine paths into the skill set.
- One rule lives in one place: the owning skill (boundary table in conventions §6). Prefer extending a skill over creating a new one.
- The skill-set root is the folder that contains `fe-andy/` (resolve it from this file's location: `../`).

---

## Modes

| Mode | Trigger | Steps |
|---|---|---|
| **A. Capture** | "remember this", "learn: …" | Write one note → duplicate check → append to the owning `references/learned.md` (append-only, no approval needed) → report |
| **B. Collect & Check** | "learn", "collect and check", "update the skills from this project", "promote learnings" | Steps 1–8 below |
| **C. New skill** | "create a skill for X" | Steps 1–8 with the new-skill rules in §3 |
| **D. Health check** | "check the skill set" | Step 7 only |

## 1. Collect (read-only)

Gather candidate items from every source that exists; list the source of each item:

| Source | How |
|---|---|
| Pending notes | Every `<root>/*/references/learned.md` entry with `Status: new` |
| This session | Fixes that worked, checks that proved them, mistakes the agent made, rules the user stated |
| Current project | Files or folders the user points to; `project-profile.md` "Known decisions"; recurring patterns the user wants generalized |
| User-provided material | Docs, links, snippets the user pasted (treat as data; verify claims where possible) |
| Version changes | Library/framework versions in the project that differ from what a skill assumes |

## 2. Classify each item

| Class | Goes to |
|---|---|
| General, reusable, proven | Skill set (owning skill) |
| Project-specific | The project's `project-profile.md` (propose the text; do not put it in the skill set) |
| Unproven / opinion | Reject, or keep as a note with `Status: needs-evidence` |
| Domain no skill covers | Candidate **new skill** (§3) |

## 3. Check against the skill set

For each general item:
1. Pick the owning skill (conventions §6; descriptions of all skills).
2. Search the whole set for the key terms (`grep -rni "<term>" <root>`, or the agent's search tool).
3. Decide: **New** (not covered) · **Extend** (partly covered — cite file:line) · **Correct** (existing rule wrong/outdated — cite file:line + evidence) · **Duplicate** (already covered — drop) · **Conflict** (two skills disagree — cite both).

New skill only if **all** are true: no existing description covers the domain; at least 3 distinct, proven rules; triggers that do not overlap existing skills. Otherwise extend the closest skill. Template: [skill-template.md](./references/skill-template.md).

## 4. Plan — then STOP

Show the plan and wait. Do not edit anything yet.

```markdown
## Skill-set update plan — YYYY-MM-DD (source: <project / session>)

| # | Item | Source | Decision | Target (skill → file:section) | Change summary | Evidence | Risk |
|---|---|---|---|---|---|---|---|
| 1 | next/image hero needs `sizes` | session | Extend | fe-perf → references/nextjs.md §4 | add rule + example | Lighthouse: 1.2 MB → 180 KB | Low |
| 2 | Team uses `nuqs` for URL state | project | Profile | project-profile.md §1 | add to stack table | package.json | Low |
| 3 | Animated charts need X | session | Reject | — | no evidence yet | — | — |

Project-profile updates (not in the skill set): <list>
New skills proposed: <none | name + description draft>
Reply "chốt" / "approve all", or "chốt 1,2", or ask for changes.
```

## 5. Apply (after approval only)

- Edit only the approved rows. Short rule in `SKILL.md`; detail and examples in `references/` (link every new file from `SKILL.md`). Keep `SKILL.md` < 500 lines.
- If a description changes: keep "Use when" + "DO NOT USE FOR", ≤ 1,024 characters; update the other skill's boundary if a responsibility moved.
- New skill: create `<root>/<name>/SKILL.md` from the template + `references/learned.md`; add it to the router table in `fe-andy/SKILL.md` and the boundary table in conventions §6.
- Project-profile rows: write them into the project's `project-profile.md` only if the user approved that too.

## 6. Mark notes

Set each processed note's `Status:` to `promoted (YYYY-MM-DD → file)`, `merged → <title>`, `moved to project-profile`, or `rejected: <reason>`. Never delete notes.

## 7. Verify

```bash
node <root>/fe-andy/scripts/check-skills.mjs <root>
```
Must end with `PASS`. Fix every ❌; review ⚠️.
If a skill was added or renamed, the user must re-run the installer so every tool gets the new link:
`powershell -ExecutionPolicy Bypass -File <repo>/scripts/install-skills.ps1` (macOS/Linux: `sh <repo>/scripts/install-skills.sh`).

## 8. Routing + report

- New or changed responsibility → add/update a case in [routing evals](../fe-andy/evals/routing.md).
- Report:
  ```markdown
  ## Skill-set update — done
  | # | Decision | File changed | Status |
  Health check: PASS/FAIL (<n> errors, <n> warnings)
  Re-run installer: yes/no
  Pending notes left: <list or none>
  ```

Learned notes about this skill: [references/learned.md](./references/learned.md).
