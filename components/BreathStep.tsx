'use client';
import React,{useEffect,useMemo,useState} from 'react';
import { TimerCircle } from './TimerCircle';
const fmt=(sec:number)=>{const m=Math.floor(sec/60);const s=sec%60;return `${m}:${s.toString().padStart(2,'0')}`;};
export function BreathStep({seconds,inhale,exhale,onDone}:{seconds:number;inhale:number;exhale:number;onDone:()=>void}){
  const [left,setLeft]=useState(seconds);
  const [running,setRunning]=useState(false);
  useEffect(()=>{setLeft(seconds);setRunning(false);},[seconds]);
  useEffect(()=>{ if(!running) return; if(left<=0){setRunning(false);onDone();return;}
    const id=setTimeout(()=>setLeft(v=>v-1),1000); return ()=>clearTimeout(id);
  },[running,left,onDone]);
  const progress=useMemo(()=>seconds<=0?1:(seconds-left)/seconds,[seconds,left]);
  const cycle=inhale+exhale; const elapsed=seconds-left; const mod=elapsed%cycle;
  const phase=mod<inhale?`Inhala ${inhale-mod}s`:`Exhala ${cycle-mod}s`;
  return (
    <div className="card">
      <TimerCircle progress={progress} label={fmt(left)} />
      <div style={{textAlign:'center',fontSize:20,fontWeight:900,marginBottom:12}}>{phase}</div>
      <div className="row" style={{justifyContent:'center'}}>
        <button className="pill" onClick={()=>setRunning(true)}>Iniciar</button>
        <button className="pill" onClick={()=>setRunning(false)}>Pausar</button>
        <button className="pill" onClick={()=>setLeft(seconds)}>Reiniciar</button>
      </div>
      <div className="small" style={{marginTop:10,textAlign:'center'}}>Respira lento. Tu cuerpo entiende “estoy a salvo”.</div>
    </div>
  );
}
export default BreathStep;
