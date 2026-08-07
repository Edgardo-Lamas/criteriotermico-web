# Prompts de imágenes — nota "La pared que se moja no es la que tiene el problema"

**Estado: cerrado el 2026-08-07. Las cuatro imágenes están generadas, procesadas y
puestas en la nota.** Lo que sigue queda como registro de qué se pidió y qué falló,
que es lo que sirve para la próxima.

| Archivo | Medida | Dónde va |
| --- | --- | --- |
| `condensacion-portada.jpg` | 1200 × 900 | Portada y tarjeta del feed |
| `condensacion-natatorio.jpg` | 1200 × 630 | `.figura-ancha`, cierre de la introducción |
| `condensacion-pasillo.jpg` | 1200 × 630 | `.figura-par`, sección "El vapor viaja" |
| `og-condensacion.jpg` | 1200 × 630 | Tarjeta de WhatsApp (no se ve en la página) |

⚠ **La OG no se generó aparte: es un recorte cerrado de la misma toma de la portada.**
Cuando el motivo de la portada se lee bien en chico, conviene hacer esto y ahorrarse
una generación.

Las genera Edgardo en Antigravity con estos prompts; yo recorto, optimizo y verifico
antes de publicar.

⚠ **Antes de mandarlas, revisar las cuatro esquinas**: las salidas de Antigravity
suelen traer una marca de agua "Ai" arriba a la izquierda. Se resuelve recortando
70 px de la izquierda y 60 px de arriba, así que conviene que **nada importante de
la composición quede pegado a los bordes**.

⚠ **Sin texto, sin carteles, sin logos de marca, sin personas identificables.**

---

## 1. Portada — `condensacion-portada.jpg`

Formato final en el sitio: **4:3 (1200 × 900)**. Si la salida es 1200 × 630, la
recorto y reescalo yo; generarla lo más cuadrada posible ayuda a no perder nada.

> Interior de una habitación de vivienda en un día frío de invierno. Primer plano
> del rincón donde se encuentran dos paredes y el techo. La superficie está cubierta
> de gotas de condensación bien definidas, algunas deslizándose hacia abajo y
> dejando un rastro húmedo sobre la pintura clara. En la esquina empieza a insinuarse
> una mancha oscura de humedad. Al fondo, desenfocada, una ventana con el vidrio
> empañado y luz gris de invierno entrando. Luz natural fría, lateral y rasante, que
> hace brillar las gotas y revela la textura de la pared. Fotografía realista,
> profundidad de campo corta, sin personas, sin texto, sin muebles reconocibles.

## 2. Cuerpo — `condensacion-pasillo.jpg`

Formato: **1200 × 630** (va en dos columnas junto al texto).

✅ **Se eligió la Opción A, el pasillo**, y salió bien al primer intento.

### Por qué se descartaron las dos primeras versiones

**Versión 1 — natatorio en día frío.** Decía "día frío", "invierno", "gotas gruesas
bajando" y "paleta fría". El modelo devolvió **bloques de hielo y estalactitas
colgando de las vigas, con espuma en las ventanas**. Dos aprendizajes que valen para
todo prompt futuro: **nombrar el frío dentro del ambiente hace que dibuje hielo**, y
**describir el agua con volumen ("gotas gruesas", "charcos") la agranda hasta que
queda ridícula.**

**Versión 2 — natatorio cálido, corregida.** Se arreglaron esos dos problemas, pero
Edgardo la frenó por otro motivo, y tiene razón: **una foto de natatorio es
decorativa y no evidencia el tema.** El concepto que la imagen tiene que mostrar es
que **el vapor viaja**, y una pileta linda no lo cuenta.

### Opción A — el pasillo ✅ ES LA QUE SE USÓ

Contiene las tres cosas del artículo en un solo encuadre: de dónde sale el vapor,
por dónde viaja y dónde aparece el agua.

> Pasillo interior de un club deportivo, iluminado con luz artificial cálida. En
> primer plano, sobre la pared de la izquierda, un tramo de pintura clara cubierto de
> pequeñas gotas de condensación, con una mancha de humedad que empieza a formarse en
> el rincón, cerca del zócalo. El pasillo se aleja en profundidad y al fondo, a
> bastante distancia, se ve una puerta doble entreabierta por la que sale una luz
> cálida. El foco está en la pared del primer plano; la puerta del fondo queda
> levemente desenfocada. Fotografía arquitectónica realista, encuadre en profundidad,
> iluminación de interior tranquila, sin dramatismo.
>
> No debe haber: hielo, escarcha, nieve, espuma, niebla, humo, vapor denso, agua
> acumulada en el piso, goteras, personas, texto ni carteles.

