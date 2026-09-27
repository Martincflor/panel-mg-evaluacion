// Garabato pastel: materiales de garabatos (red densa de trazos de crayón), fondos de atardecer,
// el personaje Neuri (una neurona) y props. Todo determinista (semillas, sin Math.random).
import * as L from './engine/lib.js';
import { layoutRich, title } from './engine/base.js';

export const C = {
  PINK: '#F4A7BB', MINT: '#9ED9C0', LAV: '#C9B3EA', BUTTER: '#FFE39A', SKY: '#B5D8F2', PEACH: '#FFC4A3',
  CORAL: '#EE7C98', GOLD: '#FFD27A', PLUM: '#4A3A5C', CREAM: '#FFF6EA', LAVD: '#A48BD3', MINTD: '#6FBF9F', PINKD: '#E58AA3',
};
export const boil = K => Math.floor(K.t * 8); // los trazos "hierven" 8 veces por segundo

// ---------- texturas de garabato (tiles sin costura) ----------
function scribbleTex(size, base, cols, seed, { n = 650, lw = [2, 5.5], alpha = [0.35, 0.85], step = [9, 24], curl = 1.1 } = {}) {
  const c = L.canvas(size, size), x = c.getContext('2d'), r = L.rng(seed);
  x.fillStyle = base; x.fillRect(0, 0, size, size); x.lineCap = 'round'; x.lineJoin = 'round';
  for (let i = 0; i < n; i++) {
    x.strokeStyle = cols[Math.floor(r() * cols.length)]; x.globalAlpha = alpha[0] + r() * (alpha[1] - alpha[0]); x.lineWidth = lw[0] + r() * (lw[1] - lw[0]);
    let px = r() * size, py = r() * size, a = r() * 6.283; const m = 5 + Math.floor(r() * 12), pts = [[px, py]];
    for (let k = 0; k < m; k++) { a += (r() - 0.5) * curl * 2; const st = step[0] + r() * (step[1] - step[0]); px += Math.cos(a) * st; py += Math.sin(a) * st; pts.push([px, py]); }
    for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) {
      x.beginPath(); x.moveTo(pts[0][0] + ox, pts[0][1] + oy);
      for (let k = 1; k < pts.length - 1; k++) { const mx = (pts[k][0] + pts[k + 1][0]) / 2, my = (pts[k][1] + pts[k + 1][1]) / 2; x.quadraticCurveTo(pts[k][0] + ox, pts[k][1] + oy, mx + ox, my + oy); }
      x.stroke();
    }
  }
  return c;
}
const MATS = {
  pink: ['#F9CBD7', [C.PINK, C.PEACH, C.LAV, C.BUTTER, C.CORAL, '#FFFFFF', C.PINKD]],
  peach: ['#FFD9C2', [C.PEACH, C.PINK, C.BUTTER, '#FFFFFF', '#F7B08C']],
  lav: ['#DCCDF2', [C.LAV, '#B9A3E3', C.PINK, C.SKY, '#EDE4FA', C.LAVD]],
  lavDeep: ['#CDB9EE', [C.LAV, C.LAVD, '#B9A3E3', C.PINK, C.SKY]],
  mint: ['#CFF0E1', [C.MINT, C.SKY, '#EAF9F2', C.BUTTER, C.LAV, C.MINTD]],
  butter: ['#FFF1C4', [C.BUTTER, C.PEACH, '#FFFFFF', C.PINK, C.GOLD]],
  sky: ['#D3E9F8', [C.SKY, C.LAV, '#FFFFFF', C.MINT]],
  caramel: ['#EDCBA6', ['#DDA97F', C.PEACH, '#F4D8BA', C.PINK, '#C9936C']],
  amyloid: ['#CFC4D9', ['#A898B8', '#B8AEC4', '#DDD5E4', '#9C8FAE', '#C4B6CF']],
};
export const TEX = {};
export function initMats() {
  if (TEX.pink) return;
  let sd = 1; for (const [k, [base, cols]] of Object.entries(MATS)) TEX[k] = [0, 1, 2].map(v => scribbleTex(320, base, cols, (sd++) * 97 + v * 13));
  TEX.paper = [scribbleTex(320, C.CREAM, [C.PINK, C.MINT, C.LAV, C.BUTTER, C.SKY], 7, { n: 120, alpha: [0.12, 0.3], lw: [1.5, 3.5] })];
}
// rellena un Path2D con el material (textura en escala de pantalla aunque el contexto esté escalado)
export function fillMat(ctx, path, mat, bt = 0, alpha = 1) {
  const arr = TEX[mat] || TEX.pink, pat = ctx.createPattern(arr[bt % arr.length], 'repeat'), m = ctx.getTransform(), k = Math.hypot(m.a, m.b) || 1;
  pat.setTransform(new DOMMatrix().scale(1 / k));
  ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = pat; ctx.fill(path); ctx.restore();
}

