/**
 * The Brain Cortex graph. Every node is something learned; every link is where it connects.
 * kind: 'domain' = a cluster hub, 'project' = something shipped, 'tool' = a technology, 'concept' = an idea learned the hard way.
 */
export type NodeKind = 'domain' | 'project' | 'tool' | 'concept';
export type Tag = 'frontend' | 'backend' | 'cloud' | 'data' | 'database' | 'security' | 'motion' | 'core';

export type BrainNode = {
  id: string;
  label: string;
  kind: NodeKind;
  tag: Tag;
  desc: string;
  status?: 'learning';
};

export const TAG_META: Record<Tag, { label: string; color: string }> = {
  core: { label: 'core', color: '#f3efe4' },
  frontend: { label: 'frontend', color: '#cdb4ff' },
  backend: { label: 'backend', color: '#b8f2d6' },
  cloud: { label: 'cloud', color: '#9ad7ff' },
  data: { label: 'data + ml', color: '#ffe6a7' },
  database: { label: 'databases', color: '#ffc8dd' },
  security: { label: 'security', color: '#ff5c5c' },
  motion: { label: 'motion + ui', color: '#c6f0a5' },
};

export const nodes: BrainNode[] = [
  // ---- hubs
  { id: 'me', label: 'Rohan', kind: 'domain', tag: 'core', desc: 'Where every path starts. CSE in Cloud Computing, class of 2027.' },
  { id: 'd-frontend', label: 'Frontend', kind: 'domain', tag: 'frontend', desc: 'Interfaces that stay responsive while the data behind them is still loading.' },
  { id: 'd-backend', label: 'Backend', kind: 'domain', tag: 'backend', desc: 'APIs that validate everything, keep secrets server-side, and fail loudly.' },
  { id: 'd-cloud', label: 'Cloud', kind: 'domain', tag: 'cloud', desc: 'Serverless first. Pay for requests, not idle hours.' },
  { id: 'd-data', label: 'Data + ML', kind: 'domain', tag: 'data', desc: 'Pipelines and models that are checked against the code that serves them.' },
  { id: 'd-db', label: 'Databases', kind: 'domain', tag: 'database', desc: 'Relational by default. Constraints are cheaper than bug reports.' },
  { id: 'd-sec', label: 'Security', kind: 'domain', tag: 'security', desc: 'Rate limits, strict schemas, and never trusting the browser.' },
  { id: 'd-motion', label: 'Motion + UI', kind: 'domain', tag: 'motion', desc: 'Animation that explains state, and switches off when asked.' },

  // ---- projects
  { id: 'p-creditclear', label: 'CreditClear', kind: 'project', tag: 'core', desc: 'Explainable micro-credit scoring on AWS Lambda with live RBI and telecom data.' },
  { id: 'p-scriptorium', label: 'Scriptorium', kind: 'project', tag: 'core', desc: 'Organizer with email reminders that fire exactly once.' },
  { id: 'p-voltroute', label: 'VoltRoute', kind: 'project', tag: 'core', desc: 'Real EV chargers on a map, filtered by plug, distance and price.' },
  { id: 'p-portfolio', label: 'This site', kind: 'project', tag: 'core', desc: 'Astro, GSAP, and a hand-rolled 3D graph you are looking at right now.' },
  { id: 'p-ehealth', label: 'E-Healthcare', kind: 'project', tag: 'core', desc: 'First big project. Java Swing + MySQL. Taught me what a schema is for.' },

  // ---- frontend
  { id: 'react', label: 'React', kind: 'tool', tag: 'frontend', desc: 'Component UI. Used in every frontend since 2025.' },
  { id: 'vite', label: 'Vite', kind: 'tool', tag: 'frontend', desc: 'Fast dev server and bundler behind every React app here.' },
  { id: 'astro', label: 'Astro', kind: 'tool', tag: 'frontend', desc: 'Static-first framework. Ships zero JS unless a component asks for it.' },
  { id: 'tailwind', label: 'Tailwind', kind: 'tool', tag: 'frontend', desc: 'Token-driven utility CSS. One palette definition drives both themes.' },
  { id: 'router', label: 'React Router', kind: 'tool', tag: 'frontend', desc: 'Client routing across multi-step flows and dashboards.' },
  { id: 'recharts', label: 'Recharts', kind: 'tool', tag: 'frontend', desc: 'Score distributions and lender dashboard charts.' },
  { id: 'maps', label: 'Google Maps API', kind: 'tool', tag: 'frontend', desc: 'Advanced Markers are real DOM, so they can be animated.' },
  { id: 'mobile-first', label: 'Mobile-first', kind: 'concept', tag: 'frontend', desc: 'Bottom tab bars, 44px targets, safe-area insets, 16px inputs so iOS never zooms.' },

  // ---- backend
  { id: 'node', label: 'Node.js', kind: 'tool', tag: 'backend', desc: 'The runtime for every API here, from Lambda to Render.' },
  { id: 'express', label: 'Express', kind: 'tool', tag: 'backend', desc: 'Thin REST layer. Same code runs locally, in Lambda, or on Render.' },
  { id: 'zod', label: 'Zod', kind: 'tool', tag: 'backend', desc: 'One strict schema per endpoint. Unknown fields are rejected, not ignored.' },
  { id: 'java', label: 'Java', kind: 'tool', tag: 'backend', desc: 'First language. Swing GUIs and JDBC before the web.' },
  { id: 'rest', label: 'REST design', kind: 'concept', tag: 'backend', desc: 'Resources, status codes, and responses that say which code path ran.' },
  { id: 'idempotency', label: 'Idempotency', kind: 'concept', tag: 'backend', desc: 'Claim the row before you act on it. Two workers, one email.' },
  { id: 'fallbacks', label: 'Graceful fallback', kind: 'concept', tag: 'backend', desc: 'Every live source has a dated snapshot behind it. Nothing blocks on upstream.' },
  { id: 'smtp', label: 'SMTP + mailers', kind: 'tool', tag: 'backend', desc: 'Nodemailer, Gmail app passwords, and an Apps Script relay for Lambda.' },

  // ---- cloud
  { id: 'lambda', label: 'AWS Lambda', kind: 'tool', tag: 'cloud', desc: 'Scoring API as a function. Warm cache for crawled market data.' },
  { id: 'apigw', label: 'API Gateway', kind: 'tool', tag: 'cloud', desc: 'Throttling at 5 req/s before Lambda ever runs.' },
  { id: 'sam', label: 'AWS SAM', kind: 'tool', tag: 'cloud', desc: 'Whole stack as one template. sam build, sam deploy.' },
  { id: 's3', label: 'S3 + CloudFront', kind: 'tool', tag: 'cloud', desc: 'Static site over HTTPS, plus application snapshots with lifecycle rules.' },
  { id: 'cognito', label: 'Cognito', kind: 'tool', tag: 'cloud', desc: 'Admin-created lender accounts, group-gated JWTs.' },
  { id: 'cloudwatch', label: 'CloudWatch + SNS', kind: 'tool', tag: 'cloud', desc: 'Logs, alarms, and a notification on every scored application.' },
  { id: 'firebase', label: 'Firebase', kind: 'tool', tag: 'cloud', desc: 'Auth, Firestore rules and hosting for VoltRoute.' },
  { id: 'vercel', label: 'Vercel', kind: 'tool', tag: 'cloud', desc: 'Preview URL on every push. Two services behind one domain for Scriptorium.' },
  { id: 'render', label: 'Render', kind: 'tool', tag: 'cloud', desc: 'Free dyno for the VoltRoute API.' },
  { id: 'serverless', label: 'Serverless', kind: 'concept', tag: 'cloud', desc: 'Cold starts are real. Keep the bundle small and cache in the warm container.' },
  { id: 'azure', label: 'Azure (AZ-104)', kind: 'tool', tag: 'cloud', desc: 'Azure Administrator track completed. Compute, networking, storage, identity.' },
  { id: 'devsecops', label: 'DevSecOps', kind: 'concept', tag: 'cloud', desc: 'Security gates inside the pipeline, not after it. Patient-portal pipeline project.' },

  // ---- data
  { id: 'python', label: 'Python', kind: 'tool', tag: 'data', desc: 'Training, validation and data generation.' },
  { id: 'sklearn', label: 'scikit-learn', kind: 'tool', tag: 'data', desc: 'Logistic regression that beat the hand-written formula.' },
  { id: 'xgboost', label: 'XGBoost', kind: 'tool', tag: 'data', desc: 'Challenger model. Won by 0.004 AUC, lost on explainability.' },
  { id: 'explainable', label: 'Explainable ML', kind: 'concept', tag: 'data', desc: 'Every factor returned with its exact point impact. No black boxes for credit.' },
  { id: 'model-serving', label: 'Model serving', kind: 'concept', tag: 'data', desc: 'Export weights as JSON, serve in Node, prove the port matches Python.' },
  { id: 'crawling', label: 'Live data crawling', kind: 'concept', tag: 'data', desc: 'RBI rates, MoSPI CPI, telecom plan APIs. Parallel, timed out, cached.' },
  { id: 'servicenow', label: 'ServiceNow ML', kind: 'tool', tag: 'data', desc: 'Churn prediction on the Now platform.' },
  { id: 'powerbi', label: 'Power BI', kind: 'tool', tag: 'data', desc: 'Dashboards and DAX. Turning scored data into something a lender can read at a glance.', status: 'learning' },

  // ---- databases
  { id: 'sqlite', label: 'SQLite', kind: 'tool', tag: 'database', desc: 'A file is a database. Local-first with no server to install.' },
  { id: 'turso', label: 'Turso / libSQL', kind: 'tool', tag: 'database', desc: 'The same SQLite file, replicated in the cloud.' },
  { id: 'dynamodb', label: 'DynamoDB', kind: 'tool', tag: 'database', desc: 'Applications table with TTL so records delete themselves after 90 days.' },
  { id: 'firestore', label: 'Firestore', kind: 'tool', tag: 'database', desc: 'Favourites and reviews, guarded by per-document rules.' },
  { id: 'mysql', label: 'MySQL', kind: 'tool', tag: 'database', desc: 'First database. Blogging platform and the healthcare system.' },
  { id: 'ttl', label: 'Data retention', kind: 'concept', tag: 'database', desc: 'Store the minimum, expire the rest, never keep the email.' },

  // ---- security
  { id: 'oauth', label: 'OAuth + Google sign-in', kind: 'tool', tag: 'security', desc: 'One client ID, served from the API so it is configured once.' },
  { id: 'jwt', label: 'JWT', kind: 'tool', tag: 'security', desc: 'Group claims checked on every lender route.' },
  { id: 'ratelimit', label: 'Rate limiting', kind: 'concept', tag: 'security', desc: 'At the gateway, in Express, and per-address in the mailer.' },
  { id: 'secrets', label: 'Secrets server-side', kind: 'concept', tag: 'security', desc: 'The Places key never reaches the browser. Proxy everything.' },
  { id: 'helmet', label: 'Helmet + CORS', kind: 'tool', tag: 'security', desc: 'Baseline headers on every Express app.' },
  { id: 'consent', label: 'Consent + privacy', kind: 'concept', tag: 'security', desc: 'Versioned consent stored with every record. Masked addresses in logs.' },

  // ---- motion
  { id: 'gsap', label: 'GSAP', kind: 'tool', tag: 'motion', desc: 'Timelines, Flip, ScrollTrigger. One engine for everything that moves.' },
  { id: 'flip', label: 'Flip re-ordering', kind: 'concept', tag: 'motion', desc: 'Items glide to their new slot when checked off.' },
  { id: 'reduced-motion', label: 'Reduced motion', kind: 'concept', tag: 'motion', desc: 'Every animation has an off switch. This graph included.' },
  { id: 'theme-tween', label: 'Theme tweening', kind: 'concept', tag: 'motion', desc: 'Light to dark as a tween across CSS variables, not a snap.' },
  { id: 'canvas', label: 'Canvas 2D', kind: 'tool', tag: 'motion', desc: 'This graph. Projection, depth sorting and hit-testing by hand.' },
];

