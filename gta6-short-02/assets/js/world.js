// Neon city flythrough behind the GTA VI short. Pure function of time: render(t).
import * as THREE from "../lib/three.module.min.js";

const W = 720, H = 1280; // drawn at 2/3 scale, stretched to 1080x1920 by CSS
const DUR = window.__WORLD_DUR || 37;
const SEAMS = window.__WORLD_SEAMS || [5.8, 12.5, 21.3, 27.9, 32.6];

// ---------- seeded random ----------
function hash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

// ---------- palette over time ----------
const C = (h) => new THREE.Color(h);
const PAL = [
  { t: 0, top: C("#07031a"), hor: C("#ff2e88"), neonA: C("#ff2e88"), neonB: C("#22e4ff") },
  { t: 5.8, top: C("#0a0322"), hor: C("#d4147a"), neonA: C("#ff2e88"), neonB: C("#ffd166") },
  { t: 12.5, top: C("#020a1f"), hor: C("#0fa3d6"), neonA: C("#22e4ff"), neonB: C("#7b5cff") },
  { t: 21.3, top: C("#1a0510"), hor: C("#ff6a2b"), neonA: C("#ff8a3d"), neonB: C("#ff2e88") },
  { t: 27.9, top: C("#140818"), hor: C("#ffb347"), neonA: C("#ffd166"), neonB: C("#ff2e88") },
  { t: 32.6, top: C("#0b0420"), hor: C("#ff2e88"), neonA: C("#ff2e88"), neonB: C("#22e4ff") },
  { t: 99, top: C("#0b0420"), hor: C("#ff2e88"), neonA: C("#ff2e88"), neonB: C("#22e4ff") },
];
SEAMS.forEach((s, i) => { if (PAL[i + 1]) PAL[i + 1].t = s; });
function palAt(t) {
  let i = 0;
  while (i < PAL.length - 2 && t >= PAL[i + 1].t) i++;
  const a = PAL[i], b = PAL[i + 1];
  // colour flood over 0.5 s centred on each seam
  const k = THREE.MathUtils.smoothstep(t, b.t - 0.25, b.t + 0.25);
  const out = {};
  for (const key of ["top", "hor", "neonA", "neonB"]) out[key] = a[key].clone().lerp(b[key], k);
  return out;
}

// ---------- camera path ----------
const SPEED = 26, BOOST = 70;
function camZ(t) {
  let d = SPEED * t;
  for (const s of SEAMS) d += BOOST * THREE.MathUtils.smoothstep(t, s - 0.35, s + 0.35);
  return -d;
}
function camY(t) {
  const rise = 2.2 + 6.8 * THREE.MathUtils.smootherstep(t, 0, 3.2); // crane up in the hook
  return rise + 1.2 * Math.sin(t * 0.45);
}
function camX(t) { return 3.0 * Math.sin(t * 0.21) + 1.2 * Math.sin(t * 0.53); }

const PATH_LEN = 1500;

