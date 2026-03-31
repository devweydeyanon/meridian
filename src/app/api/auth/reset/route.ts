import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDB } from '@/lib/db';
import { validatePassword, sanitize } from '@/lib/validate';
import { rateLimit } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`reset:${ip}`, 5, 300000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts.' }, { status: 429 });
    }

    const body = await req.json();
    const token = sanitize(body.token || '');
    const password = body.password || '';

    if (!token) return NextResponse.json({ error: 'Reset token is required' }, { status: 400 });

    const pwError = validatePassword(password);
    if (pwError) return NextResponse.json({ error: pwError }, { status: 400 });

    const sql = getDB();

    // Verify token
    const result = await sql`
      SELECT pr.id, pr.user_id, pr.expires_at 
      FROM password_resets pr 
      WHERE pr.token = ${token} AND pr.used = FALSE
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const reset = result[0];
    if (new Date(reset.expires_at) < new Date()) {
      await sql`UPDATE password_resets SET used = TRUE WHERE id = ${reset.id}`;
      return NextResponse.json({ error: 'Reset token has expired. Request a new one.' }, { status: 400 });
    }

    // Update password
    const password_hash = await bcrypt.hash(password, 12);
    await sql`UPDATE users SET password_hash = ${password_hash}, updated_at = NOW() WHERE id = ${reset.user_id}`;

    // Mark token as used
    await sql`UPDATE password_resets SET used = TRUE WHERE id = ${reset.id}`;

    // Invalidate all other tokens for this user
    await sql`UPDATE password_resets SET used = TRUE WHERE user_id = ${reset.user_id}`;

    logger.info('Password reset successful', { userId: reset.user_id });

    return NextResponse.json({ success: true, message: 'Password has been reset. You can now log in.' });
  } catch (error: any) {
    logger.error('Password reset error', { error: error.message });
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
