import { NextRequest, NextResponse } from 'next/server';
import { getDB, initializeDatabase, seedTestUsers } from '@/lib/db';
import { logger } from '@/lib/logger';

// GET /api/db/setup — create tables + seed (safe, won't duplicate)
export async function GET() {
  try {
    await initializeDatabase();
    const seeded = await seedTestUsers();

    logger.info('Database initialized successfully');

    return NextResponse.json({
      success: true,
      message: 'Database tables created. Test users seeded.',
      seeded_users: seeded,
    });
  } catch (error: any) {
    logger.error('DB setup error', { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/db/setup — full reset: drop everything, recreate, re-seed
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body.confirm !== 'RESET') {
      return NextResponse.json({ error: 'Send { "confirm": "RESET" } to confirm database reset.' }, { status: 400 });
    }

    const sql = getDB();

    // Drop all tables in dependency order
    await sql`DROP TABLE IF EXISTS verification_codes CASCADE`;
    await sql`DROP TABLE IF EXISTS password_resets CASCADE`;
    await sql`DROP TABLE IF EXISTS chat_messages CASCADE`;
    await sql`DROP TABLE IF EXISTS contact_submissions CASCADE`;
    await sql`DROP TABLE IF EXISTS transactions CASCADE`;
    await sql`DROP TABLE IF EXISTS payees CASCADE`;
    await sql`DROP TABLE IF EXISTS cards CASCADE`;
    await sql`DROP TABLE IF EXISTS accounts CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;

    logger.info('All tables dropped for reset');

    // Recreate
    await initializeDatabase();
    const seeded = await seedTestUsers();

    logger.info('Database reset and re-seeded');

    return NextResponse.json({
      success: true,
      message: 'Database fully reset. All tables recreated. Test users seeded.',
      seeded_users: seeded,
    });
  } catch (error: any) {
    logger.error('DB reset error', { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
