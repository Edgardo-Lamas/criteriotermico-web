// Serverless Function (Vercel) — recibe los avisos de pago de Mercado Pago.
//
// Qué resuelve: el mail que MP le manda al vendedor dice cuánta plata entró,
// pero no QUÉ se vendió. Acá se cruza el pago con el external_reference que puso
// crear-preferencia.js y queda registrado el repuesto, la cantidad y el comprador
// en los logs de Vercel (Deployments → la función → Logs).
//
// Variables de entorno:
//   MP_ACCESS_TOKEN   → para consultarle a MP los datos reales del pago.
//   MP_WEBHOOK_SECRET → Panel MP → Tus integraciones → tu app → Webhooks →
//                       "Clave secreta". Sin esto NO se procesa nada.
//   RESEND_API_KEY    → para mandarle el aviso de venta por correo. Ver
//                       _aviso-venta.js. Sin esto el pago se procesa igual y la
//                       venta queda solo en el log, como antes del 3/9.
//
// Configurar en MP (Webhooks → Configurar notificaciones):
//   URL: https://crtermico.com/api/mp-webhook
//   Evento: "Pagos" (payment)
//
// 🔑 POR QUÉ SE VALIDA LA FIRMA: esta URL es pública. Sin validar, cualquiera le
// puede mandar un POST inventado diciendo "pagaron el ventilador" y ensuciar el
// registro de ventas. La firma prueba que el aviso lo mandó Mercado Pago.

import crypto from "node:crypto";

import { buscarRepuesto } from "./_catalogo.generado.js";
import { avisarVenta } from "./_aviso-venta.js";

// Formato oficial del manifest que MP firma con HMAC-SHA256:
//     id:<data.id>;request-id:<x-request-id>;ts:<ts>;
// El `id` sale del QUERY de la URL (?data.id=...), no del cuerpo. Si alguna de
// las tres partes no viene, se omite junto con su clave — no se deja vacía.
function armarManifest({ dataId, requestId, ts }) {
  let manifest = "";
  if (dataId) manifest += `id:${dataId};`;
  if (requestId) manifest += `request-id:${requestId};`;
  if (ts) manifest += `ts:${ts};`;
  return manifest;
}

function firmaValida(req, dataId) {
  const secreto = process.env.MP_WEBHOOK_SECRET;
  if (!secreto) return false;

  // x-signature llega como "ts=1704908010,v1=618c85..."
  const cabecera = req.headers["x-signature"];
  if (typeof cabecera !== "string") return false;

  const partes = {};
  for (const trozo of cabecera.split(",")) {
    const [clave, valor] = trozo.split("=");
    if (clave && valor) partes[clave.trim()] = valor.trim();
  }
  const { ts, v1 } = partes;
  if (!ts || !v1) return false;

  const requestId = req.headers["x-request-id"];
  const manifest = armarManifest({ dataId, requestId, ts });
  const esperada = crypto.createHmac("sha256", secreto).update(manifest).digest("hex");

  // Comparación en tiempo constante: comparar con === filtra información sobre
  // la clave a quien mida cuánto tarda en fallar. Mismo criterio que el gate de
  // /api/search-console.
  const a = Buffer.from(esperada, "utf-8");
  const b = Buffer.from(v1, "utf-8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Método no permitido");
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token || !process.env.MP_WEBHOOK_SECRET) {
    console.error("[mp-webhook] Falta MP_ACCESS_TOKEN o MP_WEBHOOK_SECRET");
    return res.status(500).end("Sin configurar");
  }

  // MP manda el id del recurso por query (?data.id=) y también en el cuerpo.
  // La firma se calcula sobre el del query, así que ese es el que manda.
  const dataId = req.query?.["data.id"] ?? req.query?.id ?? null;

  if (!firmaValida(req, dataId)) {
    console.error("[mp-webhook] Firma inválida — aviso descartado");
    return res.status(401).end("Firma inválida");
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  // Solo interesan los pagos. MP manda además merchant_order y otros tipos que
  // se contestan 200 para que no los siga reintentando.
  const tipo = body?.type ?? body?.topic;
  if (tipo !== "payment") {
    return res.status(200).end("OK");
  }

  const pagoId = body?.data?.id ?? dataId;
  if (!pagoId) return res.status(200).end("OK");

  try {
    const respuesta = await fetch(`https://api.mercadopago.com/v1/payments/${pagoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!respuesta.ok) {
      console.error("[mp-webhook] No se pudo consultar el pago", pagoId, respuesta.status);
      // 500 para que MP reintente: puede haber sido un problema momentáneo.
      return res.status(500).end("Error consultando el pago");
    }

    const pago = await respuesta.json();
    const referencia = pago.external_reference ?? "";
    const [, slug] = referencia.split(":");

    // El registro sale SIEMPRE, y antes del correo: si el aviso falla, la venta
    // igual quedó anotada acá.
    console.log(
      JSON.stringify({
        evento: "pago",
        estado: pago.status,
        detalle: pago.status_detail,
        repuesto: slug || "(sin referencia)",
        monto: pago.transaction_amount,
        moneda: pago.currency_id,
        comprador: pago.payer?.email ?? null,
        pago_id: pago.id,
        referencia,
      })
    );

    // Solo se avisa de la plata que entró. MP notifica además pagos creados,
    // rechazados y pendientes — el efectivo de Rapipago puede pagarse tres días
    // después o nunca, y eso todavía no es una venta.
    if (pago.status !== "approved") {
      return res.status(200).end("OK");
    }

    // El slug se cruza contra el catálogo del servidor para que el correo diga
    // el nombre del repuesto y no una cadena con guiones. Si la referencia vino
    // rara, se avisa igual: perder el aviso es peor que mandarlo incompleto.
    const repuesto = buscarRepuesto(slug) ?? {
      nombre: slug || "(repuesto no identificado)",
      codigo: "",
    };

    const telefono = [pago.payer?.phone?.area_code, pago.payer?.phone?.number]
      .filter(Boolean)
      .join(" ");

    const avisado = await avisarVenta({
      repuesto,
      unidades: Number(pago.metadata?.unidades) || 1,
      monto: pago.transaction_amount,
      comprador: {
        nombre: [pago.payer?.first_name, pago.payer?.last_name].filter(Boolean).join(" "),
        email: pago.payer?.email ?? "",
        telefono,
      },
      pagoId: pago.id,
      referencia,
    });

    // 500 a propósito cuando el correo no salió: MP reintenta la notificación y
    // hay una segunda oportunidad de que el aviso llegue. La Idempotency-Key de
    // Resend evita que ese reintento mande el mismo correo dos veces.
    if (!avisado) {
      return res.status(500).end("Venta registrada, aviso no enviado");
    }

    return res.status(200).end("OK");
  } catch (e) {
    console.error("[mp-webhook] Fallo inesperado:", e);
    return res.status(500).end("Error");
  }
}
