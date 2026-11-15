import assert from 'node:assert/strict';
import { computeCubeView } from '../src/lib/cubePose.js';
import { baseZoom } from '../src/lib/cameraZoom.js';
import { createCube, standardHomes, cubiePos, layerIds, applyMove, normQ } from '../src/lib/cubeLogic.js';

// --- álgebra mínima (equivalente a lo que hace three en RubikCubePieces.jsx) ---
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]], mul=(a,s)=>a.map(v=>v*s), dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]; const nrm=(a)=>mul(a,1/Math.hypot(...a));
const AXES=[[1,0,0],[0,1,0],[0,0,1]];
const rotAxis=(axis,th,v)=>{const k=AXES[axis],c=Math.cos(th),s=Math.sin(th);return add(add(mul(v,c),mul(cross(k,v),s)),mul(k,dot(k,v)*(1-c)));}; // Rodrigues = Q(axis,th)·v

// Escena: cubo de escala 0.15 en (-4.8, 0.9, 84.3) mundo (ya subido), girado 30º; la cámara NO se mueve: (0, 5, 86), solo gira y hace zoom
const S=0.15, yaw=Math.PI/6, centerW=[-4.8,0.9,84.3], camPos=[0,5,86];
const localToWorld=(p)=>{const r=[p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),p[1],-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw)];return add(centerW,mul(r,S));};
const W=1920,H=1080,aspect=W/H, fov=(16/9)*(180/Math.PI/1.6), vTanBase=Math.tan(fov*Math.PI/360)/baseZoom(W,H);
const view=computeCubeView({camera:camPos,center:centerW,radius:3*Math.sqrt(3)*S,vTan:vTanBase,aspect}); const vTan=vTanBase/view.zoom;
const f=nrm(sub(centerW,camPos)), r=nrm(cross(f,[0,1,0])), u=cross(r,f);
const toScreen=(pw)=>{const d=sub(pw,camPos),z=dot(d,f);return[(dot(d,r)/(z*vTan*aspect)+1)/2*W,(1-dot(d,u)/(z*vTan))/2*H];};
const screenOf=(pl)=>toScreen(localToWorld(pl));
// caras visibles desde la cámara: las que miran hacia ella
const pose={dir:view.dir};

// --- réplica de decideLayer / arrastre ---
function decide(cube,drag,dx,dy){
  const STEP=0.5,p0=screenOf(drag.local),dlen=Math.hypot(dx,dy);let best=null;
  for(let u=0;u<3;u++){ if(u===drag.face)continue; const p1=screenOf(add(drag.local,mul(AXES[u],STEP))); const su=[(p1[0]-p0[0])/STEP,(p1[1]-p0[1])/STEP]; const len=Math.hypot(...su); if(len<8)continue;
    const score=Math.abs(dx*su[0]+dy*su[1])/(len*dlen); if(!best||score>best.score)best={u,su,len2:len*len,score}; }
  if(!best) return null;
  const w=3-drag.face-best.u, vu=dot(cross(AXES[w],drag.local),AXES[best.u]); if(Math.abs(vu)<0.5)return null;
  const layer=cubiePos(cube.cubies[drag.cubie])[w];
  return {axis:w,u:best.u,layer,ids:layerIds(cube,w,layer),su:best.su,len2:best.len2,vu};
}
const cellOf=(p)=>p.map(c=>Math.min(1,Math.max(-1,Math.floor((c+3)/2)-1)));
let tested=0,aligned=0,minCos=1,separable=0,rightAxis=0;
const cube=createCube(standardHomes());
const idOfHome=(h)=>cube.cubies.find(c=>c.home.join()===h.join()).id;
// puntos sobre las 3 caras visibles desde la cámara (+x? se calcula: caras cuya normal mira a la cámara)
for(const face of [0,1,2]) for(const sign of [-1,1]){
  const n=[0,0,0]; n[face]=sign; const nw=[n[0]*Math.cos(yaw)+n[2]*Math.sin(yaw),n[1],-n[0]*Math.sin(yaw)+n[2]*Math.cos(yaw)];
  if(dot(nw,pose.dir)<0.25) continue; // cara no visible
  for(const a of[-2.5,-1.5,-0.5,0.5,1.5,2.5]) for(const b of[-2.5,-1.5,-0.5,0.5,1.5,2.5]){
    const local=[0,0,0]; const t=[0,1,2].filter(k=>k!==face); local[face]=sign*3; local[t[0]]=a; local[t[1]]=b;
    const cubie=idOfHome(cellOf(local));
    for(const u of t) for(const su of[-1,1]) { // arrastrar a lo largo del eje tangente u (en pantalla)
      const eu=[0,0,0]; eu[u]=su; const q0=screenOf(local), q1=screenOf(add(local,mul(eu,0.5))); const base=Math.atan2(q1[1]-q0[1],q1[0]-q0[0]);
      const w=t.find(k=>k!==u); // girar a lo largo de u = girar la capa alrededor del tercer eje
      for(const noise of[-20,-10,0,10,20]){ const ang=base+noise*Math.PI/180, dx=60*Math.cos(ang), dy=60*Math.sin(ang);
        const dec=decide(cube,{local,face,cubie},dx,dy); tested++; assert.ok(dec,'hay decisión');
        assert.notEqual(dec.axis,face); assert.ok(dec.ids.includes(cubie),'la capa elegida contiene el cubie tocado');
        assert.equal(dec.axis,w,`eje esperado ${w}, elegido ${dec.axis} (cara ${face}${sign>0?'+':'-'}, punto ${local}, u ${u}, ruido ${noise})`); rightAxis++;
        // el ángulo sigue al dedo: girar θ desplaza el punto a lo largo de u en el sentido del arrastre
        const theta=((dx*dec.su[0]+dy*dec.su[1])/dec.len2)/dec.vu; assert.ok(Math.abs(theta)<1.2,'ángulo razonable para 60 px: '+theta.toFixed(2));
        const moved=sub(rotAxis(dec.axis,theta,local),local), alongU=moved[dec.u]; const wantSign=Math.sign(dx*dec.su[0]+dy*dec.su[1]);
        assert.equal(Math.sign(alongU),wantSign,'sentido de giro correcto'); aligned++; }
    }
  }
}
console.log(`arrastres probados: ${tested}, sentido correcto: ${aligned}/${tested}`);
console.log(`eje de giro correcto: ${rightAxis}/${tested}`);
assert.ok(tested>1000); assert.equal(aligned,tested); assert.equal(rightAxis,tested);
// Coherencia visual ↔ lógica: girar la capa θ=+90º visualmente (Rodrigues) coincide con applyMove q=+1 sobre las posiciones lógicas
for(let axis=0;axis<3;axis++) for(const layer of[-1,0,1]) for(const q of[1,-1,2]){
  const c=createCube(standardHomes()); const before=c.cubies.map(x=>cubiePos(x)); applyMove(c,{axis,layer,q});
  c.cubies.forEach((cu,i)=>{ const p=cubiePos(cu); const vis=before[i][axis]===layer? rotAxis(axis,normQ(q)*Math.PI/2,before[i]).map(Math.round) : before[i]; assert.deepEqual(p.map(v=>v+0),vis.map(v=>v+0),`axis ${axis} layer ${layer} q ${q}`); });
}
console.log('OK ✔ dragMath: la capa y el sentido siguen al dedo; el giro visual (θ=q·90º) coincide con el estado lógico');
