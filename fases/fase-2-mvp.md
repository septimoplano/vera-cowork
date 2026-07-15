# Fase 2 · MVP Fase 1 (mes 3-8)

> Objetivo: **app real en manos de 100-500 beta testers** (TestFlight / Play Internal Testing).
> Responsables: **product-owner** (dueño) + **constructor-tecnico** (build).
> Entra solo si Fase 1 dio go (≥8%). Go/no-go de salida: retención D30 ≥25% y aceptación del freno creciente.

## KRs

1. Las 5 pantallas funcionando en iOS y Android (React Native + Expo, TestFlight / Play Internal).
2. Las 3 métricas matrices instrumentadas con dashboard (PostHog).
3. Retención D30 ≥ 25% (uso intencional — NO se mide DAU).
4. Tasa de aceptación del freno de mano creciente mes a mes.

## Alcance (disciplina feroz)

**Dentro**: onboarding por invitación (código) · las 5 pantallas de sesión · círculo de contactos · responder/guardar/crear/gesto · prompts · config remota (Supabase) · los 8 eventos → PostHog.
**Fuera (NO se negocia sin decisión de fundador)**: DMs complejos, grupos, feed algorítmico, Fase 2-producto (Red de Confianza), Fase 3, web app pública, verificación KYC formal (va en Fase 3).

## Órdenes — product-owner

1. **Roadmap del MVP**: hitos quincenales desde el port RN hasta la beta con 100 testers. Salida: `salidas/roadmap-mvp.md`.
2. **Custodiar reglas y parámetros**: la tabla del Anexo A vive en config remota (Supabase); todo cambio con justificación escrita. Salida: `salidas/reglas-parametros.md`.
3. **Especificación de métricas**: verificar con el constructor que los 8 eventos calculan M1/M2/M3 exactamente como el Anexo B. Salida: `salidas/metricas-instrumentacion.md`.
4. **Revisar cada PR** contra doctrina. Rechazar cualquier streak/badge/rojo/contador aunque "mejore engagement".
5. **Experimentos de beta** (solo parámetros, jamás doctrina): tope 5 vs 7, umbral 15s vs 20s, MIN_CHARS 20 vs 30, textos del freno.

## Órdenes — constructor-tecnico

1. **Port de la máquina de sesión** web → React Native + Expo. La lógica pura de `app/app.js` se porta 1:1; solo cambia el render. Montar EAS builds.
2. **Supabase**: esquema según `docs/arquitectura.md` (crear ese doc como primera tarea de esta fase: modelo de datos + tabla `remote_config` + auth por invitación). El fundador crea la cuenta y provee llaves (boundary: preguntar primero).
3. **PostHog**: los 8 eventos + dashboard de M1/M2/M3. **Sin esto no se abre la beta** (doctrina: no volar a ciegas).
4. **Onboarding por invitación**: código de un solo uso, trazable a quien invitó (verificación artesanal — ver `docs/verificacion-humana.md` Etapa B).
5. **Cumplimiento técnico mínimo de esta etapa**: borrado de cuenta desde la app, reporte y bloqueo de usuarios (las tiendas lo exigirán; construirlo ahora es más barato).
6. **Test cerrado Google**: ~12 testers, 14 días — planificar el reclutamiento desde la lista de espera con growth.

## Órdenes — growth (preparación)

1. Mantener viva la lista de espera (contenido semanal) — de ahí salen los beta testers.
2. Afinar la lista de creadores semilla; **aún sin contacto masivo** (el producto se muestra en Fase 3 con verificación real).

## Órdenes — legal-cumplimiento

1. Política de privacidad de la beta (datos que captura la app + PostHog, Ley 21.719).
2. Términos de uso mínimos de beta cerrada.

## Dependencias

- Necesita: go de Fase 1 · cuenta Supabase + PostHog (fundador) · cuenta Apple Developer (US$99/año) y Google Play (US$25) a nombre de la empresa.
- Bloquea: Fase 3.
