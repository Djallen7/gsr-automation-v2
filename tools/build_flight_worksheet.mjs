#!/usr/bin/env node
// build_flight_worksheet.mjs
// Self-contained OFFLINE decisions worksheet for Daniel to work through on a
// flight. Everything is PRE-FILLED from context Daniel already provided (canon,
// his review notes, the dataset) so he confirms rather than composes. Free text
// is reserved only for items that genuinely cannot be pre-answered.
// Run: /opt/node22/bin/node tools/build_flight_worksheet.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const backlog = JSON.parse(readFileSync(join(ROOT, "docs/_handoff/export-archaeology-backlog.json"), "utf8"));

// Pre-select a default chip for each discuss item from its recommended action / note.
function defFor(rec, note) {
  const s = ((rec || "") + " " + (note || "")).toLowerCase();
  if (/\b(skip|drop|abandon|ignore)\b/.test(s)) return "Skip";
  if (/roadmap|later|park|defer|decide whether|decide on|when wanted|optional/.test(s)) return "Later";
  if (/schedule a session|needs daniel|confirm|verify|circle back|understand/.test(s)) return "Still need to discuss";
  if (/build|adopt|run\b|persist|commit|fix|make (a|it)|turn into|keep|create|add\b/.test(s)) return "Build it";
  return "Still need to discuss";
}
const overrides = {
  "lt-monologue-5beat-arc": "Build it",          // he said "open to it" with flexibility
  "ops-status-md-trigger": "Still need to discuss", // he wants to understand benefits first
  "meta-kilauea-edit": "Still need to discuss",   // handled in the confirms section
  "graphics-archive-philosophy-scan": "Build it", // he said yes, combine archives (also a graphics-session item)
  "rc-runtime-58min-button": "Build it",          // timing captured in section 2
  "data-507-contact-import": "Later",
  "social-shortform-opusclip": "Later",
};
const discuss = backlog.filter((x) => x.daniel_decision === "discuss").map((x) => ({
  id: x.id, q: x.title, detail: x.detail || "", rec: x.recommended_action || "", note: x.daniel_note || "",
  def: overrides[x.id] || defFor(x.recommended_action, x.daniel_note),
}));

const GRAPHICS = [
  { id: "g_mono_count", q: "Monologue: how many graphics per monologue?",
    detail: "Canon (from your 1,737-graphic philosophy): 8 to 15, roughly one every 2 to 5 sentences. Never leave an empty cue slot.",
    opts: ["8 to 15, one every 2-5 sentences", "A different range (note)"], def: "8 to 15, one every 2-5 sentences" },
  { id: "g_mono_first", q: "Monologue graphic #1 is...",
    detail: "Canon: graphic #1 is almost always the title card. You decided to call it 'Intro Graphic' everywhere.",
    opts: ["Always an Intro Graphic (title card)", "Something else (note)"], def: "Always an Intro Graphic (title card)" },
  { id: "g_int_count", q: "Interview: how many graphics per interview?",
    detail: "Canon: 5 to 9 per interview. Ministry report 2 to 4, no title card.",
    opts: ["5 to 9 per interview", "A different range (note)"], def: "5 to 9 per interview" },
  { id: "g_int_pattern", q: "Interview graphic order pattern?",
    detail: "Canon: #1 Intro Graphic, #2 Article Screenshot ~90% of the time, then b-roll/picture. About 40% of all graphics are b-roll loops; clips-with-audio ~2.4%.",
    opts: ["Intro Graphic, then Article Screenshot ~90%, then b-roll/picture", "A different pattern (note)"], def: "Intro Graphic, then Article Screenshot ~90%, then b-roll/picture" },
  { id: "g_ai_stage", q: "AI suggesting graphics from the script should start at which stage?",
    detail: "Your maturity dial says everything starts Manual. Your review note: also build a separate (trickier) rule guide for monologue-graphic suggestions.",
    opts: ["Manual first: AI drafts, you approve each", "Prompt-handoff", "Auto later", "Do not build AI suggestions yet"], def: "Manual first: AI drafts, you approve each" },
  { id: "g_template", q: "AI graphics request template fields?",
    detail: "Your live Graphics Tracker columns: Segment | Graphic # | Graphic Type | Description | Status | Assigned To | Notes.",
    opts: ["Match the tracker columns exactly", "Add or remove fields (note)"], def: "Match the tracker columns exactly" },
  { id: "g_mogrt", q: "Which motion-graphics (MOGRT) templates should the team build?",
    detail: "From your review: lower third, location, resource card, donation CTA, 4-up Ken Burns. Sourced from Motion Array / Mixkit / Pond5.",
    opts: ["All five (lower third, location, resource card, donation CTA, 4-up Ken Burns)", "A subset (note which)"], def: "All five (lower third, location, resource card, donation CTA, 4-up Ken Burns)" },
  { id: "g_scan", q: "Run the multi-agent graphics-philosophy scan?",
    detail: "Your note: yes, but combine the 1,737-graphic archive WITH the graphics-tracking archive (past monologue + interview graphics).",
    opts: ["Yes, scan both archives together and propose rules", "Not now"], def: "Yes, scan both archives together and propose rules" },
  { id: "g_vocab", q: "Graphic Type vocabulary?",
    detail: "You decided: standardize 'Intro Graphic', eliminate 'Title Graphic'. Rest of the list: B-roll, Pre-made: B-roll, Pre-made: Graphic, Clip w/audio, Article Screenshot, Picture, Propres Quote, Book Cover.",
    opts: ["Standardize 'Intro Graphic'; keep the rest of the list", "Adjust the list (note)"], def: "Standardize 'Intro Graphic'; keep the rest of the list" },
];

