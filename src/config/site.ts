export const siteConfig = {
  nombre: "Criterio Térmico",
  // Debe coincidir con `site` en astro.config.mjs (ver la nota de ahí).
  dominio: "https://criteriotermico-web.vercel.app",
  whatsapp: "5491152604237", // Edgardo
  whatsappAlejandro: "5491131986298", // Alejandro
  whatsappMensajeGenerico: "Hola, quiero consultar por un repuesto Peisa.",
  direccion: "Villa Urquiza, CABA",
  horario: "Lunes a viernes 9 a 18 hs",
  telefono: "+5491152604237",
  descripcion:
    "Repuestos originales Peisa en Villa Urquiza, CABA. Ventiladores, flujostatos, termostatos táctiles y válvulas. Asesoramiento técnico incluido.",
  experiencia: "20 años",
};

/** Se muestra cuando un repuesto todavía no tiene foto propia. Es markup estático:
 *  si cambia la paleta hay que actualizarlo a mano, no lee los tokens del sitio. */
export const PLACEHOLDER_REPUESTO = "/images/repuestos/placeholder.svg";
