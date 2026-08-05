# Prompts de imágenes — "Esa manguera no tira agua"

Guía `/criterio/esa-manguera-no-tira-agua`. Cuatro imágenes.

⚠ **Recordatorios del flujo** (ver sesiones anteriores):
- Salen en **PNG 1200×630**. La **portada** hay que recortarla a **4:3 centrada y
  reescalar a 1200×900** (lanczos) para respetar `.article-cover`.
- **Traen marca de agua "Ai" arriba a la izquierda** (~x 30-56, y 26-54). Se
  resuelve recortando **70 px de izquierda y 60 px de arriba**. El recorte 4:3 de la
  portada la elimina sola. **Revisar las cuatro esquinas antes de publicar.**
- Sin texto, sin logos, sin marcas de fabricante visibles.
- La OG no se renderiza nunca en la página, solo en la tarjeta de WhatsApp.

---

## 1. Portada — `condensado-portada.jpg`

> Fotografía realista, exterior de una vivienda familiar. Primer plano de una
> manguera plástica delgada y flexible que baja por una pared exterior de revoque
> claro y termina suelta, sin conexión, goteando sobre la tierra de un cantero
> con plantas. Se ve una gota cayendo. La tierra debajo del punto de goteo está
> visiblemente más oscura y las plantas más cercanas se ven amarillentas y
> deterioradas, mientras que las del resto del cantero están sanas y verdes. Luz
> natural de tarde, día nublado. Enfoque nítido en la manguera y la gota,
> profundidad de campo corta con el fondo del jardín desenfocado. Sin texto, sin
> logotipos, sin personas.

## 2. Cuerpo — el sifón · `condensado-sifon.jpg`

Va con `.figura-par` (imagen izquierda, texto derecha).

> Fotografía técnica de detalle, vista desde abajo de una caldera mural doméstica
> de gas montada en la pared. En el centro del encuadre, el sifón plástico de
> descarga de condensados y la conexión de la manguera que sale de él hacia abajo.
> Interior de un lavadero doméstico, pared de azulejo claro. Iluminación pareja,
> técnica, sin sombras duras. Nitidez alta en el sifón y sus conexiones. Sin texto,
> sin marcas visibles, sin logotipos, sin personas.

## 3. Cuerpo — la cañería que no corresponde · `condensado-canieria.jpg`

Va con `.figura-par--invertida` (texto izquierda, imagen derecha).

> Fotografía de detalle de una cañería metálica vieja de hierro fundido en el
> exterior de una vivienda, con corrosión visible: óxido, picaduras en la
> superficie y depósitos blanquecinos alrededor de una junta. Textura muy marcada
> del metal atacado. Luz natural lateral que resalta el relieve de la corrosión.
> Enfoque macro, fondo desenfocado. Sin texto, sin logotipos, sin personas.

## 4. OG — `og-condensado.jpg`

Formato 1200×630 exacto, se usa solo en la tarjeta de WhatsApp.

> Fotografía realista en formato apaisado. Manguera plástica delgada saliendo de
> una pared exterior de vivienda y goteando sobre tierra de cantero. Composición
> con la manguera y la gota desplazadas hacia la izquierda del encuadre, dejando
> aire limpio y desenfocado a la derecha. Luz natural suave de día nublado.
> Atmósfera sobria, tonos fríos y terrosos. Sin texto, sin logotipos, sin personas.

---

## Cómo se procesan cuando las mande

1. Verificar formato real con `file` (Antigravity ya exportó PNG reales antes, pero
   supo exportar JPEG con extensión `.png`).
2. Recortar 70 px izquierda / 60 px arriba para eliminar la marca "Ai" — salvo la
   portada, donde el recorte 4:3 ya la saca.
3. Portada: recorte 4:3 centrado y reescalado a 1200×900 con lanczos.
4. Optimizar con `ffmpeg -q:v 6`.
5. Verificar que las cuatro esquinas estén limpias antes de commitear.
6. Sacar `borrador: true` del frontmatter recién cuando las cuatro estén en su lugar.