// Pre-filled target seconds per segment, from the voice profile durations + your note (interviews ~13 min, outro ~30s).
const TIMING = [
  { name: "Show Intro", def: 30, src: "~0:30" },
  { name: "Opening Monologue", def: 420, src: "~7 min" },
  { name: "Interview 1", def: 780, src: "your note: ~13 min" },
  { name: "The Heavens Declare (roll-in)", def: 180, src: "roll-in, varies, confirm" },
  { name: "Kids Corner (roll-in)", def: 180, src: "roll-in, varies, confirm" },
  { name: "Q&A (roll-in)", def: 120, src: "roll-in, varies, confirm" },
  { name: "Ministry Report", def: 120, src: "~2 min" },
  { name: "Viewer Voices", def: 120, src: "~2 min" },
  { name: "Featured Resource", def: 120, src: "~2 min" },
  { name: "Genesis Science Minute (roll-in)", def: 90, src: "roll-in, varies, confirm" },
  { name: "Interview 2", def: 780, src: "your note: ~13 min" },
  { name: "Closing", def: 60, src: "~1 min (outro ~30s)" },
];

const CONFIRMS = [
  { id: "c14_map", q: "Run-of-show row map (conflict C-14): confirm the canon map or flag fixes.",
    detail: "From canon 9c. The conflict was a discrepancy with one other map, so just confirm this is right.",
    opts: ["Use the canon map: Show Intro B2, Monologue B3, Int1 tease B11 then C2, THD C8, KC D2, Q&A D2, MR E2, VV E4, FR E6, GSM E8, Int2 tease E10 then F2, Closing F8", "It's different (note the fixes)"],
    def: "Use the canon map: Show Intro B2, Monologue B3, Int1 tease B11 then C2, THD C8, KC D2, Q&A D2, MR E2, VV E4, FR E6, GSM E8, Int2 tease E10 then F2, Closing F8", type: "choice" },
  { id: "kilauea", q: "Kilauea metadata confirm.", type: "fill",
    detail: "Your read was: 'Episode 48' is a statistic in the article about the number of past volcanic events, and it should be reframed as record-breaking. Confirm or correct below.",
    fillDefault: "The number refers to a count of past volcanic events in the article (not an episode number). Reframe it as a record-breaking figure on screen. [confirm or correct]" },
];

