# How fe-skill-andy Self-Learns & Retains Session Memory

The core philosophy of `fe-skill-andy`: **force the AI agent to continuously improve over time** across any frontend project by capturing real design decisions, architectural feedback, and session history into structured journals.

---

## The House Knowledge Base (Dynamic Memory)

| Store | Contents | Populated From |
|---|---|---|
| **`decision/<block>.md`** | **Component Decisions** — Why a scenario selected and styled a specific block | User design feedback & choices |
| **`design/`** | **Page-Level UX** — Layout and flow decisions (`<page>.md`) + UX heuristics | Realized UX implementations & web research |
| **`ui/CONTENT.md`** | **Visual System** — Tokens, color palettes, spacing, typography | Design system tokens |
| **`cannon/`** | **Code Canon & Rules** — Enforceable coding standards | Real-world codebase patterns |
| **`work_log.md`** | **Session Continuity & Log** — Chronological audit trail, modified files, pending items | Automated logging at task wrap-up |

---

## The Autonomous Learning Loop

```
1. /fe-ux (Mode 1: Brainstorm)  Read decision/ + design/ + cannon/  +  Web UX Research
                                → Propose 1–3 layout concepts + widget mockups
        │  User selects one + provides feedback
        ▼
2. /fe-ux (Mode 2: Apply)       Build it on-canon compliant with 4-layer architecture
                                → At task wrap-up, AUTOMATICALLY write decisions:
                                  "Scenario → Block Choice → RATIONALE" into decision/,
                                  Page UX into design/, code rules into cannon/,
                                  AND append session summary into work_log.md
        ▼
3. Future Sessions              Next invocation reads the expanded journals → agent acts smarter
```

- **Live Research**: Fresh web UX patterns fetched dynamically during brainstorming.
- **Automated Retention**: Architectural lessons recorded directly without requiring manual merge commands.
- **Session Continuity**: Every new session bootstraps by reading the top of `work_log.md` to prevent lost context.
