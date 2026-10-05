/**
 * Hand-written additions to the generated Cloudflare types.
 *
 * `src/env.d.ts` is produced by `wrangler types` and only knows about bindings
 * declared in `wrangler.jsonc`. Secrets are uploaded separately with
 * `wrangler secret put`, so wrangler cannot see them and never emits them here.
 *
 * Declaring them in the `Cloudflare` namespace merges with the generated
 * `Cloudflare.Env`, which is the type behind `env` from `cloudflare:workers`.
 * Mark optional ones with `?` — the code must handle them being unset.
 */

declare namespace Cloudflare {
    interface Env {
        /** Resend API key. Required: the contact route cannot send mail without it. */
        RESEND_API_KEY: string;
        /** Turnstile secret. Optional; verification is skipped when it is unset. */
        TURNSTILE_SECRET_KEY?: string;
    }
}
