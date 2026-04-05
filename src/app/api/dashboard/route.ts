import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDB } from '@/lib/db';

// GET /api/dashboard — returns accounts, cards, transactions, payees for logged-in user
export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sql = getDB();

    const accounts = await sql`
      SELECT id, type, name, account_number, balance, available, pending, apy, 
             maturity_date, status, created_at
      FROM accounts WHERE user_id = ${authUser.id} AND status != 'closed'
      ORDER BY type, created_at
    `;

    const cards = await sql`
      SELECT id, linked_account_id, type, name, card_number, credit_limit, balance, 
             available, min_payment, due_date, daily_limit, rewards, status, created_at
      FROM cards WHERE user_id = ${authUser.id}
      ORDER BY type, created_at
    `;

    const transactions = await sql`
      SELECT t.id, t.account_id, t.card_id, t.description, t.amount, t.type, 
             t.category, t.status, t.date,
             a.name as account_name, a.account_number
      FROM transactions t
      LEFT JOIN accounts a ON t.account_id = a.id
      WHERE t.user_id = ${authUser.id}
      ORDER BY t.date DESC
      LIMIT 50
    `;

    const payees = await sql`
      SELECT id, name, category, last_paid, last_amount
      FROM payees WHERE user_id = ${authUser.id}
      ORDER BY name
    `;

    return NextResponse.json({
      accounts: accounts.map(a => ({
        id: a.id, type: a.type, name: a.name, account_number: a.account_number,
        balance: parseFloat(a.balance), available: parseFloat(a.available),
        pending: parseFloat(a.pending), apy: a.apy, maturity_date: a.maturity_date,
        status: a.status,
      })),
      cards: cards.map(c => ({
        id: c.id, linked_account_id: c.linked_account_id, type: c.type, name: c.name,
        card_number: c.card_number, credit_limit: parseFloat(c.credit_limit || 0),
        balance: parseFloat(c.balance || 0), available: parseFloat(c.available || 0),
        min_payment: parseFloat(c.min_payment || 0), due_date: c.due_date,
        daily_limit: parseFloat(c.daily_limit || 0), rewards: c.rewards, status: c.status,
      })),
      transactions: transactions.map(t => ({
        id: t.id, account_id: t.account_id, card_id: t.card_id,
        description: t.description, amount: parseFloat(t.amount),
        type: t.type, category: t.category, status: t.status,
        date: t.date, account_name: t.account_name,
      })),
      payees: payees.map(p => ({
        id: p.id, name: p.name, category: p.category,
        last_paid: p.last_paid, last_amount: parseFloat(p.last_amount || 0),
      })),
    });
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
