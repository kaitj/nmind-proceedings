#!/usr/bin/env python

import json
import sys
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus


def count_bools(obj: Any) -> tuple[int, int]:
    """Count number of trues and falses in checklist."""
    if obj is True:
        return 1, 0
    elif obj is False:
        return 0, 1
    elif isinstance(obj, dict):
        true_count = false_count = 0
        for v in obj.values():
            t, f = count_bools(v)
            true_count += t
            false_count += f
        return true_count, false_count
    else:
        return 0, 0  # Irrelevant type


def generate_badge(true_count: int, false_count: int) -> str:
    """Generate a shields.io badge based on checklist counts."""
    total = true_count + false_count
    if total == 0:
        return f"https://img.shields.io/badge/NMIND-{quote_plus('0/0')}-lightgrey"
    ratio = true_count / total
    color = (
        "red"
        if ratio <= 0.25
        else "orange"
        if ratio <= 0.5
        else "yellow"
        if ratio <= 0.75
        else "green"
    )

    msg = f"{true_count}/{total}"
    return f"https://img.shields.io/badge/NMIND-{quote_plus(msg)}-{color}"


def process_checklist(checklist_path: Path) -> str:
    """Process a checklist, generating a badge."""
    checklist = json.loads(checklist_path.read_text())
    true_count, false_count = count_bools(checklist)
    badge_url = generate_badge(true_count=true_count, false_count=false_count)

    return badge_url


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: create_badge.py <path_to_checklist_json>")
        sys.exit(1)
    checklist_fp = Path(sys.argv[1])
    process_checklist(checklist_fp)
