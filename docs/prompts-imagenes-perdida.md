# Prompts de imágenes — nota "La mancha no marca la pérdida: marca la salida"

**Estado: pendiente.** Las genera Edgardo en Antigravity con estos prompts; yo
recorto, optimizo, verifico y las pongo en la nota.

| Archivo | Medida | Dónde va |
| --- | --- | --- |
| `perdida-portada.jpg` | 1200 × 900 | Portada y tarjeta del feed |
| `perdida-dormitorio.jpg` | 1200 × 630 | `.figura-ancha`, sección "Por qué te van a señalar a vos" |
| `og-perdida.jpg` | 1200 × 630 | Tarjeta de WhatsApp (no se ve en la página) |

⚠ **La OG no se genera aparte: es un recorte cerrado de la portada.** El motivo del
piso abierto se lee bien en chico, así que nos ahorramos una generación.

⚠ **Son solo dos generaciones a propósito.** La nota ya lleva **siete esquemas
dibujados**; sumar más fotos la convierte en una galería y le saca peso a los
esquemas, que son los que explican.

⚠ **Antes de mandarlas, revisar las cuatro esquinas**: las salidas de Antigravity
suelen traer una marca de agua "Ai" arriba a la izquierda. Se resuelve recortando
70 px de la izquierda y 60 px de arriba, así que **nada importante de la composición
tiene que quedar pegado a los bordes**.

⚠ **Sin texto, sin carteles, sin logos, sin personas identificables.** El modelo
intenta escribir sobre cualquier superficie plana: revisar paredes y puertas.

⚠ **No describir el agua con volumen.** "Charcos", "gotas gruesas", "agua corriendo"
hacen que el modelo la agrande hasta que queda ridícula. Acá la humedad es una
**mancha**, un oscurecimiento del material — no agua a la vista.

---

## 1. Portada — `perdida-portada.jpg`

Formato final en el sitio: **4:3 (1200 × 900)**. Si la salida viene 1200 × 630 la
recorto y reescalo yo; cuanto más cuadrada salga, menos se pierde.

**Qué tiene que contar:** el destrozo adentro de una casa intacta. No es una obra en
construcción: es una casa terminada y habitada a la que le abrieron el piso buscando
algo que no estaba ahí. Ese contraste es el artículo entero.

> Interior de una vivienda de categoría, terminada y habitada. En el centro de la
> imagen, un sector del piso de tablas anchas de madera clara amarillenta con vetas
> marcadas ha sido levantado: las tablas retiradas están apiladas prolijamente a un
> costado, apoyadas contra la pared, y en el hueco se ve el contrapiso gris de
> cemento, seco y polvoriento. El corte del piso es irregular, con astillas y polvo
> fino alrededor. El resto del ambiente está perfectamente terminado y limpio, con
> zócalos de madera y pared pintada en tono claro. Luz natural cálida entrando de
> costado desde una ventana fuera de cuadro. Fotografía realista, ángulo bajo a la
> altura del piso, profundidad de campo media, sin personas, sin herramientas
> modernas a la vista, sin texto.

---

## 2. Cuerpo — `perdida-dormitorio.jpg`

Formato: **1200 × 630** (va a ancho completo, saliéndose del ancho de lectura).

**Qué tiene que contar:** al radiador lo acusan por estar cerca. En el encuadre
tienen que convivir las dos cosas —el radiador y la mancha— sin que nada indique que
una causó la otra. Es la escena que el lector va a reconocer de su propia obra.

> Dormitorio de una vivienda moderna, prolijo y amueblado con sobriedad. Sobre la
> pared del fondo, un radiador de calefacción de paneles blanco, montado a media
> altura, en perfecto estado. En la misma pared, junto al radiador y arrancando
> desde el zócalo, una mancha de humedad: una zona oscurecida de la pintura, de
> bordes difusos, que se desvanece hacia arriba, con la pintura apenas ampollada
> cerca del zócalo. La mancha está seca, no hay agua a la vista. Luz natural suave
> de mañana, sin sol directo sobre la pared. Fotografía de interiores realista,
> encuadre frontal y amplio, sin personas, sin texto, sin logos.

---

## 3. OG — `og-perdida.jpg`

**No se genera.** Recorte cerrado de `perdida-portada.jpg` sobre el hueco del piso,
llevado a 1200 × 630.

⚠ **Verificar que salga JPEG baseline**, no progressive: WhatsApp no decodifica los
progressive y la vista previa queda vacía. El encoder de `ffmpeg` da baseline por
defecto; se comprueba con `file`.
