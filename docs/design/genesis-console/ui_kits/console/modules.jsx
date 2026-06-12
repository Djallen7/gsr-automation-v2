// Genesis Console UI Kit — modules
// Exports: CountdownHero, Rundown, BulletGraph, BookingPipeline, EpisodePipeline, TaskQueue

const { useState:useStateM, useEffect:useEffectM, useRef:useRefM } = React;

/* ---------- COUNTDOWN HERO (depletion arc + hollow numerals) ---------- */
function CountdownHero({ start=2*3600+14*60+37, windowSec=6*3600 }){
  const [sec,setSec] = useStateM(start);
  const R=138, C=2*Math.PI*R;
  useEffectM(()=>{
    const id=setInterval(()=>setSec(s=>s>0?s-1:0),1000);
    return ()=>clearInterval(id);
  },[]);
  const hh=String(Math.floor(sec/3600)).padStart(2,'0');
  const mm=String(Math.floor(sec%3600/60)).padStart(2,'0');
  const ss=String(Math.floor(sec%60)).padStart(2,'0');
  const frac=Math.max(0,Math.min(1,sec/windowSec));
  return (
    <GlassPanel lift={false} style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'26px 24px 24px'}}>
      <Micro style={{marginBottom:4}}>Time to Air</Micro>
      <div style={{position:'relative',width:300,height:300,display:'grid',placeItems:'center',margin:'6px 0 2px'}}>
        <svg viewBox="0 0 300 300" style={{position:'absolute',inset:0,transform:'rotate(-90deg)'}} aria-hidden="true">
          <defs><linearGradient id="kitArc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#36D6C3"/><stop offset="1" stopColor="#5BD0FF"/></linearGradient></defs>
          <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(120,160,200,.12)" strokeWidth="3"/>
          <circle cx="150" cy="150" r={R} fill="none" stroke="url(#kitArc)" strokeWidth="3.5" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C*(1-frac)} style={{filter:'drop-shadow(0 0 9px rgba(91,208,255,.5))'}}/>
        </svg>
        <div>
          <div style={{fontFamily:'var(--font-mono)',fontWeight:500,fontSize:64,lineHeight:.9,letterSpacing:'.02em',
            color:'rgba(200,224,250,.07)',WebkitTextStroke:'1.3px var(--fg-0)',fontVariantNumeric:'tabular-nums',
            textShadow:'0 0 26px rgba(120,180,255,.4)'}}>
            {hh}<span style={{WebkitTextStroke:'1.3px var(--ice)'}}>:</span>{mm}<span style={{WebkitTextStroke:'1.3px var(--ice)'}}>:</span>{ss}
          </div>
          <div style={{display:'flex',gap:34,marginTop:9,justifyContent:'center'}}>
            {['Hrs','Min','Sec'].map(u=><span key={u} style={{fontSize:9,letterSpacing:'.22em',color:'var(--fg-3)',textTransform:'uppercase',fontWeight:600}}>{u}</span>)}
          </div>
        </div>
      </div>
      <span style={{display:'inline-flex',alignItems:'center',gap:9,padding:'6px 14px',borderRadius:999,border:'1px solid rgba(54,214,195,.3)',background:'rgba(54,214,195,.06)',fontFamily:'var(--font-body)',fontWeight:600,fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--teal-soft)'}}>
        <span className="breathe" style={{width:7,height:7,borderRadius:'50%',background:'var(--teal)'}}></span>Cold Open On Air
      </span>
      <div style={{marginTop:18,fontFamily:'var(--font-mono)',fontSize:12,color:'var(--fg-2)',letterSpacing:'.04em'}}>Live-to-tape · FRI 8:00P CT</div>
    </GlassPanel>
  );
}

