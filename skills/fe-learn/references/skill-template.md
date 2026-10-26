# New Skill Template

Copy into `<skills-root>/<name>/SKILL.md`. Name: lowercase letters, digits, hyphens; ≤ 64 chars; equals the folder name; prefix `fe-`.
Also create `<name>/references/learned.md` (copy the header from any other skill).

````markdown
---
name: fe-<name>
description: >
  <What it does, listing the concrete topics it owns, in one or two sentences.>
  Use when: <3–5 concrete situations or user phrases>.
  DO NOT USE FOR: <nearest neighbour topic> (see fe-<other>); <second neighbour> (see fe-<other>).
---

# fe-<name> — <Short Title>

<One sentence purpose.> Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first.
- Read-only audit first; propose; wait for approval before editing.
- Never print secrets; never edit protected areas without explicit instruction.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Audit / workflow
1. <step with what to read or run>
2. <step>

## 2. Rules and patterns
| Problem | Pattern / fix | Verify by |
|---|---|---|

## 3. Verify
- <command or manual check with pass threshold>

## 4. Output
```markdown
| # | Finding | Location | Evidence | Impact | Effort | Risk | Fix | Verify by |
```

Learned notes: [references/learned.md](./references/learned.md).
````

Checklist before proposing it:
- [ ] No existing skill description covers this domain
- [ ] At least 3 distinct, proven rules
- [ ] Triggers do not overlap other skills (add DO NOT USE FOR both ways)
- [ ] Router table (fe-andy) and boundary table (conventions §6) updated
- [ ] Routing eval cases added
- [ ] Health check PASS; installer re-run
