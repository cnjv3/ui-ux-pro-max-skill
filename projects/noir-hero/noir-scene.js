import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { buildSculptureGeometry } from './noir-sculpture.js';
import { createNoise3D, fbm3 } from './noir-noise.js';

// Lighting / orientation preset per stage (01 Awakening … 04 Impact).
// envYaw turns the studio lights around the sculpture, warmth tints the
// chrome towards champagne, key scales the environment light.
export const STAGES = [
  { yaw: 0.0, pitch: 0.0, roll: 0.0, envYaw: 0.0, warmth: 0.1, key: 1.0, glow: 1.0 },
  { yaw: 0.38, pitch: -0.05, roll: 0.05, envYaw: 1.05, warmth: 0.45, key: 1.06, glow: 1.25 },
  { yaw: -0.34, pitch: 0.07, roll: -0.05, envYaw: -0.95, warmth: 0.0, key: 0.92, glow: 0.8 },
  { yaw: 0.72, pitch: 0.03, roll: 0.09, envYaw: 2.25, warmth: 0.3, key: 1.15, glow: 1.4 },
];

const QUALITY = {
  high: { maxDpr: 1.75, bloom: true, segments: 1100, radial: 64, rockDetail: 70, reflectScale: 0.5 },
  low: { maxDpr: 1.5, bloom: false, segments: 560, radial: 40, rockDetail: 34, reflectScale: 0.35 },
};

const CHROME_WHITE = new THREE.Color(0xf4f4f2);
const CHROME_CHAMPAGNE = new THREE.Color(0xf2dcc0);

// ---------------------------------------------------------------------------
// Studio environment: a black dome with soft-box strips, baked into a PMREM
// cube so the chrome has real light to reflect (no external HDRI needed).

