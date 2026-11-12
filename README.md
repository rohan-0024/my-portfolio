# rohan@dev:~$ whoami

Portfolio of **Rohan Paul**. Data Engineer · Software Engineer · Cloud Architect.

A developer portfolio styled as a terminal notebook: black canvas, ivory ruled lines, pastel accents, one coral call to action.
Built with [Astro](https://astro.build) and GSAP. Static output, deployed on Vercel.

## Sections

| Section | What it does |
| --- | --- |
| Hero | Types `whoami`, then cycles the three titles with a typing effect |
| Changelog | A version log instead of a bio |
| Work | Problem → fix → stack entries for CreditClear, Scriptorium and VoltRoute |
| Stack | Tap a tool to open a card on where it earned its place |
| Connectome | A hand-rolled 3D force graph of everything learned, drawn on a canvas with no 3D library |
| open-issue | Contact form framed as a bug report, powered by Web3Forms |
| Terminal | Press `/` or the `>_` button anywhere. Real commands: `help`, `whoami`, `ls projects`, `cat creditclear`, `cd work`, `learning`, `man rohan`, `sudo hire rohan` |
| Status line | Under the hero: what is being learned (from the Connectome data), last GitHub push and repo count fetched at build time, "ago" computed in the browser |
| About | `cat ./about.md`: the story before the first commit beside a cut-out portrait, then "Off the keyboard": three tappable activity cards (rides, badminton, keyboard) that open a photo and caption. Data in `src/data/about.ts`, images in `public/about/` |
| /work/<slug> | Each project as an incident-report postmortem: summary, impact, timeline, root cause, resolution, verification, lessons, action items |
| /resume | The résumé as a Unix man page, `man rohan`, with the PDF download |

## Run locally

Requires Node 18+ (built on Node 26).

```bash
npm install
cp .env.example .env     # add your Web3Forms key
npm run dev              # http://localhost:4321
```

## Contact form

The form posts to [Web3Forms](https://web3forms.com) (free, no backend).
Sign up with the Gmail that should receive messages, copy the access key, and put it in `.env` as `PUBLIC_WEB3FORMS_KEY`.
On Vercel, add the same variable under Project → Settings → Environment Variables.
A hidden honeypot checkbox filters bots.

## Edit content

- Projects, changelog entries and the stack cards: `src/data/projects.ts`
- Connectome nodes and links: `src/data/brain.ts` (one object per node, one `[from, to]` pair per link)
- The three cycling titles: `TITLES` in `src/scripts/motion.ts`
- Colours: CSS variables at the top of `src/styles/global.css`
- Share card (the image shown when the link is posted): `og/og.html`, rendered to `public/og.png`
- Postmortems: `src/data/postmortems.ts`. Résumé facts: `src/data/resume.ts` (keep in sync with `public/Rohan_Paul_Resume.pdf`)
- Terminal commands: `src/scripts/terminal.ts`
- About story and activities: `src/data/about.ts` (portrait is a WebP with baked-in alpha, cut out from a photo on a plain white background and shown greyscale inside the grid frame)

## Deploy to Vercel

Import the GitHub repo in Vercel and accept the Astro defaults (build `astro build`, output `dist`).
Set `PUBLIC_WEB3FORMS_KEY` in the project's environment variables before the first deploy.
The share-card URLs are derived from Vercel's production hostname at build time, so nothing needs hard-coding.

---

built with Astro · several bugs were harmed in the making · exit 0
