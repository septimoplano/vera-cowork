# Informe de cierre — App web de validación de VERA

> Fecha: 2026-07-16 · Autor: constructor-tecnico (Claude Code) · Para: el fundador
> Cierra la pre-fase de desarrollo (T1–T9). Siguiente: Fase 1 del plan (`fases/fase-1-validacion.md`).

## Qué quedó funcionando

La **Interfaz de Calma** de VERA Fase 1, como app web real (no prototipo estático), más la landing de lista de espera. Todo corre desde este repo, sin instalar nada.

| Pieza | Archivo | Estado |
|---|---|---|
| Portada | `index.html` | ✅ enlaza las 3 piezas |
| App — sesión completa | `app/index.html` + `app/app.js` | ✅ aterrizaje → tránsito → 5 piezas → freno → cierre, + ráfaga ansiosa + agotado/modo producir |
| Config remota (13 parámetros) | `app/config.js` | ✅ Anexo A, doctrina protegida |
| Instrumentación (8 eventos) | `app/eventos.js` | ✅ persiste + exporta JSON |
| Datos semilla | `app/seed.js` | ✅ 6 personas, 9 piezas, 21 preguntas, 12 prompts |
| Sistema visual | `app/styles.css` | ✅ wireframe → móvil, sin overflow 320–430px |
| Panel de métricas | `app/metricas.html` | ✅ M1/M2/M3 desde los eventos |
| Landing + lista de espera | `landing/index.html` | ✅ correo + nombre, honeypot anti-bot, hook MailerLite documentado |

**Verificado con navegador headless**: sesión sin errores, alta de lista de espera guarda nombre+correo, honeypot descarta bots, cero overflow horizontal.

## URL

Una vez activado GitHub Pages (ver abajo):
**https://septimoplano.github.io/vera-cowork/**

## ⚠️ Acción pendiente tuya (bloquea la URL pública)

**Activar GitHub Pages** — no pude hacerlo yo: la cuenta con la que trabajo (`fcopujol-dev`) tiene permiso de *push* pero **no admin**; Pages requiere admin y el repo es de `septimoplano`. Desde esa cuenta:

> Settings → Pages → Source: **Deploy from a branch** → branch **master**, carpeta **/ (root)** → Save.

En ~1 minuto la URL queda en línea. (Instrucciones también en el README.)

## Cómo correr una entrevista H1 con la app

1. Abre la URL (o `app/index.html`) **en el celular del entrevistado**.
2. Que viva una sesión completa sin que le expliques: observa dónde duda, qué toca, cómo reacciona al freno de mano.
3. Al terminar, abre `app/metricas.html` y usa **"exportar eventos"** para guardar el JSON de esa sesión (respáldalo: `localStorage` se borra fácil).
4. Guion de preguntas: lo prepara el `validador` (`fases/fase-1-validacion.md`, orden 1).
5. Repite el guion de síntesis cada 10 entrevistas.

## Decisiones tomadas en esta etapa (2026-07-15/16)

- App **web** (no React Native aún) · backend **simulado** (Supabase después).
- Campaña: **solo landing + lista de espera** (test de precio va en Fase 1).
- Voz del copy **minimalista y directa** · personas de ejemplo **variadas**.
- Landing captura **correo + nombre** · CTA **lista de espera neutra** (sin precio).
- Pages: **activar** (tú, desde `septimoplano`).
- ⚠️ Preguntas de aterrizaje en **modelo mixto** (fichas + saltar) — se aparta de la Decisión 3 pura; marcado en `app/seed.js` para el product-owner.

## Pendientes antes de encender la campaña

1. **Aprobar el copy** de `app/seed.js`: las 21 preguntas y los 12 prompts son borrador.
2. **Registro de marca INAPI** — sigue pendiente y **bloquea difundir** la landing (no el desarrollo). Es de `legal-cumplimiento`, Fase 1.
3. **Cuenta MailerLite** para la lista de espera real (hoy guarda local): definir cuál y conectar el hook documentado en `landing/index.html`.
4. Decidir si el modelo mixto de fichas se mantiene o se vuelve a la Decisión 3.

## Próximo paso

Con la app y la landing listas, arranca **Fase 1 · Validación** (`fases/fase-1-validacion.md`): lista de espera (meta 1.000), 30 entrevistas, test de precio, y el **go/no-go del ≥8%** antes de invertir en el MVP React Native. El instrumento (la app) ya está.
