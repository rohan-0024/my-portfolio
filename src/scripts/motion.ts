import { gsap } from 'gsap';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const TITLES = ['Data Engineer', 'Software Engineer', 'Cloud Architect'];

/** Types a string into an element over `secondsPerChar` per character. */
function typeInto(tl: gsap.core.Timeline, el: HTMLElement, text: string, secondsPerChar: number) {
  tl.to({}, {
    duration: Math.max(0.1, text.length * secondsPerChar),
    ease: 'none',
    onUpdate() {
      el.textContent = text.slice(0, Math.round(text.length * this.progress()));
    },
  });
}

/** Deletes an element's text one character at a time. */
function eraseFrom(tl: gsap.core.Timeline, el: HTMLElement, secondsPerChar: number) {
  const full = el.textContent ?? '';
  if (!full) return;
  tl.to({}, {
    duration: full.length * secondsPerChar,
    ease: 'none',
    onUpdate() {
      el.textContent = full.slice(0, Math.round(full.length * (1 - this.progress())));
    },
  });
}

/** Types the hero prompt, then cycles the three titles. */
function hero() {
  const cmd = document.querySelector<HTMLElement>('[data-type-cmd]');
  const out = document.querySelector<HTMLElement>('[data-type-out]');
  const rest = document.querySelector<HTMLElement>('[data-hero-rest]');
  if (!cmd || !out || !rest) return;

  const command = cmd.dataset.typeCmd ?? '';
  let idx = 0;

  const showRest = () => {
    rest.hidden = false;
    if (!reduced()) gsap.from(rest.children, { opacity: 0, y: 14, stagger: 0.08, duration: 0.6, ease: 'power2.out' });
  };

  const cycle = () => {
    const next = TITLES[idx++ % TITLES.length];
    const tl = gsap.timeline({ onComplete: () => { gsap.delayedCall(1.75, cycle); } });
    eraseFrom(tl, out, 0.03);
    typeInto(tl, out, next, 0.05);
  };

  // Typing is text changing, not movement, so it runs even under prefers-reduced-motion.
  // The stagger in showRest() and the scroll reveals still switch off for those users.
  cmd.textContent = '';
  out.textContent = '';
  const tl = gsap.timeline({ delay: 0.3 });
  typeInto(tl, cmd, command, 0.055);
  tl.add(() => { showRest(); cycle(); }, '+=0.25');
}

/** Fades sections in as they scroll into view. Falls back to visible. */
function reveal() {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (!('IntersectionObserver' in window) || reduced()) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  );
  els.forEach((el) => io.observe(el));
}

/** Animates <details> project entries open and closed. */
function entries() {
  document.querySelectorAll<HTMLDetailsElement>('details.entry').forEach((d) => {
    const body = d.querySelector<HTMLElement>('.entry-body');
    const summary = d.querySelector<HTMLElement>('summary');
    if (!body || !summary) return;
    summary.addEventListener('click', (ev) => {
      if (reduced()) return;
      ev.preventDefault();
      if (d.open) {
        gsap.to(body, {
          height: 0, opacity: 0, duration: 0.3, ease: 'power2.in',
          onComplete: () => { d.open = false; body.style.height = ''; body.style.opacity = ''; },
        });
      } else {
        d.open = true;
        gsap.from(body, { height: 0, opacity: 0, duration: 0.45, ease: 'power3.out', clearProps: 'height,opacity' });
      }
    });
  });
}

/** Stack chips: tap one to open its card, tap again or elsewhere to close. One open at a time. */
function stackCards() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('.stack-item'));
  if (!items.length) return;

  const close = (li: HTMLElement) => {
    const card = li.querySelector<HTMLElement>('.card');
    const chip = li.querySelector<HTMLButtonElement>('.chip');
    if (!card || !chip || !li.classList.contains('is-open')) return;
    chip.setAttribute('aria-expanded', 'false');
    if (reduced()) { li.classList.remove('is-open'); return; }
    gsap.to(card, {
      height: 0, opacity: 0, marginTop: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => { li.classList.remove('is-open'); gsap.set(card, { clearProps: 'all' }); },
    });
  };

  const open = (li: HTMLElement) => {
    const card = li.querySelector<HTMLElement>('.card');
    const chip = li.querySelector<HTMLButtonElement>('.chip');
    if (!card || !chip) return;
    items.forEach((other) => { if (other !== li) close(other); });
    li.classList.add('is-open');
    chip.setAttribute('aria-expanded', 'true');
    if (!reduced()) gsap.from(card, { height: 0, opacity: 0, marginTop: 0, duration: 0.35, ease: 'power3.out', clearProps: 'all' });
  };

  items.forEach((li) => {
    li.querySelector<HTMLButtonElement>('.chip')?.addEventListener('click', () => {
      li.classList.contains('is-open') ? close(li) : open(li);
    });
  });
  document.addEventListener('click', (ev) => {
    if (!(ev.target as HTMLElement).closest('.stack-item')) items.forEach(close);
  });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') items.forEach(close); });
}

/** Contact form: posts to Web3Forms without a page reload. */
function contact() {
  const form = document.querySelector<HTMLFormElement>('form[data-contact]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-status]');
  const btn = form.querySelector<HTMLButtonElement>('button[type=submit]');
  if (!status || !btn) return;

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!form.reportValidity()) return;
    btn.disabled = true;
    status.textContent = '> sending...';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        status.textContent = '> sent. I reply within a day.';
        form.reset();
      } else {
        status.textContent = `> error: ${json.message ?? 'could not send'}. Email me instead.`;
      }
    } catch {
      status.textContent = '> network error. Email me instead.';
    } finally {
      btn.disabled = false;
    }
  });
}

export function initMotion() {
  hero();
  reveal();
  entries();
  stackCards();
  contact();
}