// ---------- geometría ----------
export const ellipsePts = (cx, cy, rx, ry, n = 26, wob = 0, seed = 1) => { const r = L.rng(seed); return Array.from({ length: n }, (_, i) => { const a = i / n * 6.2832, k = 1 + (r() - 0.5) * wob; return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]; }); };
export function smoothPath(pts, closed = true, jit = 0, seed = 1) {
  const r = L.rng(seed), P = pts.map(([x, y]) => [x + (r() - 0.5) * jit, y + (r() - 0.5) * jit]), p = new Path2D(), n = P.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if (!closed) { p.moveTo(...P[0]); for (let i = 1; i < n - 1; i++) p.quadraticCurveTo(...P[i], ...mid(P[i], P[i + 1])); p.lineTo(...P[n - 1]); return p; }
  p.moveTo(...mid(P[n - 1], P[0])); for (let i = 0; i < n; i++) p.quadraticCurveTo(...P[i], ...mid(P[i], P[(i + 1) % n])); p.closePath(); return p;
}
// contorno a crayón: 2–3 pasadas temblorosas
export function scrib(ctx, pts, { w = 4, color = C.PLUM, seed = 1, jit = 2.2, passes = 2, closed = true, alpha = 0.9 } = {}) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let k = 0; k < passes; k++) { ctx.globalAlpha = alpha * (k ? 0.55 : 1); ctx.lineWidth = w * (k ? 0.6 : 1); ctx.stroke(smoothPath(pts, closed, jit * (k + 1), seed * 7 + k * 31)); }
  ctx.restore();
}
export function shape(ctx, pts, mat, bt, o = {}) { fillMat(ctx, smoothPath(pts, true, 0), mat, bt, o.alpha ?? 1); if (o.line !== false) scrib(ctx, pts, { w: o.w ?? 4, color: o.color ?? C.PLUM, seed: (o.seed || 1) + bt, jit: o.jit ?? 2.2, alpha: o.lineAlpha ?? 0.9 }); }
// garabato suelto (un trazo de crayón)
export function strand(ctx, pts, { w = 5, color = C.LAV, seed = 1, jit = 3, alpha = 0.9 } = {}) { scrib(ctx, pts, { w, color, seed, jit, closed: false, passes: 2, alpha }); }

// luz cálida (se suma, no ensucia)
export function glow(ctx, x, y, r, col = C.GOLD, a = 0.6) {
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, L.rgba(col, a)); g.addColorStop(0.45, L.rgba(col, a * 0.35)); g.addColorStop(1, L.rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
}

