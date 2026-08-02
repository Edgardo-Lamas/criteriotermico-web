import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const repuestos = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/repuestos" }),
  schema: z.object({
    slug: z.string(),
    nombre: z.string(),
    codigo: z.string(),
    marca: z.string(),
    precio_usd: z.number(),
    precio_ars: z.number().optional(),
    imagen: z.string(),
    imagenes: z.array(z.string()).optional(),
    disponible: z.boolean(),
    modelos_compatibles: z.array(z.string()),
    sintomas: z.array(z.string()),
    descripcion: z.string(),
    guia_instalacion_slug: z.string(),
    whatsapp_mensaje: z.string(),
  }),
});

const diagnostico = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/diagnostico" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    fecha: z.string(),
    categoria: z.string(),
    repuestos_relacionados: z.array(z.string()).optional(),
  }),
});

const notas = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notas" }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    excerpt: z.string(),
    readingTime: z.string(),
    // Obligatoria a propósito: la nota se lee como artículo y se comparte por
    // WhatsApp, y las dos cosas dependen de la foto. Si es opcional, la que se
    // publique sin ella arranca con el texto pelado y sale con la OG genérica,
    // y nadie se entera hasta que alguien pega el enlace. Así, el build frena.
    image: z.string(),
    // Crédito al pie de la portada: quién la sacó y bajo qué licencia. Las fotos
    // de archivo arqueológico vienen de Wikimedia, y CC BY / CC BY-SA obligan a
    // atribuir. Vacío solo si la foto es propia.
    imageCredito: z.string().optional(),
    // Imagen para la tarjeta de WhatsApp/Facebook. Va aparte de `image` porque
    // el recorte 1200x630 no coincide con el de la portada. Si falta, cae en la
    // del sitio, que no dice nada del artículo.
    ogImage: z.string().optional(),
    fecha: z.string(),
    featured: z.boolean().optional(),
    // La nota existe pero todavía no tiene contenido escrito. Queda fuera del
    // sitemap (astro.config.mjs) y con noindex (notas/[slug].astro): en un dominio
    // nuevo, que Google conozca el sitio por páginas vacías pesa sobre todo el
    // resto. Sacar la marca al completarla.
    borrador: z.boolean().optional(),
  }),
});

const instalacion = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/instalacion" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    fecha: z.string(),
    categoria: z.string(),
    repuesto_slug: z.string().optional(),
  }),
});

// Artículos de criterio profesional: presupuestar, cobrar, cubrirse. No son
// guías paso a paso (eso es `instalacion`) ni notas de interés general (eso es
// `notas`): le hablan a quien vive de esto, sobre la parte del trabajo que no
// es técnica y que nadie le enseña. Por eso viven en /criterio y no en /notas.
const criterio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/criterio" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    categoria: z.string(),
    readingTime: z.string(),
    // Obligatoria por la misma razón que en `notas`: el artículo se comparte por
    // WhatsApp y sin portada sale con la OG genérica del sitio, que no dice nada
    // de lo que el lector está por abrir.
    image: z.string(),
    imageCredito: z.string().optional(),
    // Recorte 1200x630 propio para la tarjeta de WhatsApp/Facebook. Si falta,
    // cae en la portada, cuyo encuadre 4:3 se recorta distinto.
    ogImage: z.string().optional(),
    fecha: z.string(),
    // Mismo mecanismo que en `notas`: fuera del sitemap y con noindex mientras
    // el contenido no esté escrito.
    borrador: z.boolean().optional(),
  }),
});

export const collections = { repuestos, diagnostico, instalacion, notas, criterio };
