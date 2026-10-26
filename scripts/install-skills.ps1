<#
.SYNOPSIS
  Link the fe-skill-andy skills into Claude Code, Codex and Antigravity skill folders (Windows junctions, no admin).

.DESCRIPTION
  One source of truth: <repo>\skills. Each skill folder gets a junction in each tool's personal skills folder.
  Existing entries with the same name are never overwritten (reported as "skip").
  Learned notes written by any tool land in the repo, because junctions point back to it.

.PARAMETER Tools
  claude, codex, antigravity, antigravity-cli, or all (default: all).

.PARAMETER IncludeLegacy
  Also link into legacy folders (~\.codex\skills, ~\.gemini\antigravity\skills) for older tool versions.

.PARAMETER Uninstall
  Remove only junctions that point into this repo's skills folder.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\install-skills.ps1
  powershell -ExecutionPolicy Bypass -File scripts\install-skills.ps1 -Tools codex,antigravity
  powershell -ExecutionPolicy Bypass -File scripts\install-skills.ps1 -Uninstall
#>
param(
  [string[]]$Tools = @("all"),
  [switch]$IncludeLegacy,
  [switch]$Uninstall
)

$ErrorActionPreference = "Stop"
$Src = (Resolve-Path (Join-Path $PSScriptRoot "..\skills")).Path
$HomeDir = $env:USERPROFILE

# Paths per tool (reported for Oct 2026; confirm against your installed versions).
$Targets = [ordered]@{
  "claude"          = @("$HomeDir\.claude\skills")
  "codex"           = @("$HomeDir\.agents\skills")
  "antigravity"     = @("$HomeDir\.gemini\config\skills")
  "antigravity-cli" = @("$HomeDir\.gemini\antigravity-cli\skills")
}
if ($IncludeLegacy) {
  $Targets["codex"] += "$HomeDir\.codex\skills"
  $Targets["antigravity"] += "$HomeDir\.gemini\antigravity\skills"
}

$Selected = if ($Tools -contains "all") { $Targets.Keys } else { $Tools }
$Skills = Get-ChildItem $Src -Directory | Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") }

foreach ($tool in $Selected) {
  if (-not $Targets.Contains($tool)) { Write-Warning "Unknown tool '$tool' (use: $($Targets.Keys -join ', '), all)"; continue }
  foreach ($dst in $Targets[$tool]) {
    Write-Host "`n== $tool -> $dst"
    if ($Uninstall) {
      if (-not (Test-Path $dst)) { Write-Host "  (folder not found)"; continue }
      Get-ChildItem $dst | Where-Object { $_.LinkType -eq "Junction" -and "$($_.Target)".StartsWith($Src) } | ForEach-Object {
        $_.Delete(); Write-Host "  removed: $($_.Name)"
      }
      continue
    }
    New-Item -ItemType Directory -Force $dst | Out-Null
    foreach ($s in $Skills) {
      $p = Join-Path $dst $s.Name
      if (Test-Path $p) {
        $item = Get-Item $p
        if ($item.LinkType -eq "Junction" -and "$($item.Target)" -eq $s.FullName) { Write-Host "  ok (already linked): $($s.Name)" }
        else { Write-Warning "  skip (exists, not ours): $p" }
      } else {
        New-Item -ItemType Junction -Path $p -Target $s.FullName | Out-Null
        Write-Host "  linked: $($s.Name)"
      }
    }
    $sibling = Test-Path (Join-Path $dst "fe-andy\references\conventions.md")
    Write-Host "  shared conventions reachable: $sibling"
  }
}

if (-not $Uninstall) {
  $node = Get-Command node -ErrorAction SilentlyContinue
  if ($node) {
    Write-Host "`n== Health check"
    & node (Join-Path $Src "fe-andy\scripts\check-skills.mjs") $Src
  } else {
    Write-Host "`n(Node.js not found: skipped health check)"
  }
}
