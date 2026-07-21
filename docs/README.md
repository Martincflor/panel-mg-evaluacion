# Panel MG — Evaluación Funcional en Miastenia Gravis

**Versión:** 1.1 (con auto-guardado y mejoras UX)  
**Estado:** Beta  
**Archivo:** `panel-mg.html`

## ¿Qué es?

Herramienta educativa y clínica para evaluación longitudinal de pacientes con miastenia gravis. Integra cinco escalas validadas en un flujo conversacional:

- **MGFA** – Clasificación clínica (no es puntuación)
- **QMG** – Quantitative MG (13 ítems, 0–39 puntos)
- **MG-ADL** – Actividades de vida diaria (8 ítems, 0–24 puntos)
- **MGC** – Composite MG (aproximación simplificada: 10 dominios, 0–50 puntos)
- **MG-QOL15** – Calidad de vida (15 reactivos, 0–60 puntos)

**Privacidad:** Todo procesa en el navegador. Cero transmisión de datos a servidores.

---

## Características (v1.1)

### ✅ Nuevas en esta versión

| Característica | Descripción |
|---|---|
| **Auto-guardado en localStorage** | Borrador se guarda automáticamente mientras completas. Si cierras accidentalmente, recuperas el estado. |
| **Indicador de progreso visual** | Barra de progreso en la página inicial + % en cada sección de la navegación lateral. |
| **Advertencia de cierre** | Si hay cambios sin guardar al historial y cierras la pestaña, aparece confirmación. |
| **Persistencia de evaluaciones** | Historial se guarda con export/import manual en JSON. Ahora + respaldado por localStorage. |

### Existentes

- Clasificación MGFA interactiva (8 clases)
- Escalas con bandas de interpretación (orientativas, no validadas)
- Comparación de dos evaluaciones consecutivas (delta clínico)
- Impresión de informes
- Export/import de historial en JSON
- Waveform dinámico que refleja severidad global
- Diseño responsive (mobile/tablet/desktop)
- Modo impresión optimizado

---

## Flujo de uso

1. **Datos del paciente** (opcional)
   - Identificador, edad, fecha, quién completa (paciente/cuidador/clínico)
   - Muestra barra de progreso global

2. **Clasificación MGFA**
   - Selecciona la clase I–V que mejor describe al paciente

3. **Escalas de funcionamiento**
   - QMG → MGC → MG-ADL → MG-QOL15
   - Puedes navegar libremente (anterior/siguiente o botones en menú)

4. **Resumen y seguimiento**
   - Vista consolidada de puntuaciones y bandas de interpretación
   - Botón **"Guardar esta evaluación en el historial"** → marca evaluación como "final"
   - Historial: comparar dos evaluaciones, ver deltas clínicos
   - Export/import JSON

---

## Uso técnico

### Archivo único

```
panel-mg.html  (autocont enido, ~60 KB)
```

Abre en cualquier navegador moderno (Chrome, Firefox, Safari, Edge). No necesita servidor.

### LocalStorage

```javascript
localStorage.setItem('panel-mg-state', JSON.stringify(state))
```

Se guarda después de cada render. Límite típico: 5–10 MB por dominio.

**Nota:** Si borras localStorage del navegador (DevTools > Application > Storage), pierdes el borrador actual (pero el historial guardado se puede reimportar desde JSON exportado).

### Evaluaciones guardadas

Estructura:

```json
{
  "ts": 1721587200000,
  "patient": {"id": "PAC001", "age": "32 años", "date": "2026-07-20", "by": "clinico"},
  "mgfa": "IIa",
  "scores": {"qmg": 8, "mgadl": 6, "mgc": 15, "qol": 22},
  "detail": {
    "qmg": {"diplopia": 1, "ptosis": 0, ...},
    "mgadl": {"talking": 1, ...},
    "mgc": {"ptosis": 2, ...},
    "qol": {"q1": 1, "q2": 2, ...}
  }
}
```

---

## Bandas de interpretación (orientativas)

⚠️ **NO son puntos de corte validados.** Se muestran como referencia educativa.

