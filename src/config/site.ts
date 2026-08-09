export const siteConfig = {
  nombre: "Criterio Térmico",
  // Debe coincidir con `site` en astro.config.mjs (ver la nota de ahí).
  dominio: "https://crtermico.com",
  whatsapp: "5491152604237", // Edgardo
  whatsappAlejandro: "5491131986298", // Alejandro
  whatsappMensajeGenerico: "Hola, quiero consultar por un repuesto.",
  direccion: "Av. Domingo French 210, Villa Martelli",
  horario: "Lunes a viernes 9 a 18 hs",
  telefono: "+5491152604237",
  // Casilla propia del dominio (Zoho). Es real y se publica: no reemplazar por un
  // valor de ejemplo. Mismo criterio que los dos números de WhatsApp.
  email: "lamasedgardo@crtermico.com",
  descripcion:
    "Repuestos originales de calderas en Villa Martelli, Vicente López. Ventiladores, flujostatos, termostatos táctiles y válvulas. Asesoramiento técnico incluido.",
  experiencia: "20 años",
};

/** Se muestra cuando un repuesto todavía no tiene foto propia. Es markup estático:
 *  si cambia la paleta hay que actualizarlo a mano, no lee los tokens del sitio. */
export const PLACEHOLDER_REPUESTO = "/images/repuestos/placeholder.svg";
