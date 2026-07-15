# Verificación humana — diseño anti-bot por etapas

> Responsables: **legal-cumplimiento** (marco de datos) + **product-owner** (mecanismo de producto) + **constructor-tecnico** (integración).
> Doctrina base (contexto VERA): *el pago es el filtro anti-bot — gratis no existe*. La verificación de identidad la paga VERA (~US$1-2/usuario), nunca el usuario.

## Principio

VERA no "detecta" bots como las redes de atención (CAPTCHAs, heurísticas): **los hace económicamente inviables y socialmente imposibles**. Tres capas que se suman, no se reemplazan:

1. **Económica**: toda cuenta paga. Una granja de bots a US$29/año por cuenta muere sola.
2. **Social**: entrada solo por invitación de un humano ya verificado (3 invitaciones por miembro). Cada cuenta tiene un padrino trazable.
3. **Documental** (desde Etapa C): KYC con proveedor externo — documento + selfie con prueba de vida.

## Escalera por etapa

| Etapa | Mecanismo | Qué se guarda | Coste |
|---|---|---|---|
| **A · Validación (ahora)** | Lista de espera: correo + double opt-in (MailerLite) + honeypot en el formulario. No hay cuentas aún. | Correo, origen, fecha | $0 |
| **B · MVP beta (100-500)** | **Verificación artesanal**: invitación manual del fundador/creadores semilla + código de un solo uso. Cada beta tester es conocido o referido directo. Es además mejor historia ("cada miembro fue invitado por un humano"). | Código usado, quién invitó | $0 |
| **C · Beta de pago (1k-5k)** | Pago (membresía fundadora) **+** KYC: **Truora o MetaMap** (cubren cédula chilena/RUT y documentos LatAm). Flujo: prueba 30 días → pago → verificación. Verificar DESPUÉS de pagar, no antes (la fricción temprana mata conversión). | **Solo el hecho**: `verificado: true`, proveedor, fecha. **JAMÁS el documento ni la biometría.** | ~US$1-2/usuario, lo paga VERA |
| **D · Lanzamiento** | C + invitaciones escasas (3 por miembro) como única puerta de entrada + moderación UGC (reporte/bloqueo, exigido por tiendas). | idem C + grafo de invitaciones | idem |

## Reglas duras (no negociables)

- **Nunca construir KYC en casa** (fraude + responsabilidad biométrica desproporcionada — plan maestro §5.1).
- **Minimización**: el proveedor procesa el documento; VERA almacena únicamente el resultado booleano. Si un regulador o un hackeo llega, no hay biometría que filtrar.
- **Consentimiento explícito** para el dato biométrico en el flujo del proveedor — Ley 21.719 (Chile) lo trata como dato sensible; igual LGPD (Brasil), LFPDPPP (México).
- **18+** como edad mínima: con verificación de identidad real simplifica el cumplimiento y calza con el posicionamiento adulto-consciente.
- **Evaluación de impacto** (tipo DPIA) antes de encender el KYC en Etapa C — la prepara legal-cumplimiento, la valida un abogado.

## Anti-bot en la landing (lo único activo hoy)

1. Campo honeypot oculto (los bots lo rellenan → descarte silencioso).
2. Double opt-in del correo vía MailerLite (confirma humano con acceso real al buzón).
3. Sin API pública de registro: el formulario es el único punto de entrada.
4. Métricas de calidad, no solo volumen (validador): tasa de confirmación de opt-in como primer filtro de lista sana.

## Qué mostrar de esto en el pitch

La verificación no es un costo: **es el producto**. "Cada cuenta de VERA es un humano verificado" + "en un internet 51% bots, certificar humanos es el activo que Meta no puede fabricar sin romper su modelo". El detalle operativo (proveedor, umbrales) no se publica — se protege como las reglas matrices.
