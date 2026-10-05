import type { ComparisonSide, FaqItem, FeatureItem, SolutionCard, Stat } from '@common/components/types';

/**
 * Home page content. Replace with the real client's copy.
 */

export const hero = {
    tag: '⚡ Same-day service',
    title: 'Fast, local plumbing you can count on.',
    subhead: 'Licensed and insured repairs for homes and small businesses across the county. Fixed pricing before we start, and a clean-up guarantee on every job.',
    primaryCta: { href: '/contact', label: 'Book a plumber' },
    secondaryCta: { href: '/services', label: 'See services' },
    stats: [
        { value: '20+', label: 'Years serving the county' },
        { value: '4.9', label: 'Average rating' },
        { value: '24h', label: 'Emergency response' },
    ] satisfies Stat[],
};

export const features: FeatureItem[] = [
    {
        icon: 'bolt',
        title: 'Emergency callouts',
        text: 'Leaking, blocked, or no heat? We answer around the clock and aim to be with you the same day.',
    },
    {
        icon: 'shield',
        title: 'Licensed and insured',
        text: 'Fully certified technicians and documentation you can hand to an insurer or buyer.',
    },
    {
        icon: 'credit-card',
        title: 'Fixed upfront pricing',
        text: 'You get a firm quote before any work starts. No hourly surprises when the job is done.',
    },
];

export const services: SolutionCard[] = [
    {
        icon: 'bolt',
        title: 'Emergency repairs',
        text: 'Burst pipes, blocked drains, and no hot water.',
        bullets: ['24/7 callouts', 'Upfront quote', 'Most parts in stock'],
    },
    {
        icon: 'pencil',
        title: 'Installations and replacements',
        text: 'Boilers, toilets, sinks, and full bathroom refits.',
        bullets: ['Supply and fit', 'Old unit removed', 'Workmanship guarantee'],
        cta: { href: '/contact', label: 'Get a quote', variant: 'secondary' },
    },
    {
        icon: 'globe',
        title: 'Planned maintenance',
        text: 'Annual servicing that keeps small faults from becoming expensive ones.',
        bullets: ['Annual inspection', 'Priority callouts', 'No call-out fee'],
        cta: { href: '/contact', label: 'Discuss a plan' },
    },
];

export const comparison: { left: ComparisonSide; right: ComparisonSide } = {
    left: {
        heading: '❌ Calling a national chain',
        tone: 'negative',
        items: [
            'Call centre, not a person who does the work',
            'Technician commission targets push costs up',
            'No guarantee the same crew returns',
        ],
    },
    right: {
        heading: '⚡ Working with Acme directly',
        tone: 'positive',
        items: [
            'The person who quotes the job does the job',
            'Fixed price agreed before any work starts',
            'One number, one team, for the life of your account',
        ],
    },
};

export const faqs: FaqItem[] = [
    {
        q: 'Do you offer emergency callouts?',
        a: 'Yes. We answer 24 hours a day, seven days a week, and aim to reach most addresses within the county the same day.',
    },
    {
        q: 'Is the quoted price fixed?',
        a: 'Yes. We quote a fixed price before starting and only change it if you ask for additional work.',
    },
    {
        q: 'Are you licensed and insured?',
        a: 'Yes. We can provide documentation for your records or for an insurance claim at any time.',
    },
    {
        q: 'Do you cover areas outside the city?',
        a: 'We cover the city and most surrounding towns. Get in touch with your postcode and we will confirm.',
    },
];

export const hours: { label: string; value: string }[] = [
    { label: 'Monday to Friday', value: '8:00am - 6:00pm' },
    { label: 'Saturday', value: '9:00am - 2:00pm' },
    { label: 'Sunday', value: 'Emergency callouts only' },
];