# Install Guide (draft) — fe-skill-andy for Claude Code, Codex, Antigravity

- Status: **draft**. Nothing here has been run.
- One source of truth: the repo's `skills/` folder. Each tool gets a link to it.
- **Install the whole set together.** 15 of 16 skills link `../fe-andy/references/conventions.md` (for example `skills/fe-perf/SKILL.md:14`). That link resolves only when `fe-andy` sits beside the other skills.
- Items marked **(needs confirmation)** come from the reference facts in the audit brief (Oct 2026). I could not check them against the versions you have installed.

---

## 1. Source path

The audited repo is at `E:\an\fe-skill-andy`. The brief and `AGENTS.md:12` use `D:\Work\AI\starci-fe-skills`. Pick one (update-plan decision E7) and set it once:

```powershell
$Src = "E:\an\fe-skill-andy\skills"   # or D:\Work\AI\starci-fe-skills\skills
```

The commands below take an `$Exclude` list (empty by default; install all 17 skills).

```powershell
$Exclude = @()
```

**Learning loop and write access:** each skill appends lessons to its own `references/learned.md`. With junctions, those writes land in the source repo (`$Src`), so one copy collects lessons from every tool. If you copy folders instead of linking them, the lessons stay in the copy — run the fe-learn skill there or copy `learned.md` files back.

## 2. Path table

