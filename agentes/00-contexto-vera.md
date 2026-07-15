# Contexto — VERA

> Archivo base. **Todo agente de VERA lo lee primero, siempre.**
> Fuentes: `../VERA PLAN MAESTRO v1.md` y `../VERA Fase1 Decisiones Cerradas v1.md`. Última actualización: 2026-07-05.

---

## Qué es VERA

Una **red social de suscripción, sin publicidad y sin scroll infinito**, donde cada cuenta es un humano verificado. Compite por confianza, no por tiempo en pantalla. Categoría propia: **"red social de calma"** / espacio humano verificado. Enemigo declarado: el scroll infinito.

Es el proyecto de **largo plazo** (2-4 años) y una apuesta, no un ingreso de hoy. Regla del CEO: **VERA no canibaliza las horas que pagan las cuentas** (LVDME y Conejo de Jade).

## Mercado y jurisdicción

**Mercado objetivo: Chile primero, luego LatAm hispanohablante.** El beachhead es la comunidad chilena de bienestar digital (la red de Francisco es la semilla natural); la expansión sigue por países hispanos de la región.

- **Precios**: se piensan en **USD como ancla regional** (estabilidad frente a la volatilidad cambiaria de LatAm) con **precio localizado por país en las tiendas**; referencia en Chile en CLP. Apple/Google manejan la conversión y el cobro local.
- **Datos y verificación**: régimen chileno **Ley 21.719 / Ley 19.628** y leyes equivalentes por país (LGPD Brasil, etc.); verificación con proveedor KYC que cubra documentos de LatAm (cédula/RUT). Detalle en `legal-cumplimiento.md`.
- **Marca**: registro en **INAPI** (Chile) + Protocolo de Madrid o país por país para la región. Ver `legal-cumplimiento.md`.

## Visión y objetivo central

Que internet vuelva a ser de los humanos: cada persona real, cada sesión con fin, y el tiempo invertido devuelve valor a la vida fuera de la pantalla. **No competir por el mismo tiempo que TikTok/Instagram**: capturar el "momento de huida" — los millones que ya quieren reducir el scroll y solo tienen bloqueadores. VERA es el destino, no el bloqueo.

## Vientos de cola (datos verificados 2025-26)

- **51%** del tráfico web 2024 fue automatizado (Imperva/Thales). En un internet mayormente bot, quien certifica humanos tiene el activo que las plataformas de atención no pueden fabricar.
- Mercado detox digital creciendo (~$80-95M 2025-26 → ~$177M 2032); interés de búsqueda en máximos.
- La categoría "identidad humana verificada" **tiene aspirantes, no ganador** (World ID genera rechazo por biometría distópica).

## Lecciones de mercado (no repetir)

- **BeReal**: murió por cero modelo de negocio desde el día 1 y porque la anti-adicción sola no retiene. → VERA **cobra desde el día 1** y su retención viene del **valor humano** (relaciones, propósito), no del mecanismo de calma.
- **App.net / Vero**: "pagar por no tener ads" no basta. → VERA vende **acceso a humanos verificados + tiempo devuelto**, no solo ausencia de ads.
- **Calm/Headspace**: la gente paga por bienestar. → VERA se posiciona más cerca de "bienestar + conexión" que de "red social".

## El producto: Fase 1 (Interfaz de Calma) — 100% especificada

Sesiones finitas, no feed infinito. Las **reglas matrices** están cerradas (ver `../VERA Fase1 Decisiones Cerradas v1.md`):

