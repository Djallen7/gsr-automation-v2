#!/usr/bin/env python3
"""
data-intake reconciler — LEAD central reconcile (sweep 1 + Daniel's decisions D1-D9).

Canonical S03 episode_uid = PRODUCTION numbering (RC + scripts + tracker). S02 has no
production source. Platform numbers -> platform_episode_number (+scheme). air_date only from
a real GSN schedule row. Real CSV parsing. Deterministic. overrides/ is highest priority.

DECISIONS APPLIED (see overrides/decisions.md):
  D1  DEFER S02 — every S02 row parked to *.s02_parked.csv, OUT of import + review queue.
  D2  5-row exact corroboration join (uid+guest) -> S03E021-024 episode_guests = 2-source clean.
  D3+D5 Platform->production bridge DEFERRED — remaining S03 platform rows relabeled "date-blocked".
  D4  youtube-only guests: fuzzy-dedupe vs contact FIRST; near-match -> needs_human candidate,
      else create new (source=youtube, confidence=low, needs_verification).
  D6  HELD — do_not_contact column added (default false); the 7 source-flagged stay needs_human.
  D7  Merge guest variants per overrides/guest_merges.csv (joseph-hubbard, jeffrey-tomkins canonical).
  D8  Tracker E016 -> E021 remap for MAY rows only (April E016 kept).
  D9  S03E025 air_date = 2026-06-02 cadence_inferred (medium, needs_human=true; gate ambiguous).
"""
import csv, json, os, re, difflib
from collections import defaultdict, Counter

BASE = os.path.expanduser("~/Documents/GitHub/gsr-automation-v2/data-intake")
SRC = os.path.join(BASE, "sources")
OVR = os.path.join(BASE, "overrides")
PROV = ["sources", "source_count", "confidence", "conflict_fields", "needs_human"]
FUZZ = 0.80   # D4 dedupe threshold

# ---------------------------------------------------------------- helpers ----
def load(path):
    path = path if os.path.isabs(path) else os.path.join(BASE, path)
    if not os.path.exists(path): return []
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def write_csv(name, rows, fieldnames):
    rows = sorted(rows, key=lambda r: tuple(str(r.get(k, "")) for k in fieldnames[:3]))
    with open(os.path.join(BASE, name), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        for r in rows: w.writerow({k: r.get(k, "") for k in fieldnames})
    return len(rows)

def slugify(s):
    s = (s or "").lower().strip()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def season_of(uid):
    m = re.match(r"S(\d\d)E\d\d\d", uid or ""); return int(m.group(1)) if m else None

def get(row, *names, default=""):
    for n in names:
        if n in row and row[n] not in (None, ""): return row[n]
    return default

# ---- overrides ----
def load_episode_overrides():
    ovr = {}
    for r in load(os.path.join(OVR, "episodes.csv")):
        uid, fld = r.get("episode_uid", ""), r.get("field", "")
        if uid and fld:
            ovr.setdefault(uid, {})[fld] = r.get("value", "")
            ovr[uid]["_source"] = r.get("air_date_source", "")
            ovr[uid]["_conf"]   = r.get("confidence", "")
            ovr[uid]["_nh"]     = r.get("needs_human", "")
    return ovr

def load_merges():
    m, canon_name = {}, {}
    for r in load(os.path.join(OVR, "guest_merges.csv")):
        f, t = r.get("from_key", "").strip(), r.get("to_key", "").strip()
        if f and t: m[f] = t
        if t: canon_name[t] = r.get("canonical_full_name", "")
    return m, canon_name

MERGE, CANON_NAME = load_merges()
def canon(k): return MERGE.get(k, k)

# ---- schedule (month, show-slot=week) -> air_date  [D3/D5 + cooldown unblock] ----
MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]
_ABBR = {m[:3]: m for m in MONTHS}
def build_slotmap():
    sm = {}
    for r in load(os.path.join(SRC, "episodes_gsn_schedule.csv")):
        m = re.search(r"\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s*Week\s*(\d)", r.get("source", ""))
        ad = r.get("air_date", "")
        if m and ad:
            sm.setdefault((_ABBR[m.group(1)], int(m.group(2))), []).append(ad)
    return sm

