// Serverless Function (Vercel) — Google Search Console
//
// Vercel corre esto al margen de Astro: cualquier archivo en /api/*.js se
// despliega como función, aunque el sitio sea estático. La consume panel.astro.
//
// Auth Google: OAuth2 con refresh token (se REUSAN las credenciales de
// "Sabiduría para el Corazón" — el scope webmasters.readonly de la cuenta de
// Edgardo abarca todas sus propiedades; solo cambia GSC_SITE).
//   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN
//   GSC_SITE  — la propiedad en Search Console. Para propiedad de dominio:
//               "sc-domain:criteriotermico.com.ar". Para prefijo de URL (lo que
//               sirve hoy en .vercel.app): "https://criteriotermico-web.vercel.app/".
//
// Gate: el sitio no tiene login, así que la protección real vive acá. Sin la
// contraseña correcta (PANEL_PASSWORD) la función responde 401 y nunca toca a
// Google. La página es HTML público, pero sin datos no expone nada.

const TTL_MS = 30 * 60 * 1000; // caché en memoria de la instancia

let cache = null;
let tokenCache = null;

function gscSite() {
  return process.env.GSC_SITE || "https://criteriotermico-web.vercel.app/";
}

async function getAccessToken() {
  if (tokenCache && tokenCache.exp > Date.now()) return tokenCache.token;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }).toString(),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("OAuth error: " + JSON.stringify(data));

  tokenCache = { token: data.access_token, exp: Date.now() + (data.expires_in - 60) * 1000 };
  return data.access_token;
}

async function query(token, body) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(gscSite())}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// Compara sin cortar en el primer carácter distinto (evita filtrar el largo).
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  let diff = a.length ^ b.length;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i % b.length);
  return diff === 0;
}

export default async function handler(req, res) {
  // ---- Gate ----
  const pass = process.env.PANEL_PASSWORD;
  if (!pass) {
    return res.status(503).json({ live: false, error: "PANEL_PASSWORD no está configurada en Vercel." });
  }
  const given = req.headers["x-panel-key"] || (req.query && req.query.key) || "";
  if (!safeEqual(String(given), pass)) {
    return res.status(401).json({ live: false, error: "Contraseña incorrecta." });
  }

  res.setHeader("Cache-Control", "private, no-store");

  if (cache && Date.now() - cache.fetchedAt < TTL_MS) {
    return res.status(200).json(cache.data);
  }

  const missing = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"].filter(
    (k) => !process.env[k]
  );
  if (missing.length) {
    return res.status(200).json({
      live: false,
      needsSetup: true,
      error: `Faltan variables de Google: ${missing.join(", ")}`,
    });
  }

  try {
    const token = await getAccessToken();

    const end = new Date().toISOString().split("T")[0];
    const start = new Date(Date.now() - 28 * 86400000).toISOString().split("T")[0];
    const base = { startDate: start, endDate: end };

    const [queryData, pageData, dailyData, deviceData, countryData] = await Promise.all([
      query(token, { ...base, dimensions: ["query"], rowLimit: 100 }),
      query(token, { ...base, dimensions: ["page"], rowLimit: 10 }),
      query(token, { ...base, dimensions: ["date"], rowLimit: 28 }),
      query(token, { ...base, dimensions: ["device"], rowLimit: 3 }),
      query(token, { ...base, dimensions: ["country"], rowLimit: 5 }),
    ]);

    const daily = dailyData.rows || [];
    const totalClicks = daily.reduce((a, r) => a + r.clicks, 0);
    const totalImpressions = daily.reduce((a, r) => a + r.impressions, 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const avgPosition = daily.length > 0 ? daily.reduce((a, r) => a + r.position, 0) / daily.length : 0;

    const allQueries = (queryData.rows || []).map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr * 100,
      position: Math.round(r.position * 10) / 10,
    }));

    // Oportunidades: ya aparecés (posición 5–20, página 1–2 de Google) pero con
    // impresiones que no convierten en clic. Subir esas es lo más rentable.
    const opportunities = allQueries
      .filter((q) => q.position >= 5 && q.position <= 20)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 8);

    const strip = (u) =>
      u.replace(gscSite().replace(/^sc-domain:/, "https://").replace(/\/$/, ""), "") || "/";

    const result = {
      live: true,
      period: `${start} → ${end}`,
      site: gscSite(),
      totals: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCTR, position: avgPosition },
      queries: [...allQueries].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 10),
      opportunities,
      pages: (pageData.rows || []).map((r) => ({
        page: strip(r.keys[0]),
        clicks: r.clicks,
        impressions: r.impressions,
      })),
      devices: (deviceData.rows || []).map((r) => ({
        device: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
      })),
      countries: (countryData.rows || []).map((r) => ({
        country: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
      })),
      daily: daily.map((r) => ({ date: r.keys?.[0] || "", clicks: r.clicks, impressions: r.impressions })),
    };

    cache = { data: result, fetchedAt: Date.now() };
    return res.status(200).json(result);
  } catch (err) {
    return res.status(200).json({ live: false, error: err.message });
  }
}
