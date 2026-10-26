# Test Recipes

Use the tools already in the project. Examples assume Vitest/Jest + Testing Library + Playwright.

## 1. Unit (pure logic)

```ts
import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats VND without decimals", () => {
    expect(formatPrice(250000, "vi-VN", "VND")).toBe("250.000 ₫");
  });
  it("handles zero and negatives", () => {
    expect(formatPrice(0, "en-US", "USD")).toBe("$0.00");
    expect(formatPrice(-5, "en-US", "USD")).toBe("-$5.00");
  });
});
```
Note: `Intl` output can contain non-breaking spaces; compare with `toBe` on normalized strings if needed.

## 2. Component (Testing Library)

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("shows an error and keeps input when email is invalid", async () => {
  const user = userEvent.setup();
  render(<SignupForm onSubmit={vi.fn()} />);
  const email = screen.getByRole("textbox", { name: /email/i });
  await user.type(email, "nope");
  await user.click(screen.getByRole("button", { name: /create account/i }));
  expect(await screen.findByText(/enter an email/i)).toBeInTheDocument();
  expect(email).toHaveValue("nope");
  expect(email).toHaveAttribute("aria-invalid", "true");
});
```
Rules: query by role/label/text (what users perceive), not test ids or classes; use `user-event`, not `fireEvent`, for interactions; test each async state (loading/empty/error/content) by mocking the data layer.

## 3. Network mocking

- Unit/component: MSW (`msw`) handlers if installed, or mock the data hook.
- E2E: Playwright `page.route("**/api/items", (r) => r.fulfill({ status: 500 }))` to force error states.

## 4. E2E (Playwright)

```ts
import { test, expect } from "@playwright/test";

test("user can switch language and keep the section hash", async ({ page }) => {
  await page.goto("/en/services#contact");
  await page.getByRole("button", { name: /language/i }).click();
  await page.getByRole("menuitem", { name: /tiếng việt/i }).click();
  await expect(page).toHaveURL(/\/vi\/services#contact$/);
});
```
Use role locators, web-first assertions (`expect(...).toHaveURL/ toBeVisible`), no fixed `waitForTimeout`.

## 5. Accessibility in E2E

```ts
import AxeBuilder from "@axe-core/playwright";

test("home has no detectable a11y violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations).toEqual([]);
});
```
Automated checks find only part of the issues; pair with the fe-a11y keyboard and screen-reader checks.

## 6. Visual regression

- Playwright: `await expect(page).toHaveScreenshot("pricing.png", { fullPage: true })`; first run creates baselines; commit them.
- Stabilize: fixed viewport, disable animations (`animations: "disabled"`), mask dynamic regions (`mask: [page.locator(".clock")]`), run on one OS in CI (fonts differ).
- Alternatives: Storybook + Chromatic/Loki if the project has Storybook.

## 7. Flaky test triage

Retry once locally to confirm flakiness; look for missing awaits, time-based waits, shared state between tests, unmocked network, animation timing. Fix the cause; do not just raise timeouts.
