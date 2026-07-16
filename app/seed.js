// seed.js — datos de ejemplo para la app web de validación (T3).
// Círculo de 6 personas verificadas, 9 piezas, 21 preguntas de aterrizaje,
// 12 prompts de producción. Todo BORRADOR para aprobación del fundador.
//
// Voz del copy (decisión del fundador 2026-07-15): MINIMALISTA Y DIRECTA.
// Personas de ejemplo: VARIADAS / AMPLIAS (distintos oficios, no solo bienestar).
//
// ⚠ AJUSTE A LA DECISIÓN 3 (product-owner, tomar nota):
//   La Decisión 3 cerrada fijaba las 4 fichas (Tranquilo/Cansado/Curioso/Solo de paso)
//   como constantes para TODA pregunta. El fundador optó (2026-07-15) por un modelo MIXTO:
//   algunas preguntas usan las 4 fichas; otras son abiertas y solo ofrecen "o simplemente
//   continúa →". Cada pregunta declara `fichas: true|false`. Si el product-owner prefiere
//   volver a la Decisión 3 pura, basta poner `fichas: true` en las 21.
//
// En Etapa B esto vive en Supabase (tablas circulo/piezas/preguntas/prompts), no en el bundle.

const SEED = {
  // Fichas de respuesta del wireframe (constantes, para preguntas con fichas:true).
  fichas: ['Tranquilo', 'Cansado', 'Curioso', 'Solo de paso'],

  // Gesto: única reacción de un toque en VERA (no hay likes). Decisión 5.
  gesto: { simbolo: '◇', etiqueta: 'te lo agradezco' },

  // 6 personas verificadas. `inicial` alimenta el avatar del wireframe.
  circulo: [
    { id: 'u1', nombre: 'Camila Torres',   inicial: 'C', oficio: 'profesora' },
    { id: 'u2', nombre: 'Ignacio Fuentes', inicial: 'I', oficio: 'anda en bici por la ciudad' },
    { id: 'u3', nombre: 'Valentina Rojas',  inicial: 'V', oficio: 'programadora' },
    { id: 'u4', nombre: 'Rodrigo Salas',    inicial: 'R', oficio: 'jardinero' },
    { id: 'u5', nombre: 'Antonia Muñoz',    inicial: 'A', oficio: 'estudiante' },
    { id: 'u6', nombre: 'Matías Herrera',   inicial: 'M', oficio: 'músico' },
  ],

  // Piezas de personas. La sesión toma MIX_PEOPLE (3) de aquí. `hace` es texto de tiempo.
  piezas: [
    { id: 'p1', autorId: 'u1', hace: 'hace 2 h',  texto: 'Hoy un alumno explicó algo mejor de lo que lo había explicado yo. Me quedé pensando en eso toda la tarde.' },
    { id: 'p2', autorId: 'u2', hace: 'hace 3 h',  texto: 'Llegué pedaleando contra el viento y aun así llegué. A veces es solo eso: seguir dando vueltas al pedal.' },
    { id: 'p3', autorId: 'u3', hace: 'hace 5 h',  texto: 'Pasé el día persiguiendo un error que resultó ser una coma. Me reí sola cuando lo encontré.' },
    { id: 'p4', autorId: 'u4', hace: 'ayer',      texto: 'Las semillas que planté en junio recién asoman. Nada apurado crece bien.' },
    { id: 'p5', autorId: 'u5', hace: 'hace 1 h',  texto: 'Dejé el teléfono en otra pieza para estudiar. Las primeras dos horas fueron raras; después ya no lo echaba de menos.' },
    { id: 'p6', autorId: 'u6', hace: 'hace 4 h',  texto: 'Toqué la misma parte cien veces hoy. En la ciento uno por fin sonó como la escuchaba en mi cabeza.' },
    { id: 'p7', autorId: 'u1', hace: 'ayer',      texto: 'Terminé la semana cansada pero contenta. No siempre pasan juntas esas dos cosas.' },
    { id: 'p8', autorId: 'u4', hace: 'hace 6 h',  texto: 'Llovió toda la mañana y no toqué el jardín. Me senté a mirar la lluvia y estuvo bien.' },
    { id: 'p9', autorId: 'u3', hace: 'hace 8 h',  texto: 'Alguien me preguntó qué haría si no tuviera que trabajar. No supe responder y eso me dejó pensando.' },
  ],

  // Pool de 21 preguntas de aterrizaje (QUESTION_POOL). Rotación diaria y global.
  // `fichas: true` → muestra las 4 fichas; `false` → solo "o simplemente continúa →".
  // 12 de estado de llegada + 9 abiertas = 21.
  preguntas: [
    { texto: '¿Cómo llegas?',                   fichas: true  },
    { texto: '¿Con qué llegas hoy?',            fichas: true  },
    { texto: '¿Cómo estás, de verdad?',        fichas: true  },
    { texto: '¿Qué traes hoy?',                fichas: true  },
    { texto: '¿Cómo amaneciste?',              fichas: true  },
    { texto: '¿En qué punto del día estás?',   fichas: true  },
    { texto: '¿Cómo vienes?',                  fichas: true  },
    { texto: '¿Qué tal el cuerpo hoy?',        fichas: true  },
    { texto: '¿Cómo anda el ánimo?',           fichas: true  },
    { texto: '¿Con qué energía llegas?',       fichas: true  },
    { texto: '¿Cómo cae este momento?',        fichas: true  },
    { texto: '¿Qué tan presente estás?',       fichas: true  },
    { texto: '¿Qué dejaste sin decir hoy?',    fichas: false },
    { texto: '¿Qué te gustaría soltar?',       fichas: false },
    { texto: '¿Qué esperas de este rato?',     fichas: false },
    { texto: '¿Qué necesitas ahora mismo?',    fichas: false },
    { texto: '¿Qué aprendiste ayer?',          fichas: false },
    { texto: '¿A quién pensaste hoy?',         fichas: false },
    { texto: '¿Qué te trajo aquí?',            fichas: false },
    { texto: '¿Qué harías con diez minutos para ti?', fichas: false },
    { texto: '¿Qué vale la pena hoy?',         fichas: false },
  ],

  // Prompts de producción (◇ Prompt de VERA). La sesión toma MIX_PROMPTS (2).
  // Invitan a crear (respuesta ≥ MIN_CHARS = 20). 12 prompts (≥10 requeridos).
  prompts: [
    { id: 'q1',  texto: 'Una cosa que aprendiste esta semana.' },
    { id: 'q2',  texto: 'Algo que quieras soltar.' },
    { id: 'q3',  texto: '¿Qué te hizo parar hoy?' },
    { id: 'q4',  texto: 'Escribe lo que no alcanzaste a decir.' },
    { id: 'q5',  texto: 'Una idea que no se te va.' },
    { id: 'q6',  texto: 'Algo por lo que estés agradecido hoy.' },
    { id: 'q7',  texto: '¿Qué cambiarías de tu día?' },
    { id: 'q8',  texto: 'Una pregunta que traes sin responder.' },
    { id: 'q9',  texto: 'Algo pequeño que salió bien.' },
    { id: 'q10', texto: '¿Qué te gustaría recordar de hoy?' },
    { id: 'q11', texto: 'Una decisión que estás postergando.' },
    { id: 'q12', texto: 'Escribe para alguien que no está.' },
  ],
};

// Autocomprobación (T3 · Verify): el pool debe tener exactamente QUESTION_POOL preguntas.
if (typeof VERA_CONFIG !== 'undefined' && SEED.preguntas.length !== VERA_CONFIG.QUESTION_POOL) {
  console.warn(
    `[vera] SEED.preguntas tiene ${SEED.preguntas.length}, se esperaban ${VERA_CONFIG.QUESTION_POOL} (QUESTION_POOL).`
  );
}
