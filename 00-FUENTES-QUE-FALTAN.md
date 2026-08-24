# 00 · ESTADO DE LAS FUENTES

Extracción del **24/08/2026**. Las 4 fuentes están disponibles. **Una tiene un problema serio.**

| # | Fuente | Estado | Tamaño |
|---|---|---|---|
| 1 | `WhatsApp Audio 20260824 at 15.50.08.txt` — Dante + ingeniero de IA | ✅ Completa | 27.914 B |
| 2 | `WhatsApp Audio 20260824 at 15.50.14.txt` — Daniel | ✅ Completa | 10.986 B |
| 3 | `WhatsApp Audio 20260824 at 17.22.48.txt` — consultor de growth | 🔴 **CORTADA** | 24.030 B |
| 4 | `SOP_Sprint_14_Dias_Escala.md` (Google Doc, v1.1) | ✅ Completa, 2.220 líneas | 179.833 B |

Todas leídas desde tu Google Drive (`joanescalaa@gmail.com`).

---

## 🔴 Problema 1 — la fuente 3 está cortada a los 30 minutos

El archivo termina con este aviso de TurboScribe:

> *(This file is longer than 30 minutes. Go Unlimited at https://turboscribe.ai/ to transcribe files up to 10 hours long.)*

Y la última frase se interrumpe a media palabra:

> «*he estado con bueno un chico que era el más peculiar de todos **te voy a dejar***»

**Qué falta, con casi total seguridad:** el cierre de la llamada. Es decir, **precio final, condiciones, mes de prueba y siguiente paso** — justo lo que no aparece en su ficha.

**Consecuencia práctica:** la ficha 4 de `01-fichas-candidatos.md` no es comparable con las otras tres. En concreto quedan sin respuesta:
- ¿Acepta mes de prueba remunerado? → `NO PREGUNTADO` en el fragmento disponible.
- ¿Situación fiscal, disponibilidad, horas? → `NO DICHO`.
- ¿Se cerró alguna cifra al final? → desconocido.

**Cómo arreglarlo:** re-transcribir ese audio completo (TurboScribe de pago, o Whisper) y avisarme. Solo hay que rehacer la ficha 4 y revisar `04-solapamientos.md`; el resto no cambia.

---

## 🔴 Problema 2 — faltan 4 de las 8 llamadas del día

Tú mismo lo dices en la fuente 1:

> «*tengo 20 minutos por llamada. **Que tengo 8 llamadas hoy***»
> «***Tengo 3 llamadas con 3 ingenieros de IA**[PA], así decirlo*»

Las transcripciones cubren **4 personas en 3 archivos**. **Faltan 4 llamadas**, de las cuales **2 son de ingenieros de IA** — es decir, los dos competidores directos del único ingeniero que sí está transcrito, y de quien dijiste en su cara que era «*el aplicante más interesante*».

**Esto no invalida nada de lo extraído, pero sí lo limita:** la comparación de `04-solapamientos.md` y las fichas de `01` cubren la mitad de la jornada.

---

## Nota sobre la fuente 4 — cuál he usado

Hay **tres documentos con el mismo nombre** `SOP_Sprint_14_Dias_Escala.md` en tu Drive:

| ID | Versión | Tamaño | Modificado |
|---|---|---|---|
| `1rBDt9L04tlCk5vT6Axl3BtR3VnuuRZZsqhgTZE4sYG8` | v1.0 | 56.705 | 18/08 14:45 |
| `1iCcb86HJpcLbA2qqy8f-DghWydHzBHhDLpoPux-qGTE` | v1.1 | 61.978 | 19/08 00:38 |
| **`1RxXR1z3E8VMc2nJXbyigFlnRck9fFJnWHJStvePhoWo`** | **v1.1** | **179.833** | **24/08 17:36** |

**He usado la tercera** — la más reciente y la única con el índice de activos construidos (§0.7), del que salen varias contradicciones internas. Si la buena era otra, dímelo: `03-contradicciones.md` Parte B cambiaría.

---

## Documento relacionado que existe y NO he usado

`26_Resumenes_Llamadas.md` — dos copias en tu Drive (`18nX16Mg…` 24/08 14:10 y `1WNqxxBg…` 24/08 15:29).

**No lo he usado como fuente** porque es material derivado y su propia cabecera lo dice: «*Recogido de las transcripciones, **condensado** y ordenado por tema. Se han eliminado las intervenciones de Joan*». Habiendo transcripciones completas, usar un resumen sería perder las citas literales, los `[ilegible]` y — sobre todo — **tus propias intervenciones**, que es de donde sale todo `02-datos-del-negocio.md` §7.

**Una discrepancia que sí conviene que sepas:** ese documento etiqueta a **Daniel Suárez como "Director creativo"** y a **Dante Rodríguez** también como "Director creativo". Tú me describiste a Daniel como *estratega de contenido*. **En la transcripción de Daniel nadie dice el nombre del rol**, ni él ni tú. Queda como `NO DICHO` en su ficha.

---

## Calidad de las transcripciones (ASR)

Las tres vienen de TurboScribe y tienen los fallos típicos. **No he corregido ninguno inventando**: donde no se entiende, hay `[ilegible]` con el fragmento literal. Los errores recurrentes que sí he podido resolver por contexto y que marco siempre:

| En el texto | Casi con seguridad | Dónde |
|---|---|---|
| «mi CEO» | mi **socio** | `[F1]` |
| «lo vamos a **impedir**» | lo vamos a **despedir** | `[F1]` |
| «meter **apps**» | meter **ads** | `[F2]` |
| «Cloud» / «CLOUD» | **Claude** | `[F1]`, `[F3]` |
| «reads» | **reels** | `[F1]`, `[F3]` |
| «USL» / «VCL» | **VSL** | `[F2]`, `[F3]` |
| «Superbase» | **Supabase** | `[F1]` |
| «socio minorista» | socio **minoritario** | `[F2]` |

**Turnos de habla mal atribuidos:** los hay, sobre todo en `[F3]`, donde largos tramos vienen sin separación entre el consultor y tú. Cuando la atribución no era segura, lo digo en la cita.

**Dos nombres que el ASR destroza y que quedan sin resolver:** el del ingeniero de IA (aparece como «John» y como «Vivan») y el del consultor de growth (nunca se pronuncia). Ambos `NO DICHO` en sus fichas.
