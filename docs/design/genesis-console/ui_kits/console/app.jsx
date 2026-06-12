// Genesis Console UI Kit — app assembly (TopStrip + interactive layout)
const { useState:useStateA, useEffect:useEffectA } = React;

function TopStrip(){
  const [clock,setClock] = useStateA('00:00:00');
  useEffectA(()=>{
    const t=()=>{const d=new Date();setClock([d.getHours(),d.getMinutes(),d.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':'));};
    t(); const id=setInterval(t,1000); return ()=>clearInterval(id);
  },[]);
  const Seg=({label,children,mono,disp})=>(
    <div style={{display:'flex',flexDirection:'column',gap:3,padding:'14px 22px',position:'relative',flex:'none'}}>
      <span className="micro">{label}</span>
      <span style={{fontFamily:mono?'var(--font-mono)':disp?'var(--font-display)':'var(--font-mono)',fontSize:disp?18:15,color:'var(--fg-0)',fontWeight:500,whiteSpace:'nowrap',letterSpacing:'.02em'}}>{children}</span>
    </div>
  );
  return (
    <header className="glass" style={{display:'flex',alignItems:'center'}}>
      <div style={{padding:'12px 36px 12px 22px',display:'flex',alignItems:'center',gap:13}}>
        <span style={{width:30,height:30,borderRadius:'50%',flex:'none',background:'conic-gradient(from 210deg,var(--teal),var(--ice),#2a5d8a,var(--teal))',WebkitMask:'radial-gradient(circle 9px at 50% 50%,transparent 98%,#000 100%)',mask:'radial-gradient(circle 9px at 50% 50%,transparent 98%,#000 100%)',transform:'rotate(-18deg) skewX(-9deg)',boxShadow:'0 0 14px rgba(91,208,255,.25)'}}></span>
        <span style={{display:'flex',flexDirection:'column',gap:3}}>
          <span className="disp" style={{fontSize:15,letterSpacing:'.05em',lineHeight:1}}>THE GENESIS SCIENCE REPORT</span>
          <span style={{fontSize:9.5,letterSpacing:'.30em',color:'var(--ice)',textTransform:'uppercase',fontWeight:600}}>Production Command</span>
        </span>
      </div>
      <Seg label="Anchor" disp>David Rives</Seg>
      <Seg label="Show Clock">{clock}</Seg>
      <div style={{flex:1}}></div>
      <Seg label="Episode" disp>EP&nbsp;214</Seg>
      <Seg label="Air">FRI&nbsp;8:00P&nbsp;CT</Seg>
      <Seg label="Runtime Target">26:30</Seg>
      <div style={{display:'flex',flexDirection:'column',gap:3,padding:'14px 22px'}}>
        <span className="micro">Status</span>
        <span style={{display:'inline-flex',alignItems:'center',gap:8,fontFamily:'var(--font-body)',fontWeight:600,fontSize:12,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--gold-soft)'}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:'var(--warn)',boxShadow:'0 0 8px var(--warn)'}}></span>In Build
        </span>
      </div>
    </header>
  );
}

const RUNDOWN=[
  {no:'01',name:'Cold Open',status:'onair',dot:'ok',len:'0:35',pulse:true,d:{Script:'Locked',L3:'2 lower-thirds',Note:'Teaser cut from soft-tissue B-roll'}},
  {no:'02',name:'Monologue — Soft Tissue',status:'ready',dot:'ok',len:'4:10',d:{Script:'Ready',L3:'5 lower-thirds',Note:'Schweitzer soft-tissue findings'}},
  {no:'03',name:'L3 Package · 15ct',status:'ready',dot:'ok',len:'—',d:{Script:'Ready',L3:'15 of 15 built · 2 pending',Note:'Lock today'}},
  {no:'04',name:'Toss to Guest',status:'draft',dot:'idle',len:'0:20',d:{Script:'Draft',Guest:'→ Dr. Houts',Note:'Bridge line into interview'}},
  {no:'05',name:'Interview — Dr. Michael Houts',status:'hold',dot:'warn',len:'11:20',over:true,d:{Guest:'Dr. Michael Houts',Affil:'NASA · Space Nuclear',Feed:'Remote uplink',Note:'Confirm uplink Wed · over target'}},
  {no:'06',name:'Ministry Report',status:'draft',dot:'idle',len:'3:05',d:{Script:'Draft',Source:'David Rives Ministries',Note:'Awaiting copy'}},
  {no:'07',name:'GSM Toss',status:'draft',dot:'idle',len:'0:15',d:{Script:'Draft',Note:'Toss to Genesis Science Minute'}},
  {no:'08',name:'Scriptural Reflection (David)',status:'draft',dot:'idle',len:'2:15',d:{Script:'Draft',Read:'David Rives',Note:'Closing reflection · Psalm passage'}},
  {no:'09',name:'Closer + CTA',status:'draft',dot:'idle',len:'1:30',d:{Script:'Draft',L3:'CTA card',Note:'Subscribe + GSN promo'}},
];
const SEG=[{n:'Cold Open',t:40,a:35},{n:'Monologue',t:270,a:250},{n:'Interview',t:540,a:680,over:true},{n:'Ministry Report',t:200,a:185},{n:'Reflection',t:150,a:135},{n:'Closer',t:90,a:90}];
const BOOK=[{n:'Dr. Michael Houts',f:'NASA · Space Nuclear',stage:'confirmed',label:'Confirmed'},{n:'Tommy Lohman',f:'Paleontology',stage:'pending',label:'48h Pending'},{n:'Dr. K. Sanford',f:'Genetics',stage:'pending',label:'48h Pending'},{n:'R. Guliuzza',f:'Adaptation',stage:'pitch',label:'Pitch'},{n:'Dr. J. Tomkins',f:'Genomes',stage:'pitch',label:'Pitch'}];
const EPS=[{no:'212',stage:'Aired',pct:100,color:'var(--teal)'},{no:'213',stage:'Aired',pct:100,color:'var(--teal)'},{no:'214',stage:'In Build · Fri',pct:64,color:'var(--ice)',current:true},{no:'215',stage:'Booking',pct:34,color:'var(--gold)'},{no:'216',stage:'Research',pct:16,color:'rgba(120,160,200,.4)'},{no:'217+',stage:'Open',pct:6,color:'rgba(120,160,200,.25)'}];
const TASKS=[{t:'Lock 15 lower-thirds',due:'Today',today:true},{t:'Confirm Houts remote uplink',due:'Wed'},{t:'Draft ministry report',due:'Thu'},{t:'Send EP 215 pitch slug-lines',due:'Fri'}];

function App(){
  return (
    <React.Fragment>
      <Cosmos/>
      <main style={{position:'relative',zIndex:1,maxWidth:1680,margin:'0 auto',padding:18,display:'flex',flexDirection:'column',gap:18}}>
        <TopStrip/>
        <div style={{display:'grid',gridTemplateColumns:'minmax(330px,.95fr) minmax(420px,1.25fr) minmax(360px,1fr)',gap:18,alignItems:'start'}}>
          <div style={{display:'flex',flexDirection:'column',gap:18}}>
            <CountdownHero/>
            <EpisodePipeline eps={EPS}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:18}}>
            <Rundown rows={RUNDOWN}/>
            <LowerThirdsApproval/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:18}}>
            <BulletGraph segs={SEG}/>
            <BookingPipeline guests={BOOK}/>
            <TaskQueue tasks={TASKS}/>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
