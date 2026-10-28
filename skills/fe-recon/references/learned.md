# Learned notes — fe-recon

Append-only. Written by the learning loop ([learning-loop.md](../../fe-andy/references/learning-loop.md)); folded into the skill by the fe-learn skill.
Only reusable, proven, non-duplicate lessons. No secrets, client names, or machine paths.

<!-- Add notes below this line, newest at the bottom. -->

### 2026-10-26 · Next.js 16 Proxy convention replaces middleware.js
- **Type:** version-note
- **Rule:** When surveying routing and request interception in Next.js 16+, check for `proxy.js` or `src/proxy.js` instead of `middleware.js`.
- **Why / evidence:** In Next.js 16, `middleware.js` was officially renamed to `proxy.js` (Proxy) to disambiguate from Node.js backend middleware. It lives at project root or under `src/` and exports a default proxy function with `config.matcher`.
- **Example:**
  ```javascript
  // src/proxy.js in Next.js 16+
  export default function proxy(request) { return NextResponse.next(); }
  export const config = { matcher: "/((?!api|_next|.*\\..*).*)" };
  ```
- **Applies to:** Next.js >= 16.0.0
- **Related:** none
- **Status:** promoted (2026-10-28 -> SKILL.md §1 Steps)
