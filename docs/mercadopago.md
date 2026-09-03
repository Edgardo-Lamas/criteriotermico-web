# Cobro online con Mercado Pago

Cómo está armado el pago de repuestos en crtermico.com. Escrito el 2026-08-28,
encendido y cobrando desde el 2026-09-01.

---

## Cómo funciona

```
El cliente aprieta "Comprar ahora" en la ficha del repuesto
  → el navegador manda SOLO el slug a /api/crear-preferencia
  → la función busca el precio en el catálogo del servidor
  → crea la preferencia en Mercado Pago y devuelve la URL del checkout
  → el cliente paga en Mercado Pago
  → vuelve a /compra/exito (o /error, o /pendiente)
  → MP avisa a /api/mp-webhook y la venta queda registrada en los logs
```

### 🔑 El precio nunca viaja desde el navegador

La función recibe el `slug` y busca el monto en `api/_catalogo.generado.js`. Si el
precio lo mandara el cliente, cualquiera lo edita con las herramientas del navegador
y compra un repuesto de $468.000 por un peso.

Ese catálogo **se genera solo** desde `src/content/repuestos/*.json`
(`scripts/generar-catalogo.mjs`, enganchado al `prebuild`). Para cambiar un precio se
cambia el JSON de contenido y nada más: el precio que se muestra y el que se cobra
salen del mismo archivo, así que no se pueden desincronizar.

Un repuesto sin `precio_ars` queda fuera del catálogo a propósito: el `precio_usd` se
convierte al blue en el navegador y ese número no sirve como monto a cobrar. Su ficha
sigue vendiendo por WhatsApp.

---

## Los archivos

| Archivo | Qué hace |
|---|---|
| `api/crear-preferencia.js` | Crea el pago en MP. Valida slug, stock y cantidad. |
| `api/mp-webhook.js` | Recibe el aviso de pago y valida la firma de MP. |
| `api/_aviso-venta.js` | Le manda el correo del aviso de venta. No es una ruta. |
| `api/_catalogo.generado.js` | **Generado.** Precios del lado del servidor. |
| `scripts/generar-catalogo.mjs` | Lo genera desde el contenido. Corre en cada build. |
| `src/components/BotonComprar.astro` | El botón. Cae a WhatsApp si el pago falla. |
| `src/components/ResultadoCompra.astro` | Pantalla de vuelta desde MP. |
| `src/pages/compra/{exito,error,pendiente}.astro` | Las tres rutas de retorno. |

---

## Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Para qué | Obligatoria |
|---|---|---|
| `MP_ACCESS_TOKEN` | La llave de la caja. `TEST-…` para probar, `APP_USR-…` para cobrar. | Sí |
| `MP_WEBHOOK_SECRET` | Valida que el aviso de pago lo mandó MP y no un impostor. | Sí, para el webhook |
| `PUBLIC_PAGOS_ONLINE` | `"true"` enciende el botón. Sin esto la ficha vende por WhatsApp. | Sí, para que se vea |
| `MP_STATEMENT_DESCRIPTOR` | Lo que el comprador lee en el resumen de la tarjeta. Máx. 13 caracteres. | Recomendada |
| `SITE_URL` | Por defecto `https://crtermico.com`. | No |
| `RESEND_API_KEY` | Manda el aviso de venta. La carga sola la integración de Resend. | Sí, para el aviso |
| `AVISO_VENTA_A` | A quién le llega. Por defecto `lamasedgardo@crtermico.com`. Admite varias, separadas por coma. | No |
| `AVISO_VENTA_DE` | Remitente. Por defecto `avisos@send.crtermico.com`. | No |

⚠ **`MP_ACCESS_TOKEN` no va nunca en el repo ni en el frontend.** Quien lo tiene puede
cobrar en nombre de la cuenta. Lo carga Edgardo, que es el titular, directo en el panel
de Vercel, donde queda cifrado.

⚠ `PUBLIC_PAGOS_ONLINE` lleva el prefijo `PUBLIC_` porque Astro la necesita en el build
para decidir si dibuja el botón. Es un interruptor, no un secreto: no poner nada
sensible con ese prefijo, queda visible en el HTML.

---

## Encender el pago, paso a paso

### 1. Crear la aplicación en Mercado Pago

