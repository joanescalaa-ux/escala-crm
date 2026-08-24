# 02 · DATOS DEL NEGOCIO

> **EXTRACCIÓN PARCIAL — 1 de 4 fuentes disponibles.**
> Este archivo debía cruzar las 4 fuentes. Solo ha estado disponible la **fuente 4**.
> Las tres transcripciones (`WhatsApp Audio 20260824 at 15.50.08.txt`, `15.50.14.txt`, `17.22.48.txt`) no existen en la carpeta, ni en el repositorio, ni en Google Drive. Ver `00-FUENTES-QUE-FALTAN.md`.
>
> **Fuente utilizada:** Google Doc `SOP_Sprint_14_Dias_Escala.md`, versión **v1.1**, ID `1RxXR1z3E8VMc2nJXbyigFlnRck9fFJnWHJStvePhoWo`, modificado 24/08/2026 17:36. Es la más reciente de las **tres copias** con ese mismo nombre que hay en tu Drive (las otras dos: v1.0 del 18/08 y v1.1 del 19/08).
> A partir de aquí, `[SOP §x]` = sección de ese documento.
>
> **Regla aplicada:** nada de redondeos, nada de rellenar huecos. Lo que no está dicho en la fuente aparece como `NO DICHO EN ESTA FUENTE`.
> **Advertencia de lectura:** casi todas las cifras del SOP son **objetivos de diseño**, no datos observados. Están marcadas como `[TARGET]`. Ninguna cifra de este archivo describe tu negocio tal y como está hoy.

---

## 1. FACTURACIÓN, MÁRGENES, CLIENTES ACTIVOS, TICKET, ESTRUCTURA DE PAGO

### 1.1 Facturación actual · `NO DICHO EN ESTA FUENTE` — y excluida a propósito

El SOP **se niega explícitamente** a registrar tu facturación actual:

> «Se ignora deliberadamente la facturación actual, la cartera activa y cualquier cliente que no esté al corriente. El sprint se diseña como si arrancaras **hoy, desde cero, con activos existentes pero sin sistema**.» [SOP §0.2]

Consecuencia: **no hay ni una cifra de facturación real tuya en toda la fuente 4.** Cualquier número de facturación que aparezca en las tres llamadas no tiene contraparte en el SOP con la que cruzarse.

### 1.2 Márgenes · `NO DICHO EN ESTA FUENTE`
No aparece la palabra margen, ni coste por cliente, ni coste de entrega, en ningún punto del documento.

### 1.3 Número de clientes activos · `NO DICHO EN ESTA FUENTE`
La única mención a la cartera es la exclusión de §0.2 citada arriba. Existe una afirmación cualitativa sin número:

> «todos mis clientes están documentados en un sistema propio, con su progreso real, actualizado en tiempo real.» [SOP §3.2, guion del VSL, Fase 4]

Nótese que esa frase es **copy de un guion de venta**, no un registro operativo.

### 1.4 Ticket y tiers

| Tier | Precio | Cita |
|---|---|---|
| Programa (PIF) | **2.500 €** | «Oferta definida (Punta de Lanza, 5 fases) y precio (Programa 2.500 € PIF / 2.800 € en 3 cuotas · Socio 3.500 € + 15 %)» [SOP §0.2] |
| Programa (3 cuotas) | **2.800 €** | ídem |
| Socio | **3.500 € + 15 %** | ídem |

Enlaces de cobro a crear:

> «Crea los enlaces de pago Stripe: PIF 2.500 €, Cuotas 3×933,33 €, Socio 3.500 €.» [SOP §Módulo 1, Día 5 · Bloque 3]

- 3 × 933,33 € = **2.799,99 €**, no 2.800 €. Diferencia de 0,01 €. Lo dejo anotado sin corregir, tal cual está en la fuente.
- El SOP **no dice** sobre qué base se calcula el 15 % del tier Socio, ni cuándo se cobra. `NO DICHO EN ESTA FUENTE`.

### 1.5 Estructura de pago

> «Stripe: enlace enviado y pago ejecutado EN LA LLAMADA (mínimo 1.200 € a la firma)» [SOP §3.3.4]

