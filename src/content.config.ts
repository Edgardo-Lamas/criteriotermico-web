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

export const collections = { repuestos, diagnostico, instalacion, notas };
