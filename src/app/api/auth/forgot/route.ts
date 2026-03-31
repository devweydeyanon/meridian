import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDB } from '@/lib/db';
import { validateEmail, sanitize } from '@/lib/validate';
import { rateLimit } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`forgot:${ip}`, 3, 300000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Try again in 5 minutes.' }, { status: 429 });
    }

    const body = await req.json();
    const email = sanitize(body.email || '');

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const sql = getDB();
    const user = await sql`SELECT id FROM users WHERE email = ${email}`;

    // Always return success to prevent email enumeration
    if (user.length === 0) {
      logger.info('Password reset for non-existent email', { email });
      return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

    // Invalidate previous tokens
    await sql`UPDATE password_resets SET used = TRUE WHERE user_id = ${user[0].id} AND used = FALSE`;

    // Create new token
    await sql`
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES (${user[0].id}, ${token}, ${expiresAt.toISOString()})
    `;

    logger.info('Password reset token created', { userId: user[0].id, expiresIn: '15 min' });

    // In production, send email with reset link. For demo, return token.
    return NextResponse.json({ 
      success: true, 
      message: 'If an account exists, a reset link has been sent.',
      // Demo only — remove in production:
      _demo_token: token,
    });
  } catch (error: any) {
    logger.error('Forgot password error', { error: error.message });
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
