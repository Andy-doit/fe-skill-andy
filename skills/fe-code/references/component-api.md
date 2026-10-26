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
