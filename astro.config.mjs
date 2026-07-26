import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import fs from "node:fs";

// Notas marcadas `borrador: true`: existen como archivo pero todavía no tienen
// contenido escrito. Se leen acá con fs porque el filtro del sitemap recibe una
// URL suelta, sin acceso a las colecciones de contenido.
const DIR_NOTAS = "./src/content/notas";
const notasBorrador = fs
  .readdirSync(DIR_NOTAS)
  .filter((archivo) => archivo.endsWith(".md"))
  .filter((archivo) =>
    /^borrador:\s*true\s*$/m.test(fs.readFileSync(`${DIR_NOTAS}/${archivo}`, "utf-8"))
  )
  .map((archivo) => `/notas/${archivo.replace(/\.md$/, "")}`);

export default defineConfig({
  // De acá salen canonical, og:url, og:image y el sitemap. Es el dominio propio,
  // ya comprado y apuntado a Vercel (2026-07-24). Debe coincidir con `dominio` en
  // src/config/site.ts y con la línea Sitemap de public/robots.txt.
  site: "https://crtermico.com",
  // /panel es una herramienta privada (métricas SEO) y /sanitarios-san-martin es una
  // propuesta comercial dirigida a un cliente concreto: las dos van fuera del sitemap
  // y con noindex en BaseLayout, para que Google no las indexe ni las muestre.
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/panel") &&
        !page.includes("/sanitarios-san-martin") &&
        !notasBorrador.some((ruta) => page.includes(ruta)),
    }),
    mdx(),
  ],
  output: "static",
  redirects: {
    // /para-tecnicos pasó a /plataforma cuando el sitio entero se reorientó al
    // instalador y ese nombre dejó de distinguir nada. La URL vieja puede estar
    // compartida por WhatsApp, así que no se rompe.
    "/para-tecnicos": "/plataforma",
  },
});
