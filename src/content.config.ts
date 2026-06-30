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
    imagen: z.string(),
    disponible: z.boolean(),
    modelos_compatibles: z.array(z.string()),
    sintomas: z.array(z.string()),
    descripcion: z.string(),
    guia_instalacion_slug: z.string(),
    whatsapp_mensaje: z.string(),
  }),
});

const diagnostico = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/diagnostico" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    fecha: z.string(),
    categoria: z.string(),
    repuestos_relacionados: z.array(z.string()).optional(),
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

export const collections = { repuestos, diagnostico, instalacion };