export function createStudioEnvironment(renderer) {
  const env = new THREE.Scene();
  const disposables = [];

  const domeGeo = new THREE.SphereGeometry(60, 64, 32);
  const domeMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        // Below the horizon the wet ground mirrors the studio, dimmed.
        float y = abs(vDir.y);
        float ground = vDir.y < 0.0 ? 0.42 : 1.0;
        float az = atan(vDir.z, vDir.x);
        vec3 col = vec3(0.003);
        // Soft grey ceiling, broken into broad panels so reflections have form.
        col += vec3(0.1, 0.1, 0.098) * smoothstep(-0.05, 0.85, y) * pow(0.5 + 0.5 * sin(az * 3.0 + 1.2), 3.0);
        // Bright cyclorama band just above the horizon, and a faint warm horizon.
        col += vec3(0.8, 0.76, 0.7) * exp(-pow((y - 0.16) * 15.0, 2.0)) * pow(0.5 + 0.5 * sin(az * 2.0 - 0.4), 2.0);
        col += vec3(0.06, 0.05, 0.04) * exp(-pow(y * 10.0, 2.0));
        gl_FragColor = vec4(col * ground, 1.0);
      }`,
  });
  env.add(new THREE.Mesh(domeGeo, domeMat));
  disposables.push(domeGeo, domeMat);

  const addPanel = (w, h, intensity, tint, position, target) => {
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(...tint).multiplyScalar(intensity),
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...position);
    mesh.lookAt(...target);
    env.add(mesh);
    disposables.push(geo, mat);
  };
  // Every light above the horizon also appears, dimmer, mirrored in the water.
  const panel = (w, h, intensity, tint, [x, y, z], [tx, ty, tz] = [0, 0, 0]) => {
    addPanel(w, h, intensity, tint, [x, y, z], [tx, ty, tz]);
    if (y > 0) addPanel(w, h, intensity * 0.3, tint, [x, -y, z], [tx, -ty, tz]);
  };

  // Key: tall narrow strip, front-left, warm white.
  panel(1.1, 16, 5.6, [1.0, 0.96, 0.9], [-10, 3, 8]);
  // Front-right fill strip, dimmer, for long streaks on faces turned to camera.
  panel(0.6, 12, 1.6, [1.0, 0.97, 0.94], [8, 2, 11]);
  // Overhead strip.
  panel(16, 1.0, 2.6, [1.0, 0.98, 0.95], [0, 13, 0]);
  // Champagne rim, back-right: the warm edge light on the right-hand rims.
  panel(0.9, 12, 9.0, [1.0, 0.82, 0.6], [11, 3, -6]);
  // Cool rim, back-left.
  panel(0.6, 10, 3.2, [0.9, 0.94, 1.0], [-10, 5, -8]);
  // Low warm bounce: light coming back off the water.
  panel(26, 0.5, 0.9, [1.0, 0.86, 0.7], [0, -1.2, 10]);
  // Broad, dim softboxes in front: soft gradients across faces turned to camera.
  panel(16, 6, 0.55, [1.0, 0.98, 0.95], [0, 8, 13]);
  panel(4, 7, 0.9, [1.0, 0.97, 0.93], [-7, 7, 7]);
  // Long low strip behind the scene: grazing glints on wet rock and rims.
  panel(36, 0.7, 1.6, [1.0, 0.88, 0.72], [0, 1.2, -16], [0, 0.5, 0]);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(env, 0.012);
  pmrem.dispose();
  disposables.forEach((d) => d.dispose());
  return target;
}

// Near-black backdrop with a carbon falloff behind the sculpture.
function createBackdropTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#040404';
  ctx.fillRect(0, 0, 512, 512);
  const g = ctx.createRadialGradient(300, 170, 10, 300, 200, 380);
  g.addColorStop(0, '#121314');
  g.addColorStop(0.45, '#0a0b0b');
  g.addColorStop(1, 'rgba(4,4,4,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------------------------------------------------------------------------
// Water: a planar mirror whose lookup is broken up by slow swells and
// smeared towards the viewer, then faded into the dark at the horizon.

const WaterShader = {
  name: 'NoirWater',
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    uTime: { value: 0 },
    uCamPos: { value: new THREE.Vector3() },
    uReveal: { value: 0 },
    uStrength: { value: 1 },
  },
  vertexShader: /* glsl */ `
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    varying vec3 vWorld;
    #include <common>
    #include <logdepthbuf_pars_vertex>
    void main() {
      vUv = textureMatrix * vec4(position, 1.0);
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorld = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
      #include <logdepthbuf_vertex>
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 color;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec3 uCamPos;
    uniform float uReveal;
    uniform float uStrength;
    varying vec4 vUv;
    varying vec3 vWorld;
    #include <logdepthbuf_pars_fragment>

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float vnoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float swell(vec2 p) {
      vec2 q = vec2(p.x * 0.42, p.y * 1.9);
      float t = uTime;
      float h = vnoise(q + vec2(t * 0.06, t * 0.16)) * 0.6;
      h += vnoise(q * 2.1 + vec2(-t * 0.09, t * 0.22)) * 0.3;
      h += vnoise(q * 4.7 + vec2(t * 0.13, -t * 0.05)) * 0.1;
      return h;
    }

    void main() {
      #include <logdepthbuf_fragment>
      vec2 p = vWorld.xz;
      float e = 0.035;
      float h = swell(p);
      vec2 grad = vec2(swell(p + vec2(e, 0.0)) - h, swell(p + vec2(0.0, e)) - h) / e;

      float dist = distance(uCamPos, vWorld);
      float nearF = clamp(1.0 - dist / 34.0, 0.0, 1.0);
      vec2 uv = vUv.xy / vUv.w;
      vec2 offset = vec2(grad.x * 0.35, grad.y) * 0.016 * (0.25 + nearF) * uStrength;

      // Vertical smear: reflections stretch towards the viewer on wet ground.
      vec3 refl = vec3(0.0);
      float wsum = 0.0;
      for (int i = -4; i <= 4; i++) {
        float fi = float(i);
        float w = exp(-fi * fi / 9.0);
        refl += texture2D(tDiffuse, uv + offset + vec2(0.0, fi * 0.0065 * (0.5 + nearF))).rgb * w;
        wsum += w;
      }
      refl /= wsum;

      vec3 V = normalize(uCamPos - vWorld);
      float fresnel = 0.32 + 0.68 * pow(1.0 - clamp(V.y, 0.0, 1.0), 5.0);
      // A faint sheen of the dark studio so the surface reads even where
      // nothing bright is reflected.
      vec3 col = color * (0.4 + 0.6 * fresnel) * (0.6 + 0.8 * h) + refl * fresnel * 1.25;

      // Fine glints on ripple crests close to the camera.
      float crest = smoothstep(0.55, 1.4, length(grad)) * nearF;
      col += refl * crest * 0.6;

      col *= smoothstep(48.0, 12.0, dist) * uReveal;
      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};

// ---------------------------------------------------------------------------
// Rocks: displaced icospheres, ridged and layered like wet basalt.

const ROCK_GLSL = /* glsl */ `
  varying vec3 vRockPos;
  float rkHash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float rkNoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(rkHash(i), rkHash(i + vec3(1, 0, 0)), f.x),
                   mix(rkHash(i + vec3(0, 1, 0)), rkHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(rkHash(i + vec3(0, 0, 1)), rkHash(i + vec3(1, 0, 1)), f.x),
                   mix(rkHash(i + vec3(0, 1, 1)), rkHash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }
  float rkFbm(vec3 p) {
    float s = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      s += a * rkNoise(p);
      p *= 2.07;
      a *= 0.5;
    }
    return s;
  }
  vec3 rkPerturb(vec3 surfPos, vec3 surfNorm, vec2 dHdxy, float faceDir) {
    vec3 sx = normalize(dFdx(surfPos));
    vec3 sy = normalize(dFdy(surfPos));
    vec3 r1 = cross(sy, surfNorm);
    vec3 r2 = cross(surfNorm, sx);
    float det = dot(sx, r1) * faceDir;
    vec3 grad = sign(det) * (dHdxy.x * r1 + dHdxy.y * r2);
    return normalize(abs(det) * surfNorm - grad);
  }
`;

// Wet basalt: procedural grain in the normal, glossy wet patches, matte dry
// ones. Rocks get two lights of their own inside the shader (a high back key
// and the warm spill of the sculpture), so no punctual light ever spots the chrome.
function createRockMaterial() {
  const material = new THREE.MeshStandardMaterial({
    color: 0x171717,
    roughness: 0.7,
    metalness: 0,
    envMapIntensity: 0.9,
  });
  const uniforms = {
    rkKeyDir: { value: new THREE.Vector3(0.25, 0.75, -0.6).normalize() },
    rkKeyColor: { value: new THREE.Color(0xfff1e2).multiplyScalar(0) },
    rkGlowPos: { value: new THREE.Vector3(0.6, 1.0, -2) },
    rkGlowColor: { value: new THREE.Color(0xffdcb4).multiplyScalar(0) },
  };
  material.userData.uniforms = uniforms;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vRockPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRockPos = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\n${ROCK_GLSL}\nuniform vec3 rkKeyDir;\nuniform vec3 rkKeyColor;\nuniform vec3 rkGlowPos;\nuniform vec3 rkGlowColor;`,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        float rkWet = smoothstep(0.42, 0.7, rkFbm(vRockPos * 2.1 + 3.0));
        roughnessFactor = mix(0.86, 0.3, rkWet);
        diffuseColor.rgb *= mix(1.0, 0.45, rkWet);`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        float rkH = rkFbm(vRockPos * 6.5) * 0.65 + rkNoise(vRockPos * 34.0) * 0.35;
        normal = rkPerturb(-vViewPosition, normal, vec2(dFdx(rkH), dFdy(rkH)) * 2.2, faceDirection);`,
      )
      .replace(
        '#include <lights_fragment_end>',
        `#include <lights_fragment_end>
        {
          vec3 V = normalize(vViewPosition);
          float shine = mix(14.0, 110.0, rkWet);
          float gloss = mix(0.04, 1.0, rkWet);
          vec3 L = normalize((viewMatrix * vec4(rkKeyDir, 0.0)).xyz);
          float ndl = max(dot(normal, L), 0.0);
          reflectedLight.directDiffuse += diffuseColor.rgb * rkKeyColor * ndl;
          reflectedLight.directSpecular += rkKeyColor * pow(max(dot(normal, normalize(L + V)), 0.0), shine) * gloss * ndl;
          vec3 toGlow = (viewMatrix * vec4(rkGlowPos, 1.0)).xyz + vViewPosition;
          float d = length(toGlow);
          vec3 G = toGlow / d;
          float atten = 1.0 / (1.0 + d * d * 0.06);
          float ndg = max(dot(normal, G), 0.0);
          reflectedLight.directDiffuse += diffuseColor.rgb * rkGlowColor * ndg * atten;
          reflectedLight.directSpecular += rkGlowColor * pow(max(dot(normal, normalize(G + V)), 0.0), shine) * gloss * ndg * atten;
        }`,
      );
  };
  return material;
}

function buildRockGeometry(noise, { detail, scale, seed, flatten = 0.25, strata = 0.0, plateau = 0.55 }) {
  let geo = new THREE.IcosahedronGeometry(1, detail);
  geo.deleteAttribute('normal');
  geo.deleteAttribute('uv');
  geo = mergeVertices(geo);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const ridge = 1 - Math.abs(fbm3(noise, v.x * 1.1 + seed, v.y * 1.1, v.z * 1.1, 4));
    const detailN = fbm3(noise, v.x * 4.5, v.y * 4.5 + seed, v.z * 4.5, 3);
    const grain = fbm3(noise, v.x * 16 + seed, v.y * 16, v.z * 16, 2);
    const r = 0.86 + 0.22 * ridge + 0.07 * detailN + 0.02 * grain;
    v.multiplyScalar(r);
    // Weathered plateau: the upper face flattens out like a slab of basalt.
    if (v.y > plateau) v.y = plateau + (v.y - plateau) * 0.3;
    v.x *= scale[0];
    v.y *= scale[1];
    v.z *= scale[2];
    if (strata > 0) v.y += strata * Math.sin(v.y * 26 + detailN * 5);
    const floor = -scale[1] * flatten;
    if (v.y < floor) v.y = floor + (v.y - floor) * 0.15;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// Rock layout: where each formation meets the frame, as NDC x plus depth.
// Sizes scale down on narrow (portrait) frames so the scene keeps its balance.
const ROCKS = [
  // Long slab entering from the lower-left, sloping down towards the water.
  { ndcX: -0.92, z: 5.0, y: 0.08, scale: [1.55, 0.62, 0.95], rot: [0.06, -0.16, -0.12], seed: 3.1, strata: 0.004 },
  // Low, distant shelf behind it, almost lost in the dark.
  { ndcX: -0.55, z: -3.5, y: -0.1, scale: [3.2, 0.55, 1.2], rot: [0.0, -0.15, 0.03], seed: 8.4 },
  // Heavy mass in the lower-right corner, rising out of frame.
  { ndcX: 1.22, z: 6.0, y: -0.05, scale: [1.65, 1.05, 1.2], rot: [0.05, 0.35, 0.16], seed: 15.7, strata: 0.006 },
  // A loose stone at the foot of the right mass.
  { ndcX: 0.62, z: 6.9, y: -0.1, scale: [0.3, 0.14, 0.26], rot: [0.0, 0.3, 0.0], seed: 22.2 },
];

// ---------------------------------------------------------------------------

export async function createNoirScene({ canvas, quality = 'high', reducedMotion = false, onContextLost } = {}) {
  const tier = QUALITY[quality] || QUALITY.high;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
  });
  renderer.setClearColor(0x050505, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const envTarget = createStudioEnvironment(renderer);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0;
  const backdrop = createBackdropTexture();
  scene.background = backdrop;
  scene.fog = new THREE.Fog(0x050505, 16, 46);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
  // Lens just above the water: the horizon sits low (~80%) and the sculpture's
  // reflection lands right under it, as in a low-angle product shot.
  const CAMERA_BASE = new THREE.Vector3(0, 0.05, 12);
  const LOOK_BASE = new THREE.Vector3(0, 2.01, 0);
  const lookAt = new THREE.Vector3();

  // Sculpture -------------------------------------------------------------
  const sculptureGeo = buildSculptureGeometry({ segments: tier.segments, radial: tier.radial });
  sculptureGeo.center();
  const bbox = sculptureGeo.boundingBox;
  const sculptureSize = new THREE.Vector3();
  bbox.getSize(sculptureSize);
  const chrome = new THREE.MeshPhysicalMaterial({
    color: CHROME_WHITE.clone(),
    metalness: 1,
    roughness: 0.06,
    envMapIntensity: 1.15,
  });
  const sculpture = new THREE.Mesh(sculptureGeo, chrome);
  const pivot = new THREE.Group();
  pivot.add(sculpture);
  scene.add(pivot);
  const SCULPTURE_Z = -4;

  // Rocks -----------------------------------------------------------------
  const noise = createNoise3D(11);
  const rockMat = createRockMaterial();
  const rockUniforms = rockMat.userData.uniforms;
  const rocks = ROCKS.map((spec) => {
    const geo = buildRockGeometry(noise, {
      detail: spec.scale[0] < 1 ? Math.round(tier.rockDetail * 0.4) : tier.rockDetail,
      scale: spec.scale,
      seed: spec.seed,
      strata: spec.strata,
    });
    const mesh = new THREE.Mesh(geo, rockMat);
    mesh.rotation.set(...spec.rot);
    scene.add(mesh);
    return { mesh, spec };
  });

  // Light ----------------------------------------------------------------
  // Only a faint diffuse fill: punctual lights would leave hard dots on the
  // chrome, so speculars on chrome and rock both come from the environment.
  const hemi = new THREE.HemisphereLight(0x2c2a27, 0x000000, 0.3);
  scene.add(hemi);

  // Water -----------------------------------------------------------------
  const waterGeo = new THREE.PlaneGeometry(160, 160);
  const water = new Reflector(waterGeo, {
    shader: WaterShader,
    textureWidth: 512,
    textureHeight: 512,
    clipBias: 0.003,
    color: 0x0b0b0b,
    multisample: quality === 'high' ? 4 : 0,
  });
  water.rotation.x = -Math.PI / 2;
  scene.add(water);
  const waterUniforms = water.material.uniforms;

  // Post ------------------------------------------------------------------
  let composer = null;
  if (tier.bloom) {
    const rt = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: 4 });
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(2, 2), 0.34, 0.5, 0.95));
    composer.addPass(new OutputPass());
  }
  const disposeComposer = () => {
    if (!composer) return;
    composer.passes.forEach((pass) => pass.dispose?.());
    composer.dispose();
    composer = null;
  };

  // State -----------------------------------------------------------------
  const intro = { reveal: 0 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const scroll = { value: 0, target: 0 };
  const stage = { ...STAGES[0] };
  let stageTarget = STAGES[0];
  const layout = {
    width: 1,
    height: 1,
    dpr: 1,
    focus: { cx: 0.57, cy: 0.42, w: 0.46, h: 0.68 },
    baseScale: 1,
    basePos: new THREE.Vector3(),
  };

  const tanHalf = () => Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  function worldAtScreen(fx, fy, z) {
    ndc.set(fx * 2 - 1, -(fy * 2 - 1));
    ray.setFromCamera(ndc, camera);
    plane.constant = -z;
    return ray.ray.intersectPlane(plane, hit) ? hit.clone() : new THREE.Vector3(0, 0, z);
  }

  function placeCamera(px = 0, py = 0) {
    camera.position.set(CAMERA_BASE.x + px * 0.38, CAMERA_BASE.y + Math.max(-0.02, py * 0.1), CAMERA_BASE.z);
    lookAt.set(LOOK_BASE.x + px * 0.12, LOOK_BASE.y + py * 0.05, LOOK_BASE.z);
    camera.lookAt(lookAt);
    camera.updateMatrixWorld();
  }

  function applyLayout() {
    const { width, height, focus } = layout;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    placeCamera(0, 0);

    // Fit the sculpture inside the focus rectangle supplied by the CSS layout.
    const depth = CAMERA_BASE.z - SCULPTURE_Z;
    const worldH = 2 * depth * tanHalf();
    const worldW = worldH * camera.aspect;
    const scale = Math.min((focus.h * worldH) / sculptureSize.y, (focus.w * worldW) / sculptureSize.x);
    layout.baseScale = scale;
    layout.basePos.copy(worldAtScreen(focus.cx, focus.cy, SCULPTURE_Z));

    // Rocks hug the frame edges; shrink them on narrow frames.
    const rockScale = THREE.MathUtils.clamp(camera.aspect / 1.5, 0.5, 1.15);
    for (const { mesh, spec } of rocks) {
      const d = CAMERA_BASE.z - spec.z;
      const halfW = d * tanHalf() * camera.aspect;
      mesh.position.set(spec.ndcX * halfW, spec.y, spec.z);
      mesh.scale.setScalar(rockScale);
    }

    const rw = Math.max(256, Math.round(width * layout.dpr * tier.reflectScale));
    const rh = Math.max(256, Math.round(height * layout.dpr * tier.reflectScale));
    water.getRenderTarget().setSize(rw, rh);
  }

  function resize(width, height, focus) {
    layout.width = Math.max(1, width);
    layout.height = Math.max(1, height);
    if (focus) layout.focus = focus;
    layout.dpr = Math.min(window.devicePixelRatio || 1, tier.maxDpr) * dprScale;
    renderer.setPixelRatio(layout.dpr);
    renderer.setSize(layout.width, layout.height, false);
    if (composer) {
      composer.setPixelRatio(layout.dpr);
      composer.setSize(layout.width, layout.height);
    }
    applyLayout();
    if (!running) render(0);
  }

  // Frame -----------------------------------------------------------------
  const timer = new THREE.Timer();
  let elapsed = 0;
  let running = false;
  let raf = 0;
  let dprScale = 1;
  let adaptive = false;
  let perfFrames = -60; // ignore the first second: intro and driver warm-up
  let perfTime = 0;
  const damp = THREE.MathUtils.damp;
  let motion = reducedMotion ? 0 : 1;

  function update(dt) {
    elapsed += dt;
    const t = elapsed;

    pointer.x = damp(pointer.x, pointer.tx * motion, 2.6, dt);
    pointer.y = damp(pointer.y, pointer.ty * motion, 2.6, dt);
    scroll.value = damp(scroll.value, scroll.target, 5, dt);
    const lambda = motion ? 1.5 : 30;
    for (const key of Object.keys(stage)) stage[key] = damp(stage[key], stageTarget[key], lambda, dt);

    const floatY = motion * (Math.sin(t * 0.52) * 0.055 + Math.sin(t * 0.21 + 1.3) * 0.025);
    const idleYaw = motion * (Math.sin(t * 0.11) * 0.13 + Math.sin(t * 0.043 + 2.0) * 0.07);
    const idlePitch = motion * Math.sin(t * 0.083 + 0.6) * 0.035;
    const sp = scroll.value * motion;

    const reveal = intro.reveal;
    const s = layout.baseScale * (0.93 + 0.07 * reveal);
    pivot.scale.setScalar(s);
    pivot.position.set(
      layout.basePos.x,
      layout.basePos.y + floatY + sp * 0.45 - (1 - reveal) * 0.18,
      layout.basePos.z,
    );
    pivot.rotation.set(
      stage.pitch + idlePitch - pointer.y * 0.1 + sp * 0.12,
      stage.yaw + idleYaw + pointer.x * 0.26 + sp * 0.75,
      stage.roll + pointer.x * -0.03,
    );

    placeCamera(pointer.x, pointer.y);

    scene.environmentRotation.y = stage.envYaw + motion * Math.sin(t * 0.033) * 0.32 + pointer.x * 0.18;
    scene.environmentIntensity = reveal * stage.key;
    chrome.color.copy(CHROME_WHITE).lerp(CHROME_CHAMPAGNE, stage.warmth);
    hemi.intensity = 0.3 * reveal * stage.glow;
    rockUniforms.rkKeyColor.value.setRGB(1.0, 0.95, 0.89).multiplyScalar(1.5 * reveal);
    rockUniforms.rkGlowColor.value.setRGB(1.0, 0.86, 0.7).multiplyScalar(3.2 * reveal * stage.glow);
    rockUniforms.rkGlowPos.value.set(pivot.position.x, Math.max(0.3, pivot.position.y - sculptureSize.y * pivot.scale.y * 0.45), SCULPTURE_Z + 1.5);

    waterUniforms.uTime.value = t * motion + (motion ? 0 : 3.0);
    waterUniforms.uReveal.value = reveal;
    waterUniforms.uCamPos.value.copy(camera.position);
  }

  function render() {
    if (composer) composer.render();
    else renderer.render(scene, camera);
  }

  function frame(timestamp) {
    raf = requestAnimationFrame(frame);
    timer.update(timestamp);
    const dt = Math.min(timer.getDelta(), 1 / 20);
    update(dt);
    render();
    if (adaptive) watchPerformance(dt);
  }

  // Drop resolution (never below ~1x), then bloom, if the device cannot
  // hold ~40fps.
  function watchPerformance(dt) {
    perfFrames++;
    if (perfFrames <= 0) return;
    perfTime += dt;
    if (perfFrames < 90) return;
    const avg = perfTime / perfFrames;
    perfFrames = 0;
    perfTime = 0;
    if (avg < 1 / 40) return;
    if (layout.dpr * 0.8 >= 0.95) {
      dprScale *= 0.8;
    } else if (composer) {
      disposeComposer();
    } else {
      adaptive = false;
    }
    resize(layout.width, layout.height);
  }

  function start() {
    if (running) return;
    running = true;
    timer.reset();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const onLost = (event) => {
    event.preventDefault();
    stop();
    onContextLost?.();
  };
  canvas.addEventListener('webglcontextlost', onLost);

  function dispose() {
    stop();
    canvas.removeEventListener('webglcontextlost', onLost);
    scene.traverse((obj) => {
      if (obj.isMesh && obj !== water) {
        obj.geometry.dispose();
      }
    });
    chrome.dispose();
    rockMat.dispose();
    water.dispose();
    waterGeo.dispose();
    envTarget.dispose();
    backdrop.dispose();
    disposeComposer();
    timer.dispose();
    renderer.dispose();
  }

  // Warm up: compile every program before the first visible frame.
  resize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight);
  update(0);
  await renderer.compileAsync(scene, camera);
  render();

  return {
    intro,
    stages: STAGES,
    resize,
    start,
    stop,
    dispose,
    render() {
      update(0);
      render();
    },
    setPointer(x, y) {
      pointer.tx = THREE.MathUtils.clamp(x, -1, 1);
      pointer.ty = THREE.MathUtils.clamp(y, -1, 1);
    },
    setScroll(p) {
      scroll.target = THREE.MathUtils.clamp(p, 0, 1);
    },
    setStage(index) {
      stageTarget = STAGES[index] || STAGES[0];
    },
    enableAdaptiveQuality() {
      adaptive = true;
    },
    setReducedMotion(value) {
      motion = value ? 0 : 1;
    },
  };
}