export const links: [string, string][] = [
  // me -> domains
  ['me', 'd-frontend'], ['me', 'd-backend'], ['me', 'd-cloud'], ['me', 'd-data'], ['me', 'd-db'], ['me', 'd-sec'], ['me', 'd-motion'],
  // me -> projects
  ['me', 'p-creditclear'], ['me', 'p-scriptorium'], ['me', 'p-voltroute'], ['me', 'p-portfolio'], ['me', 'p-ehealth'],

  // frontend
  ['d-frontend', 'react'], ['d-frontend', 'vite'], ['d-frontend', 'astro'], ['d-frontend', 'tailwind'], ['d-frontend', 'router'],
  ['d-frontend', 'recharts'], ['d-frontend', 'maps'], ['d-frontend', 'mobile-first'],
  ['react', 'vite'], ['react', 'router'],
  // backend
  ['d-backend', 'node'], ['d-backend', 'express'], ['d-backend', 'zod'], ['d-backend', 'java'], ['d-backend', 'rest'],
  ['d-backend', 'idempotency'], ['d-backend', 'fallbacks'], ['d-backend', 'smtp'],
  ['node', 'express'], ['express', 'zod'], ['express', 'rest'],
  // cloud
  ['d-cloud', 'lambda'], ['d-cloud', 'apigw'], ['d-cloud', 'sam'], ['d-cloud', 's3'], ['d-cloud', 'cognito'], ['d-cloud', 'cloudwatch'],
  ['d-cloud', 'firebase'], ['d-cloud', 'vercel'], ['d-cloud', 'render'], ['d-cloud', 'serverless'], ['d-cloud', 'azure'], ['d-cloud', 'devsecops'],
  ['lambda', 'serverless'], ['lambda', 'apigw'], ['sam', 'lambda'], ['lambda', 'node'],
  // data
  ['d-data', 'python'], ['d-data', 'sklearn'], ['d-data', 'xgboost'], ['d-data', 'explainable'], ['d-data', 'model-serving'],
  ['d-data', 'crawling'], ['d-data', 'servicenow'], ['d-data', 'powerbi'], ['powerbi', 'sqlite'],
  ['python', 'sklearn'], ['python', 'xgboost'], ['sklearn', 'model-serving'], ['model-serving', 'node'], ['explainable', 'sklearn'],
  // databases
  ['d-db', 'sqlite'], ['d-db', 'turso'], ['d-db', 'dynamodb'], ['d-db', 'firestore'], ['d-db', 'mysql'], ['d-db', 'ttl'],
  ['sqlite', 'turso'], ['dynamodb', 'ttl'], ['sqlite', 'idempotency'],
  // security
  ['d-sec', 'oauth'], ['d-sec', 'jwt'], ['d-sec', 'ratelimit'], ['d-sec', 'secrets'], ['d-sec', 'helmet'], ['d-sec', 'consent'],
  ['cognito', 'jwt'], ['apigw', 'ratelimit'], ['express', 'helmet'], ['zod', 'secrets'], ['firebase', 'oauth'],
  // motion
  ['d-motion', 'gsap'], ['d-motion', 'flip'], ['d-motion', 'reduced-motion'], ['d-motion', 'theme-tween'], ['d-motion', 'canvas'],
  ['gsap', 'flip'], ['gsap', 'theme-tween'], ['tailwind', 'theme-tween'], ['mobile-first', 'reduced-motion'],

  // projects -> what they used
  ['p-creditclear', 'react'], ['p-creditclear', 'tailwind'], ['p-creditclear', 'recharts'], ['p-creditclear', 'lambda'], ['p-creditclear', 'sam'],
  ['p-creditclear', 's3'], ['p-creditclear', 'cognito'], ['p-creditclear', 'cloudwatch'], ['p-creditclear', 'dynamodb'], ['p-creditclear', 'python'],
  ['p-creditclear', 'sklearn'], ['p-creditclear', 'explainable'], ['p-creditclear', 'crawling'], ['p-creditclear', 'fallbacks'], ['p-creditclear', 'consent'],
  ['p-creditclear', 'smtp'], ['p-creditclear', 'gsap'],
  ['p-scriptorium', 'react'], ['p-scriptorium', 'express'], ['p-scriptorium', 'sqlite'], ['p-scriptorium', 'turso'], ['p-scriptorium', 'idempotency'],
  ['p-scriptorium', 'oauth'], ['p-scriptorium', 'smtp'], ['p-scriptorium', 'gsap'], ['p-scriptorium', 'flip'], ['p-scriptorium', 'mobile-first'], ['p-scriptorium', 'vercel'],
  ['p-voltroute', 'react'], ['p-voltroute', 'maps'], ['p-voltroute', 'express'], ['p-voltroute', 'zod'], ['p-voltroute', 'firebase'], ['p-voltroute', 'firestore'],
  ['p-voltroute', 'secrets'], ['p-voltroute', 'helmet'], ['p-voltroute', 'ratelimit'], ['p-voltroute', 'theme-tween'], ['p-voltroute', 'render'], ['p-voltroute', 'tailwind'],
  ['p-portfolio', 'astro'], ['p-portfolio', 'gsap'], ['p-portfolio', 'canvas'], ['p-portfolio', 'reduced-motion'], ['p-portfolio', 'vercel'],
  ['p-ehealth', 'java'], ['p-ehealth', 'mysql'],
  ['servicenow', 'python'], ['devsecops', 'azure'],
];