- **Tope 5 piezas/sesión** (3 personas del círculo + 2 prompts), máx 3 sesiones/día → ~15-21 piezas/día máximo (vs. cientos en TikTok: ese contraste ES el producto).
- **Freno de mano** que invita a cerrar sin bloquear jamás; "+2 piezas una sola vez", luego "cuando se agota, se agota".
- **Ráfaga ansiosa**: 3ª apertura en 10 min tras 2 rebotes (<15s) → mensaje de calma, sin culpa.
- **Pregunta de aterrizaje** diaria y global (pool de 21).
- **5 acciones con intención** (responder, responder prompt, guardar, crear, gesto ≤3/día). El **gesto** (un "◇ te lo agradezco") es la única reacción de un toque — no hay likes.
- Todos los números son **config remota** (ajustables en beta), salvo la doctrina (existencia del tope, el "+2 una vez", ausencia de likes/rojo, el freno que no bloquea).

**3 métricas matrices**: M1 retorno tranquilo (↓ rebotes), M2 salida voluntaria (↑ aceptación del freno), M3 acción por sesión (≥1.0). Se instrumentan con 8 eventos (ver Anexo B del doc de decisiones).

## OKRs por horizonte (go/no-go en cada uno)

- **H1 Validación (mes 0-3)**: 1.000 en lista de espera · ≥8% dice que pagaría (con compromiso real, no opinión) · 30 entrevistas del nicho semilla. **Si no llega al 8%, se replantea antes de gastar en desarrollo.**
- **H2 MVP (mes 3-8)**: las 5 pantallas en iOS+Android (TestFlight/Play Internal) · 3 métricas instrumentadas · retención D30 ≥25%.
- **H3 Beta de pago (mes 8-14)**: verificación de identidad operativa · 1.000-5.000 miembros fundadores · churn <8% · NPS >50.
- **H4 Lanzamiento (mes 14-24)**: en ambas tiendas · 50.000 miembros de pago (≈US$150-250k ARR) · CAC < ⅓ LTV · ≥40% altas por invitación.

## Modelo de negocio

- **Membresía fundadora** (Etapa A-C): ~**US$19-29/año** (referencia en Chile ≈ CLP $19.900-29.900), vitalicio-descuento. **Gratis no existe** (el pago es el filtro anti-bot: doctrina). A lo sumo 30 días de prueba post-verificación.
- **Suscripción estándar** (Etapa D): ~**US$3,99/mes** o **US$29,99-34,99/año**, con precio localizado por país en las tiendas (CLP en Chile). Referencia: Calm (~US$60-70/año) demuestra el rango pagable por bienestar; VERA entra por debajo.
- La verificación de identidad la paga VERA (~**US$1-2/usuario**), no el usuario.

## Stack técnico (del plan maestro)

React Native + Expo · Supabase · RevenueCat (suscripciones) · **Truora o MetaMap** (KYC LatAm, cubren cédula/RUT) o Veriff/Onfido/Persona (verificación — nunca construir en casa) · PostHog (analítica propia) · Expo Push/OneSignal · GitHub privado. Tiendas: Apple 99$/año, Google 25$ (con test cerrado de ~12 testers 14 días).

## Nicho semilla (beachhead)

**Chile primero, luego LatAm hispanohablante** — comunidad de bienestar digital / minimalismo (creadores sobre burnout, productividad consciente, crianza sin pantallas). Ventaja: la red de Francisco en Chile (bienestar, LVDME) es la semilla natural. Se activa vía 10-20 creadores medianos (10k-100k) hispanos que ya predican esto y no tienen dónde llevar a su comunidad.

## Los agentes de VERA

```
validador          → H1: lista de espera, test de pago, 30 entrevistas, verificación de datos, go/no-go
product-owner      → reglas matrices, parámetros, 3 métricas, roadmap MVP, disciplina de alcance
growth             → lista de espera con historia, creadores semilla, invitaciones, PR de contraste, ASO
constructor-tecnico→ build MVP (RN+Supabase+RevenueCat+verificación+PostHog), instrumentar eventos
legal-cumplimiento → protección de datos (Ley 21.719/LatAm), biometría, políticas de tiendas, registro de marca
```
Ninguno trabaja sin leer este archivo. Salidas en `../salidas/`. El CEO (`../../CEO/ceo.md`) vigila que VERA no consuma las horas de lo que factura.
