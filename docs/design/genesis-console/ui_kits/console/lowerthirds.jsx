// Genesis Console UI Kit — Lower-Thirds Approval (interactive workflow)
// Exports: LowerThirdsApproval

const { useState:useStateL } = React;

// AI-style alternative slug-lines for the Regenerate action
const VARIATIONS = {
  l1:['Soft tissue found in T. rex bone','Original biomolecules, not mineral','70-million-year claim challenged'],
  l2:['Dr. Michael Houts · NASA','Space nuclear propulsion lead','Nuclear engineer, biblical creationist'],
  l3:['Designed to adapt, not evolve','Built-in adaptive engineering','Rapid adaptation by design'],
};

function L3Card({ item, onApprove, onReject, onRegenerate }){
  return (
    <div className="glass" style={{padding:'14px 15px',borderRadius:11,display:'flex',flexDirection:'column',gap:11}}>
      {/* mini lower-third preview — the broadcast bug shape */}
      <div style={{position:'relative',height:74,borderRadius:7,overflow:'hidden',background:'linear-gradient(120deg,rgba(10,16,28,.9),rgba(18,28,46,.9))',border:'1px solid rgba(120,160,200,.12)'}}>
        <div style={{position:'absolute',left:14,right:14,bottom:14,display:'flex',flexDirection:'column',gap:5}}>
          <div style={{height:3,width:40,background:'linear-gradient(90deg,var(--ice),var(--teal))',borderRadius:2}}></div>
          <div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:15,color:'#fff',letterSpacing:'.01em',lineHeight:1.05}}>{item.text}</div>
        </div>
        <span style={{position:'absolute',top:9,right:11}} className="micro">{item.seg}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
        <span className="micro" style={{color:'var(--fg-3)'}}>{item.beat} · v{item.ver}</span>
        <span style={{display:'flex',gap:7}}>
          <button className="btn" onClick={onRegenerate} title="AI alternative">Regenerate</button>
          <button className="btn btn--over" onClick={onReject}>Reject</button>
          <button className="btn btn--ok" onClick={onApprove}>Approve</button>
        </span>
      </div>
    </div>
  );
}

function LowerThirdsApproval(){
  const [pending,setPending] = useStateL([
    { id:'l1', seg:'Monologue', beat:'Beat 3', ver:1, text:'Soft tissue in dinosaur bone' },
    { id:'l2', seg:'Interview', beat:'Lower-third', ver:1, text:'Dr. Michael Houts — NASA' },
    { id:'l3', seg:'Interview', beat:'Beat 7', ver:1, text:'Adaptation by design' },
  ]);
  const [approved,setApproved] = useStateL(12);
  const [rejected,setRejected] = useStateL(0);

  const remove = (id) => setPending(p=>p.filter(x=>x.id!==id));
  const approve = (it) => { remove(it.id); setApproved(a=>a+1); };
  const reject  = (it) => { remove(it.id); setRejected(r=>r+1); };
  const regenerate = (it) => setPending(p=>p.map(x=>{
    if(x.id!==it.id) return x;
    const opts = VARIATIONS[x.id]||[x.text];
    const next = opts[x.ver % opts.length];
    return { ...x, text:next, ver:x.ver+1 };
  }));

  return (
    <GlassPanel title="Lower-Thirds Approval" meta={`${pending.length} pending · ${approved} approved`} lift={false}>
      <div style={{display:'flex',gap:18,marginBottom:14}}>
        <Stat n={pending.length} label="Pending" color="var(--gold-soft)"/>
        <Stat n={approved} label="Approved" color="var(--teal)"/>
        <Stat n={rejected} label="Rejected" color={rejected?'var(--over)':'var(--fg-3)'}/>
      </div>
      {pending.length===0 ? (
        <div style={{padding:'22px 0',textAlign:'center',color:'var(--fg-2)',fontSize:13}}>Queue clear — all graphics ready for ProPresenter.</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {pending.map(it=>(
            <L3Card key={it.id} item={it}
              onApprove={()=>approve(it)} onReject={()=>reject(it)} onRegenerate={()=>regenerate(it)} />
          ))}
        </div>
      )}
    </GlassPanel>
  );
}

function Stat({ n, label, color }){
  return (
    <div style={{display:'flex',flexDirection:'column',gap:3}}>
      <span className="mono" style={{fontSize:22,color}}>{String(n).padStart(2,'0')}</span>
      <span className="micro">{label}</span>
    </div>
  );
}

Object.assign(window, { LowerThirdsApproval });
