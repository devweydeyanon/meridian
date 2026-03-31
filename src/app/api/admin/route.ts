import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { logger } from '@/lib/logger';

// Admin emails — in production, use a roles table
const ADMIN_EMAILS = ['admin@meridianbank.com'];

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Role check — only admins or first registered user
    const sql = getDB();
    const firstUser = await sql`SELECT id FROM users ORDER BY id ASC LIMIT 1`;
    const isAdmin = ADMIN_EMAILS.includes(user.email) || (firstUser.length > 0 && firstUser[0].id === user.id);
    
    if (!isAdmin) {
      logger.warn('Unauthorized admin access attempt', { userId: user.id, email: user.email });
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const users = await sql`
      SELECT id, email, first_name, last_name, account_number, account_type, 
             balance, created_at, last_login 
      FROM users ORDER BY created_at DESC LIMIT 100
    `;

    const contacts = await sql`
      SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 20
    `;

    const chatCount = await sql`SELECT COUNT(*) as count FROM chat_messages`;
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const contactCount = await sql`SELECT COUNT(*) as count FROM contact_submissions`;

    logger.info('Admin panel accessed', { userId: user.id });

    return NextResponse.json({
      stats: {
        total_users: parseInt(userCount[0].count),
        total_contacts: parseInt(contactCount[0].count),
        total_chat_messages: parseInt(chatCount[0].count),
      },
      users: users.map(u => ({
        id: u.id, email: u.email,
        name: `${u.first_name} ${u.last_name}`,
        account_number: u.account_number, account_type: u.account_type,
        balance: parseFloat(u.balance), created_at: u.created_at, last_login: u.last_login,
      })),
      recent_contacts: contacts,
    });
  } catch (error: any) {
    logger.error('Admin error', { error: error.message });
    return NextResponse.json({ error: 'Admin fetch failed' }, { status: 500 });
  }
}
