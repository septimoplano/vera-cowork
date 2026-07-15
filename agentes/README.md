# Agentes — VERA

Red social de suscripción, humanos verificados, sin scroll infinito. Proyecto de **largo plazo** (2-4 años) operado por 5 agentes de Claude Code. Regla del CEO: **VERA no canibaliza las horas que pagan las cuentas** (LVDME y Conejo de Jade).

> Estado: fase de validación (H1). El producto Fase 1 está 100% especificado (reglas matrices cerradas).

## Estructura

```
VERA/
├── VERA PLAN MAESTRO v1.md              ← plan fuente
├── VERA Fase1 Decisiones Cerradas v1.md ← reglas y parámetros del MVP
├── VERA Pitch Deck / Wireframe          ← material de origen
├── agentes/
│   ├── 00-contexto-vera.md         ← base: TODO agente lo lee primero
│   ├── validador.md                (H1: lista de espera, test de pago, entrevistas, go/no-go)
│   ├── product-owner.md            (reglas matrices, roadmap MVP, 3 métricas, doctrina)
│   ├── growth.md                   (lista de espera, creadores semilla, invitaciones, PR, ASO)
│   ├── constructor-tecnico.md      (build MVP: RN+Supabase+RevenueCat+verificación+PostHog)
│   └── legal-cumplimiento.md       (protección de datos, biometría, tiendas, registro de marca)
└── salidas/                        ← salidas de todos los agentes
```

## La secuencia (por horizonte, con go/no-go)

```
H1 Validación   → validador (¿hay demanda de pago? ≥8% comprometido) + growth (lista de espera)
                  Si no pasa el 8%: se replantea ANTES de construir.
H2 MVP          → product-owner (roadmap+reglas) + constructor-tecnico (5 pantallas + métricas)
H3 Beta de pago → constructor-tecnico (verificación+suscripción) + legal-cumplimiento (protección de datos)
H4 Lanzamiento  → growth (creadores, PR, ASO) + legal (tiendas) + constructor (publicación)
```

## Doctrina que ningún agente toca

Existencia del tope de piezas · el "+2 una sola vez" · ausencia de likes/rojo/contadores · el freno que invita sin bloquear · el pago desde el día 1 (filtro anti-bot). Eso no son parámetros: son el producto.

## Cómo operar un agente

Abrir Claude Code en `VERA/` y decir, por ejemplo:
> "Lee `agentes/validador.md` y actúa como el Validador. Diseña el test de precio de la landing."

El CEO (`../CEO/ceo.md`) vigila que VERA avance sin consumir las horas de lo que factura hoy.
