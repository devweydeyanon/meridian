import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { from_account_id, recipient_name, recipient_email, amount, memo } = await req.json();

    if (!from_account_id || !recipient_name || !recipient_email || !amount) {
      return NextResponse.json({ error: 'Recipient name, email, and amount are required.' }, { status: 400 });
    }

    const sendAmount = parseFloat(amount);
    if (isNaN(sendAmount) || sendAmount <= 0) return NextResponse.json({ error: 'Amount must be greater than zero.' }, { status: 400 });
    if (sendAmount > 5000) return NextResponse.json({ error: 'Zelle transfers are limited to $5,000 per transaction.' }, { status: 400 });

    const sql = getDB();

    const acct = await sql`SELECT id, name, available, type FROM accounts WHERE id = ${from_account_id} AND user_id = ${authUser.id} AND status = 'active'`;
    if (acct.length === 0) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    if (acct[0].type === 'cd') return NextResponse.json({ error: 'Cannot send Zelle from a CD account.' }, { status: 400 });

    const available = parseFloat(acct[0].available);
    if (sendAmount > available) return NextResponse.json({ error: `Insufficient funds. Available: $${available.toFixed(2)}` }, { status: 400 });

    await sql`UPDATE accounts SET balance = balance - ${sendAmount}, available = available - ${sendAmount} WHERE id = ${from_account_id}`;

    const desc = memo ? `Zelle to ${recipient_name} — ${memo}` : `Zelle to ${recipient_name}`;
    await sql`
      INSERT INTO transactions (user_id, account_id, description, amount, type, category, status, date)
      VALUES (${authUser.id}, ${from_account_id}, ${desc}, ${-sendAmount}, 'debit', 'Zelle', 'posted', NOW())
    `;

    logger.info('Zelle payment sent', { userId: authUser.id, recipient: recipient_name, amount: sendAmount });

    return NextResponse.json({ success: true, message: `$${sendAmount.toFixed(2)} sent to ${recipient_name} via Zelle.` });
  } catch (error: any) {
    logger.error('Zelle error', { error: error.message });
    return NextResponse.json({ error: 'Payment failed.' }, { status: 500 });
  }
}
