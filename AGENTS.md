# Andy Frontend Agent Rules & Session Continuity Protocol

Mandatory operational guidelines for AI Agents working within this repository and across Andy's frontend projects.

---

## 🔄 MANDATORY WORK LOG & SESSION CONTINUITY PROTOCOL

To ensure seamless continuity between conversations and uninterrupted progress across multi-agent workflows:

### 1. Session Bootstrap (Start of Conversation)
- **Mandatory Action:** Before executing tasks or responding to complex instructions, the agent **MUST READ** [`work_log.md`](file:///D:/Work/AI/starci-fe-skills/work_log.md) (the first 50–80 lines containing the latest entries).
- **Objectives:**
  - What was accomplished in the preceding session?
  - Which files were recently modified?
  - Which architectural decisions were locked in?
  - What pending items or blockers require continuation?

### 2. Task Wrap-Up (End of Task)
- **Mandatory Action:** Prior to notifying the user of completion, the agent **MUST PREPEND** a new entry at the **TOP** of the list in [`work_log.md`](file:///D:/Work/AI/starci-fe-skills/work_log.md) (immediately under `## 📜 Work Log History (Newest First)`).
- **Standard Entry Format:**
  ```markdown
  ### [YYYY-MM-DD HH:mm] <Task Name / Brief Title>
  - **Objective / Requirements:** <Summary of user request>
  - **Files Changed:**
    - Created / Modified: <clickable markdown file links>
  - **Architectural & Design Decisions:** <Technical rationale and rules applied>
  - **Status & Next Steps:** <Current verification state and upcoming roadmap>
  ```

---

## 📸 IMAGE-TO-PROMPT APPROVAL PROTOCOL

> **Whenever a user provides a UI image (screenshot, design mockup, bug screenshot) and requests layout adjustments:**
> **THE AGENT IS STRICTLY PROHIBITED FROM MODIFYING CODE IMMEDIATELY!**

### Mandatory 4-Step Sequence:
1. **Deep Visual Inspection**:
   - Inspect pixels on a 4px grid: Container caps (`max-w-*`), spacing scale (`0·2·3·4·6`), row height balancing, icon-text alignment, and color tokens.
   - Locate the exact file and component in source code corresponding to the visual region.
2. **Draft a Structured Action Proposal (Prompt for Approval)**:
   - Present a clear, structured plan for user review:
     - **Current State vs. Image Target**: Contrast existing code against the image.
     - **Class Replacements**: Explicit table of classes to change (gap, padding, flex-1, mt-auto).
     - **Files Affected**: Clickable file links.
3. **Await User Approval**:
   - Pause execution and request confirmation: *"I have analyzed the image and compiled the structured proposal above. Please review and confirm before I proceed with modifying the code."*
4. **ONLY Modify Code Once Approved**:
   - Only edit source code once the user explicitly confirms ("Proceed", "Approved", "OK").

---

## 🎯 STRICT PIXEL DISCIPLINE (NO "UNIFORM SLAP-ON")

> **Never apply arbitrary spacing or slap identical gap/padding values across all container tiers. Every dimension and alignment must possess mathematical intent on a 4px grid.**

1. **Spacing Hierarchy**: Child spacing is always strictly smaller than parent spacing (`gap-0` < `gap-2` < `gap-3` < `px-4 py-3` < `gap-6`).
2. **Row Height Balancing**: Cards in flex/grid rows must enforce `h-full flex flex-col` with action footers pinned firmly to the bottom (`flex-1`, `mt-auto`).
3. **Optical Icon-Text Alignment**: Always wrap paired elements in `inline-flex items-center gap-2` (fixed icon `size-4/5`, text `min-w-0 truncate`).
4. **Two-Stage Ambient Rhythm**: Maintain seamless multi-stop gradient masks (100–140px) between alternating light and dark/colored sections.
5. **100vh Golden-Ratio Flow**: Center content vertically (`justify-center my-auto`) on 100vh desktop viewports without leaving central empty voids.
