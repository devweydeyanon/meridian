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

    const { payee_id, account_id, amount, date } = await req.json();

    if (!payee_id || !account_id || !amount) {
      return NextResponse.json({ error: 'Payee, account, and amount are required.' }, { status: 400 });
    }

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than zero.' }, { status: 400 });
    }

    const sql = getDB();

    // Verify account belongs to user and is checking
    const acct = await sql`SELECT id, name, balance, available, type FROM accounts WHERE id = ${account_id} AND user_id = ${authUser.id} AND status = 'active'`;
    if (acct.length === 0) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    if (acct[0].type !== 'checking') return NextResponse.json({ error: 'Bill pay can only be made from a checking account.' }, { status: 400 });

    const available = parseFloat(acct[0].available);
    if (payAmount > available) {
      return NextResponse.json({ error: `Insufficient funds. Available: $${available.toFixed(2)}` }, { status: 400 });
    }

    // Verify payee belongs to user
    const payee = await sql`SELECT id, name FROM payees WHERE id = ${payee_id} AND user_id = ${authUser.id}`;
    if (payee.length === 0) return NextResponse.json({ error: 'Payee not found.' }, { status: 404 });

    // Deduct from account
    await sql`UPDATE accounts SET balance = balance - ${payAmount}, available = available - ${payAmount} WHERE id = ${account_id}`;

    // Create transaction
    await sql`
      INSERT INTO transactions (user_id, account_id, description, amount, type, category, status, date)
      VALUES (${authUser.id}, ${account_id}, ${`Bill Pay — ${payee[0].name}`}, ${-payAmount}, 'debit', 'Bills', 'posted', ${date || new Date().toISOString()})
    `;

    // Update payee last paid
    await sql`UPDATE payees SET last_paid = NOW(), last_amount = ${payAmount} WHERE id = ${payee_id}`;

    logger.info('Bill payment processed', { userId: authUser.id, payee: payee[0].name, amount: payAmount });

    return NextResponse.json({ success: true, message: `$${payAmount.toFixed(2)} paid to ${payee[0].name}.` });
  } catch (error: any) {
    logger.error('Bill pay error', { error: error.message });
    return NextResponse.json({ error: 'Payment failed.' }, { status: 500 });
  }
}
