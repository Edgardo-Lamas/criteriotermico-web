# Plan de mejora UX/UI — Criterio Térmico (sitio web)

Fecha: 2026-07-22
Estado del repo al arrancar: `main` limpio, último commit `b80bfcb` (handoff de diseño aplicado).

---

## 1. El problema real

El sitio de hoy le habla a **una** audiencia: el dueño de casa con la caldera rota.
Todo el copy lo confirma: *"Que tu casa nunca pierda el calor"*, *"Escribinos. Te
atiende el técnico"*, *"sin call center, sin vueltas"*. El profesional aparece en una
sola página lateral (`/para-tecnicos`), como un anexo.

El objetivo nuevo es que el sitio también le hable —y sobre todo le venda— al
**profesional que instala calefacción**: gasistas, sanitaristas, electricistas,
constructores, arquitectos y todo el que se meta con un sistema de calefacción.

Estas dos audiencias no quieren lo mismo, y ahí está la dificultad:

| | Dueño de casa | Profesional |
|---|---|---|
| Llega | Con un problema urgente | Con un proyecto o una obra |
| Quiere | Que se lo resuelvan | Datos para resolverlo él |
| Decide por | Confianza y cercanía | Criterio técnico y disponibilidad |
| Compra | Una vez | De forma recurrente |
| Le sirve el SaaS | No | Sí, es su herramienta de trabajo |

Si se mezclan sin gobierno, pasa lo peor de los dos mundos: el técnico lee un mensaje
escrito para su propio cliente y se va; el particular se topa con tablas de kcal/h y
se asusta.

### La decisión de fondo

**No** hacer dos sitios (doble mantenimiento y se parte el SEO).
**Sí** hacer un tronco único de autoridad técnica con una bifurcación temprana y
explícita.

Recomendación: **home orientada al profesional, con una puerta clara y digna para el
particular.** Los motivos:

1. El activo diferencial de Edgardo (20 años, criterio de obra, +200 errores
   documentados, el simulador) le sirve al profesional. Al particular le sirve una
   parte chica.
2. El profesional compra repuestos de forma recurrente; el particular una vez cada
   varios años.
3. El profesional es el canal de venta natural del SaaS. Con este giro, el sitio pasa
   a ser también el embudo de Criterio Térmico plataforma.
4. El particular se sigue capturando igual: las guías de diagnóstico ya rankean para
   sus búsquedas ("la caldera no enciende") y el WhatsApp está siempre visible.

### Decisiones tomadas (2026-07-22)

Resueltas por Edgardo, y condicionan todo lo que sigue:

1. **Audiencia, por orden de prioridad: gasistas → sanitaristas → constructores → el
   resto** (electricistas, arquitectos). El sitio se escribe para el gasista; los demás
   entran por carriles secundarios.
2. **El catálogo no es el gancho.** Hoy son 4 repuestos y se ampliará más adelante,
   pero el producto que se vende es el asesoramiento. El repuesto es consecuencia, no
   góndola: baja de jerarquía en la home.
3. **El asesoramiento es el gancho** de las tres cosas: el SaaS, los repuestos y la
   autoridad. No se cobra por sí mismo, todavía.
4. **Horizonte: cálculos personalizados y proyectos de obra grande.** Es hacia donde
   apunta el negocio, y le da sentido al conjunto: el sitio no vende repuestos, vende
   criterio.
5. **Todavía no hay ninguna venta.** El sitio no tiene que optimizar conversión: tiene
   que conseguir el primer gasista.

**Consecuencia sobre el orden de trabajo:** el punto 5 reordena las fases. Con cero
ventas, lo urgente es el mensaje correcto y el contenido que trae gasistas por
búsqueda; el sistema de diseño completo y el movimiento pueden esperar. No sirve un
sitio impecable que le habla a la persona equivocada.

### Tensión que queda abierta

**Este giro deja parcialmente viejo el rediseño recién validado.** El handoff
(`b80bfcb`) está construido sobre el mensaje "servicio técnico para tu casa". Buena
parte del sistema visual se aprovecha; el copy y la estructura de la home, no.

---

## 2. Auditoría del sitio actual

