import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { validateEmail, sanitize, validateRequired, validateLength } from '@/lib/validate';
import { rateLimit } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`contact:${ip}`, 5, 300000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many submissions. Try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const email = sanitize(body.email || '');
    const message = sanitize(body.message || '');
    const first_name = sanitize(body.first_name || '');
    const last_name = sanitize(body.last_name || '');
    const phone = sanitize(body.phone || '');
    const topic = sanitize(body.topic || '');
    const account_number = sanitize(body.account_number || '');

    const reqError = validateRequired({ email, message }, ['email', 'message']);
    if (reqError) return NextResponse.json({ error: reqError }, { status: 400 });

    if (!validateEmail(email)) return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });

    const msgError = validateLength(message, 10, 5000, 'Message');
    if (msgError) return NextResponse.json({ error: msgError }, { status: 400 });

    const sql = getDB();
    await sql`
      INSERT INTO contact_submissions (first_name, last_name, email, phone, topic, account_number, message)
      VALUES (${first_name || null}, ${last_name || null}, ${email}, ${phone || null}, ${topic || null}, ${account_number || null}, ${message})
    `;

    logger.info('Contact form submitted', { email, topic });

    return NextResponse.json({ success: true, message: "Your message has been received. We'll respond within 1 business day." });
  } catch (error: any) {
    logger.error('Contact error', { error: error.message });
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = getDB();
    const submissions = await sql`SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 50`;
    return NextResponse.json({ submissions });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
