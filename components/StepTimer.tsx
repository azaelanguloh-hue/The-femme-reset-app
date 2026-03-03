'use client';
import React,{useEffect,useMemo,useState} from 'react';
import { TimerCircle } from './TimerCircle';
const fmt=(sec:number)=>{const m=Math.floor(sec/60);const s=sec%60;return `${m}:${s.toString().padStart(2,'0')}`;};
export function StepTimer({seconds,onDone}:{seconds:number;onDone:()=>void}){
  const [left,setLeft]=useState(seconds);
  const [running,setRunning]=useState(false);
  useEffect(()=>{setLeft(seconds);setRunning(false);},[seconds]);
  useEffect(()=>{ if(!running) return; if(left<=0){setRunning(false);onDone();return;}
    const id=setTimeout(()=>setLeft(v=>v-1),1000); return ()=>clearTimeout(id);
  },[running,left,onDone]);
  const progress=useMemo(()=>seconds<=0?1:(seconds-left)/seconds,[seconds,left]);
  return (
    <div className="card">
      <TimerCircle progress={progress} label={fmt(left)} />
      <div className="row">
        <button className="pill" onClick={()=>setRunning(true)}>Iniciar</button>
        <button className="pill" onClick={()=>setRunning(false)}>Pausar</button>
        <button className="pill" onClick={()=>setLeft(seconds)}>Reiniciar</button>
      </div>
      <div className="small" style={{marginTop:10}}>Tip: si hoy no sale perfecto, mañana seguimos.</div>
    </div>
  );
}
export default StepTimer;
