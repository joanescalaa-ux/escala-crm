# 03 · CONTRADICCIONES

> **EXTRACCIÓN PARCIAL — 1 de 4 fuentes disponibles.**
> Este archivo debía cruzar contradicciones **entre fuentes** y **dentro de cada fuente**. Con solo la fuente 4 disponible, aquí están **únicamente las contradicciones internas del SOP**. Todo el cruce entre llamadas y SOP está bloqueado. Ver `00-FUENTES-QUE-FALTAN.md`.
>
> **Fuente:** `SOP_Sprint_14_Dias_Escala.md` v1.1, ID `1RxXR1z3E8VMc2nJXbyigFlnRck9fFJnWHJStvePhoWo`, modificado 24/08/2026 17:36.

---

## PARTE A — CONTRADICCIONES INTERNAS DEL SOP (extraídas)

---

### C-1 · Activos que "no existen" y que a la vez están "construidos"

**Dice A** — [SOP §0.2], lista de partida:

> «Activos que NO se dan por existentes y se construyen en el sprint: **Lead magnet real.** VSL de conversión. Página de VSL con formulario de aplicación. **Secuencia post-booking automatizada.** Batch de contenido de 14 días. **SOP de Setter operativo.** Infraestructura de retargeting en Meta.»

**Dice B** — [SOP §0.7], índice de activos, apenas 150 líneas después:

> «De los 42 bloques del calendario, **los entregables documentales ya están construidos**.»

Y en la tabla de esa misma sección:

> «06\_Diagnostico\_6\_Fugas.pdf | **Lead magnet completo, 8 páginas maquetadas** | D2 · B2–B3»
> «10\_Secuencia\_Post\_Booking.md | Los 4 toques con copys literales + protocolo de no-show | D5 · B2»
> «15\_SOP\_Setter.pdf | **Manual operativo del Setter, 8 páginas, entregable tal cual** | D9 · B1»
> «AD\_01\_Diagnostico.png · AD\_02\_Mecanismo.png · AD\_03\_Filtro.png | 3 creativos de Stories 1080×1920 para retargeting | D7 · B3»

Y en el cuerpo del Día 2:

> «✅ **CONSTRUIDO** · Integrado directamente en el PDF final ([06\_Diagnostico\_6\_Fugas.pdf]): las 6 fugas ya vienen con síntoma, coste, pregunta de autodiagnóstico y micro-acción. **Este bloque pasa a ser de revisión, no de construcción.**»

**Reconciliación parcial (que el documento nunca hace explícita):** una parte del choque se explica porque §0.2 habla del activo *en funcionamiento* y §0.7 del *documento*. El PDF del lead magnet existe, pero el vídeo de 11 minutos que lo acompaña no («⬜ **SOLO TÚ** · el vídeo de 11 minutos que acompaña al PDF», [SOP §Módulo 1, Día 2 · Bloque 3]). Lo mismo con la secuencia post-booking: el copy existe, las automatizaciones no («⬜ **SOLO TÚ** · montar las 4 automatizaciones en Make.com»).

**Por qué importa:** §0.2 es la sección que un tercero lee para saber qué hace falta construir. Un candidato al que le enseñes §0.2 va a presupuestar la creación de un lead magnet, un SOP de setter y unos creativos que ya están hechos y pagados. **Es el punto exacto por donde se paga dos veces el mismo entregable.**

---

### C-2 · El VSL está fuera del rango que el propio SOP declara obligatorio, y se da por bueno

**Dice A** — el rango, repetido tres veces:

> «GUION TÉCNICO DEL VSL (12–13 minutos · **~1.900 palabras habladas**)» [SOP §3.2, encabezado]

> «el guion debe medir entre **1.850 y 1.950 palabras habladas**. Cuenta solo palabras habladas (excluye acotaciones, encabezados y notas).» [SOP §Módulo 1, Día 3 · Bloque 3]

> «Conteo de palabras habladas | **1.850–1.950** (excluye acotaciones y encabezados) | ☐» [SOP §3.2.7, control de calidad previo a grabar]

**Dice B** — la medición del guion final, en dos sitios:

> «09\_VSL\_Guion\_Final.md | VSL palabra por palabra, **1.779 palabras habladas** (12,1 min)» [SOP §0.7]

> «✅ **CONSTRUIDO** · 09\_VSL\_Guion\_Final.md — **medido: 1.779 palabras habladas → 12,1 minutos a 147 wpm. Dentro de rango.** Incluye checklist pre-grabación y checklist de montaje.» [SOP §Módulo 1, Día 3 · Bloque 3]

**La contradicción:** 1.779 < 1.850. **No está dentro de rango: está 71 palabras por debajo del mínimo**, y la afirmación «Dentro de rango» aparece en el mismo bloque que fija el mínimo de 1.850, cuatro párrafos más arriba.

