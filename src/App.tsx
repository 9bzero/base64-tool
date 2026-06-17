import{useState,useRef}from'react'
  type Mode="encode"|"decode"
  export default function App(){
    const[mode,setMode]=useState<Mode>("encode")
    const[input,setInput]=useState("Hello, World! 🌍")
    const[urlSafe,setUrlSafe]=useState(false)
    const[cp,setCp]=useState(false)
    const fileRef=useRef<HTMLInputElement>(null)
    const output=()=>{
      if(mode==="encode"){
        try{let r=btoa(unescape(encodeURIComponent(input)));if(urlSafe)r=r.replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");return r}catch{return"Invalid input for encoding"}
      }else{
        try{let s=input.trim();if(urlSafe)s=s.replace(/-/g,"+").replace(/_/g,"/");return decodeURIComponent(escape(atob(s.padEnd(Math.ceil(s.length/4)*4,"="))))}catch{return"Invalid Base64 string"}
      }
    }
    const out=output()
    const copy=()=>{navigator.clipboard.writeText(out);setCp(true);setTimeout(()=>setCp(false),2000)}
    const loadFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
      const f=e.target.files?.[0];if(!f)return
      const reader=new FileReader()
      reader.onload=()=>{const r=reader.result as string;setInput(r.split(",")[1]||"");setMode("decode")}
      reader.readAsDataURL(f)
    }
    return(
      <div style={{minHeight:"100vh",fontFamily:"Inter,system-ui,sans-serif",color:"#e2e8f0",padding:"2rem"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <h1 style={{fontWeight:800,fontSize:"1.75rem",marginBottom:"0.5rem",color:"#f8fafc"}}>🔐 Base64 Tool</h1>
          <p style={{color:"#94a3b8",marginBottom:"1.5rem",fontSize:"0.9rem"}}>Encode and decode Base64 strings — supports text and file input</p>
          <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
            {(["encode","decode"] as Mode[]).map(m=><button key={m} onClick={()=>setMode(m)} style={{padding:"0.4rem 1.25rem",background:mode===m?"#0ea5e9":"#1e293b",color:mode===m?"#fff":"#94a3b8",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:"0.85rem",textTransform:"capitalize"}}>{m}</button>)}
            <label style={{display:"flex",alignItems:"center",gap:"0.5rem",color:"#94a3b8",fontSize:"0.85rem",cursor:"pointer"}}>
              <input type="checkbox" checked={urlSafe} onChange={e=>setUrlSafe(e.target.checked)} style={{accentColor:"#38bdf8"}}/>URL-safe
            </label>
            <label style={{padding:"0.4rem 0.9rem",background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",borderRadius:8,cursor:"pointer",fontSize:"0.82rem"}}>
              📂 Load File <input ref={fileRef} type="file" onChange={loadFile} style={{display:"none"}}/>
            </label>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:"1rem",alignItems:"start"}}>
            <div>
              <div style={{color:"#475569",fontSize:"0.75rem",fontWeight:600,marginBottom:"0.4rem"}}>{mode==="encode"?"INPUT":"BASE64 INPUT"}</div>
              <textarea value={input} onChange={e=>setInput(e.target.value)} rows={10} style={{width:"100%",background:"#111827",border:"1px solid #334155",borderRadius:8,padding:"0.75rem",color:"#e2e8f0",outline:"none",fontSize:"0.82rem",fontFamily:"JetBrains Mono,monospace",resize:"vertical"}}/>
              <div style={{color:"#334155",fontSize:"0.73rem",marginTop:"0.25rem"}}>{input.length} chars</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingTop:"1.5rem",gap:"0.5rem"}}>
              <div style={{fontSize:"1.5rem",color:"#38bdf8"}}>{mode==="encode"?"→":"←"}</div>
              <button onClick={()=>setMode(m=>m==="encode"?"decode":"encode")} style={{padding:"0.3rem 0.5rem",background:"#1e293b",border:"1px solid #334155",borderRadius:6,cursor:"pointer",color:"#94a3b8",fontSize:"0.75rem"}}>⇄ Swap</button>
            </div>
            <div>
              <div style={{color:"#475569",fontSize:"0.75rem",fontWeight:600,marginBottom:"0.4rem"}}>{mode==="encode"?"BASE64 OUTPUT":"DECODED OUTPUT"}</div>
              <textarea value={out} readOnly rows={10} style={{width:"100%",background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,padding:"0.75rem",color:"#86efac",outline:"none",fontSize:"0.82rem",fontFamily:"JetBrains Mono,monospace",resize:"vertical"}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.25rem"}}>
                <span style={{color:"#334155",fontSize:"0.73rem"}}>{out.length} chars</span>
                <button onClick={copy} style={{padding:"0.2rem 0.7rem",background:cp?"#166534":"#1e293b",color:cp?"#86efac":"#94a3b8",border:"1px solid #334155",borderRadius:4,cursor:"pointer",fontSize:"0.73rem"}}>{cp?"✓ Copied":"Copy"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }