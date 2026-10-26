# Auth on the Frontend

Golden rule: **the frontend shapes the experience; the server enforces access.** Every protected API/route handler/Server Action must check the session and permission itself.

## 1. Session and token storage

| Option | Pros | Cons / rules |
|---|---|---|
| HttpOnly + Secure + SameSite cookie session (set by server) | Not readable by JS → XSS cannot steal it | Needs CSRF defence for cookie-auth mutations (checklist §4) |
| Access token in memory + refresh token in HttpOnly cookie | Short-lived token, refresh not exposed to JS | Must refresh on reload; handle concurrent refresh |
| Token in `localStorage`/`sessionStorage` | Simple | Any XSS can steal it — avoid for long-lived tokens |

Prefer the first option when the backend allows it.

## 2. Refresh flow

- Refresh shortly before expiry or on a 401, through **one** shared promise so parallel requests do not trigger several refreshes.
- On refresh failure: clear client state, redirect to login with a safe `returnTo` (validated, relative only).
- Rotate refresh tokens on the server; log out everywhere on suspected theft.

```ts
let refreshing: Promise<void> | null = null;
async function withAuth(req: () => Promise<Response>) {
  let res = await req();
  if (res.status !== 401) return res;
  refreshing ??= fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
    .then((r) => { if (!r.ok) throw new Error("refresh failed"); })
    .finally(() => { refreshing = null; });
  await refreshing;
  return req();
}
```

## 3. Route guards

| Layer | Purpose |
|---|---|
| Middleware / edge (e.g. Next.js `middleware.ts`) | Fast redirect of unauthenticated users; keep it light; it is **not** the authorization layer |
| Server Component / loader / route handler | Real check: read session, verify permission, return 401/403 or redirect |
| Client guard (hook/HOC) | UX only: show spinner/redirect while session loads; never the only check |

Avoid flashing protected content before redirect: decide on the server where possible.

## 4. Role-based UI

- Hide or disable actions the user cannot perform, based on permissions from the server (not hard-coded role names scattered in components): one `can(user, action, resource)` helper.
- Still expect the server to reject; handle 403 with a clear message.
- Do not ship admin-only code paths with secrets in the client bundle.

## 5. Logout

- Call the server to invalidate the session; clear client caches (query cache, stores, persisted state); redirect.
- Broadcast to other tabs (`BroadcastChannel` or `storage` event) so they log out too.

## 6. Checklist

- [ ] Server checks auth + permission on every protected endpoint/action
- [ ] No long-lived tokens in web storage
- [ ] Cookies: HttpOnly, Secure, SameSite set
- [ ] Single-flight refresh; failure → clean logout
- [ ] `returnTo` validated (no open redirect)
- [ ] Role-based UI uses server-provided permissions
- [ ] Logout clears caches and other tabs
- [ ] Tokens never logged or sent to analytics/error trackers
