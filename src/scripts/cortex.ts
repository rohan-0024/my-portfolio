/**
 * Brain Cortex: a hand-rolled 3D force graph on a 2D canvas.
 * No three.js. Positions are settled once with a simple 3D force simulation,
 * then the whole cloud is rotated and perspective-projected every frame.
 */
import { nodes as DATA_NODES, links as DATA_LINKS, TAG_META, type BrainNode, type Tag } from '../data/brain';

type SimNode = BrainNode & {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  r: number;                // drawn radius
  degree: number;
  px: number; py: number; pz: number; ps: number; // projected
  neighbors: Set<string>;
};

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initCortex(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  const card = root.querySelector<HTMLElement>('[data-card]');
  const legend = root.querySelector<HTMLElement>('[data-legend]');
  const hint = root.querySelector<HTMLElement>('[data-hint]');
  if (!canvas || !card || !legend) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // ---------- build graph
  const byId = new Map<string, SimNode>();
  const nodes: SimNode[] = DATA_NODES.map((n, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / DATA_NODES.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const R = 220;
    return {
      ...n,
      x: R * Math.sin(phi) * Math.cos(theta), y: R * Math.sin(phi) * Math.sin(theta), z: R * Math.cos(phi),
      vx: 0, vy: 0, vz: 0, r: 3, degree: 0, px: 0, py: 0, pz: 0, ps: 1, neighbors: new Set(),
    };
  });
  nodes.forEach((n) => byId.set(n.id, n));
  const links = DATA_LINKS
    .map(([a, b]) => [byId.get(a), byId.get(b)] as const)
    .filter((l): l is readonly [SimNode, SimNode] => !!l[0] && !!l[1]);
  links.forEach(([a, b]) => { a.degree++; b.degree++; a.neighbors.add(b.id); b.neighbors.add(a.id); });
  nodes.forEach((n) => {
    const base = n.kind === 'domain' ? 9 : n.kind === 'project' ? 7.5 : n.kind === 'concept' ? 3.6 : 4;
    n.r = base + Math.min(5, n.degree * 0.25);
  });
  const me = byId.get('me');
  if (me) { me.x = me.y = me.z = 0; me.r = 12; }

  // ---------- settle layout (3D force simulation, run once)
  const settle = (iterations: number) => {
    const REPEL = 6000, SPRING = 0.03, GRAVITY = 0.004, DAMP = 0.86;
    for (let it = 0; it < iterations; it++) {
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
          let d2 = dx * dx + dy * dy + dz * dz + 0.01;
          if (d2 > 360000) continue;
          const f = REPEL / d2;
          const d = Math.sqrt(d2);
          dx = (dx / d) * f; dy = (dy / d) * f; dz = (dz / d) * f;
          a.vx += dx; a.vy += dy; a.vz += dz;
          b.vx -= dx; b.vy -= dy; b.vz -= dz;
        }
      }
      for (const [a, b] of links) {
        const hub = a.id === 'me' || b.id === 'me';
        const rest = hub ? 210 : a.kind === 'domain' || b.kind === 'domain' ? 95 : a.kind === 'project' || b.kind === 'project' ? 170 : 80;
        const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
        const f = (d - rest) * SPRING;
        const fx = (dx / d) * f, fy = (dy / d) * f, fz = (dz / d) * f;
        a.vx += fx; a.vy += fy; a.vz += fz;
        b.vx -= fx; b.vy -= fy; b.vz -= fz;
      }
      for (const n of nodes) {
        if (n.id === 'me') { n.vx = n.vy = n.vz = 0; continue; }
        n.vx -= n.x * GRAVITY; n.vy -= n.y * GRAVITY; n.vz -= n.z * GRAVITY;
        n.vx *= DAMP; n.vy *= DAMP; n.vz *= DAMP;
        n.x += n.vx; n.y += n.vy; n.z += n.vz;
      }
    }
  };
  settle(300);
  // Radius of the settled cloud, so the projection can fit it to any canvas size.
  const layoutR = nodes.reduce((m, n) => Math.max(m, Math.hypot(n.x, n.y, n.z)), 1);

  // ---------- view state
  let yaw = 0.4, pitch = -0.25, zoom = 1;
  let targetYaw = yaw, targetPitch = pitch;
  let hovered: SimNode | null = null;
  let selected: SimNode | null = null;
  let focusTag: Tag | null = null;
  let lastInteraction = 0;
  let dragging = false;
  let dragMoved = false;
  let lastX = 0, lastY = 0;
  let W = 0, H = 0, DPR = 1;
  let running = false;
  let visible = false;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    draw();
  };

  // ---------- projection
  const project = () => {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const F = 1100;
    const fit = W < 640 ? 0.78 : 0.86; // leave room for labels at the edges
    const scale = ((Math.min(W, H) / 2) * fit / layoutR) * zoom;
    for (const n of nodes) {
      // rotate yaw around Y, then pitch around X
      const x1 = n.x * cy + n.z * sy;
      const z1 = -n.x * sy + n.z * cy;
      const y2 = n.y * cp - z1 * sp;
      const z2 = n.y * sp + z1 * cp;
      const s = F / (F + z2 * scale);
      n.ps = s * scale;
      n.px = W / 2 + x1 * n.ps;
      n.py = H / 2 + y2 * n.ps;
      n.pz = z2;
    }
  };

  const activeSet = (): Set<string> | null => {
    const a = selected ?? hovered;
    if (a) { const s = new Set(a.neighbors); s.add(a.id); return s; }
    return null;
  };
  const inFocus = (n: SimNode) => !focusTag || n.tag === focusTag || n.kind === 'project' && n.id !== 'me' && [...n.neighbors].some((id) => byId.get(id)?.tag === focusTag);

  const color = (n: SimNode) => TAG_META[n.tag].color;
  const withAlpha = (hex: string, a: number) => {
    const v = parseInt(hex.slice(1), 16);
    return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${a})`;
  };

  // ---------- draw
  const draw = () => {
    project();
    ctx.clearRect(0, 0, W, H);
    const active = activeSet();
    const sorted = [...nodes].sort((a, b) => b.pz - a.pz); // far first

    // edges
    ctx.lineWidth = 1;
    for (const [a, b] of links) {
      const depth = 1 - ((a.pz + b.pz) / 2 + layoutR) / (2 * layoutR); // 0 far .. 1 near
      const isActive = active ? active.has(a.id) && active.has(b.id) && (a === (selected ?? hovered) || b === (selected ?? hovered)) : false;
      const focused = inFocus(a) && inFocus(b);
      let alpha = 0.05 + 0.14 * Math.max(0, Math.min(1, depth));
      if (active) alpha = isActive ? 0.75 : alpha * 0.25;
      if (!focused) alpha *= 0.15;
      const c = a.kind === 'domain' ? color(a) : b.kind === 'domain' ? color(b) : '#f3efe4';
      ctx.strokeStyle = withAlpha(c, alpha);
      ctx.lineWidth = isActive ? 1.6 : 1;
      ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke();
    }

    // nodes
    ctx.textBaseline = 'middle';
    for (const n of sorted) {
      const depth = Math.max(0, Math.min(1, 1 - (n.pz + layoutR) / (2 * layoutR)));
      const r = n.r * n.ps * (n === hovered || n === selected ? 1.35 : 1);
      let alpha = 0.45 + 0.55 * depth;
      const isActive = active ? active.has(n.id) : true;
      if (active && !isActive) alpha *= 0.18;
      if (!inFocus(n)) alpha *= 0.12;
      const c = color(n);

      // glow for hubs and active
      if (n.kind !== 'tool' && n.kind !== 'concept' || n === hovered || n === selected) {
        const g = ctx.createRadialGradient(n.px, n.py, r * 0.4, n.px, n.py, r * 3);
        g.addColorStop(0, withAlpha(c, 0.25 * alpha));
        g.addColorStop(1, withAlpha(c, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(n.px, n.py, r * 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = withAlpha(c, alpha);
      ctx.beginPath(); ctx.arc(n.px, n.py, r, 0, Math.PI * 2); ctx.fill();
      if (n.kind === 'concept') { // concepts are rings, tools are dots
        ctx.fillStyle = withAlpha('#0a0a0c', alpha);
        ctx.beginPath(); ctx.arc(n.px, n.py, r * 0.5, 0, Math.PI * 2); ctx.fill();
      }
      if (n.status === 'learning') {
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = withAlpha(c, alpha);
        ctx.beginPath(); ctx.arc(n.px, n.py, r + 4, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }

      // labels
      const showLabel =
        n.kind === 'domain' || n.kind === 'project' || n === hovered || n === selected ||
        (active ? active.has(n.id) : false) || (focusTag && n.tag === focusTag && depth > 0.55 && W > 600);
      if (showLabel && alpha > 0.1) {
        const size = n.kind === 'domain' ? 13 : n.kind === 'project' ? 12.5 : 11;
        ctx.font = `${n.kind === 'domain' || n.kind === 'project' ? 500 : 400} ${size * Math.min(1.15, Math.max(0.85, n.ps))}px "JetBrains Mono", ui-monospace, monospace`;
        ctx.textAlign = 'left';
        const tx = n.px + r + 6, ty = n.py;
        ctx.fillStyle = 'rgba(10,10,12,0.75)';
        const w = ctx.measureText(n.label).width;
        ctx.fillRect(tx - 3, ty - 9, w + 6, 18);
        ctx.fillStyle = withAlpha(n.kind === 'domain' ? c : '#f3efe4', Math.min(1, alpha + 0.2));
        ctx.fillText(n.label, tx, ty);
      }
    }
  };

  // ---------- loop
  const tick = (t: number) => {
    if (!running) return;
    const idle = t - lastInteraction > 2500 && !dragging && !selected;
    if (idle && !reduced()) targetYaw += 0.0022;
    yaw += (targetYaw - yaw) * 0.12;
    pitch += (targetPitch - pitch) * 0.12;
    draw();
    requestAnimationFrame(tick);
  };
  const start = () => { if (running) return; running = true; requestAnimationFrame(tick); };
  const stop = () => { running = false; };

  // ---------- picking
  const pick = (mx: number, my: number): SimNode | null => {
    let best: SimNode | null = null, bestD = 1e9;
    for (const n of nodes) {
      if (!inFocus(n)) continue;
      const d = Math.hypot(n.px - mx, n.py - my);
      const hitR = Math.max(12, n.r * n.ps + 6);
      if (d < hitR && d < bestD) { best = n; bestD = d; }
    }
    return best;
  };
  const localXY = (ev: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return [ev.clientX - rect.left, ev.clientY - rect.top] as const;
  };

  // ---------- card
  const showCard = (n: SimNode) => {
    selected = n;
    const meta = TAG_META[n.tag];
    const kindLabel = n.kind === 'domain' ? 'domain' : n.kind === 'project' ? 'project' : n.kind === 'concept' ? 'concept' : 'tool';
    const neighbors = [...n.neighbors].map((id) => byId.get(id)!).filter(Boolean)
      .sort((a, b) => (a.kind === 'domain' ? -1 : b.kind === 'domain' ? 1 : a.label.localeCompare(b.label)));
    card.innerHTML = `
      <button type="button" class="close" aria-label="Close" data-close>×</button>
      <p class="kicker mono"><span class="swatch" style="background:${meta.color}"></span>${meta.label} · ${kindLabel}${n.status === 'learning' ? ' · <em>learning</em>' : ''}</p>
      <h3>${n.label}</h3>
      <p class="desc">${n.desc}</p>
      <p class="mono links-label">linked to (${neighbors.length})</p>
      <div class="links">${neighbors.map((m) => `<button type="button" class="tag" data-goto="${m.id}" style="--c:${TAG_META[m.tag].color}">${m.label}</button>`).join('')}</div>
    `;
    card.hidden = false;
    card.style.setProperty('--c', meta.color);
    hint?.setAttribute('hidden', '');
    lastInteraction = performance.now();
  };
  const hideCard = () => { selected = null; card.hidden = true; lastInteraction = performance.now(); };

  card.addEventListener('click', (ev) => {
    const t = ev.target as HTMLElement;
    if (t.closest('[data-close]')) hideCard();
    const go = t.closest<HTMLElement>('[data-goto]')?.dataset.goto;
    if (go) { const n = byId.get(go); if (n) showCard(n); }
  });

  // ---------- legend
  const buildLegend = () => {
    legend.innerHTML = '';
    const all = document.createElement('button');
    all.type = 'button'; all.className = 'lg is-on'; all.textContent = 'all'; all.dataset.tag = '';
    legend.appendChild(all);
    (Object.keys(TAG_META) as Tag[]).filter((t) => t !== 'core').forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'lg'; b.dataset.tag = t;
      b.innerHTML = `<span class="swatch" style="background:${TAG_META[t].color}"></span>${TAG_META[t].label}`;
      legend.appendChild(b);
    });
    legend.addEventListener('click', (ev) => {
      const b = (ev.target as HTMLElement).closest<HTMLElement>('.lg');
      if (!b) return;
      const t = (b.dataset.tag || null) as Tag | null;
      focusTag = focusTag === t ? null : t;
      legend.querySelectorAll('.lg').forEach((el) => el.classList.toggle('is-on', ((el as HTMLElement).dataset.tag || null) === focusTag));
      if (focusTag && selected && !inFocus(selected)) hideCard();
      lastInteraction = performance.now();
      draw();
    });
  };
  buildLegend();

  // ---------- pointer
  canvas.addEventListener('pointerdown', (ev) => {
    dragging = true; dragMoved = false;
    [lastX, lastY] = [ev.clientX, ev.clientY];
    canvas.setPointerCapture(ev.pointerId);
    lastInteraction = performance.now();
  });
  canvas.addEventListener('pointermove', (ev) => {
    const [mx, my] = localXY(ev);
    if (dragging) {
      const dx = ev.clientX - lastX, dy = ev.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
      targetYaw += dx * 0.006;
      targetPitch = Math.max(-1.2, Math.min(1.2, targetPitch + dy * 0.006));
      [lastX, lastY] = [ev.clientX, ev.clientY];
      lastInteraction = performance.now();
    } else if (ev.pointerType === 'mouse') {
      const h = pick(mx, my);
      if (h !== hovered) { hovered = h; canvas.style.cursor = h ? 'pointer' : 'grab'; if (!running) draw(); }
    }
  });
  const endDrag = (ev: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    if (!dragMoved) {
      const [mx, my] = localXY(ev);
      const n = pick(mx, my);
      if (n) showCard(n); else if (selected) hideCard();
    }
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', () => { dragging = false; });
  canvas.addEventListener('pointerleave', () => { if (!dragging) { hovered = null; canvas.style.cursor = 'grab'; } });
  canvas.addEventListener('wheel', (ev) => {
    if (!ev.ctrlKey) return; // plain scroll keeps scrolling the page
    ev.preventDefault();
    zoom = Math.max(0.6, Math.min(2.2, zoom * (ev.deltaY < 0 ? 1.08 : 0.93)));
    lastInteraction = performance.now();
    if (!running) draw();
  }, { passive: false });

  root.querySelector('[data-zoom-in]')?.addEventListener('click', () => { zoom = Math.min(2.2, zoom * 1.2); if (!running) draw(); });
  root.querySelector('[data-zoom-out]')?.addEventListener('click', () => { zoom = Math.max(0.6, zoom / 1.2); if (!running) draw(); });
  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    targetYaw = 0.4; targetPitch = -0.25; zoom = 1; focusTag = null; hideCard();
    legend.querySelectorAll('.lg').forEach((el) => el.classList.toggle('is-on', !(el as HTMLElement).dataset.tag));
    if (!running) draw();
  });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && selected) hideCard(); });

  // ---------- lifecycle: only animate while on screen
  new ResizeObserver(resize).observe(canvas);
  resize();
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible && !document.hidden) start(); else stop();
  }, { threshold: 0.05 });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (visible) start(); });
  canvas.style.cursor = 'grab';
}
