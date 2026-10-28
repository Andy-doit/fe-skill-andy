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
  "antigravity-cli" = @("$HomeDir\.gemini\antigravity-cli\skills")
}
if ($IncludeLegacy) {
  $Targets["codex"] += "$HomeDir\.codex\skills"
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

# Clean old standalone junctions and register fe-skill-andy as an Antigravity Plugin
if ($Selected -contains "antigravity" -or $Selected -contains "all") {
  $geminiConfigDir = Join-Path $HomeDir ".gemini\config"
  $geminiSkillsJson = Join-Path $geminiConfigDir "skills.json"
  $legacyAgySkills = Join-Path $HomeDir ".gemini\antigravity\skills"
  $cfgSkillsDir = Join-Path $geminiConfigDir "skills"
  $pluginDir = Join-Path $geminiConfigDir "plugins\fe-skill-andy"

  # Clean old legacy and standalone duplicate junctions
  if (Test-Path $legacyAgySkills) {
    Get-ChildItem -Path $legacyAgySkills -ErrorAction SilentlyContinue | ForEach-Object {
      if ($_.LinkType -eq "Junction") { (Get-Item $_.FullName).Delete() }
      else { Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue }
    }
    Remove-Item -Recurse -Force $legacyAgySkills -ErrorAction SilentlyContinue
  }
  if (Test-Path $cfgSkillsDir) {
    Get-ChildItem -Path $cfgSkillsDir -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "fe*" } | ForEach-Object {
      if ($_.LinkType -eq "Junction") { (Get-Item $_.FullName).Delete() }
      else { Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue }
    }
    $rem = Get-ChildItem -Path $cfgSkillsDir -ErrorAction SilentlyContinue
    if (-not $rem) { Remove-Item -Force $cfgSkillsDir -ErrorAction SilentlyContinue }
  }

  if (Test-Path $geminiSkillsJson) {
    try {
      $json = Get-Content $geminiSkillsJson -Raw | ConvertFrom-Json
      if ($json.entries) {
        $normalizedSrc = $Src.Replace("\", "/")
        $json.entries = @($json.entries | Where-Object {
          $p = "$($_.path)".Replace("\", "/")
          -not ($p.Contains("fe-skill-andy") -or $p.Contains("starci-fe-skills"))
        })
        $json | ConvertTo-Json -Depth 5 | Set-Content -Path $geminiSkillsJson -Encoding UTF8
      }
    } catch {
      Write-Warning "Could not update Antigravity skills.json: $_"
    }
  }

  if ($Uninstall) {
    if (Test-Path $pluginDir) {
      $pSkills = Join-Path $pluginDir "skills"
      if (Test-Path $pSkills) { (Get-Item $pSkills).Delete() }
      Remove-Item -Path $pluginDir -Recurse -Force -ErrorAction SilentlyContinue
      Write-Host "`n== Antigravity: removed plugin $pluginDir"
    }
  } else {
    try {
      if (-not (Test-Path $pluginDir)) { New-Item -ItemType Directory -Force $pluginDir | Out-Null }
      $pluginJsonSrc = Join-Path $Src "..\.antigravity-plugin\plugin.json"
      $readmeSrc = Join-Path $Src "..\README.md"
      if (Test-Path $pluginJsonSrc) { Copy-Item -Path $pluginJsonSrc -Destination (Join-Path $pluginDir "plugin.json") -Force }
      if (Test-Path $readmeSrc) { Copy-Item -Path $readmeSrc -Destination (Join-Path $pluginDir "README.md") -Force }
      $rulesSrc = Join-Path $Src "..\.antigravity-plugin\rules"
      $pluginRulesDir = Join-Path $pluginDir "rules"
      if (Test-Path $rulesSrc) {
        if (-not (Test-Path $pluginRulesDir)) { New-Item -ItemType Directory -Force $pluginRulesDir | Out-Null }
        Copy-Item -Path (Join-Path $rulesSrc "*") -Destination $pluginRulesDir -Force -Recurse
      }
      $pluginSkillsJunction = Join-Path $pluginDir "skills"
      if (Test-Path $pluginSkillsJunction) { (Get-Item $pluginSkillsJunction).Delete() }
      New-Item -ItemType Junction -Path $pluginSkillsJunction -Target $Src | Out-Null
      Write-Host "`n== Antigravity: registered clean plugin (no duplicates) at $pluginDir"
    } catch {
      Write-Warning "Could not register Antigravity plugin: $_"
    }
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