// ---------- renderer ----------
const canvas = document.getElementById("world-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, W / H, 0.5, 1400);

const fogU = { uFogColor: { value: new THREE.Color() }, uFogDensity: { value: 0.0042 } };
const neonU = { uNeonA: { value: new THREE.Color() }, uNeonB: { value: new THREE.Color() } };
const timeU = { uTime: { value: 0 } };

// ---------- sky ----------
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(1200, 32, 16),
  new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uTop: { value: new THREE.Color() }, uHor: { value: new THREE.Color() } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform vec3 uTop; uniform vec3 uHor; varying vec3 vDir;
      void main(){
        float h = clamp(vDir.y, -0.2, 1.0);
        vec3 col = mix(uHor, uTop, smoothstep(-0.02, 0.45, h));
        // striped retro sun sitting on the horizon straight ahead
        vec2 p = vec2(vDir.x, vDir.y - 0.1) / 0.17;
        float r = length(p);
        float sun = smoothstep(1.0, 0.97, r);
        float stripes = step(0.0, sin((vDir.y) * 240.0)) + step(0.12, vDir.y);
        float lower = step(vDir.y, 0.1);
        sun *= mix(1.0, clamp(stripes,0.0,1.0), lower);
        vec3 sunCol = mix(vec3(1.0,0.82,0.4), vec3(1.0,0.2,0.55), clamp(-p.y*0.5+0.5,0.0,1.0));
        col = mix(col, sunCol, sun * 0.95);
        col += uHor * 0.35 * exp(-abs(vDir.y - 0.02) * 14.0); // horizon glow
        gl_FragColor = vec4(col, 1.0);
      }`,
  }),
);
scene.add(sky);

// ---------- shared fog chunk ----------
const FOG_GLSL = `
  uniform vec3 uFogColor; uniform float uFogDensity;
  vec3 applyFog(vec3 col, float dist){ float f = 1.0 - exp(-pow(uFogDensity*dist, 1.6)); return mix(col, uFogColor, clamp(f,0.0,1.0)); }`;

// ---------- road ----------
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(26, PATH_LEN + 600, 1, 1),
  new THREE.ShaderMaterial({
    uniforms: { ...fogU, ...neonU },
    vertexShader: `varying vec3 vW; varying float vDist; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; vec4 mv = viewMatrix*w; vDist = -mv.z; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `
      uniform vec3 uNeonA; uniform vec3 uNeonB; varying vec3 vW; varying float vDist; ${FOG_GLSL}
      void main(){
        vec3 col = vec3(0.025,0.02,0.045);
        float z = vW.z;
        // dashed centre line
        float dash = step(0.5, fract(z/8.0)) * (1.0 - smoothstep(0.12, 0.2, abs(vW.x)));
        col += vec3(1.0,0.82,0.3) * dash * 0.9;
        // lane lines
        float lane = (1.0 - smoothstep(0.06, 0.12, abs(abs(vW.x) - 6.2))) * step(0.6, fract(z/5.0));
        col += vec3(0.8) * lane * 0.35;
        // wet reflection streaks of the neon
        float refl = pow(1.0 - abs(vW.x)/13.0, 2.0);
        col += mix(uNeonA, uNeonB, step(0.0, vW.x)) * 0.10 * refl;
        // grid glow
        vec2 g = abs(fract(vec2(vW.x/3.25, z/6.0)) - 0.5);
        float grid = 1.0 - smoothstep(0.47, 0.5, max(g.x, g.y));
        col += uNeonB * grid * 0.06;
        gl_FragColor = vec4(applyFog(col, vDist), 1.0);
      }`,
  }),
);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0, -PATH_LEN / 2 + 100);
scene.add(road);

// neon kerb strips
function strip(x, which) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.35, PATH_LEN + 600),
    new THREE.ShaderMaterial({
      uniforms: { ...fogU, ...neonU },
      vertexShader: `varying float vDist; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vDist=-mv.z; gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 uNeonA; uniform vec3 uNeonB; varying float vDist; ${FOG_GLSL}
        void main(){ vec3 c = ${which === "A" ? "uNeonA" : "uNeonB"} * 1.4; gl_FragColor = vec4(applyFog(c, vDist*0.6), 1.0); }`,
    }),
  );
  m.position.set(x, 0.2, -PATH_LEN / 2 + 100);
  scene.add(m);
}
strip(-13.2, "A");
strip(13.2, "B");

