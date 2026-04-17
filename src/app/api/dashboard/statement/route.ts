import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get('month') || '0');
    const year = parseInt(searchParams.get('year') || '0');
    const accountId = searchParams.get('account') || 'all';

    if (!month || !year) {
      return NextResponse.json({ error: 'Month and year are required.' }, { status: 400 });
    }

    const sql = getDB();

    // Get user info
    const users = await sql`SELECT first_name, last_name, email, member_id, address, city, state, zip FROM users WHERE id = ${authUser.id}`;
    if (users.length === 0) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    const user = users[0];

    // Get accounts
    const accounts = accountId === 'all'
      ? await sql`SELECT id, type, name, account_number, balance, available, apy FROM accounts WHERE user_id = ${authUser.id} AND status = 'active'`
      : await sql`SELECT id, type, name, account_number, balance, available, apy FROM accounts WHERE id = ${parseInt(accountId)} AND user_id = ${authUser.id}`;

    // Get transactions for the month
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

    const accountIds = accounts.map((a: any) => a.id);
    let transactions: any[] = [];
    if (accountIds.length > 0) {
      transactions = await sql`
        SELECT t.id, t.account_id, t.description, t.amount, t.type, t.category, t.status, t.date,
               a.name as account_name
        FROM transactions t
        LEFT JOIN accounts a ON t.account_id = a.id
        WHERE t.user_id = ${authUser.id} AND t.date >= ${startDate}::timestamp AND t.date < ${endDate}::timestamp
        ORDER BY t.date DESC
      `;
    }

    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
    const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // Build PDF-like HTML that we convert to a downloadable format
    // Using HTML-to-PDF approach with clean formatting
    const totalDeposits = transactions.filter(t => parseFloat(t.amount) > 0).reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalWithdrawals = transactions.filter(t => parseFloat(t.amount) < 0).reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0);

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #1a1a2e; line-height: 1.4; padding: 40px; max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: start; border-bottom: 3px solid #0a1628; padding-bottom: 16px; margin-bottom: 24px; }
  .logo { font-size: 22px; font-weight: 800; color: #0a1628; letter-spacing: -0.5px; }
  .logo-sub { font-size: 8px; color: #888; text-transform: uppercase; letter-spacing: 2px; }
  .stmt-info { text-align: right; font-size: 10px; color: #666; }
  .stmt-title { font-size: 16px; font-weight: 700; color: #0a1628; margin-bottom: 2px; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0a1628; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 8px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; font-size: 10px; }
  .info-label { color: #888; }
  .info-value { color: #333; font-weight: 500; }
  .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
  .summary-box { background: #f5f5f5; padding: 10px; border-radius: 4px; }
  .summary-label { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
  .summary-value { font-size: 16px; font-weight: 700; color: #0a1628; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 10px; }
  th { text-align: left; padding: 6px 8px; background: #f5f5f5; font-weight: 600; color: #555; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #ddd; }
  td { padding: 5px 8px; border-bottom: 1px solid #eee; }
  .amount { text-align: right; font-weight: 600; font-family: 'SF Mono', monospace; }
  .credit { color: #0f7b3f; }
  .debit { color: #333; }
  .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 8px; color: #999; text-align: center; line-height: 1.6; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Meridian Bank</div>
      <div class="logo-sub">Member FDIC · Equal Housing Lender</div>
    </div>
    <div class="stmt-info">
      <div class="stmt-title">Account Statement</div>
      <div>${monthName}</div>
      <div>Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Account holder</div>
    <div class="info-grid">
      <div><span class="info-label">Name:</span> <span class="info-value">${user.first_name} ${user.last_name}</span></div>
      <div><span class="info-label">Member ID:</span> <span class="info-value">${user.member_id || '—'}</span></div>
      <div><span class="info-label">Email:</span> <span class="info-value">${user.email}</span></div>
      <div><span class="info-label">Address:</span> <span class="info-value">${user.address ? `${user.address}, ${user.city}, ${user.state} ${user.zip}` : '—'}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Account summary</div>
    <div class="summary-grid">
      ${accounts.map((a: any) => `
        <div class="summary-box">
          <div class="summary-label">${a.name}</div>
          <div class="summary-value">${fmt(parseFloat(a.balance))}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Period summary</div>
    <div class="info-grid" style="margin-bottom: 12px;">
      <div><span class="info-label">Total deposits:</span> <span class="info-value" style="color: #0f7b3f;">${fmt(totalDeposits)}</span></div>
      <div><span class="info-label">Total withdrawals:</span> <span class="info-value">${fmt(totalWithdrawals)}</span></div>
      <div><span class="info-label">Total transactions:</span> <span class="info-value">${transactions.length}</span></div>
      <div><span class="info-label">Statement period:</span> <span class="info-value">${monthName}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Transaction history</div>
    ${transactions.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Account</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${transactions.map((t: any) => `
          <tr>
            <td>${new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td>${t.account_name || '—'}</td>
            <td class="amount ${parseFloat(t.amount) > 0 ? 'credit' : 'debit'}">${parseFloat(t.amount) > 0 ? '+' : ''}${fmt(parseFloat(t.amount))}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ` : '<p style="color: #999; text-align: center; padding: 20px;">No transactions for this period.</p>'}
  </div>

  <div class="footer">
    Meridian Bank, N.A. · Member FDIC · Equal Housing Lender · NMLS #000000<br>
    This statement is for informational purposes. Please retain for your records.<br>
    Questions? Call 1-800-MERIDIAN or visit meridianplc.com
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="Meridian_Statement_${monthName.replace(' ', '_')}.html"`,
      },
    });
  } catch (error: any) {
    console.error('Statement error:', error);
    return NextResponse.json({ error: 'Failed to generate statement.' }, { status: 500 });
  }
}
