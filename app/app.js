// app.js — T5 · Máquina de sesión + shell (Interfaz de Calma).
// Dos capas, deliberadamente separadas (riesgo del port a RN, tasks/plan.md):
//
//   1. crearMaquina(deps) — máquina de estados PURA: sin DOM, sin localStorage,
//      sin timers. Todas las dependencias se inyectan (config, seed, emitir,
//      almacen, ahora). Se porta 1:1 a React Native.
//   2. Capa de render — traduce el estado de la máquina a las vistas del DOM
//      y conecta gestos del usuario a los métodos de la máquina.
//
// Estados: RAFAGA · AGOTADO · ATERRIZAJE · TRANSITO · CONTENIDO · FRENO · CIERRE
// Eventos: los 8 del Anexo B vía emitir() (app/eventos.js).
// Parámetros: SIEMPRE desde VERA_CONFIG (app/config.js), jamás constantes sueltas.

/* ══════════════════════════ 1 · MÁQUINA PURA ══════════════════════════ */

function crearMaquina({ config, seed, emitir, almacen, ahora }) {
  // ── estado persistente del día (reset a medianoche local: la CLAVE es la fecha local) ──
  function fechaLocal(ts) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function leerDia() {
    const hoy = fechaLocal(ahora());
    const dia = almacen.leer('vera_dia');
    if (!dia || dia.fecha !== hoy) {
      return { fecha: hoy, sesiones: 0, gestos: 0, exhaustedEmitido: false };
    }
    return dia;
  }
  function guardarDia(dia) { almacen.escribir('vera_dia', dia); }

  function leerAperturas() { return almacen.leer('vera_aperturas') || []; }
  function guardarAperturas(a) { almacen.escribir('vera_aperturas', a.slice(-20)); }

  // ── ráfaga ansiosa (Decisión 1, snippet del spec §Code Style) ──
  // 3ª apertura dentro de BURST_WINDOW_MIN donde las 2 anteriores fueron rebotes.
  function esRafagaAnsiosa(aperturas, ts) {
    const ventana = ts - config.BURST_WINDOW_MIN * 60_000;
    const recientes = aperturas.filter(a => a.ts > ventana);
    return recientes.length >= config.BURST_OPEN_COUNT - 1
        && recientes.slice(-2).every(a => a.fueRebote === true);
  }

  // ── pregunta del día: rotación diaria y global sobre el pool de 21 ──
  function preguntaDelDia(ts) {
    const dias = Math.floor((ts - new Date(ts).getTimezoneOffset() * 60_000) / 86_400_000);
    return seed.preguntas[dias % seed.preguntas.length];
  }

  // ── playlist de la sesión: MIX_PEOPLE personas + MIX_PROMPTS prompts ──
  // Orden P P ¤ P ¤ (el prompt respira entre personas). Rotación por nº de
  // sesión del día para que las 3 sesiones muestren piezas distintas.
  function armarPlaylist(sesionN) {
    const p = [];
    const offP = ((sesionN - 1) * config.MIX_PEOPLE) % seed.piezas.length;
    const offQ = ((sesionN - 1) * config.MIX_PROMPTS) % seed.prompts.length;
    const personas = [];
    for (let i = 0; i < config.MIX_PEOPLE; i++) {
      personas.push({ clase: 'persona', ...seed.piezas[(offP + i) % seed.piezas.length] });
    }
    const prompts = [];
    for (let i = 0; i < config.MIX_PROMPTS; i++) {
      prompts.push({ clase: 'prompt', ...seed.prompts[(offQ + i) % seed.prompts.length] });
    }
    // P P ¤ P ¤ — genérico: personas primero, un prompt cada dos personas.
    let ip = 0, iq = 0;
    while (p.length < config.SESSION_CAP && (ip < personas.length || iq < prompts.length)) {
      if (ip < personas.length) p.push(personas[ip++]);
      if (ip < personas.length) p.push(personas[ip++]);
      if (iq < prompts.length) p.push(prompts[iq++]);
    }
    return p.slice(0, config.SESSION_CAP);
  }

  function piezasExtra(sesionN, yaServidas) {
    const extra = [];
    const ids = new Set(yaServidas.map(x => x.id));
    let i = ((sesionN - 1) * config.MIX_PEOPLE + config.MIX_PEOPLE) % seed.piezas.length;
    let vueltas = 0;
    while (extra.length < config.EXTRA_PIECES && vueltas < seed.piezas.length) {
      const cand = seed.piezas[i % seed.piezas.length];
      if (!ids.has(cand.id)) extra.push({ clase: 'persona', ...cand });
      i++; vueltas++;
    }
    return extra;
  }

  // ── estado de la sesión en curso ──
  const s = {
    estado: null,        // RAFAGA | AGOTADO | ATERRIZAJE | TRANSITO | CONTENIDO | FRENO | CIERRE
    pregunta: null,
    playlist: [],
    posicion: 0,         // 1..7 (índice humano de la pieza en pantalla)
    extraUsado: false,
    enExtra: false,
    acciones: 0,         // acciones con intención COMPUTABLES de la sesión
    piezasVistas: 0,
    aperturaTs: 0,
    sesionCorrida: false, // true si session.start ya se emitió (consume presupuesto)
    cerrada: false,
  };

  function piezaActual() { return s.playlist[s.posicion - 1] || null; }

  function verPieza() {
    const pz = piezaActual();
    s.piezasVistas++;
    emitir('piece.view', { piece_id: pz.id, tipo: pz.clase, posicion: s.posicion });
  }

  function mostrarFreno(motivo) {
    s.estado = 'FRENO';
    emitir('brake.shown', { motivo });
  }

  function cerrarSesion() {
    if (s.cerrada) return;
    s.cerrada = true;
    const duracion = Math.round((ahora() - s.aperturaTs) / 1000);
    emitir('session.close', { duracion_s: duracion, piezas_vistas: s.piezasVistas, acciones: s.acciones });
    // marcar la apertura como rebote si aplica (alimenta la detección de ráfaga)
    const fueRebote = duracion < config.BOUNCE_MAX_S && s.acciones === 0;
    const aperturas = leerAperturas();
    if (aperturas.length) {
      aperturas[aperturas.length - 1].fueRebote = fueRebote;
      guardarAperturas(aperturas);
    }
    // day.exhausted: una sola vez, al agotar la 3ª sesión del día
    const dia = leerDia();
    if (s.sesionCorrida && dia.sesiones >= config.DAILY_SESSIONS && !dia.exhaustedEmitido) {
      emitir('day.exhausted', {});
      dia.exhaustedEmitido = true;
      guardarDia(dia);
    }
    s.estado = 'CIERRE';
  }

  // acción con intención computable → suma a M3 de la sesión
  function registrarAccion(tipo, datos, computa) {
    emitir(`action.${tipo}`, datos);
    if (computa) s.acciones++;
    return computa;
  }

  return {
    get estado() { return s.estado; },
    get pregunta() { return s.pregunta; },
    get posicion() { return s.posicion; },
    get pieza() { return piezaActual(); },
    get tope() { return s.playlist.length; },
    get extraUsado() { return s.extraUsado; },
    get enExtra() { return s.enExtra; },
    get acciones() { return s.acciones; },
    get piezasVistas() { return s.piezasVistas; },
    get duracionS() { return Math.round((ahora() - s.aperturaTs) / 1000); },
    get sesionesHoy() { return leerDia().sesiones; },

    // ── apertura de la app ──
    abrir(origen = 'directo') {
      s.aperturaTs = ahora();
      const aperturas = leerAperturas();
      const rafaga = esRafagaAnsiosa(aperturas, s.aperturaTs);
      // la apertura-ráfaga se registra SIN rebote: la intervención corta la cadena
      aperturas.push({ ts: s.aperturaTs, fueRebote: rafaga ? false : null });
      guardarAperturas(aperturas);
      emitir('session.open', { origen, es_rafaga: rafaga });

      const dia = leerDia();
      if (rafaga) {
        s.estado = 'RAFAGA';
        emitir('brake.shown', { motivo: 'rafaga' });
      } else if (dia.sesiones >= config.DAILY_SESSIONS) {
        s.estado = 'AGOTADO';
      } else {
        s.pregunta = preguntaDelDia(s.aperturaTs);
        s.estado = 'ATERRIZAJE';
      }
      return s.estado;
    },

    // ── aterrizaje: elegir ficha o saltar — ninguno computa como acción ──
    responderAterrizaje() {
      if (s.estado !== 'ATERRIZAJE') return;
      s.estado = 'TRANSITO';
    },

    // ── fin del tránsito de calma → empieza el contenido (consume presupuesto) ──
    completarTransito() {
      if (s.estado !== 'TRANSITO') return;
      const dia = leerDia();
      dia.sesiones++;
      guardarDia(dia);
      s.sesionCorrida = true;
      emitir('session.start', {});
      s.playlist = armarPlaylist(dia.sesiones);
      s.posicion = 1;
      s.estado = 'CONTENIDO';
      verPieza();
    },

    // ── avanzar pieza; al llegar al tope → freno ──
    siguientePieza() {
      if (s.estado !== 'CONTENIDO') return;
      if (s.posicion >= s.playlist.length) {
        mostrarFreno('tope');
        return;
      }
      s.posicion++;
      verPieza();
    },

    // ── acciones con intención (Decisión 5) ──
    // reply / prompt_answer / create: texto ≥ MIN_CHARS o NO se emite (regla 7).
    responder(texto) {
      const pz = piezaActual();
      const t = (texto || '').trim();
      if (t.length < config.MIN_CHARS) return false;
      const tipo = pz && pz.clase === 'prompt' ? 'prompt_answer' : 'reply';
      return registrarAccion(tipo, { chars: t.length, piece_id: pz ? pz.id : undefined }, true);
    },
    guardar() {
      const pz = piezaActual();
      return registrarAccion('save', { piece_id: pz ? pz.id : undefined }, true);
    },
    gesto() {
      // se emite SIEMPRE; computa solo hasta GESTURES_COUNTED_PER_DAY (regla 6)
      const dia = leerDia();
      dia.gestos++;
      guardarDia(dia);
      const pz = piezaActual();
      const computa = dia.gestos <= config.GESTURES_COUNTED_PER_DAY;
      return registrarAccion('gesture', { piece_id: pz ? pz.id : undefined }, computa);
    },
    crear(texto) {
      // modo producir (AGOTADO): crear reflexión propia
      const t = (texto || '').trim();
      if (t.length < config.MIN_CHARS) return false;
      return registrarAccion('create', { chars: t.length }, true);
    },

    // ── freno de mano ──
    aceptarFreno() {
      if (s.estado !== 'FRENO' && s.estado !== 'RAFAGA') return;
      emitir('brake.result', { resultado: 'acepto' });
      if (s.estado === 'RAFAGA') { s.estado = 'RAFAGA_FIN'; return; }
      cerrarSesion();
    },
    verUnPocoMas() {
      // +EXTRA_PIECES una sola vez por sesión (EXTRA_PER_SESSION = 1, DOCTRINA)
      if (s.estado !== 'FRENO' || s.extraUsado) return false;
      emitir('brake.result', { resultado: 'continuo' });
      s.extraUsado = true;
      s.enExtra = true;
      s.playlist = s.playlist.concat(piezasExtra(leerDia().sesiones, s.playlist));
      s.estado = 'CONTENIDO';
      s.posicion++;
      verPieza();
      return true;
    },

    // ── cierre por abandono (pagehide): solo si había sesión visible ──
    cerrarPorAbandono() {
      if (['ATERRIZAJE', 'TRANSITO', 'CONTENIDO', 'FRENO'].includes(s.estado)) {
        cerrarSesion();
      }
    },
  };
}