### Defectos objetivos (no son cuestión de gusto)

1. **Las animaciones de entrada dejan la página fantasma.**
   `global.css:208` aplica `transition 0.7s` a cada `[data-reveal]`, y el atributo está
   en casi todas las secciones. Scrolleando a velocidad normal se capturaron seis
   pantallas con bloques enteros semitransparentes o vacíos.
   La base de ui-ux-pro-max marca esto con severidad **alta**: *"Animate 1-2 key
   elements per view maximum"* y *"Don't use animations longer than 500ms for UI"*.

2. **Contraste insuficiente.** `--color-text-muted: #8a7b6b` sobre el cream `#f4ece1`
   da **3.5:1**; el mínimo para texto de cuerpo es 4.5:1. Se usa en 12 lugares.
   (`--color-text-secondary` sí pasa, con 5.4:1.)

3. **Emojis del sistema como íconos**: `📍` y `🕐` en `Footer.astro:20-21` e
   `index.astro:384`, conviviendo con SVG en el resto. Anti-patrón explícito de la
   base consultada ("Emoji as icons").

4. **La grilla de repuestos muestra 4 de 4 "Imagen próximamente"**, con alturas
   desparejas y el chip de código sólo en 2 de las 4.

### Decisiones de diseño discutibles

5. **Eyebrow uppercase sobre las 7 secciones** ("GUÍAS DEL TÉCNICO", "QUIÉN ATIENDE",
   "TRABAJOS REALIZADOS"...). Como recurso puntual es voz; en todas las secciones es
   andamiaje.
6. **El carrusel del hero cruza fotos muy distintas** en un fundido de ~1,3s con Ken
   Burns hasta 1.14. En el cruce se ve un radiador superpuesto a una caldera: lee como
   error de carga.
7. **Casi todo el sitio es la misma grilla de cards** (diagnóstico, repuestos, notas).
   La sección de trabajos, que usa masonry, es la más atractiva justamente por romper
   ese molde.

### Lo que está bien y no se toca

La paleta cálida (cream + terracota + espresso), el par tipográfico Bricolage
Grotesque / Hanken Grotesk, el tono del copy y la arquitectura de contenido
(diagnóstico → instalación → notas). Es una base sólida.

---

## 3. Qué tomar de whiteglobalmarketing.com

Lo revisé en el navegador. Es **WordPress + Elementor + Slider Revolution +
WooCommerce**. El efecto central: al scrollear, el hero completo rota en 3D como una
tarjeta que se aleja y revela la escena siguiente, más marquees de texto gigante
cruzando la pantalla y mockups flotando.

### Sirve

- **El scroll como narración.** Cada sección es una escena con su propio momento, no
  un apilado uniforme de cards. Ataca de raíz el defecto 7.
- **Transiciones con profundidad** (perspectiva, escala, capas) en lugar de un
  fade+translate idéntico para todo. Ataca el defecto 1.
- **Tipografía grande como elemento gráfico.** En Criterio Térmico esto es una
  oportunidad enorme: en lugar de decorado, poner el vocabulario del oficio en
  pantalla completa (kcal/h, ΔT, caudal, salto térmico). Dice "acá se habla tu idioma"
  antes de que el visitante lea una sola frase.
- **Escenas de alto contraste**: fondo claro con bloques oscuros saturados. El sitio ya
  alterna cream / espresso / azul, pero por inercia, no por intención.
- **Menú contenido.** Hoy el header lleva 6 ítems + CTA; se puede dar más aire.

### No sirve, y conviene decirlo

- **18.500 px de alto con 1.700 caracteres de texto.** Para un sitio cuyo activo es el
  contenido técnico y que quiere rankear por búsquedas de oficio, eso es exactamente lo
  contrario de lo que hace falta.
- **El scroll intervenido.** No pude scrollear con la rueda. Un gasista consultando
  desde la obra, con el celular y las manos sucias, no tiene paciencia para eso. La
  base de la skill lo marca con severidad alta: *"Parallax/Scroll-jacking causes
  nausea"*.
- **La estética púrpura/neón de agencia.** Para alguien que vende 20 años de oficio,
  transmite lo opuesto.
