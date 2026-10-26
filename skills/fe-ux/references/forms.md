# Form UX

## 1. Structure

- One column; labels above fields; group related fields with `<fieldset>` + `<legend>`.
- Visible `<label>` for every field (placeholder is not a label).
- Mark optional fields ("optional") rather than every required field, or mark required consistently — pick one per product.
- Correct input types and keyboards: `type="email" | "tel" | "url" | "number"`, `inputmode="numeric"` for codes.

## 2. Autocomplete

Set `autocomplete` so browsers and password managers can fill:
`name`, `given-name`, `family-name`, `email`, `tel`, `street-address`, `postal-code`, `country`, `organization`, `username`, `current-password`, `new-password`, `one-time-code`, `cc-number` (payment fields only on the payment provider's terms).
Never disable paste in password or code fields.

## 3. Validation & errors

| When | Rule |
|---|---|
| While typing | Do not show errors on the first keystroke; clear an existing error as soon as the input becomes valid |
| On blur | Validate the field the user just left |
| On submit | Validate all; focus the first invalid field; show an error summary at the top for long forms (links to fields) |
| Server errors | Map field errors back to fields; general error near the submit button |
| Always | Keep the user's input; never clear the form on error |

Accessibility hooks: `aria-invalid="true"` on invalid fields, error text linked with `aria-describedby`, error summary in a region that gets focus or `role="alert"` (implementation: fe-a11y).

## 4. Submit button states

Ready → Pending (disabled, spinner or "Saving…", keeps width) → Success (message or redirect) → Error (message, button enabled again). Prevent double submit.

## 5. File upload

- Show accepted types and max size before selection; set `accept=".pdf,.png,image/*"`.
- Drag-and-drop plus a normal button (keyboard accessible).
- Validate type and size on the client for fast feedback **and** on the server (security: fe-sec).
- Progress per file, cancel, retry; preview images; allow remove before submit.
- Clear error messages: "File is 12 MB. Maximum is 5 MB."

## 6. Long and multi-step forms

- Show step count and progress; allow going back without losing data.
- Save drafts for long forms (local storage without sensitive data, or server draft).
- Redundant entry: do not ask for the same information twice in one flow (WCAG 2.2 3.3.7).

## 7. Destructive actions

Prefer undo (toast with "Undo" for ~5–10 s) over confirmation dialogs for reversible actions. Use confirmation only for irreversible ones, and name the object and consequence in the dialog ("Delete project 'Alpha'? This removes 12 files.").