**La cuenta de Mercado Pago está a nombre de Edgardo.** Las ventas de repuestos del
sitio caen ahí y se informan bajo su CUIT. Lo hace él, en
[mercadopago.com.ar/developers/panel](https://www.mercadopago.com.ar/developers/panel):

1. **Tus integraciones → Crear aplicación**
2. Nombre: `Criterio Térmico`. Producto: pagos online (Checkout Pro).
3. En **Credenciales** aparecen las de prueba (`TEST-…`) y las de producción
   (`APP_USR-…`). Para habilitar las de producción MP pide la industria, la URL del
   sitio (`https://crtermico.com`) y aceptar los términos.

⚠ **Producción exige además validar identidad con reconocimiento facial.** Se hizo el
2026-09-01, después de una decena de intentos fallidos. Si vuelve a trabarse: no
reintentar en el momento (MP bloquea la validación por un rato), hacerlo desde la app
del celular y no desde el navegador, con luz de frente y sin anteojos.

⚠ **El botón de "activar credenciales de prueba" del panel está roto** — falla con
"Algo salió mal" en cada intento. No es un problema de la cuenta: las credenciales
`TEST-` están emitidas y se leen por API. La vía es el MCP de Mercado Pago
(`.mcp.json`, OAuth), que además creó el usuario de prueba **3655965507**
(`TESTUSER3476911726754698730`). La contraseña se revela en
`/developers/panel/app/1426858103774532/test-users`.

### 2. Probar con credenciales de prueba

1. Cargar en Vercel `MP_ACCESS_TOKEN` con el token **de prueba**, y
   `PUBLIC_PAGOS_ONLINE=true`.
2. En **Tus integraciones → tu app → Cuentas de prueba**, crear una cuenta
   *comprador*. No piden DNI ni datos bancarios reales.
3. Comprar un repuesto con las [tarjetas de prueba de MP][tarjetas]. El código
   detecta el prefijo `TEST-` y manda al checkout de sandbox solo.
4. Verificar: que redirija a `/compra/exito`, y que en los logs de Vercel aparezca la
   línea del webhook con el repuesto y el monto.

### 3. Configurar el webhook

En **Tus integraciones → tu app → Webhooks → Configurar notificaciones**:

- URL: `https://crtermico.com/api/mp-webhook`
- Evento: **Pagos**
- Copiar la **clave secreta** que genera MP → cargarla en Vercel como
  `MP_WEBHOOK_SECRET`

### 4. Pasar a producción

Reemplazar `MP_ACCESS_TOKEN` por el de producción (`APP_USR-…`) y volver a desplegar.
Nada más cambia.

[tarjetas]: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards

---

## La firma del webhook

Mercado Pago firma cada aviso con HMAC-SHA256. El texto que firma es:

```
id:<data.id>;request-id:<x-request-id>;ts:<ts>;
```

donde el `id` sale del **query de la URL** (`?data.id=…`), no del cuerpo. Si alguna de
las tres partes no viene, se omite junto con su clave.

### Guardar la configuración regenera la clave secreta

Esto costó una tarde entera de 401 y no está escrito en la documentación de MP.

En **Webhooks → Configurar notificaciones**, cada vez que se aprieta *Guardar*, Mercado
Pago **emite una clave secreta nueva** y descarta la anterior. Copiar la clave y después
volver a guardar —para ajustar los eventos, para revisar la URL, para lo que sea— deja
la clave copiada vencida en el mismo acto de copiarla.

El orden correcto es: entrar, copiar la clave, **salir sin guardar**, y recién ahí
cargarla en Vercel. Si hubo que guardar algo, la clave que vale es la de después de
guardar, no la de antes.

El síntoma es indistinguible de haber copiado la clave del modo equivocado: 401 en cada
aviso, sin ningún error que explique nada. Antes de sospechar del código, volver a
copiar la clave.

⚠ La firma también es fácil de equivocar, y equivocarla **no da error**: el webhook
simplemente rechaza todos los pagos legítimos con 401. La Edge Function del SaaS
(`supabase/functions/mercadopago-webhook`, otro repo) lo arma mal hoy —
`id:<x-request-id>;request-date:<ts>;` — y hay que corregirla con este mismo formato
antes de cobrar ahí.

---

## Aviso de venta por correo (3/9/2026)

Antes de esto, una venta quedaba **solamente** en los logs de Vercel: quien comprara un
domingo a la noche no se notaba hasta que alguien abriera el panel. Ahora cada pago
**aprobado** manda un correo con el repuesto, las unidades, el monto y los datos del
comprador. Contestarle al aviso le escribe al comprador directo (`reply_to`).

El registro en el log **no se sacó**: sale siempre y antes del correo, así que si el
aviso falla la venta igual quedó anotada.

### Por qué Resend y no la casilla de Zoho

El plan **Forever Free de Zoho Mail no da SMTP** — es solo navegador y app. La casilla del
dominio puede *recibir* el aviso, pero no puede *mandarlo*. Resend es una integración del
Marketplace de Vercel en **plan gratis** (3.000 correos/mes; acá van a ser unos pocos),
instalada con `vercel integration add resend --plan free`, región `sa-east-1`.

### El remitente vive en un subdominio, a propósito

El remitente es `avisos@send.crtermico.com`. Resend verificó **`send.crtermico.com`**, no
el dominio pelado, y sus registros quedaron todos ahí abajo:

| Registro | Valor |
|---|---|
| `send.send.crtermico.com` TXT | `v=spf1 include:amazonses.com ~all` |
| `send.send.crtermico.com` MX | `feedback-smtp.sa-east-1.amazonses.com` |
| `resend._domainkey.send.crtermico.com` TXT | la clave DKIM de Resend |

🔴 **Por eso el `v=spf1 include:zoho.com ~all` de la raíz quedó intacto.** Nunca puede
haber **dos** registros SPF en el mismo nombre: mandar desde `avisos@crtermico.com` obliga
a fusionar los dos en uno solo, y si eso queda mal, el correo real de Zoho empieza a caer
en spam sin que nada avise. Si algún día hace falta, se fusiona a mano — no se agrega un
segundo SPF.

### Las dos decisiones que parecen errores y no lo son

- **`Idempotency-Key: venta-<nº de pago>`.** MP avisa varias veces del mismo pago; sin esto
  cada reintento sería otro correo igual. Resend la recuerda 24 h.
- **El webhook contesta 500 cuando el correo no sale.** Es a propósito: MP reintenta la
  notificación y el aviso tiene una segunda oportunidad. La venta ya está en el log, y la
  `Idempotency-Key` evita que el reintento duplique el correo si en realidad sí se había
  mandado. **No "arreglarlo" a 200.**

### Lo que el aviso NO cubre

- **Solo los pagos aprobados.** El efectivo en Rapipago llega como `pending` y puede pagarse
  tres días después o nunca: eso va al log nada más. Avisar de los pendientes es una
  decisión, no un olvido.
- **No descuenta stock.** El correo lo dice en una línea, pero bloquear la compra sigue
  siendo a mano (`disponible: false` en el JSON).

### Cómo se probó

Sin pagar nada y sin tocar MP: el envío real se verificó contra la API de Resend (llegó,
`last_event: delivered`), y el webhook se corrió local con la firma HMAC armada a mano
contra un secreto de prueba, con el pago y Resend simulados. Seis casos: aprobado, firma
falsa (401), rechazado, pendiente, Resend caído (500) y referencia rota. El script quedó
fuera del repo — es de un rato, no una suite.

⚠ **`vercel integration add` sobrescribe `.env.local` sin preguntar.** Corre `env pull` por
su cuenta y reemplaza el archivo. Copiarlo aparte antes de instalar una integración.

---

## Decisiones tomadas, por si hay que revisarlas

- **Checkout Pro** (redirección a MP) en vez de Bricks o Checkout API: el sitio no
  toca datos de tarjeta en ningún momento, que es lo que menos responsabilidad deja.
- **La preferencia caduca a las 24 h.** Un enlace viejo cobraría a un precio que ya
  cambió, y los precios de repuestos se mueven seguido.
- **Tope de 10 unidades por compra.** Más que eso hay que confirmar stock real antes
  de cobrarlo.
- **El botón cae a WhatsApp** si la función responde 503 o falla. Nunca queda un botón
  de compra que no cobra.
- **No hay stock automático.** `disponible: false` en el JSON bloquea la compra, pero
  hay que ponerlo a mano. Si se vende el último y alguien paga, hay que devolverle.
- **El envío no se cobra ni se pide dirección.** Se coordina por WhatsApp después del
  pago, como se coordina hoy. Si el volumen crece, esto es lo primero que hay que
  cambiar.
