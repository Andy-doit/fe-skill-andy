# Where Should State Live?

| Kind | Examples | Put it in | Avoid |
|---|---|---|---|
| **Server state** | Lists, records, user profile from API | Data library cache (SWR / TanStack Query / framework fetch) — see fe-data | Copying into Redux/Zustand/`useState` and syncing by effect |
| **URL state** | Filters, search query, sort, page, active tab, selected item id | `searchParams` / route params (`useSearchParams` + `router.replace`, or `nuqs` if installed) | Local state that is lost on reload/share |
| **Local UI state** | Input text, open/closed for one component, hover | `useState` / `useReducer` in the closest component | Global stores |
| **Shared client state** | Cart, multi-step wizard, overlay manager, theme | Small store (Zustand / Redux Toolkit / context) with selectors | One giant context re-rendering everything |
| **Form state** | Field values, errors, dirty/touched | Form library (React Hook Form) or native form + Server Action | Global stores (unless the form spans pages) |
| **Derived state** | Filtered list, totals | Compute during render (memoize only if measured) | Storing + syncing with `useEffect` |
| **Persistent preferences** | Theme, dismissed banners | `localStorage` behind a hook (read after mount to avoid hydration mismatch) | Storing tokens or personal data |

Decision order: Can it be derived? → Is it from the server? → Should it survive reload/share (URL)? → Is it used by one component (local)? → Otherwise shared store.

Verify: reload and share the URL — filters/tab persist; no duplicated copies of server data in stores (search for store slices that mirror API responses).
