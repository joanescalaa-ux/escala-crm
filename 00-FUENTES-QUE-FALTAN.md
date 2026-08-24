# 00 · ESTADO DE LAS FUENTES

Fecha de la extracción: **24/08/2026**.

## Resumen

De las 4 fuentes del encargo, **solo 1 estaba disponible**.

| # | Fuente | Estado | Dónde la he buscado |
|---|---|---|---|
| 1 | `WhatsApp Audio 20260824 at 15.50.08.txt` (Dante + ingeniero de IA) | ❌ **NO EXISTE** | Carpeta de trabajo · repositorio `joanescalaa-ux/escala-crm` (todas las ramas y todo el historial) · Google Drive |
| 2 | `WhatsApp Audio 20260824 at 15.50.14.txt` (Daniel) | ❌ **NO EXISTE** | ídem |
| 3 | `WhatsApp Audio 20260824 at 17.22.48.txt` (consultor de growth) | ❌ **NO EXISTE** | ídem |
| 4 | `SOP-Sprint-14-dias.md` | ✅ **ENCONTRADA** en Drive | `SOP_Sprint_14_Dias_Escala.md`, v1.1 |

## Detalle de la búsqueda

**Carpeta de trabajo** (`/home/user/escala-crm`): no contiene ningún `.txt` ni `.md`. Es el repositorio de la app Escala CRM (Next.js) recién clonado: `src/`, `package.json`, `escala-crm-v2.zip` y poco más.

**Repositorio**: revisado el árbol completo de la rama actual y **todo el historial de commits**. Cero archivos `.txt` o `.md` añadidos en ningún momento.

**Google Drive**: buscado por título (`WhatsApp`, `Audio`, `transcri`, `15.50`, `17.22`, `llamada`), por tipo MIME (`audio/*`, `text/plain`) y por archivos recientes. Los únicos `.txt` de tu Drive son dos scripts de Apps Script (`CrearFormulario_Escala.gs.txt` y su v2). No hay ninguna transcripción de audio.

## Fuente 4 — cuál he usado exactamente

En tu Drive hay **tres documentos con el mismo nombre** `SOP_Sprint_14_Dias_Escala.md`:

| ID | Versión | Tamaño | Modificado |
|---|---|---|---|
| `1rBDt9L04tlCk5vT6Axl3BtR3VnuuRZZsqhgTZE4sYG8` | v1.0 | 56.705 | 18/08/2026 14:45 |
| `1iCcb86HJpcLbA2qqy8f-DghWydHzBHhDLpoPux-qGTE` | v1.1 | 61.978 | 19/08/2026 00:38 |
| **`1RxXR1z3E8VMc2nJXbyigFlnRck9fFJnWHJStvePhoWo`** | **v1.1** | **179.833** | **24/08/2026 17:36** |

**He usado la tercera**: es la más reciente, la más extensa y la única que incluye el índice de activos construidos (§0.7). Leída entera: 2.220 líneas.

Si la buena era otra, dímelo y repito la extracción — el resultado de `03-contradicciones.md` cambiaría, porque varias de las contradicciones que he encontrado están precisamente entre §0.2 y §0.7, y §0.7 solo existe en esta versión.

## Documento relacionado que SÍ existe (y que no he usado)

`26_Resumenes_Llamadas.md` — hay **dos copias** en tu Drive (`18nX16Mgp8Q9tM_iFVKTAkXrmyLIgAoOkBeY4IRBrL4g`, 24/08 14:10, y `1WNqxxBgCdstxw7QhZ1Z7yTW7slUWdeakC-vi0FL3KcE`, 24/08 15:29, esta última más larga). Contiene resúmenes de las llamadas del 24 de agosto por candidato.

**No lo he usado como sustituto de las transcripciones**, por tres razones:

1. Su propia cabecera dice que es material derivado: «Recogido de las transcripciones, **condensado** y ordenado por tema. Se han eliminado las intervenciones de Joan y la conversación logística».
2. Pediste citas literales y marcar `[ilegible]`. Un resumen ya ha decidido por ti qué se cita y qué se descarta, y ha limpiado justo los errores de ASR que querías conservar.
3. Ha eliminado tus propias intervenciones — que es exactamente de donde salen los "compromisos verbales que asumí en las llamadas" de `02-datos-del-negocio.md` §7.

Si quieres que tire de él como fuente provisional mientras aparecen los audios, lo hago sin problema, marcando cada dato como *derivado de resumen* y no como cita de transcripción.

## Cómo desbloquear esto

Cualquiera de estas dos vías:

1. **Sube los tres `.txt` a la carpeta del repositorio** y dímelo. Con `git pull` los leo.
2. **Súbelos a Google Drive** (o pásame los enlaces / IDs) y los leo desde ahí.

En cuanto los tenga, completo `01`, la sección 7 de `02`, la Parte B de `03` y las 5 columnas que faltan de `04`. La parte del SOP ya está hecha y no hay que repetirla.
