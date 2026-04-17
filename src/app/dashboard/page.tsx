'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDashboard, fmt, groupByDate } from './context';
import OtpModal from '@/components/OtpModal';

export default function DashboardOverview() {
  const { user, balanceVisible, accounts, cards, transactions, refreshData, loading } = useDashboard();
  const [showAlert, setShowAlert] = useState(true);
  const bal = (n: number) => balanceVisible ? fmt(n) : '••••••';

  // Quick transfer state
  const transferAccounts = accounts.filter(a => a.type !== 'cd' && a.status === 'active');
  const [quickFrom, setQuickFrom] = useState('');
  const [quickTo, setQuickTo] = useState('');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickShowOtp, setQuickShowOtp] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState('');
  const [quickError, setQuickError] = useState('');

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Loading accounts...</div>;

  const totalDeposits = accounts.filter(a => a.type !== 'cd').reduce((s, a) => s + a.balance, 0);
  const totalCD = accounts.filter(a => a.type === 'cd').reduce((s, a) => s + a.balance, 0);
  const totalCredit = cards.filter(c => c.type === 'credit').reduce((s, c) => s + c.balance, 0);
  const netWorth = totalDeposits + totalCD - totalCredit;
  const grouped = groupByDate(transactions.slice(0, 8));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <div className="mb-5">
        <div className="text-[22px] max-md:text-[18px] font-semibold text-gray-900">{greeting}, {user.first_name}</div>
        <div className="text-sm text-gray-400 mt-0.5">Here&apos;s your financial summary.</div>
      </div>

      {showAlert && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-5 text-[13px] bg-blue-50 text-navy-700 border border-accent-500/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px] shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <span>Your account security is up to date. Two-factor authentication is enabled.</span>
          <button onClick={() => setShowAlert(false)} className="ml-auto bg-transparent border-none cursor-pointer opacity-50 hover:opacity-100 p-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      )}

      <div className="flex gap-2.5 mb-6 flex-wrap">
        <Link href="/dashboard/transfers" className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-navy-900 rounded-lg no-underline hover:bg-navy-800 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M7 17l-4-4 4-4M3 13h18M17 7l4 4-4 4M21 11H3" /></svg>
          Transfer Money
        </Link>
        <Link href="/dashboard/payments" className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg no-underline hover:bg-gray-50 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
          Pay Bills
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6 max-lg:grid-cols-2 max-md:grid-cols-1">
        {[
          { label: 'Total Balance', value: bal(totalDeposits), sub: 'Checking & Savings' },
          { label: 'Investments & CDs', value: bal(totalCD), sub: `${accounts.filter(a => a.type === 'cd').length} Certificate(s)` },
          { label: 'Credit Card Debt', value: bal(totalCredit), sub: `${cards.filter(c => c.type === 'credit').length} active card(s)`, negative: true },
          { label: 'Net Worth', value: bal(netWorth), sub: 'Assets minus liabilities', positive: netWorth >= 0 },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{item.label}</div>
            <div className={`text-[22px] font-bold mt-1 ${item.negative ? 'text-red-600' : item.positive ? 'text-emerald-700' : 'text-gray-900'}`}>{item.value}</div>
            <div className="text-xs text-gray-400 mt-1">{item.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">
        {accounts.map(acc => (
          <Link key={acc.id} href="/dashboard/accounts" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-accent-500/30 transition-all no-underline cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{acc.type === 'cd' ? 'Certificate of Deposit' : acc.type}</div>
                <div className="text-[15px] font-semibold text-gray-800 mt-0.5">{acc.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{acc.account_number}</div>
              </div>
              <div className={`w-2 h-2 rounded-full ${acc.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            </div>
            <div className="text-[24px] max-md:text-[20px] font-bold text-gray-900 mt-3">{bal(acc.balance)}</div>
            <div className="text-[11px] text-gray-400 mb-2">Current balance</div>
            <div className="flex gap-4 text-xs text-gray-400">
              {acc.type !== 'cd' && <div>Available: <span className="font-semibold text-gray-600">{bal(acc.available)}</span></div>}
              {acc.apy && <div>APY: <span className="font-semibold text-gray-600">{acc.apy}</span></div>}
              {acc.pending > 0 && <div>Pending: <span className="font-semibold text-gray-600">{fmt(acc.pending)}</span></div>}
              {acc.maturity_date && <div>Matures: <span className="font-semibold text-gray-600">{new Date(acc.maturity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Transfer */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[15px] font-semibold text-gray-900">Quick Transfer</div>
          <Link href="/dashboard/transfers" className="text-xs font-semibold text-accent-500 no-underline">Full transfer page</Link>
        </div>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">From</label>
            <select value={quickFrom} onChange={e => setQuickFrom(e.target.value)} className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md outline-none bg-white">
              {transferAccounts.map(a => <option key={a.id} value={a.id}>{a.name.replace('Meridian ', '')} — {fmt(a.available)}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">To</label>
            <select value={quickTo} onChange={e => setQuickTo(e.target.value)} className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md outline-none bg-white">
              {transferAccounts.filter(a => a.id !== Number(quickFrom)).map(a => <option key={a.id} value={a.id}>{a.name.replace('Meridian ', '')}</option>)}
            </select>
          </div>
          <div className="w-[120px]">
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Amount</label>
            <input type="number" value={quickAmount} onChange={e => setQuickAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01" className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md outline-none" />
          </div>
          <button onClick={() => {
            if (!quickAmount || parseFloat(quickAmount) <= 0) return;
            setQuickShowOtp(true);
          }} className="px-4 py-2 text-xs font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 shrink-0">Transfer</button>
        </div>
        {quickSuccess && <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 rounded-md px-3 py-2">{quickSuccess}</div>}
        {quickError && <div className="mt-3 text-xs text-red-700 bg-red-50 rounded-md px-3 py-2">{quickError}</div>}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="text-[15px] font-semibold text-gray-900">Recent Activity</div>
          <Link href="/dashboard/accounts" className="text-xs font-semibold text-accent-500 no-underline">View All</Link>
        </div>
        {Object.keys(grouped).length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-gray-400">No transactions yet.</div>
        )}
        {Object.entries(grouped).map(([date, txns]) => (
          <div key={date}>
            <div className="px-5 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">{date}</div>
            {txns.map(txn => (
              <div key={txn.id} className="flex items-center px-5 py-3 border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-3 ${txn.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    {txn.type === 'credit' ? <path d="M12 5v14M19 12l-7 7-7-7" /> : <path d="M12 19V5M5 12l7-7 7 7" />}
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-gray-800 truncate">{txn.description}</div>
                  <div className="text-[11px] text-gray-400">{txn.category} · {txn.account_name || ''}</div>
                </div>
                <div className={`text-[13px] font-semibold ml-3 ${txn.type === 'credit' ? 'text-emerald-700' : 'text-gray-800'}`}>
                  {txn.amount > 0 ? '+' : ''}{fmt(txn.amount)}
                </div>
                {txn.status === 'pending' && <span className="ml-2 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      {quickShowOtp && (
        <OtpModal
          email={user.email}
          action="internal_transfer"
          actionLabel="confirm quick transfer"
          details={`Quick transfer ${fmt(parseFloat(quickAmount || '0'))} from ${accounts.find(a => a.id === Number(quickFrom || transferAccounts[0]?.id))?.name || ''} to ${accounts.find(a => a.id === Number(quickTo || transferAccounts[1]?.id))?.name || ''}`}
          onVerified={async () => {
            setQuickShowOtp(false);
            setQuickError('');
            const fromId = Number(quickFrom || transferAccounts[0]?.id);
            const toId = Number(quickTo || transferAccounts[1]?.id);
            try {
              const res = await fetch('/api/dashboard/transfer', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from_account_id: fromId, to_account_id: toId, amount: parseFloat(quickAmount) }),
              });
              const data = await res.json();
              if (res.ok) { setQuickSuccess('Transfer complete!'); setQuickAmount(''); await refreshData(); setTimeout(() => setQuickSuccess(''), 4000); }
              else { setQuickError(data.error || 'Transfer failed.'); }
            } catch { setQuickError('Connection error.'); }
          }}
          onCancel={() => setQuickShowOtp(false)}
        />
      )}
    </>
  );
}
