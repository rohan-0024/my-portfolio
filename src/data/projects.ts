export type Project = {
  slug: string;
  name: string;
  version: string;
  tagline: string;
  problem: string;
  fix: string;
  stack: string[];
  accent: 'mint' | 'lavender' | 'butter';
  live?: string;
  repo: string;
  notes: string[];
};

export const projects: Project[] = [
  {
    slug: 'creditclear',
    name: 'CreditClear',
    version: 'v2026.10',
    tagline: 'Explainable micro-credit scoring for people with no credit history.',
    problem:
      'Thin-file borrowers in India get rejected because bureaus have nothing on them, even when years of rent, bills and recharges prove they pay on time.',
    fix:
      'An API that scores on those payment records instead. It crawls live RBI repo rates, MoSPI inflation and telecom plan prices per request, runs a logistic regression served as plain JSON in Lambda, and returns every factor\u2019s exact point impact plus a month-by-month plan to reach a Clear score.',
    stack: ['React 19', 'AWS Lambda', 'SAM', 'DynamoDB', 'S3 + CloudFront', 'Cognito', 'Python ML'],
    accent: 'mint',
    repo: 'https://github.com/rohan-0024/creditclear',
    live: 'https://d1jt51uy02drli.cloudfront.net',
    notes: [
      'Logistic model beat the hand-written rule formula by 0.023 AUC, with a 95% CI that excluded zero.',
      'Every live data source falls back to a dated snapshot, so scoring never blocks on a slow upstream.',
      'Email addresses are used once to send the report and never stored. Records expire after 90 days via DynamoDB TTL.',
      'Training fails if any weight points the unsafe way. The JS model matches Python to 3\u00d710\u207b\u00b9\u2076.',
    ],
  },
  {
    slug: 'scriptorium',
    name: 'Scriptorium',
    version: 'v2026.09',
    tagline: 'One organizer for thoughts, deadlines, bills and email reminders.',
    problem:
      'Reminders that fire twice are worse than reminders that never fire. Most hobby schedulers break the moment two workers wake up at once.',
    fix:
      'Each due reminder is claimed in the database before it is sent, so it goes out exactly once even under concurrent runs. Failed sends retry three times, and editing a reminder re-arms it. Mobile-first UI with a wax-seal checkbox animated by GSAP Flip.',
    stack: ['React', 'GSAP', 'Node + Express', 'SQLite / Turso', 'Google OAuth', 'Vercel'],
    accent: 'lavender',
    repo: 'https://github.com/rohan-0024/all-in-one-organizer',
    live: 'https://getscriptorium.vercel.app',
    notes: [
      'Monorepo with npm workspaces. Client and API deploy as two Vercel services behind one domain.',
      'Bottom tab bar, bottom-sheet editor, 44px touch targets and safe-area insets on iOS.',
      'All motion switches off under prefers-reduced-motion.',
    ],
  },
  {
    slug: 'voltroute',
    name: 'VoltRoute',
    version: 'v2026.08',
    tagline: 'Real EV chargers on a map, filtered by plug, distance and price.',
    problem:
      'EV drivers cannot tell before leaving whether a charger is free, whether the plug fits, or what it costs. The data is scattered across operator apps.',
    fix:
      'Google Places (New) data proxied through Express so the API key never reaches the browser. Markers are colour-coded by live port availability, filters show live facet counts, and one review per driver per station keeps ratings honest.',
    stack: ['React 18', 'Google Maps', 'Express + Zod', 'Firebase Auth', 'Firestore', 'Render'],
    accent: 'butter',
    repo: 'https://github.com/rohan-0024/voltroute-ev-charge-locator',
    notes: [
      'Advanced Markers are real DOM nodes, so GSAP can animate them.',
      'Whole palette tweens between light and dark instead of snapping.',
      'Helmet, rate limiting and strict Zod schemas block mass-assignment on every endpoint.',
    ],
  },
];

