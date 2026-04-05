import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDB } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { logger } from '@/lib/logger';

const ADMIN_EMAILS = ['admin@meridianbank.com'];

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Must be in admin list
    if (!ADMIN_EMAILS.includes(email)) {
      logger.warn('Non-admin login attempt on admin portal', { email });
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const sql = getDB();
    const result = await sql`SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = ${email}`;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const user = result[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Sign admin-specific token
    const token = signToken({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name });

    const response = NextResponse.json({ success: true });

    // Separate cookie name — meridian_admin, not meridian_auth
    response.cookies.set('meridian_admin', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 4, // 4 hours only
      path: '/',
    });

    logger.info('Admin logged in', { email });
    return response;
  } catch (error: any) {
    logger.error('Admin login error', { error: error.message });
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
