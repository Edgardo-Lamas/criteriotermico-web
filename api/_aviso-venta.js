// Helper de las Serverless Functions — le avisa a Edgardo por correo que se
// vendió un repuesto. NO es una ruta: Vercel ignora los archivos de /api que
// empiezan con "_" (mismo criterio que _catalogo.generado.js).
//
// 🔑 POR QUÉ EXISTE: hasta ahora una venta quedaba solamente en los logs de
// Vercel. Alguien que compra un domingo a la noche no se notaba hasta que
// alguien abriera el panel — y el sitio cobra plata de verdad desde el 1/9.
// Este es el aviso que faltaba.
//
// 🔑 POR QUÉ RESEND Y NO ZOHO: el plan Forever Free de Zoho Mail no da SMTP
// (solo navegador y app), así que la casilla del dominio puede RECIBIR el aviso
// pero no puede mandarlo. Resend firma su propio subdominio `send.crtermico.com`
// y por eso no toca el SPF de Zoho, que es el que hace andar el correo real.
//
// Variables de entorno (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY  → la carga sola la integración de Resend del Marketplace.
//                     Es una credencial: nunca en el repo ni con prefijo PUBLIC_.
//   AVISO_VENTA_A   → opcional. Destinatario. Por defecto, la casilla del dominio.
//                     Admite varias separadas por coma.
//   AVISO_VENTA_DE  → opcional. Remitente. Tiene que ser del dominio verificado
//                     en Resend, o el envío se rechaza.
//
// Si RESEND_API_KEY no está cargada, no se manda nada y se avisa en el log: el
// cobro nunca se cae por un problema del correo.

const RESEND_API = "https://api.resend.com/emails";

const DESTINO_POR_DEFECTO = "lamasedgardo@crtermico.com";
const REMITENTE_POR_DEFECTO = "Criterio Térmico <avisos@send.crtermico.com>";

const pesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/** Escapa el texto que entra al HTML del correo. El nombre y el correo del
 *  comprador los escribe un desconocido: sin esto, un `<` suyo rompe el mensaje. */
function esc(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function filas(datos) {
  const { repuesto, unidades, monto, comprador, pagoId, referencia } = datos;

  return [
    ["Repuesto", repuesto.nombre],
    repuesto.codigo ? ["Código", repuesto.codigo] : null,
    ["Unidades", String(unidades)],
    ["Cobrado", pesos.format(monto)],
    ["Comprador", comprador.nombre || "(no informado)"],
    ["Correo", comprador.email || "(no informado)"],
    comprador.telefono ? ["Teléfono", comprador.telefono] : null,
    ["Pago Nº", String(pagoId)],
    ["Referencia", referencia || "(sin referencia)"],
  ].filter(Boolean);
}

function cuerpoHtml(datos) {
  const celdas = filas(datos)
    .map(
      ([clave, valor]) =>
        `<tr>` +
        `<td style="padding:6px 14px 6px 0;color:#5b6672;white-space:nowrap;vertical-align:top">${esc(clave)}</td>` +
        `<td style="padding:6px 0;color:#101a24;font-weight:600">${esc(valor)}</td>` +
        `</tr>`
    )
    .join("");

  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#101a24">
  <p style="margin:0 0 4px">Se vendió un repuesto en <strong>crtermico.com</strong>.</p>
  <table style="border-collapse:collapse;margin:14px 0">${celdas}</table>
  <p style="margin:0 0 10px">Escribile al comprador para arreglar la entrega: el sitio cobra, pero no coordina nada.</p>
  <p style="margin:0;color:#5b6672;font-size:13px">El sitio no descuenta stock. Si era la última unidad, hay que bloquear la compra a mano.</p>
</div>`;
}

function cuerpoTexto(datos) {
  return (
    "Se vendió un repuesto en crtermico.com.\n\n" +
    filas(datos)
      .map(([clave, valor]) => `${clave}: ${valor}`)
      .join("\n") +
    "\n\nEscribile al comprador para arreglar la entrega: el sitio cobra, pero no coordina nada.\n" +
    "El sitio no descuenta stock. Si era la última unidad, hay que bloquear la compra a mano."
  );
}

/**
 * Manda el aviso de venta.
 *
 * Devuelve `true` si Resend lo aceptó, y `false` si falló o si no está
 * configurado. Quien llama decide qué hacer con eso — el webhook contesta 500
 * para que Mercado Pago reintente y haya una segunda oportunidad.
 *
 * 🔑 La `Idempotency-Key` va atada al número de pago: Mercado Pago avisa varias
 * veces del mismo pago, y sin esto cada reintento sería otro correo igual.
 * Resend la recuerda 24 h.
 */
export async function avisarVenta(datos) {
  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    console.error("[aviso-venta] Falta RESEND_API_KEY — la venta no se avisó por correo");
    return false;
  }

  const destinatarios = (process.env.AVISO_VENTA_A || DESTINO_POR_DEFECTO)
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  const asunto = `Venta: ${datos.repuesto.nombre} — ${pesos.format(datos.monto)}`;

  try {
    const respuesta = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clave}`,
        "Idempotency-Key": `venta-${datos.pagoId}`,
      },
      body: JSON.stringify({
        from: process.env.AVISO_VENTA_DE || REMITENTE_POR_DEFECTO,
        to: destinatarios,
        // Contestarle al aviso le escribe al comprador, sin copiar la dirección
        // a mano desde el cuerpo del mensaje.
        reply_to: datos.comprador.email || undefined,
        subject: asunto,
        html: cuerpoHtml(datos),
        text: cuerpoTexto(datos),
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text().catch(() => "");
      console.error("[aviso-venta] Resend rechazó el envío:", respuesta.status, detalle);
      return false;
    }

    console.log(JSON.stringify({ evento: "aviso_venta_enviado", pago_id: datos.pagoId }));
    return true;
  } catch (e) {
    console.error("[aviso-venta] Fallo de red al mandar el aviso:", e);
    return false;
  }
}
