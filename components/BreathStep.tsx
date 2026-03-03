'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  title?: string;
  cycles?: number;      // número de ciclos
  inhale?: number;      // segundos inhalar
  exhale?: number;      // segundos exhalar
};

function clampInt(v: any, fallback: number, min = 1, max = 600) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.round(n);
  return Math.min(max, Math.max(min, i));
}

function fmt(s: number) {
  const sec = Math.max(0, Math.floor(s));
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function BreathStep({
  title = 'Respira',
  cycles = 6,
  inhale = 4,
  exhale = 6,
}: Props) {
  const IN = clampInt(inhale, 4, 1, 30);
  const EX = clampInt(exhale, 6, 1, 30);
  const CYC = clampInt(cycles, 6, 1, 60);

  const totalSeconds = useMemo(() => CYC * (IN + EX), [CYC, IN, EX]);

  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0); // segundos transcurridos
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;

    timerRef.current = window.setInterval(() => {
      setT((prev) => {
        const next = prev + 1;
        if (next >= totalSeconds) {
          setRunning(false);
          return totalSeconds;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [running, totalSeconds]);

  const remaining = Math.max(0, totalSeconds - t);

  // Fase actual
  const phaseLen = IN + EX;
  const within = phaseLen === 0 ? 0 : (t % phaseLen);
  const isInhale = within < IN;

  const phaseRemaining = isInhale ? (IN - within) : (phaseLen - within);

  const label = isInhale ? `Inhala ${phaseRemaining}s` : `Exhala ${phaseRemaining}s`;

  const progress = totalSeconds === 0 ? 0 : Math.min(1, t / totalSeconds);

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
      <div className="small" style={{ marginTop: 6 }}>
        {CYC} ciclos • {IN}/{EX}
      </div>

      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 999,
          margin: '14px auto 8px',
          border: '10px solid rgba(46,204,113,0.2)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            border: '10px solid rgba(46,204,113,0.95)',
            clipPath: `inset(${(1 - progress) * 100}% 0 0 0)`,
            transform: 'rotate(180deg)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 900 }}>{fmt(remaining)}</div>
        </div>
      </div>

      <div style={{ fontWeight: 800, marginBottom: 10 }}>{label}</div>

      <div className="row" style={{ justifyContent: 'center', gap: 10 }}>
        <button className="pill" onClick={() => setRunning(true)} disabled={running}>
          Iniciar
        </button>
        <button className="pill" onClick={() => setRunning(false)} disabled={!running}>
          Pausar
        </button>
        <button
          className="pill"
          onClick={() => {
            setRunning(false);
            setT(0);
          }}
        >
          Reiniciar
        </button>
      </div>

      <div className="small" style={{ marginTop: 10 }}>
        Respira lento. Tu cuerpo entiende: “estoy a salvo”.
      </div>
    </div>
  );
}
