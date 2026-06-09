#!/usr/bin/env node
// build_flight_worksheet.mjs
// Generates a SELF-CONTAINED, OFFLINE decisions worksheet for Daniel to work
// through on a flight (no internet needed). Saves to localStorage; a "Copy my
// answers" button produces a plain-text block he pastes back to Claude after.
// Pulls the "discuss" items from the review backlog and adds the graphics
// session, segment-timing, and open-confirm question sets.
// Run: /opt/node22/bin/node tools/build_flight_worksheet.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const backlog = JSON.parse(readFileSync(join(ROOT, "docs/_handoff/export-archaeology-backlog.json"), "utf8"));
const discuss = backlog.filter((x) => x.daniel_decision === "discuss")
  .map((x) => ({ id: x.id, q: x.title, detail: x.detail, rec: x.recommended_action || "", note: x.daniel_note || "" }));

const GRAPHICS = [
  { id: "g_mono_count", q: "Monologue graphics: how many per monologue?", opts: ["8 to 15, one every 2-5 sentences (current rule)", "A different range (say so in the note)"] },
  { id: "g_mono_first", q: "Monologue graphic #1 is always...", opts: ["An Intro Graphic (title card)", "Something else (note)"] },
  { id: "g_int_count", q: "Interview graphics: how many per interview?", opts: ["5 to 9 (current rule)", "A different range (note)"] },
  { id: "g_int_pattern", q: "Interview graphic order pattern?", opts: ["Intro Graphic, then Article Screenshot ~90% of the time, then b-roll/picture", "A different pattern (note)"] },
  { id: "g_ai_stage", q: "AI suggesting graphics from the script should start at which stage?", opts: ["Manual first: AI drafts, you approve every one", "Prompt-handoff", "Auto later", "Do not build AI suggestions yet"] },
  { id: "g_template", q: "AI graphics request template fields?", opts: ["Match the tracker columns: Segment, Graphic #, Type, Description, Source, Assigned To, Notes", "Add or remove fields (note)"] },
  { id: "g_mogrt", q: "Which motion-graphics (MOGRT) templates should the team build?", opts: ["All five: lower third, location, resource card, donation CTA, 4-up Ken Burns", "A subset (note which)"] },
  { id: "g_scan", q: "Run the multi-agent graphics-philosophy scan (1,737-graphic archive + the graphics-tracking archive together)?", opts: ["Yes, scan both together and propose rules", "Not now"] },
  { id: "g_vocab", q: "Graphic Type vocabulary?", opts: ["Standardize 'Intro Graphic' system-wide; keep the rest of the current list", "Adjust the list (note)"] },
];

const TIMING_SEGMENTS = [
  "Show Intro", "Opening Monologue", "Interview 1", "The Heavens Declare (roll-in)", "Kids Corner (roll-in)",
  "Q&A (roll-in)", "Ministry Report", "Viewer Voices", "Featured Resource", "Genesis Science Minute (roll-in)",
  "Interview 2", "Closing",
];

const CONFIRMS = [
  { id: "c14_map", q: "Run-of-show row map (conflict C-14): give the canonical B/C/D/E/F row codes for each segment, or say 'use what's in Rundown Creator'.", type: "fill", placeholder: "e.g. Show Intro B2, Monologue B3, Interview 1 tease B11 then C2, THD C8..." },
  { id: "kilauea", q: "Kilauea metadata: you said 'Episode 48' is a statistic in the article about the number of past volcanic events. Confirm what it should actually say (the record-breaking framing).", type: "fill", placeholder: "What the number refers to and how it should read on-screen / in metadata" },
];