- **El stack.** El sitio actual es Astro estático: más rápido y más barato que ese
  WordPress. La sensación se copia; la implementación, no.

**Síntesis:** tomamos la *ambición visual* (escenas, profundidad, tipografía como
gráfico) y la ejecutamos con el presupuesto de movimiento de un sitio técnico: pocas
animaciones, cortas, y que nunca bloqueen la lectura.

---

## 4. Plan por fases

Cada fase cierra sola y deja el sitio publicable. Las estimaciones son en sesiones de
trabajo, no en días de calendario.

### Fase 0 — Reparar la base · ✅ COMPLETADA 2026-07-22

- **Motion**: `0.7s → 0.3s`, desplazamiento `26px → 12px`, y el observer pasó de
  `threshold 0.1 / rootMargin -6%` a `threshold 0 / rootMargin +15%`, para que la
  sección empiece a revelarse antes de entrar en pantalla.
  Medido con Playwright, scrolleando como un usuario:
  | | antes | después |
  |---|---|---|
  | mobile, peor momento | 3 bloques al **0%** de opacidad | 1 bloque al 68% |
  | desktop, peor momento | 6 bloques al **0%** | 3 bloques al 87% |
  | sin scrollear, a los 3,2s | 15 bloques ocultos | 0 |
- **Red de seguridad en el reveal**: si nadie scrollea (un crawler, un servicio de
  preview), a los 2,5s se muestra todo. Antes esas 15 secciones quedaban invisibles
  para siempre.
- **Contraste**: `--color-text-muted` de `#8a7b6b` (3.5:1) a `#746657` (4.74:1).
  `.footer__title` pasó a `--color-cream-softer`, porque va sobre el espresso y con el
  token oscurecido habría quedado en 3.25:1.
- **Emojis → SVG**: nuevo `src/components/Icon.astro` (pin y reloj, trazo,
  `currentColor`), usado en `Footer.astro` e `index.astro`.
- **Cards de repuestos**: el código se movió sobre la imagen. Como 2 de los 4 repuestos
  no tienen código cargado, en el cuerpo su ausencia desalineaba los títulos de la
  grilla. De paso el código gana visibilidad, que es lo que busca un gasista.
- **Táctil**: nav mobile, links del footer, breadcrumbs y "ver ficha" pasaron a 40-44px
  de alto. Se consulta desde la obra, con una mano.
- **Mobile**: la imagen de la card pasa a 16/10 abajo de 560px; en una columna el
  cuadrado se comía la pantalla entera para mostrar un placeholder.
- **Verificado**: sin desborde horizontal a 390 / 768 / 1440 px en home, repuestos,
  diagnóstico y para-técnicos. Build en verde, 23 páginas.

Queda anotado y **no** corregido: el botón flotante de WhatsApp tapa texto en mobile
durante el scroll. Es el compromiso normal de un botón flotante; si molesta, se revisa.

### Fase 1 — Posicionamiento y arquitectura · 1 sesión, sin código

La fase que decide todas las demás. Sale un documento, no un commit.

- Definir las dos audiencias y qué busca cada una (esto lo aportás vos, es tu terreno).
- Elegir el modelo de bifurcación y escribir el mensaje central del sitio.
- Mapa del sitio nuevo: qué páginas existen, para quién, y cómo se enlazan.
- Definir qué se muestra del SaaS acá y qué queda del otro lado.

*Terminado cuando:* hay un mapa aprobado y una frase que resume el sitio en una línea.

### Fase 2 — Sistema de diseño de dos registros · 1-2 sesiones

Hoy conviven dos lenguajes visuales sin gobierno: el cálido del sitio y el azul frío de
la sección del SaaS. Convertir eso en un sistema deliberado:

- **Registro obra** (cálido): confianza, oficio, trabajos, contacto.
- **Registro dato** (frío, técnico): especificaciones, tablas, criterio, plataforma.
- Componentes técnicos nuevos que hoy no existen: tabla de especificaciones, ficha de
  compatibilidad, bloque de "criterio de obra", comparativa.
- Documentar los tokens en `DESIGN.md` (hoy el `CLAUDE.md` está desactualizado: dice
  1400 líneas de CSS y son 2869).

