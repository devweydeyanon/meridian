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

    const { from_account_id, to_account_id, amount, memo } = await req.json();

    if (!from_account_id || !to_account_id || !amount) {
      return NextResponse.json({ error: 'From account, to account, and amount are required.' }, { status: 400 });
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than zero.' }, { status: 400 });
    }

    if (from_account_id === to_account_id) {
      return NextResponse.json({ error: 'Cannot transfer to the same account.' }, { status: 400 });
    }

    const sql = getDB();

    const fromAcct = await sql`SELECT id, name, balance, available, type FROM accounts WHERE id = ${from_account_id} AND user_id = ${authUser.id} AND status = 'active'`;
    const toAcct = await sql`SELECT id, name, type FROM accounts WHERE id = ${to_account_id} AND user_id = ${authUser.id} AND status = 'active'`;

    if (fromAcct.length === 0) return NextResponse.json({ error: 'Source account not found.' }, { status: 404 });
    if (toAcct.length === 0) return NextResponse.json({ error: 'Destination account not found.' }, { status: 404 });
    if (fromAcct[0].type === 'cd') return NextResponse.json({ error: 'Cannot transfer from a CD account.' }, { status: 400 });

    const available = parseFloat(fromAcct[0].available);
    if (transferAmount > available) {
      return NextResponse.json({ error: `Insufficient funds. Available: $${available.toFixed(2)}` }, { status: 400 });
    }

    await sql`UPDATE accounts SET balance = balance - ${transferAmount}, available = available - ${transferAmount} WHERE id = ${from_account_id}`;
    await sql`UPDATE accounts SET balance = balance + ${transferAmount}, available = available + ${transferAmount} WHERE id = ${to_account_id}`;

    const desc = memo ? `Transfer: ${memo}` : `Transfer to ${toAcct[0].name}`;
    const descCredit = memo ? `Transfer: ${memo}` : `Transfer from ${fromAcct[0].name}`;

    await sql`INSERT INTO transactions (user_id, account_id, description, amount, type, category, status, date) VALUES (${authUser.id}, ${from_account_id}, ${desc}, ${-transferAmount}, 'debit', 'Transfer', 'posted', NOW())`;
    await sql`INSERT INTO transactions (user_id, account_id, description, amount, type, category, status, date) VALUES (${authUser.id}, ${to_account_id}, ${descCredit}, ${transferAmount}, 'credit', 'Transfer', 'posted', NOW())`;

    logger.info('Transfer completed', { userId: authUser.id, from: from_account_id, to: to_account_id, amount: transferAmount });

    return NextResponse.json({ success: true, message: `$${transferAmount.toFixed(2)} transferred successfully.` });
  } catch (error: any) {
    logger.error('Transfer error', { error: error.message });
    return NextResponse.json({ error: 'Transfer failed.' }, { status: 500 });
  }
}
