#!/usr/bin/env python3
"""Generate captioned SVG placeholders for the Field Evidence gallery.
Run: python3 scripts/gen_placeholders.py
Each SVG is a stand-in until the real photo (assets/photos/XX.jpg) is dropped in.
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "photos")
os.makedirs(OUT, exist_ok=True)

# (filename, category, caption, accent)
ITEMS = [
    ("01", "field",   "Furnace Monitoring System — ITB Chem Lab (2025)"),
    ("02", "field",   "Vibration Monitoring — 650MW Muara Tawar (Allen Bradley PLC)"),
    ("03", "field",   "Instalasi MONITA — Online Monitoring System PT DBE"),
    ("04", "field",   "Instrumentasi Refinery — Pertamina RU VI Balongan (2023)"),
    ("05", "cert",    "Juara 1 Olgenas Paper Competition (2022)"),
    ("06", "cert",    "PIMNAS — Student Creativity Week (2022)"),
    ("07", "event",   "Gadjah Mada Festival 2022 — Property Coordinator"),
    ("08", "event",   "BEM FT UGM — Dir. Popular Issues (2022)"),
]

ACCENT = {"field": "#00d6c2", "cert": "#a29bfe", "event": "#6c5ce7"}

def svg(idx, cat, caption, accent):
    # wrap caption into <=2 lines
    words = caption.split()
    lines, cur = [], ""
    for w in words:
        if len(cur) + len(w) + 1 <= 30:
            cur = (cur + " " + w).strip()
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    lines = lines[:3]
    tspans = "".join(
        f'<tspan x="40" dy="{i*30+ (0 if i==0 else 0)}">{lines[i]}</tspan>'
        for i in range(len(lines))
    )
    start_y = 250 - (len(lines) - 1) * 15
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="600" height="440" viewBox="0 0 600 440">
  <rect width="600" height="440" fill="#111119"/>
  <rect x="6" y="6" width="588" height="428" rx="14" fill="none" stroke="{accent}" stroke-width="2" stroke-dasharray="8 6" opacity="0.7"/>
  <g transform="translate(270,120)" fill="none" stroke="{accent}" stroke-width="3" opacity="0.85">
    <rect x="0" y="0" width="60" height="46" rx="8"/>
    <circle cx="30" cy="23" r="13"/>
    <circle cx="30" cy="23" r="6" fill="{accent}"/>
    <path d="M6 44 L20 30 L30 38 L42 26 L54 40" />
  </g>
  <text x="40" y="{start_y}" fill="#f2f2f5" font-family="Inter, sans-serif" font-size="22" font-weight="600">{tspans}</text>
  <text x="40" y="400" fill="{accent}" font-family="Space Grotesk, sans-serif" font-size="14" letter-spacing="2">PLACEHOLDER — GANTI DGN FOTO ASLI ({idx}.jpg)</text>
</svg>'''

for idx, cat, caption in ITEMS:
    p = os.path.join(OUT, f"{idx}.svg")
    with open(p, "w") as f:
        f.write(svg(idx, cat, caption, ACCENT[cat]))
    print("wrote", p)