> «Cash recogido en el sprint | 7.500 € PIF (o 3.600 € si todo va a cuotas) | Mínimo 1.200 € a la firma» [SOP §0.3] `[TARGET]`

> «**Nunca se baja el precio.** Las cuotas cuestan más que el pago único; esa diferencia es el interés, no un castigo. El descuento convierte tu precio en algo arbitrario y tu marca en algo negociable.» [SOP §Anexo C, regla 3]

Orden de cierre innegociable:

> «1. Stripe: enlace enviado y pago ejecutado EN LA LLAMADA (mínimo 1.200 € a la firma) / 2. DocuSign: contrato enviado inmediatamente después, firmado en 24 h / 3. Escala CRM: alta del cliente con origen de atribución registrado (definitivo, inalterable) / 4. Acceso al contenido: SOLO tras 1 y 2 completados / 5. Llamada de onboarding de 60 min agendada en las 72 h siguientes» [SOP §3.3.4]

> «**Sin Stripe y sin DocuSign no hay acceso al contenido.** Ni un módulo, ni un PDF, ni "te voy adelantando algo".» [SOP §Anexo C, regla 4]

### 1.6 Garantía (compromiso económico contingente)

> «si aplicas el sistema completo y en noventa días no consigues tu primer lanzamiento rentable, seguimos trabajando contigo gratis hasta que lo consigas.» [SOP §3.2, Fase 5]

> «'Aplicas el sistema completo' significa tres cosas concretas y comprobables: has visto el cien por cien de los módulos, has publicado tres piezas de contenido a la semana, y has entregado todos los entregables.» [SOP §3.2, Fase 5]

El SOP **no cuantifica** el coste ni el límite temporal de ese "gratis hasta que lo consigas". `NO DICHO EN ESTA FUENTE`.

---

## 2. COMPOSICIÓN DEL EQUIPO Y QUÉ HACE CADA UNO

> **Aviso de lectura obligatorio:** el SOP **no nombra a ninguna persona del equipo salvo a ti**. Describe **funciones**, no personas contratadas. No hay ni un nombre, ni una tarifa de equipo, ni un contrato.

### 2.1 Joan
Funciones asignadas nominalmente en el reparto de responsables [SOP §3.3.1]:

| Paso | Responsable según el SOP |
|---|---|
| Secuencia post-booking | «Auto + Joan» |
| Llamada de diagnóstico 45 min | «Joan» |
| Cierre: Stripe → DocuSign → CRM | «Joan» |

Más el toque manual que el propio documento prohíbe automatizar:

> «**T+24 h (manual, DM personal de Joan):** una línea humana, sin venta, con una pregunta concreta sobre lo que escribió en la aplicación.» [SOP §Módulo 1, Día 5 · Bloque 2]

> «Recuerda: **el toque 2 no se automatiza nunca**, es el único que se nota si es plantilla.» [SOP §Módulo 1, Día 5 · Bloque 2]

Carga de trabajo prevista para ti:

> «4,5 horas de trabajo profundo al día distribuidas en 3 bloques de 90 minutos.» [SOP §0.1]

Y la lista explícita de lo que el documento dice que **no puede hacer nadie más que tú** [SOP §0.7, "Lo que solo puedes hacer tú"]: rellenar los corchetes del VSL y los reels; grabar el VSL, el vídeo del lead magnet, los 12 reels y los 2 YouTube; configurar ManyChat, Calendly, Stripe, DocuSign, Make.com y la página del VSL; montar audiencias y campaña en Meta; rellenar los 100 perfiles de outbound; y «Todo el Bloque 3 de los días 8 al 14 | Es hablar con personas».

### 2.2 Setter — función definida, persona `NO DICHA`
Existe un rol completo (Módulo 4 entero, 8 páginas de SOP propio), pero **no hay ninguna persona asignada**. El día 9 se titula «RITMO Y **RECLUTAMIENTO** DE SETTER» [SOP §Módulo 1, Día 9], es decir: a fecha del documento, el setter no existe todavía.

Estructura de pago del setter:

