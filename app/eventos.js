// eventos.js — instrumentación de los 8 eventos del Anexo B.
// Fuente de verdad: docs/anexo-b-eventos.md (Anexo B de Decisiones Cerradas v1).
// En esta etapa persiste en localStorage.vera_events + consola; en Etapa B va a PostHog.
//
// Evento persistido: { tipo, ts (epoch ms), fecha (ISO 8601), datos }
// `ts`/`fecha` los agrega emitir(); `datos` lleva los campos del Anexo B por tipo.
//
// La computabilidad para M3 (chars ≥ MIN_CHARS, gesto ≤3/día) NO se valida aquí:
// es lógica de métrica (app.js decide, metricas.html calcula). Un action con
// chars < 20 es un evento válido — simplemente no computa.

const ACCIONES_VALIDAS = ['reply', 'prompt_answer', 'save', 'create', 'gesture'];

// Esquema por tipo (Anexo B): campos requeridos y enums.
// `?` en el Anexo = opcional → no se exige aquí.
const ESQUEMA_EVENTOS = {
  'session.open':  { requeridos: ['origen', 'es_rafaga'] },
  'session.start': { requeridos: [] },
  'piece.view':    { requeridos: ['piece_id', 'tipo', 'posicion'], enums: { tipo: ['persona', 'prompt'] } },
  'action.*':      { requeridos: ['tipo'], enums: { tipo: ACCIONES_VALIDAS } },
  'brake.shown':   { requeridos: ['motivo'], enums: { motivo: ['tope', 'tiempo', 'rafaga'] } },
  'brake.result':  { requeridos: ['resultado'], enums: { resultado: ['acepto', 'continuo'] } },
  'session.close': { requeridos: ['duracion_s', 'piezas_vistas', 'acciones'] },
  'day.exhausted': { requeridos: [] },
};

const TIPOS_EVENTO = Object.keys(ESQUEMA_EVENTOS);

const VERA_EVENTS_KEY = 'vera_events';

// 'action.reply' → clave de esquema 'action.*'; el resto, literal.
function claveEsquema(tipo) {
  if (tipo.startsWith('action.') && ACCIONES_VALIDAS.includes(tipo.slice('action.'.length))) {
    return 'action.*';
  }
  return tipo !== 'action.*' && ESQUEMA_EVENTOS[tipo] ? tipo : null;
}

function leerEventos() {
  try {
    return JSON.parse(localStorage.getItem(VERA_EVENTS_KEY)) || [];
  } catch (_) {
    return [];
  }
}

function emitir(tipo, datos = {}) {
  const clave = claveEsquema(tipo);
  if (!clave) {
    throw new Error(
      `[vera] Tipo de evento desconocido: "${tipo}". Válidos (Anexo B): ` +
      TIPOS_EVENTO.filter(t => t !== 'action.*').join(', ') +
      ` — action.* admite: ${ACCIONES_VALIDAS.map(a => 'action.' + a).join(', ')}`
    );
  }
  if (typeof datos !== 'object' || datos === null || Array.isArray(datos)) {
    throw new Error('[vera] `datos` debe ser un objeto plano.');
  }

  // action.*: datos.tipo se completa desde el sufijo; si viene, debe coincidir.
  if (clave === 'action.*') {
    const sufijo = tipo.slice('action.'.length);
    if (datos.tipo === undefined) datos = { ...datos, tipo: sufijo };
    else if (datos.tipo !== sufijo) {
      throw new Error(`[vera] datos.tipo ("${datos.tipo}") no coincide con el sufijo del evento ("${sufijo}").`);
    }
  }

  const esquema = ESQUEMA_EVENTOS[clave];
  for (const campo of esquema.requeridos) {
    if (datos[campo] === undefined) {
      throw new Error(`[vera] ${tipo}: falta campo requerido "${campo}" (Anexo B).`);
    }
  }
  for (const [campo, valores] of Object.entries(esquema.enums || {})) {
    if (datos[campo] !== undefined && !valores.includes(datos[campo])) {
      throw new Error(`[vera] ${tipo}: ${campo}="${datos[campo]}" inválido. Válidos: ${valores.join(' | ')}.`);
    }
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
