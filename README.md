# Vera Cowork

Espacio de trabajo colaborativo del equipo Vera Cowork.

**VERA**: red social de suscripción, sin publicidad y sin scroll infinito, donde cada cuenta es un humano verificado. Contexto completo: [`agentes/00-contexto-vera.md`](agentes/00-contexto-vera.md).

## Estructura

```
vera-cowork/
├── README.md
├── agentes/     → los 6 agentes de VERA (leer 00-contexto-vera.md PRIMERO, siempre)
├── docs/        → especificación y diseños
│   ├── spec.md                     → fuente de verdad del desarrollo
│   ├── anexo-b-eventos.md          → esquema de los 8 eventos → M1/M2/M3 (spec técnica)
│   ├── verificacion-humana.md      → anti-bot por etapas (pago + invitación + KYC)
│   └── pitch-deck-actualizacion.md → plan de actualización del deck
├── tasks/       → plan técnico y tareas de implementación
│   ├── plan.md  → arquitectura, orden de build, riesgos, checkpoints
│   └── todo.md  → T1-T9 con criterios de aceptación
├── fases/       → ejecución del plan maestro, órdenes por agente
│   ├── 00-mapa-general.md   → timeline H1-H4 + coordinación
│   ├── fase-1-validacion.md → validador + growth (go/no-go: ≥8% pago)
│   ├── fase-2-mvp.md        → product-owner + constructor (D30 ≥25%)
│   ├── fase-3-beta-pago.md  → constructor + legal (churn <8%, NPS >50)
│   └── fase-4-lanzamiento.md→ growth + legal (tiendas, 50k miembros)
├── app/         → (próximo) Interfaz de Calma web — ver tasks/todo.md
├── landing/     → (próximo) landing + lista de espera
└── salidas/     → entregables de los agentes (informes con fecha)
```

## Estado

**Planificación completa · implementación en espera de orden del fundador.** El siguiente paso es `tasks/todo.md` T1.

## Flujo de trabajo

1. Clonar el repo: `git clone https://github.com/septimoplano/vera-cowork.git`
2. Leer `agentes/00-contexto-vera.md` y el archivo del rol que corresponda
3. Crear una rama por tarea: `git checkout -b mi-rama`
4. Commit y push: `git push -u origin mi-rama`
5. Abrir Pull Request para revisión del equipo (el product-owner revisa contra doctrina)

## Reglas del repo

- Español neutro (Chile) en toda copy y documentación.
- Sin secretos ni llaves en el repo, nunca.
- Los parámetros de producto salen del Anexo A de Decisiones Cerradas; la doctrina no se toca.
- Dinero y exposición pública (dominios, cuentas, difusión, contacto a creadores/prensa) los dispara solo Francisco.
