// Lector mínimo de GLB para pruebas (devuelve arrays tipados por malla)
import fs from 'node:fs';
export function readGlb(path) {
  const f = fs.readFileSync(path);
  const jl = f.readUInt32LE(12);
  const json = JSON.parse(f.slice(20, 20 + jl).toString());
  const off = 20 + jl;
  const bl = f.readUInt32LE(off);
  const bin = f.slice(off + 8, off + 8 + bl);
  const acc = (i) => {
    const a = json.accessors[i], bv = json.bufferViews[a.bufferView];
    const T = { 5126: Float32Array, 5123: Uint16Array, 5125: Uint32Array }[a.componentType];
    const n = { SCALAR: 1, VEC2: 2, VEC3: 3 }[a.type];
    const start = bin.byteOffset + (bv.byteOffset || 0) + (a.byteOffset || 0);
    const ab = bin.buffer.slice(start, start + a.count * n * T.BYTES_PER_ELEMENT);
    return new T(ab);
  };
  const meshes = {};
  json.nodes.slice(0, 5).forEach((node, k) => {
    const p = json.meshes[k].primitives[0];
    meshes[node.name] = {
      positions: acc(p.attributes.POSITION), normals: acc(p.attributes.NORMAL),
      uvs: acc(p.attributes.TEXCOORD_0), index: acc(p.indices), node,
    };
  });
  return meshes;
}
