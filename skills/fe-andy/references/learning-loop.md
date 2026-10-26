# Learning Loop — keep the skill set growing with every use

Run this at the end of **every task done with any fe-* skill** (step 6 of the protocol in [conventions.md](./conventions.md)). It is short: most tasks produce zero or one note.

---

## 1. What counts as "new"

Capture a note only if **all** are true:
1. **Reusable** — it would help on a different project, not only this one.
2. **Proven** — it was observed in code, measured, confirmed by official docs, or confirmed by the user. Hypotheses are not notes.
3. **Missing** — the skill set does not already say it (check in §2).

| Capture ✅ | Do not capture ❌ |
|---|---|
| A fix pattern that worked, with the check that proved it | Project-specific names, paths, brand colours, client names → put in the project's `project-profile.md` instead |
| A pitfall / anti-pattern that caused a real bug | Secrets, tokens, personal data, internal URLs |
| A better verification command or threshold | Opinions not backed by evidence |
| A correction: a rule in a skill that turned out wrong or outdated | Duplicates of existing rules with different wording |
| A version-specific behaviour (state the library + version) | One-off workarounds for a broken local environment |

## 2. Duplicate check (required before writing)

1. Pick the **owning skill** using the boundary table in [conventions.md §6](./conventions.md).
2. Search the whole skill set for the key term (the API, property, or symptom), for example:
   - shell: `grep -rni "content-visibility" <skill-set-root>/skills`
   - PowerShell: `Select-String -Path <skill-set-root>\skills\*\* -Pattern "content-visibility" -SimpleMatch`
   - or the agent's own search tool.
3. Found and equivalent → stop. Found but incomplete or wrong → write a note of type `correction` or `extend` that points to the existing `file:line`.

## 3. Where to write

Append to the owning skill's `references/learned.md` (every skill has one). Newest note at the bottom. Never edit `SKILL.md` or other reference files during normal work — that is the fe-learn skill's job.

If the skill set folder is read-only or not reachable, put the note in the final message under "Learned notes (not saved)" so the user can paste it later.

## 4. Note format

```markdown
### YYYY-MM-DD · <short title>
- **Type:** pattern | pitfall | verification | correction | extend | version-note
- **Rule:** <one or two sentences, imperative>
- **Why / evidence:** <what was observed or measured; doc link if any>
- **Example:** <minimal code or command, generic names only>
- **Applies to:** <framework/library + version, or "any">
- **Related:** <existing file:line if correction/extend, else "none">
- **Status:** new
```

## 5. Tell the user

End the task message with one line:
- `Learned: added "<title>" to <skill>/references/learned.md` — or
- `Learned: nothing new (checked: <terms searched>)`.

## 6. Promotion (periodic)

When any `learned.md` has 5+ notes with `Status: new`, or when the user asks, suggest running the fe-learn skill. fe-learn reviews the notes, folds approved ones into the right `SKILL.md` / reference file, marks them `promoted`, and runs the skill-set health check.
