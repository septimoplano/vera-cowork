# Plan técnico — VERA app web de validación

> Deriva de `docs/spec.md`. Ejecutar con `tasks/todo.md`.
> Estado: **planificación aprobada, implementación NO iniciada** (por orden del fundador, 2026-07-15).

## Componentes y dependencias

```
config.js ──┐
seed.js ────┼──→ app.js (máquina de sesión) ──→ index.html + styles.css
eventos.js ─┘            │
                         └──→ metricas.html (lee vera_events)

landing/index.html  (independiente de la app)
index.html raíz     (portada; depende de que app y landing existan)
GitHub Pages        (último; depende de todo lo anterior mergeado)
```

## Orden de implementación

| # | Componente | Por qué en este orden |
|---|---|---|
| 1 | `app/config.js` | Los 13 parámetros son el contrato; todo lo demás los consume. |
| 2 | `app/eventos.js` | Instrumentar ANTES de construir pantallas (doctrina del constructor: no volar a ciegas). |
| 3 | `app/seed.js` | Círculo de ejemplo (5-6 personas verificadas), pool de 21 preguntas, prompts. Sin datos no hay sesión. |
| 4 | `app/styles.css` | Sistema visual portado del wireframe (variables, glass, phone-frame → viewport real). |
| 5 | `app/app.js` + `app/index.html` | La máquina de sesión: estados ATERRIZAJE → TRÁNSITO → CONTENIDO → FRENO → CIERRE + AGOTADO (modo producir) + RÁFAGA. |
| 6 | `app/metricas.html` | Panel M1/M2/M3. Verifica que 1-5 emiten bien. |
| 7 | `landing/index.html` | Independiente; puede ir en paralelo con 5-6. |
| 8 | `index.html` raíz + Pages | Integración final. |

**Paralelizable**: landing (7) con app (5-6) · docs de fases con todo lo demás.
**Secuencial estricto**: 1 → 2 → 5 (config y eventos antes que la máquina).

## Máquina de estados de la sesión (corazón del build)

```
        apertura
           │  ¿3ª en 10min tras 2 rebotes? ──sí──→ RÁFAGA (mensaje calma, sin contenido)
           ▼  no
   ¿presupuesto del día agotado? ──sí──→ AGOTADO (estado cierre + modo producir)
           ▼  no
      ATERRIZAJE (pregunta del día, 4 fichas, saltable)
           ▼
      TRÁNSITO (respiración, TRANSIT_PAUSE_S)
           ▼
      CONTENIDO (hasta SESSION_CAP piezas: MIX_PEOPLE + MIX_PROMPTS,
                 indicador "n de 5", acciones con intención)
           ▼  tope alcanzado
      FRENO ("Cerrar con calma" | "Ver un poco más")
        │ cerrar                    │ ver más (solo si no usado esta sesión)
        ▼                           ▼
      CIERRE (resumen)          CONTENIDO +EXTRA_PIECES → FRENO final (sin "ver más")
```

Reglas transversales: rebote = cierre <15s sin acción · contador diario reset a medianoche local · gestos computables máx 3/día · texto con intención ≥20 chars.

## Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| El port a RN se aleja si la web acumula lógica acoplada al DOM | `app.js` separa máquina de sesión (pura) de render; la máquina se porta 1:1 a RN. |
| localStorage se borra y se pierden eventos de una entrevista | `metricas.html` incluye "exportar eventos" (JSON descargable) al final de cada sesión de prueba. |
| La landing junta correos en localStorage (no sirve para campaña real) | Hook documentado para MailerLite; la campaña pública no se enciende hasta conectarlo (boundary: preguntar primero). |
| Scope creep hacia Fase 2 (DMs, grupos, feed) | El product-owner custodia el fuera-de-alcance del spec; toda adición pasa por decisión de fundador. |
| Difundir la landing sin marca registrada | Bloqueado en boundaries; legal-cumplimiento lleva el estado INAPI (fases/fase-1). |

## Checkpoints de verificación

- **CP1** (tras #2): en consola, `VERA_CONFIG` accesible y `emitir('session.open', …)` persiste en `vera_events`.
- **CP2** (tras #5): sesión completa en móvil sin errores; checklist de 7 reglas del spec pasa.
- **CP3** (tras #6): M1/M2/M3 calculadas coinciden con un recorrido manual conocido (sesión con 1 rebote, 1 freno aceptado, 2 acciones → valores predecibles).
- **CP4** (tras #8): URL de Pages abre en frío desde un celular fuera de la red local.

## Estimación

Con Claude Code como constructor: 1-2 sesiones de trabajo para app completa + landing. La revisión humana de copy (21 preguntas, prompts, textos del freno) es el cuello: pedirla temprano.
