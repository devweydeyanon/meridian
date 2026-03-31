import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDB, seedDemoData } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, first_name, last_name, phone } = await req.json();

    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const sql = getDB();

    // Check if user exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Generate account number
    const account_number = 'MRD' + Math.random().toString().slice(2, 12);

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, account_number)
      VALUES (${email}, ${password_hash}, ${first_name}, ${last_name}, ${phone || null}, ${account_number})
      RETURNING id, email, first_name, last_name, account_number
    `;

    const user = result[0];

    // Seed demo transactions
    await seedDemoData(user.id);

    // Sign token
    const token = signToken({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        account_number: user.account_number,
      },
    });

    response.cookies.set('meridian_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
