#!/usr/bin/env bash
# Fail if any tracked TypeScript/TSX source file contains U+2014 EM DASH or
# U+2013 EN DASH. The hard rule is that punctuation em-dashes never appear
# in code, comments, translations, or user-visible strings. Hyphens in
# compound identifiers ("drop-in", "co-founder") are fine because they use
# U+002D HYPHEN-MINUS which is not matched.
#
# Runs on the whole src/ tree, not just staged files, so re-running after a
# rebase or squash still catches sneak-in em-dashes.
set -euo pipefail

cd "$(dirname "$0")/.."

matches="$(grep -rn -P '[\x{2013}\x{2014}]' src/ --include='*.ts' --include='*.tsx' || true)"

if [ -n "$matches" ]; then
  echo "check-no-emdash: em-dash (U+2014) or en-dash (U+2013) found in src/. Use a period, comma, or parentheses instead." >&2
  echo "$matches" >&2
  exit 1
fi

exit 0
