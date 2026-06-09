#!/usr/bin/env python3
"""Basecamp access-token helper for the GSR pipeline.

Mints a fresh Basecamp 3 access token from a stored refresh token, so a
session can call the Basecamp API without re-running the browser OAuth flow.

Reads four environment variables (stray whitespace is trimmed):
  BASECAMP_CLIENT_ID
  BASECAMP_CLIENT_SECRET
  BASECAMP_ACCOUNT_ID       (the bc3 account, 5805529 for David Rives Ministries)
  BASECAMP_REFRESH_TOKEN    (from the one-time Launchpad authorization)

Access tokens last ~14 days; the refresh token does not expire on its own.
If the refresh token is ever lost, re-run the browser authorize step to issue
a new one (see docs/_handoff/2026-06-08-basecamp-map.md).

Usage:
  python3 scripts/basecamp_token.py            # print the access token
  python3 scripts/basecamp_token.py --export   # print: export BASECAMP_ACCESS_TOKEN=...
  python3 scripts/basecamp_token.py --check     # mint, then verify against the API

As a module:
  from scripts.basecamp_token import get_access_token
  token = get_access_token()
"""

import json
import os
import sys
import urllib.parse
import urllib.request

TOKEN_URL = "https://launchpad.37signals.com/authorization/token"
AUTH_URL = "https://launchpad.37signals.com/authorization.json"
USER_AGENT = "GSR Pipeline (danielallen.tn@gmail.com)"


def _env(name):
    val = os.environ.get(name, "")
    val = "".join(val.split())  # trim all stray whitespace
    if not val:
        raise SystemExit(f"ERROR: environment variable {name} is not set")
    return val


def get_access_token():
    """Exchange the stored refresh token for a fresh access token."""
    data = urllib.parse.urlencode({
        "type": "refresh",
        "refresh_token": _env("BASECAMP_REFRESH_TOKEN"),
        "client_id": _env("BASECAMP_CLIENT_ID"),
        "client_secret": _env("BASECAMP_CLIENT_SECRET"),
    }).encode()
    req = urllib.request.Request(TOKEN_URL, data=data, method="POST")
    req.add_header("User-Agent", USER_AGENT)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            payload = json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise SystemExit(f"ERROR: token refresh failed (HTTP {e.code}): {body}")
    token = payload.get("access_token")
    if not token:
        raise SystemExit(f"ERROR: no access_token in response: {payload}")
    return token


def api_base():
    return f"https://3.basecampapi.com/{_env('BASECAMP_ACCOUNT_ID')}"


def _check(token):
    req = urllib.request.Request(AUTH_URL)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("User-Agent", USER_AGENT)
    with urllib.request.urlopen(req, timeout=30) as r:
        d = json.loads(r.read().decode())
    accts = [a for a in d.get("accounts", []) if a.get("product") == "bc3"]
    print(f"OK: authenticated as {d.get('identity', {}).get('email_address')}")
    for a in accts:
        print(f"  bc3 account {a.get('id')}: {a.get('name')} -> {a.get('href')}")
    print(f"  API base: {api_base()}")


def main(argv):
    token = get_access_token()
    if "--check" in argv:
        _check(token)
    elif "--export" in argv:
        print(f"export BASECAMP_ACCESS_TOKEN={token}")
    else:
        print(token)


if __name__ == "__main__":
    main(sys.argv[1:])
