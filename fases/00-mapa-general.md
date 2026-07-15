# Mapa general — fases y coordinación de agentes

> Cómo se ejecuta el plan maestro desde este repo. Cada fase tiene su archivo con órdenes concretas por agente.
> Regla de oro: **cada horizonte tiene go/no-go**. No se avanza sin pasar el criterio. El veredicto lo da el validador, la decisión final el fundador.

## Timeline (del plan maestro §4)

```
Mes  0──────3        3──────────8        8──────────14        14─────────24
     FASE 1          FASE 2              FASE 3               FASE 4
     VALIDAR         MVP FASE 1          BETA DE PAGO         TIENDAS + ESCALA
     landing         app (web→RN)        verificación KYC     Google Play
     lista espera    5 pantallas         suscripción real     App Store
     entrevistas     métricas M1-M3      1-5k fundadores      50k miembros
     marca INAPI     100-500 beta        churn <8%            ≥40% por invitación
     ─────────       ─────────           ─────────            ─────────
     go/no-go:       go/no-go:           go/no-go:            (lanzado)
     ≥8% pago        D30 ≥25%            NPS >50
```

**Pre-fase (ahora)**: construir la app web de validación + landing según `tasks/plan.md` y `tasks/todo.md`. Es el instrumento de la Fase 1: las entrevistas se hacen con producto tocable.

## Quién hace qué, cuándo

| Agente | Fase 1 | Fase 2 | Fase 3 | Fase 4 |
|---|---|---|---|---|
| **validador** | 🔴 Dueño: entrevistas, lista, go/no-go | veredicto D30 | veredicto churn/NPS | monitoreo |
| **product-owner** | apoya (copy 21 preguntas, prompts) | 🔴 Dueño: roadmap, reglas, alcance | custodio doctrina + diseña Fase 2 producto en papel | custodio doctrina |
| **constructor-tecnico** | app web validación (pre-fase) | 🔴 Dueño: port a RN, build MVP | 🔴 Dueño: KYC + RevenueCat | publicación tiendas |
| **growth** | 🔴 Codueño: landing, historia | prepara creadores semilla | activa creadores + invitaciones | 🔴 Dueño: ASO, PR contraste, campaña |
| **legal-cumplimiento** | 🔴 Codueño: marca INAPI YA | políticas de privacidad beta | 🔴 Codueño: DPIA, consentimiento biométrico | checklist tiendas en verde |

🔴 = responsable principal de la fase.

## Reglas de coordinación

1. **Todo agente lee `agentes/00-contexto-vera.md` antes de actuar.** Sin excepciones.
2. **Salidas al repo**: cada entregable a `salidas/` con fecha (`AAAA-MM-nombre.md`), rama por tarea, PR para revisión (flujo del README).
3. **El product-owner revisa todo PR que toque producto** contra la doctrina (sin likes, sin rojo, sin streaks, freno que no bloquea).
4. **Dependencias entre agentes se declaran en el PR** ("necesito X del validador antes de Y").
5. **El CEO (workspace local `CEO/ceo.md`) vigila** que VERA no canibalice las horas de LVDME y Conejo de Jade. VERA es apuesta de largo plazo, no urgencia.
6. **Dinero y exposición pública = decisión del fundador**: dominios, cuentas de pago, difundir la landing, contactar creadores o prensa. Los agentes preparan; Francisco dispara.

## Estado actual (2026-07-15)

- [x] Contexto, plan maestro, decisiones cerradas, wireframe — completos
- [x] Agentes definidos (6 archivos en `agentes/`)
- [x] Planificación de desarrollo (este conjunto de documentos)
- [ ] App web de validación — **siguiente paso, espera orden del fundador** (`tasks/todo.md` T1)
- [ ] Fase 1 en marcha — depende de la app + landing
- [ ] Registro de marca INAPI — **pendiente y urgente** (bloquea toda exhibición pública)
