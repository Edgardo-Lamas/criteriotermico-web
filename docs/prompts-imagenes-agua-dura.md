# Prompts de imágenes — nota "El agua era potable y le tapaba las calderas al barrio entero"

**Estado: ✅ HECHAS (2026-08-11).** Edgardo generó la portada en Antigravity con el
prompt de abajo y salió al primer intento. Origen: `~/Desktop/intercambiador.png`
—JPEG con extensión `.png`, 1024×1024, las cuatro esquinas limpias, sin marca de
agua—. Portada: recorte `crop=1024:768:0:180` reescalado a 1200×900. OG: recorte
`crop=1024:537:0:282` reescalado a 1200×630, las dos con `-q:v 4` y baseline
confirmado con `file`. **No se generó la segunda imagen del cuerpo: los tres
esquemas alcanzan.**

| Archivo | Medida | Dónde va |
| --- | --- | --- |
| `agua-dura-portada.jpg` | 1200 × 900 | Portada y tarjeta del feed |
| `og-agua-dura.jpg` | 1200 × 630 | Tarjeta de WhatsApp (no se ve en la página) |

⚠ **La OG no se genera aparte: sale de un recorte cerrado de la portada**, siempre
que el motivo se lea bien en chico. Nos ahorra una generación.

⚠ **Una sola generación a propósito.** La nota lleva **tres esquemas dibujados** que
son los que explican; sumar fotos les saca peso. Si querés una segunda, la opción
está al final de este archivo.

⚠ **Revisar las cuatro esquinas antes de mandarla:** las salidas de Antigravity
suelen traer una marca de agua "Ai" arriba a la izquierda, que se resuelve recortando
70 px de la izquierda y 60 px de arriba. **Nada importante puede quedar pegado a los
bordes.**

⚠ **Sin texto, sin etiquetas, sin logos, sin marcas.** El modelo intenta escribir
sobre cualquier superficie plana: revisar la pieza, el banco y la pared del fondo.

⚠ **El sarro es un depósito, no una costra teatral.** Si se pide "muy incrustado",
"cubierto de sarro" o "totalmente tapado", el modelo dibuja algo que parece una roca
y deja de leerse como una pieza de caldera. Va **blanco calcáreo, poroso, seco,
concentrado en las bocas y en los bordes de las placas**.

---

## 1. Portada — `agua-dura-portada.jpg`

Formato final en el sitio: **4:3 (1200 × 900)**. Si la salida viene 1200 × 630 la
recorto y reescalo yo; cuanto más cuadrada salga, menos se pierde.

**Qué tiene que contar, y es la nota entera en una imagen:** el agua se ve
impecable y aun así destruyó la pieza. No alcanza con mostrar el intercambiador
sucio: lo que hace el punto es el **contraste** entre el agua limpia y el daño que
esa misma agua produjo.

> Fotografía de primer plano sobre un banco de trabajo de taller, luz lateral suave
> de ventana. En el centro, un intercambiador de calor de placas de acero inoxidable
> desmontado de una caldera mural: una pieza rectangular compacta, de unos veinte
> centímetros, formada por muchas placas metálicas finas apiladas y soldadas entre
> sí, con cuatro conexiones roscadas circulares, dos arriba y dos abajo. Las bocas de
> las conexiones y los bordes de las placas están tomados por un depósito mineral
> blanco grisáceo, seco y poroso, que se acumula en los huecos y contrasta con el
> acero limpio del resto de la pieza. Apoyado junto a ella, a un costado, un vaso de
> vidrio liso lleno de agua perfectamente transparente y limpia, sin burbujas ni
> turbiedad, que capta la luz. El fondo es la superficie del banco, de madera gastada
> y neutra, desenfocado suavemente. Fotografía realista, nitidez alta sobre la pieza,
> profundidad de campo corta, sin ningún texto, etiqueta, logotipo ni marca visible,
> sin personas.

**Opción B, si la primera sale confusa.** Más simple y más segura: sin el vaso, la
pieza sola y más cerca.

> Primerísimo plano de un intercambiador de calor de placas de acero inoxidable
> desmontado de una caldera, sostenido en posición vertical sobre un banco de trabajo
> de taller. Se ven con nitidez los cantos de las placas metálicas apiladas y una de
> las conexiones roscadas, cuyo interior está obstruido por un depósito mineral
> blanco grisáceo, seco y poroso. El resto del acero conserva su brillo. Luz lateral
> suave, fondo neutro desenfocado, fotografía realista de detalle técnico, sin
> texto, sin etiquetas, sin logotipos y sin personas.

---

## 2. OG — `og-agua-dura.jpg`

**No se genera.** Es un recorte de 1200 × 630 de la portada, cerrado sobre la pieza y
el depósito blanco, que es lo que se tiene que leer en una tarjeta de WhatsApp de
pocos centímetros. Lo hago yo con `ffmpeg`.

⚠ Verificar que salga **baseline** y no progressive: WhatsApp no decodifica los JPEG
progressive y la vista previa queda vacía. El encoder de `ffmpeg` da baseline por
defecto; se confirma con `file`.

---

## 3. Opcional — segunda imagen para el cuerpo

Si Edgardo la quiere, va en la sección de los filtros, en `.figura-par`, y hay que
agregarle el hueco al Markdown. Medida **900 × 900**.

> Fotografía de un filtro dosificador de polifosfatos instalado sobre la cañería de
> entrada de agua fría, en la pared de un lavadero doméstico prolijo. El equipo es un
> cuerpo cilíndrico transparente con una tapa de plástico blanco y conexiones
> metálicas a la cañería de ambos lados; adentro se ven cristales blancos. Instalación
> limpia y bien hecha, cañería alineada, pared clara. Luz natural, fotografía
> realista, sin ningún texto, etiqueta, logotipo ni marca visible, sin personas.
