# Connected / Pure Twin Pattern

A split component has two halves: the **connected** half owns the world (data, translations, handlers); the **pure** half draws from atoms and can be rendered from fixtures without standing the world up.

## The Split

| File | Role | Rule |
|---|---|---|
| `index.tsx` exports `X` | Connected — calls hooks, owns SWR reads, translations, event handlers | Only `index.tsx` imports `component.tsx`; never re-exports `XBase` |
| `component.tsx` exports `XBase` | Pure — receives only atoms; calls NO world hooks | Renders from fixture in Storybook without any providers |

`XBase` takes `XBaseProps` shaped as `{ shape?, props, on? }`:

## The Three Axes

### Shape (`shape?: XShape`)
- `XShape` is a **string-literal union with product meaning**: `"prepared" | "sent" | "returned"`.
- Each member = one drawing + one Storybook story.
- **Never use data-status words as shape members**: `pending`, `loading`, `failed`, `error`, `empty`, `forbidden`, `idle`, `closed` — these are slot status, not shapes. Open/closed is a boolean atom.
- A unit with one drawing takes NO `shape` prop.
- Exhaustive `switch` on `shape` in the pure half — no `default` fallback.
- Declare: `export const X_SHAPES = ["prepared", "sent", "returned"] as const` then `type XShape = (typeof X_SHAPES)[number]`.

### Props (`props: { ... }`)
- Atoms only: strings, numbers, booleans, arrays/objects of them, resolved labels.
- One `DataSlot<T>` per API read the block owns.
- **No raw API response objects** — the connected half maps to atoms before passing.

### Actions (`on?: { ... }`)
- Callbacks whose arguments are atoms.
- Named as verbs: `onRetry`, `onSubmit`, `onSelectItem`.
- The pure half never calls `useRouter`, `useSWR`, `useTranslation`, or any hook that touches the world.

## Children Rules
- A **page/layout** that is the route's one-level root may receive `children` (it nests the route's child page between its `XBase` tags).
- An **ordinary block** receives neither `children` nor named render callbacks through shape.
- A **leaf** receives only text as children.

## Storybook Contract
Every shape member needs:
1. A story with `args: { shape: "<member>" }` and fixture data.
2. A skeleton story: `parameters: { dna: { phase: "loading" } }` with every slot loading.

## Example

```tsx
// HandoffBlock/component.tsx
export const HANDOFF_SHAPES = ["prepared", "sent", "returned"] as const
export type HandoffShape = (typeof HANDOFF_SHAPES)[number]

export interface HandoffBlockBaseProps {
  readonly shape: HandoffShape
  readonly props: {
    readonly order: DataSlot<OrderView>
    readonly handoff: DataSlot<Handoff>
    readonly labels: HandoffLabels
  }
  readonly on: {
    readonly requestSend: (input: SendInput) => void
    readonly retryOrder: () => void
  }
}

// HandoffBlock/index.tsx
const handoffRead = useGetHandoffSwr({ handoffId: props.handoffId })
const handoff = slotOfSwr(handoffRead)
const shape = (handoff.items ?? HANDOFF_PLACEHOLDER).status
// → pass shape, props (atoms), on (handlers) to <HandoffBlockBase>
```

## Why
A pure half that takes only atoms renders from a fixture without standing the world up — every shape can be drawn and audited. A status or failure kept out of `shape` leaves no shape nobody drew.
