# astro-cf-starter

An Astro + Cloudflare Workers starter that renders its UI with the shared
[astro-common](../astro-common) component library, vendored in as a git
submodule at `src/common`.

Start here to build a client site. Copy it, replace the sample content in
`src/config/site.ts` and `src/data/`, and you already have deployment, a
sitemap, SEO defaults, a contact endpoint, and form/dark-mode handling done.

## Requirements

- Node 22.12 or newer (Astro 7's minimum)
- A Cloudflare account, for deploys and secrets
- This repo cloned **with** its submodule (see below)

## Getting started

```bash
git clone --recurse-submodules <this-repo-url> astro-cf-starter
cd astro-cf-starter
npm install
npm run dev
```

If you already cloned without the submodule:

```bash
git submodule update --init --recursive
```

`npm run dev` runs `wrangler types` first, then starts Astro's dev server on
Cloudflare's `workerd` runtime — the same runtime as production, so what you see
locally is what deploys.

## Updating the shared components

The library is a submodule, so bumping it is a normal git operation:

```bash
git -C src/common pull          # get the latest astro-common
git checkout src/common         # pin the commit you want
git commit -m "Bump astro-common"
```

Committing the new submodule pointer is what actually upgrades consumers. If a
component upgrade changes props, `npm run check` will tell you what to update.

## Configuration

Everything site-specific lives in two files:

| File | Purpose |
| --- | --- |
| `src/config/site.ts` | Name, domain, logo, contact details, nav, social, JSON-LD |
| `src/config/env.ts` | `PUBLIC_`-prefixed values, safe to expose in client HTML |

The library ships no business data and no secrets. Pages pass content into
components as props, which is why a rebuild of the library can never change what
your site says.

Brand colours, fonts, and radii are CSS custom properties on `:root`, defined in
`src/styles/theme.css`. Override them there; every component reads from the same
tokens.

## Environment variables

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | public | Cloudflare Turnstile site key, rendered into the form |
| `TURNSTILE_SECRET_KEY` | secret | Verifies the Turnstile token server-side |
| `RESEND_API_KEY` | secret | Sends the contact email through Resend |

Locally, copy the examples and fill them in:

```bash
cp .dev.vars.example .dev.vars    # secrets
cp .env.example .env              # public values
```

`.dev.vars` and `.env` are gitignored. `TURNSTILE_SECRET_KEY` is optional: when
it is unset the endpoint skips verification and accepts submissions.

In production, set secrets through Wrangler rather than committing them:

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret list         # confirm
```

### Why `wrangler types` runs automatically

`src/env.d.ts` is generated from `wrangler.jsonc` and gitignored. The generated
types only cover bindings Wrangler can see, which means secrets are missing from
them. Declare the secrets you read in `src/env-secrets.d.ts`, which merges with
the generated `Cloudflare.Env` and keeps `env` from `cloudflare:workers` typed.

Rerun `npm run cf-typegen` after changing `wrangler.jsonc`.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Typegen, then Astro dev server on workerd |
| `npm run build` | Typegen, then production build |
| `npm run preview` | Serve the built worker locally |
| `npm run check` | Typegen, then `astro check` |
| `npm run verify` | Typegen, typecheck, and build — run this before pushing |
| `npm run cf-typegen` | Regenerate `src/env.d.ts` |
| `npm run deploy` | `wrangler deploy` — run `npm run build` first |

## Deploying

This targets Cloudflare **Workers** with static assets, not Cloudflare Pages;
the Astro Cloudflare adapter dropped Pages support.

```bash
npm run build
npx wrangler deploy
```

Wrangler prints a `workers.dev` URL. To use a custom domain, add a route in
`wrangler.jsonc` or attach the domain in the Cloudflare dashboard.

Unknown paths are served the custom 404 page via `assets.not_found_handling`.
Keep that key if you want a branded 404 rather than a bare worker response.

## Layout

```
src/
├── common/            # astro-common submodule — do not edit
├── assets/            # logo, images
├── config/            # site.ts and env.ts: your content and public env
├── data/              # page content as typed data
├── layouts/Page.astro # wires site config into Header/Footer/Seo
├── pages/             # routes, plus api/contact.ts
└── styles/theme.css   # brand tokens overriding the library defaults
```

Everything under `src/common` belongs to the library. Edits there cannot be
pushed from this repo, so change the library repo and bump the submodule instead.

## The contact form

`astro-common` provides `ContactForm.astro`, which renders the markup and the
client-side behaviour: validation, honeypot, Turnstile, and a JSON `POST` to
`/api/contact`. It never talks to a mail provider.

The endpoint is yours, in `src/pages/api/contact.ts`. It checks the `Origin`
header, rejects honeypot submissions, validates lengths and email shape,
verifies Turnstile when the secret is set, and posts to Resend. Swap the mail
provider for a client preference without touching the component.

`X-Contact: accio` is not part of this contract. The Origin check replaces it.

## Submodule and GitHub

`.gitmodules` points at `../astro-common`, which Git resolves relative to this
repo's remote URL. **Both repos must live in the same GitHub organisation** for
that to resolve — same-org siblings resolve to a working URL, cross-org does not.

Before the first push to GitHub:

```bash
git remote add origin https://github.com/<org>/astro-cf-starter.git
git submodule sync --recursive      # re-resolve ../astro-common against origin
git submodule update --init --recursive
```

Then commit and push the submodule pointer as usual.

## Notes

- `astro.config.mjs` imports `src/config/site.ts` with a relative path on
  purpose: Astro does not resolve tsconfig path aliases while loading config.
- `session: false` keeps the adapter from provisioning a KV namespace, since
  this site has no cookie state.
- `imageService: 'compile'` optimises images at build time with Sharp. Switch to
  `'cloudflare-binding'` if you later want on-demand resizing.
