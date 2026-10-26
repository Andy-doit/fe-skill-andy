# Desktop Packaging Security — Electron & Tauri

Defensive configuration for React/Next.js/Vite apps packaged as desktop applications. Defaults and option names change between majors: confirm against the Electron / Tauri docs for the version in `project-profile.md` (fe-review) before applying.

## 0. Threat model in one table

| | Web app in a browser | Desktop shell (Electron / Tauri) |
|---|---|---|
| Impact of one XSS | Session theft, actions as the user, within the origin | **Code execution on the user's machine** if the page can reach Node/OS APIs or an over-privileged bridge |
| Bundle secrecy | Bundle is public | Bundle is public (asar and app bundles are plain archives) |
| Trust boundary | Browser ↔ server | Renderer/webview ↔ privileged process (Electron main / Tauri core) **and** app ↔ server |
| Rule | Sanitize, CSP, server authorizes | All of that, **plus** isolate the renderer and validate every IPC message in the privileged process |

Everything in [checklist.md](./checklist.md) and [auth-frontend.md](./auth-frontend.md) still applies. This file adds the shell-specific rules.

---

## 1. Electron

### 1.1 BrowserWindow baseline

| `webPreferences` option | Required value | Why |
|---|---|---|
| `contextIsolation` | `true` (default since Electron 12) | Preload and page run in separate JS worlds; the page cannot reach preload internals |
| `nodeIntegration` | `false` (default since Electron 5) | The page gets no `require`/Node APIs |
| `sandbox` | `true` (default since Electron 20) | Renderer runs in the Chromium sandbox; preload is limited to a safe subset |
| `webSecurity` | `true` (default) | Same-origin policy stays on; never disable to "fix CORS" |
| `allowRunningInsecureContent` | `false` (default) | No mixed content |
| `nodeIntegrationInWorker`, `nodeIntegrationInSubFrames` | `false` | No Node in workers/iframes |
| `experimentalFeatures`, `enableBlinkFeatures` | unset | No experimental surface |
| `preload` | absolute path to a file you own | The only bridge between page and main |

```ts
// main.ts — never load remote or user-influenced content into a window that has any privileged bridge
import { BrowserWindow, app, session, shell } from "electron";
import path from "node:path";

const win = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
    webSecurity: true,
  },
});
void win.loadFile(path.join(__dirname, "../renderer/index.html")); // local, packaged UI

// Navigation and window creation: deny by default, open https links in the OS browser
win.webContents.on("will-navigate", (e, url) => { if (!url.startsWith("file://")) e.preventDefault(); });
win.webContents.setWindowOpenHandler(({ url }) => {
  if (/^https:\/\/(docs|www)\.example\.com\//.test(url)) void shell.openExternal(url);
  return { action: "deny" };
});

// Permissions: deny unless the feature needs it
session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
  callback(["notifications"].includes(permission));
});
```

### 1.2 Preload: a narrow, typed bridge

```ts
// preload.ts — expose capabilities, not transports
import { contextBridge, ipcRenderer } from "electron";

export type DesktopApi = {
  readSettings: () => Promise<{ theme: "light" | "dark" }>;
  exportReport: (reportId: string) => Promise<{ ok: boolean }>;
  onUpdateAvailable: (cb: (version: string) => void) => () => void;
};

const api: DesktopApi = {
  readSettings: () => ipcRenderer.invoke("settings:read"),
  exportReport: (reportId) => ipcRenderer.invoke("report:export", { reportId }),
  onUpdateAvailable: (cb) => {
    const handler = (_e: unknown, version: string) => cb(version);
    ipcRenderer.on("update:available", handler);
    return () => ipcRenderer.removeListener("update:available", handler);
  },
};
contextBridge.exposeInMainWorld("desktop", api);
```

| Never expose on `window` | Why |
|---|---|
| `ipcRenderer` itself, or `send(channel, ...args)` / `invoke(channel, ...args)` wrappers that take the channel as a parameter | The page can call any channel the main process handles |
| `require`, `process`, `fs`, `child_process`, `shell`, `clipboard` (write of arbitrary data), `app` | Direct OS access from page code |
| Functions that accept file paths, shell commands or URLs without validation in main | The page chooses what runs |
| Objects with prototypes you did not create | Prototype-pollution surface across the bridge |

