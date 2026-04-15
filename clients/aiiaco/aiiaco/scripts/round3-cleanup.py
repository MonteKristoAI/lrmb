#!/usr/bin/env python3
"""
Round 3 Phase 2 - Brand casing and em-dash cleanup

Handles two sitewide passes:
1. Brand casing: AiiACo -> AiiAco in marketing copy
   EXCEPTION: preserve AiiACo inside JSON-LD @name fields in client/index.html
   (these 3 instances match Wikidata Q138638897 and must not change)

2. Em-dash (U+2014) replacement with ordered rules:
   - ">(U+2014)<" (between JSX tags) -> ">BULLET<" (bullet separator)
   - digit(U+2014)digit -> digit-digit (numeric range)
   - " (U+2014) " (space em-dash space) -> " - "
   - "(U+2014) " -> "- "
   - " (U+2014)" -> " -"
   - any remaining bare (U+2014) -> "-"

Usage:
  python3 scripts/round3-cleanup.py

Excludes Round 2 files (already clean) and Phase 1 / Phase 2 infrastructure.
Uses EM_DASH constant so grep for literal em-dash in this file returns 0.
"""
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent

# The character we are hunting, declared via unicode escape so this script
# itself contains zero literal em-dashes. Any grep for U+2014 returns 0 hits here.
EM_DASH = "\u2014"

# Files Round 2 already cleaned, skip entirely for em-dash
ROUND_2_FILES = {
    "client/index.html",
    "client/src/App.tsx",
    "client/src/entry-server.tsx",
    "client/src/data/industries.ts",
    "client/src/pages/Home.tsx",
    "client/src/pages/NotFound.tsx",
    "client/src/pages/IndustryMicrosite.tsx",
    "client/src/pages/AIRevenueEnginePage.tsx",
    "client/src/pages/AICrmIntegrationPage.tsx",
    "client/src/pages/AIWorkflowAutomationPage.tsx",
    "client/src/pages/AIForRealEstatePage.tsx",
    "client/src/pages/AIForVacationRentalsPage.tsx",
    "client/public/robots.txt",
    "client/public/sitemap.xml",
    "client/public/llms.txt",
    "client/public/about.txt",
    "scripts/prerender.mjs",
    "client/src/components/Picture.tsx",
    "scripts/round3-cleanup.py",
    "scripts/download-assets.mjs",
    "scripts/optimize-images.mjs",
    "scripts/relink-images.mjs",
}

BRAND_CASING_SKIP = ROUND_2_FILES | {
    "client/src/seo/StructuredDataSSR.tsx",
    "client/src/seo/StructuredData.tsx",
}

EXT = re.compile(r"\.(tsx|ts|html|js|mjs|jsx|css|json|xml|txt|md)$", re.IGNORECASE)
SKIP_DIRS = {"node_modules", ".manus", ".manus-logs", ".cache", "__manus__", "dist", "build", ".git"}


def walk_files(base):
    for root, dirs, files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            if EXT.search(f):
                yield Path(root) / f


def rel(p):
    return str(p.relative_to(ROOT))


def replace_mdash(text):
    """Ordered em-dash replacement rules. EM_DASH avoids literal em-dash in source."""
    # Rule 1: >EM_DASH< (between JSX tags) -> bullet separator
    text = text.replace(">" + EM_DASH + "<", ">" + "\u2022" + "<")
    # Rule 2: digit EM_DASH digit (numeric range)
    text = re.sub(r"(\d)" + EM_DASH + r"(\d)", r"\1-\2", text)
    # Rule 3: space EM_DASH space
    text = text.replace(" " + EM_DASH + " ", " - ")
    # Rule 4: EM_DASH space (leading)
    text = text.replace(EM_DASH + " ", "- ")
    # Rule 5: space EM_DASH (trailing)
    text = text.replace(" " + EM_DASH, " -")
    # Rule 6: any remaining bare EM_DASH
    text = text.replace(EM_DASH, "-")
    return text


def process_brand(text):
    count = text.count("AiiACo")
    return text.replace("AiiACo", "AiiAco"), count


def process_mdash(text):
    count = text.count(EM_DASH)
    if count == 0:
        return text, 0
    new = replace_mdash(text)
    remaining = new.count(EM_DASH)
    if remaining > 0:
        print(f"  ! {remaining} em-dashes not caught by rules", file=sys.stderr)
    return new, count - remaining


def main():
    total_brand = 0
    total_mdash = 0
    files_touched = set()

    for path in walk_files(ROOT / "client" / "src"):
        rp = rel(path)
        if rp in BRAND_CASING_SKIP:
            continue
        txt = path.read_text(encoding="utf-8")
        new, n = process_brand(txt)
        if n > 0:
            path.write_text(new, encoding="utf-8")
            total_brand += n
            files_touched.add(rp)
            print(f"  brand: {rp}  ({n} replacements)")

    for target in [ROOT / "client" / "src", ROOT / "client" / "public", ROOT / "scripts"]:
        for path in walk_files(target):
            rp = rel(path)
            if rp in ROUND_2_FILES:
                continue
            txt = path.read_text(encoding="utf-8")
            new, n = process_mdash(txt)
            if n > 0:
                path.write_text(new, encoding="utf-8")
                total_mdash += n
                files_touched.add(rp)
                print(f"  mdash: {rp}  ({n} replacements)")

    print("\n-------------------------------------")
    print(f"Files touched: {len(files_touched)}")
    print(f"AiiACo -> AiiAco replacements: {total_brand}")
    print(f"Em-dash replacements: {total_mdash}")


if __name__ == "__main__":
    main()
