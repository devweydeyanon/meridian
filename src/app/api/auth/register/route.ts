import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDB, seedDemoData } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { validateEmail, validatePassword, sanitize, validateRequired, validateLength } from '@/lib/validate';
import { rateLimit } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`register:${ip}`, 3, 300000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many registration attempts. Try again in 5 minutes.' }, { status: 429 });
    }

    const body = await req.json();
    const email = sanitize(body.email || '');
    const password = body.password || '';
    const first_name = sanitize(body.first_name || '');
    const last_name = sanitize(body.last_name || '');
    const phone = sanitize(body.phone || '');

    const reqError = validateRequired({ email, password, first_name, last_name }, ['email', 'password', 'first_name', 'last_name']);
    if (reqError) return NextResponse.json({ error: reqError }, { status: 400 });

    if (!validateEmail(email)) return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });

    const pwError = validatePassword(password);
    if (pwError) return NextResponse.json({ error: pwError }, { status: 400 });

    const nameError = validateLength(first_name, 1, 100, 'First name') || validateLength(last_name, 1, 100, 'Last name');
    if (nameError) return NextResponse.json({ error: nameError }, { status: 400 });

    const sql = getDB();
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const account_number = 'MRD' + Math.random().toString().slice(2, 12);

    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, account_number)
      VALUES (${email}, ${password_hash}, ${first_name}, ${last_name}, ${phone || null}, ${account_number})
      RETURNING id, email, first_name, last_name, account_number
    `;

    const user = result[0];
    await seedDemoData(user.id);

    const token = signToken({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name });

    logger.info('New user registered', { userId: user.id, email });

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, account_number: user.account_number } });
    response.cookies.set('meridian_auth', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
    return response;
  } catch (error: any) {
    logger.error('Register error', { error: error.message });
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
