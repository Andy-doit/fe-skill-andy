# Component API Design

## 1. Principles

- **Small surface**: few props; each prop has one meaning. Prefer adding a variant over a boolean that combines with others (`variant="danger"` not `isRed` + `isBold`).
- **Variants as unions**: `size: "sm" | "md" | "lg"`, `variant: "primary" | "secondary" | "ghost"`. Map them to classes in one place (e.g. `cva`/`tailwind-variants` if the project uses them).
- **Composition over configuration**: accept `children` and slots instead of many content props.
  ```tsx
  <Card>
    <Card.Header title="Plan" />
    <Card.Body>…</Card.Body>
    <Card.Footer><Button>Choose</Button></Card.Footer>
  </Card>
  ```
- **Native props pass-through**: extend the underlying element's props (`React.ComponentPropsWithoutRef<"button">`) and spread the rest; forward `ref` where consumers may need focus/measurement (React 19 accepts `ref` as a prop; earlier versions need `forwardRef`).
- **`className` merging**: allow a `className` escape hatch on Blocks, merged with a class-merge helper; Features should not need it.
- **Controlled and uncontrolled**: for inputs/toggles/tabs support `value` + `onChange` (controlled) and `defaultValue` (uncontrolled). Never switch between modes at runtime.
- **Event naming**: `onX` for callbacks with domain meaning (`onSelect(item)`), not raw DOM events unless it is a primitive.
- **Accessibility built in**: required accessible name (`aria-label` prop when there is no visible text), correct role, keyboard support inside the component.
- **Stable defaults**: sensible defaults so the common case needs no props.

## 2. Checklist before publishing a Block

- [ ] Typed props with JSDoc on non-obvious props
- [ ] Variants documented; no conflicting booleans
- [ ] Works with long text, empty data, RTL/long translations
- [ ] Keyboard and focus behaviour correct; visible focus
- [ ] No data fetching inside
- [ ] Example usage (story/test/MDX if the project has a catalogue)

## 3. Anti-patterns

- ❌ `props.config` objects with dozens of keys
- ❌ Boolean explosion (`isPrimary`, `isLarge`, `isOutline`, `isRounded`)
- ❌ Copy-pasting a Block to change one style instead of adding a variant
- ❌ Hidden side effects (fetching, global state writes) in presentational components

## 4. Progressive enhancement (works before and without JavaScript)

| Rule | Do | Not |
|---|---|---|
| Navigation is a link | `<a href>` / `<Link>` for anything that changes the URL | `<div onClick={() => router.push()}>` |
| Forms submit without JS | `<form action={serverAction}>` / `<form method="post" action="/api/…">`; Server Actions and BFF endpoints accept the plain POST | Submit handlers that only work after hydration |
| Native first | `<details>`, `<dialog>`, `popover`, `<select>`, `<input type=date>` before custom widgets (fe-layout modern-css.md §5) | Rebuilding native controls in divs |
| Content is in the HTML | Server-render the primary content; JS enhances (filters, live updates) | Empty shell that fetches everything client-side (fe-perf, fe-ship SEO) |
| Enhancement is additive | Feature-detect (`"IntersectionObserver" in window`, `@supports`) and add behaviour | UA sniffing; breaking the baseline when the enhancement fails |
| Verify | Key flows (browse, read, submit a form) work with JavaScript disabled in DevTools; filter forms submit as GET | — |

## 5. Web Components interop

Use when a framework-agnostic widget must be shared across stacks (fe-mfe §3.1) or a vendor ships one.

- Wrap each custom element **once** in a React Block with typed props and mapped events; features never use the tag directly.
- React 19 sets props as properties when the element defines them and as attributes otherwise; custom events still need `ref` + `addEventListener` in the wrapper (verify for your React version). Type the tag via `React.JSX.IntrinsicElements` augmentation.
- SSR: custom elements render as empty tags on the server unless they ship Declarative Shadow DOM; render a sized placeholder (no CLS) or load client-only.
- Styling crosses the shadow boundary only through CSS custom properties and `::part()`; pass tokens from the project's theme (fe-layout).
- Do not mix a design system's Web Component and React versions of the same control in one app; pick one.
- Verify: wrapper exposes a11y name/role correctly (axe), events fire once, hydration warnings absent.
