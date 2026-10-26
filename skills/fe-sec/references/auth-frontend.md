# Auth on the Frontend

Golden rule: **UI is only affordance. The frontend shapes the experience; the server enforces access.** Every protected API, route handler, loader and Server Action must check the session and the permission for the specific resource itself, every time.

## 0. UI is only affordance

Hiding a button, a menu item or a route by role is a UX decision. It stops nothing: the API can be called directly with `fetch`/curl, client state can be edited in DevTools, bundles can be read, and Server Actions are public HTTP endpoints even when no page imports them.

| Anti-pattern (client-side "security") | Why it fails | Do instead |
|---|---|---|
| `{user.role === "admin" && <DeleteButton />}` with an API that trusts the request | Anyone can send the delete request | Server handler loads the session, checks `can(user, "delete", resource)`, returns 403 otherwise. The UI condition stays for UX only |
| Role read from a JWT decoded in the browser and used to grant access | The browser can forge or edit the decoded object; the server never checked | The server verifies the token signature and reads the role from its own session/DB on every request |
| "Private" route with no link to it | URLs are guessable; crawlers and history leak them | Server-side check in the route (Server Component, loader, handler); middleware/proxy only redirects |
| Next.js middleware/proxy as the only guard | Middleware can be bypassed (CVE-2025-29927 in affected versions) and does not know resource ownership | A data-access layer (`requireUser()`, ownership check) called by every page, action and handler |
| Feature flag or plan tier evaluated in the client to unlock paid features | Flags are editable client state | Entitlements enforced where the feature's data or action lives (server) |
| Admin-only code paths and secrets shipped in the shared bundle | Bundles are public; anyone reads them | Split admin code behind a server-authorized route; never put secrets in client code |
| Client-side check then `router.push("/admin")` | Navigation is not authorization | The `/admin` route itself verifies the session on the server |
| "The mobile/desktop app is trusted" | Desktop and mobile bundles are extractable; TLS pinning is not auth | Same server-side checks as the web; the shell's privileged process validates its own inputs (desktop-apps.md) |

**Review rule:** for every role-gated element found by the `role ===`/`isAdmin`/`can(` grep (checklist §1), write down the server check that backs it. No server check named → Critical finding.

## 1. Session and token storage

| Option | Pros | Cons / rules |
|---|---|---|
| HttpOnly + Secure + SameSite cookie session (set by server) | Not readable by JS → XSS cannot steal it | Needs CSRF defence for cookie-auth mutations (checklist §4) |
| Access token in memory + refresh token in HttpOnly cookie | Short-lived token, refresh not exposed to JS | Must refresh on reload; handle concurrent refresh |
| Token in `localStorage`/`sessionStorage` | Simple | Any XSS can steal it — avoid for long-lived tokens |

Prefer the first option when the backend allows it. Desktop apps: store refresh tokens in the OS keychain through the privileged process (Electron `safeStorage`, Tauri keyring/stronghold plugins), never in renderer-accessible storage.

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
| Middleware / edge (e.g. Next.js `middleware.ts`/proxy) | Fast redirect of unauthenticated users; keep it light; it is **not** the authorization layer |
| Server Component / loader / route handler / Server Action | Real check: read session, verify permission for the resource, return 401/403 or redirect |
| Client guard (hook/HOC) | UX only: show spinner/redirect while session loads; never the only check |

Avoid flashing protected content before redirect: decide on the server where possible.

**Server Actions:** each action is an endpoint. Validate input (schema), load the session inside the action, check ownership/permission, and never trust ids or roles passed from the form. Keep `serverActions.allowedOrigins` tight.

## 4. Role-based UI

- Hide or disable actions the user cannot perform, based on permissions from the server (not hard-coded role names scattered in components): one `can(user, action, resource)` helper, fed by server-provided permissions.
- Still expect the server to reject; handle 403 with a clear message and no retry (fe-data).
- Do not ship admin-only code paths with secrets in the client bundle.

## 5. Logout

- Call the server to invalidate the session; clear client caches (query cache, stores, persisted state); redirect.
- Broadcast to other tabs (`BroadcastChannel` or `storage` event) so they log out too.

## 6. Login protocols: OAuth 2.1 / OIDC with PKCE, SSO, passkeys, MFA

| Situation | Use |
|---|---|
| Your backend owns identities | Backend login endpoint → HttpOnly session cookie (§1); frontend posts credentials over HTTPS, nothing else |
| External identity provider (company SSO, social login) | **OpenID Connect, Authorization Code flow + PKCE**, exchanged **server-side** (BFF) — the browser never holds provider tokens |
| Passwordless / phishing-resistant | Passkeys (WebAuthn) with a server-generated challenge; keep a fallback method |
| Extra factor | TOTP / OTP / passkey as second factor; UI rules below |