// ---------- fondos (pantalla completa, pre-renderizados) ----------
function tree(ctx, x, base, hgt, seed, kind) {
  const r = L.rng(seed); ctx.save(); ctx.lineCap = 'round';
  shape(ctx, [[x - 12, base], [x - 9, base - hgt * 0.45], [x + 9, base - hgt * 0.45], [x + 12, base]], 'lavDeep', seed, { color: C.LAVD, w: 3 });
  if (kind === 'pine') for (let k = 0; k < 3; k++) { const y0 = base - hgt * (0.3 + k * 0.22), wd = hgt * (0.34 - k * 0.07); shape(ctx, [[x - wd, y0], [x, y0 - hgt * 0.36], [x + wd, y0]], 'lav', seed + k, { color: C.LAVD, w: 3.5, jit: 4 }); }
  else for (let k = 0; k < 4; k++) { const cx = x + (r() - 0.5) * hgt * 0.35, cy = base - hgt * (0.6 + r() * 0.3), rr = hgt * (0.17 + r() * 0.08); shape(ctx, ellipsePts(cx, cy, rr, rr * 0.9, 18, 0.18, seed + k), 'lav', seed + k, { color: C.LAVD, w: 3.5, jit: 4 }); }
  ctx.restore();
}
export function makeBackgrounds(W, H) {
  const BG = {};
  // atardecer: cielo mantequilla → durazno → rosa → lavanda, sol, árboles lavanda y pasto menta
  { const c = L.canvas(W, H), x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#FFEFC2'); g.addColorStop(0.3, '#FFD9BD'); g.addColorStop(0.52, '#FBC6D3'); g.addColorStop(0.72, '#DCCBF2'); g.addColorStop(1, '#D3C2EE');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.globalAlpha = 0.28; x.fillStyle = x.createPattern(TEX.sky[0], 'repeat'); x.fillRect(0, 0, W, H); x.globalAlpha = 1;
    const sx = W * 0.68, sy = H * 0.4, sr = Math.min(W, H) * 0.14; glow(x, sx, sy, sr * 3.2, C.GOLD, 0.7); shape(x, ellipsePts(sx, sy, sr, sr, 24, 0.05, 3), 'butter', 0, { color: '#F6C56B', w: 4 });
    const hz = H * 0.66; shape(x, [[-40, H], [-40, hz], ...Array.from({ length: 9 }, (_, i) => [i * W / 8, hz - 40 - Math.sin(i * 1.3) * 45]), [W + 40, hz], [W + 40, H]], 'lav', 1, { color: C.LAVD, w: 3, alpha: 0.8 });
    const tb = H * 0.745; [[W * 0.04, 0.95, 'round'], [W * 0.17, 0.72, 'pine'], [W * 0.85, 0.9, 'pine'], [W * 0.97, 0.7, 'round']].forEach(([tx, k, kind], i) => tree(x, tx, tb, H * 0.3 * k, 11 + i * 5, kind));
    shape(x, [[-40, H + 40], [-40, H * 0.73], ...Array.from({ length: 7 }, (_, i) => [i * W / 6, H * 0.73 - Math.sin(i * 0.9 + 1) * 22]), [W + 40, H * 0.73], [W + 40, H + 40]], 'mint', 2, { color: C.MINTD, w: 4 });
    const r = L.rng(5); for (let i = 0; i < 70; i++) { const gx = r() * W, gy = H * 0.75 + r() * H * 0.25; strand(x, [[gx, gy], [gx + (r() - 0.5) * 10, gy - 14 - r() * 18]], { w: 3, color: [C.MINTD, C.LAV, C.PINK][i % 3], seed: i, jit: 2, alpha: 0.7 }); }
    BG.sunset = c; }
  // papel crema con motas pastel
  { const c = L.canvas(W, H), x = c.getContext('2d'); x.fillStyle = C.CREAM; x.fillRect(0, 0, W, H); x.fillStyle = x.createPattern(TEX.paper[0], 'repeat'); x.fillRect(0, 0, W, H);
    const g = x.createRadialGradient(W * 0.2, H * 0.1, 0, W * 0.2, H * 0.1, H * 0.9); g.addColorStop(0, 'rgba(255,214,150,.28)'); g.addColorStop(1, 'rgba(255,214,150,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    BG.paper = c; }
  // lavanda (interior del cerebro)
  { const c = L.canvas(W, H), x = c.getContext('2d'); x.fillStyle = '#EFE6FA'; x.fillRect(0, 0, W, H); x.globalAlpha = 0.55; x.fillStyle = x.createPattern(TEX.lav[1], 'repeat'); x.fillRect(0, 0, W, H); x.globalAlpha = 1;
    glow(x, W * 0.5, H * 0.15, H * 0.5, C.GOLD, 0.35); BG.lav = c; }
  return BG;
}

// ---------- Neuri: una neurona de garabatos ----------
// Modelo local: pies en (0,0), alto 250, ancho ~260. Respeta L.POSE (armL, armR, walk, hop, sx, sy, rot, look, eyes, flip).
export function neuri(K, ctx, box, { bob = 0, mood = 'dot', p = 1 } = {}) {
  const P = L.POSE || {}, MH = 250, s = box.h / MH * p, bt = boil(K), t = K.t;
  const fx = box.x + box.w / 2, fy = box.y + box.h + bob - (P.hop || 0);
  ctx.save(); ctx.translate(fx, fy);
  ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = C.PLUM; ctx.beginPath(); ctx.ellipse(0, 0, 80 * s, 12 * s, 0, 0, 7); ctx.fill(); ctx.restore();
  ctx.rotate(P.rot || 0); ctx.scale((P.sx || 1) * (P.flip ? -1 : 1) * s, (P.sy || 1) * s);
  const toC = (x, y) => { const m = ctx.getTransform(); return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]; };
  const lw = 4.2;
  // axón (detrás): cola con vainas de mielina menta y botones terminales mantequilla
  { const sw = Math.sin(t * 2.2) * 8, a0 = [55, -60], c1 = [115, -70 + sw], c2 = [150, -25 - sw], a1 = [128, 8];
    const bz = u => { const v = 1 - u; return [v * v * v * a0[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u * u * u * a1[0], v * v * v * a0[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u * u * u * a1[1]]; };
    const pts = Array.from({ length: 14 }, (_, i) => bz(i / 13));
    strand(ctx, pts, { w: 9, color: C.LAVD, seed: bt, jit: 1.5 }); strand(ctx, pts, { w: 4, color: C.PINK, seed: bt + 9, jit: 3 });
    [0.3, 0.55, 0.78].forEach((u, i) => { const [x, y] = bz(u), [x2, y2] = bz(u + 0.02), a = Math.atan2(y2 - y, x2 - x); ctx.save(); ctx.translate(x, y); ctx.rotate(a); shape(ctx, ellipsePts(0, 0, 15, 9, 14), 'mint', bt + i, { w: 3, seed: 40 + i }); ctx.restore(); });
    const [ex, ey] = a1; [-0.9, 0, 0.9].forEach((d, i) => { const tx = ex + Math.cos(0.6 + d) * 20, ty = ey + Math.sin(0.6 + d) * 14 - 8; strand(ctx, [[ex, ey], [tx, ty]], { w: 4, color: C.LAVD, seed: bt + i }); shape(ctx, ellipsePts(tx, ty, 7, 7, 10), 'butter', bt + i, { w: 2.5, seed: 50 + i }); }); }
  // piernas
  [-1, 1].forEach((sd, k) => { const lift = P.walk !== undefined ? Math.max(0, Math.sin(P.walk + k * Math.PI)) * 14 : 0, x = sd * 30;
    shape(ctx, [[x - 13, -44], [x + 13, -44], [x + 14, -4 - lift], [x + 4, 1 - lift], [x - 12, -3 - lift]], 'peach', bt + k, { w: lw * 0.9, seed: 60 + k }); });
  // soma (cuerpo): pera redondeada
  const body = ellipsePts(0, -112, 90, 80, 30, 0.06, 7).map(([x, y]) => [x * (1 + Math.max(0, (y + 112) / 80) * 0.08), y]);
  shape(ctx, body, 'pink', bt, { w: lw * 1.25, seed: 70 });
  { const r = L.rng(300 + bt); for (let i = 0; i < 22; i++) { const k = Math.floor(r() * body.length), [x, y] = body[k], a = Math.atan2(y + 112, x), q = [];
      for (let j = 0; j < 5; j++) q.push([x + Math.cos(a + (r() - 0.5) * 2.2) * (4 + r() * 12), y + Math.sin(a + (r() - 0.5) * 2.2) * (4 + r() * 12)]);
      strand(ctx, q, { w: 2.2, color: [C.CORAL, C.LAV, C.PEACH, C.BUTTER, C.PINKD][i % 5], seed: i + bt, jit: 2, alpha: 0.75 }); } }
  // luz cálida del lado izquierdo (atardecer)
  ctx.save(); ctx.clip(smoothPath(body)); const lg = ctx.createLinearGradient(-90, -190, 60, -40); lg.addColorStop(0, 'rgba(255,226,150,.55)'); lg.addColorStop(1, 'rgba(255,226,150,0)'); ctx.fillStyle = lg; ctx.fillRect(-100, -200, 200, 170); ctx.restore();
  // dendritas en la cabeza (su "peinado")
  [[-42, -178, -2.2], [0, -192, -1.57], [42, -178, -0.95]].forEach(([x, y, a0], i) => {
    const a = a0 + Math.sin(t * 3 + i * 1.7) * 0.12, L1 = 42, ex = x + Math.cos(a) * L1, ey = y + Math.sin(a) * L1;
    strand(ctx, [[x, y + 8], [(x + ex) / 2, (y + ey) / 2 - 3], [ex, ey]], { w: 8, color: C.LAVD, seed: bt + i * 3, jit: 1.4 });
    strand(ctx, [[x, y + 8], [ex, ey]], { w: 3.5, color: C.MINT, seed: bt + i * 5, jit: 3 });
    [-0.55, 0.55].forEach((d, j) => { const b = a + d, bx = ex + Math.cos(b) * 22, by = ey + Math.sin(b) * 22; strand(ctx, [[ex, ey], [bx, by]], { w: 5, color: C.LAVD, seed: bt + i * 7 + j }); shape(ctx, ellipsePts(bx, by, 6.5, 6.5, 10), j ? 'butter' : 'mint', bt + j, { w: 2.4, seed: 80 + i * 2 + j }); });
  });
  // brazos (dendritas cortas) con manitas de tres deditos
  const arm = (side, deg) => { const pv = [side * 82, -112], base = side < 0 ? Math.PI - 0.6 : 0.6, a = side < 0 ? base + deg * Math.PI / 180 : base - deg * Math.PI / 180, len = 54;
    const hx = pv[0] + Math.cos(a) * len, hy = pv[1] + Math.sin(a) * len, mx = (pv[0] + hx) / 2 - Math.sin(a) * 6 * side, my = (pv[1] + hy) / 2 + Math.cos(a) * 6;
    strand(ctx, [pv, [mx, my], [hx, hy]], { w: 11, color: C.PINKD, seed: bt + (side > 0 ? 3 : 1), jit: 1.2 });
    strand(ctx, [pv, [mx, my], [hx, hy]], { w: 4, color: C.PEACH, seed: bt + 11, jit: 2.5 });
    [-0.6, 0, 0.6].forEach((d, j) => { const fa = a + d; strand(ctx, [[hx, hy], [hx + Math.cos(fa) * 13, hy + Math.sin(fa) * 13]], { w: 4.5, color: C.PLUM, seed: bt + j, jit: 1 }); });
    return toC(hx + Math.cos(a) * 6, hy + Math.sin(a) * 6); };
  L.MLAST.handL = arm(-1, P.armL ?? 0); L.MLAST.handR = arm(1, P.armR ?? 0);
  // cara
  const lk = P.look || [0, 0], blink = (Math.floor(t * 30) % 100) < 4, es = P.eyes || (blink ? 'closed' : mood === 'happy' ? 'happy' : 'dot');
  [-31, 31].forEach((ex0, k) => { const ex = ex0 + lk[0] * 5, ey = -124 + lk[1] * 5;
    ctx.save(); ctx.strokeStyle = C.PLUM; ctx.fillStyle = C.PLUM; ctx.lineCap = 'round';
    if (es === 'happy') { ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex - 13, ey + 5); ctx.quadraticCurveTo(ex, ey - 12, ex + 13, ey + 5); ctx.stroke(); }
    else if (es === 'closed') { ctx.lineWidth = 5.5; ctx.beginPath(); ctx.moveTo(ex - 13, ey); ctx.quadraticCurveTo(ex, ey + 9, ex + 13, ey); ctx.stroke(); }
    else { const R = es === 'wide' ? 1.25 : 1; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(ex, ey, 17 * R, 21 * R, 0, 0, 7); ctx.fill(); scrib(ctx, ellipsePts(ex, ey, 17 * R, 21 * R, 16), { w: 3.2, seed: bt + k * 5, jit: 1.2, passes: 1 });
      ctx.fillStyle = C.PLUM; ctx.beginPath(); ctx.ellipse(ex + lk[0] * 5, ey + 3 + lk[1] * 5, 9.5 * R, 11 * R, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(ex + lk[0] * 5 + 3.5, ey - 1 + lk[1] * 5, 3.6, 0, 7); ctx.fill(); }
    ctx.restore(); });
  ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = C.CORAL; [-54, 54].forEach(cx => { ctx.beginPath(); ctx.ellipse(cx + lk[0] * 3, -98, 12, 8, 0, 0, 7); ctx.fill(); }); ctx.restore();
  ctx.save(); ctx.strokeStyle = C.PLUM; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.beginPath();
  if (P.mouth === 'o' || es === 'wide') { ctx.ellipse(lk[0] * 4, -91, 6, 7.5, 0, 0, 7); ctx.stroke(); } else if (es === 'closed') { ctx.moveTo(-6 + lk[0] * 4, -92); ctx.quadraticCurveTo(lk[0] * 4, -88, 6 + lk[0] * 4, -92); ctx.stroke(); } else { ctx.moveTo(-10 + lk[0] * 4, -95); ctx.quadraticCurveTo(lk[0] * 4, -84, 10 + lk[0] * 4, -95); ctx.stroke(); }
  ctx.restore();
  L.MLAST.top = toC(0, -250); L.MLAST.center = toC(0, -115); L.MLAST.s = s;
  ctx.restore();
}

// ---------- props ----------
export function fire(K, x, y, sc = 1, t = K.t, { embers = false } = {}) {
  const ctx = K.ctx, bt = boil(K), f = 1 + 0.12 * Math.sin(t * 11) + 0.07 * Math.sin(t * 17 + 1);
  glow(ctx, x, y - 90 * sc, (embers ? 260 : 420) * sc, C.GOLD, embers ? 0.45 : 0.7);
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  [-0.32, 0.32].forEach((r, i) => { ctx.save(); ctx.rotate(r); shape(ctx, [[-95, -16], [95, -16], [100, 0], [95, 16], [-95, 16], [-100, 0]], 'caramel', bt + i, { w: 4, seed: 90 + i }); ctx.restore(); });
  const drop = (h, w, dx, mat, seed) => shape(ctx, Array.from({ length: 20 }, (_, i) => { const a = i / 20 * 6.2832, k = Math.sin(a / 2); return [dx + Math.sin(a) * w * k * (1 + 0.08 * Math.sin(t * 9 + seed)), -10 - (1 + Math.cos(a)) * 0.5 * h * f]; }), mat, bt + seed, { w: 3, color: '#F29A7A', seed });
  if (embers) { drop(55, 50, 0, 'peach', 1); drop(32, 30, 4, 'butter', 2); }
  else { drop(230, 88, 0, 'peach', 1); drop(165, 62, -6, 'pink', 3); drop(110, 42, 5, 'butter', 2); }
  const r = L.rng(3); for (let i = 0; i < (embers ? 4 : 9); i++) { const ph = (t * 0.6 + r()) % 1, sx = (r() - 0.5) * 120 + Math.sin(t * 3 + i) * 14, sy = -60 - ph * (embers ? 140 : 300); ctx.globalAlpha = 1 - ph; ctx.fillStyle = [C.BUTTER, C.PEACH, C.PINK][i % 3]; ctx.beginPath(); ctx.arc(sx, sy, 5 + r() * 4, 0, 7); ctx.fill(); }
  ctx.restore();
}
export function spark(K, x, y, r, t = K.t) { // la chispita luminosa que sostiene Neuri
  const ctx = K.ctx, k = 1 + 0.1 * Math.sin(t * 6); glow(ctx, x, y, r * 5, C.GOLD, 0.8);
  L.star(ctx, x, y, r * k, 5, 0.5, -Math.PI / 2 + t * 0.6); const pth = new Path2D(); { const n = 10; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + t * 0.6 + i * Math.PI / 5, rr = i % 2 ? r * k * 0.5 : r * k; i ? pth.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : pth.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } pth.closePath(); }
  fillMat(ctx, pth, 'butter', boil(K)); ctx.save(); ctx.strokeStyle = '#F2B84B'; ctx.lineWidth = 3; ctx.stroke(pth); ctx.restore();
}
// cerebro visto de lado: contorno + surcos + cerebelo y tronco
export function brainPts(cx, cy, rx, ry) { return Array.from({ length: 40 }, (_, i) => { const a = i / 40 * 6.2832, b = 1 + 0.035 * Math.sin(a * 9) + 0.03 * Math.sin(a * 5 + 1); let x = Math.cos(a) * rx * b, y = Math.sin(a) * ry * b; if (y > 0) y *= 0.78; return [cx + x, cy + y]; }); }
export function brain(K, cx, cy, rx, ry, { gyri = 1 } = {}) {
  const ctx = K.ctx, bt = boil(K);
  shape(ctx, ellipsePts(cx + rx * 0.45, cy + ry * 0.68, rx * 0.34, ry * 0.25, 18, 0.05, 4), 'peach', bt, { w: 4, seed: 7 });
  shape(ctx, [[cx + rx * 0.05, cy + ry * 0.5], [cx + rx * 0.22, cy + ry * 0.5], [cx + rx * 0.24, cy + ry * 1.15], [cx + rx * 0.08, cy + ry * 1.15]], 'pink', bt, { w: 4, seed: 8 });
  const pts = brainPts(cx, cy, rx, ry); shape(ctx, pts, 'pink', bt, { w: 5, seed: 9 });
  if (gyri > 0) { ctx.save(); ctx.clip(smoothPath(pts)); const r = L.rng(21);
    for (let i = 0; i < 11; i++) { const y0 = cy - ry * 0.8 + i * ry * 0.16, x0 = cx - rx * 0.95, q = []; for (let k = 0; k <= 12; k++) q.push([x0 + k * rx * 0.16, y0 + Math.sin(k * 1.6 + i) * ry * 0.06 + (r() - 0.5) * 6]);
      ctx.globalAlpha = gyri; strand(ctx, q, { w: 5, color: C.PINKD, seed: i + bt, jit: 2.5, alpha: 0.75 }); }
    ctx.restore(); }
  return pts;
}
export function cell(K, x, y, r, seed, mat = 'lav') {
  const ctx = K.ctx, bt = boil(K), rr = L.rng(seed);
  for (let k = 0; k < 4; k++) { const a = rr() * 6.28, l = r * (1.25 + rr() * 0.25); strand(ctx, [[x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8], [x + Math.cos(a + 0.15) * l, y + Math.sin(a + 0.15) * l]], { w: 6, color: C.LAVD, seed: seed + k + bt }); }
  shape(ctx, ellipsePts(x, y, r, r * 0.92, 20, 0.12, seed), mat, bt, { w: 4, seed });
  shape(ctx, ellipsePts(x + r * 0.08, y - r * 0.05, r * 0.3, r * 0.28, 12, 0.1, seed + 1), 'pink', bt, { w: 3, seed: seed + 2 });
}
export function amyloid(K, x, y, r, seed) {
  const ctx = K.ctx, bt = boil(K), rr = L.rng(seed); for (let k = 0; k < 3; k++) shape(ctx, ellipsePts(x + (rr() - 0.5) * r, y + (rr() - 0.5) * r * 0.7, r * (0.55 + rr() * 0.3), r * (0.45 + rr() * 0.25), 14, 0.3, seed + k), 'amyloid', bt, { w: 3.2, color: '#7D6E8F', seed: seed + k });
}
export function broom(K, x, y, sc = 1, ang = 0.5) {
  const ctx = K.ctx, bt = boil(K); ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc);
  shape(ctx, [[-5, -70], [5, -70], [5, 95], [-5, 95]], 'caramel', bt, { w: 3, seed: 3 });
  shape(ctx, [[-10, 90], [10, 90], [34, 165], [-34, 165]], 'butter', bt, { w: 3.5, seed: 4 });
  for (let i = -3; i <= 3; i++) strand(ctx, [[i * 3, 100], [i * 9, 162]], { w: 2.5, color: '#E0B25A', seed: i + bt, jit: 1.5 });
  ctx.restore();
}
export function valve(K, x, y, r, ang) {
  const ctx = K.ctx, bt = boil(K); ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; strand(ctx, [[0, 0], [Math.cos(a) * r, Math.sin(a) * r]], { w: 7, color: C.CORAL, seed: k + bt, jit: 1.2 }); }
  scrib(ctx, ellipsePts(0, 0, r, r, 20), { w: 9, color: C.CORAL, seed: bt, jit: 1.5 }); shape(ctx, ellipsePts(0, 0, r * 0.25, r * 0.25, 10), 'butter', bt, { w: 3 });
  ctx.restore();
}
export function zzz(K, x, y, t) {
  const ctx = K.ctx; for (let i = 0; i < 3; i++) { const ph = (t * 0.45 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); ctx.font = `400 ${(40 + ph * 50) * K.u}px "Patrick Hand"`; ctx.fillStyle = C.LAVD; ctx.fillText('z', x + ph * 90 * K.u + Math.sin(ph * 6) * 12, y - ph * 230 * K.u); ctx.restore(); }
}
export function twinkles(K, t, n = 14, area = { x: 0, y: 0, w: K.W, h: K.H * 0.4 }) {
  const ctx = K.ctx, r = L.rng(8); for (let i = 0; i < n; i++) { const x = area.x + r() * area.w, y = area.y + r() * area.h, ph = r() * 6, k = 0.5 + 0.5 * Math.sin(t * 3 + ph); ctx.save(); ctx.globalAlpha = 0.4 + k * 0.6; ctx.fillStyle = [C.BUTTER, '#FFFFFF', C.PINK][i % 3]; L.star(ctx, x, y, (6 + k * 7) * K.u, 4, 0.35); ctx.fill(); ctx.restore(); }
}