/* ══════════════════════════ 2 · CAPA DE RENDER ══════════════════════════ */
/* Solo corre en navegador; la máquina de arriba no sabe que esto existe.   */

if (typeof document !== 'undefined') {
  (function iniciarApp() {
    const almacen = {
      leer(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (_) { return null; } },
      escribir(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
    };
    const maquina = crearMaquina({
      config: VERA_CONFIG, seed: SEED, emitir, almacen, ahora: () => Date.now(),
    });

    const $ = sel => document.querySelector(sel);
    const vistas = ['aterrizaje', 'transito', 'contenido', 'freno', 'cierre', 'rafaga', 'agotado'];

    function mostrarVista(nombre) {
      vistas.forEach(v => { $('#v-' + v).hidden = v !== nombre; });
    }

    function esc(t) {
      const d = document.createElement('div');
      d.textContent = t == null ? '' : String(t);
      return d.innerHTML;
    }

    /* ── S1 · Aterrizaje ── */
    function renderAterrizaje() {
      $('#pregunta').textContent = maquina.pregunta.texto;
      const cont = $('#fichas');
      cont.innerHTML = '';
      if (maquina.pregunta.fichas) {
        SEED.fichas.forEach(f => {
          const b = document.createElement('button');
          b.className = 'ficha';
          b.textContent = f;
          b.addEventListener('click', () => { b.classList.add('sel'); irATransito(); });
          cont.appendChild(b);
        });
        $('#saltar').textContent = 'o simplemente continúa →';
      } else {
        $('#saltar').textContent = 'o simplemente continúa →';
      }
      mostrarVista('aterrizaje');
    }

    function irATransito() {
      maquina.responderAterrizaje();
      mostrarVista('transito');
      setTimeout(() => {
        maquina.completarTransito();
        renderPieza();
        mostrarVista('contenido');
      }, VERA_CONFIG.TRANSIT_PAUSE_S * 1000);
    }

    /* ── S3 · Contenido ── */
    function renderTope() {
      $('#tope-count').textContent = `${maquina.posicion} de ${maquina.tope}`;
      const dots = $('#tope-dots');
      dots.innerHTML = '';
      for (let i = 1; i <= maquina.tope; i++) {
        const d = document.createElement('span');
        d.className = 'tdot' + (i <= maquina.posicion ? ' on' : '');
        dots.appendChild(d);
      }
    }

    function compositorHTML(placeholder, idBoton) {
      return `
        <div class="compositor">
          <textarea placeholder="${esc(placeholder)}"></textarea>
          <div class="compositor-pie">
            <span class="contador">0 / ${VERA_CONFIG.MIN_CHARS}</span>
            <button class="accion primary" data-rol="${idBoton}" disabled>Enviar</button>
          </div>
        </div>`;
    }

    function conectarCompositor(card, alEnviar) {
      const ta = card.querySelector('textarea');
      const contador = card.querySelector('.contador');
      const enviar = card.querySelector('[data-rol="enviar"]');
      ta.addEventListener('input', () => {
        const n = ta.value.trim().length;
        contador.textContent = `${n} / ${VERA_CONFIG.MIN_CHARS}`;
        contador.classList.toggle('ok', n >= VERA_CONFIG.MIN_CHARS);
        enviar.disabled = n < VERA_CONFIG.MIN_CHARS;
      });
      enviar.addEventListener('click', () => {
        if (alEnviar(ta.value)) {
          card.querySelector('.compositor').outerHTML =
            '<div class="prompt-tag" style="margin-top:10px">✓ enviado con intención</div>';
        }
      });
    }

    function renderPieza() {
      const pz = maquina.pieza;
      if (!pz) return;
      renderTope();
      const cont = $('#pieza');

      if (pz.clase === 'persona') {
        const autor = SEED.circulo.find(u => u.id === pz.autorId) || {};
        cont.innerHTML = `
          <article class="card">
            <div class="card-head">
              <div class="av">${esc(autor.inicial)}<span class="verif">✓</span></div>
              <div>
                <div class="card-nombre">${esc(autor.nombre)}</div>
                <div class="card-sub">${esc(autor.oficio)} · ${esc(pz.hace)} · humano verificado</div>
              </div>
            </div>
            <p class="card-cuerpo">${esc(pz.texto)}</p>
            <div class="acciones">
              <button class="accion" data-rol="gesto">${esc(SEED.gesto.simbolo)} ${esc(SEED.gesto.etiqueta)}</button>
              <button class="accion" data-rol="abrir-resp">Responder</button>
              <button class="accion" data-rol="guardar">Guardar</button>
            </div>
            <div data-rol="zona-comp"></div>
          </article>`;
        const card = cont.firstElementChild;
        card.querySelector('[data-rol="gesto"]').addEventListener('click', e => {
          maquina.gesto();
          e.target.textContent = `${SEED.gesto.simbolo} enviado`;
          e.target.disabled = true;
        });
        card.querySelector('[data-rol="guardar"]').addEventListener('click', e => {
          maquina.guardar();
          e.target.textContent = '✓ guardado';
          e.target.disabled = true;
        });
        card.querySelector('[data-rol="abrir-resp"]').addEventListener('click', e => {
          e.target.disabled = true;
          card.querySelector('[data-rol="zona-comp"]').innerHTML =
            compositorHTML('Responde con calma…', 'enviar');
          conectarCompositor(card, texto => maquina.responder(texto));
        });
      } else {
        cont.innerHTML = `
          <article class="card card-prompt">
            <div class="prompt-tag">${esc(SEED.gesto.simbolo)} Prompt de VERA</div>
            <p class="card-cuerpo">${esc(pz.texto)}</p>
            <div class="acciones">
              <button class="accion primary" data-rol="abrir-resp">Responder</button>
            </div>
            <div data-rol="zona-comp"></div>
          </article>`;
        const card = cont.firstElementChild;
        card.querySelector('[data-rol="abrir-resp"]').addEventListener('click', e => {
          e.target.disabled = true;
          card.querySelector('[data-rol="zona-comp"]').innerHTML =
            compositorHTML('Escribe aquí (mínimo 20 caracteres)…', 'enviar');
          conectarCompositor(card, texto => maquina.responder(texto));
        });
      }

      const esUltima = maquina.posicion >= maquina.tope;
      $('#btn-siguiente').textContent = esUltima ? 'Continuar' : 'Siguiente →';
    }

    $('#btn-siguiente').addEventListener('click', () => {
      maquina.siguientePieza();
      if (maquina.estado === 'FRENO') renderFreno();
      else renderPieza();
    });

    /* ── S4 · Freno ── */
    function renderFreno() {
      $('#btn-vermas').hidden = maquina.extraUsado;
      $('#freno-sub').textContent = maquina.extraUsado
        ? 'Lo de hoy en tu círculo ya está completo. Lo que sigue es tuyo.'
        : 'Viste lo que tu círculo trajo hoy. Puedes cerrar aquí, o ver un poco más.';
      mostrarVista('freno');
    }

    $('#btn-cerrar-calma').addEventListener('click', () => {
      maquina.aceptarFreno();
      renderCierre();
    });
    $('#btn-vermas').addEventListener('click', () => {
      if (maquina.verUnPocoMas()) {
        renderPieza();
        mostrarVista('contenido');
      }
    });

    /* ── S5 · Cierre ── */
    function renderCierre() {
      const min = Math.max(1, Math.round(maquina.duracionS / 60));
      $('#resumen').innerHTML = `
        <div class="resumen-fila"><span class="ic">◈</span> ${maquina.piezasVistas} piezas de tu círculo</div>
        <div class="resumen-fila"><span class="ic">✎</span> ${maquina.acciones} ${maquina.acciones === 1 ? 'acción' : 'acciones'} con intención</div>
        <div class="resumen-fila"><span class="ic">◷</span> ~${min} min — y eso fue suficiente</div>`;
      mostrarVista('cierre');
    }

    /* ── Ráfaga ansiosa ── */
    $('#btn-rafaga-ok').addEventListener('click', () => {
      maquina.aceptarFreno();
      $('#rafaga-txt').textContent = 'Bien. VERA queda aquí, tranquila.';
      $('#btn-rafaga-ok').hidden = true;
    });

    /* ── Agotado · modo producir ── */
    function renderAgotado() {
      const zona = $('#agotado-comp');
      zona.innerHTML = compositorHTML('Escribe una reflexión propia…', 'enviar');
      conectarCompositor($('#v-agotado'), texto => maquina.crear(texto));
      mostrarVista('agotado');
    }

    /* ── Saltar aterrizaje ── */
    $('#saltar').addEventListener('click', irATransito);

    /* ── Cierre por abandono: el rebote se registra aunque cierren la pestaña ── */
    window.addEventListener('pagehide', () => maquina.cerrarPorAbandono());

    /* ── Arranque ── */
    const estado = maquina.abrir('directo');
    if (estado === 'RAFAGA') mostrarVista('rafaga');
    else if (estado === 'AGOTADO') renderAgotado();
    else renderAterrizaje();
  })();
}

// Para tests en Node (la máquina pura se exporta si hay module).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { crearMaquina };
}