### 6.1 OAuth 2.1 / OIDC on the frontend (rules)
- Only **Authorization Code + PKCE**. Never the implicit flow (tokens in the URL fragment) or the password grant. This matches the IETF "OAuth 2.0 for Browser-Based Apps" best-current-practice direction — verify the current RFC/BCP status.
- `state` is random per login and checked on callback (CSRF); `nonce` is bound to the `id_token` (replay). Redirect URIs are registered exactly, no wildcards.
- **Preferred topology: BFF.** The server (Next.js route handler, or a small Node service for Vite/plain React) starts the flow, receives the callback, exchanges the code with the client secret, validates the `id_token`, stores tokens server-side, and sets an HttpOnly `SameSite=Lax` session cookie. The browser only ever sees the session cookie. Refresh happens server-side.
- If a SPA must talk to the provider directly (no backend available): use a maintained library (e.g. `oidc-client-ts` or the provider's SDK), keep tokens **in memory only**, use refresh-token rotation with short lifetimes, and avoid iframe "silent renew" (blocked by third-party cookie restrictions). Record the accepted risk in `project-profile.md`.
- `returnTo` after login: validated relative path (checklist §5), stored server-side or inside the signed `state`, never trusted from the callback URL alone.
- Never hand-roll token validation, PKCE, or JWT parsing in the browser; never log `code`, tokens or `id_token` claims (checklist §7).

### 6.2 Next.js / Vite / plain React
| | Next.js (App Router) | Vite + React / plain React |
|---|---|---|
| Start login | Route handler builds the authorization URL (PKCE verifier stored in an HttpOnly cookie or server session) and redirects | BFF endpoint `/auth/login` does the same |
| Callback | `app/api/auth/callback/route.ts` exchanges the code server-side, sets the session cookie, redirects to the validated `returnTo` | BFF `/auth/callback` |
| Session read | DAL `getUser()` (§3) in pages, actions, handlers | BFF `/auth/me` consumed by the query cache (fe-data); 401 → login |
| Libraries | Auth.js or the provider SDK with route handlers; keep its session strategy cookie-based | Same BFF with Passport/openid-client, or the provider SDK on the server |

### 6.3 SSO and logout
- Logout order: invalidate the local session (server) → clear client caches and other tabs (§5) → redirect to the provider's `end_session_endpoint` with an allow-listed `post_logout_redirect_uri` (RP-initiated logout) when SSO sign-out is required.
- Front-channel/back-channel logout notifications from the provider are handled by the server, which revokes the session; the frontend just sees a 401 on the next request.
- Multi-tenant SSO: tenant discovery by verified email domain on the server, never by a client-side list.

### 6.4 Passkeys (WebAuthn) and MFA UI
- Flow: server creates the challenge → browser calls `navigator.credentials.create()` (register) / `.get()` (login), ideally via `@simplewebauthn/browser` → server verifies the signature and stores the credential. The frontend never interprets the credential.
- Feature-detect `window.PublicKeyCredential`; offer conditional UI (`<input autocomplete="username webauthn">`) so passkeys appear in the browser's autofill; keep password or OTP as fallback and let users manage (list/remove) their passkeys.
- OTP inputs: `inputmode="numeric"`, `autocomplete="one-time-code"`, paste support, resend with a visible cooldown, no enumeration (same message whether the account exists or not). Copy: fe-ux ux-writing.
- Remember-device decisions are set server-side in an HttpOnly cookie; the UI only shows the checkbox.

## 7. Checklist

- [ ] Server checks auth + permission on every protected endpoint/action/loader, including resource ownership
- [ ] Login uses Authorization Code + PKCE via a BFF; no implicit/password grant; `state` and `nonce` verified; redirect URIs exact
- [ ] Provider tokens never reach the browser (or, for a pure SPA, memory-only with rotation and a recorded accepted risk)
- [ ] Logout invalidates server session, clears tabs, and performs RP-initiated logout when SSO requires it
- [ ] Passkey/OTP UI follows §6.4 (feature detection, fallback, no account enumeration)
- [ ] Every role-gated UI element maps to a named server check (§0 review rule)
- [ ] No long-lived tokens in web storage; desktop tokens in the OS keychain
- [ ] Cookies: HttpOnly, Secure, SameSite set
- [ ] Single-flight refresh; failure → clean logout
- [ ] `returnTo` validated (no open redirect)
- [ ] Role-based UI uses server-provided permissions
- [ ] Logout clears caches and other tabs
- [ ] Tokens never logged or sent to analytics/error trackers
