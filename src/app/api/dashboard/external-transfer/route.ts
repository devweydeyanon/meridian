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

    const { from_account_id, recipient_name, routing_number, account_number, amount, memo } = await req.json();

    if (!from_account_id || !recipient_name || !routing_number || !account_number || !amount) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than zero.' }, { status: 400 });
    }

    // Validate routing number format (9 digits)
    if (!/^\d{9}$/.test(routing_number)) {
      return NextResponse.json({ error: 'Routing number must be 9 digits.' }, { status: 400 });
    }

    // Validate account number (4-17 digits)
    if (!/^\d{4,17}$/.test(account_number)) {
      return NextResponse.json({ error: 'Account number must be 4-17 digits.' }, { status: 400 });
    }

    const sql = getDB();

    // Verify source account belongs to user
    const acct = await sql`SELECT id, name, balance, available, type FROM accounts WHERE id = ${from_account_id} AND user_id = ${authUser.id} AND status = 'active'`;
    if (acct.length === 0) return NextResponse.json({ error: 'Source account not found.' }, { status: 404 });
    if (acct[0].type === 'cd') return NextResponse.json({ error: 'Cannot transfer from a CD account.' }, { status: 400 });

    const available = parseFloat(acct[0].available);
    if (transferAmount > available) {
      return NextResponse.json({ error: `Insufficient funds. Available: $${available.toFixed(2)}` }, { status: 400 });
    }

    // Deduct from source account
    await sql`UPDATE accounts SET balance = balance - ${transferAmount}, available = available - ${transferAmount} WHERE id = ${from_account_id}`;

    // Create transaction record
    const description = memo 
      ? `External Transfer to ${recipient_name} — ${memo}` 
      : `External Transfer to ${recipient_name}`;

    await sql`
      INSERT INTO transactions (user_id, account_id, description, amount, type, category, status, date)
      VALUES (${authUser.id}, ${from_account_id}, ${description}, ${-transferAmount}, 'debit', 'External Transfer', 'posted', NOW())
    `;

    logger.info('External transfer completed', { 
      userId: authUser.id, 
      from: from_account_id, 
      recipient: recipient_name,
      routing: routing_number.slice(0, 4) + '*****',
      amount: transferAmount 
    });

    return NextResponse.json({ 
      success: true, 
      message: `$${transferAmount.toFixed(2)} sent to ${recipient_name}. Funds will arrive in 1-3 business days.` 
    });
  } catch (error: any) {
    logger.error('External transfer error', { error: error.message });
    return NextResponse.json({ error: 'Transfer failed.' }, { status: 500 });
  }
}
