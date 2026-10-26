#!/usr/bin/env sh
# Link the fe-skill-andy skills into Claude Code, Codex and Antigravity skill folders (macOS/Linux symlinks).
# Usage:
#   sh scripts/install-skills.sh                 # all tools
#   sh scripts/install-skills.sh codex claude    # selected tools
#   sh scripts/install-skills.sh --uninstall     # remove links that point into this repo
# Paths are as reported for Oct 2026; confirm against your installed versions.

set -eu
SRC="$(cd "$(dirname "$0")/../skills" && pwd)"
UNINSTALL=0
TOOLS=""
for a in "$@"; do
  case "$a" in
    --uninstall) UNINSTALL=1 ;;
    *) TOOLS="$TOOLS $a" ;;
  esac
done
[ -z "$TOOLS" ] && TOOLS="claude codex antigravity antigravity-cli"

target() {
  case "$1" in
    claude) echo "$HOME/.claude/skills" ;;
    codex) echo "$HOME/.agents/skills" ;;
    antigravity) echo "$HOME/.gemini/config/skills" ;;
    antigravity-cli) echo "$HOME/.gemini/antigravity-cli/skills" ;;
    *) echo "" ;;
  esac
}

for tool in $TOOLS; do
  DST="$(target "$tool")"
  [ -z "$DST" ] && { echo "Unknown tool: $tool"; continue; }
  echo ""
  echo "== $tool -> $DST"
  if [ "$UNINSTALL" = 1 ]; then
    [ -d "$DST" ] || { echo "  (folder not found)"; continue; }
    for l in "$DST"/*; do
      if [ -L "$l" ] && case "$(readlink "$l")" in "$SRC"/*) true ;; *) false ;; esac; then
        rm "$l" && echo "  removed: $(basename "$l")"
      fi
    done
    continue
  fi
  mkdir -p "$DST"
  for s in "$SRC"/*/; do
    s="${s%/}"; name="$(basename "$s")"
    [ -f "$s/SKILL.md" ] || continue
    if [ -e "$DST/$name" ] || [ -L "$DST/$name" ]; then
      if [ "$(readlink "$DST/$name" 2>/dev/null || true)" = "$s" ]; then echo "  ok (already linked): $name"
      else echo "  skip (exists, not ours): $DST/$name"; fi
    else
      ln -s "$s" "$DST/$name" && echo "  linked: $name"
    fi
  done
done

# Sync Antigravity global skills.json
case " $TOOLS " in
  *" antigravity "*)
    GEMINI_CFG="$HOME/.gemini/config"
    GEMINI_JSON="$GEMINI_CFG/skills.json"
    if [ "$UNINSTALL" = 1 ]; then
      if [ -f "$GEMINI_JSON" ] && command -v node >/dev/null 2>&1; then
        node -e '
          const fs = require("fs");
          try {
            const p = process.argv[1];
            const src = process.argv[2];
            const d = JSON.parse(fs.readFileSync(p, "utf8"));
            if (Array.isArray(d.entries)) {
              d.entries = d.entries.filter(e => e.path !== src && !e.path.endsWith("/fe-skill-andy/skills"));
              fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
              console.log("== Antigravity global config: cleaned skills.json");
            }
          } catch (_) {}
        ' "$GEMINI_JSON" "$SRC"
      fi
    else
      mkdir -p "$GEMINI_CFG"
      if command -v node >/dev/null 2>&1; then
        node -e '
          const fs = require("fs");
          const p = process.argv[1];
          const src = process.argv[2];
          let d = { entries: [] };
          try { d = JSON.parse(fs.readFileSync(p, "utf8")); } catch (_) {}
          if (!Array.isArray(d.entries)) d.entries = [];
          d.entries = d.entries.filter(e => e.path !== src && !e.path.endsWith("/starci-fe-skills/skills"));
          d.entries.push({ path: src });
          fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
          console.log("== Antigravity global config: registered in skills.json");
        ' "$GEMINI_JSON" "$SRC"
      fi
    fi
    ;;
esac

if [ "$UNINSTALL" = 0 ] && command -v node >/dev/null 2>&1; then
  echo ""
  echo "== Health check"
  node "$SRC/fe-andy/scripts/check-skills.mjs" "$SRC"
fi