// ---------- buildings (instanced, procedural windows) ----------
const bGeo = new THREE.BoxGeometry(1, 1, 1);
bGeo.translate(0, 0.5, 0);
const bMat = new THREE.ShaderMaterial({
  uniforms: { ...fogU, ...neonU },
  vertexShader: `
    attribute float aSeed; varying vec3 vW; varying vec3 vN; varying float vDist; varying float vSeed; varying float vTopY;
    void main(){
      vec4 w = modelMatrix * instanceMatrix * vec4(position,1.0);
      vW = w.xyz; vSeed = aSeed;
      vN = normalize(mat3(modelMatrix * instanceMatrix) * normal);
      vTopY = (modelMatrix * instanceMatrix * vec4(0.0,1.0,0.0,1.0)).y;
      vec4 mv = viewMatrix * w; vDist = -mv.z; gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    uniform vec3 uNeonA; uniform vec3 uNeonB; varying vec3 vW; varying vec3 vN; varying float vDist; varying float vSeed; varying float vTopY; ${FOG_GLSL}
    float h21(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1)) + vSeed*17.0) * 43758.5453); }
    void main(){
      vec3 base = vec3(0.035,0.03,0.06);
      vec3 col = base;
      if (abs(vN.y) < 0.5) {
        float u = abs(vN.x) > 0.5 ? vW.z : vW.x;
        vec2 cell = vec2(u / 2.2, vW.y / 2.6);
        vec2 id = floor(cell); vec2 f = fract(cell);
        float win = step(0.18, f.x) * step(f.x, 0.82) * step(0.25, f.y) * step(f.y, 0.78);
        float lit = step(0.58, h21(id));
        vec3 warm = mix(vec3(1.0,0.75,0.4), vec3(0.55,0.85,1.0), step(0.7, h21(id+3.1)));
        col += win * lit * warm * (0.55 + 0.45*h21(id+7.7));
        col += win * (1.0-lit) * vec3(0.05,0.05,0.09);
        // neon crown line near the roof
        float crown = smoothstep(1.2, 0.0, vTopY - vW.y) * step(vW.y, vTopY);
        col += mix(uNeonA, uNeonB, step(0.5, fract(vSeed*3.7))) * crown * 1.2;
      } else {
        col = vec3(0.02,0.015,0.035);
      }
      gl_FragColor = vec4(applyFog(col, vDist), 1.0);
    }`,
});
const placements = [];
for (const side of [-1, 1]) {
  for (const row of [0, 1]) {
    let z = 60;
    let i = 0;
    while (z > -PATH_LEN - 300) {
      const seed = hash(i * 13.7 + side * 101 + row * 977);
      const w = 8 + seed * 9;
      const d = 8 + hash(seed * 91) * 10;
      const h = row === 0 ? 12 + Math.pow(hash(seed * 7.1), 1.6) * 60 : 40 + hash(seed * 3.3) * 110;
      const x = side * (row === 0 ? 17 + w / 2 + hash(seed * 5) * 3 : 42 + w / 2 + hash(seed * 11) * 14);
      placements.push({ x, z: z - d / 2, w, d, h, seed });
      z -= d + 1.5 + hash(seed * 2.2) * 4;
      i++;
    }
  }
}
const bMesh = new THREE.InstancedMesh(bGeo, bMat, placements.length);
const seeds = new Float32Array(placements.length);
const m4 = new THREE.Matrix4();
placements.forEach((p, i) => {
  m4.compose(new THREE.Vector3(p.x, 0, p.z), new THREE.Quaternion(), new THREE.Vector3(p.w, p.h, p.d));
  bMesh.setMatrixAt(i, m4);
  seeds[i] = p.seed;
});
bGeo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
scene.add(bMesh);