| Tool | Project (repo) path | Personal / global path | Invoke | Status |
|---|---|---|---|---|
| Claude Code | `.claude/skills/<name>/SKILL.md` | `%USERPROFILE%\.claude\skills\<name>\` | `/<name>` | Paths: needs confirmation for your version |
| Codex | `.agents/skills/` (current, parent and root dirs are scanned) | `%USERPROFILE%\.agents\skills\` (older: `%USERPROFILE%\.codex\skills\`) | Name the skill in the prompt (see §5) | needs confirmation |
| Antigravity (App/IDE) | `.agents/skills/<folder>/` (legacy `.agent/skills/`) | `%USERPROFILE%\.gemini\config\skills\` (legacy `...\.gemini\antigravity\skills\`) | `/<name>` | needs confirmation |
| Antigravity (CLI) | same | `%USERPROFILE%\.gemini\antigravity-cli\skills\` | `/<name>` | needs confirmation |

This repo keeps skills at repo-root `skills/`, not `.agents/skills/`. It also ships `.agents/skills.json`, `.claude-plugin/` and `.antigravity-plugin/` manifests. Whether Codex or Antigravity read those manifests is **needs confirmation**. The junction route below does not depend on them.

## 3. Personal install (Windows junctions, no admin)

Each command makes one junction per skill folder. It skips folders that already exist, so it does not overwrite anything.

Note: [Unverified on this machine] NTFS junctions work across local drives (for example `E:` → `C:`). They do not work for network drives.

### Claude Code

```powershell
$Dst = "$env:USERPROFILE\.claude\skills"
New-Item -ItemType Directory -Force $Dst | Out-Null
Get-ChildItem $Src -Directory | Where-Object { $Exclude -notcontains $_.Name } | ForEach-Object {
  $p = Join-Path $Dst $_.Name
  if (Test-Path $p) { Write-Host "skip (exists): $p" }
  else { New-Item -ItemType Junction -Path $p -Target $_.FullName | Out-Null }
}
```

### Codex

```powershell
$Dst = "$env:USERPROFILE\.agents\skills"      # needs confirmation; older Codex: "$env:USERPROFILE\.codex\skills"
# then run the same loop as above
```

### Antigravity (App/IDE)

```powershell
$Dst = "$env:USERPROFILE\.gemini\config\skills"   # needs confirmation; CLI: "$env:USERPROFILE\.gemini\antigravity-cli\skills"
# then run the same loop as above
```

### Remove (undo)

Removing a junction deletes only the link, not the source folder. Check that the path is a junction first:

```powershell
Get-ChildItem $Dst | Where-Object { $_.LinkType -eq "Junction" } | Select-Object Name, Target
# then for a single one:
# (Get-Item "$Dst\fe-perf").Delete()
```

## 4. Project-level alternative

Use this when one app repo should carry the skills for everyone on the team.

1. Copy (or add as a git submodule) the `skills/*` folders into `<app-repo>\.agents\skills\`. Codex and Antigravity read this path (needs confirmation).
2. For Claude Code, link the same folders into `<app-repo>\.claude\skills\`:

```powershell
$Proj = "C:\path\to\app-repo"
$SrcProj = "$Proj\.agents\skills"
$DstProj = "$Proj\.claude\skills"
New-Item -ItemType Directory -Force $DstProj | Out-Null
Get-ChildItem $SrcProj -Directory | ForEach-Object {
  $p = Join-Path $DstProj $_.Name
  if (-not (Test-Path $p)) { New-Item -ItemType Junction -Path $p -Target $_.FullName | Out-Null }
}
```

Junctions are not stored by git. Teammates on Windows must run step 2 themselves. On macOS/Linux, use `ln -s` (needs confirmation for Claude Code symlink support in your version).

## 5. Example prompts (same skill, each tool)

| Tool | Example |
|---|---|
| Claude Code | `/fe-perf audit the news page` |
| Antigravity | `/fe-perf audit the news page` |
| Codex | `use the fe-perf skill to audit the news page` (needs confirmation: some Codex versions also accept a `$fe-perf` mention) |

Plugin route (Claude Code): if you install via `.claude-plugin/` instead of junctions, the command may be prefixed with the plugin name. Needs confirmation.

## 6. Verify it loaded

| Tool | Check | Expected |
|---|---|---|
| All | `Get-ChildItem $Dst \| Select Name, LinkType, Target` | 15–16 rows, `LinkType = Junction`, targets under `$Src` |
| All | `Test-Path "$Dst\fe-andy\references\conventions.md"` | `True` (sibling link target exists) |
| Claude Code | Start a new session, type `/` and look for `fe-perf`; or run `/skills` if your version has it (needs confirmation) | `fe-perf` listed with its description |
| Codex | Start a new session and ask: "list the skills you can use" (needs confirmation of a dedicated command) | `fe-perf` and siblings named |
| Antigravity | Open a new chat, type `/` (needs confirmation) | `fe-perf` listed |
| All | Prompt: "which skill handles LCP of 3.8s on 4G?" | Agent picks `fe-perf` (matches `skills/fe-andy/evals/routing.md:12`) |

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Skill not detected | Wrong folder for that tool or version | Re-check §2 path; try the legacy path; restart the tool / open a new session |
| Skill not detected | Junction points to a moved or renamed source | `Get-Item "$Dst\fe-perf" \| Select Target`; recreate the junction |
| Skill listed but rules missing | `fe-andy` not installed, so `../fe-andy/references/conventions.md` does not resolve | Install the whole set (do not exclude `fe-andy`) |
| Name mismatch warning or skill ignored | Folder name ≠ frontmatter `name` | All 16 match today; keep them equal when renaming (lowercase, digits, hyphens, ≤64 chars) |
| Description cut off or skill chosen wrongly | Description too long or overlapping | Keep `description` ≤1,024 chars (current max ≈714, `skills/fe-ux/SKILL.md`); fix overlaps listed in coverage-report §6 |
| Script command fails "file not found" | SKILL.md commands assume repo root (`skills/fe-contrast/SKILL.md:50`) | Until update-plan A3 is applied, run from the repo root or use the full script path |
| Duplicate skill shown | Installed both via junction and via plugin/project path | Keep one route per tool |
| Old `merge` skill still listed | Junction created before the rename to `fe-learn` | Remove the stale `merge` junction (see §3 Remove), then re-run the install loop |
| Learned notes never appear in the repo | Skills were copied, not linked, or the folder is read-only | Use junctions, or check write permission on `$Src` |
| Health check | Any doubt about the installed set | `node "$Src\fe-andy\scripts\check-skills.mjs" "$Src"` → expect `PASS` |
