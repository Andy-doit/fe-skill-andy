# Learned notes — fe-code

Append-only. Written by the learning loop ([learning-loop.md](../../fe-andy/references/learning-loop.md)); folded into the skill by the fe-learn skill.
Only reusable, proven, non-duplicate lessons. No secrets, client names, or machine paths.

<!-- Add notes below this line, newest at the bottom. -->

### Note 2026-11-15: HAINIVA Agent SDK & ES256 IEEE-P1363 Signing
- **Problem:** HAINIVA Agent assertion requires RFC 7519 / JOSE compliant ES256 signatures (raw 64-byte r||s), whereas Node.js `crypto.sign` outputs ASN.1/DER by default.
- **Solution:** Pass `{ key, dsaEncoding: 'ieee-p1363' }` in `crypto.sign('sha256', data, { key, dsaEncoding: 'ieee-p1363' }).toString('base64url')` for zero-dependency RFC compliance.
- **SSR Safety:** Always dynamically import `@hainiva/agent-sdk/embed` (`mountDesk`) and `@hainiva/agent-sdk/web` (`joinCallRoom`) inside client components or `useEffect` to avoid Next.js SSR window/DOM errors.
