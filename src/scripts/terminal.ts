/**
 * The site terminal. Press `/` anywhere (or the >_ button) to open it and type real commands.
 * Everything it knows comes from the same data files as the rest of the site.
 */
import { projects, stack, changelog } from '../data/projects';
import { nodes } from '../data/brain';
import { resume } from '../data/resume';

type Out = { text: string; cls?: 'res' | 'ok' | 'warn' | 'err' | 'hl'; html?: boolean };
type Cmd = { name: string; desc: string; run: (args: string[]) => Out[] | 'clear' | 'exit'; hidden?: boolean };

const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
const link = (href: string, label = href) => `<a href="${href}" ${href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${esc(label)}</a>`;
const pad = (s: string, n: number) => s + ' '.repeat(Math.max(0, n - s.length));

const SECTIONS: Record<string, string> = {
  home: '/#top', top: '/#top', changelog: '/#changelog', work: '/#work', projects: '/#work',
  stack: '/#stack', connectome: '/#connectome', brain: '/#connectome', contact: '/#contact', issue: '/#contact', resume: '/resume',
};
const START = new Date('2023-08-01T00:00:00Z');

const go = (href: string): Out[] => {
  setTimeout(() => {
    if (href.startsWith('http')) window.open(href, '_blank', 'noopener');
    else if (href.startsWith('/#') && location.pathname === '/') document.querySelector(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    else location.href = href;
  }, 150);
  return [{ text: `opening ${href}`, cls: 'res' }];
};

const findProject = (q: string) => projects.find((p) => p.slug === q.toLowerCase() || p.name.toLowerCase() === q.toLowerCase());

export function initTerminal() {
  const root = document.querySelector<HTMLElement>('[data-terminal]');
  const out = root?.querySelector<HTMLElement>('[data-term-out]');
  const form = root?.querySelector<HTMLFormElement>('[data-term-form]');
  const input = root?.querySelector<HTMLInputElement>('[data-term-input]');
  if (!root || !out || !form || !input) return;

  const history: string[] = [];
  let hIdx = -1;
  let booted = false;

  const commands: Cmd[] = [
    { name: 'help', desc: 'list commands', run: () => commands.filter((c) => !c.hidden).map((c) => ({ text: `${pad(c.name, 14)}${c.desc}`, cls: 'res' as const })) },
    { name: 'whoami', desc: 'who is this', run: () => [
      { text: resume.name, cls: 'hl' },
      { text: resume.titles.join(' · '), cls: 'res' },
      { text: resume.description, cls: 'res' },
    ] },
    { name: 'ls', desc: 'list sections, or `ls projects`', run: (a) => {
      if (a[0] === 'projects' || a[0] === 'work') return projects.map((p) => ({ text: `${pad(p.slug, 14)}${p.tagline}`, cls: 'res' as const }));
      return [{ text: Object.keys(SECTIONS).filter((k) => !['top', 'projects', 'brain', 'issue'].includes(k)).join('  '), cls: 'res' }];
    } },
    { name: 'cd', desc: 'jump to a section: cd work', run: (a) => {
      const to = SECTIONS[(a[0] ?? 'home').replace(/^[./#]+/, '')];
      return to ? go(to) : [{ text: `cd: no such section: ${a[0]}. try ls`, cls: 'err' }];
    } },
    { name: 'cat', desc: 'read a project: cat creditclear', run: (a) => {
      if (!a[0]) return [{ text: 'cat: which file? try `ls projects`', cls: 'err' }];
      const p = findProject(a[0]);
      if (!p) return [{ text: `cat: ${a[0]}: no such project`, cls: 'err' }];
      return [
        { text: `${p.name}  ${p.version}`, cls: 'hl' },
        { text: `problem   ${p.problem}`, cls: 'res' },
        { text: `fix       ${p.fix}`, cls: 'res' },
        { text: `stack     ${p.stack.join(', ')}`, cls: 'res' },
        { text: `postmortem ${link(`/work/${p.slug}`)}${p.live ? `   live ${link(p.live)}` : ''}`, cls: 'res', html: true },
      ];
    } },
    { name: 'open', desc: 'open a project live site: open scriptorium', run: (a) => {
      const p = a[0] ? findProject(a[0]) : null;
      if (!p) return [{ text: `open: ${a[0] ?? ''}: no such project`, cls: 'err' }];
      return p.live ? go(p.live) : [{ text: `${p.name} has no public deployment yet. read the postmortem: ${link(`/work/${p.slug}`)}`, cls: 'warn', html: true }];
    } },
    { name: 'postmortem', desc: 'read an incident report: postmortem voltroute', run: (a) => {
      const p = a[0] ? findProject(a[0]) : null;
      return p ? go(`/work/${p.slug}`) : [{ text: 'postmortem: name a project. try `ls projects`', cls: 'err' }];
    } },
    { name: 'skills', desc: 'the stack and where it earned its place', run: () => stack.map((s) => ({ text: `${pad(s.name, 16)}${s.where}`, cls: 'res' as const })) },
    { name: 'learning', desc: 'what is in progress right now', run: () => {
      const l = nodes.filter((n) => n.status === 'learning');
      return l.length ? l.map((n) => ({ text: `${pad(n.label, 16)}${n.desc}`, cls: 'warn' as const })) : [{ text: 'nothing flagged. suspicious.', cls: 'res' }];
    } },
    { name: 'git', desc: 'git log: the changelog', run: (a) => {
      if (a[0] !== 'log') return [{ text: 'usage: git log', cls: 'err' }];
      return changelog.map((c) => ({ text: `${pad(c.v, 12)}${c.text}`, cls: 'res' as const }));
    } },
    { name: 'man', desc: 'man rohan: the résumé', run: (a) => (a[0] === 'rohan' || !a[0] ? go('/resume') : [{ text: `No manual entry for ${a[0]}`, cls: 'err' }]) },
    { name: 'resume', desc: 'same as man rohan', run: () => go('/resume') },
    { name: 'contact', desc: 'how to reach me', run: () => [
      { text: `email     ${link(`mailto:${resume.email}`, resume.email)}`, cls: 'res', html: true },
      { text: `github    ${link(resume.github)}`, cls: 'res', html: true },
      { text: `linkedin  ${link(resume.linkedin)}`, cls: 'res', html: true },
      { text: `form      ${link('/#contact', 'open-issue')}`, cls: 'res', html: true },
    ] },
    { name: 'github', desc: 'open GitHub', run: () => go(resume.github) },
    { name: 'linkedin', desc: 'open LinkedIn', run: () => go(resume.linkedin) },
    { name: 'uptime', desc: 'time since boot (2023)', run: () => {
      const d = Math.floor((Date.now() - START.getTime()) / 86400000);
      return [{ text: `up ${Math.floor(d / 365)} years, ${d % 365} days since the first semester. load average: high, manageable.`, cls: 'res' }];
    } },
    { name: 'date', desc: 'current date', run: () => [{ text: new Date().toString(), cls: 'res' }] },
    { name: 'pwd', desc: 'where you are', run: () => [{ text: `/home/rohan${location.pathname === '/' ? '' : location.pathname}`, cls: 'res' }] },
    { name: 'echo', desc: 'echo text', run: (a) => [{ text: a.join(' '), cls: 'res' }] },
    { name: 'history', desc: 'commands you ran', run: () => history.map((h, i) => ({ text: `${pad(String(i + 1), 5)}${h}`, cls: 'res' as const })) },
    { name: 'clear', desc: 'clear the screen', run: () => 'clear' },
    { name: 'exit', desc: 'close the terminal', run: () => 'exit' },
    { name: 'sudo', desc: '', hidden: true, run: (a) => {
      const rest = a.join(' ').toLowerCase();
      if (rest.includes('hire')) return [
        { text: '[sudo] password for recruiter: ********', cls: 'res' },
        { text: 'permission granted.', cls: 'ok' },
        { text: `offer letter can be sent to ${link(`mailto:${resume.email}`, resume.email)}. replies within a day.`, cls: 'res', html: true },
      ];
      if (rest.includes('rm')) return [{ text: 'nice try. this site is immutable infrastructure.', cls: 'warn' }];
      return [{ text: 'rohan is not in the sudoers file. this incident will be reported.', cls: 'err' }];
    } },
    { name: 'rm', desc: '', hidden: true, run: () => [{ text: 'rm: permission denied. try `sudo hire rohan` instead.', cls: 'err' }] },
    { name: 'vim', desc: '', hidden: true, run: () => [{ text: 'you are now stuck in vim. type `exit` to escape. (it actually works here.)', cls: 'warn' }] },
    { name: 'coffee', desc: '', hidden: true, run: () => [{ text: 'HTTP 418: I\'m a teapot. brewing anyway.', cls: 'warn' }] },
    { name: 'neofetch', desc: '', hidden: true, run: () => [
      { text: `${pad('OS', 10)}CSE w/ Cloud Computing, SRM, build 2027`, cls: 'res' },
      { text: `${pad('Kernel', 10)}data structures + networking + OS`, cls: 'res' },
      { text: `${pad('Shell', 10)}node, python, bash`, cls: 'res' },
      { text: `${pad('Cloud', 10)}AWS, Azure, Firebase, Vercel`, cls: 'res' },
      { text: `${pad('Theme', 10)}ink + ivory + pastels`, cls: 'res' },
      { text: `${pad('Uptime', 10)}since 2023`, cls: 'res' },
    ] },
  ];

  const print = (lines: Out[]) => {
    for (const l of lines) {
      const div = document.createElement('div');
      div.className = l.cls ?? 'res';
      if (l.html) div.innerHTML = l.text; else div.textContent = l.text;
      out.appendChild(div);
    }
    out.scrollTop = out.scrollHeight;
  };
  const echoCmd = (raw: string) => {
    const div = document.createElement('div');
    div.className = 'cmd';
    div.textContent = raw;
    out.appendChild(div);
  };

  const run = (raw: string) => {
    const line = raw.trim();
    if (!line) return;
    echoCmd(line);
    history.push(line);
    hIdx = history.length;
    const [name, ...args] = line.split(/\s+/);
    const cmd = commands.find((c) => c.name === name.toLowerCase());
    if (!cmd) {
      const near = commands.filter((c) => !c.hidden && c.name.startsWith(name[0] ?? '')).map((c) => c.name).slice(0, 4);
      print([{ text: `${name}: command not found.${near.length ? ` did you mean: ${near.join(', ')}?` : ''} try help`, cls: 'err' }]);
      return;
    }
    const res = cmd.run(args);
    if (res === 'clear') out.innerHTML = '';
    else if (res === 'exit') close();
    else print(res);
  };

  const open = () => {
    root.hidden = false;
    if (!booted) {
      booted = true;
      print([
        { text: `welcome to rohan@dev. type ${'`help`'} to see what this can do.`, cls: 'ok' },
        { text: 'try: whoami · ls projects · cat creditclear · learning · sudo hire rohan', cls: 'res' },
      ]);
    }
    input.focus();
  };
  const close = () => { root.hidden = true; input.blur(); };
  const toggle = () => (root.hidden ? open() : close());

  form.addEventListener('submit', (ev) => { ev.preventDefault(); run(input.value); input.value = ''; });
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowUp') { ev.preventDefault(); if (hIdx > 0) { hIdx--; input.value = history[hIdx] ?? ''; } }
    else if (ev.key === 'ArrowDown') { ev.preventDefault(); if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx] ?? ''; } else { hIdx = history.length; input.value = ''; } }
    else if (ev.key === 'Tab') {
      ev.preventDefault();
      const parts = input.value.split(/\s+/);
      const last = parts[parts.length - 1] ?? '';
      const pool = parts.length > 1 ? [...projects.map((p) => p.slug), ...Object.keys(SECTIONS)] : commands.filter((c) => !c.hidden).map((c) => c.name);
      const m = pool.filter((n) => n.startsWith(last.toLowerCase()));
      if (m.length === 1) { parts[parts.length - 1] = m[0]; input.value = parts.join(' ') + ' '; }
      else if (m.length > 1) print([{ text: m.join('  '), cls: 'res' }]);
    }
    else if (ev.key === 'Escape') close();
    else if (ev.key === 'l' && ev.ctrlKey) { ev.preventDefault(); out.innerHTML = ''; }
  });
  root.querySelector('[data-term-close]')?.addEventListener('click', close);
  document.querySelectorAll('[data-open-terminal]').forEach((b) => b.addEventListener('click', toggle));

  document.addEventListener('keydown', (ev) => {
    const t = ev.target as HTMLElement | null;
    const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    if (ev.key === '/' && !typing && !ev.ctrlKey && !ev.metaKey && !ev.altKey) { ev.preventDefault(); open(); }
    else if (ev.key === 'Escape' && !root.hidden) close();
  });

  // Deep link: /?cmd=whoami runs a command on load.
  const preset = new URLSearchParams(location.search).get('cmd');
  if (preset) { open(); run(preset); }
}
