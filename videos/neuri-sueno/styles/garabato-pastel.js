// Garabato pastel — ilustración hecha de una red densa de garabatos de crayón (estilo concept art tipo Goro Fujita),
// paleta exclusivamente pastel (rosa, menta, lavanda, mantequilla, cielo), luz cálida de atardecer sin tonos fríos.
import * as L from '../engine/lib.js';
import { BASE, title, para } from '../engine/base.js';
import { C, initMats, makeBackgrounds, neuri, fillMat, scrib, ellipsePts, smoothPath, boil } from '../pastel.js';

let BG = {}, ZIG = null;
export default {
  id: 'garabato-pastel', name: 'Garabato pastel',
  fonts: 'Baloo+2:wght@600;800&family=Patrick+Hand&family=Nunito:wght@700;800',
  fontLoads: ['800 60px "Baloo 2"', '600 60px "Baloo 2"', '400 40px "Patrick Hand"', '700 30px Nunito', '800 30px Nunito'],
  palette: { bg: C.CREAM, ink: C.PLUM, accent: C.CORAL, muted: '#7E6B8F', panel: '#FFFAF2', line: 'rgba(74,58,92,.18)', good: '#5FB08F', bad: '#D9728A', mascot: C.PINK },
  type: { display: s => `800 ${s}px "Baloo 2"`, em: s => `800 ${s}px "Baloo 2"`, body: s => `700 ${s}px Nunito`, bodyEm: s => `800 ${s}px Nunito`, label: s => `400 ${s}px "Patrick Hand"`, hand: s => `400 ${s}px "Patrick Hand"`, mono: s => `700 ${s}px Nunito` },
  lh: 1.0, ls: -0.005,
  sfx: 'ink', transDur: 0.8, push: 0.02,
  music: 'warm lo-fi acoustic lullaby, ukulele, soft glockenspiel, gentle brushed percussion, cozy campfire, 92 BPM, instrumental, dreamy and cheerful',
  async setup(K) { initMats(); if (!BG.sunset) BG = makeBackgrounds(K.W, K.H); },
  background(K, s) { K.ctx.drawImage(BG[s.d.bg || 'paper'] || BG.paper, 0, 0); },
  headline(K, str, box, p, s, o = {}) { title(K, str, box, p, { align: o.align, size: o.size, color: C.PLUM, emColor: C.CORAL, reveal: 'wipe', emStyle: 'highlight', emBg: 'rgba(255,227,154,.9)', stroke: C.CREAM, strokeW: 12 * K.u }); },
  text(K, str, box, p, role, s, o = {}) {
    if (role === 'kicker' || role === 'label') return para(K, str, box, p, { font: sz => K.S.type.hand(sz), color: C.LAVD, max: 48, align: o.align || 'left' });
    return BASE.text(K, str, box, p, role, s, { color: C.PLUM, ...o });
  },
  panel(K, b, p, s, kind, j = 0) {
    if (p <= 0) return; const ctx = K.ctx, pts = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]];
    ctx.save(); ctx.globalAlpha = L.clamp(p * 1.5); fillMat(ctx, smoothPath(pts), kind === 'good' ? 'mint' : kind === 'bad' ? 'pink' : ['butter', 'mint', 'lav', 'sky'][j % 4], boil(K), 0.8);
    scrib(ctx, pts, { w: 3, color: C.LAVD, seed: boil(K) + j }); ctx.restore();
  },
  mascot(K, box, p, s, mood) { if (p <= 0) return; neuri(K, K.ctx, box, { bob: Math.sin(K.t * 3) * 3 * K.u, mood, p: L.clamp(p) }); },
  caption(K, words, act, box, p) {
    const { ctx, u } = K; ctx.save(); ctx.globalAlpha = p; ctx.font = K.S.type.bodyEm(38 * u);
    const w = Math.min(box.w, ctx.measureText(words.join(' ')).width + 80 * u), x = box.x + (box.w - w) / 2;
    L.rrect(ctx, x, box.y, w, box.h, box.h / 2); ctx.fillStyle = 'rgba(255,248,236,.93)'; ctx.fill();
    scrib(ctx, ellipsePts(x + w / 2, box.y + box.h / 2, w / 2, box.h / 2, 30), { w: 3, color: C.LAVD, seed: boil(K), jit: 1.5, passes: 1, alpha: 0.8 });
    let cx = x + 40 * u; words.forEach((wd, i) => { ctx.fillStyle = i === act ? C.CORAL : i < act ? C.PLUM : 'rgba(74,58,92,.5)'; ctx.fillText(wd, cx, box.y + box.h * 0.66); cx += ctx.measureText(wd + ' ').width; });
    ctx.restore();
  },
  // la escena nueva se "colorea" encima con trazos gruesos de crayón en zigzag
  transition(K, A, B, p) {
    const { ctx, W, H, u } = K; ctx.drawImage(A, 0, 0); if (p >= 0.985) { ctx.drawImage(B, 0, 0); return; }
    if (!ZIG) { const rows = Math.ceil(H / (170 * u)), r = L.rng(5), pts = []; for (let i = 0; i < rows; i++) { const y = (i + 0.5) * H / rows, ltr = i % 2 === 0; for (let k = 0; k <= 6; k++) { const q = ltr ? k / 6 : 1 - k / 6; pts.push([-120 + q * (W + 240), y + (r() - 0.5) * 50 * u]); } }
      const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); ZIG = { pts, len }; }
    const tot = ZIG.len[ZIG.len.length - 1] * p, P = [ZIG.pts[0]];
    for (let i = 1; i < ZIG.pts.length; i++) { if (ZIG.len[i] <= tot) { P.push(ZIG.pts[i]); continue; } const a = ZIG.pts[i - 1], b = ZIG.pts[i], q = (tot - ZIG.len[i - 1]) / (ZIG.len[i] - ZIG.len[i - 1]); P.push([L.lerp(a[0], b[0], q), L.lerp(a[1], b[1], q)]); break; }
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = ctx.createPattern(B, 'no-repeat'); ctx.lineWidth = 240 * u;
    ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    const tip = P[P.length - 1]; ctx.globalAlpha = 0.9; [C.PINK, C.MINT, C.LAV, C.BUTTER].forEach((col, j) => { ctx.strokeStyle = col; ctx.lineWidth = 7 * u; ctx.beginPath(); for (let k = 0; k < 8; k++) { const a = k * 1.9 + j, rr = (40 + j * 22) * u; ctx.lineTo(tip[0] + Math.cos(a) * rr, tip[1] + Math.sin(a) * rr * 1.4); } ctx.stroke(); });
    ctx.restore();
  },
  overlay(K) { // luz cálida de atardecer sobre todo el cuadro (sin tonos fríos)
    const { ctx, W, H } = K; ctx.save(); ctx.globalCompositeOperation = 'soft-light'; const g = ctx.createLinearGradient(0, 0, W * 0.4, H);
    g.addColorStop(0, 'rgba(255,205,140,.35)'); g.addColorStop(1, 'rgba(255,170,190,.18)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  },
};
