'use client';
import Link from 'next/link';
import sleep from '@/content/sleep.json';
import phrases from '@/content/phrases.json';
import React,{useMemo,useState} from 'react';
import { StepTimer } from '@/components/StepTimer';
import { BreathStep } from '@/components/BreathStep';

type Step = { label:string; type:'note'|'timer'|'breath'; seconds:number; pattern?:{inhale:number; exhale:number} };

export default function Sleep(){
  const [mode,setMode]=useState<'home'|'routine'|'checklist'|'midnight'>('home');
  const [routineId,setRoutineId]=useState<string>(sleep.routines[0].id);
  const routine=useMemo(()=>sleep.routines.find((r:any)=>r.id===routineId) ?? sleep.routines[0],[routineId]);
  const [stepIndex,setStepIndex]=useState(0);
  const [note,setNote]=useState('');
  const [msg,setMsg]=useState('');

  const step:Step = routine.steps[stepIndex] as any;

  function doneStep(){
    if(stepIndex < routine.steps.length-1) setStepIndex(stepIndex+1);
    else { setMsg(phrases[Math.floor(Math.random()*phrases.length)]); setMode('home'); setStepIndex(0); }
  }

  return (
    <>
      <div className="row" style={{justifyContent:'space-between'}}>
        <Link href="/" className="pill">← Inicio</Link>
        <span className="pill">🌙 Sueño</span>
      </div>

      <div className="h1">Sueño reparador</div>
      <p className="p">Elige una rutina y déjate guiar.</p>

      {msg && <div className="notice" style={{marginBottom:14}}><b>{msg}</b></div>}

      {mode==='home' && (
        <div className="grid">
          <div className="card">
            <div style={{fontWeight:900, marginBottom:8}}>Rutina guiada</div>
            <div className="row" style={{marginBottom:10}}>
              {sleep.routines.map((r:any)=>(
                <button key={r.id} className="pill" onClick={()=>{setRoutineId(r.id); setStepIndex(0);}}>{r.name}</button>
              ))}
            </div>
            <button className="bigbtn" onClick={()=>setMode('routine')}>
              <span>Iniciar rutina</span><span className="badge">{routine.name}</span>
            </button>
          </div>

          <div className="card">
            <div style={{fontWeight:900, marginBottom:8}}>Atajos</div>
            <button className="bigbtn" onClick={()=>setMode('checklist')}>
              <span>Checklist express</span><span className="badge">Abrir</span>
            </button>
            <div style={{height:10}} />
            <button className="bigbtn" onClick={()=>setMode('midnight')}>
              <span>Si me despierto en la madrugada</span><span className="badge">Abrir</span>
            </button>
          </div>
        </div>
      )}

      {mode==='routine' && (
        <>
          <div className="card">
            <div style={{fontWeight:900, marginBottom:6}}>{routine.name}</div>
            <div className="small">Paso {stepIndex+1} de {routine.steps.length}: <b>{step.label}</b></div>
          </div>

          <div style={{height:12}} />

          {step.type==='note' && (
            <div className="card">
              <textarea className="input" placeholder="Escribe 3 cosas para soltar (brain dump)..." value={note} onChange={(e)=>setNote(e.target.value)} />
              <div style={{height:10}} />
              <StepTimer seconds={step.seconds} onDone={doneStep} />
            </div>
          )}

          {step.type==='timer' && (
            <div className="card">
              <StepTimer seconds={step.seconds} onDone={doneStep} />
            </div>
          )}

          {step.type==='breath' && (
            <div className="card">
              <BreathStep seconds={step.seconds} inhale={step.pattern?.inhale ?? 4} exhale={step.pattern?.exhale ?? 6} onDone={doneStep} />
            </div>
          )}

          <div style={{height:12}} />
          <div className="row">
            <button className="pill" onClick={()=>{setMode('home'); setStepIndex(0);}}>Salir</button>
            <button className="pill" onClick={doneStep}>Siguiente</button>
          </div>
        </>
      )}

      {mode==='checklist' && (
        <Checklist title="Checklist express" items={sleep.checklist} onBack={()=>setMode('home')} onSave={(m)=>setMsg(m)} />
      )}

      {mode==='midnight' && (
        <Checklist title="Si me despierto en la madrugada" items={sleep.middleOfNight} onBack={()=>setMode('home')} onSave={(m)=>setMsg(m)} />
      )}
    </>
  );
}

function Checklist({title,items,onBack,onSave}:{title:string;items:string[];onBack:()=>void;onSave:(m:string)=>void}){
  const [checks,setChecks]=useState<boolean[]>(items.map(()=>false));
  const toggle=(i:number)=>setChecks(prev=>prev.map((v,idx)=>idx===i?!v:v));
  return (
    <>
      <div className="card">
        <div style={{fontWeight:900,fontSize:20}}>{title}</div>
        <p className="p" style={{marginTop:6}}>Marca lo que puedas. 1 cosa también cuenta.</p>
        <hr className="sep" />
        {items.map((it,i)=>(
          <label key={i} className="bigbtn" style={{justifyContent:'flex-start'}}>
            <input type="checkbox" checked={checks[i]} onChange={()=>toggle(i)} style={{width:20,height:20,marginRight:12}} />
            <span>{it}</span>
          </label>
        ))}
      </div>
      <div style={{height:12}} />
      <div className="row">
        <button className="pill" onClick={onBack}>← Volver</button>
        <button className="pill" onClick={()=>onSave(phrases[Math.floor(Math.random()*phrases.length)])}>Guardar</button>
      </div>
    </>
  );
}
