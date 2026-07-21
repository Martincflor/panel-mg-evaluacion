# Panel MG — Documentación Completa

**Versión:** 1.1 (Fase 3 completada)  
**Estado:** Listo para despliegue  
**Última actualización:** 2026-07-21

---

## 📦 Archivos principales

### Herramienta
- **`panel-mg.html`** — Aplicación única, autocontendida
  - v1.1 con auto-guardado, progreso visual, tooltips clínicos, modo oscuro, gráfico de tendencias
  - ~80 KB, funciona offline, privacidad garantizada (todo en navegador)

### Documentación técnica
- **`README-PANEL-MG.md`** — Descripción general y features
  - Qué es Panel MG, características, cómo se usa, archivos generados
  - Bandas de interpretación (orientativas)
  - Troubleshooting

- **`DEPLOY.md`** — Guía de despliegue en 4 pasos
  - GitHub Pages (recomendado)
  - Vercel (alternativo, más rápido)
  - Instrucciones exactas

### Documentación clínica
- **`GUIA-CLINICA.md`** — Manual clínico exhaustivo
  - MGFA: 8 clases, cómo clasificar, pronóstico
  - QMG: 13 ítems, evaluación paso-a-paso
  - MG-ADL: 8 ítems, impacto funcional
  - MGC: estructura simplificada
  - MG-QOL15: 15 reactivos, calidad de vida
  - Cambios clínicamente relevantes (MCID)
  - Referencias originales

- **`CASOS-EJEMPLO.md`** — 4 casos clínicos reales
  - Caso 1: MG ocular pura (28a, mujer)
  - Caso 2: MG generalizada leve-moderada (52a, hombre)
  - Caso 3: MG grave, crisis miasténica (68a, mujer)
  - Caso 4: Monitoreo de respuesta a timectomía (35a, mujer)
  - Cada caso incluye: presentación, evaluación inicial, plan, seguimiento

---

## 🎯 Mejoras de Fase 3

| Mejora | Descripción | Uso |
|--------|---|---|
| **Tooltips clínicos** | ℹ️ al pasar sobre títulos de escalas | Educativo; muestra por qué cada escala importa |
| **Modo oscuro** | Toggle 🌙/☀️ en esquina inferior derecha | Respeta `prefers-color-scheme`, localStorage persiste |
| **Gráfico de tendencias** | Canvas con QMG, MG-ADL, MG-QOL15 | Aparece al guardar 2+ evaluaciones; evolución visual |
| **Auto-guardado** | localStorage + export/import manual | Recupera estado si cierras accidentalmente |
| **Indicador de progreso** | Barra visual + % por sección | Motivación y orientación del flujo |

---

## 🚀 Despliegue en 5 minutos

### Opción 1: GitHub Pages (recomendado)

```bash
# 1. Crear estructura
mkdir -p docs
cp panel-mg.html docs/
cp README-PANEL-MG.md docs/README.md

# 2. Subir a GitHub
git add docs/
git commit -m "feat: Panel MG v1.1 — herramienta educativa MG con seguimiento"
git push origin main

# 3. Activar GitHub Pages
#    GitHub → Repo Settings → Pages → Source: main /docs
#    Espera 1–2 minutos
```

**URL:** `https://TU_USUARIO.github.io/panel-mg/docs/panel-mg.html`

### Opción 2: Vercel (más rápido)

```bash
npm install -g vercel
vercel --prod
```

**URL:** `https://panel-mg.vercel.app/panel-mg.html`

---

## 📖 Cómo usar la documentación

### Para pacientes/educación
→ Lee **`README-PANEL-MG.md`** (descripción general, privacidad)

### Para clínicos/médicos
→ Lee **`GUIA-CLINICA.md`** (completa, basada en literatura)

### Para aprender con ejemplos
→ Lee **`CASOS-EJEMPLO.md`** (4 escenarios reales, paso-a-paso)

### Para desplegar
→ Sigue **`DEPLOY.md`** (4 pasos exactos)

### Problemas técnicos
→ Ve **`README-PANEL-MG.md` → Troubleshooting**

---

## ✨ Notas de versión

### v1.1 (2026-07-21)
- ✅ Auto-guardado en localStorage
- ✅ Indicador de progreso (% y barra visual)
- ✅ Tooltips clínicos en headers
- ✅ Modo oscuro (toggle, persistente)
- ✅ Gráfico de tendencias (Canvas, 3+ escalas)
- ✅ Documentación clínica exhaustiva
- ✅ 4 casos clínicos ejemplificados
- ✅ Advertencia de cierre sin guardar

### v1.0 (2026-07-20)
- Escalas MGFA, QMG, MGC, MG-ADL, MG-QOL15
- Historial con comparación de dos evaluaciones
- Export/import manual de evaluaciones
- Waveform dinámico
- Bandas de interpretación

---

## 🔍 Verificación pre-despliegue

Antes de ir a producción, verifica:

- [ ] Panel MG abre sin errores en Chrome, Firefox, Safari, Edge
- [ ] localStorage funciona (abre DevTools → Application → localStorage)
- [ ] Modo oscuro toggle funciona (esquina inferior derecha)
- [ ] Tooltips aparecen al pasar sobre ℹ️
- [ ] Guardar evaluación funciona
- [ ] Export/import historial funciona
- [ ] Imprimir informe es legible (Ctrl+P → Print Preview)
- [ ] En móvil: diseño responsive, inputs accesibles

---

## 📞 Contacto y soporte

**Autor:** Martín C. Flórez  
**Email:** martincflordeza@gmail.com  
**Especialidad:** Neurología (enfoque educativo + clínico)

**Uso previsto:**  
Educación médica, seguimiento clínico de pacientes, investigación clínica (con validación de escalas)

**NO es:** Dispositivo médico regulado, reemplazo del juicio clínico

---

## 📚 Referencias integradas

- MGFA Working Group (Jaretzki et al., Neurology 2000)
- QMG (Barohn et al., Neurology 1998)
- MG-ADL (Wolfe et al., Neurology 1999)
- MGC & MG-QOL15 (Burns et al., Neurology 2008)
- MCID recommendations (Benatar et al., 2012)
- Myasthenia Gravis consensus (Gilhus et al., Lancet 2019)

---

## ✅ Checklist final

- [x] Herramienta v1.1 con Fase 3 completa
- [x] Auto-guardado en localStorage
- [x] Indicador de progreso visual
- [x] Tooltips clínicos
- [x] Modo oscuro
- [x] Gráfico de tendencias
- [x] Documentación README
- [x] Documentación clínica exhaustiva
- [x] 4 casos clínicos ejemplificados
- [x] Guía de despliegue
- [x] Este índice

**Estado:** ✅ Listo para despliegue

---

**¿Preguntas?** Abre un issue en GitHub o contacta a martincflordeza@gmail.com

**¿Sugerencias?** Contribuciones bienvenidas. Fork, modifica, y envía un pull request.

---

**Última verificación:** 2026-07-21  
**Próxima revisión:** Basada en feedback de usuarios
