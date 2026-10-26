---
name: fe-recon
description: >
  Survey and map an unfamiliar frontend codebase in READ-ONLY mode: identify framework stack,
  directory layout, rendering strategies (CSR/SSR/SSG/ISR), data/state management flows, and potential risk zones.
  Use when: onboarding to a new or unfamiliar frontend repository, surveying architecture before planning refactors,
  or compiling comprehensive project reconnaissance reports.
  DO NOT USE FOR: Modifying or editing source code (see fe-code or fe-clean);
  DO NOT USE FOR: In-depth mathematical color contrast verification (see fe-contrast).
---

# `fe-recon` — Read-Only Architecture Reconnaissance

Specialized skill for rapidly surveying and mapping frontend codebases without mutating any files, generating structured architectural reconnaissance summaries. Strictly follows [conventions.md](../fe-andy/references/conventions.md).

---

## 1. Standard Reconnaissance Report Template

When executing `fe-recon`, output must conform to this standardized structure:

```markdown
# 🗺️ ARCHITECTURE RECONNAISSANCE REPORT: [Project Name]

### 1. Technology Stack Overview
- **Framework & Core**: Next.js (App / Pages Router) / Vite / React Version
- **Styling Architecture**: Tailwind CSS (v3 / v4), CSS Modules, HeroUI, Radix, Shadcn
- **State Management**: Redux Toolkit / Zustand / Context API
- **Data Fetching / Cache Layer**: SWR / TanStack Query / Server Actions
- **Forms & Validation**: React Hook Form / Zod / Native actions

### 2. Directory Hierarchy & Architectural Layering
- Primary source root: `src/` or repository root
- Layering pattern: Feature-driven, domain-driven, or monorepo
- Token & Global declarations: `globals.css` / theme tokens

### 3. Rendering Strategy & Data Lifecycle
- Routing: Dynamic localized segments (`/[locale]`), route handlers
- Rendering: SSR, Static Generation, Client boundary partitions (`"use client"`)
- Data Services: Service layer abstractions, API client configurations

### 4. Risk Hotspots & Protected Zones
- Oversized modules (> 500 lines)
- Financial calculation, valuation, and transaction flows
- Potential performance bottlenecks and legacy anti-patterns
```

---

## 2. Strict Constraints
- ❌ STRICTLY PROHIBITED from running write, delete, or installation commands (`npm install`, `rm`, file edits).
- ❌ Restrict tooling strictly to safe read-only operations (`git status`, directory listings, file reads).
