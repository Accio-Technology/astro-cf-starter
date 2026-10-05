import type { SiteConfig } from '@common/components/types';

/**
 * Single source of truth for anything business-specific.
 *
 * This file belongs to the SITE, not to astro-common. The library never imports
 * it; pages pass it into components as props.
 */
export const site: SiteConfig = {
    name: 'Acme Plumbing',
    legalName: 'Acme Plumbing LLC',
    domain: 'https://example.com',
    description: 'Fast, local plumbing repairs and installations. Licensed and insured.',
    themeColor: '#0066ff',
    contact: {
        email: 'hello@example.com',
        phone: '(555) 010-0100',
        address: '123 Example St, Springfield',
        hours: 'Mon-Fri 8am-6pm',
    },
    nav: [
        { href: '/services', label: 'Services' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ],
    // Social links are always rendered with target="_blank", so they need no flag.
    social: [{ label: 'Facebook', href: 'https://facebook.com' }],
    jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Acme Plumbing',
        url: 'https://example.com',
        telephone: '(555) 010-0100',
        email: 'hello@example.com',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Example St',
            addressLocality: 'Springfield',
        },
    },
};