> «Regla económica innegociable: **el Setter cobra por llamada presentada, nunca por llamada agendada.** Esto elimina el incentivo a inflar agenda con no-shows.» [SOP §Módulo 1, Día 9 · Bloque 1]

> «**Cómo cobras:** por **llamada presentada**, no por llamada agendada. Si agendas diez y se presentan dos, cobras dos.» [SOP §4.0]

**Importe de esa comisión: `NO DICHO EN ESTA FUENTE`.** El SOP define la base de cálculo pero nunca el precio por llamada presentada.

Onboarding previsto: sesión de 90 minutos con cuatro tramos (0–20 contexto, 20–50 flujos, 50–75 roleplay, 75–90 accesos) [SOP §Módulo 1, Día 9 · Bloque 1].

### 2.3 Dirección creativa / edición — función mencionada, persona `NO DICHA`
Aparece únicamente como destinatario de un brief ya escrito:

> «12\_Brief\_Edicion.md — especificaciones técnicas, paleta, reglas de subtitulado, prohibiciones y criterio de aceptación. **Listo para enviar a dirección creativa sin tocar nada.**» [SOP §Módulo 1, Día 6 · Bloque 3]

> «12\_Brief\_Edicion.md | Enviar a dirección creativa junto con los brutos» [SOP §Anexo D]

Contenido del brief, tal como lo resume el SOP:

> «estilo de subtítulo, palabra clave resaltada en amarillo \#F5D800, corte seco en los primeros 3 segundos, sin música por encima de -18 dB.» [SOP §Módulo 1, Día 6 · Bloque 3]

**Ni tarifa, ni nombre, ni volumen contratado.** `NO DICHO EN ESTA FUENTE`.

### 2.4 Socio · `NO DICHO EN ESTA FUENTE` — y trampa de lectura

**El SOP no menciona en ningún momento a un socio de tu negocio.** Cero apariciones.

⚠️ La palabra "Socio" aparece 4 veces en el documento, y **las 4 son el nombre de un tier de precio** («Socio 3.500 € + 15 %»), no una persona. No se pueden confundir al cruzar con las llamadas: si en las transcripciones alguien habla de "el socio", eso **no tiene ningún respaldo en la fuente 4**.

### 2.5 Resumen del equipo según la fuente 4

| Función | Persona asignada | Coste |
|---|---|---|
| Contenido, grabación, config, llamadas, cierre | Joan | — |
| Setting / cualificación en DM | Ninguna (a reclutar el D9) | Por llamada presentada · **importe NO DICHO** |
| Dirección creativa / edición | Ninguna (solo existe el brief) | `NO DICHO` |
| Socio | **No existe en esta fuente** | — |

---

## 3. VOLUMEN DEL EMBUDO

> ⚠️ **Todo lo de esta sección es `[TARGET]`.** El SOP no contiene ni un solo dato de embudo observado. Son los números que el sistema debe producir, no los que produce.

### 3.1 Objetivo numérico del sprint [SOP §0.3]

| Variable | Target sprint (14 días) | Origen que da el SOP |
|---|---|---|
| DMs outbound enviados | 300 (25/día × 12 días activos) | «Bloque diario fijo» |
| Tasa de respuesta outbound | 25–30 % | «Personalización 1:1, no plantilla» |
| Conversaciones vivas | 75–90 | — |
| Keywords ManyChat (inbound) | 60–100 | «Reels + stories + retargeting» |
| Llamadas agendadas | 16–20 | «~20 % de conversaciones vivas» |
| Llamadas presentadas (show) | 10–13 | «65 % show rate con secuencia post-booking» |
| Cierres | 3 | «25–30 % de presentadas» |
| Cash recogido | 7.500 € PIF (o 3.600 € en cuotas) | «Mínimo 1.200 € a la firma» |

Métrica única de control:

> «**Métrica de control diario (la única que importa):** *conversaciones nuevas iniciadas hoy*. Si ese número cae bajo 25, el sistema muere aunque el resto esté perfecto.» [SOP §0.3]

### 3.2 DMs al día
**25/día**, en el Bloque 3, días 8 a 14: «25 DMs enviados y registrados» [SOP §Módulo 1, Día 8 · Bloque 3] y repetido en la tabla de control [SOP §1.15].

