// Genera api/_catalogo.generado.js a partir de src/content/repuestos/*.json
//
// Por qué existe este paso: el precio que se COBRA tiene que salir del mismo
// archivo que el precio que se MUESTRA, o tarde o temprano se desincronizan y el
// sitio publica un número mientras Mercado Pago cobra otro. La función serverless
// no puede leer las colecciones de Astro (`astro:content` solo existe en el build
// del sitio) ni recorrer el filesystem en runtime (Vercel no incluye archivos que
// nadie importa), así que el catálogo se congela acá como módulo JS y se importa.
//
// Corre solo en `npm run build` (script prebuild). El archivo generado SE COMMITEA:
// así el deploy funciona aunque nadie haya corrido el build en local.
//
// Solo se copian los campos que hacen falta para cobrar. El resto del contenido
// (síntomas, guías, galería) no tiene por qué viajar a la función.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirRepuestos = path.join(raiz, "src", "content", "repuestos");
const destino = path.join(raiz, "api", "_catalogo.generado.js");

const archivos = fs.readdirSync(dirRepuestos).filter((f) => f.endsWith(".json")).sort();

const catalogo = {};
for (const archivo of archivos) {
  const datos = JSON.parse(fs.readFileSync(path.join(dirRepuestos, archivo), "utf-8"));

  // Un repuesto sin precio en pesos no se puede cobrar online: el precio_usd se
  // convierte en el navegador al blue del día y ese número no es confiable como
  // monto a cobrar. Queda fuera del catálogo y su ficha sigue vendiendo por
  // WhatsApp, que es exactamente lo que hace hoy.
  if (!datos.precio_ars || datos.precio_ars <= 0) continue;

  catalogo[datos.slug] = {
    slug: datos.slug,
    nombre: datos.nombre,
    codigo: datos.codigo,
    precio_ars: datos.precio_ars,
    imagen: datos.imagen,
    disponible: datos.disponible === true,
  };
}

const contenido = `// ARCHIVO GENERADO — no editar a mano.
// Se regenera en cada build desde src/content/repuestos/*.json
// (scripts/generar-catalogo.mjs). Para cambiar un precio, se cambia el JSON.
//
// Generado: ${new Date().toISOString()}

export const CATALOGO = ${JSON.stringify(catalogo, null, 2)};

export function buscarRepuesto(slug) {
  if (typeof slug !== "string") return null;
  return Object.prototype.hasOwnProperty.call(CATALOGO, slug) ? CATALOGO[slug] : null;
}
`;

fs.writeFileSync(destino, contenido, "utf-8");

const cobrables = Object.keys(catalogo).length;
const sinPrecio = archivos.length - cobrables;
console.log(
  `[catalogo] ${cobrables} repuesto(s) cobrables escritos en api/_catalogo.generado.js` +
    (sinPrecio > 0 ? ` — ${sinPrecio} sin precio_ars quedan solo con WhatsApp` : "")
);
