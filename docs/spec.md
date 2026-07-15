# Spec: VERA — App Fase 1 "Interfaz de Calma" (validación web)

> Especificación aprobada como base de trabajo · Julio 2026
> Fuentes de verdad: `VERA PLAN MAESTRO v1.md`, `VERA Fase1 Decisiones Cerradas v1.md`, `VERA Fase1 Wireframe.html` (en el workspace local `VERA/`), y `agentes/00-contexto-vera.md` (este repo).

## Decisiones cerradas con el fundador (2026-07-15)

1. **Plataforma**: app web funcional (las 5 pantallas de la Interfaz de Calma corriendo en navegador, deployable en GitHub Pages). El port a React Native + Expo queda especificado para Etapa B del plan maestro, no se construye ahora.
2. **Backend**: simulado ahora (localStorage + datos de ejemplo). Los 13 parámetros como config remota simulada (`config.js`), los 8 eventos instrumentados en local. El esquema Supabase queda escrito y listo para conectar cuando el fundador cree la cuenta.
3. **Campaña**: solo landing + lista de espera (la historia de VERA + captura de correos). El test de precio US$29 y el calendario de narrativa quedan planificados para la fase siguiente.

## Objective

Construir la **versión web de validación** de VERA Fase 1: las 5 pantallas del wireframe funcionando de verdad (no un prototipo estático), con las reglas matrices implementadas y los 8 eventos instrumentados, más una landing pública con lista de espera. Todo corriendo desde este repo (GitHub Pages) para poder:

- Hacer las 30 entrevistas H1 con producto tocable, no con Figma.
- Mostrar a inversionistas/creadores semilla una demo real.
- Encender la campaña de lista de espera (KR: 1.000 registros).
- Continuar el trabajo en línea desde el repo (cualquier colaborador clona, abre y trabaja).

**Usuario objetivo**: el nicho semilla — comunidad chilena de bienestar digital / minimalismo (luego LatAm hispano).

**Qué es éxito**: un entrevistado abre la URL en su celular, vive una sesión completa (aterrizaje → tránsito → 5 piezas → freno → cierre) y las 3 métricas matrices quedan registradas en eventos.

## Tech Stack

| Capa | Ahora (validación web) | Futuro (Etapa B, plan maestro) |
|---|---|---|
| App | HTML + CSS + JavaScript vanilla (sin framework, sin build) | React Native + Expo (EAS) |
| Estado/datos | localStorage + datos de ejemplo (`seed.js`) | Supabase (Postgres + Auth + Realtime) |
| Config remota | `app/config.js` (objeto `VERA_CONFIG`, 13 parámetros del Anexo A) | Supabase table `remote_config` |
| Eventos/analítica | `app/eventos.js` → localStorage + consola (esquema Anexo B) | PostHog |
| Verificación humana | Invitación con código + membresía simulada (ver `docs/verificacion-humana.md`) | Truora o MetaMap (KYC LatAm) |
| Suscripciones | Simulada (pantalla de membresía fundadora) | RevenueCat |
| Hosting | GitHub Pages desde este repo | Tiendas (Apple/Google) |
| Tipografías | Cinzel, Cormorant Garamond, Inter (Google Fonts, como el wireframe) | idem |

**Por qué vanilla y sin build**: cero dependencias = corre desde Git sin instalar nada, cualquiera del equipo lo abre y edita en línea (github.dev), y no hay lock-in que estorbe el port a React Native.

## Commands

```
Dev local:    cd app && python3 -m http.server 8000   → http://localhost:8000
              (o abrir app/index.html directo en el navegador)
Landing:      cd landing && python3 -m http.server 8001
Deploy:       merge a master → GitHub Pages sirve /  (portada → app + landing)
Test:         checklist manual de tasks/todo.md + verificación de eventos:
              localStorage.getItem('vera_events') en consola del navegador
Reset demo:   localStorage.clear() en consola
```

No hay build, lint ni test runner en esta etapa (vanilla JS). Se agregan con el port a React Native.

## Project Structure

```
vera-cowork/
├── README.md                  → mapa del repo y flujo de trabajo
├── index.html                 → portada (enlaza app + landing)          [Pages]
├── agentes/                   → los 6 archivos de agentes de VERA
├── docs/
│   ├── spec.md                → este documento (fuente de verdad)
│   ├── arquitectura.md        → modelo de datos, esquema Supabase futuro (constructor-tecnico)
│   ├── verificacion-humana.md → diseño anti-bot por etapas (legal + product-owner)
│   └── pitch-deck-actualizacion.md → correcciones al deck (validador)
├── tasks/
│   ├── plan.md                → plan técnico de implementación
│   └── todo.md                → tareas con criterios de aceptación
├── fases/
│   ├── 00-mapa-general.md     → timeline H1-H4 y coordinación de agentes
│   ├── fase-1-validacion.md   → órdenes: validador + growth
│   ├── fase-2-mvp.md          → órdenes: product-owner + constructor-tecnico
│   ├── fase-3-beta-pago.md    → órdenes: constructor-tecnico + legal-cumplimiento
│   └── fase-4-lanzamiento.md  → órdenes: growth + legal-cumplimiento
├── app/                       → la Interfaz de Calma (web)
│   ├── index.html             → shell de la app (una página, 5 vistas)
│   ├── styles.css             → sistema visual del wireframe
│   ├── config.js              → VERA_CONFIG: los 13 parámetros (Anexo A)
│   ├── eventos.js             → instrumentación: los 8 eventos (Anexo B)
│   ├── seed.js                → círculo de ejemplo + pool de 21 preguntas + prompts
│   ├── app.js                 → máquina de sesión (reglas matrices)
│   └── metricas.html          → panel M1/M2/M3 leyendo los eventos locales
├── landing/
│   └── index.html             → landing pública + lista de espera
└── salidas/                   → entregables de los agentes (informes, síntesis)
```

