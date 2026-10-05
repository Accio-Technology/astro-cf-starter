import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { site } from '../../config/site';

/**
 * Contact form endpoint.
 *
 * astro-common ships the form component but no server code — deployment and
 * secrets belong to the site, so this route lives here. Replace the Resend call
 * with whatever mail provider the client prefers.
 *
 * Env vars (server-side only, never in PUBLIC_ vars):
 *   RESEND_API_KEY
 *   TURNSTILE_SECRET_KEY  optional; verification is skipped when unset
 */

export const prerender = false;

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

interface ContactPayload {
    name: string;
    email: string;
    subject?: string;
    message: string;
    company?: string;
    turnstileToken?: string;
}

const json = (body: Record<string, unknown>, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set('remoteip', ip);

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body,
        });
        const result = (await response.json()) as { success?: boolean };
        return result.success === true;
    } catch {
        return false;
    }
}

function renderEmail(payload: Required<Pick<ContactPayload, 'name' | 'email' | 'message'>> & { subject: string }) {
    const label = 'color:#475569;font-weight:600;width:110px;';
    const value = 'color:#0f172a;';

    return `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <h2 style="color:#0b192c;border-bottom:2px solid #0066ff;padding-bottom:10px">New website enquiry</h2>
            <table style="width:100%;border-collapse:collapse;margin-top:16px">
                <tr><td style="${label}padding:8px 0">Name</td><td style="${value}padding:8px 0">${escapeHtml(payload.name)}</td></tr>
                <tr><td style="${label}padding:8px 0">Email</td><td style="${value}padding:8px 0"><a href="mailto:${escapeHtml(payload.email)}" style="color:#0066ff">${escapeHtml(payload.email)}</a></td></tr>
                <tr><td style="${label}padding:8px 0">Subject</td><td style="${value}padding:8px 0">${escapeHtml(payload.subject)}</td></tr>
            </table>
            <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:8px;border-left:4px solid #0066ff">
                <p style="${label}margin:0 0 8px">Message</p>
                <p style="color:#0f172a;margin:0;white-space:pre-wrap">${escapeHtml(payload.message)}</p>
            </div>
        </div>
    `;
}

export const POST: APIRoute = async ({ request }) => {
    const { RESEND_API_KEY, TURNSTILE_SECRET_KEY } = env;

    // Cross-origin form posts are the only real CSRF vector here. Browsers always
    // send Origin on same-site POSTs, so a mismatch means the request came from
    // somewhere we did not host. Compare against the incoming URL rather than the
    // configured domain so dev, preview and production all behave the same.
    const origin = request.headers.get('Origin');
    if (origin && origin !== new URL(request.url).origin) {
        return json({ error: 'Invalid request origin' }, 403);
    }

    let payload: ContactPayload;
    try {
        payload = (await request.json()) as ContactPayload;
    } catch {
        return json({ error: 'Invalid request body' }, 400);
    }

    const name = (payload.name ?? '').trim();
    const email = (payload.email ?? '').trim();
    const subject = (payload.subject ?? '').trim();
    const message = (payload.message ?? '').trim();
    const company = (payload.company ?? '').trim();
    const turnstileToken = (payload.turnstileToken ?? '').trim();

    // Honeypot: a real browser leaves this hidden field empty.
    if (company !== '') {
        return json({ error: 'Invalid request' }, 400);
    }

    if (!name || !email || !message) {
        return json({ error: 'All fields are required' }, 400);
    }

    if (name.length > MAX_NAME || email.length > MAX_EMAIL || subject.length > MAX_SUBJECT || message.length > MAX_MESSAGE) {
        return json({ error: 'One or more fields are too long' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ error: 'Invalid email address' }, 400);
    }

    if (TURNSTILE_SECRET_KEY) {
        const ip = request.headers.get('CF-Connecting-IP');
        if (!turnstileToken || !(await verifyTurnstile(turnstileToken, TURNSTILE_SECRET_KEY, ip))) {
            return json({ error: 'Verification failed. Please try again.' }, 403);
        }
    }

    const destination = site.contact?.email;
    if (!destination) {
        return json({ error: 'Contact form is not configured' }, 500);
    }

    const mailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: `${site.name} <${destination}>`,
            to: [destination],
            reply_to: email,
            subject: subject ? `Enquiry: ${subject}` : `Enquiry from ${name}`,
            html: renderEmail({ name, email, message, subject: subject || 'No subject' }),
        }),
    });

    if (!mailResponse.ok) {
        return json({ error: 'Failed to send message. Please try again later.' }, 500);
    }

    return json({ success: true }, 200);
};