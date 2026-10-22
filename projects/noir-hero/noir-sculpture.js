import * as THREE from 'three';
import { createNoise3D } from './noir-noise.js';

// The sculpture is a handful of liquid-metal sheets swept along 3D paths and
// merged into one mesh. Every control point sets the sheet's half-width, the
// direction its width opens towards and how far it cups into a trough, so the
// ribbons read as a leaf, a tall breaking wave and a lower ring rather than
// uniform tubes. Rims are thicker than the middle of each sheet (surface
// tension), every end tapers to a point, and a shared low-frequency warp keeps
// the folds from looking machined.

// Each ribbon: list of [x, y, z, halfWidth, dirX, dirY, dirZ, cup]
// (x right, y up, z towards the camera; dir = where the sheet's width opens).
export const RIBBONS = [
  // Ring: a band crossing the middle (pointed at the left) that rolls down into
  // the lower loop, tilted like a bracelet so its inner face catches the light.
  [
    [-2.75, -0.42, 0.55, 0, 0.047, 0.943, 0.33, 0.5],
    [-1.929, -0.771, -0.215, 0.62, 0, 0.68, 0.733, 0.9],
    [-1.369, -0.471, -0.535, 0.62, 0, 0.776, 0.63, 1.025],
    [-0.603, -0.344, -0.529, 0.62, 0, 0.812, 0.584, 1.127],
    [0.188, -0.421, -0.253, 0.62, 0, 0.791, 0.612, 1.188],
    [0.815, -0.682, 0.076, 0.62, 0, 0.71, 0.704, 1.197],
    [1.13, -1.067, 0.268, 0.62, 0, 0.573, 0.82, 1.152],
    [1.057, -1.483, 0.302, 0.62, 0, 0.522, 0.853, 1.062],
    [0.615, -1.832, 0.311, 0.62, 0, 0.522, 0.853, 0.942],
    [-0.093, -2.031, 0.426, 0.62, 0, 0.522, 0.853, 0.815],
    [-0.897, -2.032, 0.621, 0.62, 0, 0.522, 0.853, 0.703],
    [-1.607, -1.836, 0.723, 0.62, 0, 0.522, 0.853, 0.627],
    [-2.007, -1.478, 0.557, 0.62, 0, 0.522, 0.853, 0.6],
    [-1.983, -1.086, -0.002, 0.59, 0, 0.571, 0.821, 0.627],
    [-1.621, -0.778, -0.615, 0.295, 0, 0.709, 0.705, 0.704],
    [-1.049, -0.617, -0.999, 0, 0, 0.79, 0.613, 0.816],
  ],
  // Wave: up the right flank, over a crest that curls forward, down through
  // the centre and out to the left as the leaf reaching for the headline.
  [
    [1.4, -1.5, 0.6, 0, -0.6, 0.3, -0.7, 0.7],
    [2.05, -0.7, 0.4, 0.432, -0.8, 0.2, -0.6, 1.1],
    [2.45, 0.45, 0.1, 0.684, -0.9, 0.1, -0.4, 1.4],
    [2.4, 1.55, -0.2, 0.864, -0.85, -0.4, -0.2, 1.6],
    [1.85, 2.45, -0.4, 0.9, -0.4, -1, 0.1, 1.7],
    [0.95, 2.6, -0.25, 0.756, 0.3, -1, 0.5, 1.6],
    [0.45, 1.85, 0.2, 0.576, 0.9, -0.3, 0.4, 1.3],
    [0.3, 0.95, 0.55, 0.446, 0.9, 0.3, -0.2, 1],
    [-0.4, 0.75, 0.6, 0.62, 0.2, 1, 0.5, 1],
    [-1.3, 1.08, 0.35, 0.55, 0.1, 1, 0.7, 1.1],
    [-2, 1.32, 0.05, 0.32, 0.1, 1, 0.8, 0.9],
    [-2.6, 1.55, -0.2, 0, 0.1, 1, 0.8, 0.5],
  ],
  // Tongue: a sheet slipping out of the wave and across the centre.
  [
    [2, 1.25, 0.05, 0, -0.2, 1, 0.6, 0.6],
    [1.35, 0.75, 0.45, 0.42, -0.1, 1, 0.7, 0.9],
    [0.5, 0.25, 0.75, 0.5, 0.2, 1, 0.6, 1],
    [-0.45, -0.15, 0.8, 0.4, 0.3, 1, 0.4, 0.9],
    [-1.2, -0.45, 0.6, 0, 0.3, 1, 0.3, 0.6],
  ],
  // Flick: a short second tip sprouting above the leaf.
  [
    [0.1, 1.2, 0.2, 0, 0, 1, -0.3, 0.6],
    [-0.6, 1.45, 0.05, 0.38, 0.1, 1, -0.4, 0.9],
    [-1.35, 1.35, -0.15, 0.3, 0.2, 1, -0.3, 0.8],
    [-1.95, 1.05, -0.3, 0, 0.2, 1, -0.2, 0.5],
  ],
];