const data = { generated: new Date().toISOString(), graphics: GRAPHICS, timing: TIMING_SEGMENTS, discuss, confirms: CONFIRMS };

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
.card.done{border-color:#2f6b46}
.q{font-weight:600;margin:0 0 4px}
.detail{font-size:13px;color:#cdd8ec;margin:4px 0 0}
.rec{font-size:12.5px;color:#a7f3d0;margin:5px 0 0}
.note-prev{font-size:12.5px;color:var(--warn);margin:5px 0 0}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 0}
.chip{font-size:13px;padding:8px 13px;border-radius:9px;border:1px solid var(--line);background:var(--chip);color:var(--ink);cursor:pointer;min-height:40px}
.chip.on{background:var(--accent);border-color:var(--accent);color:#fff}
.fill{width:100%;margin-top:9px;padding:9px;border-radius:9px;border:1px solid var(--line);background:#101a2d;color:var(--ink);font-size:14px;min-height:46px;resize:vertical}
.notebtn{font-size:12px;color:var(--accent);background:none;border:none;cursor:pointer;margin-top:8px;padding:4px 0}
.note{width:100%;margin-top:7px;padding:9px;border-radius:9px;border:1px solid var(--line);background:#101a2d;color:var(--ink);font-size:14px;min-height:46px;resize:vertical}
.hidden{display:none}
footer{position:fixed;bottom:0;left:0;right:0;background:#0b1120f2;border-top:1px solid var(--line);padding:11px 12px;display:flex;gap:9px;z-index:30}
.btn{flex:1;padding:13px;border-radius:11px;border:none;font-size:14.5px;font-weight:650;cursor:pointer}
.btn.primary{background:var(--accent);color:#fff}.btn.ghost{background:#1c2740;color:var(--ink);border:1px solid var(--line)}
.toast{position:fixed;bottom:78px;left:50%;transform:translateX(-50%);background:#22c55e;color:#06210f;padding:9px 16px;border-radius:999px;font-size:13px;font-weight:600;opacity:0;transition:opacity .2s;z-index:40}.toast.show{opacity:1}
dialog{background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:13px;max-width:92vw;width:600px;padding:0}
dialog::backdrop{background:#0008}.dlghead{padding:13px 15px;border-bottom:1px solid var(--line);font-weight:650}
.dlgbody{padding:13px 15px;max-height:62vh;overflow:auto}.dlgbody textarea{width:100%;min-height:300px;background:#101a2d;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:10px;font:12.5px ui-monospace,Menlo,monospace}
.dlgfoot{padding:11px 15px;border-top:1px solid var(--line);display:flex;gap:9px}
.intro{background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:13px;margin:12px 0}
</style></head>
<body>
<header>
  <h1>GSR Flight Worksheet</h1>
  <p class="sub">Works fully offline. Tap or type your answers; they save on this device. When you land, tap "Copy my answers" and paste the block back to Claude.</p>
  <div class="bars"><div class="prog"><i id="progbar"></i></div><div class="count" id="count">0 answered</div></div>
</header>
<main id="main"></main>
<footer><button class="btn ghost" id="undone">Show unanswered only</button><button class="btn primary" id="copy">Copy my answers</button></footer>
<div class="toast" id="toast"></div>
<dialog id="dlg"><div class="dlghead">Your answers</div><div class="dlgbody"><p style="font-size:12.5px;color:#9fb0cc;margin:0 0 8px">Already selected. Copy this and paste it back to Claude.</p><textarea id="out" readonly></textarea></div><div class="dlgfoot"><button class="btn ghost" id="close">Close</button><button class="btn primary" id="copy2">Copy again</button></div></div>
<script>
var DATA=${JSON.stringify(data)};
var KEY="gsr_flight_v1";
var S=load()||{choice:{},note:{},fill:{}};
function load(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var ONLY=false;
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function answered(id,kind){if(kind==="fill")return !!(S.fill[id]&&S.fill[id].trim());return !!S.choice[id]}
function totals(){var n=0;DATA.graphics.forEach(function(x){n++});DATA.timing.forEach(function(){n++});DATA.discuss.forEach(function(){n++});DATA.confirms.forEach(function(){n++});return n}
function doneCount(){var n=0;DATA.graphics.forEach(function(x){if(answered(x.id))n++});DATA.timing.forEach(function(s,i){if(answered("t_"+i,"fill"))n++});DATA.discuss.forEach(function(x){if(answered(x.id))n++});DATA.confirms.forEach(function(x){if(answered(x.id,"fill"))n++});return n}
function noteBlock(id,ph){var wrap=el("div");var b=el("button","notebtn",(S.note[id]?"Edit note":"+ Add note"));var ta=el("textarea","note"+(S.note[id]?"":" hidden"));ta.value=S.note[id]||"";ta.placeholder=ph||"More detail...";b.onclick=function(){ta.classList.toggle("hidden");if(!ta.classList.contains("hidden"))ta.focus()};ta.oninput=function(){S.note[id]=ta.value;save();b.textContent=ta.value?"Edit note":"+ Add note"};wrap.appendChild(b);wrap.appendChild(ta);return wrap}
function choiceCard(item,opts){var c=el("div","card"+(answered(item.id)?" done":""));var h="<p class='q'>"+esc(item.q)+"</p>";if(item.detail)h+="<div class='detail'>"+esc(item.detail)+"</div>";if(item.rec)h+="<div class='rec'>Suggested: "+esc(item.rec)+"</div>";if(item.note)h+="<div class='note-prev'>Your earlier note: "+esc(item.note)+"</div>";c.innerHTML=h;var chips=el("div","chips");opts.forEach(function(o){var b=el("button","chip"+(S.choice[item.id]===o?" on":""),esc(o));b.onclick=function(){S.choice[item.id]=(S.choice[item.id]===o?"":o);save();render()};chips.appendChild(b)});c.appendChild(chips);c.appendChild(noteBlock(item.id));return c}
function fillCard(id,q,ph){var c=el("div","card"+(answered(id,"fill")?" done":""));c.innerHTML="<p class='q'>"+esc(q)+"</p>";var ta=el("textarea","fill");ta.value=S.fill[id]||"";ta.placeholder=ph||"";ta.oninput=function(){S.fill[id]=ta.value;save();c.classList.toggle("done",!!ta.value.trim())};c.appendChild(ta);return c}
function show(idQ,kind){if(!ONLY)return true;return !answered(idQ,kind)}
function render(){var m=document.getElementById("main");m.innerHTML="";
 m.appendChild(el("div","intro","<b>How to use:</b> work top to bottom. Sections: Graphics decisions, Segment timing, your Discuss items, and two quick confirms. Everything saves automatically on this device, even with no signal. When you are done, tap <b>Copy my answers</b> and paste it to Claude."));
 m.appendChild(el("div","sec",null)).textContent="1. Graphics decisions (the session you wanted)";
 m.appendChild(el("div","secd",null)).textContent="Suggested answers reflect your current rules; change any you want.";
 DATA.graphics.forEach(function(x){if(show(x.id))m.appendChild(choiceCard(x,x.opts))});
 m.appendChild(el("div","sec",null)).textContent="2. Segment timing for the 58:00 calculator";
 m.appendChild(el("div","secd",null)).textContent="Target seconds per segment so the build can balance every show to 58:00. Interviews run ~780s; closing/outro ~30s. Put your target time (in seconds) for each.";
 DATA.timing.forEach(function(s,i){if(show("t_"+i,"fill"))m.appendChild(fillCard("t_"+i,s,"target seconds, e.g. 420"))});
 m.appendChild(el("div","sec",null)).textContent="3. Your 'discuss' items ("+DATA.discuss.length+") - resolve each";
 m.appendChild(el("div","secd",null)).textContent="You flagged these to talk through. Tap Build / Later / Skip, and use the note for anything a button can't capture.";
 DATA.discuss.forEach(function(x){if(show(x.id))m.appendChild(choiceCard(x,["Build it","Later","Skip","Still need to discuss"]))});
 m.appendChild(el("div","sec",null)).textContent="4. Quick confirms";
 DATA.confirms.forEach(function(x){if(show(x.id,"fill"))m.appendChild(fillCard(x.id,x.q,x.placeholder))});
 var d=doneCount(),t=totals();document.getElementById("progbar").style.width=Math.round(d/t*100)+"%";document.getElementById("count").textContent=d+" / "+t+" answered";
}
function buildOut(){var L=["GSR FLIGHT WORKSHEET ANSWERS ("+new Date().toISOString().slice(0,16).replace("T"," ")+")",""];
 L.push("== GRAPHICS ==");DATA.graphics.forEach(function(x){var a=S.choice[x.id]||"(no pick)";L.push("- "+x.q+" => "+a+(S.note[x.id]?"  | note: "+S.note[x.id]:""))});
 L.push("");L.push("== SEGMENT TIMING (target seconds) ==");DATA.timing.forEach(function(s,i){var v=S.fill["t_"+i]||"";if(v||S.note["t_"+i])L.push("- "+s+": "+v+(S.note["t_"+i]?"  | "+S.note["t_"+i]:""))});
 L.push("");L.push("== DISCUSS ITEMS ==");var g={};DATA.discuss.forEach(function(x){var a=S.choice[x.id]||"(undecided)";(g[a]=g[a]||[]).push("- "+x.id+": "+x.q+(S.note[x.id]?"  | note: "+S.note[x.id]:""))});Object.keys(g).forEach(function(k){L.push(" ["+k+"]");g[k].forEach(function(r){L.push("  "+r)})});
 L.push("");L.push("== CONFIRMS ==");DATA.confirms.forEach(function(x){L.push("- "+x.id+": "+(S.fill[x.id]||"(blank)"))});
 L.push("");L.push("Answered "+doneCount()+" / "+totals()+".");return L.join("\\n")}
function copyText(t){try{navigator.clipboard.writeText(t)}catch(e){}}
function toast(m){var e=document.getElementById("toast");e.textContent=m;e.classList.add("show");setTimeout(function(){e.classList.remove("show")},1800)}
document.getElementById("undone").onclick=function(){ONLY=!ONLY;this.textContent=ONLY?"Show all":"Show unanswered only";render()};
document.getElementById("copy").onclick=function(){var t=buildOut();document.getElementById("out").value=t;copyText(t);document.getElementById("dlg").showModal();var ta=document.getElementById("out");ta.focus();ta.select();toast("Copied")};
document.getElementById("close").onclick=function(){document.getElementById("dlg").close()};
document.getElementById("copy2").onclick=function(){var ta=document.getElementById("out");ta.select();copyText(ta.value);toast("Copied")};
render();
</script>
</body></html>
`;

const OUT = join(ROOT, "docs/_handoff/gsr-flight-worksheet.html");
writeFileSync(OUT, html);
console.log("Wrote", OUT, "(" + (html.length / 1024).toFixed(0) + "KB; " + discuss.length + " discuss items + " + GRAPHICS.length + " graphics Qs + " + TIMING_SEGMENTS.length + " timing rows + " + CONFIRMS.length + " confirms)");
