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

if [ "$UNINSTALL" = 0 ] && command -v node >/dev/null 2>&1; then
  echo ""
  echo "== Health check"
  node "$SRC/fe-andy/scripts/check-skills.mjs" "$SRC"
fi
