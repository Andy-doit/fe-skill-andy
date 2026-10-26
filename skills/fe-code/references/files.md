# Files — upload, download, clipboard, drag-and-drop

Implementation patterns for the browser side. Server-side validation, storage and serving rules are fe-sec (checklist §5); upload UX and copy are fe-ux (forms §5); drag alternatives for accessibility are fe-a11y. Browser-API support changes — confirm "(verify)" rows with fe-review.

## 0. Choose the upload path

| Size / condition | Path | Why |
|---|---|---|
| ≤ ~10 MB, reliable network | `multipart/form-data` to your BFF/route handler (or Server Action within its body limit) | Simplest; server validates and stores |
| 10 MB – several GB | **Presigned URL**: client asks the server for a short-lived PUT URL, uploads directly to object storage, then confirms | Bytes never pass through your app server; progress available |
| Large files, flaky networks, must survive tab reload | **Resumable**: tus protocol (`tus-js-client`, Uppy) or S3 multipart with per-part presigned URLs | Chunked, retried, resumable from the last chunk |
| Many small files | Presigned URLs in a batch + concurrency limit (3–5 parallel) | Avoids request storms |

Next.js: Server Actions have a request body limit (`serverActions.bodySizeLimit`, verify for your version); for anything beyond small forms, issue presigned URLs from a route handler. Vite / plain React: the BFF issues the URL.

## 1. Upload building blocks

```tsx
// Input: accept narrows the picker (UX only — the server re-checks type by magic bytes, fe-sec §5)
<input type="file" accept="image/png,image/jpeg,application/pdf" multiple onChange={(e) => queue(Array.from(e.target.files ?? []))} />
```

```ts
// Client-side pre-checks (UX): type + size; never the only check
const MAX = 25 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "application/pdf"]);
export function precheck(file: File): string | null {
  if (!ALLOWED.has(file.type)) return "unsupported_type";
  if (file.size > MAX) return "too_large";
  return null;
}

// Presigned PUT with progress + cancel. XHR is used because fetch has no upload progress in most browsers
// (streaming request bodies need `duplex: "half"` and are Chromium-only at writing — verify).
export function uploadToUrl(file: File, url: string, opts: { onProgress: (pct: number) => void; signal: AbortSignal }) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) opts.onProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`upload ${xhr.status}`)));
    xhr.onerror = () => reject(new Error("network"));
    opts.signal.addEventListener("abort", () => { xhr.abort(); reject(new DOMException("aborted", "AbortError")); });
    xhr.send(file);
  });
}
```

Flow: `precheck` → `POST /uploads` (server returns `{ id, url }` after its own policy checks) → `uploadToUrl` → `POST /uploads/:id/complete` (server verifies the object exists, size, type, then creates the record). The optimistic UI (fe-data) shows the item as "uploading"; failure keeps the file in the list with a retry.

Rules: limit concurrency; retry network errors with backoff (fe-data resilience §1), never retry 4xx; keep the `File` object, not a copy, in state; show per-file progress and an overall cancel; resize images client-side before upload when the product only needs thumbnails/web sizes (`createImageBitmap(file, { imageOrientation: "from-image" })` → canvas → `toBlob("image/webp", 0.85)`); strip EXIF server-side for privacy.

## 2. Download

| Case | Pattern |
|---|---|
| Same-origin file | `<a href="/files/report.pdf" download="report.pdf">` — plain link, no JS |
| Server-generated file (PDF, CSV, export) | Server responds with `Content-Disposition: attachment; filename="…"`; the UI navigates/links to it; for long generations, create a job and poll/notify (fe-data) |
| Cross-origin or generated in the browser | `fetch` → `Blob` → `URL.createObjectURL` → programmatic `<a download>` click → **`URL.revokeObjectURL`** afterwards |
| Very large browser-generated files | Stream to disk via File System Access API `showSaveFilePicker()` (Chromium only — verify) with a fallback to Blob download; or generate server-side |
| Authenticated downloads | Cookie session works with same-origin links; for token auth, use a short-lived signed URL from the server instead of putting tokens in `href` |

```ts
export async function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
```
Set the correct MIME type on the Blob (`text/csv;charset=utf-8` with a BOM for Excel-friendly CSV) and sanitize the filename server-side when it comes from user data.

## 3. Clipboard

- Write: `await navigator.clipboard.writeText(text)` — secure context + user gesture; rich content via `navigator.clipboard.write([new ClipboardItem({ "text/plain": new Blob([t], { type: "text/plain" }), "text/html": new Blob([html], { type: "text/html" }) })])`.
- Read: prefer the `paste` event (`e.clipboardData.getData("text/plain")`, files via `e.clipboardData.files`) over `navigator.clipboard.read()` (permission prompt, inconsistent support).
- Feedback: change the button label to "Copied" for ~2 s and announce via `role="status"`; handle rejection (denied permission, insecure context) with a selectable fallback text.
- Never copy secrets automatically; never read the clipboard without a user action.

## 4. Drag-and-drop

**File drop zone**
```tsx
function DropZone({ onFiles }: { onFiles: (f: File[]) => void }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles(Array.from(e.dataTransfer.files)); }}
      className={over ? "border-brand" : "border-border"}>
      <p id="dz-help">Drag files here, or</p>
      <button type="button" aria-describedby="dz-help" onClick={() => inputRef.current?.click()}>Choose files</button>
      <input ref={inputRef} type="file" multiple hidden onChange={(e) => onFiles(Array.from(e.target.files ?? []))} />
    </div>
  );
}
```
Drag is an enhancement; the button + picker is the baseline (keyboard, screen readers, touch).

**Reordering / sortable lists**: use a pointer-based library with keyboard sensors (e.g. `dnd-kit`) rather than HTML5 DnD (poor touch and a11y). WCAG 2.2 2.5.7 (Dragging Movements): provide a non-drag alternative (Move up/down buttons or a position field) and announce moves in a live region ("Item 3 moved to position 1"). Persist order with an optimistic mutation and rollback (fe-data).

## 5. Previews and memory

- Object URLs for previews are revoked when the item is removed or the component unmounts; cap simultaneous previews for large galleries (virtualize, fe-perf).
- Decode images off the main thread with `createImageBitmap`; avoid reading multi-MB files into memory as data URLs.
- Video/audio previews: `URL.createObjectURL(file)` on a `<video>` with `preload="metadata"`.

## 6. Verify

- Upload: 200 MB file shows progress, cancel aborts the request, a dropped connection resumes (resumable path) or retries (presigned path); server rejects a renamed `.exe` as `.png` (fe-sec).
- Download: filename and MIME correct; object URLs revoked (DevTools → Memory shows no growth after 20 downloads).
- Clipboard: works on HTTPS, fails gracefully on HTTP/denied; announced to screen readers.
- Drop zone: keyboard-only user can add files; sortable list reorderable without a mouse; axe clean.
- Bundle: upload/DnD libraries loaded lazily on the routes that use them.
