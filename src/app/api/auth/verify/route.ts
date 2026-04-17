import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { logger } from '@/lib/logger';

// Generate a 6-digit OTP and store it
export async function POST(request: Request) {
  try {
    const { email, action, details } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const sql = getDB();

    // Check user exists
    const users = await sql`SELECT id, email, first_name FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate previous codes
    await sql`UPDATE verification_codes SET used = TRUE WHERE email = ${email} AND used = FALSE`;

    // Store new code
    await sql`
      INSERT INTO verification_codes (user_id, email, code, type, details, expires_at)
      VALUES (${users[0].id}, ${email}, ${code}, ${action || 'login'}, ${details || null}, ${expiresAt.toISOString()})
    `;

    logger.info('Verification code generated', { email, type: action || 'login' });

    // In production, this would send an email/SMS
    // For demo, the code is viewable in the admin panel
    return NextResponse.json({ 
      success: true, 
      message: 'Verification code sent to your email.',
      // Only include code in development for testing
      ...(process.env.NODE_ENV === 'development' ? { code } : {}),
    });
  } catch (error: any) {
    logger.error('OTP generation error', { error: error.message });
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}

// Verify a code
export async function PUT(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const sql = getDB();

    // Find valid code
    const codes = await sql`
      SELECT vc.*, u.id as user_id, u.first_name, u.last_name, u.email as user_email
      FROM verification_codes vc
      JOIN users u ON vc.user_id = u.id
      WHERE vc.email = ${email} 
        AND vc.code = ${code} 
        AND vc.used = FALSE 
        AND vc.expires_at > NOW()
      ORDER BY vc.created_at DESC
      LIMIT 1
    `;

    if (codes.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired code. Please try again.' }, { status: 400 });
    }

    // Mark as used
    await sql`UPDATE verification_codes SET used = TRUE WHERE id = ${codes[0].id}`;

    // Create session
    const token = signToken({
      id: codes[0].user_id,
      email: codes[0].user_email,
      first_name: codes[0].first_name,
      last_name: codes[0].last_name,
    });

    const response = NextResponse.json({ 
      success: true,
      user: { id: codes[0].user_id, email: codes[0].user_email, first_name: codes[0].first_name, last_name: codes[0].last_name },
    });

    response.cookies.set('meridian_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    logger.info('Verification successful', { email });
    return response;
  } catch (error: any) {
    logger.error('OTP verification error', { error: error.message });
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
