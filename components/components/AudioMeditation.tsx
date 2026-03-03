'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Track = { id: string; name: string; src: string };

const TRACKS: Track[] = [
  { id: 'lluvia', name: '🌧️ Lluvia', src: '/audio/lluvia.mp3' },
  { id: 'olas', name: '🌊 Olas', src: '/audio/olas.mp3' },
  { id: 'bosque', name: '🌿 Bosque', src: '/audio/bosque.mp3' },
  { id: 'ruido', name: '🤍 Ruido blanco', src: '/audio/ruido-blanco.mp3' },
];

function fmt(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function AudioMeditation() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackId, setTrackId] = useState(TRACKS[0].id);
  const [playing, setPlaying] = useState(false);

  const [timerTotal, setTimerTotal] = useState<number>(0);
  const [timerLeft, setTimerLeft] = useState<number>(0);

  const track = useMemo(
    () => TRACKS.find((t) => t.id === trackId) ?? TRACKS[0],
    [trackId]
  );

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setPlaying(false);
    setTimerTotal(0);
    setTimerLeft(0);
  }, [trackId]);

  useEffect(() => {
    if (!playing) return;
    if (!timerTotal) return;

    const interval = window.setInterval(() => {
      setTimerLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          const a = audioRef.current;
          if (a) {
            a.pause();
            a.currentTime = 0;
          }
          setPlaying(false);
          window.clearInterval(interval);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [playing, timerTotal]);

  const start = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      await a.play();
      setPlaying(true);
      if (timerTotal) setTimerLeft(timerTotal);
    } catch (e) {
      console.log(e);
    }
  };

  const pause = () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    setPlaying(false);
  };

  const restart = async () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setPlaying(false);
    setTimerLeft(timerTotal ? timerTotal : 0);
    await start();
  };

  const setTimer = (minutes: number) => {
    const sec = minutes * 60;
    setTimerTotal(sec);
    setTimerLeft(sec);
  };

  const clearTimer = () => {
    setTimerTotal(0);
    setTimerLeft(0);
  };

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 900, fontSize: 18 }}>🎵 Música para meditación</div>
      <div className="small" style={{ marginTop: 6 }}>
        Elige un sonido y usa el timer si quieres que se apague solo.
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

      <audio ref={audioRef} src={track.src} preload="none" loop />

      <div className="row" style={{ justifyContent: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
        <button className="pill" onClick={start} disabled={playing}>
          Reproducir
        </button>
        <button className="pill" onClick={pause} disabled={!playing}>
          Pausar
        </button>
        <button className="pill" onClick={restart}>
          Reiniciar
        </button>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>⏱️ Timer</div>

        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <button className="pill" onClick={() => setTimer(5)}>
            5 min
          </button>
          <button className="pill" onClick={() => setTimer(10)}>
            10 min
          </button>
          <button className="pill" onClick={() => setTimer(15)}>
            15 min
          </button>
          <button className="pill" onClick={clearTimer}>
            Sin timer
          </button>
        </div>

        <div className="small" style={{ marginTop: 10 }}>
          {timerTotal ? (
            <>
              Se apagará en: <b>{fmt(timerLeft || timerTotal)}</b>
            </>
          ) : (
            <>Timer desactivado</>
          )}
        </div>
      </div>
    </div>
  );
}
