#!/usr/bin/env python3
"""Genera la imagen OG de la propuesta a Sanitarios San Martín (/sanitarios-san-martin).

Replica la portada del PDF en 1200x630, que es lo que se ve al pegar el enlace en
WhatsApp. Se corre a mano cuando cambia la portada; el resultado se commitea:

    python3 scripts/generar-og-propuesta.py

Necesita `rsvg-convert` (brew install librsvg). Las tipografías salen del sistema:
PT Serif viene con macOS y es la serif que usa el PDF.
"""

import base64
import pathlib
import subprocess

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "public/images/og-sanitarios.png"

# El logo calado que trae el propio PDF (la marca sola, sin el texto, para no repetir
# el nombre que ya va como título). `public/logo-mark.png` no sirve acá: lleva fondo
# oscuro sólido y sobre el lienzo negro se recorta como un cuadrado visible.
logo = base64.b64encode((RAIZ / "public/images/propuesta-logo.png").read_bytes()).decode()

svg = f"""<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.72" cy="0.42" r="0.62">
      <stop offset="0%"   stop-color="#8a4a12" stop-opacity="0.95"/>
      <stop offset="45%"  stop-color="#3d2109" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0a0a0c" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="#0a0a0c"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <image xlink:href="data:image/png;base64,{logo}"
         x="88" y="58" width="140" height="139"/>

  <text x="90" y="272" font-family="Hanken Grotesk, Helvetica Neue, Helvetica, sans-serif"
        font-size="21" font-weight="600" letter-spacing="4.6" fill="#e0932c">EDICIÓN PARA DISTRIBUIDOR</text>

  <text x="90" y="358" font-family="PT Serif, Georgia, serif"
        font-size="80" font-weight="700" fill="#ffffff">Criterio Térmico</text>

  <text x="90" y="416" font-family="PT Serif, Georgia, serif"
        font-size="37" fill="#c6c6cc">Planteo de trabajo conjunto</text>

  <rect x="90" y="452" width="104" height="4" fill="#e0932c"/>

  <rect x="90" y="536" width="1020" height="1" fill="#ffffff" fill-opacity="0.13"/>

  <text x="90" y="573" font-family="Hanken Grotesk, Helvetica Neue, Helvetica, sans-serif"
        font-size="15" font-weight="600" letter-spacing="3.1" fill="#8d8d96">PRESENTADO A</text>

  <text x="90" y="605" font-family="PT Serif, Georgia, serif"
        font-size="27" fill="#eaeaef">Sanitarios San Martín</text>

  <text x="1110" y="605" text-anchor="end" font-family="PT Serif, Georgia, serif"
        font-size="27" fill="#e0932c">crtermico.com</text>
</svg>"""

svg_tmp = RAIZ / "public/images/.og-sanitarios.svg"
svg_tmp.write_text(svg, encoding="utf-8")
try:
    subprocess.run(
        ["rsvg-convert", "-w", "1200", "-h", "630", "-o", str(SALIDA), str(svg_tmp)],
        check=True,
    )
finally:
    svg_tmp.unlink(missing_ok=True)

print(f"OK -> {SALIDA.relative_to(RAIZ)} ({SALIDA.stat().st_size // 1024} KB)")
