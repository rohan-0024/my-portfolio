import { defineConfig } from 'astro/config';

// Vercel injects the production hostname at build time, so share cards get absolute URLs
// without hard-coding the domain. Locally it falls back to the dev server.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export default defineConfig({
  site: vercelHost ? `https://${vercelHost}` : 'http://localhost:4321',
  output: 'static',
  compressHTML: true,
});
