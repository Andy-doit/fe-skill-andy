---
name: fe-sec
description: >
  Audit and remediate Frontend Security vulnerabilities: XSS defense (DOMPurify), client secret leakage (NEXT_PUBLIC_*, VITE_*),
  CSRF defenses, Content Security Policy (CSP), token storage risks (HttpOnly cookies vs localStorage), and supply chain hygiene.
  Use when: auditing frontend security posture, reviewing public form submissions, verifying environment variables,
  or preparing for production deployments.
  DO NOT USE FOR: Backend database authentication or server-side authorization;
  DO NOT USE FOR: Page load performance or bundle optimization (see fe-perf).
---

# `fe-sec` — Frontend Security & Client Vulnerability Defense

Specialized skill for identifying, categorizing, and remediating security risks residing within browser execution contexts and client bundles. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Core Threat Vectors

### 1.1 Client Secret Leakage
- **Universal Rule**: Any environment variable prefixed with `NEXT_PUBLIC_*` or `VITE_*` is statically bundled and visible to all users.
- **Audit**: Never expose database passwords, SMTP credentials, Stripe secret keys, or private signing keys in client code or client-facing `.env` configurations.

### 1.2 Cross-Site Scripting (XSS) Prevention
- Avoid `dangerouslySetInnerHTML` or direct assignments to `innerHTML`.
- If rendering rich text from CMS or external sources is required, sanitize inputs rigorously using `DOMPurify` (or `isomorphic-dompurify` for SSR).
- Ensure all external anchor links (`<a target="_blank">`) specify `rel="noopener noreferrer"` to prevent reverse tabnabbing.

### 1.3 Token Storage & Session Management
- Strongly discourage storing sensitive long-lived tokens in `localStorage` due to XSS vulnerability.
- Recommend secure cookie storage with `HttpOnly`, `Secure`, and `SameSite=Strict` or `Lax` flags.

### 1.4 Security Headers
Audit header configurations in `next.config.mjs` or edge reverse proxies:
- `Content-Security-Policy` (CSP)
- `X-Frame-Options: DENY` (Clickjacking mitigation)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`

---

## 2. Security Audit Protocol (Read-Only ➔ Triage)

1. **Automated & Manual Inspection**: Run vulnerability scans (`npm audit`) and search for sensitive pattern exposures.
2. **Severity Classification**:
   - **Critical**: Secret key exposed in bundle; active unescaped XSS execution. Prioritize at the top of the report.
   - **High**: Unsanitized HTML rendering; sensitive tokens in `localStorage`.
   - **Medium**: Missing security headers; external links without `rel="noopener"`.
3. **Await User Authorization**: Formulate structured remediation plans (e.g. migrating secrets to Server Actions) before modifying code.
