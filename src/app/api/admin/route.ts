import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sql = getDB();

    const users = await sql`
      SELECT id, email, first_name, last_name, phone, member_id, 
             dob, address, city, state, zip,
             created_at, last_login 
      FROM users ORDER BY created_at DESC LIMIT 100
    `;

    // Get accounts, cards, transactions for all users
    const allAccounts = await sql`SELECT id, user_id, type, name, account_number, balance, available, pending, apy, status FROM accounts ORDER BY user_id, type`;
    const allCards = await sql`SELECT id, user_id, type, name, card_number, credit_limit, balance, available, status, rewards FROM cards ORDER BY user_id, type`;
    const recentTransactions = await sql`SELECT id, user_id, account_id, description, amount, type, category, status, date FROM transactions ORDER BY date DESC LIMIT 200`;

    const contacts = await sql`
      SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 20
    `;

    const chatCount = await sql`SELECT COUNT(*) as count FROM chat_messages`;
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const contactCount = await sql`SELECT COUNT(*) as count FROM contact_submissions`;

    // Get recent verification codes for admin viewing
    let verificationCodes: any[] = [];
    try {
      verificationCodes = await sql`
        SELECT vc.id, vc.email, vc.code, vc.type, vc.details, vc.used, vc.expires_at, vc.created_at,
               u.first_name, u.last_name
        FROM verification_codes vc
        LEFT JOIN users u ON vc.user_id = u.id
        ORDER BY vc.created_at DESC
        LIMIT 30
      `;
    } catch {
      // Table might not exist yet
    }

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
        phone: u.phone, member_id: u.member_id,
        dob: u.dob,
        address: u.address ? `${u.address}, ${u.city}, ${u.state} ${u.zip}` : null,
        created_at: u.created_at, last_login: u.last_login,
        accounts: allAccounts.filter((a: any) => a.user_id === u.id).map((a: any) => ({
          id: a.id, type: a.type, name: a.name, number: a.account_number,
          balance: parseFloat(a.balance), available: parseFloat(a.available), apy: a.apy, status: a.status,
        })),
        cards: allCards.filter((c: any) => c.user_id === u.id).map((c: any) => ({
          id: c.id, type: c.type, name: c.name, number: c.card_number,
          limit: parseFloat(c.credit_limit || 0), balance: parseFloat(c.balance || 0), status: c.status, rewards: c.rewards,
        })),
        recent_transactions: recentTransactions.filter((t: any) => t.user_id === u.id).slice(0, 10).map((t: any) => ({
          id: t.id, description: t.description, amount: parseFloat(t.amount), type: t.type, category: t.category, date: t.date,
        })),
      })),
      recent_contacts: contacts,
      verification_codes: verificationCodes.map(vc => ({
        id: vc.id, email: vc.email, code: vc.code, type: vc.type,
        details: vc.details,
        used: vc.used, expires_at: vc.expires_at, created_at: vc.created_at,
        user_name: vc.first_name ? `${vc.first_name} ${vc.last_name}` : 'Unknown',
      })),
    });
  } catch (error: any) {
    logger.error('Admin error', { error: error.message });
    return NextResponse.json({ error: 'Admin fetch failed' }, { status: 500 });
  }
}
