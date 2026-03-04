'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Track = { id: string; name: string; src: string };

const TRACKS: Track[] = [
  { id: 'lluvia', name: '🌧️ Lluvia', src: '/audio/lluvia.mp3' },
  { id: 'olas', name: '🌊 Olas', src: '/audio/olas.mp3' },
  { id: 'bosque', name: '🌲 Bosque', src: '/audio/bosque.mp3' },
  { id: 'agua', name: '💧 Agua', src: '/audio/agua.mp3' },
  { id: 'ruido', name: '⬜ Ruido blanco', src: '/audio/ruido-blanco.mp3' },
  { id: 'avion', name: '✈️ Avión', src: '/audio/avion.mp3' },
  { id: 'naturaleza', name: '🏞️ Naturaleza', src: '/audio/naturewater.mp3' },
];

const TIMER_OPTIONS = [
  { label: '5 min', minutes: 5 },
  { label: '10 min', minutes: 10 },
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: 'Sin timer', minutes: 0 },
];

export default function AudioMeditation() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [trackId, setTrackId] = useState<string>(TRACKS[0]?.id ?? 'lluvia');
  const [isPlaying, setIsPlaying] = useState(false);

  const [timerMin, setTimerMin] = useState<number>(0);
  const [timerLeft, setTimerLeft] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  const track = useMemo(
    () => TRACKS.find((t) => t.id === trackId) ?? TRACKS[0],
    [trackId]
  );

  // Limpia intervalos al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  // Si cambias de track, reinicia el audio
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.pause();
    a.currentTime = 0;
    setIsPlaying(false);
  }, [track?.src]);

  const startTimer = (minutes: number) => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;

    setTimerMin(minutes);

    if (minutes <= 0) {
      setTimerLeft(0);
      return;
    }

    const totalSeconds = minutes * 60;
    setTimerLeft(totalSeconds);

    intervalRef.current = window.setInterval(() => {
      setTimerLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          // detener audio
          const a = audioRef.current;
          if (a) {
            a.pause();
            a.currentTime = 0;
          }
          setIsPlaying(false);

          // limpiar intervalo
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          intervalRef.current = null;

          return 0;
        }
        return next;
      });
    }, 1000);
  };

  const play = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.loop = timerMin === 0; // si no hay timer, loop
      await a.play();
      setIsPlaying(true);
    } catch {
      // en móvil a veces bloquea autoplay; usuario debe tocar play otra vez
    }
  };

  const pause = () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    setIsPlaying(false);
  };

  const restart = async () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setIsPlaying(false);
    await play();
  };

  const timerLabel = useMemo(() => {
    if (timerMin === 0) return 'Sin timer (se queda sonando)';
    const m = Math.floor(timerLeft / 60);
    const s = timerLeft % 60;
    return `Se apaga en ${m}:${String(s).padStart(2, '0')}`;
  }, [timerMin, timerLeft]);

  if (!track) return null;

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 900, fontSize: 18 }}>🌙 Sonidos relajantes</div>
      <div className="small" style={{ marginTop: 6 }}>
        Elige un sonido y (si quieres) pon un timer para que se apague solo.
      </div>

      <div style={{ marginTop: 12 }}>
        <select
          className="pill"
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
          style={{ width: '100%' }}
        >
          {TRACKS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="row" style={{ marginTop: 12, gap: 10 }}>
        <button className="pill" onClick={play} disabled={isPlaying}>
          Reproducir
        </button>
        <button className="pill" onClick={pause} disabled={!isPlaying}>
          Pausar
        </button>
        <button className="pill" onClick={restart}>
          Reiniciar
        </button>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>⏱ Timer</div>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              className="pill"
              onClick={() => startTimer(opt.minutes)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="small" style={{ marginTop: 10, opacity: 0.85 }}>
          {timerLabel}
        </div>
      </div>

      <div className="small" style={{ marginTop: 10, opacity: 0.8 }}>
        Tip: si no se escucha, sube el volumen del teléfono y toca “Reproducir” otra vez.
      </div>

      <audio ref={audioRef} src={track.src} preload="auto" />
    </div>
  );
}
