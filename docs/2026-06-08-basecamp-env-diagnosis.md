# Basecamp Env Credentials — Diagnosis & Verification (2026-06-08)

**Status: RESOLVED ✅** — credentials re-entered, all checks pass.

## Background

A prior session found that three of the four Basecamp environment variables had a
leading space (byte `0x20`) prepended to their values. This broke request
construction at the URL/encoding layer, producing:

```
curl: (3) URL rejected: Malformed input to a URL function
```

Observed corruption (raw vs. trimmed length):

| Variable | Raw (corrupt) | Trimmed | Cause |
|---|---|---|---|
| BASECAMP_ACCOUNT_ID | 8 | 7 | leading space |
| BASECAMP_CLIENT_ID | 41 | 40 | leading space |
| BASECAMP_CLIENT_SECRET | 41 | 40 | leading space |
| BASECAMP_REFRESH_TOKEN | (clean) | (clean) | — |

The fix was to re-enter the three affected values in the environment without the
leading space.

## Verification run (2026-06-08)

Three-step read-only verification. No secrets or tokens were printed, and nothing
was written to Basecamp.

### Step 1 — Whitespace check: PASS

Raw length vs. trimmed length now match for all four variables:

| Variable | Raw len | Trimmed len | Match |
|---|---|---|---|
| BASECAMP_ACCOUNT_ID | 7 | 7 | ✅ |
| BASECAMP_CLIENT_ID | 40 | 40 | ✅ |
| BASECAMP_CLIENT_SECRET | 40 | 40 | ✅ |
| BASECAMP_REFRESH_TOKEN | 394 | 394 | ✅ |

`BASECAMP_ACCOUNT_ID` trimmed equals `5805529` (David Rives Ministries). ✅

### Step 2 — OAuth exchange (raw values, deliberately NOT stripped): PASS

POST to `https://launchpad.37signals.com/authorization/token` with
`type=refresh`, `refresh_token`, `client_id`, `client_secret` using the raw
stored env values.

- HTTP status: **200**
- `access_token` returned: **YES** (not printed)

Using the raw values (not stripping them) is the point of the test: the same
values that previously failed URL construction now build a valid request, which
confirms the leading spaces are gone.

### Step 3 — API proof (read-only): PASS

GET `https://3.basecampapi.com/5805529/projects.json` with header
`User-Agent: GSR Pipeline (danielallen.tn@gmail.com)`.

- HTTP status: **200**
- Projects returned: **4** (as expected for account 5805529)

| ID | Name |
|---|---|
| 47455443 | Prayer Request- Donors and Staff |
| 43579448 | Aquarium |
| 37738136 | 02_ Production |
| 37738001 | 01_DRM Staff |

## Bottom line

Re-entering the credentials fixed the leading-space corruption. All four env vars
are clean, the OAuth refresh works end-to-end with the raw stored values, and the
API returns the expected ~4 projects on account 5805529. Basecamp auth is good to
build on.
