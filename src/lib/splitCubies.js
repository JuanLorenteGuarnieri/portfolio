// -----------------------------------------------------------------------------------------
// Separa la malla única del cubo (rubiks_cube.glb) en sus 26 cubies, para poder girar capas.
//
// El modelo no son cubies macizos sino láminas finas (pegatinas y paredes): cada cubie son 6
// láminas sueltas y, además, hay 6 cuadrados que forman el núcleo interior. Se procede así:
//   1) se buscan las piezas conectadas (union-find sobre los triángulos),
//   2) los cuadrados del núcleo (planos y tan grandes como dos cubies) se apartan: no giran,
//   3) cada lámina se asigna al cubie de la celda 3x3x3 en la que cae el centro de su caja.
//
// Además se cambia de marco: el modelo es "z hacia arriba" y su base está en z=0; aquí se
// devuelve centrado en el origen y con "y hacia arriba": (x, y, z) -> (x, z-3, -y). El cubo ocupa
// [-3, 3]^3 y cada cubie 2x2x2. Normales con la misma rotación; las UV no cambian.
//
// JavaScript puro (sin three) para poder probarlo fuera del navegador.
// -----------------------------------------------------------------------------------------

const HALF = 3; // semiancho del cubo en las unidades del modelo
const CELL = 2; // ancho de un cubie

/**
 * @param {{ positions: ArrayLike<number>, normals?: ArrayLike<number>, uvs?: ArrayLike<number>, index: ArrayLike<number> }} mesh
 * @returns {{
 *   cubies: Array<{ home: number[], positions: Float32Array, normals: Float32Array|null, uvs: Float32Array|null, index: Uint32Array }>,
 *   core: { positions: Float32Array, normals: Float32Array|null, uvs: Float32Array|null, index: Uint32Array } | null,
 * }}
 */
export function splitCubies(mesh) {
  const { positions, normals = null, uvs = null, index } = mesh;
  const vertexCount = Math.floor(positions.length / 3);

  // Posiciones ya en el marco centrado y-up
  const px = new Float32Array(vertexCount);
  const py = new Float32Array(vertexCount);
  const pz = new Float32Array(vertexCount);
  for (let v = 0; v < vertexCount; v++) {
    px[v] = positions[v * 3];
    py[v] = positions[v * 3 + 2] - HALF;
    pz[v] = -positions[v * 3 + 1];
  }

  // 1) Piezas conectadas
  const parent = new Int32Array(vertexCount);
  for (let i = 0; i < vertexCount; i++) parent[i] = i;
  const find = (a) => {
    while (parent[a] !== a) {
      parent[a] = parent[parent[a]];
      a = parent[a];
    }
    return a;
  };
  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };
  for (let t = 0; t + 2 < index.length; t += 3) {
    union(index[t], index[t + 1]);
    union(index[t + 1], index[t + 2]);
  }

  const pieces = new Map(); // raíz -> { verts, min[3], max[3] }
  for (let t = 0; t + 2 < index.length; t += 3) {
    const root = find(index[t]);
    if (!pieces.has(root)) {
      pieces.set(root, { root, verts: [], min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] });
    }
  }
  for (let v = 0; v < vertexCount; v++) {
    const piece = pieces.get(find(v));
    if (!piece) continue;
    piece.verts.push(v);
    const p = [px[v], py[v], pz[v]];
    for (let k = 0; k < 3; k++) {
      if (p[k] < piece.min[k]) piece.min[k] = p[k];
      if (p[k] > piece.max[k]) piece.max[k] = p[k];
    }
  }

  // 2) y 3) Reparto de las piezas
  const buckets = new Map(); // "ix,iy,iz" | "core" -> piezas
  for (const piece of pieces.values()) {
    const size = piece.max.map((m, k) => m - piece.min[k]);
    const isCore = size.filter((s) => s > CELL + 0.05).length >= 2;
    let key = 'core';
    if (!isCore) {
      const cell = piece.min.map((m, k) => {
        const c = (m + piece.max[k]) / 2;
        return Math.min(2, Math.max(0, Math.floor((c + HALF) / CELL)));
      });
      key = cell.join(',');
    }
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(piece);
  }

  const newIndexOf = new Int32Array(vertexCount).fill(-1);
  const groupOfRoot = new Map();
  const groups = [];
  for (const [key, list] of buckets) {
    const verts = [];
    for (const piece of list) {
      groupOfRoot.set(piece.root, groups.length);
      for (const v of piece.verts) verts.push(v);
    }
    verts.forEach((v, k) => { newIndexOf[v] = k; });
    groups.push({ key, verts, tris: [] });
  }
  for (let t = 0; t + 2 < index.length; t += 3) {
    const g = groups[groupOfRoot.get(find(index[t]))];
    g.tris.push(newIndexOf[index[t]], newIndexOf[index[t + 1]], newIndexOf[index[t + 2]]);
  }

  const build = ({ verts, tris }) => {
    const pos = new Float32Array(verts.length * 3);
    const nor = normals ? new Float32Array(verts.length * 3) : null;
    const uv = uvs ? new Float32Array(verts.length * 2) : null;
    verts.forEach((v, k) => {
      pos[k * 3] = px[v];
      pos[k * 3 + 1] = py[v];
      pos[k * 3 + 2] = pz[v];
      if (nor) {
        nor[k * 3] = normals[v * 3];
        nor[k * 3 + 1] = normals[v * 3 + 2];
        nor[k * 3 + 2] = -normals[v * 3 + 1];
      }
      if (uv) {
        uv[k * 2] = uvs[v * 2];
        uv[k * 2 + 1] = uvs[v * 2 + 1];
      }
    });
    return { positions: pos, normals: nor, uvs: uv, index: Uint32Array.from(tris) };
  };

  const cubies = [];
  let core = null;
  for (const group of groups) {
    if (group.key === 'core') {
      core = build(group);
    } else {
      const home = group.key.split(',').map((n) => Number(n) - 1);
      cubies.push({ home, ...build(group) });
    }
  }
  // Orden estable: por coordenadas de partida
  cubies.sort((a, b) => a.home[0] - b.home[0] || a.home[1] - b.home[1] || a.home[2] - b.home[2]);
  return { cubies, core };
}
