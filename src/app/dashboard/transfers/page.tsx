'use client';

import { useState } from 'react';
import { useDashboard, fmt, fmtDate } from '../context';

export default function TransfersPage() {
  const { accounts, transactions, refreshData, loading } = useDashboard();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const transferAccounts = accounts.filter(a => a.type !== 'cd' && a.status === 'active');
  const transferTxns = transactions.filter(t => t.category === 'Transfer');

  // Set defaults once loaded
  if (!from && transferAccounts.length > 0) setFrom(String(transferAccounts[0].id));
  if (!to && transferAccounts.length > 1) setTo(String(transferAccounts[1].id));

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Loading...</div>;

  const fromAccount = accounts.find(a => a.id === Number(from));
  const toAccount = accounts.find(a => a.id === Number(to));

  const submit = () => {
    setError('');
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Please enter a valid amount.'); return; }
    if (from === to) { setError('From and To accounts must be different.'); return; }
    if (fromAccount && amt > fromAccount.available) { setError(`Insufficient funds. Available: ${fmt(fromAccount.available)}`); return; }
    setShowConfirm(true);
  };

  const confirm = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/dashboard/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_account_id: Number(from), to_account_id: Number(to), amount: parseFloat(amount), memo }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowConfirm(false);
        setShowSuccess(true);
        setAmount('');
        setMemo('');
        await refreshData();
        setTimeout(() => setShowSuccess(false), 4000);
      } else {
        setError(data.error || 'Transfer failed.');
        setShowConfirm(false);
      }
    } catch {
      setError('Connection error.');
      setShowConfirm(false);
    }
    setProcessing(false);
  };

  return (
    <>
      {showSuccess && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-5 text-[13px] bg-emerald-50 text-emerald-800 border border-emerald-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[18px] h-[18px] shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
          Transfer submitted successfully.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-5 text-[13px] bg-red-50 text-red-700 border border-red-200">
          {error}
          <button onClick={() => setError('')} className="ml-auto bg-transparent border-none cursor-pointer opacity-50 hover:opacity-100 p-1">✕</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-7 max-md:p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Transfer Between Accounts</h2>
        <div className="max-w-[480px] space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">From Account</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none bg-white focus:border-accent-500">
              {transferAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.account_number}) — {fmt(acc.available)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">To Account</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none bg-white focus:border-accent-500">
              {transferAccounts.filter(a => a.id !== Number(from)).map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.account_number})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Amount</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
            {fromAccount && <p className="text-xs text-gray-400 mt-1">Available: {fmt(fromAccount.available)}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Memo (optional)</label>
            <input type="text" value={memo} onChange={e => setMemo(e.target.value)} placeholder="e.g., Savings contribution" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={submit} className="px-6 py-2.5 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all">Review Transfer</button>
            <button onClick={() => { setAmount(''); setMemo(''); }} className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans hover:bg-gray-50 transition-all">Cancel</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-7">
        <div className="px-5 py-4 border-b border-gray-100"><div className="text-[15px] font-semibold text-gray-900">Recent Transfers</div></div>
        {transferTxns.length === 0 && <div className="px-5 py-8 text-center text-sm text-gray-400">No transfers yet.</div>}
        {transferTxns.map(txn => (
          <div key={txn.id} className="flex items-center px-5 py-3 border-b border-gray-50">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-3 ${txn.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-accent-500'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M7 17l-4-4 4-4M3 13h18M17 7l4 4-4 4M21 11H3" /></svg>
            </div>
            <div className="flex-1"><div className="text-[13px] font-medium text-gray-800">{txn.description}</div><div className="text-[11px] text-gray-400">{fmtDate(txn.date)}</div></div>
            <div className={`text-[13px] font-semibold ${txn.type === 'credit' ? 'text-emerald-700' : 'text-gray-800'}`}>{txn.amount > 0 ? '+' : ''}{fmt(txn.amount)}</div>
          </div>
        ))}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] backdrop-blur-[2px]" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-[420px] w-[90%] shadow-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Confirm Transfer</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2 mb-6">
              <div className="flex justify-between"><span className="text-gray-500">From</span><span className="font-medium">{fromAccount?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">To</span><span className="font-medium">{toAccount?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-base">{fmt(parseFloat(amount))}</span></div>
              {memo && <div className="flex justify-between"><span className="text-gray-500">Memo</span><span>{memo}</span></div>}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans">Cancel</button>
              <button onClick={confirm} disabled={processing} className="px-5 py-2 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 disabled:opacity-60">{processing ? 'Processing...' : 'Confirm'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
