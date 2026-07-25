#!/usr/bin/env python3
"""
Keeps style.css / subpage.js cache-busting query strings in sync, everywhere,
automatically — so nobody has to remember to bump a number by hand.

How it works:
  - Computes a short hash of the current contents of style.css and subpage.js.
  - Rewrites every "style.css?v=..." and "subpage.js?v=..." reference in every
    .html file in this folder to that hash.
  - Since the tag is derived from the file's actual bytes, it only changes
    when the file actually changes — and every page gets the same tag, so
    there's no "index.html says v=6 but blogs.html still says v=4" drift.

Run this once before every push:
    python3 update_asset_versions.py

(Or wire it into a git pre-commit hook — see the bottom of this file — so it
just happens automatically and can't be forgotten.)
"""

import hashlib
import re
from pathlib import Path

SITE_DIR = Path(__file__).parent
HASH_LENGTH = 8


def file_hash(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()[:HASH_LENGTH]


def update_references(asset_name: str, new_version: str) -> int:
    # Matches a quoted reference to the asset, with or without an existing
    # ?v=... tag — so a bare href="style.css" gets a tag added, not just
    # skipped, and can never again silently fall out of sync.
    pattern = re.compile(r'"' + re.escape(asset_name) + r'(?:\?v=[A-Za-z0-9]+)?"')
    replacement = f'"{asset_name}?v={new_version}"'
    changed_files = 0

    for html_file in SITE_DIR.glob("*.html"):
        text = html_file.read_text(encoding="utf-8")
        new_text, count = pattern.subn(replacement, text)
        if count and new_text != text:
            html_file.write_text(new_text, encoding="utf-8")
            changed_files += 1

    return changed_files


def main():
    for asset_name in ("style.css", "subpage.js"):
        asset_path = SITE_DIR / asset_name
        if not asset_path.exists():
            continue
        version = file_hash(asset_path)
        touched = update_references(asset_name, version)
        print(f"{asset_name} -> v={version}  ({touched} file(s) updated)")


if __name__ == "__main__":
    main()

# --- Optional: run this automatically on every commit ---
# Save as .git/hooks/pre-commit (and chmod +x it):
#
#   #!/bin/sh
#   python3 update_asset_versions.py
#   git add *.html
#
# That way this is handled the moment you commit — nothing to remember.
