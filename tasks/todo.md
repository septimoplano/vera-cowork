# Tareas — VERA app web de validación

> Ejecutar en orden (dependencias de `tasks/plan.md`). Una rama por tarea, PR al terminar.
> Responsable de ejecución: **constructor-tecnico** (T1-T8), **growth** (T7), **product-owner** (revisión de cada PR contra doctrina).
> Estado: pendiente de orden de inicio del fundador.

- [ ] **T1 · Config remota simulada**
  - Acceptance: `app/config.js` expone `VERA_CONFIG` con los 13 parámetros del Anexo A (valores exactos de Decisiones Cerradas v1); comentario marca cuáles son doctrina.
  - Verify: consola → `VERA_CONFIG.SESSION_CAP === 5`, `VERA_CONFIG.EXTRA_PER_SESSION === 1`.
  - Files: `app/config.js`

- [ ] **T2 · Instrumentación de eventos**
  - Acceptance: `app/eventos.js` expone `emitir(tipo, datos)` que valida contra los 8 tipos del Anexo B, agrega `ts`, persiste en `localStorage.vera_events` y loguea en consola. Función `exportarEventos()` descarga JSON.
  - Verify: emitir los 8 tipos en consola → aparecen en `vera_events` con esquema correcto; tipo desconocido lanza error.
  - Files: `app/eventos.js`

- [ ] **T3 · Datos semilla**
  - Acceptance: `app/seed.js` con círculo de 6 personas verificadas (nombres chilenos, piezas de ejemplo coherentes con bienestar digital), pool de 21 preguntas de aterrizaje (borrador para aprobación del fundador), 10+ prompts de producción.
  - Verify: revisión humana de copy (español neutro, tono VERA); `SEED.preguntas.length === 21`.
  - Files: `app/seed.js`

- [ ] **T4 · Sistema visual**
  - Acceptance: `app/styles.css` porta las variables y componentes del wireframe (paleta verde, glass, chips, cards, freno, cierre) a viewport móvil real (no phone-frame decorativo). Responsive 320-430px.
  - Verify: abrir con contenido dummy en iPhone SE y 14 Pro Max (simulador del navegador) sin overflow horizontal.
  - Files: `app/styles.css`

- [ ] **T5 · Máquina de sesión + shell**
  - Acceptance: `app/app.js` implementa la máquina de estados completa del plan (aterrizaje → tránsito → contenido → freno → cierre, + ráfaga ansiosa, + agotado/modo producir, + "ver un poco más" una sola vez, + presupuesto 3 sesiones/día con reset a medianoche local). Emite los 8 eventos en los puntos correctos. `app/index.html` renderiza las 5 vistas.
  - Verify: checklist de 7 reglas de `docs/spec.md` § Testing, completo en móvil.
  - Files: `app/app.js`, `app/index.html`

- [ ] **T6 · Panel de métricas**
  - Acceptance: `app/metricas.html` lee `vera_events` y muestra M1 (% sesiones-rebote), M2 (aceptación del freno), M3 (acciones/sesión), lista cruda de eventos y botón exportar.
  - Verify: recorrido manual conocido (1 rebote + 1 freno aceptado + 2 acciones en 2 sesiones) → M1=50%, M2=100%, M3=1.0.
  - Files: `app/metricas.html`

- [ ] **T7 · Landing + lista de espera**
  - Acceptance: `landing/index.html` cuenta la historia (51% bots, scroll infinito como enemigo, VERA como destino) con la estética del wireframe; formulario de correo guarda localmente y deja documentado el hook MailerLite (comentario con el punto exacto de integración). Sin test de precio (decisión 2026-07-15).
  - Verify: registro de un correo funciona; copy revisada por growth y fundador; sin promesas que violen doctrina.
  - Files: `landing/index.html`

- [ ] **T8 · Portada + GitHub Pages**
  - Acceptance: `index.html` raíz enlaza app, landing y métricas; Pages activado sirviendo la rama principal; URL documentada en README.
  - Verify: URL pública abre en frío desde un celular (CP4).
  - Files: `index.html`, `README.md`, configuración Pages

- [ ] **T9 · Cierre de fase**
  - Acceptance: informe corto en `salidas/2026-MM-app-validacion.md`: qué quedó funcionando, URL, cómo correr una entrevista con la app, próximo paso (fase 1 de `fases/`).
  - Verify: el fundador puede seguir el informe sin ayuda.
  - Files: `salidas/2026-MM-app-validacion.md`
