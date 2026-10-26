# UX Writing — labels, errors, empty states

## 1. Principles

- Clear over clever. Use the user's words. Front-load the important word.
- Sentence case for UI text. Short: buttons 1–3 words, messages ≤ 2 short sentences.
- Same thing, same word everywhere ("Delete" vs "Remove" — pick one per meaning).
- All copy goes through the i18n system if the project has one (fe-i18n); leave room for longer translations.

## 2. Buttons and links

| Rule | ❌ | ✅ |
|---|---|---|
| Verb + object | OK, Submit | Save changes, Create project |
| Match the outcome | Continue (on a pay step) | Pay 250.000 ₫ |
| Links say where they go | Click here | View billing history |
| Destructive actions name the object | Delete | Delete project |
| Paired actions are distinct | Yes / No | Discard draft / Keep editing |

## 3. Error messages

Formula: **what happened + why (if useful) + how to fix**. No blame, no codes alone, no "Oops".

| ❌ | ✅ |
|---|---|
| Invalid input | Enter an email like name@example.com |
| Error 500 | We couldn't save your changes. Try again in a moment. |
| Password invalid | Password needs at least 8 characters, including a number |
| Upload failed | This file is 12 MB. Upload a file up to 5 MB. |
| Network error | You're offline. We'll save when you're back online. |

Put the message next to the problem; keep technical details (request id) in a secondary "Details" area for support.

## 4. Empty states

Three types, three messages:

| Type | Content |
|---|---|
| First use | What this area is for + the first action ("No projects yet. Create your first project to start tracking tasks." + [Create project]) |
| No results | Why + how to change it ("No results for 'abc'. Check the spelling or clear filters." + [Clear filters]) |
| Cleared/done | Positive confirmation ("All caught up.") |

## 5. Loading, success, confirmation

- Loading longer than ~1 s: say what is happening ("Loading invoices…").
- Success: confirm the result, not the action ("Changes saved", "Invite sent to an@example.com").
- Toasts: one line; include Undo when possible; do not put critical errors only in toasts that disappear.

## 6. Checklist

- [ ] Every button is verb + object
- [ ] Every error tells how to fix
- [ ] Every empty state has a next action
- [ ] No internal jargon or codes shown alone
- [ ] Copy is in the i18n files, both locales filled
