import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  // De acá salen canonical, og:url, og:image y el sitemap. Mientras apuntaba a
  // criteriotermico.com.ar —que todavía no está comprado y da NXDOMAIN— la preview
  // de WhatsApp no cargaba la imagen y el canonical mandaba a Google a un dominio
  // muerto. AL COMPRAR EL DOMINIO: cambiar esta línea y `dominio` en
  // src/config/site.ts, y agregarlo en Vercel para que el .vercel.app redirija.
  site: "https://criteriotermico-web.vercel.app",
  integrations: [sitemap(), mdx()],
  output: "static",
  redirects: {
    // /para-tecnicos pasó a /plataforma cuando el sitio entero se reorientó al
    // instalador y ese nombre dejó de distinguir nada. La URL vieja puede estar
    // compartida por WhatsApp, así que no se rompe.
    "/para-tecnicos": "/plataforma",
  },
});
