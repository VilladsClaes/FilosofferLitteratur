/**
 * Lægger grafen ud i 3D som et "univers" og bager koordinaterne ind i build'et.
 *
 * Formen er ikke tilfældig – den følger dataene:
 *   1. Filosofferne lægges på en tidsspiral: x = levetid, og de vikler sig
 *      udad i en helix, så samtidige tænkere ender i samme "arm".
 *   2. Hvert begreb anbringes i tyngdepunktet af de filosoffer der opfandt
 *      eller videreudviklede det – begreberne kredser altså om deres tænkere.
 *   3. Hvert artefakt anbringes i tyngdepunktet af de begreber der gav ophav
 *      til det, skubbet let udad, så artefakterne danner en ydre halo.
 *
 * Derefter afslappes hele systemet med frastødning + fjedre langs kanterne,
 * så intet overlapper, og forbundne noder ligger tæt på hinanden.
 *
 * Layoutet beregnes én gang ved build og gemmes som x/y/z på hver node, så
 * viseren er deterministisk og hurtig (ingen simulering i browseren).
 */

const STRUCTURAL = new Set([
  'INFLUENCED', 'INVENTED', 'DEVELOPED', 'REVISED', 'CRITIQUED', 'FOUNDED',
  'MEMBER_OF', 'GAVE_RISE_TO', 'EXPRESSED_IN', 'DEVELOPS_FROM',
]);

