/**
 * Public (client-safe) environment values.
 *
 * Only ever read vars prefixed with PUBLIC_. Secrets belong in `.dev.vars`
 * locally and in Cloudflare secrets in production, and must only be read from
 * server code such as src/pages/api/contact.ts.
 *
 * Kept separate from site.ts so astro.config.mjs can import that file without
 * dragging build-time env handling into config loading.
 */
export const publicEnv = {
    /** Cloudflare Turnstile site key. Public by design — safe in client HTML. */
    turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '',
};