def days_between(d1, d2):
    from datetime import date
    try:
        a = date.fromisoformat(d1); b = date.fromisoformat(d2); return (b - a).days
    except (ValueError, TypeError):
        return None

REPORT, NH_TOTALS, PARKED = {}, {}, {}

# ============================================================ EPISODES =======
def build_episodes():
    epo = load_episode_overrides()
    scripts = load(os.path.join(SRC, "appearances_scripts.csv"))
    tracker = load(os.path.join(SRC, "graphics_tracker.csv"))
    yt = load(os.path.join(SRC, "episodes_youtube.csv"))
    fs = load(os.path.join(SRC, "episodes_fireside.csv"))
    rc = json.load(open(os.path.join(BASE, "rc_rundown_map.json")))

    prod = defaultdict(lambda: {"sources": set(), "rc_title": ""})
    cur = set(rc.get("current_season3_episodes", []))
    for rd in rc.get("rundowns", []):
        if rd.get("rundown_id") in cur:
            mt = re.search(r"S03[_ ]?Ep0?(\d+)", rd.get("title", ""))
            if mt:
                uid = f"S03E{int(mt.group(1)):03d}"
                prod[uid]["sources"].add("rc"); prod[uid]["rc_title"] = rd.get("title", "")
    for r in scripts:
        try: uid = f"S{int(r['season']):02d}E{int(r['episode']):03d}"
        except (ValueError, KeyError): continue
        prod[uid]["sources"].add("scripts")
    # tracker — D8: remap MAY-sourced E016 -> E021; keep April E016
    for r in tracker:
        uid = (r.get("episode_uid") or "").strip()
        if not re.match(r"^S\d\dE\d\d\d$", uid): continue
        src = r.get("source", "")
        if uid == "S03E016" and ("May" in src or "05_" in src):   # D8 remap
            uid = "S03E021"
        prod[uid]["sources"].add("tracker")

    episodes, conflicts, needs_human, parked = [], [], [], []
    slotmap = build_slotmap()
    ambiguous = 0
    ep_fields = ["episode_uid", "season", "episode_number", "key_status", "title", "title_slug",
                 "description", "air_date", "air_date_source", "status"] + PROV

    for uid in sorted(prod):
        if season_of(uid) != 3: continue
        info = prod[uid]; srcs = sorted(info["sources"]); sc = len(srcs)
        N = int(uid[4:]); month = MONTHS[(N - 1) // 5]; slot = (N - 1) % 5 + 1
        dates = sorted(set(slotmap.get((month, slot), [])))
        ad, ad_src, nh, cf = "", "", True, ""
        if len(dates) == 1:                       # clean 1:1 month-slot match
            ad = dates[0]; ad_src = f"gsn_schedule:{month} Week{slot} (month+show-slot join)"; nh = False
        elif len(dates) > 1:                      # ambiguity -> validate (step 3); none in data
            ambiguous += 1; cf = "air_date_ambiguous_needs_validation"
        else:                                     # overflow: 5 shows/mo vs fewer slots
            cf = f"overflow:{month} has no Week{slot} slot"
        # overrides (none this sweep — D9 reverted to overflow)
        o = epo.get(uid, {})
        if o.get("air_date"):
            ad = o["air_date"]; ad_src = o.get("_source", ad_src); nh = (o.get("_nh", "true").lower() == "true")
        conf = "high" if (ad and not nh) else ("medium" if sc >= 2 else "low")
        row = {"episode_uid": uid, "season": 3, "episode_number": N,
               "key_status": "canonical", "title": info["rc_title"],
               "title_slug": slugify(info["rc_title"]), "description": "",
               "air_date": ad, "air_date_source": ad_src, "status": "",
               "sources": "|".join(srcs), "source_count": sc, "confidence": conf,
               "conflict_fields": cf, "needs_human": "true" if nh else "false"}
        episodes.append(row)
        if nh:
            needs_human.append({"episode_uid": uid, "reason": cf or "no air_date", "sources": row["sources"]})
    REPORT.setdefault("_meta", {})["airdate_ambiguous"] = ambiguous

    # D1 — S02 parked (NOT in episodes.csv, NOT in review queue)
    s2 = {}
    for r in yt + fs:
        uid = r.get("episode_uid", "")
        if season_of(uid) == 2:
            s2.setdefault(uid, {"sources": set(), "title": get(r, "title")})
            s2[uid]["sources"].add("youtube" if r in yt else "fireside")
    for uid in sorted(s2):
        parked.append({"episode_uid": uid, "season": 2, "episode_number": int(uid[4:]),
                       "key_status": "provisional", "title": s2[uid]["title"],
                       "sources": "|".join(sorted(s2[uid]["sources"])),
                       "parked_reason": "D1 — S02 deferred (platform-provisional, no production source)"})

    n = write_csv("episodes.csv", episodes, ep_fields)
    write_csv("episodes.conflicts.csv", conflicts, ["episode_uid", "field", "note"])
    nh_n = write_csv("episodes.needs_human.csv", needs_human, ["episode_uid", "reason", "sources"])
    pk_n = write_csv("episodes.s02_parked.csv", parked,
                     ["episode_uid", "season", "episode_number", "key_status", "title", "sources", "parked_reason"])
    NH_TOTALS["episodes"] = nh_n; PARKED["episodes"] = pk_n
    REPORT["episodes"] = {"rows": n, "needs_human": nh_n, "parked_s02": pk_n,
                          "import_ready": sum(1 for e in episodes if e["needs_human"] == "false"),
                          "with_air_date": sum(1 for e in episodes if e["air_date"])}
    return {e["episode_uid"]: e for e in episodes}

# ========================================================= DISTRIBUTIONS =====
SCHEME = {"youtube": "youtube_publish_order", "fireside": "fireside_episode",
          "rumble": "rumble_publish_order", "gsn_ondemand": "gsn_ondemand"}
def build_distributions(spine):
    # D3/D5 bridge: episodes are now dated -> attach platform rows. Signal 1 = platform's own
    # S03E0NN (production-number hypothesis); signal 2 = date-lag consistency (publish - air_date
    # clusters tightly per platform). Both agree -> attach; outlier/undated -> needs_human.
    import statistics
    dated = {u: e["air_date"] for u, e in spine.items() if e.get("air_date")}
    dist, needs_human, parked = [], [], []
    bridged = 0
    for plat, fname in [("youtube", "distributions_youtube.csv"), ("fireside", "distributions_fireside.csv"),
                        ("rumble", "distributions_rumble.csv"), ("gsn_ondemand", "distributions_gsn_ondemand.csv")]:
        rows = load(os.path.join(SRC, fname))
        s3 = [r for r in rows if season_of(r.get("episode_uid", "")) == 3]
        # park S02
        for r in rows:
            if season_of(r.get("episode_uid", "")) == 2:
                parked.append({"platform": plat, "platform_episode_number": (r.get("episode_uid", "")[4:]),
                               "platform_title": get(r, "platform_title", "title")[:80],
                               "url": get(r, "url", "platform_url"), "parked_reason": "D1 — S02 deferred"})
        # per-platform median lag under the production-number hypothesis
        lags = [days_between(dated[r["episode_uid"]], get(r, "published_at", "air_date"))
                for r in s3 if r.get("episode_uid") in dated]
        lags = [d for d in lags if d is not None and 0 <= d <= 90]
        median = statistics.median(lags) if lags else None
        for r in s3:
            puid = r.get("episode_uid", ""); pnum = puid[4:] if puid else ""
            pub = get(r, "published_at", "air_date")
            base = {"platform": plat, "delivery_mechanism": get(r, "delivery_mechanism"),
                    "url": get(r, "url", "platform_url"), "platform_title": get(r, "platform_title", "title"),
                    "platform_episode_number": pnum, "platform_numbering_scheme": SCHEME[plat],
                    "published_at": pub, "view_count": get(r, "view_count"),
                    "downstream_platforms": get(r, "downstream_platforms")}
            attached, conf, note = "", "low", ""
            if puid in dated and median is not None:
                d = days_between(dated[puid], pub)
                if d is not None and abs(d - median) <= 14 and 0 <= d <= 90:
                    attached, conf = puid, "medium"
                    note = f"bridge: platform#+date-lag agree (lag {d}d ~ median {median:.0f}d)"; bridged += 1
                else:
                    note = f"bridge: lag outlier (lag {d}d vs median {median:.0f}d) - platform# suspect"
            elif puid in dated:
                note = "bridge: no lag baseline for platform"
            else:
                note = "bridge: platform# maps to undated/overflow/out-of-spine production episode"
            base.update({"episode_uid": attached, "sources": plat, "source_count": 1, "confidence": conf,
                         "conflict_fields": "" if attached else "episode_uid(bridge_unresolved)",
                         "needs_human": "false" if attached else "true", "bridge_note": note})
            dist.append(base)
            if not attached:
                needs_human.append({"platform": plat, "platform_episode_number": pnum,
                                    "platform_title": base["platform_title"][:80], "url": base["url"], "reason": note})
        # CONSERVATION: rows with no S02/S03 uid must not be dropped -> needs_human (unclassified)
        for r in rows:
            if season_of(r.get("episode_uid", "")) not in (2, 3):
                base = {"episode_uid": "", "platform": plat, "delivery_mechanism": get(r, "delivery_mechanism"),
                        "url": get(r, "url", "platform_url"), "platform_title": get(r, "platform_title", "title"),
                        "platform_episode_number": r.get("episode_uid", ""), "platform_numbering_scheme": SCHEME[plat],
                        "published_at": get(r, "published_at", "air_date"), "view_count": get(r, "view_count"),
                        "downstream_platforms": get(r, "downstream_platforms"), "sources": plat, "source_count": 1,
                        "confidence": "low", "conflict_fields": "episode_uid(unclassified)", "needs_human": "true",
                        "bridge_note": "unclassified: no S02/S03 episode_uid"}
                dist.append(base)
                needs_human.append({"platform": plat, "platform_episode_number": r.get("episode_uid", ""),
                                    "platform_title": base["platform_title"][:80], "url": base["url"],
                                    "reason": "unclassified: platform row has no S02/S03 episode_uid"})
    collected_dist = sum(len(load(os.path.join(SRC, f))) for f in
                         ["distributions_youtube.csv", "distributions_fireside.csv",
                          "distributions_rumble.csv", "distributions_gsn_ondemand.csv"])
    d_fields = ["episode_uid", "platform", "delivery_mechanism", "url", "platform_title",
                "platform_episode_number", "platform_numbering_scheme", "published_at",
                "view_count", "downstream_platforms", "bridge_note"] + PROV
    n = write_csv("distributions.csv", dist, d_fields)
    write_csv("distributions.conflicts.csv", [], ["episode_uid", "platform", "field", "values"])
    nh_n = write_csv("distributions.needs_human.csv", needs_human,
                     ["platform", "platform_episode_number", "platform_title", "url", "reason"])
    pk_n = write_csv("distributions.s02_parked.csv", parked,
                     ["platform", "platform_episode_number", "platform_title", "url", "parked_reason"])
    NH_TOTALS["distributions"] = nh_n; PARKED["distributions"] = pk_n
    REPORT["distributions"] = {"rows": n, "needs_human": nh_n, "parked_s02": pk_n, "bridged": bridged,
                               "collected": collected_dist, "accounted": n + pk_n,
                               "conservation_ok": (n + pk_n) == collected_dist}

# =============================================================== GUESTS =======
def build_guests():
    contact = load(os.path.join(SRC, "guests_contact_sheet.csv"))
    ytg = load(os.path.join(SRC, "guests_youtube.csv"))
    EMAIL_OK = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    FIELDS = ["title", "first_name", "last_name", "full_name", "credentials", "organization",
              "expertise", "bio", "email", "phone", "website", "social_handles"]

    # D7 — re-key contact rows to canonical before grouping
    by_key = defaultdict(list)
    for r in contact:
        by_key[canon(r.get("guest_key", "").strip())].append(r)

    # cross-source presence (canonicalized); 3 contact exports = ONE logical source
    ytg_keys = {canon(r.get("guest_key", "").strip()) for r in ytg if r.get("guest_key", "").strip()}
    app_keys = set()
    for fn in ["appearances_schedule.csv", "appearances_youtube.csv"]:
        for r in load(os.path.join(SRC, fn)):
            k = canon(r.get("guest_key", "").strip())
            if k: app_keys.add(k)
    for r in load(os.path.join(SRC, "appearances_scripts.csv")):
        m = re.search(r"Interview\s*\d\s*:?\s*(.+)$", r.get("file_name", ""))
        if m: app_keys.add(slugify(m.group(1).strip()))

    # D6 FINAL: the source needs_human flag on these contact rows was a MIS-PARSE of a
    # deceased/do-not-contact section — NOT reliable. Do NOT propagate it. do_not_contact stays
    # false for everyone; only genuine quality issues (bad email, export disagreement) flag.
    # Real deceased/DNC list is UNVERIFIED — TODO next session.
    guests, conflicts, needs_human = {}, [], []
    for gk, rows in by_key.items():
        logical = ["contact_sheet"]
        if gk in ytg_keys: logical.append("youtube")     # D7 fold corroborates
        if gk in app_keys: logical.append("appearances")
        sc = len(logical)
        cf, quality = [], []
        nh = False                                        # D6: do not inherit the mis-parsed source flag
        rec = {"guest_key": gk, "sources": "|".join(logical), "source_count": sc,
               "do_not_contact": "false", "status": "", "origin": "contact_sheet"}
        for fld in FIELDS:
            vals = sorted({(r.get(fld, "") or "").strip() for r in rows if (r.get(fld, "") or "").strip()})
            rec[fld] = vals[0] if vals else ""
            if len(vals) > 1:
                cf.append(fld); conflicts.append({"guest_key": gk, "field": fld, "values": " || ".join(v[:40] for v in vals)})
        if gk in CANON_NAME and CANON_NAME[gk]:
            rec["full_name"] = CANON_NAME[gk]              # D7 canonical name
        if rec["email"] and not EMAIL_OK.match(rec["email"]): quality.append("malformed_email")
        if not gk: quality.append("missing_guest_key")
        if cf or quality: nh = True
        rec["confidence"] = "high" if (sc >= 2 and not cf and not quality) else ("low" if (cf or quality) else "medium")
        rec["conflict_fields"] = "|".join(cf); rec["quality_flags"] = "|".join(quality)
        rec["needs_human"] = "true" if nh else "false"
        if gk: guests[gk] = rec
        if nh:
            why = []
            if cf: why.append("export_disagreement:" + ",".join(cf))
            if quality: why.append(",".join(quality))
            needs_human.append({"guest_key": gk, "full_name": rec.get("full_name", ""),
                                "reason": "; ".join(why), "origin": "contact"})

    # D4 — youtube-only guests: dedupe FIRST, then create-or-candidate
    contact_keys = set(guests.keys())
    seen_yt = set()
    new_creates = candidates = 0
    for r in ytg:
        gk = canon(r.get("guest_key", "").strip())
        if not gk or gk in contact_keys or gk in seen_yt: continue   # folded/dup
        seen_yt.add(gk)
        best = max(contact_keys, key=lambda c: difflib.SequenceMatcher(None, gk, c).ratio(), default="")
        ratio = difflib.SequenceMatcher(None, gk, best).ratio() if best else 0
        if ratio >= FUZZ:                                  # near-match -> needs_human candidate (NOT created)
            candidates += 1
            needs_human.append({"guest_key": gk, "full_name": r.get("full_name", r.get("guest_full_name", "")),
                                "reason": f"D4 merge candidate — fuzzy near-match to '{best}' ({ratio:.2f}); human decides merge/new",
                                "origin": "youtube"})
        else:                                              # create new low-confidence guest
            new_creates += 1
            guests[gk] = {"guest_key": gk, "full_name": r.get("full_name", r.get("guest_full_name", "")),
                          "title": "", "first_name": "", "last_name": "", "credentials": "",
                          "organization": "", "expertise": "", "bio": "", "email": "", "phone": "",
                          "website": "", "social_handles": "", "do_not_contact": "false", "status": "",
                          "origin": "youtube", "sources": "youtube", "source_count": 1,
                          "confidence": "low", "conflict_fields": "", "quality_flags": "needs_verification",
                          "needs_human": "true"}
            needs_human.append({"guest_key": gk, "full_name": guests[gk]["full_name"],
                                "reason": "D4 new youtube-only guest — needs verification (no PII)", "origin": "youtube"})

    public = ["guest_key", "title", "first_name", "last_name", "full_name", "credentials",
              "organization", "expertise", "bio", "website", "social_handles",
              "do_not_contact", "status", "origin", "quality_flags"] + PROV
    n = write_csv("guests.csv", list(guests.values()), public)
    # PII review (email/phone) — review file only
    pii = [{"guest_key": g["guest_key"], "full_name": g.get("full_name", ""), "email": g.get("email", ""),
            "phone": g.get("phone", ""), "reason": "has_pii_review", "origin": g.get("origin", "")}
           for g in guests.values() if g.get("email") or g.get("phone")]
    nh_n = write_csv("guests.needs_human.csv", needs_human + pii,
                     ["guest_key", "full_name", "email", "phone", "reason", "origin"])
    write_csv("guests.conflicts.csv", conflicts, ["guest_key", "field", "values"])
    NH_TOTALS["guests"] = nh_n
    REPORT["guests"] = {"rows": n, "needs_human": nh_n, "new_youtube_creates": new_creates,
                        "merge_candidates": candidates, "do_not_contact_set": 0}
    return guests

# ======================================================= EPISODE_GUESTS ======
def build_episode_guests(spine):
    scripts = load(os.path.join(SRC, "appearances_scripts.csv"))
    sched = load(os.path.join(SRC, "appearances_schedule.csv"))
    ytapp = load(os.path.join(SRC, "appearances_youtube.csv"))
    collected = len(scripts) + len(sched) + len(ytapp)
    eg, needs_human, parked = [], [], []
    CLEAN = {"S03E021", "S03E022", "S03E023", "S03E024"}
    SEG = {"interview_1": "interview_1", "interview_2": "interview_2"}

    # scripts -> clean table (production-keyed)
    script_guest = {}                    # (uid, guest_key) -> eg index (schedule corroboration)
    script_by_guest = defaultdict(list)  # guest_key -> eg indices (youtube guest-name bridge)
    for r in scripts:
        try: uid = f"S{int(r['season']):02d}E{int(r['episode']):03d}"
        except (ValueError, KeyError):
            needs_human.append({"source": "scripts", "source_episode_uid": "", "guest_key": "",
                                "guest_full_name": "", "reason": "scripts row missing season/episode"}); continue
        seg = r.get("segment", "")
        if seg not in SEG:
            needs_human.append({"source": "scripts", "source_episode_uid": uid, "guest_key": "",
                                "guest_full_name": r.get("file_name", ""),
                                "reason": "run-of-show doc, not a single-guest appearance"}); continue
        m = re.search(r"Interview\s*\d\s*:?\s*(.+)$", r.get("file_name", ""))
        name = (m.group(1).strip() if m else ""); gk = slugify(name)
        script_guest[(uid, gk)] = len(eg); script_by_guest[gk].append(len(eg))
        eg.append({"episode_uid": uid, "guest_key": gk, "guest_full_name": name, "segment": SEG[seg],
                   "topic": "", "role": "guest", "sources": "scripts", "source_count": 1,
                   "confidence": "high", "conflict_fields": "", "needs_human": "false"})

    # D2 — exact corroboration join: schedule row matching (canonical clean uid + scripts guest)
    corroborated = 0
    for r in sched:
        suid = r.get("episode_uid", ""); gk = canon(r.get("guest_key", "").strip())
        key = (suid, gk)
        if suid in CLEAN and key in script_guest:          # exact 2-source agreement
            idx = script_guest[key]
            eg[idx]["sources"] = "scripts|schedule"; eg[idx]["source_count"] = 2
            corroborated += 1
        else:                                               # rest stay needs_human
            nhsrc = str(r.get("needs_human", "")).lower() == "true"
            needs_human.append({"source": "schedule", "source_episode_uid": suid,
                                "guest_key": gk or "(blank)", "guest_full_name": r.get("guest_full_name", ""),
                                "reason": "schedule numbering != production; episode_uid unresolved"
                                + (" + flagged_in_source" if nhsrc else "")})

    # youtube appearances: S02 parked (D1); S03 -> guest-name bridge to scripts (D3/D5),
    # else needs_human. Fold a youtube appearance into a scripts row when its guest uniquely
    # matches one scripts-known production guest.
    corroborated_yt = 0
    for r in ytapp:
        puid = r.get("episode_uid", ""); seas = season_of(puid)
        gk = canon(r.get("guest_key", "").strip())
        rec = {"source": "youtube", "source_episode_uid": puid, "guest_key": gk or "(blank)",
               "guest_full_name": r.get("guest_full_name", r.get("full_name", ""))}
        if seas == 2:
            rec["parked_reason"] = "D1 — S02 deferred"; parked.append(rec); continue
        idxs = script_by_guest.get(gk, [])
        if len(idxs) == 1:                       # unique guest-name match -> fold/corroborate
            i = idxs[0]; s = set(eg[i]["sources"].split("|")); s.add("youtube")
            eg[i]["sources"] = "|".join(sorted(s)); eg[i]["source_count"] = len(s)
            corroborated_yt += 1
        else:
            rec["reason"] = "no unique production guest match; date-blocked (D3/D5)"
            needs_human.append(rec)

    eg_fields = ["episode_uid", "guest_key", "guest_full_name", "segment", "topic", "role"] + PROV
    n = write_csv("episode_guests.csv", eg, eg_fields)
    write_csv("episode_guests.conflicts.csv", [], ["episode_uid", "guest_key", "field", "values"])
    nh_n = write_csv("episode_guests.needs_human.csv", needs_human,
                     ["source", "source_episode_uid", "guest_key", "guest_full_name", "reason"])
    pk_n = write_csv("episode_guests.s02_parked.csv", parked,
                     ["source", "source_episode_uid", "guest_key", "guest_full_name", "parked_reason"])
    NH_TOTALS["episode_guests"] = nh_n; PARKED["episode_guests"] = pk_n
    folded = corroborated + corroborated_yt   # schedule + youtube rows FOLD into clean table rows
    acc = n + nh_n + pk_n + folded
    REPORT["episode_guests"] = {"rows": n, "needs_human": nh_n, "parked_s02": pk_n,
                                "folded_schedule": corroborated, "folded_youtube": corroborated_yt,
                                "collected": collected, "accounted": acc, "conservation_ok": acc == collected}

# ======================================================= PREMADE LIBRARY =====
def build_premade():
    stock = load(os.path.join(SRC, "premade_stock.csv")); media = load(os.path.join(BASE, "propres_media.csv"))
    by_hash, no_hash = {}, []
    def add(r, src):
        h = (r.get("file_hash") or "").strip()
        rec = {"name": r.get("name", ""), "description": r.get("description", ""),
               "asset_type": r.get("asset_type", ""), "is_loop": r.get("is_loop", ""),
               "duration_sec": r.get("duration_sec", ""), "file_hash": h,
               "sources": src, "source_count": 1, "confidence": r.get("confidence", "medium"),
               "conflict_fields": "", "needs_human": r.get("needs_human", "false")}
        if not h: no_hash.append(rec); return
        if h in by_hash:
            ex = by_hash[h]; ex["sources"] = "|".join(sorted(set(ex["sources"].split("|")) | {src}))
            ex["source_count"] = len(ex["sources"].split("|")); ex["confidence"] = "high"
        else: by_hash[h] = rec
    for r in stock: add(r, "premade_stock")
    for r in media: add(r, "propres_media")
    allrows = list(by_hash.values()) + no_hash
    n = write_csv("premade_library.csv", allrows,
                  ["name", "description", "asset_type", "is_loop", "duration_sec", "file_hash"] + PROV)
    NH_TOTALS["premade_library"] = sum(1 for r in allrows if r["needs_human"] == "true")
    REPORT["premade_library"] = {"rows": n, "needs_human": NH_TOTALS["premade_library"]}

# ================================================================ MAIN ========
def main():
    spine = build_episodes(); build_distributions(spine); build_guests(); build_episode_guests(spine); build_premade()
    print("\n=== RECONCILE SUMMARY (D1-D9 applied; D6 held) ===")
    for ent, st in REPORT.items(): print(f"  {ent:16} {st}")
    review = sum(NH_TOTALS.values())
    parked = sum(PARKED.values())
    print(f"\n  TRUE REVIEW QUEUE (needs_human, all entities): {review}")
    for e in sorted(NH_TOTALS): print(f"     {NH_TOTALS[e]:4}  {e}")
    print(f"\n  PARKED (S02, staged not imported, OUT of queue): {parked}")
    for e in sorted(PARKED): print(f"     {PARKED[e]:4}  {e}")
    eg = REPORT["episode_guests"]
    print(f"\n  episode_guests conservation: collected={eg['collected']} accounted={eg['accounted']} ok={eg['conservation_ok']}")

if __name__ == "__main__":
    main()
