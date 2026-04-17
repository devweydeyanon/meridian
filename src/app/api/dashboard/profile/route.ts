import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { sanitize } from '@/lib/validate';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const phone = sanitize(body.phone || '');
    const address = sanitize(body.address || '');
    const city = sanitize(body.city || '');
    const state = sanitize(body.state || '');
    const zip = sanitize(body.zip || '');

    const sql = getDB();
    await sql`UPDATE users SET phone = ${phone || null}, address = ${address || null}, city = ${city || null}, state = ${state || null}, zip = ${zip || null}, updated_at = NOW() WHERE id = ${authUser.id}`;

    logger.info('Profile updated', { userId: authUser.id });
    return NextResponse.json({ success: true, message: 'Profile updated.' });
  } catch (error: any) {
    logger.error('Profile update error', { error: error.message });
    return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
  }
}