const data = { generated: new Date().toISOString(), graphics: GRAPHICS, timing: TIMING, discuss, confirms: CONFIRMS };

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>GSR Flight Worksheet</title>
<style>
:root{--bg:#0e1422;--surface:#172238;--ink:#e8eef9;--dim:#9fb0cc;--line:#26334d;--accent:#3b82f6;--good:#22c55e;--warn:#d9a73a;--chip:#1d2942;}
*{box-sizing:border-box}
body{margin:0;background:linear-gradient(180deg,#0b1120,#0e1422);color:var(--ink);font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding-bottom:120px}
header{position:sticky;top:0;z-index:20;background:#0b1120ee;backdrop-filter:blur(8px);border-bottom:1px solid var(--line);padding:12px 14px}
h1{font-size:17px;margin:0 0 2px}.sub{font-size:12.5px;color:var(--dim);margin:0}
.bars{display:flex;gap:8px;align-items:center;margin-top:9px}
.prog{flex:1;height:8px;border-radius:6px;background:#1c2740;overflow:hidden}.prog>i{display:block;height:100%;background:linear-gradient(90deg,#3b82f6,#22c55e);width:0%}
.count{font-size:12px;color:var(--dim);white-space:nowrap}
main{padding:12px 12px 0;max-width:820px;margin:0 auto}
.sec{font-size:13px;color:#bcd;text-transform:uppercase;letter-spacing:.06em;margin:22px 4px 4px;font-weight:700}
.secd{font-size:12.5px;color:var(--dim);margin:0 4px 8px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:13px;margin-bottom:11px}
.card.changed{border-color:#2f6b46}
.q{font-weight:600;margin:0 0 4px}
.detail{font-size:13px;color:#cdd8ec;margin:4px 0 0}
.note-prev{font-size:12.5px;color:var(--warn);margin:5px 0 0}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 0}
.chip{font-size:13px;padding:8px 13px;border-radius:9px;border:1px solid var(--line);background:var(--chip);color:var(--ink);cursor:pointer;min-height:40px}
.chip.on{background:var(--accent);border-color:var(--accent);color:#fff}
.chip.def{outline:1px dashed #4a5b78}
.tag{font-size:11px;color:var(--dim);margin-top:6px}
.tag.kept{color:#7f8da3}.tag.mine{color:var(--good)}
.fillrow{display:flex;align-items:center;gap:10px;margin-top:8px}
.fillrow input{width:110px;padding:8px;border-radius:8px;border:1px solid var(--line);background:#101a2d;color:var(--ink);font-size:15px;text-align:right}
.fillrow .src{font-size:12px;color:var(--dim)}
.fill{width:100%;margin-top:9px;padding:9px;border-radius:9px;border:1px solid var(--line);background:#101a2d;color:var(--ink);font-size:14px;min-height:64px;resize:vertical}
.notebtn{font-size:12px;color:var(--accent);background:none;border:none;cursor:pointer;margin-top:8px;padding:4px 0}
.note{width:100%;margin-top:7px;padding:9px;border-radius:9px;border:1px solid var(--line);background:#101a2d;color:var(--ink);font-size:14px;min-height:46px;resize:vertical}
.hidden{display:none}
.sum{font-size:12.5px;color:var(--dim);margin:2px 4px 10px}
footer{position:fixed;bottom:0;left:0;right:0;background:#0b1120f2;border-top:1px solid var(--line);padding:11px 12px;display:flex;gap:9px;z-index:30}
.btn{flex:1;padding:13px;border-radius:11px;border:none;font-size:14.5px;font-weight:650;cursor:pointer}
.btn.primary{background:var(--accent);color:#fff}.btn.ghost{background:#1c2740;color:var(--ink);border:1px solid var(--line)}
.toast{position:fixed;bottom:78px;left:50%;transform:translateX(-50%);background:#22c55e;color:#06210f;padding:9px 16px;border-radius:999px;font-size:13px;font-weight:600;opacity:0;transition:opacity .2s;z-index:40}.toast.show{opacity:1}
dialog{background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:13px;max-width:92vw;width:600px;padding:0}
dialog::backdrop{background:#0008}.dlghead{padding:13px 15px;border-bottom:1px solid var(--line);font-weight:650}
.dlgbody{padding:13px 15px;max-height:62vh;overflow:auto}.dlgbody textarea{width:100%;min-height:300px;background:#101a2d;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:10px;font:12.5px ui-monospace,Menlo,monospace}
.dlgfoot{padding:11px 15px;border-top:1px solid var(--line);display:flex;gap:9px}
.intro{background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:13px;margin:12px 0;font-size:13.5px}
</style></head>
<body>
<header>
  <h1>GSR Flight Worksheet</h1>
  <p class="sub">Pre-filled from your own context. Just scan and change what you disagree with. Works fully offline; saves on this device.</p>
  <div class="bars"><div class="prog"><i id="progbar"></i></div><div class="count" id="count">reviewing</div></div>
</header>
<main id="main"></main>
<footer><button class="btn ghost" id="changedBtn">Show only what I changed</button><button class="btn primary" id="copy">Copy my answers</button></footer>
<div class="toast" id="toast"></div>
<dialog id="dlg"><div class="dlghead">Your answers</div><div class="dlgbody"><p style="font-size:12.5px;color:#9fb0cc;margin:0 0 8px">Already selected. Copy this and paste it back to Claude. Items you left on my suggestion are marked (default); items you changed are marked (your pick).</p><textarea id="out" readonly></textarea></div><div class="dlgfoot"><button class="btn ghost" id="close">Close</button><button class="btn primary" id="copy2">Copy again</button></div></div>
<script>
var DATA=${JSON.stringify(data)};
var KEY="gsr_flight_v2";
var S=load()||{choice:{},note:{},fill:{}};
function load(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var ONLY=false;
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function eff(id,def){return (S.choice[id]!=null && S.choice[id]!=="")?S.choice[id]:def}
function changedChoice(id){return S.choice[id]!=null && S.choice[id]!==""}
function noteBlock(id,ph){var wrap=el("div");var b=el("button","notebtn",(S.note[id]?"Edit note":"+ Add note"));var ta=el("textarea","note"+(S.note[id]?"":" hidden"));ta.value=S.note[id]||"";ta.placeholder=ph||"More detail...";b.onclick=function(){ta.classList.toggle("hidden");if(!ta.classList.contains("hidden"))ta.focus()};ta.oninput=function(){S.note[id]=ta.value;save();b.textContent=ta.value?"Edit note":"+ Add note"};wrap.appendChild(b);wrap.appendChild(ta);return wrap}
function choiceCard(item){var changed=changedChoice(item.id);var c=el("div","card"+(changed?" changed":""));var h="<p class='q'>"+esc(item.q)+"</p>";if(item.detail)h+="<div class='detail'>"+esc(item.detail)+"</div>";if(item.note)h+="<div class='note-prev'>Your earlier note: "+esc(item.note)+"</div>";c.innerHTML=h;var chips=el("div","chips");var cur=eff(item.id,item.def);item.opts.forEach(function(o){var isDef=(o===item.def);var b=el("button","chip"+(o===cur?" on":"")+(isDef&&!changed?" def":""),esc(o));b.onclick=function(){S.choice[item.id]=o;save();render()};chips.appendChild(b)});c.appendChild(chips);c.appendChild(el("div","tag "+(changed?"mine":"kept"),changed?"Your pick":"Pre-filled (my suggestion) - tap to change"));c.appendChild(noteBlock(item.id));return c}
function fillCardText(item){var changed=S.fill[item.id]!=null;var c=el("div","card"+(changed?" changed":""));var h="<p class='q'>"+esc(item.q)+"</p>";if(item.detail)h+="<div class='detail'>"+esc(item.detail)+"</div>";c.innerHTML=h;var ta=el("textarea","fill");ta.value=(S.fill[item.id]!=null?S.fill[item.id]:(item.fillDefault||""));ta.oninput=function(){S.fill[item.id]=ta.value;save()};c.appendChild(ta);c.appendChild(el("div","tag "+(changed?"mine":"kept"),changed?"Edited by you":"Pre-filled - edit if needed"));return c}
function timingSum(){var t=0;DATA.timing.forEach(function(s,i){var v=S.fill["t_"+i];v=(v!=null&&v!=="")?parseInt(v,10):s.def;if(!isNaN(v))t+=v});return t}
function render(){var m=document.getElementById("main");m.innerHTML="";
 m.appendChild(el("div","intro","<b>How this works:</b> I have pre-filled every answer from what you have already told me (your canon, your review notes, the show data). Just scan down and tap a different option only where you disagree, then add a note if a button cannot capture it. Only the Kilauea box needs you to read and confirm. When you land, tap <b>Copy my answers</b> and paste it to me."));
 m.appendChild(el("div","sec",null)).textContent="1. Graphics decisions";
 DATA.graphics.forEach(function(x){if(!ONLY||changedChoice(x.id)||S.note[x.id])m.appendChild(choiceCard(x))});
 m.appendChild(el("div","sec",null)).textContent="2. Segment timing for the 58:00 calculator";
 m.appendChild(el("div","secd",null)).textContent="Pre-filled with real durations. Adjust any number (in seconds); blanks fall back to my default.";
 var sumNote=el("div","sum",null);m.appendChild(sumNote);
 DATA.timing.forEach(function(s,i){var changed=S.fill["t_"+i]!=null&&S.fill["t_"+i]!=="";if(ONLY&&!changed)return;var c=el("div","card"+(changed?" changed":""));c.innerHTML="<p class='q'>"+esc(s.name)+"</p>";var row=el("div","fillrow");var inp=el("input");inp.type="number";inp.value=(S.fill["t_"+i]!=null?S.fill["t_"+i]:s.def);inp.oninput=function(){S.fill["t_"+i]=inp.value;save();var tot=timingSum();sumNote.textContent="Current total: "+tot+"s ("+(tot/60).toFixed(1)+" min). Target is about 3480s (58:00); segment breaks fill the rest.";c.classList.toggle("changed",inp.value!=="")};var lab=el("span","src","seconds  ("+esc(s.src)+")");row.appendChild(inp);row.appendChild(lab);c.appendChild(row);m.appendChild(c)});
 var tot=timingSum();sumNote.textContent="Current total: "+tot+"s ("+(tot/60).toFixed(1)+" min). Target is about 3480s (58:00); segment breaks fill the rest.";
 m.appendChild(el("div","sec",null)).textContent="3. Your discuss items ("+DATA.discuss.length+")";
 m.appendChild(el("div","secd",null)).textContent="Each is pre-set to my recommended call. Change only the ones you see differently.";
 DATA.discuss.forEach(function(x){x.opts=["Build it","Later","Skip","Still need to discuss"];if(!ONLY||changedChoice(x.id)||S.note[x.id])m.appendChild(choiceCard(x))});
 m.appendChild(el("div","sec",null)).textContent="4. Quick confirms";
 DATA.confirms.forEach(function(x){if(ONLY&&!(changedChoice(x.id)||S.fill[x.id]!=null))return;if(x.type==="fill")m.appendChild(fillCardText(x));else m.appendChild(choiceCard(x))});
 var changedN=0;DATA.graphics.concat(DATA.discuss).forEach(function(x){if(changedChoice(x.id))changedN++});DATA.confirms.forEach(function(x){if(changedChoice(x.id)||S.fill[x.id]!=null)changedN++});DATA.timing.forEach(function(s,i){if(S.fill["t_"+i]!=null&&S.fill["t_"+i]!=="")changedN++});
 document.getElementById("progbar").style.width="100%";document.getElementById("count").textContent=changedN+" changed";
}
function copyText(t){try{navigator.clipboard.writeText(t)}catch(e){}}
function toast(m){var e=document.getElementById("toast");e.textContent=m;e.classList.add("show");setTimeout(function(){e.classList.remove("show")},1800)}
function buildOut(){var L=["GSR FLIGHT WORKSHEET ANSWERS ("+new Date().toISOString().slice(0,16).replace("T"," ")+")","(items marked (default) were left on my suggestion; (your pick) you changed)",""];
 L.push("== GRAPHICS ==");DATA.graphics.forEach(function(x){var v=eff(x.id,x.def);L.push("- "+x.q+" => "+v+(changedChoice(x.id)?" (your pick)":" (default)")+(S.note[x.id]?"  | note: "+S.note[x.id]:""))});
 L.push("");L.push("== SEGMENT TIMING (seconds) ==");DATA.timing.forEach(function(s,i){var v=(S.fill["t_"+i]!=null&&S.fill["t_"+i]!=="")?S.fill["t_"+i]:s.def;L.push("- "+s.name+": "+v+((S.fill["t_"+i]!=null&&S.fill["t_"+i]!=="")?" (your pick)":" (default)"))});L.push("  TOTAL: "+timingSum()+"s");
 L.push("");L.push("== DISCUSS ITEMS ==");var g={};DATA.discuss.forEach(function(x){var v=eff(x.id,x.def);(g[v]=g[v]||[]).push("  - "+x.id+": "+x.q+(changedChoice(x.id)?"":" (default)")+(S.note[x.id]?"  | note: "+S.note[x.id]:""))});["Build it","Later","Skip","Still need to discuss"].forEach(function(k){if(g[k]){L.push(" ["+k+"]");g[k].forEach(function(r){L.push(r)})}});
 L.push("");L.push("== CONFIRMS ==");DATA.confirms.forEach(function(x){if(x.type==="fill")L.push("- "+x.id+": "+(S.fill[x.id]!=null?S.fill[x.id]:x.fillDefault));else L.push("- "+x.id+": "+eff(x.id,x.def)+(changedChoice(x.id)?" (your pick)":" (default)"))});
 return L.join("\\n")}
document.getElementById("changedBtn").onclick=function(){ONLY=!ONLY;this.textContent=ONLY?"Show all":"Show only what I changed";render()};
document.getElementById("copy").onclick=function(){var t=buildOut();document.getElementById("out").value=t;copyText(t);document.getElementById("dlg").showModal();var ta=document.getElementById("out");ta.focus();ta.select();toast("Copied")};
document.getElementById("close").onclick=function(){document.getElementById("dlg").close()};
document.getElementById("copy2").onclick=function(){var ta=document.getElementById("out");ta.select();copyText(ta.value);toast("Copied")};
render();
</script>
</body></html>
`;

const OUT = join(ROOT, "docs/_handoff/gsr-flight-worksheet.html");
writeFileSync(OUT, html);
console.log("Wrote", OUT, "(" + (html.length / 1024).toFixed(0) + "KB; pre-filled: " + GRAPHICS.length + " graphics, " + TIMING.length + " timing, " + discuss.length + " discuss, " + CONFIRMS.length + " confirms)");