Objetivo diario del setter:

> «**Objetivo diario:** 25 conversaciones nuevas · mínimo 6 respuestas · mínimo 2 cualificaciones completas.» [SOP §4.6]

### 3.3 Los 9 números de control [SOP §Anexo B]

| Métrica | Frecuencia | Objetivo |
|---|---|---|
| Conversaciones nuevas abiertas | Diaria | ≥ 25 |
| Tasa de respuesta a DM | Diaria | ≥ 25 % |
| Keywords ManyChat recibidas | Diaria | ≥ 4 |
| Cualificaciones completas | Diaria | ≥ 2 |
| VSLs enviados | Diaria | ≥ 2 |
| Llamadas agendadas | Semanal | ≥ 8 |
| Show rate | Semanal | ≥ 65 % |
| Tasa de cierre | Semanal | ≥ 25 % |
| Cash recogido | Semanal | ≥ 2.500 € |

### 3.4 Seguidores y vistas propias · `NO DICHO EN ESTA FUENTE`

El SOP **no da tu número de seguidores, ni tus visualizaciones, ni tu engagement**. Solo afirma cualitativamente que existen:

> «Cuenta de Instagram con audiencia orgánica y engagement real.» [SOP §0.2]

Handle, sí: **@joanescala\_**

> «La auditoría de las 6 fugas → escribe DIAGNÓSTICO por DM en @joanescala\_» [SOP §2.1.3]

⚠️ Dos cifras de seguidores que aparecen en el documento **no son tuyas** y no deben cruzarse como si lo fueran:
- «cuentas de cuarenta mil seguidores facturando mil euros al mes, y cuentas de mil doscientos seguidores facturando doce mil» [SOP §3.2, Fase 2] — es un argumento de venta sobre terceros.
- «Tiene entre 1.000 y 30.000 seguidores» [SOP §Módulo 1, Día 8 · Bloque 2] — es el filtro de entrada a la lista de outbound, describe a tus prospectos.

### 3.5 Capacidad de agenda

> «Calendly: evento de 45 min, buffer de 15, **máximo 4 slots/día**, ventana de 3 días vista, confirmación con enlace de Google Meet.» [SOP §Módulo 1, Día 4 · Bloque 3]

### 3.6 Frecuencia de contenido comprometida

> «**Frecuencia mínima del sistema:** 3 reels/semana · 1 YouTube/semana · stories diarias (5–7 al día) · 2 CTAs duros por semana en stories.» [SOP §2.0]

---

## 4. HERRAMIENTAS Y SISTEMAS

### 4.1 Los que el SOP dice que YA TIENES

> «Stack: ManyChat, Calendly, Stripe, DocuSign, Notion, Escala CRM, Make.com.» [SOP §0.2]

> «Capacidad de grabar vídeo (móvil + micrófono + luz).» [SOP §0.2]

Nota: **Notion aparece una sola vez en todo el documento**, en esa lista. No se le asigna ninguna función en ningún flujo, bloque o anexo.

### 4.2 Los que el SOP dice que NO TIENES

> «Activos que NO se dan por existentes y se construyen en el sprint: Lead magnet real. VSL de conversión. Página de VSL con formulario de aplicación. Secuencia post-booking automatizada. Batch de contenido de 14 días. SOP de Setter operativo. Infraestructura de retargeting en Meta.» [SOP §0.2]

⚠️ Esta lista **se contradice con §0.7 dentro del mismo documento**. Ver `03-contradicciones.md`, entrada C-1.

### 4.3 Herramientas que el SOP da por necesarias sin listarlas en el stack
- **Meta Business Manager + cuenta publicitaria + método de pago**: «Verifica el Business Manager, la cuenta publicitaria y el método de pago.» [SOP §Módulo 1, Día 7 · Bloque 3]
- **Gmail**, como destino de alertas: «**Notificación a Joan (Make.com → Gmail):** cada nueva keyword recibida genera una alerta con el handle del prospecto.» [SOP §4.7]
- **Google Meet**: [SOP §Módulo 1, Día 4 · Bloque 3] y §3.3.1.
- **Teleprompter**: «carga el guion en teleprompter» [SOP §Módulo 1, Día 3 · Bloque 3].
- **Página de VSL**: el SOP nunca dice sobre qué herramienta se monta. `NO DICHO EN ESTA FUENTE`.

