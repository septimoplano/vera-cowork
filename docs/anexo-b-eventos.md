# Anexo B · Esquema de eventos (instrumentación)

> Fuente: `VERA Fase1 Decisiones Cerradas v1.md`, Anexo B. Es la **especificación técnica** del `constructor-tecnico`.
> Regla (doctrina): abrir la beta sin estos eventos = volar a ciegas. Se instrumentan ANTES de construir pantallas.
> En la app web de validación viven en `app/eventos.js` (localStorage); en Etapa B se emiten a PostHog.

## Los 8 eventos

```
session.open        { ts, origen, es_rafaga: bool }
session.start       { ts }                          // tras tránsito de calma
piece.view          { ts, piece_id, tipo: persona|prompt, posicion: 1..7 }
action.*            { ts, tipo, chars?, piece_id? }  // las 5 de la Decisión 5
brake.shown         { ts, motivo: tope|tiempo|rafaga }
brake.result        { ts, resultado: acepto|continuo }
session.close       { ts, duracion_s, piezas_vistas, acciones }
day.exhausted       { ts }                           // presupuesto diario agotado
```

## Detalle de campos

| Evento | Campo | Tipo | Notas |
|---|---|---|---|
| `session.open` | `ts` | timestamp | momento de apertura de la app |
| | `origen` | string | `directo`, `notificacion`, etc. |
| | `es_rafaga` | bool | `true` si es 3ª apertura en 10 min tras 2 rebotes (Decisión 1) |
| `session.start` | `ts` | timestamp | se emite tras el tránsito de calma (`TRANSIT_PAUSE_S`), no en la apertura |
| `piece.view` | `ts` | timestamp | |
| | `piece_id` | id | identificador de la pieza |
| | `tipo` | enum | `persona` \| `prompt` |
| | `posicion` | int | 1..7 (5 del tope + hasta 2 del "ver un poco más") |
| `action.*` | `ts` | timestamp | el `*` es uno de los 5 tipos de la Decisión 5 (abajo) |
| | `tipo` | enum | `reply` \| `prompt_answer` \| `save` \| `create` \| `gesture` |
| | `chars` | int? | presente en reply/prompt_answer/create; debe ser ≥ `MIN_CHARS` (20) para computar |
| | `piece_id` | id? | pieza sobre la que se actúa, si aplica |
| `brake.shown` | `ts` | timestamp | |
| | `motivo` | enum | `tope` \| `tiempo` \| `rafaga` |
| `brake.result` | `ts` | timestamp | |
| | `resultado` | enum | `acepto` (cerró con calma) \| `continuo` (pidió "ver un poco más") |
| `session.close` | `ts` | timestamp | |
| | `duracion_s` | int | duración total de la sesión en segundos |
| | `piezas_vistas` | int | |
| | `acciones` | int | acciones con intención computables de la sesión |
| `day.exhausted` | `ts` | timestamp | se emite al agotar el presupuesto diario (3 sesiones) |

## Los 5 tipos de `action.*` (Decisión 5)

| # | Acción | Condición mínima | Evento |
|---|---|---|---|
| 1 | Responder a una persona | Texto ≥ 20 caracteres (`MIN_CHARS`) | `action.reply` |
| 2 | Responder a un prompt de VERA | Texto ≥ 20 caracteres | `action.prompt_answer` |
| 3 | Guardar una pieza o idea | Toque en Guardar | `action.save` |
| 4 | Crear una reflexión propia | Texto ≥ 20 caracteres (modo producir) | `action.create` |
| 5 | Gesto hacia otra persona | Máx 3 gestos/día computables (`GESTURES_COUNTED_PER_DAY`) | `action.gesture` |

**NO cuentan nunca**: abrir/cerrar la app, pasar piezas, elegir ficha de aterrizaje, aceptar el freno, gestos más allá del 3º del día.

## Las 3 métricas matrices (derivadas de los 8 eventos)

- **M1 · Retorno tranquilo** = % de sesiones-rebote (`< BOUNCE_MAX_S` sin acción con intención) por usuario/semana. **Tendencia deseada: ↓.**
  - Cálculo: sesiones donde `session.close.duracion_s < 15` y `session.close.acciones == 0`, sobre total de sesiones.
- **M2 · Salida voluntaria** = `brake.result: acepto` / `brake.shown`. **Tendencia deseada: ↑.**
- **M3 · Acción por sesión** = Σ `action.*` computables / Σ sesiones. **Objetivo de cohorte: ≥ 1.0.**

## Verificación (recorrido conocido)

Un recorrido de 2 sesiones — una con 1 rebote (cierre <15s, 0 acciones) y otra con freno aceptado + 2 acciones con intención — debe dar:
- M1 = 50% (1 de 2 sesiones fue rebote)
- M2 = 100% (1 freno mostrado, 1 aceptado)
- M3 = 1.0 (2 acciones / 2 sesiones)

Este es el caso de prueba de `app/metricas.html` (tarea T6 en `tasks/todo.md`).

## Parámetros relacionados (Anexo A)

`BOUNCE_MAX_S = 15` · `BURST_WINDOW_MIN = 10` · `BURST_OPEN_COUNT = 3` · `MIN_CHARS = 20` · `GESTURES_COUNTED_PER_DAY = 3` · `SESSION_CAP = 5` · `EXTRA_PIECES = 2`. Todos como config remota (`app/config.js`) salvo doctrina.
