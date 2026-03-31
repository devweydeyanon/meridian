import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDB } from '@/lib/db';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sql = getDB();

    const userResult = await sql`
      SELECT id, email, first_name, last_name, phone, account_number, account_type,
             balance, savings_balance, card_balance, created_at, last_login
      FROM users WHERE id = ${authUser.id}
    `;

    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult[0];

    const transactions = await sql`
      SELECT id, description, amount, type, category, date
      FROM transactions WHERE user_id = ${authUser.id}
      ORDER BY date DESC LIMIT 20
    `;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        account_number: user.account_number,
        account_type: user.account_type,
        balance: parseFloat(user.balance),
        savings_balance: parseFloat(user.savings_balance),
        card_balance: parseFloat(user.card_balance),
        member_since: user.created_at,
        last_login: user.last_login,
      },
      transactions: transactions.map(t => ({
        id: t.id,
        description: t.description,
        amount: parseFloat(t.amount),
        type: t.type,
        category: t.category,
        date: t.date,
      })),
    });
  } catch (error: any) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
