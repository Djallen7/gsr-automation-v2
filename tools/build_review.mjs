#!/usr/bin/env node
// build_review.mjs
// Generates apps/dashboard/public/review.html: a self-contained, mobile-first
// decisions artifact embedding the 90 export-archaeology backlog items plus the
// 14 conflicts. Daniel taps a decision per item, optionally adds a free-text
// note, then taps "Copy my decisions" to paste the result back into chat.
//
// Run: /opt/node22/bin/node tools/build_review.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const BACKLOG = join(ROOT, "docs", "_handoff", "export-archaeology-backlog.json");
const OUT = join(ROOT, "apps", "dashboard", "public", "review.html");

const findings = JSON.parse(readFileSync(BACKLOG, "utf8"));

// The 14 conflicts, transcribed from 2026-06-08-export-archaeology.md.
const conflicts = [
  { id: "C-1", title: "YouTube category", a: "24 Entertainment (old chat memory)", b: "28 Science & Tech (live repo)", rec: "b" },
  { id: "C-2", title: "Lower-thirds standard line length", a: "55 char hard max", b: "55 to 65 band, 65 ceiling", rec: "b" },
  { id: "C-3", title: "Topic L3 length", a: "60 to 65 chars", b: "exactly 65 (current code)", rec: "a" },
  { id: "C-4", title: "First monologue graphic name", a: "Intro Graphic", b: "Title Graphic", rec: "b", note: "Recommended: Title Graphic for Shows 2 to 5; Show 1 stays Intro Graphic." },
  { id: "C-5", title: "Chyron field order", a: "NAME | TITLE | WHY THIS PERSON", b: "NAME | ORG | FIELD (live code)", rec: "b" },
  { id: "C-6", title: "GSN content figure", a: "nearly 1,000 hours", b: "270 hours + hundreds of short-form", rec: "b" },
  { id: "C-7", title: "Next.js version in docs", a: "15 (ADR-0012 text)", b: "16.2.6 (live)", rec: "b" },
  { id: "C-8", title: "Lower-thirds table name", a: "lower_thirds", b: "graphics (live)", rec: "b" },
  { id: "C-9", title: "Season 3 episode count", a: "50 or 60 (old numbering)", b: "48 (live)", rec: "b" },
  { id: "C-10", title: "Phantom ADRs (0004 to 0008)", a: "Author the missing ADRs", b: "Strike the references", rec: "a", note: "Content (master-metadata, Dropbox-no-metadata, AI-metadata-needs-approval) is real even if the files are not." },
  { id: "C-11", title: "What 'THD' refers to", a: "That's a Fact (corpus)", b: "The Heavens Declare (on-air segment)", rec: "", note: "Genuinely needs your call; the two are being conflated." },
  { id: "C-12", title: "Ming Wang June 15 slot", a: "10:00 arrival / 10:30 film", b: "afternoon Zoom 2:00 / 2:30 / 3:00", rec: "", note: "Needs your confirmation of the exact time." },
  { id: "C-13", title: "'GSR has no graphics' memory", a: "Legacy monologue-copy rule only", b: "Literal (show lacks graphics)", rec: "a" },
  { id: "C-14", title: "Run-of-show interview-tease rows", a: "E10 / E12 map", b: "F-08 map", rec: "", note: "Needs your canonical B/C/D/E/F letter map (or verify in RC)." },
];