## Code Style

JavaScript vanilla, español en nombres de dominio, inglés en primitivas técnicas. Los parámetros SIEMPRE desde `VERA_CONFIG`, jamás constantes sueltas:

```js
// config.js — Anexo A de Decisiones Cerradas v1. Config remota simulada:
// en Etapa B estos valores vienen de Supabase, no del bundle.
const VERA_CONFIG = {
  BOUNCE_MAX_S: 15,
  BURST_WINDOW_MIN: 10,
  BURST_OPEN_COUNT: 3,
  SESSION_CAP: 5,
  MIX_PEOPLE: 3,
  MIX_PROMPTS: 2,
  DAILY_SESSIONS: 3,
  EXTRA_PIECES: 2,
  EXTRA_PER_SESSION: 1,   // DOCTRINA: no se experimenta
  QUESTION_POOL: 21,
  MIN_CHARS: 20,
  GESTURES_COUNTED_PER_DAY: 3,
  TRANSIT_PAUSE_S: 2.5,
};

// app.js — toda regla cita su decisión de origen:
function esRafagaAnsiosa(aperturas) {
  // Decisión 1: 3ª apertura en 10 min donde las 2 anteriores fueron rebotes
  const ventana = Date.now() - VERA_CONFIG.BURST_WINDOW_MIN * 60_000;
  const recientes = aperturas.filter(a => a.ts > ventana);
  return recientes.length >= VERA_CONFIG.BURST_OPEN_COUNT - 1
      && recientes.slice(-2).every(a => a.fueRebote);
}
```

Convenciones: CSS con las variables del wireframe (`--g100...--g500`, glassmorphism oscuro) · eventos con los nombres exactos del Anexo B (`session.open`, `brake.result`…) · commits en español, imperativo, sin coautor.

## Testing Strategy

Etapa actual (vanilla, sin runner): **checklist manual por regla matriz** — cada tarea de `tasks/todo.md` incluye su verificación. Las críticas:

1. Sesión sirve 3+2 y corta en 5 (`SESSION_CAP`).
2. "Ver un poco más" concede +2 UNA vez; después el contenido se agota de verdad.
3. 3ª apertura en 10 min tras 2 rebotes → mensaje de calma, sin contenido.
4. Presupuesto agotado → nunca "no puedes": estado de cierre + modo producir disponible.
5. Los 8 eventos se emiten con el esquema del Anexo B (verificable en `metricas.html`).
6. Gesto 4º del día no computa para M3.
7. Respuestas < 20 caracteres no cuentan como acción con intención.

Etapa B (React Native): Jest + React Native Testing Library, unit tests de la máquina de sesión, E2E con Maestro. Se especifica en `tasks/plan.md`.

## Boundaries

- **Siempre**: leer `agentes/00-contexto-vera.md` antes de trabajar · parámetros desde `VERA_CONFIG` · emitir los 8 eventos · español neutro (Chile) en toda copy · verificar el checklist antes de commit · rama por tarea + PR (flujo del README).
- **Preguntar primero**: agregar cualquier dependencia externa (la doctrina actual es cero) · tocar valores de doctrina (`EXTRA_PER_SESSION`, `RESET`, existencia del tope) · conectar servicios reales (Supabase, MailerLite, KYC) · gastar dinero (dominios, cuentas, proveedores) · publicar la landing o difundir la URL.
- **Nunca**: likes, contadores rojos, streaks, badges o notificaciones FOMO (doctrina — viola el producto) · construir verificación de identidad propia · guardar documentos de identidad (solo el hecho "sí es humano") · secretos/llaves en el repo · scroll infinito en ninguna vista · medir éxito con DAU/tiempo en pantalla.

## Success Criteria

1. `app/index.html` abre en un celular y una sesión completa (aterrizaje → tránsito → 5 piezas → freno → cierre) funciona sin errores de consola.
2. Las 7 verificaciones del checklist de reglas matrices pasan.
3. `metricas.html` calcula M1, M2 y M3 desde los eventos registrados.
4. `landing/index.html` captura un correo en la lista de espera (almacenamiento local + hook documentado para MailerLite).
5. Todo el contenido visible está en español neutro y respeta el sistema visual del wireframe.
6. El repo se sirve por GitHub Pages y la URL funciona en frío desde cualquier dispositivo.
7. Cero dependencias instaladas; clonar y abrir basta para trabajar.

## Open Questions

1. **Dominio**: ¿la landing vivirá en `vera.algo` propio o basta GitHub Pages para H1? (Compra de dominio = "preguntar primero".)
2. **MailerLite**: ¿la lista de espera de VERA usa la cuenta MailerLite existente de Francisco o una separada? (Impacta el hook de la landing.)
3. **Registro de marca INAPI**: sigue pendiente según el wireframe; bloquea difusión pública de la landing (no el desarrollo).
4. **Los 21 textos** del pool de preguntas y los prompts de VERA: ¿los redacta el product-owner y los aprueba el fundador, o los escribe el fundador directo?
5. **Test cerrado Google** (12 testers, 14 días): reclutar desde la lista de espera cuando llegue la Etapa B — ¿o desde el círculo directo de Francisco?
