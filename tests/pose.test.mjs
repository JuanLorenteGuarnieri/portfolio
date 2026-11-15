import assert from 'node:assert/strict';
import { computeKeyboardPose } from '../src/lib/pianoPose.js';

// --- utilidades de cámara (equivalentes a three: lookAt + proyección con fov/zoom) ---
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const nrm=(a)=>{const l=Math.hypot(...a);return a.map(v=>v/l)};
function project(camPos, target, p, vTan, aspect){
  const f=nrm(sub(target,camPos)); const r=nrm(cross(f,[0,1,0])); const u=cross(r,f);
  const d=sub(p,camPos); const z=dot(d,f);
  return { x: dot(d,r)/(z*vTan*aspect), y: dot(d,u)/(z*vTan), z };
}
const rotY=(v,th)=>[v[0]*Math.cos(th)+v[2]*Math.sin(th), v[1], -v[0]*Math.sin(th)+v[2]*Math.cos(th)];

// Datos reales del escenario: piano en (4.8,-0.19,84.1) rotado -60º, escala 1.3 * 0.088
const S = 1.3 * 0.088;
const W = 0.0288 * 571.937 * S;               // ancho teclado en mundo (~1.89)
const D0 = 0.0028 * 571.937 * S;              // largo teclas
const STRETCH = 1.6;
const th = -Math.PI/3;
const right = rotY([1,0,0],th), up=[0,1,0], fwd = rotY([0,0,1],th);
const base = [4.8,-0.19,84.1];
const top = base[1] + 0.857*1.3;              // superficie de las teclas
const zc = 0.646 + 0.142/2;                   // centro (modelo, antes de escalar 1.3)
const center0 = [base[0]+ (right[0]*0 + fwd[0]*zc*1.3), top, base[2] + fwd[2]*zc*1.3];
const center = [center0[0] + fwd[0]*(STRETCH-1)*D0/2, top, center0[2] + fwd[2]*(STRETCH-1)*D0/2];
console.log('ancho teclado', W.toFixed(3), 'largo', D0.toFixed(3), 'centro', center.map(v=>v.toFixed(2)));

for (const [w,h] of [[1920,1080],[1366,768],[1280,1024],[2560,1080],[1000,800]]) {
  const aspect=w/h;
  // misma lógica que CameraController: fov fijado en el montaje (aquí 16:9) y zoom según ventana
  const fov=(16/9)*(180/Math.PI/1.6); const zoom=Math.max(1,aspect)/1.6;
  const vTan=Math.tan(fov*Math.PI/360)/zoom;
  const pose=computeKeyboardPose({center,up,forward:fwd,width:W,depth:D0*STRETCH,vTan,aspect,pitchDeg:62,margin:1.05});
  // esquinas del teclado (extremos izq/dcha, borde delantero y trasero)
  let maxX=0, maxY=0, minY=9;
  for (const sx of [-1,1]) for (const sz of [-0.5,0.5]) {
    const p=[center[0]+right[0]*sx*W/2+fwd[0]*sz*D0*STRETCH, top, center[2]+right[2]*sx*W/2+fwd[2]*sz*D0*STRETCH];
    const q=project(pose.position,pose.target,p,vTan,aspect);
    assert.ok(q.z>0.1,'tecla por delante de la cámara (near=0.1)');
    maxX=Math.max(maxX,Math.abs(q.x)); maxY=Math.max(maxY,Math.abs(q.y)); minY=Math.min(minY,q.y);
  }
  console.log(`${w}x${h}: cámara (${pose.position.map(v=>v.toFixed(2))}) dist ${pose.distance.toFixed(2)} | ocupa ${(maxX*100).toFixed(0)}% del ancho, ±${(maxY*100).toFixed(0)}% del alto`);
  assert.ok(maxX<=1.0, 'cabe a lo ancho'); assert.ok(maxX>0.9,'llena casi todo el ancho'); assert.ok(maxY<1);
  // la cámara queda del lado del pianista y por encima del teclado
  assert.ok(pose.position[1]>top+0.3);
}
console.log('OK ✔ pose');

// --- Orientación vista por la cámara (la que ve el pianista) ---
{
  const aspect=16/9, fov=(16/9)*(180/Math.PI/1.6), zoom=aspect/1.6, vTan=Math.tan(fov*Math.PI/360)/zoom;
  const pose=computeKeyboardPose({center,up,forward:fwd,width:W,depth:D0*STRETCH,vTan,aspect});
  const P=(sx,sz)=>project(pose.position,pose.target,[center[0]+right[0]*sx*W/2+fwd[0]*sz*D0*STRETCH, top, center[2]+right[2]*sx*W/2+fwd[2]*sz*D0*STRETCH],vTan,aspect);
  assert.ok(P(-1,0).x < 0 && P(1,0).x > 0, 'graves (−x) a la izquierda, agudos (+x) a la derecha');
  assert.ok(P(0,+0.5).y < P(0,-0.5).y, 'el frente de las teclas queda abajo, el fondo arriba');
  const c=P(0,0); assert.ok(Math.abs(c.x)<1e-9 && Math.abs(c.y)<1e-9, 'el centro del teclado queda en el centro de pantalla');
  console.log('OK ✔ orientación: graves izq., agudos dcha., frente abajo, centro centrado');
}
