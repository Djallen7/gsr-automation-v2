#!/usr/bin/env python3
"""Google Sheets helper for the GSR graphics trackers.

Read + write the Season 3 graphics trackers (and any GSR sheet) through the
Google Sheets API v4, using a service-account credential injected via the
environment. Mirrors scripts/basecamp_token.py: env-driven, no interactive
OAuth, safe to run headless in a web session.

DORMANT UNTIL A CREDENTIAL EXISTS. With no credential set it exits with a
clear setup message and changes nothing. Daniel's one-time setup:
  1. Create a Google Cloud service account; enable the Google Sheets API.
  2. Download its JSON key.
  3. Share each tracker (or the Season 3 Drive folder) with the service
     account's client_email so it can read/write.
  4. Inject the key into the web-environment env config as either:
        GOOGLE_SERVICE_ACCOUNT_JSON   (the JSON key, inline)
     or GOOGLE_SERVICE_ACCOUNT_FILE   (a path to the JSON key file)

Requires (install once in the environment):
  pip install google-auth google-api-python-client

WRITE SAFETY (the confirm-before-production rule): library writes are real,
but the CLI refuses to write to a live tracker without --confirm. Always
dry-run and show Daniel the diff first, then require an explicit YES.

Usage:
  python3 scripts/sheets_helper.py --check                     # auth + identity probe
  python3 scripts/sheets_helper.py --read <sheetId> '<A1!range>'
  python3 scripts/sheets_helper.py --write <sheetId> '<A1!range>' '<json rows>' --confirm

As a module:
  from scripts.sheets_helper import read_range, write_range, append_rows
"""

import json
import os
import sys

# Read+write scope. Use .../spreadsheets.readonly to lock to read-only.
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# Convenience IDs (Drive folder 18RZ8UNF2nN67G6as-Uj5o5O3BbNFChoR).
TRACKERS = {
    "may": "1GmdVDOP4h0k6FmOdZLMJNroz7_x4xDcErBYmdGU0890",
    "june": "13_PQdT3RKCodjA_FzRxwpQR6yA1Kn8E5sKxN9VWPAJs",
}


def _env(name):
    val = os.environ.get(name, "")
    val = val.strip()  # trim stray whitespace (JSON keys must keep internal spacing)
    return val


def _load_credentials():
    """Build service-account credentials from the env, or exit with guidance."""
    try:
        from google.oauth2 import service_account  # type: ignore
    except ImportError:
        raise SystemExit(
            "ERROR: google-auth not installed. Run:\n"
            "  pip install google-auth google-api-python-client"
        )

    inline = _env("GOOGLE_SERVICE_ACCOUNT_JSON")
    path = _env("GOOGLE_SERVICE_ACCOUNT_FILE")
    if inline:
        try:
            info = json.loads(inline)
        except json.JSONDecodeError as e:
            raise SystemExit(f"ERROR: GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON: {e}")
        return service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    if path:
        if not os.path.exists(path):
            raise SystemExit(f"ERROR: GOOGLE_SERVICE_ACCOUNT_FILE not found: {path}")
        return service_account.Credentials.from_service_account_file(path, scopes=SCOPES)
    raise SystemExit(
        "ERROR: no Google credential in env. Set GOOGLE_SERVICE_ACCOUNT_JSON "
        "(inline key) or GOOGLE_SERVICE_ACCOUNT_FILE (path). This helper is "
        "dormant until one is provided — see the module docstring for setup."
    )


def get_service():
    """Return an authenticated Sheets API v4 service client."""
    try:
        from googleapiclient.discovery import build  # type: ignore
    except ImportError:
        raise SystemExit(
            "ERROR: google-api-python-client not installed. Run:\n"
            "  pip install google-auth google-api-python-client"
        )
    creds = _load_credentials()
    return build("sheets", "v4", credentials=creds, cache_discovery=False)


def read_range(spreadsheet_id, a1_range):
    """Return the value matrix for an A1 range (e.g. 'Ep001!A1:G40')."""
    svc = get_service()
    resp = (
        svc.spreadsheets()
        .values()
        .get(spreadsheetId=spreadsheet_id, range=a1_range)
        .execute()
    )
    return resp.get("values", [])


def write_range(spreadsheet_id, a1_range, values):
    """Overwrite an A1 range with a value matrix (list of row lists)."""
    svc = get_service()
    return (
        svc.spreadsheets()
        .values()
        .update(
            spreadsheetId=spreadsheet_id,
            range=a1_range,
            valueInputOption="USER_ENTERED",
            body={"values": values},
        )
        .execute()
    )


def append_rows(spreadsheet_id, a1_range, values):
    """Append rows after the last row of the range's table."""
    svc = get_service()
    return (
        svc.spreadsheets()
        .values()
        .append(
            spreadsheetId=spreadsheet_id,
            range=a1_range,
            valueInputOption="USER_ENTERED",
            insertDataOption="INSERT_ROWS",
            body={"values": values},
        )
        .execute()
    )


def _check():
    """Probe auth and list the tracker tabs the credential can see."""
    creds = _load_credentials()
    email = getattr(creds, "service_account_email", "(unknown)")
    print(f"OK: credential loaded for service account {email}")
    svc = get_service()
    for name, sid in TRACKERS.items():
        try:
            meta = svc.spreadsheets().get(spreadsheetId=sid).execute()
            tabs = [s["properties"]["title"] for s in meta.get("sheets", [])]
            print(f"  {name} ({sid}): {len(tabs)} tabs -> {', '.join(tabs[:6])}"
                  + (" ..." if len(tabs) > 6 else ""))
        except Exception as e:  # noqa: BLE001 - surface the API error verbatim
            print(f"  {name} ({sid}): NOT ACCESSIBLE -> {e}"
                  "\n    (share the sheet with the service account's client_email)")


def main(argv):
    if not argv or "--check" in argv:
        _check()
        return
    if argv[0] == "--read" and len(argv) >= 3:
        rows = read_range(argv[1], argv[2])
        print(json.dumps(rows, indent=2))
        return
    if argv[0] == "--write" and len(argv) >= 4:
        if "--confirm" not in argv:
            raise SystemExit(
                "REFUSED: live tracker write needs --confirm. Dry-run first, "
                "show Daniel the diff, get an explicit YES, then re-run with --confirm."
            )
        values = json.loads(argv[3])
        print(json.dumps(write_range(argv[1], argv[2], values), indent=2))
        return
    raise SystemExit(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
