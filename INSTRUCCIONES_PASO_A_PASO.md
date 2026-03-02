# The Femme Reset App — pasos para ejecutar (sin asumir)

## Parte A — Subir a GitHub

1) Crea el repo
- Abre github.com
- Botón **+** arriba derecha → **New repository**
- Nombre: `the-femme-reset-app`
- Create repository

2) Sube los archivos
- Dentro del repo: botón **+** (a la izquierda del botón verde “Code”) → **Upload files**
- Arrastra TODO el contenido de esta carpeta (incluye `app/`, `components/`, `content/`, `public/`, etc.)
- Abajo: **Commit changes**

## Parte B — Probar en tu Mac (local)

1) Descarga el repo
- En GitHub: botón verde **Code** → **Download ZIP**
- Descomprime el ZIP

2) Abre Terminal y entra a la carpeta
Ejemplo si quedó en Descargas:
```bash
cd ~/Downloads/the-femme-reset-app
```

3) Instala dependencias
```bash
npm install
```

4) Ejecuta la app
```bash
npm run dev
```

5) Abre en el navegador
- http://localhost:3000

## Parte C — Publicar en Vercel (link)

1) Abre vercel.com y entra con GitHub
2) **Add New…** → **Project**
3) Elige el repo `the-femme-reset-app`
4) **Deploy**
5) Copia el link (https://xxxx.vercel.app)

## Parte D — Instalar como “app” (PWA)

iPhone (Safari):
- botón Compartir → **Agregar a pantalla de inicio**

Android (Chrome):
- menú ⋮ → **Instalar app**
