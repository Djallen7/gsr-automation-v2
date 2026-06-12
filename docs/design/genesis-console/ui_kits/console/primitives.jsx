// Genesis Console UI Kit — primitives
// Exports: Cosmos, GlassPanel, StatusDot, StatusPill, Micro, usePointerSpecular

const { useRef, useEffect, useState, useCallback } = React;

/* Pointer-tracked specular highlight — sets --mx/--my on the element */
function usePointerSpecular(){
  const ref = useRef(null);
  const onMove = useCallback((e)=>{
    const el = ref.current; if(!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    el.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
  },[]);
  return { ref, onPointerMove:onMove };
}

/* Pure-CSS cosmos backdrop */
function Cosmos(){
  const starRef = useRef(null);
  useEffect(()=>{
    const host = starRef.current; if(!host || host.childElementCount) return;
    const frag = document.createDocumentFragment();
    for(let i=0;i<120;i++){
      const s=document.createElement('i');
      const glow=Math.random()<0.1, sz=glow?2:(Math.random()<0.85?1:1.6);
      s.style.cssText=`width:${sz}px;height:${sz}px;left:${(Math.random()*100).toFixed(2)}%;top:${(Math.random()*100).toFixed(2)}%;opacity:${(0.12+Math.random()*0.55).toFixed(2)}`;
      if(glow){s.style.boxShadow='0 0 6px 1px rgba(150,200,255,.7)';s.style.background='#bfe2ff';}
      frag.appendChild(s);
    }
    host.appendChild(frag);
  },[]);
  return (
    <div className="cosmos" aria-hidden="true">
      <div className="cosmos__neb"></div>
      <div className="cosmos__bloom"></div>
      <div className="cosmos__stars" ref={starRef}></div>
      <div className="cosmos__vig"></div>
    </div>
  );
}

/* Glass panel with header + pointer specular + optional hover-lift */
function GlassPanel({ title, meta, lift=true, className='', style={}, children }){
  const spec = usePointerSpecular();
  return (
    <section
      ref={spec.ref} onPointerMove={spec.onPointerMove}
      className={`glass ${lift?'lift':''} ${className}`}
      style={{ padding:'18px 20px', ...style }}
    >
      <span className="gp-spec" style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:1,
        background:'radial-gradient(260px 260px at var(--mx,50%) var(--my,-40%),rgba(160,210,255,.13),transparent 60%)'}}></span>
      {(title||meta) && (
        <header style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:12,marginBottom:14,position:'relative',zIndex:2}}>
          {title && <h2 className="disp" style={{fontSize:15}}>{title}</h2>}
          {meta && <span className="micro" style={{color:'var(--fg-3)'}}>{meta}</span>}
        </header>
      )}
      <div style={{position:'relative',zIndex:2}}>{children}</div>
    </section>
  );
}

const DOT = { ok:{background:'var(--ok)',boxShadow:'0 0 7px rgba(54,214,195,.5)'},
  warn:{background:'var(--warn)',boxShadow:'0 0 7px rgba(201,168,76,.5)'},
  idle:{background:'var(--fg-3)'} };
function StatusDot({ kind='idle', style={} }){ return <span className="dot" style={{...DOT[kind],...style}}></span>; }

const PILL = { onair:['pill--onair','On Air'], ready:['pill--ready','Ready'], hold:['pill--hold','Hold'], draft:['pill--draft','Draft'] };
function StatusPill({ kind }){ const [c,l]=PILL[kind]||PILL.draft; return <span className={`pill ${c}`}>{l}</span>; }

function Micro({ children, style={} }){ return <span className="micro" style={style}>{children}</span>; }

Object.assign(window, { usePointerSpecular, Cosmos, GlassPanel, StatusDot, StatusPill, Micro });
