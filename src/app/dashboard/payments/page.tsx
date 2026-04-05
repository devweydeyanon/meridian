'use client';

import { useState } from 'react';
import { useDashboard, fmt } from '../context';

export default function PaymentsPage() {
  const { accounts, payees, refreshData, loading } = useDashboard();
  const [selectedPayee, setSelectedPayee] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const checkingAccounts = accounts.filter(a => a.type === 'checking' && a.status === 'active');

  // Set defaults
  if (!selectedAccount && checkingAccounts.length > 0) setSelectedAccount(String(checkingAccounts[0].id));

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Loading...</div>;

  const handleSchedule = async () => {
    setError('');
    if (!selectedPayee) { setError('Please select a payee.'); return; }
    if (!amount || parseFloat(amount) <= 0) { setError('Please enter a valid amount.'); return; }

    const acct = checkingAccounts.find(a => a.id === Number(selectedAccount));
    if (acct && parseFloat(amount) > acct.available) {
      setError(`Insufficient funds. Available: ${fmt(acct.available)}`);
      return;
    }

    setProcessing(true);
    setProcessingStep('Verifying payee details...');
    await new Promise(r => setTimeout(r, 1000));

    setProcessingStep('Processing payment...');
    await new Promise(r => setTimeout(r, 1200));

    setProcessingStep('Confirming with Meridian...');
    try {
      const res = await fetch('/api/dashboard/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payee_id: Number(selectedPayee), account_id: Number(selectedAccount), amount: parseFloat(amount), date }),
      });
      const data = await res.json();
      if (res.ok) {
        setProcessingStep('Payment confirmed!');
        await new Promise(r => setTimeout(r, 800));
        setSuccess(data.message);
        setAmount('');
        setSelectedPayee('');
        await refreshData();
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Payment failed.');
      }
    } catch {
      setError('Connection error.');
    }
    setProcessing(false);
    setProcessingStep('');
  };

  const handlePayNow = (payeeId: number, payeeAmount: number) => {
    setSelectedPayee(String(payeeId));
    setAmount(String(payeeAmount));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const payeeName = payees.find(p => p.id === Number(selectedPayee))?.name;

  return (
    <>
      {success && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-5 text-[13px] bg-emerald-50 text-emerald-800 border border-emerald-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[18px] h-[18px] shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-5 text-[13px] bg-red-50 text-red-700 border border-red-200">
          {error}
          <button onClick={() => setError('')} className="ml-auto bg-transparent border-none cursor-pointer opacity-50 hover:opacity-100 p-1">✕</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-7 mb-7 max-md:p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Pay a Bill</h2>

        {processing ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 border-[3px] border-gray-200 border-t-navy-900 rounded-full animate-spin mx-auto mb-5" />
            <div className="text-[15px] font-semibold text-gray-800 mb-1">{processingStep}</div>
            {payeeName && <p className="text-xs text-gray-400">Paying {payeeName} — {fmt(parseFloat(amount || '0'))}</p>}
          </div>
        ) : (
          <div className="max-w-[480px] space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Payee</label>
              <select value={selectedPayee} onChange={e => setSelectedPayee(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none bg-white focus:border-accent-500">
                <option value="">Select a payee</option>
                {payees.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">From Account</label>
              <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none bg-white focus:border-accent-500">
                {checkingAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} — {fmt(acc.available)}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Amount</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Payment Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
              </div>
            </div>
            <button onClick={handleSchedule} className="px-6 py-2.5 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all">Schedule Payment</button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-[15px] font-semibold text-gray-900">Saved Payees</div>
        </div>
        {payees.map(p => (
          <div key={p.id} className="flex items-center px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-navy-900/5 flex items-center justify-center text-navy-700 font-bold text-sm shrink-0 mr-3.5">{p.name.charAt(0)}</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">{p.name}</div>
              <div className="text-xs text-gray-400">{p.category}{p.last_paid ? ` · Last paid ${new Date(p.last_paid).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}</div>
            </div>
            <div className="text-sm font-semibold text-gray-700 mx-4">{fmt(p.last_amount)}</div>
            <button onClick={() => handlePayNow(p.id, p.last_amount)} className="px-3 py-1.5 text-xs font-semibold text-accent-500 bg-white border border-gray-200 rounded-md cursor-pointer font-sans hover:bg-gray-50">Pay Now</button>
          </div>
        ))}
        {payees.length === 0 && <div className="px-5 py-8 text-center text-sm text-gray-400">No saved payees.</div>}
      </div>
    </>
  );
}
