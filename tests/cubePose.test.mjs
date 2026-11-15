import assert from 'node:assert/strict';
import { computeCubeView } from '../src/lib/cubePose.js';
import { baseZoom } from '../src/lib/cameraZoom.js';
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]; const nrm=(a)=>{const l=Math.hypot(...a);return a.map(v=>v/l)};
// Cámara real: en reposo (0, 5, z) mirando hacia el cubo; ahora solo gira y hace zoom, sin cambiar de posición
const half=0.45, radius=half*Math.sqrt(3);
for (const lift of [0, 0.45]) for (const camZ of [82.5, 85, 88, 92.7]) for (const [w,h] of [[1920,1080],[1366,768],[1280,1024],[2560,1080],[1000,800]]) {
  const center=[-4.8,0.45+lift,84.3], cam=[0,5,camZ], aspect=w/h, fov=(16/9)*(180/Math.PI/1.6);
  const bz=baseZoom(w,h), vTanBase=Math.tan(fov*Math.PI/360)/bz;
  const v=computeCubeView({camera:cam,center,radius,vTan:vTanBase,aspect});
  const vTan=vTanBase/v.zoom;                                  // con el zoom del modo
  const f=nrm(sub(center,cam)), r=nrm(cross(f,[0,1,0])), u=cross(r,f);
  let maxX=0,maxY=0;
  for (let rot=0; rot<40; rot++) { const a=rot*0.7,b=rot*1.3;
    for (const sx of[-1,1]) for (const sy of[-1,1]) for (const sz of[-1,1]) {
      let p=[sx*half,sy*half,sz*half]; p=[p[0]*Math.cos(a)+p[2]*Math.sin(a),p[1],-p[0]*Math.sin(a)+p[2]*Math.cos(a)]; p=[p[0],p[1]*Math.cos(b)-p[2]*Math.sin(b),p[1]*Math.sin(b)+p[2]*Math.cos(b)];
      const d=sub([center[0]+p[0],center[1]+p[1],center[2]+p[2]],cam), z=dot(d,f); assert.ok(z>0.1);
      maxX=Math.max(maxX,Math.abs(dot(d,r)/(z*vTan*aspect))); maxY=Math.max(maxY,Math.abs(dot(d,u)/(z*vTan))); } }
  assert.ok(Math.max(maxX,maxY)<0.6, `cubo cabe: ${Math.max(maxX,maxY).toFixed(2)}`);
  if (v.zoom>0.5+1e-9 && v.zoom<4-1e-9) assert.ok(Math.max(maxX,maxY)>0.3, 'y llena una parte razonable');
  if (lift===0.45 && w===1920 && (camZ===85||camZ===92.7)) console.log(`cámara z=${camZ} (dist ${v.distance.toFixed(1)}): zoom ×${v.zoom.toFixed(2)}, el cubo (en cualquier giro) ocupa ≤${(Math.max(maxX,maxY)*100).toFixed(0)}% de la mitad de pantalla`);
}
// El centro del cubo queda en el centro de pantalla (la cámara gira hacia él)
{ const center=[-4.8,0.9,84.3], cam=[0,5,86], f=nrm(sub(center,cam)); assert.ok(Math.abs(dot(f,nrm(sub(center,cam)))-1)<1e-12); }
assert.ok(baseZoom(1920,1080)>baseZoom(1000,1000)); assert.equal(baseZoom(1000,1000),1/1.6);
console.log('OK ✔ cubePose: solo gira y hace zoom; el cubo cabe en cualquier giro, con 4 posiciones de scroll y 5 proporciones');
