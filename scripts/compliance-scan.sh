#!/usr/bin/env bash
# Compliance language guard.
#
# Fails CI if prohibited investment/yield language appears in user-facing
# product surfaces (apps and example apps). YNKLV is positioned as a UTILITY
# token — copy must never promise profit, yield, or returns.
#
# Documentation under docs/ and compliance/config files are intentionally
# EXEMPT: they discuss what must NOT be said, and enumerate the banned terms.

set -euo pipefail

# Egregious phrases that should never appear in product copy.
PATTERNS=(
  "guaranteed returns"
  "guaranteed profit"
  "passive income"
  "get rich"
  "to the moon"
  "risk-free"
  "guaranteed yield"
)

# Only scan user-facing surfaces.
SCAN_DIRS=("apps" "examples")

# Files/dirs exempt from the scan (they legitimately reference banned terms).
EXEMPT_REGEX="(compliance|COMPLIANCE|\.test\.|\.spec\.)"

# Negation cues. A banned phrase NEGATED on the same line is anti-speculative
# messaging (e.g. 'No "guaranteed returns"') and is allowed.
NEGATION_REGEX="\b([Nn]o|[Nn]ot|[Nn]ever|[Ww]ithout|[Zz]ero)\b|n't"

found=0
for dir in "${SCAN_DIRS[@]}"; do
  [ -d "$dir" ] || continue
  for pat in "${PATTERNS[@]}"; do
    # -r recursive, -i case-insensitive, -n line numbers, -I skip binaries.
    if matches=$(grep -rinI --include='*.ts' --include='*.tsx' --include='*.md' \
        --include='*.json' "$pat" "$dir" 2>/dev/null \
        | grep -vE "$EXEMPT_REGEX" \
        | grep -vE "$NEGATION_REGEX" || true); then
      if [ -n "$matches" ]; then
        echo "✗ Prohibited language '$pat' found (as a promise, not a denial):"
        echo "$matches"
        found=1
      fi
    fi
  done
done

if [ "$found" -ne 0 ]; then
  echo ""
  echo "Compliance scan FAILED. Remove investment/yield language from product copy."
  echo "See docs/31-legal-regulatory-resilience.md for approved framings."
  exit 1
fi

echo "✓ Compliance language scan passed — no prohibited investment language found."
