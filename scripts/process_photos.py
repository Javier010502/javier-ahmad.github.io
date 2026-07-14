#!/usr/bin/env python3
"""Copy the 9 field photos, resize/optimize, and replace gallery placeholders."""
import os, shutil
from PIL import Image

CACHE = "/home/lenovo/.hermes/cache/images"
DST = "/home/lenovo/personal_website/assets/photos"
os.makedirs(DST, exist_ok=True)

# src cache name -> target number (01..09)
MAP = {
    "img_9d43835aa266.jpg": "01",  # motor IE3 Muara Tawar
    "img_a5cf5363bc20.jpg": "02",  # azbil panel Pertamina RU VI
    "img_0708d7296e05.jpg": "03",  # generator ComAp Selayar
    "img_b52c4bd50068.jpg": "04",  # azbil local indicator ITB
    "img_e45962a82305.jpg": "05",  # relay panel Muara Tawar
    "img_5d82ad046443.jpg": "06",  # PLC rack Muara Tawar
    "img_0f050232b4f3.jpg": "07",  # electrical cabinet Bandung
    "img_9f05a3b9c747.jpg": "08",  # datalog GAA Bengkalis Bandung
    "img_3da81179ffe0.jpg": "09",  # MONITA reactor ITB
}

for src, num in MAP.items():
    p = os.path.join(CACHE, src)
    if not os.path.exists(p):
        print("MISSING", src); continue
    im = Image.open(p).convert("RGB")
    w, h = im.size
    if w > 1200:
        im = im.resize((1200, int(h * 1200 / w)), Image.LANCZOS)
    out = os.path.join(DST, f"{num}.jpg")
    im.save(out, "JPEG", quality=82, optimize=True, progressive=True)
    print(f"{num}.jpg <- {src} ({w}x{h} -> {im.size[0]}x{im.size[1]})")

# remove old svg placeholders
for f in os.listdir(DST):
    if f.endswith(".svg"):
        os.remove(os.path.join(DST, f))
        print("removed", f)
print("DONE", sorted(os.listdir(DST)))
