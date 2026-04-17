import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { account_id, amount, check_number } = await req.json();

    if (!account_id || !amount) return NextResponse.json({ error: 'Account and amount are required.' }, { status: 400 });

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) return NextResponse.json({ error: 'Amount must be greater than zero.' }, { status: 400 });
    if (depositAmount > 25000) return NextResponse.json({ error: 'Mobile deposit limit is $25,000 per check.' }, { status: 400 });

    const sql = getDB();

    const acct = await sql`SELECT id, name, type FROM accounts WHERE id = ${account_id} AND user_id = ${authUser.id} AND status = 'active'`;
    if (acct.length === 0) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    if (acct[0].type === 'cd') return NextResponse.json({ error: 'Cannot deposit to a CD account.' }, { status: 400 });

    // First $225 available immediately, rest after 1 business day (simulated — all available now for demo)
    await sql`UPDATE accounts SET balance = balance + ${depositAmount}, available = available + ${depositAmount} WHERE id = ${account_id}`;

    const desc = check_number ? `Mobile Deposit — Check #${check_number}` : 'Mobile Deposit';
    await sql`
      INSERT INTO transactions (user_id, account_id, description, amount, type, category, status, date)
      VALUES (${authUser.id}, ${account_id}, ${desc}, ${depositAmount}, 'credit', 'Deposit', 'posted', NOW())
    `;

    logger.info('Mobile deposit', { userId: authUser.id, amount: depositAmount, accountId: account_id });

    return NextResponse.json({ success: true, message: `$${depositAmount.toFixed(2)} deposited to ${acct[0].name}.` });
  } catch (error: any) {
    logger.error('Deposit error', { error: error.message });
    return NextResponse.json({ error: 'Deposit failed.' }, { status: 500 });
  }
}
