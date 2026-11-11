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

## Deploy to Vercel

Import the GitHub repo in Vercel and accept the Astro defaults (build `astro build`, output `dist`).
Set `PUBLIC_WEB3FORMS_KEY` in the project's environment variables before the first deploy.
The share-card URLs are derived from Vercel's production hostname at build time, so nothing needs hard-coding.

---

built with Astro · several bugs were harmed in the making · exit 0
