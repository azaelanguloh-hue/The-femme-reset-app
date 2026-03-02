'use client';
import Link from 'next/link';
import cortisol from '@/content/cortisol.json';
import phrases from '@/content/phrases.json';
import React,{useMemo,useState} from 'react';
import { StepTimer } from '@/components/StepTimer';
import { BreathStep } from '@/components/BreathStep';

export default function Cortisol(){
  const [mode,setMode]=useState<'home'|'flow'>('home');
  const [flowId,setFlowId]=useState<string>(cortisol.flows[0].id);
  const flow=useMemo(()=>cortisol.flows.find((f:any)=>f.id===flowId) ?? cortisol.flows[0],[flowId]);
  const [stepIndex,setStepIndex]=useState(0);
  const [note,setNote]=useState('');
  const [feeling,setFeeling]=useState<string>('');
  const [msg,setMsg]=useState('');

  const step:any = flow.steps[stepIndex];

  function doneStep(){
    if(stepIndex < flow.steps.length-1) setStepIndex(stepIndex+1);
    else { setMsg(phrases[Math.floor(Math.random()*phrases.length)]); setMode('home'); setStepIndex(0); }
  }

  return (
    <>
      <div className="row" style={{justifyContent:'space-between'}}>
        <Link href="/" className="pill">← Inicio</Link>
        <span className="pill">🔥 Cortisol</span>
      </div>

      <div className="h1">Reset cortisol</div>
      <p className="p">Cuando estés saturada: elige un reseteo y sigue el paso a paso.</p>

      {msg && <div className="notice" style={{marginBottom:14}}><b>{msg}</b></div>}

      {mode==='home' && (
        <>
          <div className="card">
            <div style={{fontWeight:900, marginBottom:8}}>¿Qué sientes ahora?</div>
            <div className="row">
              {cortisol.feelings.map((f:string)=>(
                <button key={f} className="pill" onClick={()=>setFeeling(f)}>{f}</button>
              ))}
            </div>
            {feeling && <div className="notice" style={{marginTop:10}}>Hoy: <b>{feeling}</b>. Respira lento.</div>}
          </div>

          <div style={{height:10}} />

          <div className="grid">
            {cortisol.flows.map((f:any)=>(
              <div key={f.id} className="card">
                <div style={{fontWeight:900, fontSize:18, marginBottom:8}}>{f.name}</div>
                <button className="bigbtn" onClick={()=>{setFlowId(f.id); setStepIndex(0); setMode('flow');}}>
                  <span>Iniciar</span><span className="badge">▶</span>
                </button>
              </div>
            ))}
          </div>

          <hr className="sep" />
          <div className="card">
            <div style={{fontWeight:900, marginBottom:6}}>Recordatorio simple</div>
            <div className="small">• {cortisol.quickTips.join(" • ")}</div>
          </div>
        </>
      )}

      {mode==='flow' && (
        <>
          <div className="card">
            <div style={{fontWeight:900, marginBottom:6}}>{flow.name}</div>
            <div className="small">Paso {stepIndex+1} de {flow.steps.length}: <b>{step.label}</b></div>
          </div>

          <div style={{height:12}} />

          {step.type==='timer' && (
            <div className="card"><StepTimer seconds={step.seconds} onDone={doneStep} /></div>
          )}

          {(step.type==='breath' || step.type==='breath_timer') && (
            <div className="card">
              <BreathStep seconds={step.seconds} inhale={step.pattern?.inhale ?? 4} exhale={step.pattern?.exhale ?? 6} onDone={doneStep} />
            </div>
          )}

          {step.type==='note' && (
            <div className="card">
              <textarea className="input" placeholder="Escribe sin filtro (brain dump)..." value={note} onChange={(e)=>setNote(e.target.value)} />
              <div style={{height:10}} />
              <StepTimer seconds={step.seconds} onDone={doneStep} />
            </div>
          )}

          {step.type==='breath_count' && (
            <BreathCount label={step.label} count={step.count} onDone={doneStep} />
          )}

          <div style={{height:12}} />
          <div className="row">
            <button className="pill" onClick={()=>{setMode('home'); setStepIndex(0);}}>Salir</button>
            <button className="pill" onClick={doneStep}>Siguiente</button>
          </div>
        </>
      )}
    </>
  );
}

function BreathCount({label,count,onDone}:{label:string;count:number;onDone:()=>void}){
  const [n,setN]=useState(0);
  return (
    <div className="card">
      <div style={{fontWeight:900, marginBottom:8}}>{label}</div>
      <p className="p">Toca el botón cada vez que completes 1.</p>
      <div className="row">
        <button className="pill" onClick={()=>{const next=n+1; setN(next); if(next>=count) onDone();}}>
          Completar 1 ({n}/{count})
        </button>
        <button className="pill" onClick={()=>setN(0)}>Reiniciar</button>
      </div>
      <div className="small" style={{marginTop:10}}>Inhala, inhala poquito otra vez, y exhala largo.</div>
    </div>
  );
}
