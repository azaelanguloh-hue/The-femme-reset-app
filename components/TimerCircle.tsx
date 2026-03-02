'use client';
import React from 'react';
export function TimerCircle({progress,label}:{progress:number;label:string}){
  const r=54; const c=2*Math.PI*r; const dash=c*(1-progress);
  return (
    <div className="timerWrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="10" fill="none"/>
        <circle cx="70" cy="70" r={r} stroke="rgba(46,204,113,0.95)" strokeWidth="10" fill="none"
          strokeDasharray={`${c}`} strokeDashoffset={`${dash}`} strokeLinecap="round" transform="rotate(-90 70 70)"/>
        <text x="70" y="70" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16" fontWeight="800">{label}</text>
      </svg>
    </div>
  );
}