export const changelog = [
  { v: 'v2026.10', text: 'Shipped CreditClear on AWS Lambda. Learned that a model is only as honest as its fallback.' },
  { v: 'v2026.09', text: 'Built Scriptorium. Reminders are claimed before they are sent, and that one line fixed a whole class of bugs.' },
  { v: 'v2026.08', text: 'VoltRoute taught me to keep secrets server-side and validate every request with a strict schema.' },
  { v: 'v2025', text: 'Moved from Java desktop apps with MySQL to full-stack JavaScript and cloud deploys.' },
  { v: 'v2023', text: 'Started a B.Tech. Wrote a healthcare system in Java Swing and never looked at a GUI toolkit the same way again.' },
];

export type Tool = { name: string; what: string; where: string; projects: string[] };

export const stack: Tool[] = [
  {
    name: 'React',
    what: 'Component-based UI library. I reach for it when state has to stay in sync across a lot of screens.',
    where: 'Every frontend here. Multi-step intake forms, map panels, bottom-sheet editors, all wired to GSAP through @gsap/react.',
    projects: ['CreditClear', 'Scriptorium', 'VoltRoute'],
  },
  {
    name: 'Node + Express',
    what: 'Thin, stateless REST APIs. Easy to run on a laptop, inside Lambda, or on a free Render dyno without changing the code.',
    where: 'The API layer for all three projects. Rate limiting, Zod validation and secret-keeping live here, never in the browser.',
    projects: ['CreditClear', 'Scriptorium', 'VoltRoute'],
  },
  {
    name: 'AWS',
    what: 'Serverless first. Lambda for compute, API Gateway for throttling, DynamoDB with TTL for records that must expire.',
    where: 'CreditClear runs end to end on SAM: Lambda, API Gateway, DynamoDB, S3, CloudFront, Cognito, SNS and CloudWatch alarms.',
    projects: ['CreditClear'],
  },
  {
    name: 'Python',
    what: 'Data work and model training. Pandas, scikit-learn and XGBoost, with the export checked against the serving code.',
    where: 'Trained the CreditClear logistic model on 60k simulated applicants and verified the JS port matches to floating-point precision.',
    projects: ['CreditClear'],
  },
  {
    name: 'Firebase',
    what: 'Auth and Firestore when a project needs accounts fast, with per-document security rules instead of a custom backend.',
    where: 'VoltRoute sign-in, favourites, and one-review-per-driver-per-station enforced in rules.',
    projects: ['VoltRoute'],
  },
  {
    name: 'SQL',
    what: 'Relational data with real constraints. SQLite for local-first apps, Turso for the same file in the cloud, MySQL earlier.',
    where: 'Scriptorium claims each reminder in the database before sending, so it fires exactly once under concurrent runs.',
    projects: ['Scriptorium', 'Blogging Platform', 'E-Healthcare'],
  },
  {
    name: 'Tailwind',
    what: 'Utility CSS driven by design tokens, so a palette lives in one place and can be animated rather than swapped.',
    where: 'CreditClear (v4) and VoltRoute (v3), where the whole theme tweens between light and dark.',
    projects: ['CreditClear', 'VoltRoute'],
  },
  {
    name: 'GSAP',
    what: 'One animation engine for entrances, scroll reveals, Flip re-ordering and DOM-level map markers.',
    where: 'The wax-seal stamp in Scriptorium, marker animations in VoltRoute, and the typing on this page.',
    projects: ['Scriptorium', 'VoltRoute', 'CreditClear'],
  },
  {
    name: 'Vercel',
    what: 'Zero-config deploys for static sites and small Node services, with preview URLs on every push.',
    where: 'Scriptorium runs as two Vercel services behind one domain. Quizionary, Rate Calculator and this site are here too.',
    projects: ['Scriptorium', 'Quizionary', 'Rate Calculator'],
  },
];
