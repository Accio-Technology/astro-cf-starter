// NOTE: Astro does not resolve tsconfig path aliases while loading this file
// (withastro/astro#17418), so the config imports use relative paths on purpose.
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site.ts';

export default defineConfig({
    site: site.domain,

    // This site has no cookies or session state. Setting session: false stops the
    // adapter provisioning a KV namespace and keeps the worker bundle smaller.
    session: false,

    adapter: cloudflare({
        // Optimise images at build time with Sharp rather than provisioning a
        // Cloudflare Images binding. Switch to 'cloudflare-binding' if you later
        // want on-demand resizing of user-uploaded images.
        imageService: 'compile',
        vite: {
            build: {
                // Unminified worker output makes wrangler stack traces readable.
                minify: false,
            },
        },
    }),

    integrations: [sitemap()],
});