---

## 5. OBJETIVOS DE FACTURACIÓN Y PLAZOS

> ⚠️ Hay que separar **dos cosas que el SOP mezcla**: lo que prometes al cliente y lo que persigues tú.

### 5.1 Promesa AL CLIENTE (no es tu objetivo de facturación)

> «Te voy a explicar cómo se pasa de esos dos a cinco mil al mes a un rango de **ocho a quince mil en noventa días**. Sin llamadas semanales interminables. Sin depender de anuncios. Y sin publicar el triple de contenido del que ya publicas.» [SOP §3.2, Fase 1]

> «¿el resultado prometido (8–15 k€/mes) es el que el ICP realmente quiere, o es el que tú crees que quiere?» [SOP §Módulo 1, Día 1 · Bloque 1]

### 5.2 Objetivo TUYO — solo existe a nivel de sprint

> «El objetivo es **cerrar 3 contratos del tier Programa** en los 14 días, y dejar instalado un sistema que produzca ese resultado de forma repetible cada 14 días sin trabajo adicional de construcción.» [SOP §0.3]

- Cash del sprint: **7.500 € PIF / 3.600 € si todo va a cuotas** [SOP §0.3]
- Cash semanal: **≥ 2.500 €** [SOP §Anexo B]

**No hay ningún objetivo de facturación mensual ni anual tuyo en toda la fuente 4.** `NO DICHO EN ESTA FUENTE`.

### 5.3 Plazos

| Plazo | Cita |
|---|---|
| 14 días naturales, el sprint completo | «ejecutado en 14 días naturales» [SOP §0.1] |
| El sistema se repite cada 14 días | «de forma repetible cada 14 días» [SOP §0.3] |
| Bloque 3 innegociable a partir del D8 | «A partir del Día 8, el Bloque 3 se vuelve **innegociable e intocable**» [SOP §0.4] |
| Onboarding de cliente | «Llamada de onboarding de 60 min agendada en las 72 h siguientes» [SOP §3.3.4] |
| Contrato firmado | «DocuSign: contrato enviado inmediatamente después, firmado en 24 h» [SOP §3.3.4] |
| Umbral para activar webinar | «más de 40 llamadas presentadas al mes» de forma sostenida [SOP §3.1] |
| Umbral para activar tráfico frío | 3 condiciones a la vez: «Más de 12 llamadas presentadas al mes de forma sostenida durante 2 meses consecutivos», «Tasa de cierre estable por encima del 25 %», «Al menos 3 casos documentados con permiso escrito y resultados verificables» [SOP §A.5] |

---

## 6. PRESUPUESTO DISPONIBLE PARA PUBLICIDAD

> ⚠️ Esta sección es el **ancla directa** para cruzar con la tercera llamada (consultor de growth). El SOP fija tanto el importe como la doctrina.

### 6.1 Importe

> «Presupuesto: **5 € por conjunto = 15 €/día**» [SOP §A.2]

> «Monta una campaña de objetivo **Mensajes**, con 3 conjuntos de anuncios (14d, 30d, 90d), ubicación manual **solo Stories de Instagram**, presupuesto 5 € por conjunto (15 €/día total).» [SOP §Módulo 1, Día 7 · Bloque 3]

Escalado condicionado:

> «si el coste por conversación iniciada está por debajo de 6 €, sube a 25 €/día.» [SOP §Módulo 1, Día 13 · Bloque 3]

**Techo máximo mencionado en toda la fuente: 25 €/día.** No hay ninguna otra cifra de presupuesto publicitario en el documento. `NO DICHO` cualquier presupuesto superior.

### 6.2 Doctrina: retargeting SÍ, frío NO

> «**Veredicto:** en este sprint, **retargeting sí, frío no**. Y el retargeting no es una estrategia de crecimiento, es **una red de seguridad**: recoge a la gente que interactuó contigo y a la que el setting no llegó a tiempo.» [SOP §A.1, cierre de sección]

