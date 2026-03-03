'use client';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';

import sleepData from '../../content/sleep.json';
import phrasesData from '../../content/phrases.json';

import StepTimer from '../../components/StepTimer';
import BreathStep from '../../components/BreathStep';

type StepType = 'note' | 'timer' | 'breath';

type Step = {
  label: string;
  type: StepType;
  seconds: number;
  pattern?: { inhale: number; exhale: number };
};

type Routine = {
  id: string;
  name: string;
  steps: Step[];
};

function safeArray<T>(v: any): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function pickRandom(arr: string[]) {
  if (!arr.length) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

const CHECKLIST = [
  'Atenúa luces (modo noche)',
  'Sin pantallas 30–60 min antes',
  'Cena ligera (si aplica)',
  'Deja agua a la mano',
  'Habitación fresca y oscura',
  'Respira 2 minutos (4/6)',
];

const IF_WAKE_UP = [
  'No mires el celular',
  'Respira 6 ciclos (4/6)',
  'Relaja mandíbula y hombros',
  'Si pasan 20 min: levántate, luz baja, vuelve a la cama',
  'Repite: “Estoy a salvo. Puedo volver.”',
];

export default function Sleep() {
  const ROUTINES = safeArray<Routine>((sleepData as any)?.routines);
  const PHRASES = safeArray<string>(phrasesData);

  const [view, setView] = useState<'home' | 'routine' | 'checklist' | 'wake'>('home');

  const [routineId, setRoutineId] = useState<string>(ROUTINES[0]?.id ?? '');
  const routine = useMemo(() => {
    const found = ROUTINES.find((r) => r.id === routineId);
    return found ?? ROUTINES[0] ?? null;
  }, [ROUTINES, routineId]);

  const steps = useMemo(() => safeArray<Step>((routine as any)?.steps), [routine]);
  const [stepIndex, setStepIndex] = useState(0);

  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');

  function resetRun() {
    setStepIndex(0);
    setNote('');
  }

  function startRoutine() {
    if (!routine) return;
    resetRun();
    setView('routine');
  }

  function nextStep() {
    const next = stepIndex + 1;
    if (next < steps.length) {
      setStepIndex(next);
      return;
    }
    setMsg(pickRandom(PHRASES) || 'Bien. Hoy es progreso, no perfección.');
    setView('home');
  }

  const step = steps[stepIndex] ?? null;

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Sueño reparador</h1>
        <Link className="pill" href="/">
          Volver
        </Link>
      </div>

      {/* HOME */}
      {view === 'home' && (
        <>
          <div className="card" style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Elige tu rutina</div>

            <select
              className="pill"
              value={routineId}
              onChange={(e) => {
                setRoutineId(e.target.value);
                resetRun();
              }}
              style={{ width: '100%' }}
            >
              {ROUTINES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name || r.id}
                </option>
              ))}
            </select>

            <div className="row" style={{ gap: 10, marginTop: 12 }}>
              <button className="pill" onClick={startRoutine} disabled={!routine}>
                Iniciar rutina
              </button>
              <button
                className="pill"
                onClick={() => setMsg(pickRandom(PHRASES))}
              >
                Frase motivadora
              </button>
            </div>

            {msg ? <div className="card" style={{ marginTop: 12 }}>{msg}</div> : null}
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Atajos</div>
            <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
              <button className="pill" onClick={() => setView('checklist')}>
                ✅ Checklist noche
              </button>
              <button className="pill" onClick={() => setView('wake')}>
                🌙 Si me despierto
              </button>
            </div>
          </div>
        </>
      )}

      {/* CHECKLIST */}
      {view === 'checklist' && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 900 }}>Checklist noche</div>
            <button className="pill" onClick={() => setView('home')}>Volver</button>
          </div>

          <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
            {CHECKLIST.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: 14 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WAKE UP */}
      {view === 'wake' && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 900 }}>Si me despierto</div>
            <button className="pill" onClick={() => setView('home')}>Volver</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <BreathStep title="Respira 4/6" cycles={6} inhale={4} exhale={6} />
          </div>

          <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
            {IF_WAKE_UP.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: 14 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROUTINE RUNNER */}
      {view === 'routine' && routine && (
        <div className="card" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900 }}>{routine.name}</div>
          <div className="small" style={{ marginTop: 6 }}>
            Paso {Math.min(stepIndex + 1, steps.length)} de {steps.length}
          </div>

          <div style={{ marginTop: 14, fontSize: 18, fontWeight: 900 }}>
            {step?.label ?? 'Paso'}
          </div>

          <div style={{ marginTop: 12 }}>
            {step?.type === 'timer' && (
              <StepTimer seconds={step.seconds ?? 60} onDone={nextStep} />
            )}

            {step?.type === 'breath' && (
              <BreathStep
                title={step.label ?? 'Respira'}
                cycles={6}
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
                  placeholder="Escribe 1 línea (brain dump)…"
                  style={{ width: '100%', minHeight: 110, padding: 14 }}
                />
                <div className="small" style={{ marginTop: 8 }}>
                  Sácalo de tu cabeza y suéltalo.
                </div>
              </div>
            )}

            {!step && (
              <div className="card">
                No hay pasos definidos. Revisa <b>content/sleep.json</b>.
              </div>
            )}
          </div>

          <div className="row" style={{ gap: 10, marginTop: 14 }}>
            <button
              className="pill"
              onClick={() => {
                setView('home');
                resetRun();
              }}
            >
              Salir
            </button>

            <button className="pill" onClick={nextStep}>
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