/* ---------- RUNDOWN (click to expand — progressive disclosure) ---------- */
function RundownRow({ r, open, onToggle }){
  return (
    <li>
      <button onClick={onToggle} aria-expanded={open}
        style={{all:'unset',cursor:'pointer',display:'grid',gridTemplateColumns:'30px 1fr auto',alignItems:'center',gap:14,
          padding:'11px 12px 11px 0',width:'100%',boxSizing:'border-box',borderRadius:4,
          background:open?'rgba(40,60,92,.30)':'transparent',transition:'background .4s var(--ease-expo)',
          borderBottom:'1px solid rgba(120,160,200,.10)'}}>
        <span className="mono" style={{fontSize:12,color:'var(--fg-3)',textAlign:'right'}}>{r.no}</span>
        <span style={{display:'flex',alignItems:'center',gap:9,fontFamily:'var(--font-body)',fontWeight:500,fontSize:14.5,color:'var(--fg-1)',minWidth:0}}>
          {r.pulse ? <span className="breathe" style={{width:8,height:8,borderRadius:'50%',background:'var(--ok)'}}></span> : <StatusDot kind={r.dot}/>}
          <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.name}</span>
        </span>
        <span style={{display:'flex',alignItems:'center',gap:12}}>
          <span className="mono" style={{fontSize:12,color:r.over?'var(--over)':'var(--fg-3)'}}>{r.len}</span>
          <StatusPill kind={r.status}/>
        </span>
      </button>
      <div style={{display:'grid',gridTemplateRows:open?'1fr':'0fr',opacity:open?1:0,transition:'grid-template-rows .5s var(--ease-expo),opacity .4s var(--ease-expo)'}}>
        <div style={{overflow:'hidden',minHeight:0}}>
          <div style={{padding:'11px 0 12px 44px',display:'flex',flexWrap:'wrap',gap:'14px 26px'}}>
            {Object.entries(r.d).map(([k,v])=>(
              <span key={k} style={{display:'flex',flexDirection:'column',gap:3}}>
                <span style={{fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--fg-3)',fontWeight:600}}>{k}</span>
                <span style={{fontFamily:k==='Note'?'var(--font-body)':'var(--font-mono)',fontSize:12.5,color:k==='Note'?'var(--fg-2)':'var(--fg-1)'}}>{v}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}
function Rundown({ rows }){
  const [open,setOpen] = useStateM(null);
  return (
    <GlassPanel title="Rundown · EP 214" meta="9 Segments · 22:55" style={{padding:'18px 8px 12px 20px'}}>
      <ul style={{listStyle:'none'}}>
        {rows.map((r,i)=><RundownRow key={r.no} r={r} open={open===i} onToggle={()=>setOpen(open===i?null:i)} />)}
      </ul>
    </GlassPanel>
  );
}

/* ---------- BULLET GRAPH (timing) ---------- */
function BulletGraph({ segs, scale=720 }){
  const mmss=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  return (
    <GlassPanel title="Segment Timing" meta="vs 26:30">
      <div style={{display:'flex',flexDirection:'column',gap:13}}>
        {segs.map(s=>(
          <div key={s.n} style={{display:'grid',gridTemplateColumns:'108px 1fr 52px',alignItems:'center',gap:12}}>
            <span style={{fontSize:12,color:'var(--fg-2)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.n}</span>
            <span style={{position:'relative',height:11}}>
              <span style={{position:'absolute',top:'50%',transform:'translateY(-50%)',height:5,borderRadius:3,width:(s.t/scale*100)+'%',background:'rgba(120,160,200,.16)'}}></span>
              <span style={{position:'absolute',top:'50%',transform:'translateY(-50%)',height:9,borderRadius:3,width:(s.a/scale*100)+'%',
                background:s.over?'linear-gradient(90deg,var(--teal) 60%,var(--over))':'linear-gradient(90deg,rgba(54,214,195,.55),var(--teal))'}}></span>
            </span>
            <span className="mono" style={{fontSize:11.5,textAlign:'right',color:s.over?'var(--over)':'var(--fg-2)'}}>{mmss(s.a)}</span>
          </div>
        ))}
      </div>
      <div style={{marginTop:18,paddingTop:16,borderTop:'1px solid rgba(201,168,76,.18)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:9}}>
          <Micro>Stacked Total</Micro><span className="mono" style={{fontSize:13}}>22:55 <span style={{color:'var(--fg-3)',fontSize:11}}>· −3:35</span></span>
        </div>
        <div style={{position:'relative',height:14,borderRadius:4,background:'rgba(120,160,200,.10)'}}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,borderRadius:4,width:'76.4%',background:'linear-gradient(90deg,rgba(54,214,195,.4),var(--teal))'}}></div>
          <div style={{position:'absolute',top:-5,bottom:-5,width:1.5,background:'var(--gold)',left:'88.3%'}}>
            <span style={{position:'absolute',bottom:-17,left:'50%',transform:'translateX(-50%)',fontFamily:'var(--font-mono)',fontSize:9.5,color:'var(--gold-soft)',whiteSpace:'nowrap'}}>26:30 target</span>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

/* ---------- BOOKING PIPELINE (opacity = stage) ---------- */
function BookingPipeline({ guests }){
  const OP={confirmed:1,pending:.6,pitch:.35};
  const COL={confirmed:'var(--teal)',pending:'var(--gold)',pitch:'var(--fg-3)'};
  return (
    <GlassPanel title="Booking Pipeline" meta="5 Guests">
      <div>
        {guests.map((g,i)=>(
          <div key={g.n} style={{display:'grid',gridTemplateColumns:'8px 1fr auto',alignItems:'center',gap:13,padding:'11px 0',opacity:OP[g.stage],
            borderBottom:i<guests.length-1?'1px solid rgba(120,160,200,.08)':'none'}}>
            <span className="dot" style={{background:COL[g.stage],boxShadow:`0 0 7px ${COL[g.stage]}`}}></span>
            <span><span style={{display:'block',fontSize:13.5,color:'var(--fg-0)',fontWeight:500,lineHeight:1.25}}>{g.n}</span>
              <span style={{display:'block',fontSize:11,color:'var(--fg-2)',marginTop:2}}>{g.f}</span></span>
            <span className="micro" style={{color:g.stage==='confirmed'?'var(--teal)':g.stage==='pending'?'var(--gold-soft)':'var(--fg-2)'}}>{g.label}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

/* ---------- EPISODE PIPELINE ---------- */
function EpisodePipeline({ eps }){
  return (
    <GlassPanel title="Episode Pipeline" meta="212 → 217+">
      <div>
        {eps.map((e,i)=>(
          <div key={e.no} style={{display:'grid',gridTemplateColumns:'54px 1fr auto',alignItems:'center',gap:14,padding:'10px 0',
            ...(e.current?{background:'rgba(91,208,255,.05)',borderRadius:4,margin:'0 -10px',padding:'10px'}:{}),
            borderBottom:i<eps.length-1?'1px solid rgba(120,160,200,.08)':'none'}}>
            <span className="mono" style={{fontSize:13,color:e.current?'var(--ice-soft)':'var(--fg-1)'}}>{e.no}</span>
            <span style={{fontSize:12,color:e.current?'var(--ice)':'var(--fg-2)'}}>{e.stage}</span>
            <span style={{height:4,width:64,borderRadius:2,background:'rgba(120,160,200,.12)',position:'relative',overflow:'hidden'}}>
              <span style={{position:'absolute',left:0,top:0,bottom:0,borderRadius:2,width:e.pct+'%',background:e.color}}></span>
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

/* ---------- TASK QUEUE (checkable) ---------- */
function TaskQueue({ tasks }){
  const [done,setDone] = useStateM({});
  return (
    <GlassPanel title="Task Queue" meta="This Week">
      <div>
        {tasks.map((t,i)=>{
          const checked=!!done[i];
          return (
            <button key={t.t} onClick={()=>setDone(d=>({...d,[i]:!d[i]}))}
              style={{all:'unset',cursor:'pointer',display:'grid',gridTemplateColumns:'18px 1fr auto',alignItems:'center',gap:13,padding:'11px 0',width:'100%',boxSizing:'border-box',
                borderBottom:i<tasks.length-1?'1px solid rgba(120,160,200,.08)':'none'}}>
              <span style={{width:15,height:15,borderRadius:3,border:`1.5px solid ${checked?'var(--teal)':'var(--fg-3)'}`,background:checked?'var(--teal)':'transparent',display:'grid',placeItems:'center',transition:'all .3s var(--ease-expo)'}}>
                {checked && <span style={{color:'#06121a',fontSize:11,fontWeight:700,lineHeight:1}}>✓</span>}
              </span>
              <span style={{fontSize:13.5,color:checked?'var(--fg-3)':'var(--fg-1)',textDecoration:checked?'line-through':'none'}}>{t.t}</span>
              <span className="mono" style={{fontSize:10.5,letterSpacing:'.04em',textTransform:'uppercase',color:t.today&&!checked?'var(--gold-soft)':'var(--fg-3)'}}>{t.due}</span>
            </button>
          );
        })}
      </div>
    </GlassPanel>
  );
}

Object.assign(window, { CountdownHero, Rundown, BulletGraph, BookingPipeline, EpisodePipeline, TaskQueue });