*Terminado cuando:* los componentes nuevos existen y están documentados.

### Fase 3 — Home nueva · 2 sesiones

- Bifurcación explícita en la parte alta.
- Hero reescrito para el profesional, sin perder la puerta del particular.
- Reemplazar la repetición de grillas por escenas con ritmo propio.
- Resolver el carrusel (o fotos que combinen, o una sola imagen fuerte).

*Terminado cuando:* un gasista y un dueño de casa entienden, cada uno en menos de 5
segundos, que el sitio es para él.

### Fase 4 — El contenido técnico (el activo) · continuo

Es lo que da diferencia real y lo que ningún competidor local hace.

- Fichas de repuesto con datos de verdad: compatibilidad, medidas, cuándo se cambia,
  con qué se confunde.
- Guías de buenas prácticas por oficio (el gasista, el sanitarista y el arquitecto no
  buscan lo mismo).
- Tablas de compatibilidad por modelo de caldera.
- Fotos reales de los 4 repuestos: hoy no hay ninguna, y es lo primero que mira quien
  va a comprar.

*Terminado cuando:* es un flujo permanente, no una fase que cierra.

### Fase 5 — Movimiento y carácter · 1 sesión

Recién acá, y sólo sobre una base sana.

- Escenas con profundidad en 2 o 3 momentos de la home, no en todas las secciones.
- Tipografía grande como recurso gráfico con vocabulario del oficio.
- Presupuesto estricto: máximo 2 elementos animados por pantalla, nada por encima de
  300 ms, `prefers-reduced-motion` en todo, y jamás interceptar el scroll.

*Terminado cuando:* el sitio tiene carácter y sigue siendo rápido en un celular en obra.

### Fase 6 — Conversión y medición · 1 sesión

- CTAs distintos por audiencia (el profesional no quiere "consultá por WhatsApp", quiere
  disponibilidad y precio).
- Camino explícito del sitio al SaaS.
- Medición, para dejar de decidir por intuición.

---

## 5. Orden de trabajo (revisado con las decisiones del 22/07)

Como todavía no hay ninguna venta, el objetivo no es pulir: es conseguir el primer
gasista. Eso cambia el orden original.

1. ~~**Fase 0** — reparar la base~~ ✅ hecha.
2. **Fase 1** — posicionamiento. Ya resuelta en lo esencial (ver sección 1). Falta sólo
   el mapa del sitio y la frase que lo resume.
3. **Fase 3** — home nueva con el mensaje al gasista. **Sube de prioridad**: es lo que
   convierte al primer cliente.
4. **Fase 4** — contenido técnico. **Sube y corre en paralelo**: es lo que trae
   gasistas por búsqueda y lo que construye la autoridad.
5. **Fase 2** — sistema de dos registros. **Baja**: se hace lo mínimo que la home nueva
   necesite, y se completa después.
6. **Fase 6** — medición. Con cero ventas hace falta saber si entra alguien.
7. **Fase 5** — movimiento y carácter. Al final, sobre una base sana.

---

## 6. Herramientas verificadas para este trabajo

Con contenido real y utilizables:

- **ui-ux-pro-max** — base consultable: 161 tipos de producto, 99 guías UX, paletas,
  pares tipográficos y un CSV específico de Astro. Es la más útil.
- **design-system** (236 KB), **emil-design-eng** (detalle de UI),
  **gsap-scrolltrigger** (movimiento), **frontend-design**.
- **Claude in Chrome** — para ver el sitio real y comparar contra referencias.
- **Playwright / webapp-testing** — pendiente de usar para auditar mobile de verdad.

Creadas pero **vacías** (no sirven aunque aparezcan en la lista): `positioning`,
`category-design`, `jobs-to-be-done`, `competitive-analysis`, `landing-page-optimizer`,
`schema-markup`, `entity-seo-playbook`, `lighthouse-audit`, `buyer-personas`,
`value-proposition-canvas`, `content-strategy`, `design-trends-2026`. La skill
`impeccable` trae sólo su SKILL.md, sin los scripts ni las referencias que anuncia.
