import Link from 'next/link';
import AudioMeditation from '../components/AudioMeditation';

export default function Home() {
  return (
    <>
      <div className="h1">The Femme Reset App</div>
      <p className="p">Herramientas simples y visuales. Botones grandes. Cero complicación.</p>

      <div className="grid">
        <Link href="/sleep" className="card">
          <div style={{ fontSize: 20, fontWeight: 900 }}>🌙 Sueño reparador</div>
          <p className="p" style={{ marginTop: 6 }}>Modo noche • rutina guiada (15 o 30 min)</p>
          <div className="row"><span className="pill">Abrir</span></div>
        </Link>

        <Link href="/cortisol" className="card">
          <div style={{ fontSize: 20, fontWeight: 900 }}>🔥 Reset cortisol</div>
          <p className="p" style={{ marginTop: 6 }}>Botón de rescate • 3–10 min</p>
          <div className="row"><span className="pill">Abrir</span></div>
        </Link>
      </div>

      <AudioMeditation />

      <div style={{ marginTop: 18, opacity: 0.65, fontSize: 12.5, lineHeight: 1.55 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Instalar como app</div>
        <div>
          iPhone: Compartir → “Agregar a pantalla de inicio”.<br />
          Android: menú ⋮ → “Instalar app”.
        </div>
      </div>
    </>
  );
}
