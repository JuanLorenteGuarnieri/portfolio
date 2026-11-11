#!/usr/bin/env python3
"""Reduce el peso (descarga y VRAM) de los GLB reescalando y recomprimiendo sus texturas.
Uso:  python3 tools/optimize_glb.py <carpeta_origen> <carpeta_destino>      (requiere Pillow)
Revisa visualmente el resultado antes de sustituir los originales.
 - No toca la geometría ni los materiales.
 - Texturas > MAX_DIM se reescalan (LANCZOS) a MAX_DIM.
 - PNG sin canal alfa realmente usado -> JPEG (base: q85 4:2:0; datos/normal: q92 4:4:4).
 - PNG con alfa real -> PNG optimizado.
"""
import struct, json, io, sys, os
from PIL import Image

MAX_DIM = 1024

def read_glb(path):
    data = open(path, 'rb').read()
    magic, ver, length = struct.unpack('<4sII', data[:12])
    assert magic == b'glTF' and ver == 2
    off = 12; js = None; binc = b''
    while off < len(data):
        clen, ctype = struct.unpack('<II', data[off:off+8]); off += 8
        chunk = data[off:off+clen]; off += clen
        if ctype == 0x4E4F534A: js = json.loads(chunk.decode('utf-8'))
        elif ctype == 0x004E4942: binc = chunk
    return js, binc

def write_glb(path, js, binc):
    jb = json.dumps(js, separators=(',', ':')).encode('utf-8')
    jb += b' ' * ((4 - len(jb) % 4) % 4)
    binc += b'\x00' * ((4 - len(binc) % 4) % 4)
    total = 12 + 8 + len(jb) + 8 + len(binc)
    with open(path, 'wb') as f:
        f.write(struct.pack('<4sII', b'glTF', 2, total))
        f.write(struct.pack('<II', len(jb), 0x4E4F534A)); f.write(jb)
        f.write(struct.pack('<II', len(binc), 0x004E4942)); f.write(binc)

def image_slots(js):
    usage = {}
    def add(t, slot):
        if t is None: return
        src = js['textures'][t['index']]['source']
        usage.setdefault(src, set()).add(slot)
    for m in js.get('materials', []):
        p = m.get('pbrMetallicRoughness', {})
        add(p.get('baseColorTexture'), 'base'); add(p.get('metallicRoughnessTexture'), 'data')
        add(m.get('normalTexture'), 'data'); add(m.get('occlusionTexture'), 'data')
        add(m.get('emissiveTexture'), 'base')
        for ev in m.get('extensions', {}).values():
            for k, v in ev.items():
                if isinstance(v, dict) and 'index' in v:
                    add(v, 'data' if 'Factor' not in k and 'Color' not in k else 'base')
    return usage

def process(src, dst):
    js, binc = read_glb(src)
    assert len(js['buffers']) == 1 and 'uri' not in js['buffers'][0]
    slots = image_slots(js)
    new_images = {}
    for i, im in enumerate(js.get('images', [])):
        if 'bufferView' not in im: continue
        bv = js['bufferViews'][im['bufferView']]
        raw = binc[bv.get('byteOffset', 0): bv.get('byteOffset', 0) + bv['byteLength']]
        I = Image.open(io.BytesIO(raw)); I.load()
        w, h = I.size
        has_alpha = False
        if I.mode in ('RGBA', 'LA') or (I.mode == 'P' and 'transparency' in I.info):
            a = I.convert('RGBA').getchannel('A').getextrema()
            has_alpha = a[0] < 255
        need_resize = max(w, h) > MAX_DIM
        is_png = im.get('mimeType') == 'image/png'
        if not need_resize and not (is_png and not has_alpha and (len(raw) > 40_000)):
            continue                      # ya es pequeña o ligera: no se toca
        if need_resize:
            s = MAX_DIM / max(w, h)
            I = I.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
        data_tex = 'data' in slots.get(i, {'base'}) and 'base' not in slots.get(i, {'base'})
        buf = io.BytesIO()
        if has_alpha:
            I.convert('RGBA').save(buf, 'PNG', optimize=True); mime = 'image/png'
        else:
            if data_tex: I.convert('RGB').save(buf, 'JPEG', quality=92, subsampling=0, optimize=True)
            else:        I.convert('RGB').save(buf, 'JPEG', quality=85, subsampling=2, optimize=True, progressive=True)
            mime = 'image/jpeg'
        out = buf.getvalue()
        if len(out) < len(raw):
            new_images[i] = (out, mime)
    # reconstruir BIN
    order = sorted(range(len(js['bufferViews'])), key=lambda k: js['bufferViews'][k].get('byteOffset', 0))
    img_bv = {js['images'][i]['bufferView']: i for i in new_images}
    out_bin = bytearray(); new_off = {}
    for k in order:
        bv = js['bufferViews'][k]
        if k in img_bv:
            chunk = new_images[img_bv[k]][0]
        else:
            o = bv.get('byteOffset', 0); chunk = binc[o:o + bv['byteLength']]
        pad = (4 - len(out_bin) % 4) % 4
        out_bin += b'\x00' * pad
        new_off[k] = len(out_bin); bv['byteOffset'] = len(out_bin); bv['byteLength'] = len(chunk)
        out_bin += chunk
    for i, (_, mime) in new_images.items(): js['images'][i]['mimeType'] = mime
    js['buffers'][0]['byteLength'] = len(out_bin)
    write_glb(dst, js, bytes(out_bin))
    return len(new_images), len(js.get('images', []))

if __name__ == '__main__':
    src_dir, dst_dir = sys.argv[1], sys.argv[2]
    tot_a = tot_b = 0
    for fn in sorted(os.listdir(src_dir)):
        if not fn.endswith('.glb'): continue
        s = os.path.join(src_dir, fn); d = os.path.join(dst_dir, fn)
        n, tot = process(s, d)
        a, b = os.path.getsize(s), os.path.getsize(d)
        tot_a += a; tot_b += b
        if n: print(f'{fn:22} {a/1e6:7.2f} MB -> {b/1e6:6.2f} MB   ({n}/{tot} texturas recomprimidas)')
        else:
            import shutil; shutil.copyfile(s, d)
    print(f'TOTAL GLB: {tot_a/1e6:.2f} MB -> {tot_b/1e6:.2f} MB')
