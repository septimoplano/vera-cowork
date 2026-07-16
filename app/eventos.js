// eventos.js — instrumentación de los 8 eventos (Anexo B de Decisiones Cerradas v1).
// En esta etapa persiste en localStorage.vera_events + consola; en Etapa B va a PostHog.
//
// ⚠ ESQUEMA DERIVADO: el Anexo B original vive en «VERA Fase1 Decisiones Cerradas v1.md»
// (no está en este repo). Este esquema se derivó de los nombres citados en
// agentes/constructor-tecnico.md y de lo que M1/M2/M3 necesitan para calcularse.
// El product-owner debe validarlo contra el documento original antes de T5.
//
// Los 8 tipos y qué carga lleva cada `datos`:
//
//   session.open    {sesion_n}                      apertura de la app (base de ráfaga ansiosa)
//   session.start   {sesion_n, pregunta_id}         sesión inicia contenido (pasó aterrizaje)
//   piece.view      {pieza_id, tipo_pieza, posicion} pieza vista ('persona'|'prompt', 1..7)
//   action.*        {pieza_id?, chars?, computa}    acción con intención — subtipos:
//                     action.responder · action.responder_prompt · action.guardar
//                     · action.crear · action.gesto
//                     `computa=false` si gesto 4º del día o texto < MIN_CHARS (M3)
//   brake.shown     {sesion_n}                      freno de mano mostrado
//   brake.result    {resultado}                     'cerrar' | 'ver_mas' (M2 = % cerrar)
//   session.close   {duracion_s, acciones, rebote}  cierre; rebote = <15 s sin acción (M1)
//   day.exhausted   {}                              presupuesto diario agotado
//
// Cada evento persistido: { tipo, ts (epoch ms), fecha (ISO 8601), datos }

const TIPOS_EVENTO = [
  'session.open',
  'session.start',
  'piece.view',
  'action.*', // comodín: ver ACCIONES_VALIDAS
  'brake.shown',
  'brake.result',
  'session.close',
  'day.exhausted',
];

const ACCIONES_VALIDAS = ['responder', 'responder_prompt', 'guardar', 'crear', 'gesto'];

const VERA_EVENTS_KEY = 'vera_events';

function esTipoValido(tipo) {
  if (TIPOS_EVENTO.includes(tipo)) return tipo !== 'action.*'; // el comodín no se emite literal
  if (tipo.startsWith('action.')) {
    return ACCIONES_VALIDAS.includes(tipo.slice('action.'.length));
  }
  return false;
}

function leerEventos() {
  try {
    return JSON.parse(localStorage.getItem(VERA_EVENTS_KEY)) || [];
  } catch (_) {
    return [];
  }
}

function emitir(tipo, datos = {}) {
  if (!esTipoValido(tipo)) {
    throw new Error(
      `[vera] Tipo de evento desconocido: "${tipo}". Válidos (Anexo B): ` +
      TIPOS_EVENTO.join(', ') +
      ` — action.* admite: ${ACCIONES_VALIDAS.map(a => 'action.' + a).join(', ')}`
    );
  }
  if (typeof datos !== 'object' || datos === null || Array.isArray(datos)) {
    throw new Error('[vera] `datos` debe ser un objeto plano.');
  }

  const ahora = new Date();
  const evento = {
    tipo,
    ts: ahora.getTime(),
    fecha: ahora.toISOString(),
    datos,
  };

  const eventos = leerEventos();
  eventos.push(evento);
  localStorage.setItem(VERA_EVENTS_KEY, JSON.stringify(eventos));
  console.log('[vera]', evento.tipo, evento);
  return evento;
}

// Descarga todos los eventos como JSON — respaldo tras cada entrevista
// (mitiga pérdida si localStorage se borra; ver riesgos en tasks/plan.md).
function exportarEventos() {
  const eventos = leerEventos();
  const blob = new Blob([JSON.stringify(eventos, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vera-eventos-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return eventos.length;
}
