import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { first_name, last_name, email, phone, topic, account_number, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    const sql = getDB();

    await sql`
      INSERT INTO contact_submissions (first_name, last_name, email, phone, topic, account_number, message)
      VALUES (${first_name || null}, ${last_name || null}, ${email}, ${phone || null}, ${topic || null}, ${account_number || null}, ${message})
    `;

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We\'ll respond within 1 business day.',
    });
  } catch (error: any) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = getDB();
    const submissions = await sql`
      SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 50
    `;
    return NextResponse.json({ submissions });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
