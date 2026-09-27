// Demo "garabato pastel": Neuri explica el turno de noche del cerebro (sistema glinfático).
// Datos: Xie L, et al. Sleep drives metabolite clearance from the adult brain. Science 2013;342:373-377 (en ratones).
import * as L from './engine/lib.js';
import { C, fire, spark, brain, cell, amyloid, broom, valve, zzz, twinkles, TW, hand, walk, fillMat, smoothPath, strand, glow, boil } from './pastel.js';

const FLOOR = 1450;
export default {
  style: 'garabato-pastel', format: '9:16', fps: 30, camera: false, chrome: false,
  person: false, mascot: 'neuri', actor: { x: 540, y: FLOOR, h: 300 }, captions: true,
  scenes: [
    // 1 · atardecer junto a la fogata: Neuri sostiene una chispita sobre el fuego
    { type: 'story', bg: 'sunset', dur: 5.0, say: 'Tu cerebro tiene un turno de noche… y casi nadie lo conoce.',
      render(K, s, h) { const t = s.t; twinkles(K, t, 10, { x: 60, y: 620, w: 960, h: 240 }); fire(K, 640, 1430, 1, t);
        h.cue('title', 0.2); TW(K, 'Tu cerebro tiene un *turno de noche*', { x: 80, y: 150, w: 920, h: 440 }, (t - 0.2) / 1.6, { max: 150 });
        hand(K, 'neuro en 30 segundos', 540, 128, h.A(1.9, 0.5), { size: 44, color: C.LAVD }); },
      actor(t) { return { x: 320, y: FLOOR, h: 370, pose: { armR: 36 + 5 * Math.sin(t * 2), armL: 8, sy: 0.97, look: [0.7, 0.2], eyes: t > 3.4 ? 'happy' : undefined },
        after: (K, m) => spark(K, m.handR[0] + 8, m.handR[1] - 14, 24 * K.u, K.t) }; } },

    // 2 · Neuri abre la llave: el líquido cefalorraquídeo entra al cerebro y arrastra desechos
    { type: 'story', bg: 'paper', dur: 5.2, say: 'Al dormir, el líquido cefalorraquídeo corre entre las neuronas y arrastra desechos.',
      render(K, s, h) { const { ctx } = K, t = s.t, bx = 520, by = 960, rx = 340, ry = 250, flow = h.A(1.3, 0.8, L.E.inOut);
        h.cue('title', 0.1); TW(K, 'Mientras duermes, *se lava*', { x: 70, y: 150, w: 940, h: 330 }, (t - 0.1) / 1.3, { max: 140 });
        h.cue('enter', 0.4); L.writeOn(ctx, () => brain(K, bx, by, rx, ry), { x: bx - rx - 20, y: by - ry - 20, w: rx * 2 + 40, h: ry * 2 + 100 }, h.A(0.4, 1.1, L.E.linear), { tool: 'pencil', lines: 2, color: C.CORAL });
        // tubería desde la izquierda hasta la base del cerebro
        const pipe = [[-40, 1330], [340, 1330], [372, 1300], [372, 1170]];
        strand(ctx, pipe, { w: 44, color: C.LAVD, seed: boil(K), jit: 1 }); strand(ctx, pipe, { w: 30, color: '#E9E0F7', seed: boil(K) + 3, jit: 1 });
        if (flow > 0) { ctx.save(); ctx.setLineDash([26, 22]); ctx.lineDashOffset = -t * 160; ctx.globalAlpha = flow; strand(ctx, pipe, { w: 16, color: C.MINTD, seed: 2, jit: 0.5 }); ctx.restore(); }
        valve(K, 322, 1330, 40, t > 0.5 ? (t - 0.5) * 3.2 * (1 - h.A(1.6, 0.5)) + 3.2 * 1.1 * h.A(1.6, 0.5) : 0);
        if (flow > 0 && s.t > 1.5) { ctx.save(); ctx.clip(smoothPath((() => { const a = []; for (let i = 0; i < 40; i++) { const q = i / 40 * 6.2832; a.push([bx + Math.cos(q) * rx * 0.97, by + Math.sin(q) * ry * (Math.sin(q) > 0 ? 0.76 : 0.97)]); } return a; })()));
          for (let i = 0; i < 6; i++) { const y0 = by - ry * 0.7 + i * ry * 0.28, q = []; for (let k = 0; k <= 16; k++) { const x = bx - rx + k * rx * 0.13; q.push([x, y0 + Math.sin(k * 0.8 - t * 5 + i) * 16]); }
            ctx.save(); ctx.globalAlpha = L.clamp((t - 1.5) / 0.6) * 0.85; ctx.setLineDash([60, 30]); ctx.lineDashOffset = -t * 220 - i * 40; strand(ctx, q, { w: 12, color: C.MINT, seed: i, jit: 1 }); ctx.restore(); }
          ctx.restore();
          const r = L.rng(4); for (let i = 0; i < 9; i++) { const st = 2.2 + r() * 1.2, q = L.clamp((t - st) / 1.6), x0 = bx - rx * 0.6 + r() * rx, y0 = by - ry * 0.5 + r() * ry;
            if (t > 1.6) amyloid(K, x0 + L.E.in(q) * (bx + rx + 260 - x0), y0 + Math.sin(q * 5 + i) * 20 + q * q * 180, 16 + r() * 8, 30 + i); } }
        hand(K, 'líquido cefalorraquídeo', 700, 1420, h.A(1.4, 0.5), { size: 50, color: C.MINTD }); },
      actor(t) { return { x: 180, y: FLOOR, h: 270, pose: t < 0.5 ? { armR: 10, look: [1, -0.4] } : t < 2.1 ? { armR: 12 + 14 * Math.sin((t - 0.5) * 7), armL: 18, look: [0.8, -0.6], eyes: 'wide' } : { armR: 60, armL: 60, hop: Math.abs(Math.sin(t * 9)) * 16, eyes: 'happy' } }; } },

    // 3 · dentro del cerebro: las células se separan +60 % (Neuri empuja una)
    { type: 'story', bg: 'lav', dur: 5.4, trans: { type: 'zoom', x: 0.48, y: 0.5, zoom: 5, dur: 0.9 }, say: 'En ratones, el espacio entre las células creció un sesenta por ciento durante el sueño.',
      render(K, s, h) { const { ctx } = K, t = s.t, grow = h.A(1.0, 1.8, L.E.inOut), sp = 190 * (1 + 0.3 * grow), cx = 520, cy = 1060;
        const area = [[140, 700], [900, 700], [900, 1420], [140, 1420]]; fillMat(ctx, smoothPath(area), 'mint', boil(K), L.clamp(0.25 + grow * 0.75));
        for (let i = 0; i < 5; i++) { const q = []; for (let k = 0; k <= 10; k++) q.push([150 + k * 75, 760 + i * 150 + Math.sin(k - t * 4 + i) * 14]); ctx.save(); ctx.globalAlpha = grow * 0.7; strand(ctx, q, { w: 7, color: C.SKY, seed: i, jit: 1 }); ctx.restore(); }
        for (let r = -1; r <= 1; r++) for (let c = -1; c <= 1; c++) cell(K, cx + c * sp, cy + r * sp, 86, 100 + (r + 1) * 3 + c + 1, (r + c) % 2 ? 'peach' : 'lav');
        const cnt = L.E.out(L.clamp((t - 0.4) / 1.8)); h.cue('count', 0.4, { dur: 1.8 }); h.cue('impact', 2.2);
        TW(K, `+${Math.round(60 * cnt)} %`, { x: 140, y: 140, w: 800, h: 300 }, 1, { max: 280, emColor: C.CORAL, color: C.CORAL });
        TW(K, 'más espacio entre células al dormir', { x: 90, y: 440, w: 900, h: 170 }, (t - 0.9) / 1.0, { max: 70 });
        hand(K, 'estudio en ratones · Xie et al., Science 2013', 540, 668, h.A(2.4, 0.5), { size: 36, color: C.LAVD }); },
      actor(t) { const sp = 190 * (1 + 0.3 * L.E.inOut(L.clamp((t - 1.0) / 1.8))), x = 520 + sp + 86 + 98; return { x: Math.min(x, 1000), y: 1060 + sp + 120, h: 200, pose: { armL: 18, armR: 30, rot: -0.12, look: [-1, -0.2], eyes: t > 2.9 ? 'happy' : 'dot', sx: 1.04, sy: 0.97 } }; } },

    // 4 · el río de LCR se lleva la beta-amiloide: Neuri barre los grumos hacia la corriente
    { type: 'story', bg: 'paper', dur: 5.4, trans: { type: 'pan', dur: 0.7 }, say: 'Así se lleva proteínas como la beta-amiloide, ligada al Alzheimer, el doble de rápido.',
      render(K, s, h) { const { ctx } = K, t = s.t, ry = 1060;
        h.cue('title', 0.1); TW(K, 'Y se lleva la *beta-amiloide*', { x: 70, y: 140, w: 940, h: 330 }, (t - 0.1) / 1.3, { max: 130 });
        const top = [], bot = []; for (let k = 0; k <= 10; k++) { const x = -60 + k * 120; top.push([x, ry - 110 + Math.sin(k * 0.9) * 22]); bot.push([x, ry + 110 + Math.sin(k * 0.9 + 1) * 22]); }
        const river = [...top, ...bot.reverse()]; fillMat(ctx, smoothPath(river), 'mint', boil(K)); strand(ctx, top, { w: 5, color: C.MINTD, seed: boil(K) }); strand(ctx, bot, { w: 5, color: C.MINTD, seed: boil(K) + 1 });
        for (let i = 0; i < 4; i++) { const q = []; for (let k = 0; k <= 12; k++) q.push([-60 + k * 100, ry - 60 + i * 40 + Math.sin(k * 0.8 - t * 5 + i) * 10]); ctx.save(); ctx.setLineDash([50, 40]); ctx.lineDashOffset = -t * 260 - i * 30; strand(ctx, q, { w: 7, color: '#FFFFFF', seed: i, jit: 1, alpha: 0.8 }); ctx.restore(); }
        const nx = neuX(t); [300, 500, 700].forEach((bx, i) => { const hit = (bx - 120 - 180) / 520 * 2.4 + 0.6, q = L.clamp((t - hit) / 1.4), up = L.E.out(L.clamp(q / 0.35));
          const x = bx + (q > 0.35 ? L.E.in((q - 0.35) / 0.65) * (1200 - bx) : up * 20), y = L.lerp(1330, ry + Math.sin(t * 4 + i) * 12, up); amyloid(K, x, y, 56, 60 + i * 4); if (Math.abs(q - 0.05) < 0.05) h.cue('pop', hit); });
        hand(K, '2× más rápido durmiendo (en ratones)', 540, 540, h.A(3.0, 0.5), { size: 46, color: C.CORAL }); },
      actor(t) { const x = neuX(t), moving = t > 0.6 && t < 3.0; return { x, y: FLOOR, h: 250, pose: moving ? { ...walk(t), armR: 30 } : { armR: 30, armL: t > 3.2 ? 60 : 10, eyes: t > 3.2 ? 'happy' : undefined, look: [1, -0.3] },
        after: (K, m) => broom(K, m.handR[0], m.handR[1], 0.95, -0.55 + Math.sin(t * 16) * (moving ? 0.18 : 0)) }; } },

    // 5 · de vuelta a la fogata: Neuri se duerme; cierre y CTA
    { type: 'story', bg: 'sunset', dur: 5.6, say: 'Dormir no es perder el tiempo: es mantenimiento. Sígueme para más neuro.',
      render(K, s, h) { const { ctx } = K, t = s.t; twinkles(K, t, 16, { x: 60, y: 560, w: 960, h: 320 }); fire(K, 700, 1430, 0.9, t, { embers: true });
        h.cue('title', 0.2); TW(K, 'Dormir no es\nperder el tiempo:\nes *mantenimiento*', { x: 70, y: 130, w: 940, h: 470 }, (t - 0.2) / 1.8, { max: 108 }, 'brush');
        zzz(K, 430, 1180, t);
        const p = h.A(2.8, 0.6, L.E.back); if (p > 0) { h.cue('impact', 2.8); const b = { x: 110, y: 660, w: 860, h: 110 }; ctx.save(); ctx.translate(540, 715); ctx.scale(p, p); ctx.translate(-540, -715);
          glow(ctx, 540, 715, 380, C.GOLD, 0.45); const pts = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]]; fillMat(ctx, smoothPath(pts), 'pink', boil(K)); strand(ctx, [...pts, pts[0]], { w: 5, color: C.PLUM, seed: boil(K) });
          ctx.font = K.S.type.display(56 * K.u); ctx.textAlign = 'center'; ctx.fillStyle = C.PLUM; ctx.fillText('Sígueme para más neuro ✦', 540, 738); ctx.restore(); } },
      actor(t) { return { x: 360, y: FLOOR, h: 320, pose: { eyes: t > 0.6 ? 'closed' : 'happy', sy: 0.92 + 0.025 * Math.sin(t * 2.4), sx: 1.02, rot: -0.06, armL: 4, armR: 4 } }; } },
  ],
};
function neuX(t) { return L.lerp(160, 800, L.E.inOut(L.clamp((t - 0.6) / 2.4))); }
