# How fe-skill-andy Learns

Goal: every time a skill is used, anything new and proven gets added to the skill set — without bloating it, duplicating rules, or leaking project details.

## Two stores

| Store | Location | Holds | Written by |
|---|---|---|---|
| Skill knowledge (general) | `skills/<skill>/references/learned.md` → promoted into `SKILL.md` / `references/*.md` | Reusable patterns, pitfalls, verification methods, corrections, version notes | Learning loop (append), fe-learn (promote) |
| Project knowledge (specific) | `project-profile.md` at the root of each target project | Stack, versions, paths, protected areas, budgets, design decisions | Any skill, with user approval; fe-recon drafts it |

## Loop

```
1. Task done with any fe-* skill (protocol step 6 "Learn")
2. Filter: reusable? proven? missing from the set? (duplicate search across skills/)
3. Yes → append a note (Status: new) to the owning skill's references/learned.md
   Project-specific → project-profile.md instead
   No → report "Learned: nothing new (checked: …)"
4. fe-learn, when asked or when a skill has 5+ new notes:
   triage → user approves → fold into SKILL.md / references → mark notes promoted → run check-skills.mjs
```

Rules: [skills/fe-andy/references/learning-loop.md](skills/fe-andy/references/learning-loop.md). Promotion: [skills/fe-learn/SKILL.md](skills/fe-learn/SKILL.md).

## Why append-first, promote-later

- Appending a note is safe and immediate — the next session already sees it (each SKILL.md links its `learned.md`).
- Editing core rules needs review — fe-learn shows a plan and waits for approval, then the health check keeps names, links, and descriptions valid.

## Legacy

The older StarCi-specific stores (`decision/`, `design/`, `cannon/`, `rules/`, `ui/`, `design-system/`) are kept for reference. They are project knowledge; for new projects use `project-profile.md`.
