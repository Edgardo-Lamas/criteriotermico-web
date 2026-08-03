# Prompts de imagen — "El riesgo que corre el que instala"

Cuatro imágenes. Generalas en Antigravity y dejá los archivos en `~/Desktop`;
yo recorto, optimizo, verifico y escribo los créditos.

⚠ Recordatorios del flujo: Antigravity exporta **JPEG con extensión `.png`** y
sale **cuadrado 1024×1024**, así que el recorte lo hago yo. Ninguna imagen debe
traer marcas, logos ni texto legible.

Destino final: `public/images/criterio/`.

---

## 1. Portada — `seguridad-portada.jpg`

> Documentary photograph, cramped residential basement boiler room at night. A
> single heating installer in worn work clothes crouches beside an old
> wall-mounted gas boiler, working with a wrench on copper pipework. The only
> light source is a portable clip-on work lamp hanging from a pipe, throwing
> hard shadows across a low concrete ceiling and bare block walls. Dust motes
> suspended in the beam. Tight, enclosed space, pipes and ducts crossing
> overhead, a narrow doorway behind him. Muted cool palette, deep shadows,
> single warm light source. Candid, unposed, photojournalistic. Shallow depth of
> field, 35mm. No brand names, no logos, no legible text anywhere in the frame.

**Por qué así:** la portada tiene que decir *encierro* y *soledad* antes que
peligro. El artículo entero se apoya en que el instalador está solo del lado de
adentro, y el foco de luz único lo dice sin explicarlo.

---

## 2. El plomo — `seguridad-litargirio.jpg`

> Extreme close-up, documentary style. A tradesman's bare hands, weathered and
> stained, working a thick pale-yellow paste onto the threads of a steel pipe
> fitting with the fingers. The paste is dense and matte, like putty. Worn
> workbench surface below, scattered pipe fittings and a wrench out of focus.
> Warm side light from a window, everything else dim. Photorealistic, high
> detail on skin texture and the paste. 50mm macro. No brand names, no labels,
> no legible text anywhere in the frame.

**Por qué así:** el argumento de la sección es la **mano desnuda**. Tiene que
verse la piel tocando la pasta, no una herramienta aplicándola.

---

## 3. El amianto — `seguridad-amianto.jpg`

> Documentary photograph of an abandoned 1980s boiler room. An old cast-iron
> boiler and the thick white insulation lagging wrapped around its steam pipes,
> cracked and crumbling, some sections broken open exposing fibrous grey
> material underneath. Fine dust on the floor. Cold overcast daylight through a
> small high window, desaturated palette, institutional green and grey walls.
> Still life, no people. Sharp detail on the damaged insulation. 35mm. No brand
> names, no logos, no legible text anywhere in the frame.

**Por qué así:** el punto de la sección es que **el peligro aparece cuando
alguien lo rompe**. La aislación tiene que verse rota, no intacta.

---

## 4. OG para WhatsApp — `og-seguridad.jpg`

Misma escena que la portada pero **encuadre horizontal y más abierto**, para que
el recorte 1200×630 no corte la cabeza:

> Wide documentary photograph, horizontal composition. A heating installer alone
> in a cramped basement boiler room at night, small in the frame, lit only by a
> portable work lamp hanging from a pipe. Low concrete ceiling, bare block
> walls, pipes and ducts crossing overhead, deep shadows filling the sides of
> the frame. Muted cool palette with a single warm light. Cinematic, candid,
> photojournalistic. No brand names, no logos, no legible text anywhere in the
> frame.

**Por qué aparte:** el recorte 4:3 de la portada y el 1200×630 de la tarjeta de
WhatsApp no coinciden. Si se usa la misma, en el teléfono se ve un recorte
distinto del que elegimos.

---

## Cuando estén

1. Yo las recorto y optimizo (`ffmpeg -q:v 6`), las dejo en
   `public/images/criterio/` y escribo los créditos.
2. Saco la línea `borrador: true` del frontmatter de
   `src/content/criterio/seguridad-del-que-instala.md`.
3. Build + check, deploy, y verificación en producción: 200 en la URL, las 4
   imágenes con `content-type: image/jpeg`, y la OG comprobada con el UA de
   `facebookexternalhit`.
