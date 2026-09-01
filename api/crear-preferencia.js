// Serverless Function (Vercel) — crea la preferencia de pago en Mercado Pago.
//
// Vercel corre esto al margen de Astro: cualquier archivo en /api/*.js se
// despliega como función, aunque el sitio sea estático. La consume el botón
// "Comprar ahora" de la ficha de repuesto (src/components/BotonComprar.astro).
//
// 🔑 EL PRECIO NO VIAJA DESDE EL NAVEGADOR. Si el monto lo mandara el cliente,
// cualquiera lo edita en las herramientas del navegador y compra un repuesto de
// $468.000 por un peso. Acá se recibe SOLO el slug y el precio sale del catálogo
// del servidor, generado desde los mismos JSON que muestra la ficha.
//
// Variables de entorno (Vercel → Settings → Environment Variables):
//   MP_ACCESS_TOKEN  → Panel MP → Tus integraciones → tu app → Credenciales.
//                      "TEST-…" para probar, "APP_USR-…" para cobrar de verdad.
//                      Es la llave de la caja: NUNCA en el repo ni en el front.
//   MP_STATEMENT_DESCRIPTOR → opcional. Lo que el comprador ve en el resumen de
//                      la tarjeta. Sin esto aparece el nombre del titular de la
//                      cuenta, y el que compró en "Criterio Térmico" no lo
//                      reconoce y desconoce la compra.
//   SITE_URL         → opcional, por defecto https://crtermico.com
//
// Si MP_ACCESS_TOKEN no está cargada, responde 503 y el botón cae a WhatsApp:
// el sitio nunca queda con un botón de compra que no cobra.

import { buscarRepuesto } from "./_catalogo.generado.js";

const MP_API = "https://api.mercadopago.com/checkout/preferences";
const MAX_CANTIDAD = 10;
// La preferencia caduca a las 24 h: un enlace de pago viejo cobraría a un precio
// que ya cambió, y en Argentina los precios de repuestos se mueven seguido.
const VALIDEZ_HORAS = 24;

function siteUrl() {
  return (process.env.SITE_URL || "https://crtermico.com").replace(/\/$/, "");
}

function json(res, status, cuerpo) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(cuerpo));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Método no permitido" });
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    // No es un error del visitante: todavía no se cargaron las credenciales.
    return json(res, 503, {
      error: "pagos_no_configurados",
      mensaje: "El pago online todavía no está habilitado.",
    });
  }

  // El body llega parseado cuando el Content-Type es JSON, pero no siempre:
  // si viene como texto se parsea a mano en vez de reventar con un 500.
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return json(res, 400, { error: "Cuerpo inválido" });
    }
  }
  const { slug, cantidad } = body ?? {};

  const repuesto = buscarRepuesto(slug);
  if (!repuesto) {
    return json(res, 404, { error: "Repuesto inexistente" });
  }
  if (!repuesto.disponible) {
    return json(res, 409, {
      error: "sin_stock",
      mensaje: "Este repuesto no está disponible en este momento.",
    });
  }

  // Cantidad: entero entre 1 y MAX_CANTIDAD. Un pedido más grande que eso se
  // coordina a mano — hay que confirmar stock real antes de cobrarlo.
  // Si no viene, es 1; pero si viene mal (1.5, "dos", -3) se rechaza en vez de
  // caer a 1 en silencio: cobrarle a alguien una cantidad distinta de la que
  // pidió es peor que devolverle un error.
  const unidades = cantidad === undefined || cantidad === null ? 1 : cantidad;
  if (!Number.isInteger(unidades) || unidades < 1 || unidades > MAX_CANTIDAD) {
    return json(res, 400, { error: "Cantidad fuera de rango" });
  }

  const base = siteUrl();
  const esProduccion = !base.includes("localhost") && !base.includes("127.0.0.1");
  const ahora = new Date();
  const vence = new Date(ahora.getTime() + VALIDEZ_HORAS * 60 * 60 * 1000);

  // Identifica la venta en el panel de MP y en el webhook. El timestamp evita
  // que dos compras del mismo repuesto se confundan entre sí.
  const referencia = `repuesto:${repuesto.slug}:${ahora.getTime()}`;

  const preferencia = {
    items: [
      {
        id: repuesto.codigo || repuesto.slug,
        title: repuesto.nombre,
        quantity: unidades,
        currency_id: "ARS",
        unit_price: repuesto.precio_ars,
        picture_url: repuesto.imagen ? `${base}${repuesto.imagen}` : undefined,
        category_id: "home_appliances",
      },
    ],
    back_urls: {
      success: `${base}/compra/exito`,
      failure: `${base}/compra/error`,
      pending: `${base}/compra/pendiente`,
    },
    external_reference: referencia,
    metadata: { slug: repuesto.slug, unidades },
    expires: true,
    expiration_date_from: ahora.toISOString(),
    expiration_date_to: vence.toISOString(),
  };

  // MP rechaza auto_return si back_urls.success no es una URL pública, así que
  // en desarrollo local se omite y el comprador vuelve con el botón de MP.
  if (esProduccion) {
    preferencia.auto_return = "approved";
    preferencia.notification_url = `${base}/api/mp-webhook`;
  }

  // Lo que el comprador lee en el resumen de la tarjeta. MP lo recorta, así que
  // se manda ya acortado en vez de dejar que lo corte por la mitad.
  const descriptor = (process.env.MP_STATEMENT_DESCRIPTOR || "CRITERIOTERM")
    .toUpperCase()
    .slice(0, 13);
  if (descriptor) preferencia.statement_descriptor = descriptor;

  try {
    const respuesta = await fetch(MP_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // Evita que un doble clic o un reintento de red creen dos preferencias.
        "X-Idempotency-Key": referencia,
      },
      body: JSON.stringify(preferencia),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      // El detalle de MP va al log del servidor, no al navegador: puede incluir
      // información de la cuenta que el visitante no tiene por qué ver.
      console.error("[mp] Error creando preferencia:", respuesta.status, datos);
      return json(res, 502, { error: "No se pudo iniciar el pago" });
    }

    // Con credenciales de prueba hay que mandar al comprador al checkout de
    // sandbox; el init_point normal pediría plata de verdad.
    const esPrueba = token.startsWith("TEST-");
    const destino = esPrueba
      ? datos.sandbox_init_point || datos.init_point
      : datos.init_point;

    if (!destino) {
      console.error("[mp] Preferencia creada sin init_point:", datos);
      return json(res, 502, { error: "No se pudo iniciar el pago" });
    }

    return json(res, 200, { init_point: destino, referencia, modo: esPrueba ? "prueba" : "produccion" });
  } catch (e) {
    console.error("[mp] Fallo de red al crear la preferencia:", e);
    return json(res, 502, { error: "No se pudo iniciar el pago" });
  }
}