### 1.3 Main process: validate every IPC message

```ts
// main/ipc.ts — treat every message as untrusted input from the web
import { ipcMain, app, type IpcMainInvokeEvent } from "electron";
import { z } from "zod";
import path from "node:path";

const ALLOWED_SENDER = (url: string) => url.startsWith("file://"); // or your packaged origin / app:// scheme

function guard(event: IpcMainInvokeEvent) {
  if (!ALLOWED_SENDER(event.senderFrame?.url ?? "")) throw new Error("IPC: untrusted sender");
}

const ExportInput = z.object({ reportId: z.string().regex(/^[a-z0-9-]{1,64}$/) });

ipcMain.handle("report:export", async (event, raw: unknown) => {
  guard(event);
  const { reportId } = ExportInput.parse(raw);
  // Paths are built by main from validated ids; never from renderer-supplied paths
  const target = path.join(app.getPath("documents"), "Acme", `${reportId}.pdf`);
  if (!target.startsWith(path.join(app.getPath("documents"), "Acme"))) throw new Error("path escape");
  await exportReportTo(target, reportId);
  return { ok: true };
});
```

Rules: one handler per channel with a fixed, typed schema; check `event.senderFrame.url` (or `event.sender` identity) on every privileged channel; build file paths and shell arguments in main from validated ids; `shell.openExternal` only for `https:` URLs on an allow-list; return typed results and generic error messages (no stack traces to the renderer).

### 1.4 Renderer CSP
Set a CSP for packaged pages (meta tag in `index.html`, or `onHeadersReceived` on the session): `default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'`. No `'unsafe-eval'` (also blocks `eval`-based bundler dev features in production builds). Load third-party content only in a separate, bridge-less window or an OS browser.

