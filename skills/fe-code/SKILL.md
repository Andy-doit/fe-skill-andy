---
name: fe-code
description: >
  Author NEW frontend code on-pattern with the 4-layer architecture (Tokens → Primitives → Blocks → Features):
  components, reusable blocks, custom hooks, stores, forms, modals, Server Actions, typed props, pages/routes,
  Next.js App Router routing (route groups, parallel/intercepting routes, loading/error files, route handlers),
  component API design, advanced TypeScript, files (upload/download/clipboard/drag-and-drop), Storybook stories,
  progressive enhancement, Web Components interop, and where state lives (local / global / server / URL).
  Use when: creating new UI components, scaffolding a feature, writing a form or modal, adding a hook/store,
  a route or modal route, uploads/downloads, or stories.
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

## 2.1 Routes (Next.js App Router)

File conventions, route groups, parallel slots (`@slot` + `default.tsx`), intercepting routes for deep-linkable modals, route handlers, and the decision table: [nextjs-routing.md](./references/nextjs-routing.md). Keep route files thin: read params → call feature queries → compose. Rendering/caching cost of a route: fe-perf.

## 2.2 Files, stories, enhancement, interop

- Upload (direct / presigned / resumable), download, clipboard, drag-and-drop with keyboard alternatives, previews and memory: [files.md](./references/files.md). Server-side limits: fe-sec; UX: fe-ux.
- Storybook stories as the executable contract of a Block (CSF3, story set per Block, `play` interaction tests, a11y addon, docs): [component-docs.md](./references/component-docs.md). Running them in CI: fe-test.
- Progressive enhancement and Web Components interop: [component-api.md](./references/component-api.md) §4–5.

## 3. Forms and Server Actions

- Validate on the server always; mirror the schema on the client for inline feedback (one shared schema, e.g. Zod, if the project uses it).
- Server Action / API handler returns a typed result `{ ok: true, data } | { ok: false, fieldErrors, formError }`; never throw raw errors to the UI.
- Keep user input on failure; focus the first invalid field; show field errors next to fields (UX rules: fe-ux).
- In development without external credentials (mail, payment), use an explicit mock path guarded by environment checks — never silently pretend success in production.
- Disable double submit while pending; show progress state.

## 4. Advanced TypeScript Patterns (Senior+)

Use them only when they remove a class of bugs. Readability beats cleverness, and fe-clean flags type gymnastics.

| Pattern | Use for | Avoid |
|---|---|---|
| Discriminated union + exhaustive check | Async state, action results, variants | Boolean soup (`isLoading && !isError`) |
| `satisfies` | Config/maps that must match a type but keep literal types | `as` casts that hide mistakes |
| Branded types | IDs and units that must not mix (`UserId` vs `OrderId`, cents vs dollars) | Branding every string |
| Schema-inferred types (`z.infer`) | API boundaries: one runtime schema = one type | Hand-written payload types that drift |
| Generic components with constraints | Tables, selects, lists over `T` | Generics nobody calls with two different types |
| Template literal types | Event names, route keys, token names | Parsing complex grammars in types |

```tsx
// Exhaustive union — adding a variant becomes a compile error everywhere it is unhandled
type Result<T> = { status: "ok"; data: T } | { status: "error"; error: string } | { status: "loading" };
function render<T>(r: Result<T>) {
  switch (r.status) {
    case "ok": return r.data;
    case "error": return r.error;
    case "loading": return null;
    default: return r satisfies never;
  }
}

// satisfies: checked against the type, literal keys preserved for autocomplete
const routes = { home: "/", order: "/orders/[id]" } satisfies Record<string, `/${string}`>;
type RouteKey = keyof typeof routes; // "home" | "order"

// Branded IDs — a plain string cannot be passed by accident
type Brand<T, B extends string> = T & { readonly __brand: B };
type UserId = Brand<string, "UserId">;
const asUserId = (v: string) => v as UserId; // the one sanctioned cast, at the boundary

// Boundary validation: the schema is the type
import { z } from "zod";
const Order = z.object({ id: z.string(), totalCents: z.number().int().nonnegative() });
type Order = z.infer<typeof Order>;
export const parseOrder = (json: unknown): Order => Order.parse(json);

// Generic, constrained component; NoInfer stops `selected` from widening T (TS 5.4+)
type SelectProps<T extends { id: string }> = {
  items: readonly T[]; selected?: NoInfer<T>; getLabel: (item: T) => string; onChange: (item: T) => void;
};
export function Select<T extends { id: string }>({ items, getLabel, onChange }: SelectProps<T>) {
  return <ul>{items.map((i) => <li key={i.id}><button type="button" onClick={() => onChange(i)}>{getLabel(i)}</button></li>)}</ul>;
}
```

tsconfig baseline for new code: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` (where libraries allow it), `verbatimModuleSyntax`, and `moduleResolution: "bundler"` for Vite/Next.js. Check the project's TypeScript version before using newer features (`NoInfer` needs 5.4+).

## 5. Validate major decisions

Before adopting a new library, state approach, or architecture (micro-frontends: fe-mfe; offline: fe-pwa), or applying a pattern copied from a tutorial or an older codebase, run it through the fe-review skill and attach its verdict to the proposal.

## 6. Output

```markdown
## New code plan — <feature>
| File | Layer | Purpose | Public API |
States covered: loading / empty / error / content
Verify: <commands + manual checks>
```

Learned notes: [references/learned.md](./references/learned.md).
