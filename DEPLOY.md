# Despliegue rápido: Panel MG en GitHub Pages

## 30 segundos — Opción más simple

### Prerrequisito
- Cuenta GitHub
- Git instalado
- El repo ya existe o vas a crear uno

---

## Paso 1: Clona o navega a tu repo

```bash
cd /ruta/a/tu/repo
# O si es nuevo:
git init
git remote add origin https://github.com/TU_USUARIO/panel-mg.git
```

---

## Paso 2: Copia el archivo

```bash
# Si no existe carpeta docs/, créala
mkdir -p docs

# Copia la herramienta
cp panel-mg.html docs/panel-mg.html
cp README-PANEL-MG.md docs/README.md
```

---

## Paso 3: Sube a GitHub

```bash
git add docs/panel-mg.html docs/README.md
git commit -m "feat: Panel MG v1.1 — herramienta educativa para miastenia gravis"
git push origin main
```

---

## Paso 4: Activa GitHub Pages

1. Abre tu repo en GitHub
2. **Settings** → **Pages**
3. **Source:** Selecciona `main` (rama) y `/docs` (carpeta)
4. Click **Save**

Esperamos 1–2 minutos. Cuando aparezca el link verde, ¡listo!

**URL pública:**  
`https://TU_USUARIO.github.io/panel-mg/docs/panel-mg.html`

---

## Resultado

✅ Panel MG accesible públicamente  
✅ Versionado en Git  
✅ Cero costo de hosting  
✅ Auto-actualiza con cada push

---

## Alternativa: Vercel (aún más rápido)

```bash
npm install -g vercel
vercel --prod
```

Seguir prompts. URL estará lista en ~30 segundos.

---

## Compartir enlace

```
Panel MG — Evaluación Funcional en Miastenia Gravis
https://TU_USUARIO.github.io/panel-mg/docs/panel-mg.html

Herramienta educativa con MGFA, QMG, MG-ADL, MGC y MG-QOL15.
Privado (localStorage), sin transmisión de datos.
```

Copia este texto para compartir en tu plataforma de casos clínicos o redes educativas.
