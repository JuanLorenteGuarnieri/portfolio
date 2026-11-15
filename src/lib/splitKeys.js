// -----------------------------------------------------------------------------------------
// Separa en teclas individuales las mallas fusionadas del piano (piano.glb).
//
// El GLB trae todas las teclas blancas en una sola malla y todas las negras en otra. Para que
// cada tecla pueda hundirse por separado hay que partirlas. Cada tecla está formada por una o
// dos piezas sueltas (el cuerpo y, en algunas, una pequeña cara trasera), así que:
//   1) se buscan las piezas conectadas (union-find sobre los triángulos),
//   2) se agrupan las piezas que comparten la misma posición X (= la misma tecla),
//   3) se construye una geometría por tecla, centrada en su punto de giro (el extremo trasero).
//
// Es JavaScript puro (sin three) para poder probarlo fuera del navegador.
// -----------------------------------------------------------------------------------------

/**
 * @param {{ positions: ArrayLike<number>, normals?: ArrayLike<number>, uvs?: ArrayLike<number>, index: ArrayLike<number> }} mesh
 * @returns {Array<{
 *   positions: Float32Array, normals: Float32Array|null, uvs: Float32Array|null, index: Uint32Array,
 *   pivot: [number, number, number], centerX: number,
 *   bounds: { minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number },
 * }>} teclas ordenadas de izquierda a derecha (X creciente). Las posiciones quedan relativas a `pivot`.
 */
export function splitKeys(mesh) {
  const { positions, normals = null, uvs = null, index } = mesh;
  const vertexCount = Math.floor(positions.length / 3);

  // 1) Piezas conectadas ------------------------------------------------------------------
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

  // Solo cuentan las piezas que tienen triángulos (se ignoran vértices sueltos)
  const pieces = new Map(); // raíz -> { minX, maxX, verts: number[] }
  for (let t = 0; t + 2 < index.length; t += 3) {
    const root = find(index[t]);
    if (!pieces.has(root)) pieces.set(root, { root, minX: Infinity, maxX: -Infinity, verts: [] });
  }
  for (let v = 0; v < vertexCount; v++) {
    const piece = pieces.get(find(v));
    if (!piece) continue;
    const x = positions[v * 3];
    if (x < piece.minX) piece.minX = x;
    if (x > piece.maxX) piece.maxX = x;
    piece.verts.push(v);
  }
  const list = Array.from(pieces.values());
  if (!list.length) return [];
  for (const p of list) p.cx = (p.minX + p.maxX) / 2;
  list.sort((a, b) => a.cx - b.cx);

  // 2) Piezas -> teclas ---------------------------------------------------------------------
  // Dos piezas son la misma tecla si sus centros en X casi coinciden. La tolerancia es una
  // fracción del ancho típico de una pieza; las teclas contiguas distan al menos un ancho.
  const widths = list.map((p) => p.maxX - p.minX).sort((a, b) => a - b);
  const tol = 0.3 * widths[Math.floor(widths.length / 2)];
  const groups = [];
  for (const piece of list) {
    const last = groups[groups.length - 1];
    if (last && Math.abs(piece.cx - last.cx) <= tol) last.pieces.push(piece);
    else groups.push({ cx: piece.cx, pieces: [piece] });
  }

  // 3) Una geometría por tecla ------------------------------------------------------------------
  const groupOfRoot = new Map();
  groups.forEach((g, gi) => g.pieces.forEach((p) => groupOfRoot.set(p.root, gi)));

  const newIndexOf = new Int32Array(vertexCount).fill(-1);
  const keys = groups.map((g) => {
    const verts = [];
    for (const p of g.pieces) for (const v of p.verts) verts.push(v);
    verts.forEach((v, k) => { newIndexOf[v] = k; });
    return { verts, tris: [] };
  });
  for (let t = 0; t + 2 < index.length; t += 3) {
    const gi = groupOfRoot.get(find(index[t]));
    const tris = keys[gi].tris;
    tris.push(newIndexOf[index[t]], newIndexOf[index[t + 1]], newIndexOf[index[t + 2]]);
  }

  return keys.map(({ verts, tris }, gi) => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const v of verts) {
      const x = positions[v * 3], y = positions[v * 3 + 1], z = positions[v * 3 + 2];
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }
    // Punto de giro: centro de la tecla en X e Y, y su extremo trasero (menor Z; el frente es +Z)
    const pivot = [(minX + maxX) / 2, (minY + maxY) / 2, minZ];

    const pos = new Float32Array(verts.length * 3);
    const nor = normals ? new Float32Array(verts.length * 3) : null;
    const uv = uvs ? new Float32Array(verts.length * 2) : null;
    verts.forEach((v, k) => {
      pos[k * 3] = positions[v * 3] - pivot[0];
      pos[k * 3 + 1] = positions[v * 3 + 1] - pivot[1];
      pos[k * 3 + 2] = positions[v * 3 + 2] - pivot[2];
      if (nor) {
        nor[k * 3] = normals[v * 3];
        nor[k * 3 + 1] = normals[v * 3 + 1];
        nor[k * 3 + 2] = normals[v * 3 + 2];
      }
      if (uv) {
        uv[k * 2] = uvs[v * 2];
        uv[k * 2 + 1] = uvs[v * 2 + 1];
      }
    });

    return {
      positions: pos,
      normals: nor,
      uvs: uv,
      index: Uint32Array.from(tris),
      pivot,
      centerX: groups[gi].cx,
      bounds: { minX, maxX, minY, maxY, minZ, maxZ },
    };
  });
}

/** ¿Esta nota MIDI es una tecla negra? (C=0, C#=1 ... B=11) */
export const isBlackMidi = (midi) => [1, 3, 6, 8, 10].includes(((midi % 12) + 12) % 12);

/**
 * Une teclas blancas y negras, las ordena de izquierda (graves) a derecha (agudos) y les asigna
 * una nota MIDI consecutiva a partir de `firstMidi`.
 * `xOffset*` es el desplazamiento en X de cada malla respecto al otro (en las mismas unidades que
 * `centerX`); en este modelo es despreciable pero así el orden es correcto en cualquier caso.
 *
 * @returns {{ keys: Array<object>, patternOk: boolean }} `patternOk` indica si el patrón
 *   blanca/negra encaja con un teclado real que empieza en `firstMidi` (debe ser una nota Do).
 */
export function assignNotes(white, black, firstMidi, xOffsetWhite = 0, xOffsetBlack = 0) {
  const all = [
    ...white.map((k) => ({ ...k, black: false, sortX: k.centerX + xOffsetWhite })),
    ...black.map((k) => ({ ...k, black: true, sortX: k.centerX + xOffsetBlack })),
  ].sort((a, b) => a.sortX - b.sortX);
  let patternOk = true;
  all.forEach((k, i) => {
    k.midi = firstMidi + i;
    if (isBlackMidi(k.midi) !== k.black) patternOk = false;
  });
  return { keys: all, patternOk };
}