const data = { generated: new Date().toISOString(), findings, conflicts };

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>GSR Findings Review</title>
<style>
:root{--bg:#0e1422;--card:#16203200;--surface:#172238;--ink:#e8eef9;--dim:#9fb0cc;--line:#26334d;--accent:#3b82f6;--good:#22c55e;--warn:#d9a73a;--bad:#ef4444;--violet:#8b5cf6;--chip:#1d2942;}
*{box-sizing:border-box}
body{margin:0;background:linear-gradient(180deg,#0b1120,#0e1422);color:var(--ink);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding-bottom:120px}
header{position:sticky;top:0;z-index:20;background:#0b1120ee;backdrop-filter:blur(8px);border-bottom:1px solid var(--line);padding:12px 14px 10px}
h1{font-size:17px;margin:0 0 2px}
.sub{font-size:12.5px;color:var(--dim);margin:0}
.bars{display:flex;gap:8px;align-items:center;margin-top:9px}
.prog{flex:1;height:8px;border-radius:6px;background:#1c2740;overflow:hidden}
.prog > i{display:block;height:100%;background:linear-gradient(90deg,#3b82f6,#22c55e);width:0%}
.count{font-size:12px;color:var(--dim);white-space:nowrap}
.filters{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}
.fchip{font-size:12px;padding:5px 10px;border-radius:999px;border:1px solid var(--line);background:var(--chip);color:var(--dim);cursor:pointer}
.fchip.on{background:var(--accent);color:#fff;border-color:var(--accent)}
.search{width:100%;margin-top:8px;padding:9px 11px;border-radius:9px;border:1px solid var(--line);background:#101a2d;color:var(--ink);font-size:14px}
main{padding:12px 12px 0;max-width:780px;margin:0 auto}
.sec{font-size:13px;color:var(--dim);text-transform:uppercase;letter-spacing:.06em;margin:18px 4px 8px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:13px 13px 11px;margin-bottom:11px}
.card.decided{border-color:#2f6b46}
.crow{display:flex;gap:8px;align-items:flex-start;justify-content:space-between}
.ctitle{font-weight:650;font-size:15px;margin:0}
.badges{display:flex;gap:5px;flex-wrap:wrap;margin:6px 0 0}
.b{font-size:10.5px;padding:2px 7px;border-radius:999px;border:1px solid var(--line);color:var(--dim);white-space:nowrap}
.b.forgotten{color:#fca5a5;border-color:#5b2330}
.b.partial{color:#fcd97a;border-color:#5a4a1e}
.b.built{color:#86efac;border-color:#235236}
.b.conflict{color:#c4b5fd;border-color:#3f3170}
.b.endorsed{color:#fff;border-color:var(--accent);background:#1e3a8a55}
.b.theme{color:#9fb0cc}
.b.phase{color:#bcd}
.detail{font-size:13.5px;color:#cdd8ec;margin:8px 0 0}
.meta{font-size:11.5px;color:var(--dim);margin:6px 0 0}
.rec{font-size:12.5px;color:#a7f3d0;margin:6px 0 0}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 0}
.chip{font-size:13px;padding:8px 13px;border-radius:9px;border:1px solid var(--line);background:var(--chip);color:var(--ink);cursor:pointer;min-height:40px}
.chip[data-k="build"].on{background:var(--good);border-color:var(--good);color:#06210f}
.chip[data-k="later"].on{background:var(--warn);border-color:var(--warn);color:#241a02}
.chip[data-k="skip"].on{background:#475569;border-color:#475569;color:#fff}
.chip[data-k="discuss"].on{background:var(--violet);border-color:var(--violet);color:#fff}
.chip[data-k="a"].on,.chip[data-k="b"].on{background:var(--accent);border-color:var(--accent);color:#fff}
.notebtn{font-size:12px;color:var(--accent);background:none;border:none;cursor:pointer;margin-top:8px;padding:4px 0}
.note{width:100%;margin-top:7px;padding:9px;border-radius:9px;border:1px solid var(--line);background:#101a2d;color:var(--ink);font-size:14px;min-height:54px;resize:vertical}
.hidden{display:none}
footer{position:fixed;bottom:0;left:0;right:0;background:#0b1120f2;border-top:1px solid var(--line);padding:11px 12px;display:flex;gap:9px;z-index:30}
.btn{flex:1;padding:13px;border-radius:11px;border:none;font-size:14.5px;font-weight:650;cursor:pointer}
.btn.primary{background:var(--accent);color:#fff}
.btn.ghost{background:#1c2740;color:var(--ink);border:1px solid var(--line)}
.toast{position:fixed;bottom:78px;left:50%;transform:translateX(-50%);background:#22c55e;color:#06210f;padding:9px 16px;border-radius:999px;font-size:13px;font-weight:600;opacity:0;transition:opacity .2s;z-index:40}
.toast.show{opacity:1}
dialog{background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:13px;max-width:92vw;width:560px;padding:0}
dialog::backdrop{background:#0008}
.dlghead{padding:13px 15px;border-bottom:1px solid var(--line);font-weight:650}
.dlgbody{padding:13px 15px;max-height:62vh;overflow:auto}
.dlgbody textarea{width:100%;min-height:280px;background:#101a2d;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:10px;font:12.5px ui-monospace,Menlo,monospace}
.dlgfoot{padding:11px 15px;border-top:1px solid var(--line);display:flex;gap:9px}
</style>
</head>
<body>
<header>
  <h1>GSR Findings Review</h1>
  <p class="sub">Decide each item. Tap a choice; add a note for anything that needs more than a button. Then "Copy decisions" and paste back to Claude.</p>
  <div class="bars"><div class="prog"><i id="progbar"></i></div><div class="count" id="count">0 decided</div></div>
  <div class="filters" id="statusFilters"></div>
  <div class="filters" id="themeFilters"></div>
  <input class="search" id="search" placeholder="Search findings...">
</header>
<main id="main"></main>
<footer>
  <button class="btn ghost" id="undecidedBtn">Show undecided only</button>
  <button class="btn primary" id="copyBtn">Copy decisions</button>
</footer>
<div class="toast" id="toast"></div>
<dialog id="exportDlg">
  <div class="dlghead">Your decisions</div>
  <div class="dlgbody">
    <p style="font-size:12.5px;color:#9fb0cc;margin:0 0 8px">Tap inside, it is already selected and copied. Paste this back into the chat.</p>
    <textarea id="exportText" readonly></textarea>
  </div>
  <div class="dlgfoot"><button class="btn ghost" id="closeDlg">Close</button><button class="btn primary" id="copyAgain">Copy again</button></div>
</dialog>
<script>
var DATA=${JSON.stringify(data)};
var KEY="gsr_review_v1";
var S=load()||{f:{},c:{}};
function load(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var FILTER={status:"actionable",theme:"all",q:"",undecided:false};
var STATUS=[["actionable","Needs action"],["all","All"],["FORGOTTEN","Forgotten"],["PARTIAL","Partial"],["CONFLICT","Conflicts"],["ALREADY-BUILT","Built"]];
function totalItems(){return DATA.findings.length+DATA.conflicts.length}
function decidedCount(){var n=0;DATA.findings.forEach(function(x){if(S.f[x.id]&&S.f[x.id].d)n++});DATA.conflicts.forEach(function(x){if(S.c[x.id]&&S.c[x.id].c)n++});return n}
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}

function renderFilters(){
  var sf=document.getElementById("statusFilters");sf.innerHTML="";
  STATUS.forEach(function(p){var b=el("button","fchip"+(FILTER.status===p[0]?" on":""),esc(p[1]));b.onclick=function(){FILTER.status=p[0];render()};sf.appendChild(b)});
  var themes=["all"].concat(Array.from(new Set(DATA.findings.map(function(x){return x.theme}))).sort());
  var tf=document.getElementById("themeFilters");tf.innerHTML="";
  themes.forEach(function(t){var b=el("button","fchip"+(FILTER.theme===t?" on":""),esc(t==="all"?"all themes":t));b.onclick=function(){FILTER.theme=t;render()};tf.appendChild(b)});
}
function passStatus(x){
  if(FILTER.status==="all")return true;
  if(FILTER.status==="actionable")return x.status!=="ALREADY-BUILT";
  return x.status===FILTER.status;
}
function matchQ(s){return !FILTER.q || s.toLowerCase().indexOf(FILTER.q.toLowerCase())>=0}

function findingCard(x){
  var st=S.f[x.id]||{};
  var c=el("div","card"+(st.d?" decided":""));
  var badges='<span class="b '+ (x.status==="FORGOTTEN"?"forgotten":x.status==="PARTIAL"?"partial":x.status==="ALREADY-BUILT"?"built":"conflict") +'">'+esc(x.status)+'</span>'+
    '<span class="b theme">'+esc(x.theme)+'</span>'+
    (x.suggested_phase?'<span class="b phase">phase '+esc(x.suggested_phase)+'</span>':'')+
    (x.endorsed?'<span class="b endorsed">you endorsed</span>':'');
  c.innerHTML='<p class="ctitle">'+esc(x.title)+'</p><div class="badges">'+badges+'</div>'+
    '<div class="detail">'+esc(x.detail)+'</div>'+
    (x.recommended_action?'<div class="rec">Suggested: '+esc(x.recommended_action)+'</div>':'')+
    (x.sources&&x.sources.length?'<div class="meta">source: '+esc(x.sources.join(", "))+'</div>':'');
  var chips=el("div","chips");
  [["build","Build"],["later","Later"],["skip","Skip"],["discuss","Discuss"]].forEach(function(k){
    var b=el("button","chip"+((st.d===k[0])?" on":""),esc(k[1]));b.setAttribute("data-k",k[0]);
    b.onclick=function(){var s=S.f[x.id]||(S.f[x.id]={});s.d=(s.d===k[0]?"":k[0]);save();render()};
    chips.appendChild(b);
  });
  c.appendChild(chips);
  var nb=el("button","notebtn",(st.n?"Edit note":"+ Add note"));
  var ta=el("textarea","note"+(st.n?"":" hidden"));ta.value=st.n||"";ta.placeholder="More detail or direction...";
  nb.onclick=function(){ta.classList.toggle("hidden");if(!ta.classList.contains("hidden"))ta.focus()};
  ta.oninput=function(){var s=S.f[x.id]||(S.f[x.id]={});s.n=ta.value;save();nb.textContent=ta.value?"Edit note":"+ Add note"};
  c.appendChild(nb);c.appendChild(ta);
  return c;
}
function conflictCard(x){
  var st=S.c[x.id]||{};
  var c=el("div","card"+(st.c?" decided":""));
  c.innerHTML='<p class="ctitle">'+esc(x.id)+'  '+esc(x.title)+'</p><div class="badges"><span class="b conflict">conflict</span></div>'+
    (x.note?'<div class="detail">'+esc(x.note)+'</div>':'');
  var chips=el("div","chips");
  [["a","A: "+x.a],["b","B: "+x.b]].forEach(function(k){
    var rec=(x.rec===k[0])?" (recommended)":"";
    var b=el("button","chip"+((st.c===k[0])?" on":""),esc(k[1])+rec);b.setAttribute("data-k",k[0]);
    b.onclick=function(){var s=S.c[x.id]||(S.c[x.id]={});s.c=(s.c===k[0]?"":k[0]);save();render()};
    chips.appendChild(b);
  });
  c.appendChild(chips);
  var nb=el("button","notebtn",(st.n?"Edit note":"+ Add note"));
  var ta=el("textarea","note"+(st.n?"":" hidden"));ta.value=st.n||"";ta.placeholder="Or give a different answer / direction...";
  nb.onclick=function(){ta.classList.toggle("hidden");if(!ta.classList.contains("hidden"))ta.focus()};
  ta.oninput=function(){var s=S.c[x.id]||(S.c[x.id]={});s.n=ta.value;save();nb.textContent=ta.value?"Edit note":"+ Add note"};
  c.appendChild(nb);c.appendChild(ta);
  return c;
}
function render(){
  renderFilters();
  var main=document.getElementById("main");main.innerHTML="";
  // conflicts first when relevant
  var showConflicts=(FILTER.status==="all"||FILTER.status==="actionable"||FILTER.status==="CONFLICT")&&FILTER.theme==="all";
  if(showConflicts){
    var cs=DATA.conflicts.filter(function(x){return matchQ(x.id+" "+x.title+" "+x.a+" "+x.b)&&(!FILTER.undecided||!(S.c[x.id]&&S.c[x.id].c))});
    if(cs.length){main.appendChild(el("div","sec",null)).textContent="Conflicts to resolve ("+cs.length+")";cs.forEach(function(x){main.appendChild(conflictCard(x))})}
  }
  var fs=DATA.findings.filter(function(x){return passStatus(x)&&(FILTER.theme==="all"||x.theme===FILTER.theme)&&matchQ(x.title+" "+x.detail+" "+x.theme)&&(!FILTER.undecided||!(S.f[x.id]&&S.f[x.id].d))});
  // sort: forgotten/partial first, then by phase
  var order={FORGOTTEN:0,PARTIAL:1,CONFLICT:2,"ALREADY-BUILT":3};
  fs.sort(function(a,b){return (order[a.status]-order[b.status])||((a.suggested_phase||9)-(b.suggested_phase||9))});
  main.appendChild(el("div","sec",null)).textContent="Findings ("+fs.length+")";
  fs.forEach(function(x){main.appendChild(findingCard(x))});
  if(!fs.length&&!(showConflicts))main.appendChild(el("div","sec",null)).textContent="Nothing matches this filter.";
  var d=decidedCount(),t=totalItems();
  document.getElementById("progbar").style.width=Math.round(d/t*100)+"%";
  document.getElementById("count").textContent=d+" / "+t+" decided";
}
function buildExport(){
  var L=["GSR REVIEW DECISIONS v1  ("+new Date().toISOString().slice(0,16).replace("T"," ")+")",""];
  L.push("CONFLICTS:");
  DATA.conflicts.forEach(function(x){var s=S.c[x.id];if(s&&(s.c||s.n)){var val=s.c==="a"?("A: "+x.a):s.c==="b"?("B: "+x.b):"(no pick)";L.push("  "+x.id+" "+x.title+" => "+val+(s.n?"  | note: "+s.n:""))}});
  L.push("");L.push("FINDINGS:");
  var grp={build:[],later:[],skip:[],discuss:[]};
  DATA.findings.forEach(function(x){var s=S.f[x.id];if(s&&(s.d||s.n)){(grp[s.d]||(grp[s.d]=[])).push("  "+x.id+" ["+x.theme+"] "+x.title+(s.n?"  | note: "+s.n:""))}});
  [["build","BUILD / KEEP"],["later","LATER"],["skip","SKIP / DROP"],["discuss","DISCUSS"]].forEach(function(k){if(grp[k[0]]&&grp[k[0]].length){L.push("");L.push(" "+k[1]+":");grp[k[0]].forEach(function(r){L.push(r)})}});
  var undF=DATA.findings.filter(function(x){return !(S.f[x.id]&&S.f[x.id].d)}).length;
  var undC=DATA.conflicts.filter(function(x){return !(S.c[x.id]&&S.c[x.id].c)}).length;
  L.push("");L.push("UNDECIDED: "+undF+" findings, "+undC+" conflicts.");
  return L.join("\\n");
}
function copyText(t){try{navigator.clipboard.writeText(t)}catch(e){}}
function toast(m){var e=document.getElementById("toast");e.textContent=m;e.classList.add("show");setTimeout(function(){e.classList.remove("show")},1800)}
document.getElementById("search").oninput=function(e){FILTER.q=e.target.value;render()};
document.getElementById("undecidedBtn").onclick=function(){FILTER.undecided=!FILTER.undecided;this.textContent=FILTER.undecided?"Show all":"Show undecided only";render()};
document.getElementById("copyBtn").onclick=function(){var t=buildExport();document.getElementById("exportText").value=t;copyText(t);document.getElementById("exportDlg").showModal();var ta=document.getElementById("exportText");ta.focus();ta.select();toast("Copied")};
document.getElementById("closeDlg").onclick=function(){document.getElementById("exportDlg").close()};
document.getElementById("copyAgain").onclick=function(){var ta=document.getElementById("exportText");ta.select();copyText(ta.value);toast("Copied")};
render();
</script>
</body>
</html>
`;

writeFileSync(OUT, html);
console.log("Wrote", OUT, "(" + (html.length / 1024).toFixed(0) + "KB, " + findings.length + " findings + " + conflicts.length + " conflicts)");
