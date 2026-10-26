# Component Docs & Stories (Storybook)

Stories are the executable contract of a Block: every variant and state, rendered in isolation, reviewed in PRs, and run as tests. Package and import names changed across Storybook majors (8 → 9 → 10) — confirm with the docs for the version in `project-profile.md`.

## 0. When to use / when not

| Use Storybook when | Skip it when |
|---|---|
| A design system or a shared `blocks/` layer consumed by ≥ 2 features or apps | A small app where Blocks are few and tests already render every state |
| Designers/QA review components without running the app | Prototypes and throwaway UIs |
| Visual regression is wanted per component rather than per page | The team will not maintain stories (stale stories are worse than none) |
| Many states (loading/empty/error/long text/RTL/dark) must stay visible | — |

Minimum without Storybook: a `*.test.tsx` that renders each state (fe-test) and an MDX/README usage note per Block.

## 1. Setup rules

- Framework package matching the stack (e.g. `@storybook/nextjs-vite` for Next.js, `@storybook/react-vite` for Vite) so aliases, CSS and `next/image`/`next/link` work — verify names for your major.
- Stories live next to the component: `button.tsx` + `button.stories.tsx` (+ `button.test.tsx`). Stories only for **Blocks and primitives**; Features (data-bound) get tests, not stories, unless the data layer is mocked with MSW.
- Global decorators provide what Blocks need: theme/tokens CSS, i18n provider with test messages, router mock. Nothing fetches in a story.
- Component Story Format 3: `Meta` + `StoryObj`, `args` for props, `argTypes` for controls, `parameters` for layout/viewport/a11y.

```tsx
// src/components/blocks/button/button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";      // "@storybook/nextjs-vite" in a Next.js project
import { expect, fn, userEvent, within } from "storybook/test"; // "@storybook/test" on Storybook 8 — verify
import { Button } from "./button";

const meta = {
  title: "Blocks/Button",
  component: Button,
  args: { children: "Save", variant: "primary", onClick: fn() },
  argTypes: { variant: { control: "select", options: ["primary", "secondary", "ghost"] } },
  parameters: { layout: "centered" },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
export const LongLabel: Story = { args: { children: "Lưu thay đổi và tiếp tục sang bước tiếp theo của quy trình" } };
export const RTL: Story = { parameters: { direction: "rtl" } };
export const Clicks: Story = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: /save/i }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
```

## 2. Story set per Block (minimum)

| Story | Purpose |
|---|---|
| Default | The common case with no props |
| One per variant and size | Catalogue; controls cover the rest |
| Loading / empty / error (if the Block has them) | Matches the 4-state rule (fe-skel) |
| Long text, RTL, dark theme | Layout safety (fe-i18n, fe-layout) |
| Keyboard focus state | Visible focus (fe-a11y) |
| One `play` story per interactive behaviour | Executable contract (§3) |

`StoryObj<typeof meta>` makes stories fail type-check when props change — this is the drift guard.

## 3. Stories as tests

- **Interaction tests**: `play` functions run in a real browser through the Vitest addon (`@storybook/addon-vitest` on recent majors — verify) in CI: `vitest --project storybook`. They replace many Testing Library component tests for Blocks; keep Testing Library for Features and hooks (fe-test).
- **Accessibility**: `@storybook/addon-a11y` runs axe per story; configure it to fail the test run on violations.
- **Visual regression**: screenshots per story (Chromatic, or Playwright against the built Storybook) instead of per page where components are the unit (fe-test test-recipes §6).
- **Coverage**: stories count as rendered code in coverage reports when run through Vitest; use that to find Blocks with no story.

## 4. Docs

- Autodocs (`tags: ["autodocs"]`) generate the props table from TypeScript; JSDoc on props becomes the description (fe-code component-api.md §2).
- An MDX page per design-system area states usage rules (when to use which variant, do/don't, copy guidelines from fe-ux) — rules, not repeated prop tables.
- Publish the built Storybook per PR (preview deploy, fe-ship) and link it in the PR template (engineering-workflow.md §4).

## 5. Pitfalls

| Pitfall | Fix |
|---|---|
| Stories mock data by hand for Features | Keep stories to Blocks; if a Feature story is needed, MSW handlers generated from the API spec (fe-data api-contracts.md) |
| Story-only props or test ids leak into components | Stories use public props; queries by role/name |
| Build slow / breaks on framework upgrades | Keep Storybook on the same bundler as the app (Vite-based frameworks); upgrade with the app, with fe-review for breaking changes |
| Stories drift from design tokens | Decorators import the real global CSS; no story-local styles |
| Nobody looks at it | Link the preview in every UI PR; a11y + interaction tests fail CI, so stories stay honest |

## 6. Verify

- Every Block has at least Default + variants + long-text stories; type-check passes with `StoryObj<typeof meta>`.
- `vitest --project storybook` (or the project's equivalent) runs the `play` stories in CI and fails on an a11y violation (prove with a deliberate violation once).
- Built Storybook deploys per PR; PR template links it.
- No fetches in stories (network tab empty while browsing stories).
