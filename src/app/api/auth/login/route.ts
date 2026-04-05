import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDB } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { validateEmail, sanitize, validateRequired } from '@/lib/validate';
import { rateLimit } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`login:${ip}`, 5, 60000);
    if (!allowed) {
      logger.warn('Rate limited login attempt', { ip });
      return NextResponse.json({ error: 'Too many attempts. Try again in 1 minute.' }, { status: 429 });
    }

    const body = await req.json();
    const email = sanitize(body.email || '');
    const password = body.password || '';

    const reqError = validateRequired({ email, password }, ['email', 'password']);
    if (reqError) return NextResponse.json({ error: reqError }, { status: 400 });

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const sql = getDB();
    const result = await sql`
      SELECT id, email, password_hash, first_name, last_name 
      FROM users WHERE email = ${email}
    `;

    if (result.length === 0) {
      logger.info('Failed login — user not found', { email });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = result[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      logger.info('Failed login — wrong password', { email });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

    // Generate OTP for two-factor verification
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate previous codes
    await sql`UPDATE verification_codes SET used = TRUE WHERE email = ${email} AND used = FALSE`;

    // Store new code
    await sql`
      INSERT INTO verification_codes (user_id, email, code, type, expires_at)
      VALUES (${user.id}, ${email}, ${code}, 'login', ${expiresAt.toISOString()})
    `;

    logger.info('Login OTP generated', { userId: user.id, email });

    // Don't set auth cookie yet — wait for OTP verification
    return NextResponse.json({ 
      success: true, 
      requiresVerification: true,
      email: user.email,
    });
  } catch (error: any) {
    logger.error('Login error', { error: error.message });
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
