import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import fs from "node:fs";

// Contenido marcado `borrador: true`: existe como archivo pero todavía no tiene
// contenido escrito. Se lee acá con fs porque el filtro del sitemap recibe una
// URL suelta, sin acceso a las colecciones de contenido.
const borradores = (coleccion) => {
  const dir = `./src/content/${coleccion}`;
  return fs
    .readdirSync(dir)
    .filter((archivo) => archivo.endsWith(".md"))
    .filter((archivo) =>
      /^borrador:\s*true\s*$/m.test(fs.readFileSync(`${dir}/${archivo}`, "utf-8"))
    )
    .map((archivo) => `/${coleccion}/${archivo.replace(/\.md$/, "")}`);
};

const rutasBorrador = [...borradores("notas"), ...borradores("criterio")];

export default defineConfig({
  // De acá salen canonical, og:url, og:image y el sitemap. Es el dominio propio,
  // ya comprado y apuntado a Vercel (2026-07-24). Debe coincidir con `dominio` en
  // src/config/site.ts y con la línea Sitemap de public/robots.txt.
  site: "https://crtermico.com",
  // /panel es una herramienta privada (métricas SEO): va fuera del sitemap y con
  // noindex en BaseLayout, para que Google no la indexe ni la muestre.
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/panel") &&
        !rutasBorrador.some((ruta) => page.includes(ruta)),
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