### Opción B — la oficina a treinta metros

Más fácil de generar bien, pero cuenta la mitad de la historia: se ve el daño, no el
camino.

> Oficina administrativa común, con un escritorio, papeles y una computadora. Detrás
> del escritorio, la pared está cubierta de pequeñas gotas de condensación y tiene una
> mancha de humedad que se extiende desde el rincón. No hay ninguna fuente de agua a
> la vista. Iluminación de interior realista, luz artificial neutra, ambiente
> ordenado y cotidiano. Fotografía realista, sin dramatismo.
>
> No debe haber: hielo, escarcha, espuma, niebla, humo, vapor, agua acumulada en el
> piso, goteras, personas, texto ni carteles.

## 3. Imagen para compartir — `og-condensacion.jpg`

Formato: **1200 × 630**. ⚠ Esta imagen **no se ve dentro del artículo**: es la que
aparece en la tarjeta cuando el enlace se manda por WhatsApp. Por eso el motivo
tiene que leerse bien en chico.

✅ **No hizo falta generarla.** Es un recorte cerrado de la toma de la portada
(`crop=1000:525:200:380` sobre el original de 1200 × 1200, reescalado a 1200 × 630 con
lanczos): entra la arista con la mancha oscura, el reguero y la pared de gotas. La
mancha da el contraste que hace que se lea en el tamaño de una tarjeta.

⚠ **Toda OG va en JPEG baseline**, nunca progressive: WhatsApp no decodifica los
progressive y la tarjeta sale sin imagen. El encoder de `ffmpeg` da baseline por
defecto; verificar igual con `file`.

El prompt quedó escrito por si alguna vez hay que generarla de cero:

> Plano cerrado y frontal de una pared interior pintada de color claro, cubierta de
> gotas de condensación de distintos tamaños, con varios regueros de agua bajando por
> la superficie. La luz llega de costado y hace brillar cada gota contra la pared en
> penumbra. Composición simple, centrada, con espacio libre alrededor del motivo
> principal. Fotografía realista, muy detallada, sin texto, sin objetos, sin personas.

## 4. Plano de situación — `condensacion-natatorio.jpg`

Formato: **1200 × 630**, en `.figura-ancha` al cierre de la introducción. **Se sumó
después**, a pedido de Edgardo, para que se vea el escenario del que habla el caso.

🔑 **Es la única imagen puramente ilustrativa de la nota, y por eso va donde va:** al
final de la introducción, ambientando el relato. Las otras tres explican algo —el
problema, el mecanismo, la tarjeta—. Si esta hubiera querido explicar la
condensación, habría vuelto al error de las dos versiones descartadas.

### ⚠ De dónde salió, que es lo que hay que recordar

Edgardo encontró en Pinterest una foto parecida al club real y propuso retocarla en
Canva. **No se usó, y el motivo no es estético:** editar una imagen no la vuelve
propia —el retoque genera una obra derivada, que sigue siendo del autor original— y
Pinterest no otorga ninguna licencia. Sumado a eso, el archivo medía 735 × 414 y
ningún editor inventa los píxeles que faltan.

**Se resolvió generándola**, tomando la de Pinterest solo como referencia de
composición. Criterio que queda: **una imagen bajada de un tablero no entra al sitio;
o se genera, o se saca de una biblioteca con licencia comercial (la de Canva sirve),
o es una foto propia.** Es el mismo criterio que Edgardo aplicó con el reel de
Navarro y con la diapositiva de Triangular.

### ⚠ Traía texto falso, y hay que revisarlo siempre

La generación dejó **un renglón de caracteres ilegibles** sobre la puerta oscura de la
izquierda (x ≈ 280-322, y ≈ 455-468 en el original de 1200 × 1200). Se borró con
`ffmpeg -vf "delogo=x=274:y=448:w=56:h=26"`, que sobre el revestimiento de hiladas
quedó invisible. **Revisar carteles, puertas y paredes antes de publicar cualquier
imagen generada de un espacio público**, que es donde el modelo intenta escribir.

### El encuadre

De la salida cuadrada de 1200 × 1200 se recortó **la franja de arriba**
(`crop=1200:630:0:120`), no la del medio: así entra el techo abovedado con los
lucernarios. **El volumen de aire es el tema de la nota**, no la pileta — recortando
más abajo queda una foto de agua y se pierde el argumento.
