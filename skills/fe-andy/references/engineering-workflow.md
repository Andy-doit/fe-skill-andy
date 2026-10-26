# Engineering Workflow — git, commits, pull requests, code review, ADRs

Shared conventions for how changes move from a branch to production and how decisions are recorded. Project values in `project-profile.md` (branch model, PR size limit, commit style) override the defaults here.

## 1. Branching

| Default | Rule |
|---|---|
| Trunk-based | `main` is always deployable; short-lived branches (target ≤ 2 days, ≤ 400 changed lines) merged by PR |
| Branch names | `type/short-kebab-description` — `feat/cart-undo-remove`, `fix/plp-filter-reset`, `chore/upgrade-next-16` |
| Incomplete work | Behind a feature flag (fe-ship), not on a long-lived branch |
| Protected `main` | Required checks (lint, types, tests, build, security gate) + 1 review; no direct pushes; linear history preferred |
| Release branches | Only when the product needs parallel maintenance lines; otherwise tag releases on `main` |

## 2. Commits

Conventional Commits: `type(scope): imperative summary` ≤ 72 chars, body explains **why** (not what), footer for `BREAKING CHANGE:` and issue links.

| Type | Use |
|---|---|
| `feat` / `fix` | User-visible change / bug fix |
| `perf` | Measured performance change (numbers in the body) |
| `refactor` | No behaviour change (fe-clean steps) |
| `test`, `docs`, `chore`, `build`, `ci` | Non-product changes |
| `revert` | Reverts, referencing the original hash |

One logical change per commit; squash fix-ups before review (`git rebase -i` locally). Packages in a monorepo: use changesets (or the team's tool) so versions and changelogs are generated from commits.

## 3. Day-to-day git

| Task | Command / rule |
|---|---|
| Update branch before PR | `git fetch origin && git rebase origin/main` (never rebase a branch others have pulled) |
| Merge strategy | Squash-merge small PRs; merge commits only for multi-commit PRs whose history matters |
| Clean up before review | `git rebase -i origin/main` → squash "wip", reorder, reword |
| Conflict resolution | Resolve in the IDE, run lint + types + the affected tests before `git rebase --continue`; never resolve by taking "ours"/"theirs" blindly in `package-lock.json` — regenerate it |
| Find the commit that broke something | `git bisect start && git bisect bad && git bisect good <tag>` then `git bisect run npm test -- <spec>` |
| Work on two branches at once | `git worktree add ../app-hotfix hotfix/x` (no stash juggling) |
| Undo safely | `git revert <sha>` on shared branches; `git reset` only on local, unpushed work |
| Large/binary files | Not in git: use the asset pipeline or LFS if the project already uses it |

## 4. Pull request hygiene

Template (`.github/pull_request_template.md` or equivalent):

```markdown
## What
<one paragraph; link issue/ADR>
## Why
<user/business reason; alternatives rejected>
## How to test
<steps, preview URL, test data>
## Screenshots / recordings (UI changes)
before | after (light + dark, mobile + desktop)
## Risk & rollback
<what could break; flag name; rollback = revert/redeploy id>
## Checklist
- [ ] lint, types, unit/component tests pass locally
- [ ] fe-test tier chosen for this risk level; E2E added for new critical flows
- [ ] a11y pass (keyboard, labels, contrast) for UI changes
- [ ] i18n: no hard-coded copy; dictionaries updated
- [ ] perf budget respected (bundle check) / numbers attached for perf PRs
- [ ] fe-sec gate: no new sinks without inventory entry, no secrets, no source maps, server check named for role-gated UI
- [ ] docs/ADR updated if a decision changed
```

Rules: self-review the diff first (read it as a reviewer would); keep PRs reviewable (split by layer: tokens → blocks → feature); draft PRs for early feedback; one PR = one concern; screenshots for anything visual; link the preview deployment (fe-ship).

## 5. Reviewing someone else's code

Review order (stop and request changes at the first blocking level):

| Priority | Look for | Tools |
|---|---|---|
| 1. Correctness | Does it do what the PR says? Edge cases (empty, error, race, unmount), state placement ([fe-code state.md](../../fe-code/references/state.md)) | Pull the branch and run it for risky changes |
| 2. Security | New sinks, secrets, client-only authorization, dependency additions — fe-sec gate | fe-sec checklist §1 grep on the diff |
| 3. Accessibility | Semantics, names, keyboard, focus, contrast (fe-a11y / fe-contrast) | axe on the preview |
| 4. Performance | Measured claims only; no speculative memo; bundle delta; new waterfalls | fe-perf budgets |
| 5. Maintainability | Layer breaches, duplication, naming, tests present and meaningful (fe-clean) | — |
| 6. Style | Only what lint cannot enforce; everything else is a lint rule, not a comment | — |

Comment labels so the author knows what blocks: `blocking:` · `suggestion:` · `nit:` · `question:` · `praise:`. Explain *why* and, when possible, show the alternative. Disagreements about a pattern go to fe-review for a verdict instead of a comment thread. Respond within one business day; approve with "approved pending X" when only nits remain. Never rewrite the author's PR yourself without asking.

What not to do: review formatting; demand your own style; approve without running anything on a change that touches protected zones (money, auth, payment — conventions §5.2).

## 6. Architecture Decision Records (ADR)

One file per decision in `docs/adr/NNNN-short-title.md`; link the ADR from `project-profile.md` → Known decisions.

```markdown
# ADR-0007: Server state in TanStack Query, no global client store
- Status: Accepted (2026-10-26) · Supersedes: — · Superseded by: —
- Deciders: <names/roles>
## Context
<forces: team, constraints, current pain, numbers>
## Decision
<one paragraph in the active voice: "We will …">
## Alternatives considered
| Option | Why not |
|---|---|
## Consequences
<positive, negative, follow-ups; what becomes easier/harder>
## Validation
fe-review verdict: <Still Best Practice / Acceptable …> with sources; measurement plan if performance-related
## Revisit when
<trigger: framework major, team growth, metric threshold>
```

Write an ADR when: adopting/removing a library or framework, changing rendering/caching strategy, splitting the app (fe-mfe), changing auth/session design (fe-sec), changing the test strategy, or accepting a security/perf exception. Keep it to one page; a rejected option with a clear "why not" is the most valuable part.

## 7. RFC-lite for larger changes

For changes that affect several teams or take > 1 week: a short document (problem, goals / non-goals, proposal, rollout plan with flags, risks, open questions) shared for a time-boxed comment period (3–5 working days) before implementation starts. The outcome becomes one or more ADRs.

## 8. Planning and estimation

- Break work into tasks ≤ 1 day; anything larger gets a spike (time-boxed, output = decision or estimate).
- Use the conventions rubric (Effort S/M/L, Risk) in proposals; mark estimates as estimates.
- Definition of Ready: acceptance criteria, designs/mockups (fe-ux Mode 1 if needed), data contract known (fe-data api-contracts.md), a11y/i18n/perf requirements named, owner for anything in a protected zone.
- Definition of Done: conventions §8.

## 9. Verify (workflow health)

- PRs merged in the last month: median size ≤ 400 lines, median review turnaround ≤ 1 business day (from the repo's PR data).
- `main` CI green; no direct pushes; required checks include the security gate.
- Every library/framework/architecture change in the period has an ADR; `project-profile.md` Known decisions links them.
- Changelog/release notes derive from conventional commits without manual rewriting.