const SUPER_EXP = 2 / 2.4; // superellipse cross-section: flatter skins, rounded rims

function sweepRibbon(path, segments, radial, noise, seed, positions, indices, vertexOffset) {
  const pathCurve = new THREE.CatmullRomCurve3(path.map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'centripetal');
  const dirCurve = new THREE.CatmullRomCurve3(
    path.map(([, , , , dx, dy, dz]) => new THREE.Vector3(dx, dy, dz).normalize()),
    false,
    'catmullrom',
  );
  const shapeCurve = new THREE.CatmullRomCurve3(
    path.map(([, , , w, , , , cup]) => new THREE.Vector3(w, cup, 0)),
    false,
    'catmullrom',
  );

  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const across = new THREE.Vector3();
  const through = new THREE.Vector3();
  const prevThrough = new THREE.Vector3();
  const shape = new THREE.Vector3();

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const t = pathCurve.getUtoTmapping(u);
    pathCurve.getPointAt(u, point);
    pathCurve.getTangentAt(u, tangent);
    dirCurve.getPoint(t, across);
    shapeCurve.getPoint(t, shape);

    // Width axis: the requested direction made perpendicular to the path.
    across.addScaledVector(tangent, -across.dot(tangent)).normalize();
    through.crossVectors(tangent, across).normalize();
    if (i > 0 && through.dot(prevThrough) < 0) {
      through.negate();
      across.negate();
    }
    prevThrough.copy(through);

    // Pointed tips at both ends.
    const tip = Math.min(1, Math.min(u, 1 - u) / 0.12);
    const taper = Math.pow(tip, 0.8);
    const swell = 1 + 0.12 * noise(u * 3.0, seed, 1.7);
    const halfWidth = Math.max(0.004, shape.x * taper * swell);
    const cup = shape.y * (0.55 + 0.45 * taper);
    const sheet = (0.045 + 0.05 * halfWidth) * Math.sqrt(taper);
    const rim = (0.085 + 0.1 * halfWidth) * Math.sqrt(taper);

    for (let j = 0; j < radial; j++) {
      const v = (j / radial) * Math.PI * 2;
      const c = Math.cos(v);
      const s = Math.sin(v);
      const a = Math.sign(c) * Math.pow(Math.abs(c), SUPER_EXP); // across the width
      const b = Math.sign(s) * Math.pow(Math.abs(s), SUPER_EXP); // through the sheet

      // Thickness swells towards the rims like a pooled edge of liquid.
      const thick = sheet + (rim - sheet) * Math.pow(Math.abs(a), 6);

      // Bend the width into an arc (the cup), then offset by the thickness
      // along the arc normal so both skins stay parallel.
      const ang = a * cup;
      let ax = a * halfWidth;
      let ay = 0;
      if (Math.abs(cup) > 1e-4) {
        const r = halfWidth / cup;
        ax = r * Math.sin(ang);
        ay = r * (1 - Math.cos(ang)) - halfWidth * cup * 0.3;
      }
      const lx = ax - Math.sin(ang) * b * thick;
      const ly = ay + Math.cos(ang) * b * thick;

      positions.push(
        point.x + across.x * lx + through.x * ly,
        point.y + across.y * lx + through.y * ly,
        point.z + across.z * lx + through.z * ly,
      );
    }
  }

  // Indices wrap around each ring so the rims stay perfectly smooth.
  for (let i = 0; i < segments; i++) {
    const r0 = vertexOffset + i * radial;
    const r1 = vertexOffset + (i + 1) * radial;
    for (let j = 0; j < radial; j++) {
      const j1 = (j + 1) % radial;
      indices.push(r0 + j, r0 + j1, r1 + j, r1 + j, r0 + j1, r1 + j1);
    }
  }
  return (segments + 1) * radial;
}

export function buildSculptureGeometry({ segments = 1100, radial = 64, seed = 7, ribbons = RIBBONS } = {}) {
  const noise = createNoise3D(seed);
  const lengths = ribbons.map((path) =>
    new THREE.CatmullRomCurve3(path.map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'centripetal').getLength(),
  );
  const total = lengths.reduce((sum, l) => sum + l, 0);

  const positions = [];
  const indices = [];
  let offset = 0;
  ribbons.forEach((path, k) => {
    const segs = Math.max(48, Math.round((segments * lengths[k]) / total));
    offset += sweepRibbon(path, segs, radial, noise, k * 3.7, positions, indices, offset);
  });

  // Organic warp: one smooth vector field nudges every vertex of every sheet.
  const warpAmp = 0.1;
  const warpFreq = 0.6;
  for (let k = 0; k < positions.length; k += 3) {
    const x = positions[k] * warpFreq;
    const y = positions[k + 1] * warpFreq;
    const z = positions[k + 2] * warpFreq;
    positions[k] += warpAmp * noise(x, y, z + 11.3);
    positions[k + 1] += warpAmp * noise(x + 31.7, y, z);
    positions[k + 2] += warpAmp * noise(x, y + 57.1, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