### 1.5 Packaging and updates
- **Electron Fuses** (`@electron/fuses`): disable `RunAsNode`, `EnableNodeOptionsEnvironmentVariable`, `EnableNodeCliInspectArguments`; enable `OnlyLoadAppFromAsar` and `EnableEmbeddedAsarIntegrityValidation` where the platform supports it **(verify names for your Electron version)**.
- Code-sign on every platform (and notarize on macOS). Unsigned apps are both a trust and an update-tampering problem.
- Auto-update only over HTTPS with signature verification (the updater's built-in checks or your own); pin the update origin.
- Keep Electron current: each release carries Chromium security fixes. Track the Electron release schedule in the upgrade policy.
- Production builds: devtools not opened by default, no `--remote-debugging-port`, no source maps in the asar (checklist §9).
- Secrets: never in the asar. Per-user secrets go through `safeStorage` (OS-backed encryption) from the main process; API secrets stay on your server behind the user's session.

### 1.6 Legacy flags to remove
`enableRemoteModule`, `@electron/remote` usage, `webviewTag: true` without strict `will-attach-webview` filtering, `nativeWindowOpen`, `allowpopups`, and any `webSecurity: false` or `--disable-web-security` dev shortcut that survived into a build script.

### 1.7 Electron checklist
- [ ] `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, `webSecurity: true` on every window (and `<webview>`)
- [ ] Only packaged local content loaded into privileged windows; remote content in bridge-less windows or the OS browser
- [ ] Preload exposes a typed capability API only; no transports, no Node modules, no channel-as-parameter wrappers
- [ ] Every `ipcMain.handle`/`on` validates the sender and a fixed schema; paths/URLs/commands built in main
- [ ] `will-navigate`, `setWindowOpenHandler`, permission handler: deny by default
- [ ] CSP set for the renderer; no `unsafe-eval`
- [ ] Fuses set; app signed (and notarized); updates signed and over HTTPS
- [ ] No secrets, devtools, debugging ports or source maps in the packaged build
- [ ] `window.require` / `window.process` / `window.ipcRenderer` are `undefined` in the packaged renderer

---

## 2. Tauri (v2)

### 2.1 Model
The frontend runs in the OS webview; privileged code is Rust **commands**; what the frontend may call is declared per window in **capabilities** that reference **permissions** (core and plugin). Least privilege is configured, not assumed.

### 2.2 Capabilities (`src-tauri/capabilities/*.json`)
```json
{
  "identifier": "main-window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "dialog:allow-save",
    "fs:allow-write-text-file",
    { "identifier": "fs:scope", "allow": [{ "path": "$APPDATA/reports/**" }] }
  ]
}
```
- Grant plugin permissions one by one; avoid `*:default` sets that include write or execute you do not use.
- Scope `fs`, `shell`, `http` plugins to specific paths/commands/URLs. Never `$HOME/**` or `**`.
- `remote.urls` (letting remote pages call the IPC) stays absent unless the feature needs it, and then lists only `https:` origins you control **(verify key names for your Tauri version)**.
- One capability file per window/feature; the main window does not inherit a settings window's permissions.

### 2.3 Commands (`#[tauri::command]`)
- Typed arguments deserialized by serde; validate ids/paths/URLs in Rust (no `..`, resolve inside app directories, `https:` only).
- Return typed results and generic errors; never leak file paths or internal errors to the webview.
- Do not accept raw shell strings; call fixed binaries with validated arguments, or use the scoped shell plugin.
- Treat command input as untrusted even though the UI "always sends valid data".

### 2.4 `tauri.conf.json` security section
| Key (v2) | Setting | Why |
|---|---|---|
| `app.security.csp` | A real CSP (`default-src 'self'; script-src 'self'; …`), not `null` | Tauri injects nonces/hashes for its own scripts; the policy limits XSS reach |
| `app.security.assetProtocol.scope` | Only the folders the UI must read | The asset protocol is a file read primitive |
| `app.security.dangerousDisableAssetCspModification` | `false` (default) | Keep CSP applied to assets |
| `app.security.freezePrototype` | `true` | Reduces prototype pollution impact |
| `app.withGlobalTauri` | `false` unless the frontend cannot import `@tauri-apps/api` | Keeps IPC off the global `window` |

### 2.5 Updates and distribution
- Enable the updater only with your signing key (`plugin-updater` public key) and `https:` endpoints; signatures are verified before install.
- Sign installers/bundles per platform; notarize on macOS.
- Keep Tauri, the webview runtime policy and Rust dependencies updated (`cargo audit` in CI alongside `npm audit`).
- No secrets in the bundle; per-user secrets in the OS keychain (keyring/stronghold plugin) accessed through commands; API secrets stay server-side.
- Deep links (`plugin-deep-link`): validate the full URL in Rust before acting on it.

### 2.6 Tauri checklist
- [ ] Capabilities list only the permissions each window uses; fs/shell/http scoped to explicit paths/commands/origins
- [ ] No `remote.urls` unless required; then `https:` origins you control only
- [ ] Every command validates its input in Rust and never builds paths/commands from raw strings
- [ ] `app.security.csp` set; asset scope narrow; `withGlobalTauri` off unless needed
- [ ] Updater signed + HTTPS; bundles signed; `cargo audit` + `npm audit` in CI
- [ ] No secrets, devtools or source maps in the production bundle
- [ ] Deep-link and file-open inputs validated

---

## 3. Shared rules (both shells)

1. The server still authorizes everything (auth-frontend.md §0). A desktop app is not a trusted client.
2. XSS sinks (checklist §8) are Critical in the renderer: sanitize, CSP, no `eval`.
3. External links open in the OS browser via a validated `https:` allow-list, never inside the privileged window.
4. Dependencies: the renderer's npm supply chain and the shell's (Electron version, Rust crates) are both in the audit.
5. Error tracking in desktop builds: scrub file paths and usernames (PII) before sending.

## 4. Verify

- Packaged build: open devtools manually (not shipped open) → `typeof window.require`, `typeof window.process`, `typeof window.ipcRenderer` → `"undefined"`; `window.desktop` (or your bridge) lists only the intended functions.
- Call a privileged IPC/command with a malformed payload from the console → rejected with a generic error; nothing happens on disk.
- Try `window.open("https://evil.example")` and a `javascript:` link → denied / opened in the OS browser only when allow-listed.
- Inspect the packaged archive (`npx @electron/asar list app.asar`, or the Tauri bundle resources): no `.map`, no `.env*`, no secrets.
- Update feed over HTTP or with a bad signature → install refused.
