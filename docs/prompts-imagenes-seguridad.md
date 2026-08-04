# Prompts de imagen — "Lo que te lastima no es la caldera"

Cuatro imágenes para la guía de seguridad de `/criterio`. Generalas y dejá los
archivos donde te quede cómodo; yo recorto, optimizo, verifico y escribo los
créditos.

⚠ **El radiador es de ALUMINIO POR ELEMENTOS, nunca de fundición.** Corrección de
Edgardo: la fundición no es lo que se instala. En los prompts va descripto como
una fila de elementos verticales unidos entre sí, no como un panel liso de chapa
—que fue el error de la tanda anterior— y no como un radiador antiguo de columnas.

⚠ Relaciones: **la portada en 4:3** y **la OG en 1200×630**. Si el generador saca
todo en 1200×630, la portada me queda 840×630 al recortarla y la tengo que
reescalar.

⚠ Ninguna imagen debe traer marcas, logos ni texto legible.

Destino final: `public/images/criterio/`.

---

## 1. Portada — el peso · `seguridad-portada-radiador.jpg` (4:3)

> Documentary photograph inside an unfinished single-family house, bare plaster
> walls and rough concrete floor, daylight from a large unglazed window opening.
> A heating installer in work clothes and safety boots is lifting a white
> sectional aluminium radiator into place against the wall. The radiator is made
> of a row of joined vertical fin elements, not a flat panel. He holds it
> awkwardly against his chest with both arms because it has no handles anywhere;
> his back is bent and his weight is forward. Tools, a coil of red heating pipe
> and a stepladder are visible around him on the floor. Natural cool daylight,
> dust in the air, realistic and unglamorous. Candid, unposed, photojournalistic.
> 35mm. No brand names, no logos, no legible text anywhere in the frame.

**Por qué así:** la tesis del artículo es que lo que lastima no es el equipo sino
el camino hasta el equipo. Tiene que verse la incomodidad —**sin agarre, contra
el pecho, espalda doblada**—, que es literalmente lo que describe la norma de
ergonomía. No un obrero posando.

---

## 2. Las rodillas · `seguridad-rodillas.jpg`

> Low-angle documentary close-up in an unfinished room. A heating installer
> kneeling on a radiant-floor insulation panel, fixing a coil of red-orange
> flexible plastic heating pipe to the panel with his hands. Sharp focus on his
> knees pressed into the panel and on his hands working the pipe; his face out of
> frame or turned away. Long loops of pipe running away across the floor into the
> background. Cool natural daylight from the side. Realistic, gritty, no gloss.
> 35mm. No brand names, no logos, no legible text anywhere in the frame.

**Por qué así:** es la lesión más segura del rubro y la que no tiene fecha. El
foco va en **las rodillas apoyadas**, no en la prolijidad del serpentín. Y la fuga
de caño hacia el fondo cuenta sola cuántas horas son.

---

## 3. La escalera · `seguridad-escalera.jpg`

> Documentary photograph in an unfinished house interior. A heating installer
> standing on the upper steps of an aluminium stepladder, both arms raised above
> his shoulders working on a pipe run near the ceiling, body slightly twisted to
> reach. The ladder stands on an uneven rough concrete floor with debris and an
> extension cord nearby. Seen from a few metres back so the whole ladder and the
> floor around its feet are visible. Cool daylight, plain plaster walls. Candid,
> unposed, photojournalistic. 35mm. No brand names, no logos, no legible text
> anywhere in the frame.

**Por qué así:** el artículo dice dos cosas de la escalera y las dos tienen que
verse: que **el apoyo de abajo importa tanto como el de arriba**, y que una
escalera no es un puesto de trabajo. Por eso hay que ver los pies de la escalera
y el piso irregular, no solo al tipo arriba.

---

## 4. OG para WhatsApp · `og-seguridad-radiador.jpg` (1200×630)

> Wide documentary photograph, horizontal composition, inside an unfinished
> single-family house. A heating installer carrying a white sectional aluminium
> radiator —a row of joined vertical fin elements, not a flat panel— across a
> rough concrete floor, small in the frame, with bare plaster walls, a stepladder,
> a coil of red heating pipe and scattered tools around him. Cool natural daylight
> from a large window opening, dust in the air. Cinematic, candid,
> photojournalistic. No brand names, no logos, no legible text anywhere in the
> frame.

**Por qué aparte:** el recorte 4:3 de la portada y el 1200×630 de la tarjeta de
WhatsApp no coinciden. Con la misma imagen, en el teléfono se ve un encuadre
distinto del que elegimos.

---

## Cuando estén

1. Recorto y optimizo (`ffmpeg -q:v 6`), dejo en `public/images/criterio/` y
   escribo los créditos.
2. Meto las dos figuras del cuerpo en el Markdown: `.figura-par` para las
   rodillas y `.figura-ancha` para la escalera.
3. Saco `borrador: true` del frontmatter.
4. Build + check, verificación en desktop 1440 y mobile 390 con Playwright, push,
   y verificación en producción: 200, `content-type: image/jpeg` en las tres
   imágenes, y OG con el UA de `facebookexternalhit`.
