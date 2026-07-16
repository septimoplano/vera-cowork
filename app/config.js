// config.js — Anexo A de Decisiones Cerradas v1. Config remota simulada:
// en Etapa B estos valores vienen de Supabase (tabla remote_config), no del bundle.
//
// Regla del repo: los parámetros SIEMPRE se leen desde VERA_CONFIG,
// jamás como constantes sueltas en el código.
//
// DOCTRINA (no se experimenta, no se ajusta en beta):
//   - EXTRA_PER_SESSION = 1 → el "+2 una sola vez"; después el contenido se agota de verdad.
//   - La EXISTENCIA del tope de sesión (SESSION_CAP) es doctrina; su VALOR es ajustable.
//   - El reset diario a medianoche local y el freno que no bloquea también son doctrina
//     (viven en app.js, no son parámetros de esta tabla).
// El resto es config remota: ajustable en beta con justificación del product-owner.

const VERA_CONFIG = {
  BOUNCE_MAX_S: 15,             // cierre en menos de 15 s sin acción = rebote
  BURST_WINDOW_MIN: 10,         // ventana (min) para detectar ráfaga ansiosa
  BURST_OPEN_COUNT: 3,          // 3ª apertura en la ventana tras 2 rebotes → ráfaga
  SESSION_CAP: 5,               // piezas por sesión (existencia del tope = DOCTRINA)
  MIX_PEOPLE: 3,                // piezas del círculo por sesión
  MIX_PROMPTS: 2,               // prompts por sesión
  DAILY_SESSIONS: 3,            // presupuesto de sesiones por día (reset medianoche local)
  EXTRA_PIECES: 2,              // piezas extra al aceptar "ver un poco más"
  EXTRA_PER_SESSION: 1,         // DOCTRINA: no se experimenta
  QUESTION_POOL: 21,            // pool de preguntas de aterrizaje
  MIN_CHARS: 20,                // mínimo de caracteres para acción con intención
  GESTURES_COUNTED_PER_DAY: 3,  // gestos ◇ que computan para M3 por día
  TRANSIT_PAUSE_S: 2.5,         // pausa de respiración en tránsito (s)
};
