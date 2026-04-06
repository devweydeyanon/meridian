import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDB } from '@/lib/db';
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
    const dob = body.dob || null;
    const ssn = sanitize(body.ssn || '');
    const address = sanitize(body.address || '');
    const city = sanitize(body.city || '');
    const state = sanitize(body.state || '');
    const zip = sanitize(body.zip || '');
    const employment = sanitize(body.employment || '');
    const employer = sanitize(body.employer || '');
    const income = sanitize(body.income || '');
    const product = sanitize(body.product || 'checking');
    const deposit = parseFloat(body.deposit) || 0;

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
    const memberId = 'MRB-' + Math.random().toString().slice(2, 9);

    // Store only last 4 of SSN
    const ssnLast4 = ssn ? ssn.replace(/\D/g, '').slice(-4) : null;

    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, dob, ssn_last4, address, city, state, zip, employment, employer, income, member_id)
      VALUES (${email}, ${password_hash}, ${first_name}, ${last_name}, ${phone || null}, ${dob || null}, ${ssnLast4}, ${address || null}, ${city || null}, ${state || null}, ${zip || null}, ${employment || null}, ${employer || null}, ${income || null}, ${memberId})
      RETURNING id, email, first_name, last_name
    `;

    const user = result[0];

    // Create account based on selected product
    const chkNum = '****' + Math.random().toString().slice(2, 6);
    const accountName = product === 'savings' ? 'Meridian Premier Savings' 
      : product === 'business' ? 'Meridian Business Checking'
      : 'Meridian Total Checking';
    const accountType = product === 'savings' ? 'savings' : 'checking';
    const apy = accountType === 'savings' ? '4.25%' : null;

    await sql`
      INSERT INTO accounts (user_id, type, name, account_number, balance, available, apy, status)
      VALUES (${user.id}, ${accountType}, ${accountName}, ${chkNum}, ${deposit}, ${deposit}, ${apy}, 'active')
    `;

    // If deposit > 0, create a transaction record
    if (deposit > 0) {
      const acct = await sql`SELECT id FROM accounts WHERE user_id = ${user.id} LIMIT 1`;
      if (acct.length > 0) {
        await sql`
          INSERT INTO transactions (user_id, account_id, description, amount, type, category, status, date)
          VALUES (${user.id}, ${acct[0].id}, 'Initial Deposit — Account Opening', ${deposit}, 'credit', 'Deposit', 'posted', NOW())
        `;
      }
    }

    const token = signToken({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name });

    logger.info('New user registered', { userId: user.id, email, product, deposit });

    const response = NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, member_id: memberId } 
    });
    response.cookies.set('meridian_auth', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
    return response;
  } catch (error: any) {
    logger.error('Register error', { error: error.message });
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
