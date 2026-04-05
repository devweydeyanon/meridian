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
      SELECT id, email, first_name, last_name, member_id, 
             created_at, last_login 
      FROM users ORDER BY created_at DESC LIMIT 100
    `;

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
        SELECT vc.id, vc.email, vc.code, vc.type, vc.used, vc.expires_at, vc.created_at,
               u.first_name, u.last_name
        FROM verification_codes vc
        LEFT JOIN users u ON vc.user_id = u.id
        ORDER BY vc.created_at DESC
        LIMIT 20
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
        member_id: u.member_id,
        created_at: u.created_at, last_login: u.last_login,
      })),
      recent_contacts: contacts,
      verification_codes: verificationCodes.map(vc => ({
        id: vc.id, email: vc.email, code: vc.code, type: vc.type,
        used: vc.used, expires_at: vc.expires_at, created_at: vc.created_at,
        user_name: vc.first_name ? `${vc.first_name} ${vc.last_name}` : 'Unknown',
      })),
    });
  } catch (error: any) {
    logger.error('Admin error', { error: error.message });
    return NextResponse.json({ error: 'Admin fetch failed' }, { status: 500 });
  }
}
