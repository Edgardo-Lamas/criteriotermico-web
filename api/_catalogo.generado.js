// ARCHIVO GENERADO — no editar a mano.
// Se regenera en cada build desde src/content/repuestos/*.json
// (scripts/generar-catalogo.mjs). Para cambiar un precio, se cambia el JSON.
//
// Generado: 2026-09-01T23:54:58.800Z

export const CATALOGO = {
  "flujostato-bitron-onoff-90000054": {
    "slug": "flujostato-bitron-onoff-90000054",
    "nombre": "Flujostato Bitron",
    "codigo": "90000054",
    "precio_ars": 95000,
    "imagen": "/images/repuestos/flujostato-1.jpg",
    "disponible": true
  },
  "juntas-termicas": {
    "slug": "juntas-termicas",
    "nombre": "Juntas térmicas",
    "codigo": "",
    "precio_ars": 5000,
    "imagen": "/images/repuestos/juntas-1.jpg",
    "disponible": false
  },
  "kit-valvula-detentor-escuadra-media": {
    "slug": "kit-valvula-detentor-escuadra-media",
    "nombre": "Kit completo válvula + detentor, niples y rosetas",
    "codigo": "",
    "precio_ars": 58000,
    "imagen": "/images/repuestos/kit-radiador-3.jpg",
    "disponible": true
  },
  "termostato-ambiente-kalt-klt21": {
    "slug": "termostato-ambiente-kalt-klt21",
    "nombre": "Termostato de ambiente táctil KALT KLT-21",
    "codigo": "KLT-21",
    "precio_ars": 90000,
    "imagen": "/images/repuestos/termostato-klt21-1.jpg",
    "disponible": true
  },
  "ventilador-peisa-47w-90000090": {
    "slug": "ventilador-peisa-47w-90000090",
    "nombre": "Ventilador forzador 47W para caldera Peisa",
    "codigo": "90000090",
    "precio_ars": 468000,
    "imagen": "/images/repuestos/ventilador-1.jpg",
    "disponible": true
  }
};

export function buscarRepuesto(slug) {
  if (typeof slug !== "string") return null;
  return Object.prototype.hasOwnProperty.call(CATALOGO, slug) ? CATALOGO[slug] : null;
}
