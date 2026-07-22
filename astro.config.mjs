import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://criteriotermico.com.ar",
  integrations: [sitemap(), mdx()],
  output: "static",
  redirects: {
    // /para-tecnicos pasó a /plataforma cuando el sitio entero se reorientó al
    // instalador y ese nombre dejó de distinguir nada. La URL vieja puede estar
    // compartida por WhatsApp, así que no se rompe.
    "/para-tecnicos": "/plataforma",
  },
});
