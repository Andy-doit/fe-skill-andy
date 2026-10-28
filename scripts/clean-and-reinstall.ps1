<#
.SYNOPSIS
  Clean all old/legacy skill junctions and reinstall fe-skill-andy cleanly into Antigravity (No duplicates).
#>
param(
  [switch]$UninstallOnly
)

$ErrorActionPreference = "Continue"
$Src = (Resolve-Path (Join-Path $PSScriptRoot "..\skills")).Path
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$HomeDir = $env:USERPROFILE

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host " CLEAN & REINSTALL: fe-skill-andy (v2.6.0)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# -----------------------------------------------------------------------------
# 1. CLEAN OLD / DUPLICATE STANDALONE JUNCTIONS
# -----------------------------------------------------------------------------
Write-Host "`n[1/3] Don dep ban cu & junction trung lap..." -ForegroundColor Yellow

# A. Clean legacy ~/.gemini/antigravity/skills
$legacyAgy = Join-Path $HomeDir ".gemini\antigravity\skills"
if (Test-Path $legacyAgy) {
  Get-ChildItem -Path $legacyAgy -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.LinkType -eq "Junction") { (Get-Item $_.FullName).Delete() }
    else { Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue }
  }
  Remove-Item -Recurse -Force $legacyAgy -ErrorAction SilentlyContinue
  Write-Host "  [x] Da xoa legacy folder: $legacyAgy" -ForegroundColor Green
}

# B. Clean standalone fe-* junctions in ~/.gemini/config/skills (tranh duplicate voi plugin)
$cfgSkills = Join-Path $HomeDir ".gemini\config\skills"
if (Test-Path $cfgSkills) {
  Get-ChildItem -Path $cfgSkills -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "fe*" } | ForEach-Object {
    if ($_.LinkType -eq "Junction") {
      (Get-Item $_.FullName).Delete()
      Write-Host "  [x] Da xoa standalone junction: $($_.Name)" -ForegroundColor Green
    } else {
      Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue
      Write-Host "  [x] Da xoa standalone folder: $($_.Name)" -ForegroundColor Green
    }
  }
  # Neu config/skills rong thi xoa luon
  $remaining = Get-ChildItem -Path $cfgSkills -ErrorAction SilentlyContinue
  if (-not $remaining) {
    Remove-Item -Force $cfgSkills -ErrorAction SilentlyContinue
  }
}

# C. Clean ~/.gemini/config/skills.json
$skillsJson = Join-Path $HomeDir ".gemini\config\skills.json"
if (Test-Path $skillsJson) {
  try {
    $raw = Get-Content $skillsJson -Raw | ConvertFrom-Json
    if ($raw.entries) {
      $filtered = @($raw.entries | Where-Object {
        $p = "$($_.path)".Replace("\", "/")
        -not ($p.Contains("fe-skill-andy") -or $p.Contains("starci-fe-skills"))
      })
      $raw.entries = $filtered
      $raw | ConvertTo-Json -Depth 5 | Set-Content -Path $skillsJson -Encoding UTF8
      Write-Host "  [x] Da don dep config: $skillsJson" -ForegroundColor Green
    }
  } catch {
    Write-Warning "Khong the sua skills.json: $_"
  }
}

# D. Clean workspace .agents in repo & other known projects
$workspaces = @(
  (Join-Path $RepoRoot ".agents"),
  "D:\Work\Freelance\DNL\dnl-capital-landing-page\.agents"
)
foreach ($w in $workspaces) {
  if (Test-Path $w) {
    Get-ChildItem -Path $w -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.LinkType -eq "Junction" } | ForEach-Object {
      (Get-Item $_.FullName).Delete()
    }
    Remove-Item -Recurse -Force $w -ErrorAction SilentlyContinue
    Write-Host "  [x] Da xoa workspace .agents: $w" -ForegroundColor Green
  }
}

# E. Clean existing plugin folder if reinstalling
$pluginDir = Join-Path $HomeDir ".gemini\config\plugins\fe-skill-andy"
if (Test-Path $pluginDir) {
  $skillsLink = Join-Path $pluginDir "skills"
  if (Test-Path $skillsLink) {
    if ((Get-Item $skillsLink).LinkType -eq "Junction") {
      (Get-Item $skillsLink).Delete()
    } else {
      Remove-Item -Recurse -Force $skillsLink -ErrorAction SilentlyContinue
    }
  }
  Remove-Item -Recurse -Force $pluginDir -ErrorAction SilentlyContinue
  Write-Host "  [x] Da reset plugin cu: $pluginDir" -ForegroundColor Green
}

if ($UninstallOnly) {
  Write-Host "`n>> Da go bo toan bo thanh cong!" -ForegroundColor Green
  exit 0
}

# -----------------------------------------------------------------------------
# 2. INSTALL CLEAN ANTIGRAVITY PLUGIN (DUY NHAT 1 NGUON)
# -----------------------------------------------------------------------------
Write-Host "`n[2/3] Cai dat Antigravity Plugin sach (v2.6.0)..." -ForegroundColor Yellow

New-Item -ItemType Directory -Force $pluginDir | Out-Null
$pluginJsonSrc = Join-Path $RepoRoot ".antigravity-plugin\plugin.json"
$readmeSrc = Join-Path $RepoRoot "README.md"

if (Test-Path $pluginJsonSrc) {
  Copy-Item -Path $pluginJsonSrc -Destination (Join-Path $pluginDir "plugin.json") -Force
}
if (Test-Path $readmeSrc) {
  Copy-Item -Path $readmeSrc -Destination (Join-Path $pluginDir "README.md") -Force
}

$rulesSrc = Join-Path $RepoRoot ".antigravity-plugin\rules"
if (Test-Path $rulesSrc) {
  $pluginRulesDir = Join-Path $pluginDir "rules"
  New-Item -ItemType Directory -Force $pluginRulesDir | Out-Null
  Copy-Item -Path (Join-Path $rulesSrc "*") -Destination $pluginRulesDir -Force -Recurse
  Write-Host "  [v] Da cai dat Plugin rules (Andy persona & dispatcher)" -ForegroundColor Green
}

$pluginSkillsLink = Join-Path $pluginDir "skills"
New-Item -ItemType Junction -Path $pluginSkillsLink -Target $Src | Out-Null
Write-Host "  [v] Da link Plugin skills -> $Src" -ForegroundColor Green
Write-Host "  [v] Da tao Antigravity Plugin tai: $pluginDir" -ForegroundColor Green

# -----------------------------------------------------------------------------
# 3. HEALTH CHECK & HOAN TAT
# -----------------------------------------------------------------------------
Write-Host "`n[3/3] Kiem tra toan ven..." -ForegroundColor Yellow
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
  & node (Join-Path $Src "fe-andy\scripts\check-skills.mjs") $Src
}

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host " HOAN TAT! KHONG CON DUPLICATE" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Luu y quan trong:" -ForegroundColor Yellow
Write-Host "1. Hay dong hoan toan Antigravity va mo lai (hoac Ctrl+Shift+P -> Developer: Reload Window)."
Write-Host "2. Khi go /fe, moi skill se chi hien duy nhat 1 dong duoi ten plugin."
