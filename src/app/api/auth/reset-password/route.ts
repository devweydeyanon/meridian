import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDB } from '@/lib/db';
import { validatePassword } from '@/lib/validate';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const pwError = validatePassword(password);
    if (pwError) return NextResponse.json({ error: pwError }, { status: 400 });

    const sql = getDB();
    const users = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const hash = await bcrypt.hash(password, 12);
    await sql`UPDATE users SET password_hash = ${hash}, updated_at = NOW() WHERE id = ${users[0].id}`;

    logger.info('Password reset via OTP', { userId: users[0].id, email });

    return NextResponse.json({ success: true, message: 'Password has been reset.' });
  } catch (error: any) {
    logger.error('Reset password error', { error: error.message });
    return NextResponse.json({ error: 'Reset failed.' }, { status: 500 });
  }
}