**Por qué importa:** el checklist §3.2.7 exige marcar esa casilla antes de grabar. Tal y como está, o se graba incumpliendo el propio control de calidad, o hay que reescribir el guion antes del Día 4. Son decisiones distintas y el documento no permite saber cuál es la buena.

---

### C-3 · Tres reglas distintas para la misma decisión de apagar los ads

Misma métrica (coste por conversación iniciada en Meta), tres umbrales y dos acciones incompatibles.

**Dice A** — [SOP §Módulo 1, Día 10 · Bloque 1]:

> «CTR y coste por conversación en Meta → **si el coste por conversación iniciada supera 8 €, pausa el ad set de 90 días** y concentra en 14 y 30.»

**Dice B** — [SOP §A.4, tabla "Reglas de decisión (evaluar el Día 13)"]:

> «Coste por conversación iniciada | **6–10 €** | **Mantener 15 €/día**»
> «Coste por conversación iniciada | **\> 10 €** | **Pausar ad set de 90 d**, concentrar en 14 d y 30 d»

**Dice C** — [SOP §Módulo 1, Día 13 · Bloque 3]:

> «si el coste por conversación iniciada está por debajo de 6 €, sube a 25 €/día. **Si está por encima de 10 €, apaga y reinvierte ese tiempo en outbound.**»

**Los dos choques concretos:**

| Escenario | §D10 dice | §A.4 dice | §D13 dice |
|---|---|---|---|
| Coste = **9 €** | **Pausar** el ad set de 90 d | **Mantener** 15 €/día | (no aplica, evalúa D13) |
| Coste = **12 €** | Pausar el de 90 d | Pausar **solo** el de 90 d, seguir con 14 d y 30 d | **Apagar** y reinvertir en outbound |

A 9 € el documento se manda a sí mismo pausar y mantener a la vez. A 12 €, «pausar el ad set de 90 d» y «apaga» son dos cosas distintas: una deja dos conjuntos vivos a 10 €/día, la otra deja la campaña a cero.

**Por qué importa:** es la única decisión de gasto recurrente del sistema. Con estas tres reglas, el resultado depende de qué párrafo mires el día 13.

---

### C-4 · Referencia cruzada rota al Anexo A

**Dice A** — [SOP §Módulo 1, Día 7 · Bloque 3]:

> «Sube el creativo (**3 stories verticales del Anexo A.4**).»

**Dice B** — el índice real del Anexo A:

> «### A.3 Los 3 creativos (stories verticales, 1080×1920, fondo \#0A0A0A, acento \#F5D800)»
> «### A.4 Reglas de decisión (evaluar el Día 13)»

Los creativos están en **A.3**. **A.4** son las reglas de umbral de coste.

**Por qué importa:** poco por sí solo, pero es la sección que se ejecuta con Business Manager abierto y presupuesto activo. Y es la segunda señal (con C-3) de que el Anexo A se editó después que el Módulo 1 sin volver a sincronizar los dos.

---

### C-5 · Dos umbrales incompatibles para la tasa de respuesta a DM

**Dice A** — [SOP §0.3] y [SOP §Anexo B]:

> «Tasa de respuesta outbound | **25–30 %** | Personalización 1:1, no plantilla» [§0.3]
> «Tasa de respuesta a DM | Diaria | **≥ 25 %** | La primera línea de tus mensajes» [§Anexo B]

**Dice B** — [SOP §Módulo 1, Día 10 · Bloque 1]:

> «Tasa de respuesta a DMs → **si \<15 %**, el problema es la primera línea, no el volumen. Reescribe las aperturas.»

**La contradicción:** entre el 15 % y el 25 % hay una franja donde el Cuadro de Mando declara la métrica fallida («SI FALLA, EL PROBLEMA ES: la primera línea de tus mensajes») y la auditoría del Día 10 no dispara ninguna acción. Con un 18 % de respuesta, el Anexo B dice reescribir las aperturas y el Día 10 dice que no hay problema.

**Por qué importa menos que C-3:** aquí no se gasta dinero, se pierde tiempo. Pero el Anexo B se presenta como «los únicos 9 números» y la regla de diagnóstico dice «se busca **el primer número de la tabla que falla**» — con dos umbrales, "el primero que falla" no está definido.

---

### C-6 · Las cuotas no suman el precio anunciado

**Dice A** — [SOP §0.2]:

> «precio (Programa 2.500 € PIF / **2.800 € en 3 cuotas** · Socio 3.500 € + 15 %)»

**Dice B** — [SOP §Módulo 1, Día 5 · Bloque 3]:

> «Crea los enlaces de pago Stripe: PIF 2.500 €, **Cuotas 3×933,33 €**, Socio 3.500 €.»

3 × 933,33 € = **2.799,99 €**. Faltan 0,01 €.

