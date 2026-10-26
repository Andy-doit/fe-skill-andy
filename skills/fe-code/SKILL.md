---
name: fe-code
description: >
  Author NEW frontend code on-pattern with the 4-layer architecture (Tokens → Primitives → Blocks → Features):
  components, reusable blocks, custom hooks, stores, forms, modals, Server Actions, typed props, pages/routes,
  component API design, and choosing where state lives (local / global / server / URL).
  Use when: creating new UI components, scaffolding a feature, writing a form or modal, or adding a hook/store.
  DO NOT USE FOR: auditing or refactoring existing code (see fe-clean); fine spacing on existing UI (see fe-layout);
  DO NOT USE FOR: form UX behaviour and copy decisions (see fe-ux); fetch/cache logic design (see fe-data).
---

# fe-code — On-Pattern Authoring

Create new code that fits the project's layers from day one. Follows [conventions.md](../fe-andy/references/conventions.md).

## Minimum rules (apply even without fe-andy)
- Read `project-profile.md` in the target project first (stack, folders, UI library, state/data libraries).
- Propose the file plan and wait for approval before writing; never install packages without consent.
- No secrets in client code; never edit protected areas without explicit instruction.
- Finish with the learning loop: append new, proven lessons to [references/learned.md](./references/learned.md) after a duplicate check ([learning-loop.md](../fe-andy/references/learning-loop.md)).

---

## 1. Layers (paths from the project profile; defaults shown)

| Layer | Default location | Responsibility | Not allowed |
|---|---|---|---|
| 4 Features | `src/components/features/**` or `src/features/**` | Fetch/state, compose Blocks | Custom styling |
| 3 Blocks | `src/components/blocks/**` | Reusable widgets, own style, props-only | Calling stores/APIs |
| 2 Primitives | UI library + base components | Accessible interactive base | `!important` overrides |
| 1 Tokens | global CSS / theme config | Semantic variables | Raw hex in JSX |

## 2. Authoring workflow

1. **Search first**: look for an existing Block/hook that already does it (grep component names, `blocks/`, `hooks/`). Reuse or extend before creating.
2. **Classify**: Block or Feature? Where does each piece of state live? ([state.md](./references/state.md))
3. **Design the API**: props, variants, composition ([component-api.md](./references/component-api.md)).
4. **Propose** the file list + public API; wait for approval.
5. **Write**: strict types (no `any`), early returns, small components, semantic HTML, accessible names, all copy through the i18n helper if the project uses one.
6. **States**: every data-backed region gets loading/empty/error (fe-skel).
7. **Verify**: project lint + `tsc --noEmit` + build for routes; render each state once (mock or DevTools blocking); keyboard pass (Tab/Enter/Escape).

## 3. Forms and Server Actions

- Validate on the server always; mirror the schema on the client for inline feedback (one shared schema, e.g. Zod, if the project uses it).
- Server Action / API handler returns a typed result `{ ok: true, data } | { ok: false, fieldErrors, formError }`; never throw raw errors to the UI.
- Keep user input on failure; focus the first invalid field; show field errors next to fields (UX rules: fe-ux).
- In development without external credentials (mail, payment), use an explicit mock path guarded by environment checks — never silently pretend success in production.
- Disable double submit while pending; show progress state.

## 4. Output

```markdown
## New code plan — <feature>
| File | Layer | Purpose | Public API |
States covered: loading / empty / error / content
Verify: <commands + manual checks>
```

Learned notes: [references/learned.md](./references/learned.md).
