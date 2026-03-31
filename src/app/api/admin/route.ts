import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDB } from '@/lib/db';

export async function GET() {
  try {
    // Simple auth check — in production you'd check admin role
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sql = getDB();

    const users = await sql`
      SELECT id, email, first_name, last_name, account_number, account_type, 
             balance, created_at, last_login 
      FROM users ORDER BY created_at DESC
    `;

    const contacts = await sql`
      SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 20
    `;

    const chatCount = await sql`SELECT COUNT(*) as count FROM chat_messages`;
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const contactCount = await sql`SELECT COUNT(*) as count FROM contact_submissions`;

    return NextResponse.json({
      stats: {
        total_users: parseInt(userCount[0].count),
        total_contacts: parseInt(contactCount[0].count),
        total_chat_messages: parseInt(chatCount[0].count),
      },
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: `${u.first_name} ${u.last_name}`,
        account_number: u.account_number,
        account_type: u.account_type,
        balance: parseFloat(u.balance),
        created_at: u.created_at,
        last_login: u.last_login,
      })),
      recent_contacts: contacts,
    });
  } catch (error: any) {
    console.error('Admin error:', error);
    return NextResponse.json({ error: 'Admin fetch failed' }, { status: 500 });
  }
}
