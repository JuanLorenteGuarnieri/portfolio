#!/usr/bin/env python3
"""Recorta fuentes typeface.json (las usadas por <Text3D>) a los glifos que se usan:
Basic Latin + Latin-1 + Latin Extended-A + puntuación general. Reduce el JS final.

Uso:  python3 tools/subset_fonts.py <entrada.json> <salida.json> [<entrada2.json> <salida2.json> ...]
Requiere el JSON ORIGINAL completo (regenerable desde el .ttf con https://gero3.github.io/facetype.js/).
"""
import json, sys
KEEP = set(range(0x20,0x7F)) | set(range(0xA0,0x180)) | set(range(0x2010,0x2028)) | {0x20AC,0x2122,0x2190,0x2192,0x00B7,0x2022,0x2026}
for src,dst in [(a,b) for a,b in zip(sys.argv[1::2], sys.argv[2::2])]:
    d = json.load(open(src, encoding='utf-8'))
    before = len(d['glyphs'])
    d['glyphs'] = {k:v for k,v in d['glyphs'].items() if len(k)==1 and ord(k) in KEEP}
    s = json.dumps(d, ensure_ascii=False, separators=(',',':'))
    open(dst,'w',encoding='utf-8').write(s)
    import os
    print(f"{os.path.basename(src)}: {before} -> {len(d['glyphs'])} glifos, {os.path.getsize(src)/1024:.0f} KB -> {os.path.getsize(dst)/1024:.0f} KB")
