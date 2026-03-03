'use client';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';

import cortisolData from '../../content/cortisol.json';
import phrasesData from '../../content/phrases.json';

import StepTimer from '../../components/StepTimer';
import BreathStep from '../../components/BreathStep';

type StepType = 'note' | 'timer' | 'breath';

type FlowStep = {
  label: string;
  type: StepType;
  seconds: number;
  pattern?: { inhale: number; exhale: number };
};

type Flow = {
  id: string;
  name: string;
  steps: FlowStep[];
};

function safeArray<T>(v: any): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function pickRandom(arr: string[]) {
  if (!arr.length) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Cortisol() {
  // ---- SAFE DATA (evita undefined en prerender) ----
  const FLOWS = safeArray<Flow>((cortisolData as any)?.flows);
  const PHRASES = safeArray<string>(phrasesData);

  // Si por alguna razón el JSON está vacío, no tronamos build
  const hasFlows = FLOWS.length > 0;

  const [mode, setMode] = useState<'home' | 'run'>('home');
  const [flowId, setFlowId] = useState<string>(hasFlows ? FLOWS[0].id : '');
  const [stepIndex, setStepIndex] = useState<number>(0);

  const [note, setNote] = useState<string>('');
  const [feeling, setFeeling] = useState<string>('');
  const [msg, setMsg] = useState<string>('');

  const flow: Flow | null = useMemo(() => {
    if (!hasFlows) return null;
    const found = FLOWS.find((f) => f.id === flowId);
    return found ?? FLOWS[0] ?? null;
  }, [FLOWS, flowId, hasFlows]);

  const steps = useMemo(() => safeArray<FlowStep>((flow as any)?.steps), [flow]);
  const step: FlowStep | null = useMemo(() => steps[stepIndex] ?? null, [steps, stepIndex]);

  function resetRun() {
    setStepIndex(0);
    setNote('');
    setFeeling('');
    setMsg('');
  }

  function startRun() {
    if (!flow) return;
    resetRun();
    setMode('run');
  }

  function doneStep() {
    const next = stepIndex + 1;
    if (next < steps.length) {
      setStepIndex(next);
      return;
    }
    // terminó
    setMsg(pickRandom(PHRASES) || 'Listo. Respira. Vuelve a tu centro.');
    setMode('home');
  }

  // ---------------- UI ----------------
  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Reset cortisol</h1>
        <Link className="pill" href="/">
          Volver
        </Link>
      </div>

      {!hasFlows && (
        <div className="card" style={{ marginTop: 12 }}>
          <h2 style={{ marginTop: 0 }}>Aún no hay contenido</h2>
          <p>Revisa <b>content/cortisol.json</b> y asegúrate que tenga <b>flows</b> con pasos.</p>
        </div>
      )}

      {hasFlows && (
        <>
          {/* Selector */}
          <div className="card" style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Elige tu rescate</div>

            <select
              className="pill"
              value={flowId}
              onChange={(e) => {
                setFlowId(e.target.value);
                setMode('home');
                resetRun();
              }}
              style={{ width: '100%' }}
            >
              {FLOWS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name || f.id}
                </option>
              ))}
            </select>

            <div className="small" style={{ marginTop: 10 }}>
              Tip: elige el rescate más corto si estás muy acelerada.
            </div>

            <div className="row" style={{ gap: 10, marginTop: 12 }}>
              <button className="pill" onClick={startRun}>
                Iniciar
              </button>
              <button
                className="pill"
                onClick={() => {
                  resetRun();
                  setMsg(pickRandom(PHRASES));
                }}
              >
                Frase motivadora
              </button>
            </div>

            {msg ? <div className="card" style={{ marginTop: 12 }}>{msg}</div> : null}
          </div>

          {/* Runner */}
          {mode === 'run' && flow && (
            <div className="card" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 900 }}>{flow.name}</div>
              <div className="small" style={{ marginTop: 6 }}>
                Paso {Math.min(stepIndex + 1, steps.length)} de {steps.length}
              </div>

              <div style={{ marginTop: 14, fontSize: 18, fontWeight: 800 }}>
                {step?.label ?? 'Paso'}
              </div>

              {/* Render de step según tipo */}
              <div style={{ marginTop: 12 }}>
                {step?.type === 'timer' && (
                  <StepTimer seconds={step.seconds ?? 60} onDone={doneStep} />
                )}

                {step?.type === 'breath' && (
                  <BreathStep
                    title={step.label ?? 'Respiración'}
                    cycles={Math.max(1, Math.floor((step.seconds ?? 180) / ((step.pattern?.inhale ?? 4) + (step.pattern?.exhale ?? 6))))}
                    inhale={step.pattern?.inhale ?? 4}
                    exhale={step.pattern?.exhale ?? 6}
                  />
                )}

                {step?.type === 'note' && (
                  <div>
                    <textarea
                      className="pill"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Escribe 1 línea (lo que te pesa o lo que necesitas hoy)…"
                      style={{ width: '100%', minHeight: 110, padding: 14 }}
                    />
                    <div className="small" style={{ marginTop: 8 }}>
                      No tiene que ser perfecto. Solo sácalo.
                    </div>
                  </div>
                )}

                {/* Si por alguna razón no hay step, no tronamos */}
                {!step && (
                  <div className="card">
                    No hay paso definido. Revisa que el flow tenga <b>steps</b>.
                  </div>
                )}
              </div>

              {/* Feeling opcional */}
              <div style={{ marginTop: 12 }}>
                <div className="small" style={{ marginBottom: 6 }}>¿Cómo te sientes ahora?</div>
                <input
                  className="pill"
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  placeholder="Ej: más tranquila, menos apretada, más presente…"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Controles */}
              <div className="row" style={{ gap: 10, marginTop: 14 }}>
                <button
                  className="pill"
                  onClick={() => {
                    setMode('home');
                    resetRun();
                  }}
                >
                  Salir
                </button>

                <button className="pill" onClick={doneStep}>
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