**Por qué importa:** trivial en euros, no trivial en el cierre. El SOP obliga a un mínimo de 1.200 € a la firma («mínimo 1.200 € a la firma», [SOP §3.3.4]) y la primera cuota configurada es de 933,33 €. **Esas dos reglas no son compatibles:** un cliente que entra en cuotas por el enlace de Stripe tal como está especificado paga 933,33 € a la firma, es decir, 266,67 € menos que el mínimo innegociable del propio documento. Esta segunda parte es la contradicción de verdad; el céntimo es solo el síntoma que la hace visible.

---

### C-7 · El filtro de presupuesto del formulario excluye tu propio tier alto

**Dice A** — [SOP §3.3.2], pregunta 7 del formulario de aplicación, con regla de descalificación automática asociada:

> «Si en la llamada vemos que encaja, ¿estás en posición de tomar una decisión e **invertir entre 2.000 y 4.000 €** en resolverlo? *(Sí / No / Depende de lo que vea)*»

**Dice B** — [SOP §0.2], el tier Socio:

> «Socio **3.500 € + 15 %**»

**La contradicción:** el tier Socio cuesta 3.500 € **más un 15 % sobre la facturación del primer lanzamiento**. El SOP nunca acota ese 15 % (ver `02-datos-del-negocio.md` §1.4: base de cálculo `NO DICHA`). Con la promesa pública del propio programa — «se pasa de esos dos a cinco mil al mes a un rango de **ocho a quince mil** en noventa días» [SOP §3.2, Fase 1] — el 15 % sobre un lanzamiento dentro de esa horquilla sitúa el coste total del tier Socio **por encima de los 4.000 €** que el formulario presenta como techo.

**Por qué importa:** el prospecto marca "Sí" a un rango de 2.000–4.000 € y en el minuto 35 se le presenta un tier que puede superarlo. El SOP ordena presentar los dos tiers en esa llamada: «Los dos tiers, con el Socio presentado *después* del Programa» [SOP §Módulo 1, Día 1 · Bloque 2].

---

### C-8 · Señales menores (sin resolver, sin inventar)

- **Notion en el stack, sin función.** [SOP §0.2] lo lista entre las herramientas existentes («Stack: ManyChat, Calendly, Stripe, DocuSign, **Notion**, Escala CRM, Make.com»). No vuelve a aparecer en las 2.220 líneas del documento: ni un flujo, ni un bloque, ni un anexo lo usa. No es una contradicción formal; es un activo declarado al que el sistema no asigna trabajo.
- **La página del VSL no tiene herramienta asignada.** El Día 4 · Bloque 3 ordena «Monta la página» con estructura de 5 puntos, pero el stack de §0.2 no incluye ningún constructor de páginas y el documento nunca dice dónde se monta. `NO DICHO EN ESTA FUENTE`.

---

## PARTE B — CONTRADICCIONES BLOQUEADAS (requieren las 3 transcripciones)

> ## 🚫 NO EXTRAÍDAS — FALTAN LAS FUENTES 1, 2 Y 3

Estos son los cuatro cruces que pediste explícitamente. Ninguno se puede hacer con una sola fuente. Dejo anotado **el lado del SOP ya extraído y citado**, para que el cruce sea inmediato en cuanto aparezcan los `.txt`:

| Cruce pedido | Lado SOP (extraído y verificado) | Lado llamada |
|---|---|---|
| **Precio de tu oferta: llamada vs SOP** | 2.500 € PIF / 2.800 € en 3 cuotas / Socio 3.500 € + 15 % · mínimo 1.200 € a la firma · «Nunca se baja el precio» [SOP §0.2, §3.3.4, §Anexo C.3] | 🚫 BLOQUEADO |
| **Publicidad: Anexo A vs 3ª llamada** | «en este sprint, **retargeting sí, frío no**» · «Tráfico frío puro a un lead magnet ❌ NO (hoy)» · presupuesto 15 €/día, techo 25 €/día · umbral de frío = 3 condiciones simultáneas [SOP §A.1, §A.2, §A.5] | 🚫 BLOQUEADO |
| **Clientes, facturación y equipo entre llamadas** | Sin contraparte: el SOP **excluye a propósito** facturación y cartera («Se ignora deliberadamente la facturación actual, la cartera activa» [SOP §0.2]) y no nombra a nadie del equipo salvo a ti | 🚫 BLOQUEADO |
| **Precios que cada candidato da dos veces** | No aplica al SOP | 🚫 BLOQUEADO |

**Advertencia para el cruce del equipo:** el SOP **no menciona a ningún socio de tu negocio**. Las 4 apariciones de la palabra "Socio" son el nombre de un tier de precio. Si en las llamadas se habla de "el socio" como persona, esa afirmación no tiene absolutamente ningún respaldo en la fuente 4 — y `04-solapamientos.md` pide una columna entera para él.
