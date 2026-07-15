# Fase 3 · Beta de pago (mes 8-14)

> Objetivo: **probar la disposición real a pagar y la verificación humana formal.**
> Responsables: **constructor-tecnico** (dueño técnico) + **legal-cumplimiento** (codueño — aquí el cumplimiento es existencial).
> Entra solo si Fase 2 dio go (D30 ≥25%). Go/no-go de salida: churn <8% y NPS >50.

## KRs

1. Verificación de identidad operativa (proveedor externo).
2. 1.000-5.000 miembros de pago fundadores (US$19-29/año, vitalicio-descuento).
3. Churn mensual < 8%.
4. NPS > 50.

## Órdenes — constructor-tecnico

1. **Integrar KYC**: Truora o MetaMap (cubren cédula/RUT y documentos LatAm) — decisión final tras cotizar ambos. Flujo: prueba 30 días → pago → verificación (después del pago, no antes). **Guardar solo `verificado: true` + proveedor + fecha. Jamás el documento.**
2. **Integrar RevenueCat**: membresía fundadora in-app, precio con el 15-30% de comisión de tienda ya calculado dentro. Cancelación fácil y precio claro antes de comprar (Apple 3.1.2).
3. **Sistema de invitaciones escasas**: 3 por miembro verificado, trazables, sin gamificación (nada de "te quedan X" con presión).
4. **Iterar con las 3 métricas como brújula**: los experimentos de parámetros que definió el product-owner en Fase 2.

## Órdenes — legal-cumplimiento

1. **DPIA (evaluación de impacto)** del flujo biométrico antes de encenderlo — preparada para validación de abogado. Salida: `salidas/legal-datos.md`.
2. **Consentimiento explícito** del dato biométrico en el flujo del proveedor (Ley 21.719; dato sensible). Verificar equivalentes si hay usuarios fuera de Chile (LGPD, LFPDPPP).
3. **Contrato con el proveedor KYC**: revisar cláusulas de tratamiento de datos, retención y borrado. El proveedor procesa; VERA no almacena biometría.
4. **Checklist de tiendas** en preparación para Fase 4: UGC (reporte/bloqueo/moderación), suscripciones, borrado de cuenta, edad 18+. Salida: `salidas/legal-tiendas.md` (requisito → estado → responsable).

## Órdenes — growth

1. **Activar creadores semilla** (los 10-20 de la lista preparada): acceso fundador gratuito + códigos de invitación para su comunidad. Ellos llevan a su gente a un lugar que ya predican.
2. **Convertir la lista de espera** en miembros fundadores: secuencia de correos (MailerLite) con la historia + oferta fundadora.

## Órdenes — product-owner

1. Custodiar que la fricción del pago/verificación no rompa la experiencia de calma (el onboarding también es Interfaz de Calma).
2. **Diseñar Fase 2 del producto (Red de Confianza) EN PAPEL** — misma disciplina: reglas antes que código. Nada se construye aún.

## Órdenes — validador

1. Medir churn y NPS con la misma honestidad brutal del 8%: si churn >8% sostenido, el veredicto es no-go a tiendas y se corrige antes de escalar.

## Dependencias

- Necesita: go de Fase 2 · contrato KYC (fundador firma) · empresa lista para cobrar (cuentas de tiendas a nombre de la sociedad).
- Bloquea: Fase 4.
