// Ayuda para los tests que importan módulos con react / three / @react-three/fiber: los empaqueta con
// esbuild (el que ya trae Vite en node_modules) sustituyendo esas librerías por stubs mínimos.
// Uso:  const mod = await bundle('src/lib/cubeStore.js')
// (Si esbuild no está en node_modules, indica su ruta con la variable de entorno ESBUILD_MODULE.)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STUBS = {
  react: 'export const useRef=(v)=>({current:v}); export const useMemo=(f)=>f(); export const useSyncExternalStore=()=>null;',
  fiber: 'export const useFrame=(cb)=>{ globalThis.__frame=cb; };',
  three: `export class Vector3{constructor(){this.x=0;this.y=0;this.z=0}copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this}fromArray(a){[this.x,this.y,this.z]=a;return this}lerpVectors(a,b,t){this.x=a.x+(b.x-a.x)*t;this.y=a.y+(b.y-a.y)*t;this.z=a.z+(b.z-a.z)*t;return this}}
export class Quaternion{copy(){return this}slerp(){return this}setFromRotationMatrix(){return this}}
export class Matrix4{lookAt(){return this}}`,
};

export async function bundle(entry) {
  const esbuild = await import(process.env.ESBUILD_MODULE || 'esbuild');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-test-'));
  const stub = (name, code) => { const f = path.join(dir, `${name}.mjs`); fs.writeFileSync(f, code); return f; };
  const outfile = path.join(dir, 'out.mjs');
  await esbuild.build({
    entryPoints: [path.join(root, entry)], bundle: true, format: 'esm', outfile, logLevel: 'error',
    loader: { '.js': 'jsx' },
    alias: { react: stub('react', STUBS.react), three: stub('three', STUBS.three), '@react-three/fiber': stub('fiber', STUBS.fiber) },
  });
  return import(pathToFileURL(outfile).href);
}
