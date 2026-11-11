/** Each project written up as an incident report. Facts come from the projects' own READMEs. */
export type Postmortem = {
  slug: string;
  id: string;
  title: string;
  project: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  status: 'resolved' | 'monitoring';
  opened: string;
  resolved: string;
  summary: string;
  impact: string[];
  timeline: { t: string; what: string }[];
  rootCause: string[];
  resolution: string[];
  verification: string[];
  lessons: string[];
  actionItems: string[];
  stack: string[];
  live?: string;
  accent: 'mint' | 'lavender' | 'butter';
};

export const postmortems: Postmortem[] = [
  {
    slug: 'creditclear',
    id: 'INC-2026-10-01',
    title: 'Thin-file borrowers rejected by default',
    project: 'CreditClear',
    severity: 'SEV-1',
    status: 'resolved',
    opened: 'Sep 2026',
    resolved: 'Oct 2026',
    accent: 'mint',
    live: 'https://d1jt51uy02drli.cloudfront.net',
    stack: ['React 19', 'Tailwind 4', 'AWS Lambda', 'API Gateway', 'SAM', 'DynamoDB', 'S3 + CloudFront', 'Cognito', 'Python', 'scikit-learn'],
    summary:
      'Applicants with no bureau history were being scored as unknowns and turned away, even when years of rent, utility and mobile-recharge payments showed they paid on time. CreditClear replaces the missing bureau score with those records, scores them with an explainable model, and tells the applicant exactly what to change to reach a Clear score.',
    impact: [
      'Anyone without a credit card or prior loan had no score at all, so lenders defaulted to rejection.',
      'The data that did exist (rent, bills, recharges) was never read by anything.',
      'When scores were given, nobody could explain which factor cost which points.',
    ],
    timeline: [
      { t: 'Day 0', what: 'Problem framed: score people on the payment history they actually have. Chose a 0-100 scale with three bands: Clear (70+), Borderline (50-69), Room to improve (below 50).' },
      { t: 'Week 1', what: 'Built a rule formula first, so there was always something to compare against and fall back to.' },
      { t: 'Week 2', what: 'No public dataset links Indian household expenses to loan repayment, so 60,000 applicants were simulated from MoSPI household-expenditure shares and observed telecom plan prices. Trained a logistic regression and an XGBoost challenger.' },
      { t: 'Week 3', what: 'Live data crawlers added: RBI repo rate, MoSPI CPI by state, Jio and Vi plan APIs. Each runs in parallel with a 4-6 s timeout, a warm-Lambda cache, and a dated snapshot fallback.' },
      { t: 'Week 4', what: 'Deployed with SAM: Lambda behind API Gateway throttling, DynamoDB with 90-day TTL, S3 snapshots, SNS notify, CloudWatch alarm, Cognito-gated lender dashboard, site on S3 + CloudFront.' },
      { t: 'Week 5', what: 'Explainability shipped: every factor returns its exact point impact against the average applicant, with a month-by-month improvement plan computed by re-scoring future states.' },
    ],
    rootCause: [
      'Bureau-based scoring treats absence of data as risk. The signal was there, just in the wrong place: landlords, utilities and telecom operators.',
      'A first 14-input model gave the existing-EMI share the wrong sign, because EMIs were already inside total essentials. Fixed by collapsing all expense columns into one essentials-to-income ratio, so every rupee counts the same and medical or education spend is never penalised as a category.',
    ],
    resolution: [
      'Logistic regression with 9 inputs, trained in Python, exported as JSON and served in Node inside Lambda, so no ML runtime ships to production.',
      'If the model fails to load or score, the rule formula takes over and the response says which one ran.',
      'On-time rates with under 12 months of history are pulled toward neutral, so one perfect month counts less than a year.',
      'Eligibility follows the RBI microfinance rule: all EMIs within 50% of income, and the new EMI within 60% of monthly surplus.',
      'Consent is versioned and stored with every record. Email addresses are used once for the report and never stored.',
    ],
    verification: [
      'Held-out test of 12,000 applicants: AUC 0.767 for the served model vs 0.744 for the rule formula. The gain has a 95% CI of 0.017 to 0.030.',
      'Shuffled-label check gives AUC 0.52, so there is no leakage.',
      'Training fails if any weight points the unsafe direction.',
      'The JavaScript model matches Python to a maximum probability gap of 3e-16.',
      'Rural vs urban predicted defaults are within 0.4 points of actual.',
    ],
    lessons: [
      'Build the dumb fallback first. It becomes the benchmark, the safety net and the explanation for why the model is worth it.',
      'Explainability is a product feature, not a report. Applicants act on "rent on-time rate cost you 6 points", not on a score.',
      'Simulated outcomes prove the pipeline, not the predictions. The model must be retrained on real repayment data before any lending decision.',
    ],
    actionItems: [
      'Retrain on real loan outcomes before production use.',
      'Add Airtel and BSNL plan crawlers once their pages stop rendering client-side.',
      'Move email from the Apps Script relay to Amazon SES for volume.',
    ],
  },
  {
    slug: 'scriptorium',
    id: 'INC-2026-09-02',
    title: 'Reminder emails sent twice',
    project: 'Scriptorium',
    severity: 'SEV-2',
    status: 'resolved',
    opened: 'Aug 2026',
    resolved: 'Sep 2026',
    accent: 'lavender',
    live: 'https://getscriptorium.vercel.app',
    stack: ['React', 'GSAP', 'Node + Express', 'SQLite / Turso', 'Google OAuth', 'Nodemailer', 'Vercel'],
    summary:
      'A hobby organizer with email reminders is only useful if the email arrives exactly once. Any scheduler that polls "due reminders" and sends them will double-send the moment two checks overlap. Scriptorium claims each reminder in the database before sending it, so concurrency can’t duplicate a message.',
    impact: [
      'A naive poll-and-send loop would email twice whenever two workers woke at the same time, which on serverless hosting is the normal case, not the edge case.',
      'A failed SMTP call would either lose the reminder or retry forever.',
      'Editing a reminder’s time after it had fired left it silently dead.',
    ],
    timeline: [
      { t: 'Day 0', what: 'Scope set: notes, deadlines, bills and reminders in one place, mobile first, deployable for free.' },
      { t: 'Week 1', what: 'React + GSAP client, Express API, SQLite file locally with libSQL/Turso for the same database in the cloud. Email/password and Google sign-in.' },
      { t: 'Week 2', what: 'Scheduler written. Every due reminder is claimed in the database first, then sent. Failed sends retry up to 3 times. Changing a reminder’s time re-arms it.' },
      { t: 'Week 3', what: 'Mobile pass: bottom tab bar, bottom-sheet editor, safe-area insets, 44px targets, 16px inputs so iOS never zooms. GSAP Flip re-orders items when checked, with a wax-seal stamp.' },
      { t: 'Week 4', what: 'Deployed as two Vercel services behind one domain: Vite client and Express server, with /api rewritten to the server.' },
    ],
    rootCause: [
      'Send-then-mark is a race. Two workers both read "due and unsent", both send, both mark. The mark must happen first and be atomic.',
      'Without SMTP configured the app had no way to show what it would have sent, so reminder bugs were invisible during development.',
    ],
    resolution: [
      'Claim-before-send: the row is updated to "claimed" in one statement, and only the worker whose update succeeded sends the email.',
      'Three retries on failure, and a reminder whose time changes goes back to the unsent state.',
      'With no SMTP host set, reminder emails print to the server console, so the whole flow is testable locally.',
      'Any SMTP provider works: Gmail app passwords, Resend, SendGrid, Postmark, Mailgun.',
    ],
    verification: [
      'Two schedulers run against the same database produce one email per reminder.',
      'A reminder edited after firing fires again at its new time.',
      'All motion, including the Flip re-ordering and seal stamp, switches off under prefers-reduced-motion.',
    ],
    lessons: [
      'Idempotency is a database problem, not an email problem. Fix it where the state lives.',
      'A console fallback for side effects makes the hard path testable without credentials.',
      'Mobile first is a list of specific numbers (44px, 16px, safe-area insets), not a vibe.',
    ],
    actionItems: [
      'Add push notifications alongside email.',
      'Shared lists between accounts.',
    ],
  },
  {
    slug: 'voltroute',
    id: 'INC-2026-08-03',
    title: 'Driver arrives at a charger that is busy, incompatible, or overpriced',
    project: 'VoltRoute',
    severity: 'SEV-2',
    status: 'monitoring',
    opened: 'Jul 2026',
    resolved: 'Aug 2026',
    accent: 'butter',
    stack: ['React 18', 'Vite', 'Tailwind 3', 'GSAP', 'Google Maps + Places (New)', 'Express + Zod', 'Firebase Auth', 'Firestore', 'Render'],
    summary:
      'EV drivers could not tell before leaving whether a charger on their route was free, whether the plug fit their car, or roughly what it would cost. The data is split across operator apps, and none answers all three at once. VoltRoute puts real chargers on one map, colour-coded by live availability and filterable by the three things that decide whether you can actually charge.',
    impact: [
      'Wasted trips to occupied or incompatible chargers.',
      'No single place to compare price across operators.',
      'Reviews on operator apps could be brigaded by repeat submissions.',
    ],
    timeline: [
      { t: 'Day 0', what: 'Chose Google Places API (New) because its evChargeOptions field exposes connectors and live port counts for real stations.' },
      { t: 'Week 1', what: 'Express proxy built so the Places key never reaches the browser. One strict Zod schema per endpoint, Helmet headers, rate limiting.' },
      { t: 'Week 2', what: 'Map with Advanced Markers (real DOM, so GSAP can animate them), colour-coded Available / Busy / Unknown. Filters by radius, connector (CCS, CHAdeMO, Type 2) and max price, with live facet counts.' },
      { t: 'Week 3', what: 'Firebase Auth with email and Google. Favourites and reviews in Firestore with per-document rules: one rating per driver per station, resubmission updates the first.' },
      { t: 'Week 4', what: 'Light/dark theme that tweens across CSS variables instead of snapping. Frontend to Firebase Hosting, API to Render.' },
    ],
    rootCause: [
      'Charge-point data is fragmented by operator, so no app had availability, compatibility and price together.',
      'Calling Places directly from the browser would publish the API key to anyone who opens DevTools. Risk identified in design and closed before the first deploy.',
    ],
    resolution: [
      'Backend proxy owns the Places key. The browser only ever talks to the Express API.',
      'Markers and cards sort by true great-circle distance from the driver, with a drawn search radius.',
      'Detail panel shows every connector with its power rating, live port counts, price estimate, ratings, and a Get Directions hand-off into Google Maps navigation.',
      'Review integrity enforced in Firestore rules, not just in the UI.',
    ],
    verification: [
      'Backend tests run with node --test against the Zod schemas and routes.',
      'Unknown fields in any request are rejected, which blocks mass-assignment.',
      'Loading skeletons match the real components’ geometry, and each failure mode has its own empty state.',
    ],
    lessons: [
      'Keep secrets server-side from the first commit. Retrofitting a proxy is harder than starting with one.',
      'Validation belongs at the edge, in one schema per endpoint, so the handler can trust its input.',
      'A theme is a set of tokens. If the palette lives in CSS variables, you can animate the switch.',
    ],
    actionItems: [
      'Public deployment of the web client (the API is live on Render).',
      'Route-aware search: chargers along a path, not just around a point.',
    ],
  },
];