export function computeLayout(model, { iterations = 340, seed = 1337 } = {}) {
  // Deterministisk PRNG, så layoutet er reproducerbart mellem builds.
  let s = seed;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };

  const nodes = [];
  const index = new Map();
  const add = (n) => { index.set(n.id, nodes.length); nodes.push(n); return n; };

  // ── 1) Filosoffer på en tidsspiral ───────────────────────────────────────
  const born = model.philosophers.map((p) => p.born);
  const died = model.philosophers.map((p) => p.died);
  const t0 = Math.min(...born), t1 = Math.max(...died);
  const span = Math.max(1, t1 - t0);
  const TURNS = 3.1, WIDTH = 1100, R0 = 60, RGROWTH = 190;

  for (const p of model.philosophers) {
    const t = (p.born - t0) / span;
    const a = t * TURNS * Math.PI * 2;
    const r = R0 + t * RGROWTH;
    add({
      id: `philosopher:${p.id}`, group: 'filosof', t,
      x: (t - 0.5) * WIDTH,
      y: Math.cos(a) * r + (rnd() - 0.5) * 24,
      z: Math.sin(a) * r + (rnd() - 0.5) * 24,
      ax: null, ay: null, az: null,
    });
  }

  // ── 2) Begreber i tyngdepunktet af deres tænkere ─────────────────────────
  const THINKER = new Set(['INVENTED', 'DEVELOPED', 'REVISED', 'CRITIQUED', 'FOUNDED', 'MEMBER_OF']);
  const conceptAnchors = new Map();
  for (const r of model.rels) {
    if (r.fromLabel !== 'Philosopher' || r.toLabel !== 'Concept' || !THINKER.has(r.type)) continue;
    const p = nodes[index.get(`philosopher:${r.fromId}`)];
    if (!p) continue;
    const key = r.toId;
    const a = conceptAnchors.get(key) || { x: 0, y: 0, z: 0, n: 0 };
    a.x += p.x; a.y += p.y; a.z += p.z; a.n++;
    conceptAnchors.set(key, a);
  }
  for (const c of model.concepts) {
    const a = conceptAnchors.get(c.id);
    const ang = rnd() * Math.PI * 2, el = (rnd() - 0.5) * Math.PI;
    const spread = 95;
    add({
      id: `concept:${c.id}`, group: 'begreb',
      x: (a ? a.x / a.n : 0) + Math.cos(ang) * Math.cos(el) * spread,
      y: (a ? a.y / a.n : 0) + Math.sin(el) * spread * 0.7,
      z: (a ? a.z / a.n : 0) + Math.sin(ang) * Math.cos(el) * spread,
      ax: a ? a.x / a.n : 0, ay: a ? a.y / a.n : 0, az: a ? a.z / a.n : 0,
    });
  }

  // ── 3) Artefakter i tyngdepunktet af deres begreber, skubbet udad ────────
  const anchorOfConcept = new Map();
  for (const n of nodes) anchorOfConcept.set(n.id, n);
  const artifactAnchors = new Map();
  for (const r of model.rels) {
    if (r.fromLabel !== 'Concept' || r.toLabel !== 'Artifact') continue;
    const c = anchorOfConcept.get(`concept:${r.fromId}`);
    if (!c) continue;
    const a = artifactAnchors.get(r.toId) || { x: 0, y: 0, z: 0, n: 0 };
    a.x += c.x; a.y += c.y; a.z += c.z; a.n++;
    artifactAnchors.set(r.toId, a);
  }
  for (const art of model.artifacts) {
    const a = artifactAnchors.get(art.id);
    const cx = a ? a.x / a.n : 0, cy = a ? a.y / a.n : 0, cz = a ? a.z / a.n : 0;
    // Skub udad fra aksen, så artefakter danner en ydre skal.
    const rxz = Math.hypot(cy, cz) || 1;
    const ang = rnd() * Math.PI * 2;
    const out = 130;
    add({
      id: `artifact:${art.id}`, group: 'artefakt',
      x: cx + (rnd() - 0.5) * 150,
      y: cy + (cy / rxz) * out + Math.cos(ang) * 60,
      z: cz + (cz / rxz) * out + Math.sin(ang) * 60,
      ax: cx, ay: cy, az: cz,
    });
  }

  // ── Epoker ───────────────────────────────────────────────────────────────
  const eraAnchors = new Map();
  for (const p of model.philosophers) {
    const n = nodes[index.get(`philosopher:${p.id}`)];
    const a = eraAnchors.get(p.era) || { x: 0, y: 0, z: 0, n: 0 };
    a.x += n.x; a.y += n.y; a.z += n.z; a.n++;
    eraAnchors.set(p.era, a);
  }
  for (const e of model.eras) {
    const a = eraAnchors.get(e.id);
    const cx = a ? a.x / a.n : 0, cy = a ? a.y / a.n : 0, cz = a ? a.z / a.n : 0;
    add({ id: `era:${e.id}`, group: 'epoke', x: cx, y: cy + 320, z: cz, ax: cx, ay: cy, az: cz });
  }

  // ── Kanter til afslapningen ──────────────────────────────────────────────
  const edges = [];
  for (const r of model.rels) {
    if (!STRUCTURAL.has(r.type)) continue;
    const a = index.get(`${r.fromLabel === 'Philosopher' ? 'philosopher' : r.fromLabel === 'Concept' ? 'concept' : r.fromLabel === 'Artifact' ? 'artifact' : 'era'}:${r.fromId}`);
    const b = index.get(`${r.toLabel === 'Philosopher' ? 'philosopher' : r.toLabel === 'Concept' ? 'concept' : r.toLabel === 'Artifact' ? 'artifact' : 'era'}:${r.toId}`);
    if (a === undefined || b === undefined) continue;
    const w = r.type === 'GAVE_RISE_TO' || r.type === 'EXPRESSED_IN' ? 0.55 : 1;
    edges.push([a, b, w]);
  }

  // ── Afslapning: frastødning (gitter) + fjedre + anker-træk ───────────────
  const n = nodes.length;
  const vel = new Float64Array(n * 3);
  const P = new Float64Array(n * 3);
  nodes.forEach((p, i) => { P[i * 3] = p.x; P[i * 3 + 1] = p.y; P[i * 3 + 2] = p.z; });

  const CELL = 105;
  const REP = 210000;
  const SPRING = 0.012, LEN = 78;
  const ANCHOR_K = 0.02;

  for (let it = 0; it < iterations; it++) {
    const grid = new Map();
    for (let i = 0; i < n; i++) {
      const k = `${Math.floor(P[i * 3] / CELL)},${Math.floor(P[i * 3 + 1] / CELL)},${Math.floor(P[i * 3 + 2] / CELL)}`;
      let b = grid.get(k);
      if (!b) { b = []; grid.set(k, b); }
      b.push(i);
    }
    for (let i = 0; i < n; i++) {
      const cx = Math.floor(P[i * 3] / CELL), cy = Math.floor(P[i * 3 + 1] / CELL), cz = Math.floor(P[i * 3 + 2] / CELL);
      for (let gx = cx - 1; gx <= cx + 1; gx++)
        for (let gy = cy - 1; gy <= cy + 1; gy++)
          for (let gz = cz - 1; gz <= cz + 1; gz++) {
            const b = grid.get(`${gx},${gy},${gz}`);
            if (!b) continue;
            for (const j of b) {
              if (j <= i) continue;
              let dx = P[j * 3] - P[i * 3], dy = P[j * 3 + 1] - P[i * 3 + 1], dz = P[j * 3 + 2] - P[i * 3 + 2];
              let d2 = dx * dx + dy * dy + dz * dz;
              if (d2 > CELL * CELL * 6.25) continue;
              if (d2 < 1) { dx = rnd() - 0.5; dy = rnd() - 0.5; dz = rnd() - 0.5; d2 = 1; }
              const d = Math.sqrt(d2);
              const f = REP / d2;
              const fx = (dx / d) * f, fy = (dy / d) * f, fz = (dz / d) * f;
              vel[i * 3] -= fx; vel[i * 3 + 1] -= fy; vel[i * 3 + 2] -= fz;
              vel[j * 3] += fx; vel[j * 3 + 1] += fy; vel[j * 3 + 2] += fz;
            }
          }
    }
    for (const [a, b, w] of edges) {
      const dx = P[b * 3] - P[a * 3], dy = P[b * 3 + 1] - P[a * 3 + 1], dz = P[b * 3 + 2] - P[a * 3 + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const f = (d - LEN) * SPRING * w;
      const fx = (dx / d) * f, fy = (dy / d) * f, fz = (dz / d) * f;
      vel[a * 3] += fx; vel[a * 3 + 1] += fy; vel[a * 3 + 2] += fz;
      vel[b * 3] -= fx; vel[b * 3 + 1] -= fy; vel[b * 3 + 2] -= fz;
    }
    const cool = 1 - it / iterations;
    for (let i = 0; i < n; i++) {
      const p = nodes[i];
      if (p.ax !== null) {
        vel[i * 3] += (p.ax - P[i * 3]) * ANCHOR_K;
        vel[i * 3 + 1] += (p.ay - P[i * 3 + 1]) * ANCHOR_K;
        vel[i * 3 + 2] += (p.az - P[i * 3 + 2]) * ANCHOR_K;
      }
      for (let c = 0; c < 3; c++) {
        vel[i * 3 + c] *= 0.78;
        if (vel[i * 3 + c] > 26) vel[i * 3 + c] = 26;
        if (vel[i * 3 + c] < -26) vel[i * 3 + c] = -26;
        P[i * 3 + c] += vel[i * 3 + c] * (0.35 + 0.65 * cool);
      }
    }
  }

  // ── Centrér og rapportér kvalitetsmål ────────────────────────────────────
  let mx = 0, my = 0, mz = 0;
  for (let i = 0; i < n; i++) { mx += P[i * 3]; my += P[i * 3 + 1]; mz += P[i * 3 + 2]; }
  mx /= n; my /= n; mz /= n;

  const out = new Map();
  let extent = 0;
  for (let i = 0; i < n; i++) {
    const x = P[i * 3] - mx, y = P[i * 3 + 1] - my, z = P[i * 3 + 2] - mz;
    out.set(nodes[i].id, { x: +x.toFixed(2), y: +y.toFixed(2), z: +z.toFixed(2) });
    extent = Math.max(extent, Math.hypot(x, y, z));
  }

  // Kvalitetsmål: mindste afstand mellem to noder og gennemsnitlig kantlængde.
  let minDist = Infinity;
  const sample = Math.min(n, 420);
  for (let i = 0; i < sample; i++) {
    for (let j = i + 1; j < sample; j++) {
      const d = Math.hypot(P[i * 3] - P[j * 3], P[i * 3 + 1] - P[j * 3 + 1], P[i * 3 + 2] - P[j * 3 + 2]);
      if (d < minDist) minDist = d;
    }
  }
  let edgeLen = 0;
  for (const [a, b] of edges) {
    edgeLen += Math.hypot(P[a * 3] - P[b * 3], P[a * 3 + 1] - P[b * 3 + 1], P[a * 3 + 2] - P[b * 3 + 2]);
  }
  edgeLen /= edges.length || 1;

  return {
    positions: out,
    metrics: {
      noder: n,
      kanter: edges.length,
      udstraekning: +extent.toFixed(1),
      mindsteAfstand: +minDist.toFixed(1),
      gennemsnitligKantlaengde: +edgeLen.toFixed(1),
    },
  };
}
