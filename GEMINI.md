# Andy Frontend Agent Rules & Session Continuity Protocol (Gemini / Antigravity)

Mandatory rules for Google Antigravity & Gemini agents working within this workspace.

---

## 🔄 MANDATORY WORK LOG & CONTINUITY
1. **Start of session:** Always read the first 50–80 lines of [`work_log.md`](file:///D:/Work/AI/starci-fe-skills/work_log.md).
2. **End of task:** Always prepend a new entry to the top of [`work_log.md`](file:///D:/Work/AI/starci-fe-skills/work_log.md) before reporting completion.

---

## 📸 IMAGE-TO-PROMPT APPROVAL PROTOCOL
When given an image: **NEVER EDIT CODE DIRECTLY**. Deeply inspect layout on 4px grid ➔ Draft structured diff proposal ➔ Await user confirmation ➔ Only modify code after approval.

---

## ⚡ CORE LAWS
- **4-Layer Architecture:** Tokens ➔ Primitives ➔ Blocks (Owns style) ➔ Features (Zero custom styling).
- **Measure First, Optimize Later:** Back every performance change with Profiler / Lighthouse evidence.
- **Pixel Discipline:** 4px spacing scale (`0·2·3·4·6`), equal height rows (`h-full` + `mt-auto`).
- **Zero-Lag Motion:** 60–120 FPS, GPU compositing layer isolation (`translate3d`), zero idle spinning.
- **Security:** Zero client secret leaks, strict XSS DOMPurify sanitization.