Tabla de compatibilidad [SOP §A.1]:

| Tipo de ads | ¿Compatible? | Razón que da el SOP |
|---|---|---|
| Retargeting sobre engagers de tu propia cuenta | ✅ SÍ | «Estás reactivando a gente que ya llegó orgánicamente.» |
| Retargeting a visitantes de la página del VSL | ✅ SÍ | «Mismo principio.» |
| Lookalike sobre compradores | ⚠️ ZONA GRIS | «Ya es captación en frío. Exige reescribir la promesa pública antes de activarlo.» |
| Tráfico frío puro a un lead magnet | ❌ NO (hoy) | «Contradice frontalmente la promesa.» |

El riesgo, declarado por el propio documento:

> «Si en algún momento pasas a *cold traffic* para captar leads que nunca te conocieron, la promesa se vuelve frágil y hay que reescribirla públicamente antes, no después.» [SOP §0.6]

### 6.3 Ritmo

> «el retargeting no se deja encendido de forma permanente. Se activa **en ciclos de 7–10 días cada 4–6 semanas**, preferentemente en la última semana del mes» [SOP §A.4]

---

## 7. COMPROMISOS VERBALES ASUMIDOS EN LAS LLAMADAS

> ## 🚫 BLOQUEADO — REQUIERE LAS 3 TRANSCRIPCIONES
>
> La fuente 4 es un documento operativo, no una conversación. **No contiene ni un solo compromiso verbal.** Esta sección no se puede rellenar ni parcialmente hasta que aparezcan los tres `.txt`.
>
> No he inventado nada aquí, y no he sustituido las transcripciones por el resumen `26_Resumenes_Llamadas.md` que tienes en Drive: ese documento ya viene condensado y parafraseado, y no permite cumplir la regla de cita literal que pediste.

---

## 8. ANEXO — REGLAS DURAS QUE LA FUENTE 4 IMPONE

Las incluyo porque son restricciones económicas y operativas tuyas, y porque varias van a chocar con lo que te propongan en las llamadas.

### 8.1 Las 7 reglas que no se rompen [SOP §Anexo C]

1. «**El bloque 3 es sagrado.** Es el único que produce dinero.»
2. «**Nadie entra a llamada sin ver el VSL.** Sin excepción, sin "es que este tiene prisa".»
3. «**Nunca se baja el precio.**»
4. «**Sin Stripe y sin DocuSign no hay acceso al contenido.**»
5. «**El Setter cobra por llamada presentada.** Nunca por agendada.»
6. «**Todo número publicado es real y verificable.** Sin permiso escrito no aparece ningún cliente. Sin dato comprobable, se corta la frase.»
7. «**Se mide en conversaciones y cierres, nunca en visualizaciones.** Un mes con 300.000 visualizaciones y 0 cierres es un mes fallido.»

### 8.2 Prohibiciones estructurales del embudo [SOP §0.5]

- «Ningún reel envía a "link en bio". Todo va a DM con keyword.»
- «Nadie entra a llamada sin haber visto el VSL. Sin excepción. El VSL hace el 70 % de la venta.»
- «Ningún acceso a contenido antes de Stripe + DocuSign completados.»
- «Nunca se publica precio en contenido. El precio vive en la llamada, con Offer Sheet.»

### 8.3 ICP declarado

> «coaches, mentores o creadores de infoproducto hispanohablantes, con al menos 6 meses en el mercado, que ya han cobrado a alguien, que facturan aproximadamente entre 2.000 y 5.000 € al mes, y que están estancados en ese rango.» [SOP §4.0]

### 8.4 Umbral de descalificación automática

> «si en la pregunta 3 marca "Menos de 1.000 €" **y** en la 7 marca "No", la cita se cancela con un mensaje honesto y se le deriva al contenido gratuito.» [SOP §3.3.2]

Pregunta 7 del formulario, literal:

> «Si en la llamada vemos que encaja, ¿estás en posición de tomar una decisión e invertir entre 2.000 y 4.000 € en resolverlo? *(Sí / No / Depende de lo que vea)*» [SOP §3.3.2]