// ---------- texto escrito a mano con marcatextos en las *palabras* ----------
const titleOpts = K => ({ font: sz => K.S.type.display(sz), emFont: sz => K.S.type.em(sz), color: C.PLUM, emColor: C.CORAL, align: 'center', stroke: C.CREAM, strokeW: 14 * K.u, reveal: 'none' });
function lay(K, str, box, o) {
  const R = layoutRich(K.ctx, K.rich(str), box, { font: sz => K.S.type.display(sz), emFont: sz => K.S.type.em(sz), max: (o.max || 150) * K.u, min: 18 * K.u, lh: K.S.lh ?? 1.02, ls: K.S.ls ?? -0.01 });
  const tot = R.lines.length * R.lh, y0 = box.y + (box.h - tot) / 2, em = [];
  R.lines.forEach((ln, i) => { const x0 = o.align === 'left' ? box.x : box.x + (box.w - R.widths[i]) / 2; ln.forEach(t => t.em && em.push({ x: x0 + t.x - 10, y: y0 + i * R.lh + R.size * 0.28, w: t.width + 20, h: R.size * 0.66 })); });
  return { n: R.lines.length, em, box: { x: box.x, y: y0, w: box.w, h: tot } };
}
export function TW(K, str, box, p, o = {}, tool = 'pencil') {
  if (p <= 0) return; const O = { ...titleOpts(K), ...o }, lo = lay(K, str, box, O);
  lo.em.forEach((r, i) => L.highlightOn(K.ctx, r, L.clamp((p - 0.8) / 0.35), 'rgba(255,227,154,.9)', { seed: i + 3 }));
  L.writeOn(K.ctx, () => title(K, str, box, 1, O), lo.box, L.clamp(p / 0.8), { tool, lines: lo.n, color: C.CORAL });
}
export function hand(K, str, x, y, p, { size = 46, color = C.PLUM, align = 'center' } = {}) {
  if (p <= 0) return; const ctx = K.ctx; ctx.save(); ctx.globalAlpha = L.clamp(p * 1.5); ctx.font = K.S.type.hand(size * K.u); ctx.textAlign = align; ctx.lineJoin = 'round';
  ctx.strokeStyle = C.CREAM; ctx.lineWidth = 9 * K.u; ctx.strokeText(str, x, y + (1 - L.E.out(p)) * 20); ctx.fillStyle = color; ctx.fillText(str, x, y + (1 - L.E.out(p)) * 20); ctx.restore();
}
export const walk = t => ({ walk: t * 16, armL: 22 + 18 * Math.sin(t * 16), armR: 22 - 18 * Math.sin(t * 16), hop: Math.abs(Math.sin(t * 8)) * 7 });