| Escala | Rango | Interpretación | Código |
|--------|-------|---|---|
| **QMG** | 0–2 | Mínima / remisión | sev0 (verde) |
| | 3–9 | Leve | sev1 (amarillo) |
| | 10–19 | Moderada | sev2 (naranja) |
| | 20–39 | Grave | sev3 (rojo) |
| **MG-ADL** | 0–1 | Manifestación mínima | sev0 |
| | 2–5 | Leve | sev1 |
| | 6–11 | Moderada | sev2 |
| | 12–24 | Grave | sev3 |
| **MGC*** | 0–5 | Mínima | sev0 |
| | 6–15 | Leve-moderada | sev1 |
| | 16–30 | Moderada-grave | sev2 |
| | 31–50 | Grave | sev3 |
| **MG-QOL15** | 0–15 | Impacto bajo | sev0 |
| | 16–30 | Impacto moderado | sev1 |
| | 31–45 | Impacto significativo | sev2 |
| | 46–60 | Impacto grave | sev3 |

\* MGC: estructura simplificada, no idéntica a Burns et al.

---

## Cambios clínicamente relevantes (MCID)

Al comparar dos evaluaciones:

| Escala | MCID | Nota |
|--------|------|------|
| QMG | ≥2–3 puntos | Ref: Barohn et al. |
| MG-ADL | ≥2 puntos | Ref: Wolfe et al. |
| MGC | No definido* | Ref: Burns et al. (original) |
| MG-QOL15 | No definido* | Ref: Burns et al. (original) |

\* Se muestra como cambio sin umbral validado. Interpreta con criterio clínico.

---

## Despliegue

### Opción 1: GitHub Pages (recomendado para educación)

```bash
# 1. Si no existe repo, inicializa
git init
git remote add origin https://github.com/TU_USUARIO/panel-mg.git

# 2. Copia panel-mg.html a la raíz o a /docs
cp panel-mg.html docs/

# 3. Configura GitHub Pages
#    Repo → Settings → Pages → Source: docs/ → Save
#    La herramienta estará en: https://TU_USUARIO.github.io/panel-mg/docs/panel-mg.html
#    O en la raíz: https://TU_USUARIO.github.io/panel-mg.html

git add panel-mg.html README-PANEL-MG.md
git commit -m "feat: Panel MG v1.1 con auto-guardado y progreso visual"
git push origin main
```

### Opción 2: Vercel (más rápido, auto-deploy)

```bash
# 1. Instala Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# Visitarás en: https://TU_PROYECTO.vercel.app/panel-mg.html
```

### Opción 3: Integración en plataforma casos-clinicos (Next.js)

```bash
# 1. Copia a public/
cp panel-mg.html ../../casos-clinicos/public/tools/

# 2. Accedible en: https://tudominio.com/tools/panel-mg.html
```

---

## Roadmap futuro

### Fase 2 (próxima iteración)
- [ ] Tooltips clínicos al pasar sobre labels
- [ ] Gráfico de tendencias (QMG, ADL a lo largo del tiempo)
- [ ] Modo oscuro (respeta `prefers-color-scheme`)
- [ ] Importar desde CSV (para clínicos que vienen de Excel)

### Fase 3 (largo plazo)
- [ ] Integración API con plataforma casos-clinicos
- [ ] Sincronización automática a Google Sheets (para investigadores)
- [ ] Reportes PDF generados localmente
- [ ] Modo multiusuario (comparar pacientes)

---

## Notas clínicas

⚠️ **Esta herramienta NO es un dispositivo médico.** Es un apoyo educativo.

**Antes de usar en investigación o decisiones clínicas críticas:**
1. Verifica los ítems de QMG contra Barohn et al. (ref. original)
2. Verifica MG-ADL contra Wolfe et al.
3. Verifica MGC contra Burns et al. (la versión aquí es simplificada)
4. Verifica MG-QOL15: los reactivos están parafraseados (no reproducen texto con derechos de autor)

**Contacto clínico:**
- Diseñado por: [Nombre clínico/educador]
- Email: martincflordeza@gmail.com
- Última actualización: 2026-07-20

---

## Troubleshooting

| Problema | Solución |
|---|---|
| **"Perdí mi evaluación borrador"** | Recupera desde localStorage: DevTools > Application > Storage > localStorage > panel-mg-state, o reimporta historial (.json) |
| **"No se guarda nada"** | Comprueba: localStorage habilitado, sin modo privado, navegador compatible. Chrome/Firefox/Safari recomendados. |
| **"Las bandas de interpretación no coinciden con mi referencia"** | Correcto: son orientativas. Verifica contra publicación original de cada escala. |
| **"¿Dónde se guardan los datos?"** | Todo en tu navegador (localStorage + export manual). Cero envío a servidores. |

---

## Licencia

Uso educativo y clínico. Modificable para tu contexto.

---

**¿Preguntas?** Abre un issue en GitHub o contacta a martincflordeza@gmail.com.
