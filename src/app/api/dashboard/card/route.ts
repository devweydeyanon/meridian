import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { card_id, action } = await req.json();

    if (!card_id || !action) {
      return NextResponse.json({ error: 'Card ID and action are required.' }, { status: 400 });
    }

    const sql = getDB();

    // Verify card belongs to user
    const card = await sql`SELECT id, name, type, status, balance FROM cards WHERE id = ${card_id} AND user_id = ${authUser.id}`;
    if (card.length === 0) {
      return NextResponse.json({ error: 'Card not found.' }, { status: 404 });
    }

    const c = card[0];

    if (action === 'lock') {
      if (c.status === 'locked') {
        return NextResponse.json({ error: 'Card is already locked.' }, { status: 400 });
      }
      if (c.status === 'cancelled') {
        return NextResponse.json({ error: 'Cannot lock a cancelled card.' }, { status: 400 });
      }
      await sql`UPDATE cards SET status = 'locked' WHERE id = ${card_id}`;
      logger.info('Card locked', { userId: authUser.id, cardId: card_id, cardName: c.name });
      return NextResponse.json({ success: true, message: `${c.name} has been locked.`, newStatus: 'locked' });
    }

    if (action === 'unlock') {
      if (c.status !== 'locked') {
        return NextResponse.json({ error: 'Card is not locked.' }, { status: 400 });
      }
      await sql`UPDATE cards SET status = 'active' WHERE id = ${card_id}`;
      logger.info('Card unlocked', { userId: authUser.id, cardId: card_id, cardName: c.name });
      return NextResponse.json({ success: true, message: `${c.name} has been unlocked.`, newStatus: 'active' });
    }

    if (action === 'cancel') {
      if (c.status === 'cancelled') {
        return NextResponse.json({ error: 'Card is already cancelled.' }, { status: 400 });
      }
      const balance = parseFloat(c.balance);
      if (balance > 0) {
        return NextResponse.json({ error: `Cannot cancel card with outstanding balance of $${balance.toFixed(2)}. Please pay off the balance first.` }, { status: 400 });
      }
      await sql`UPDATE cards SET status = 'cancelled' WHERE id = ${card_id}`;
      logger.info('Card cancelled', { userId: authUser.id, cardId: card_id, cardName: c.name });
      return NextResponse.json({ success: true, message: `${c.name} has been permanently cancelled.`, newStatus: 'cancelled' });
    }

    return NextResponse.json({ error: 'Invalid action. Use lock, unlock, or cancel.' }, { status: 400 });
  } catch (error: any) {
    logger.error('Card action error', { error: error.message });
    return NextResponse.json({ error: 'Action failed.' }, { status: 500 });
  }
}