// ---------- neon signs on road-facing walls ----------
const signGeo = new THREE.BoxGeometry(1, 1, 1);
const signs = placements.filter((p, i) => Math.abs(p.x) < 40 && hash(p.seed * 51) > 0.55);
const signMat = new THREE.ShaderMaterial({
  uniforms: { ...fogU, ...neonU },
  vertexShader: `attribute float aSeed; varying float vDist; varying float vSeed; void main(){ vSeed=aSeed; vec4 mv = viewMatrix*modelMatrix*instanceMatrix*vec4(position,1.0); vDist=-mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `uniform vec3 uNeonA; uniform vec3 uNeonB; varying float vDist; varying float vSeed; ${FOG_GLSL}
    void main(){ vec3 c = mix(uNeonA, uNeonB, step(0.5, fract(vSeed*7.3))) * 1.6; gl_FragColor = vec4(applyFog(c, vDist*0.8), 1.0); }`,
});
const sMesh = new THREE.InstancedMesh(signGeo, signMat, signs.length);
const sSeeds = new Float32Array(signs.length);
signs.forEach((p, i) => {
  const vertical = hash(p.seed * 9) > 0.5;
  const faceX = p.x - Math.sign(p.x) * (p.w / 2 + 0.3);
  const sy = vertical ? 6 + hash(p.seed * 4) * 8 : 1.4;
  const sz = vertical ? 1.2 : 4 + hash(p.seed * 6) * 4;
  const y = 5 + hash(p.seed * 8) * Math.max(1, p.h - 10);
  m4.compose(new THREE.Vector3(faceX, Math.min(y, p.h - sy / 2 - 1), p.z), new THREE.Quaternion(), new THREE.Vector3(0.4, sy, sz));
  sMesh.setMatrixAt(i, m4);
  sSeeds[i] = p.seed;
});
signGeo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(sSeeds, 1));
scene.add(sMesh);

// ---------- palm trees ----------
const silhouetteMat = new THREE.ShaderMaterial({
  uniforms: { ...fogU },
  vertexShader: `varying float vDist; void main(){ vec4 mv = viewMatrix*modelMatrix*instanceMatrix*vec4(position,1.0); vDist=-mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `varying float vDist; ${FOG_GLSL} void main(){ gl_FragColor = vec4(applyFog(vec3(0.02,0.008,0.03), vDist*0.55), 1.0); }`,
});
const palms = [];
for (const side of [-1, 1]) {
  for (let i = 0, z = 30; z > -PATH_LEN - 200; i++, z -= 20 + hash(i * 3 + side) * 8) palms.push({ x: side * (14.8 + hash(i * 7 + side) * 1.2), z, s: 0.85 + hash(i * 5 + side * 3) * 0.4, seed: hash(i * 17 + side * 9) });
}
const trunkGeo = new THREE.CylinderGeometry(0.35, 0.6, 1, 6);
trunkGeo.translate(0, 0.5, 0);
const trunks = new THREE.InstancedMesh(trunkGeo, silhouetteMat, palms.length);
const frondGeo = new THREE.BoxGeometry(1.1, 0.1, 6.2);
frondGeo.translate(0, 0, 3.1);
const FRONDS = 7;
const fronds = new THREE.InstancedMesh(frondGeo, silhouetteMat, palms.length * FRONDS);
const q = new THREE.Quaternion(), e = new THREE.Euler();
palms.forEach((p, i) => {
  const hgt = 13 * p.s;
  const lean = (p.seed - 0.5) * 0.25;
  e.set(0, 0, lean); q.setFromEuler(e);
  m4.compose(new THREE.Vector3(p.x, 0, p.z), q, new THREE.Vector3(1, hgt, 1));
  trunks.setMatrixAt(i, m4);
  const top = new THREE.Vector3(p.x - Math.sin(lean) * hgt, Math.cos(lean) * hgt, p.z);
  for (let k = 0; k < FRONDS; k++) {
    e.set(0.55 + hash(i * 31 + k) * 0.35, (k / FRONDS) * Math.PI * 2 + p.seed * 3, 0, "YXZ");
    q.setFromEuler(e);
    m4.compose(top, q, new THREE.Vector3(1, 1, p.s));
    fronds.setMatrixAt(i * FRONDS + k, m4);
  }
});
scene.add(trunks, fronds);

// ---------- traffic light trails ----------
const CARS = 70;
const carGeo = new THREE.BoxGeometry(0.5, 0.35, 1);
const carMat = new THREE.MeshBasicMaterial({ vertexColors: false, color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
const tail = new THREE.InstancedMesh(carGeo, carMat.clone(), CARS * 2);
tail.material.color = new THREE.Color("#ff2a3d");
const head = new THREE.InstancedMesh(carGeo, carMat.clone(), CARS * 2);
head.material.color = new THREE.Color("#fff1c9");
tail.frustumCulled = false; head.frustumCulled = false;
scene.add(tail, head);
const LOOP = 420;
function wrapAhead(z, cz) { // keep z inside [cz-380, cz+40]
  const lo = cz - 380;
  return lo + (((z - lo) % LOOP) + LOOP) % LOOP;
}
function placeTraffic(t) {
  const cz = camZ(t);
  for (let i = 0; i < CARS; i++) {
    const s = hash(i * 9.1 + 4.0);
    // away-lane: red tail lights, slower than the camera so we overtake them
    const zA = wrapAhead(s * LOOP - 14 * t, cz);
    const xA = s > 0.5 ? 3.2 : 9.0;
    for (let k = 0; k < 2; k++) {
      m4.compose(new THREE.Vector3(xA + (k ? 0.9 : -0.9), 0.7, zA), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1.6));
      tail.setMatrixAt(i * 2 + k, m4);
    }
    // oncoming lane: headlight streaks
    const s2 = hash(i * 3.3 + 8.0);
    const zB = wrapAhead(s2 * LOOP + 30 * t, cz);
    const xB = s2 > 0.5 ? -3.2 : -9.0;
    for (let k = 0; k < 2; k++) {
      m4.compose(new THREE.Vector3(xB + (k ? 0.9 : -0.9), 0.7, zB), new THREE.Quaternion(), new THREE.Vector3(1, 1, 7));
      head.setMatrixAt(i * 2 + k, m4);
    }
  }
  tail.instanceMatrix.needsUpdate = true;
  head.instanceMatrix.needsUpdate = true;
}

// ---------- floating dust ----------
const DUST = 600;
const dustPos = new Float32Array(DUST * 3);
for (let i = 0; i < DUST; i++) {
  dustPos[i * 3] = (hash(i * 1.7) - 0.5) * 60;
  dustPos[i * 3 + 1] = 1 + hash(i * 2.9) * 30;
  dustPos[i * 3 + 2] = -hash(i * 4.3) * PATH_LEN - 50;
}
const dustGeo = new THREE.BufferGeometry();
dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.25, color: 0xffd6f0, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
dust.frustumCulled = false;
scene.add(dust);

// ---------- render ----------
const look = new THREE.Vector3();
function render(t) {
  t = Math.max(0, Math.min(DUR, t));
  const p = palAt(t);
  sky.material.uniforms.uTop.value.copy(p.top);
  sky.material.uniforms.uHor.value.copy(p.hor);
  fogU.uFogColor.value.copy(p.hor).lerp(p.top, 0.45);
  neonU.uNeonA.value.copy(p.neonA);
  neonU.uNeonB.value.copy(p.neonB);
  timeU.uTime.value = t;

  const z = camZ(t);
  const x = camX(t);
  const y = camY(t);
  camera.position.set(x, y, z);
  sky.position.set(x, 0, z);
  // look ahead along the path; tilt up during the opening crane
  const tiltUp = 1 - THREE.MathUtils.smootherstep(t, 0, 3.2);
  look.set(camX(t + 1.5) * 0.6, y - 2.2 + tiltUp * 5.5, camZ(t + 1.5) - 40);
  camera.lookAt(look);
  camera.rotation.z += 0.035 * Math.sin(t * 0.37) + 0.02 * (camX(t + 0.5) - x);
  // wider lens during each speed boost
  let warp = 0;
  for (const s of SEAMS) warp = Math.max(warp, Math.exp(-Math.pow((t - s) / 0.28, 2)));
  camera.fov = 62 + warp * 16;
  camera.updateProjectionMatrix();

  placeTraffic(t);
  renderer.render(scene, camera);
}

window.__worldRender = render;
window.addEventListener("hf-seek", (ev) => render(ev.detail.time));
render(0);
const px = new Uint8Array(4);
const gl = renderer.getContext();
gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
if (window.__worldResolve) window.__worldResolve();
