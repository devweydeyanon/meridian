'use client';

import { useState } from 'react';
import { useDashboard, fmt, fmtDate } from '../context';
import OtpModal from '@/components/OtpModal';

export default function TransfersPage() {
  const { user, accounts, transactions, refreshData, loading } = useDashboard();
  const [tab, setTab] = useState<'internal' | 'external'>('internal');

  // Internal transfer state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // External transfer state
  const [extFrom, setExtFrom] = useState('');
  const [extRecipient, setExtRecipient] = useState('');
  const [extRouting, setExtRouting] = useState('');
  const [extAccount, setExtAccount] = useState('');
  const [extAmount, setExtAmount] = useState('');
  const [extMemo, setExtMemo] = useState('');
  const [extShowOtp, setExtShowOtp] = useState(false);

  const transferAccounts = accounts.filter(a => a.type !== 'cd' && a.status === 'active');
  const transferTxns = transactions.filter(t => t.category === 'Transfer');
  const externalTxns = transactions.filter(t => t.category === 'External Transfer');

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Loading...</div>;

  const effectiveFrom = from || (transferAccounts.length > 0 ? String(transferAccounts[0].id) : '');
  const effectiveTo = to || (transferAccounts.length > 1 ? String(transferAccounts[1].id) : '');
  const effectiveExtFrom = extFrom || (transferAccounts.length > 0 ? String(transferAccounts[0].id) : '');
  const fromAccount = accounts.find(a => a.id === Number(effectiveFrom));
  const toAccount = accounts.find(a => a.id === Number(effectiveTo));
  const extFromAccount = accounts.find(a => a.id === Number(effectiveExtFrom));

  // === INTERNAL TRANSFER ===
  const submitInternal = () => {
    setError('');
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Please enter a valid amount.'); return; }
    if (effectiveFrom === effectiveTo) { setError('From and To accounts must be different.'); return; }
    if (fromAccount && amt > fromAccount.available) { setError(`Insufficient funds. Available: ${fmt(fromAccount.available)}`); return; }
    setShowConfirm(true);
  };

  const handleInternalConfirm = () => { setShowConfirm(false); setShowOtp(true); };

  const handleInternalOtp = async () => {
    setShowOtp(false); setShowConfirm(true); setProcessing(true);
    setProcessingStep('Verifying account details...');
    await new Promise(r => setTimeout(r, 1000));
    setProcessingStep('Processing transfer...');
    await new Promise(r => setTimeout(r, 1200));
    setProcessingStep('Confirming with Meridian servers...');
    try {
      const res = await fetch('/api/dashboard/transfer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_account_id: Number(effectiveFrom), to_account_id: Number(effectiveTo), amount: parseFloat(amount), memo }),
      });
      const data = await res.json();
      if (res.ok) {
        setProcessingStep('Transfer complete!');
        await new Promise(r => setTimeout(r, 800));
        setShowConfirm(false); setShowSuccess(data.message || 'Transfer submitted successfully.');
        setAmount(''); setMemo(''); await refreshData();
        setTimeout(() => setShowSuccess(''), 5000);
      } else { setError(data.error || 'Transfer failed.'); setShowConfirm(false); }
    } catch { setError('Connection error.'); setShowConfirm(false); }
    setProcessing(false); setProcessingStep('');
  };

  // === EXTERNAL TRANSFER ===
  const submitExternal = () => {
    setError('');
    if (!extRecipient.trim()) { setError('Recipient name is required.'); return; }
    if (!/^\d{9}$/.test(extRouting)) { setError('Routing number must be 9 digits.'); return; }
    if (!/^\d{4,17}$/.test(extAccount)) { setError('Account number must be 4-17 digits.'); return; }
    const amt = parseFloat(extAmount);
    if (!amt || amt <= 0) { setError('Please enter a valid amount.'); return; }
    if (extFromAccount && amt > extFromAccount.available) { setError(`Insufficient funds. Available: ${fmt(extFromAccount.available)}`); return; }
    setExtShowOtp(true);
  };

  const handleExternalOtp = async () => {
    setExtShowOtp(false); setProcessing(true);
    setProcessingStep('Verifying recipient bank...');
    await new Promise(r => setTimeout(r, 1500));
    setProcessingStep('Validating account details...');
    await new Promise(r => setTimeout(r, 1200));
    setProcessingStep('Processing external transfer...');
    await new Promise(r => setTimeout(r, 1500));
    setProcessingStep('Submitting to ACH network...');
    try {
      const res = await fetch('/api/dashboard/external-transfer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_account_id: Number(effectiveExtFrom), recipient_name: extRecipient.trim(), routing_number: extRouting, account_number: extAccount, amount: parseFloat(extAmount), memo: extMemo }),
      });
      const data = await res.json();
      if (res.ok) {
        setProcessingStep('Transfer submitted!');
        await new Promise(r => setTimeout(r, 800));
        setShowSuccess(data.message || 'External transfer submitted.');
        setExtRecipient(''); setExtRouting(''); setExtAccount(''); setExtAmount(''); setExtMemo('');
        await refreshData();
        setTimeout(() => setShowSuccess(''), 6000);
      } else { setError(data.error || 'Transfer failed.'); }
    } catch { setError('Connection error.'); }
    setProcessing(false); setProcessingStep('');
  };

  return (
    <>
      {showSuccess && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-5 text-[13px] bg-emerald-50 text-emerald-800 border border-emerald-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[18px] h-[18px] shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
          {showSuccess}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-5 text-[13px] bg-red-50 text-red-700 border border-red-200">
          {error}
          <button onClick={() => setError('')} className="ml-auto bg-transparent border-none cursor-pointer opacity-50 hover:opacity-100 p-1">✕</button>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg border border-gray-200 p-1 w-fit max-md:w-full">
        <button onClick={() => { setTab('internal'); setError(''); }} className={`px-5 py-2.5 text-sm font-semibold rounded-md cursor-pointer font-sans transition-all max-md:flex-1 max-md:text-center max-md:px-2 max-md:text-xs ${tab === 'internal' ? 'bg-navy-900 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}>Between My Accounts</button>
        <button onClick={() => { setTab('external'); setError(''); }} className={`px-5 py-2.5 text-sm font-semibold rounded-md cursor-pointer font-sans transition-all max-md:flex-1 max-md:text-center max-md:px-2 max-md:text-xs ${tab === 'external' ? 'bg-navy-900 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}>Send to Another Bank</button>
      </div>

      {/* INTERNAL TRANSFER FORM */}
      {tab === 'internal' && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-7 max-md:p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Transfer Between Accounts</h2>
            <div className="max-w-[480px] space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">From Account</label>
                <select value={effectiveFrom} onChange={e => setFrom(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none bg-white focus:border-accent-500">
                  {transferAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.account_number}) — {fmt(acc.available)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">To Account</label>
                <select value={effectiveTo} onChange={e => setTo(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none bg-white focus:border-accent-500">
                  {transferAccounts.filter(a => a.id !== Number(effectiveFrom)).map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.account_number})</option>)}
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
              <button onClick={submitInternal} className="px-6 py-2.5 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all">Review Transfer</button>
            </div>
          </div>

          {/* Recent Internal Transfers */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-7">
            <div className="px-5 py-4 border-b border-gray-100"><div className="text-[15px] font-semibold text-gray-900">Recent Internal Transfers</div></div>
            {transferTxns.length === 0 && <div className="px-5 py-8 text-center text-sm text-gray-400">No internal transfers yet.</div>}
            {transferTxns.map(txn => (
              <div key={txn.id} className="flex items-center px-5 py-3 border-b border-gray-50">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-3 ${txn.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M7 17l-4-4 4-4M3 13h18M17 7l4 4-4 4M21 11H3" /></svg>
                </div>
                <div className="flex-1"><div className="text-[13px] font-medium text-gray-800">{txn.description}</div><div className="text-[11px] text-gray-400">{fmtDate(txn.date)}</div></div>
                <div className={`text-[13px] font-semibold ${txn.type === 'credit' ? 'text-emerald-700' : 'text-gray-800'}`}>{txn.amount > 0 ? '+' : ''}{fmt(txn.amount)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* EXTERNAL TRANSFER FORM */}
      {tab === 'external' && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-7 max-md:p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Send to Another Bank</h2>
            <p className="text-sm text-gray-400 mb-5">Transfer funds to an external account. Funds typically arrive in 1-3 business days.</p>
            <div className="max-w-[480px] space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">From Account</label>
                <select value={effectiveExtFrom} onChange={e => setExtFrom(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none bg-white focus:border-accent-500">
                  {transferAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.account_number}) — {fmt(acc.available)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Recipient Name</label>
                <input type="text" value={extRecipient} onChange={e => setExtRecipient(e.target.value)} placeholder="e.g., John Smith" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
              </div>
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Routing Number</label>
                  <input type="text" value={extRouting} onChange={e => setExtRouting(e.target.value.replace(/\D/g, '').slice(0, 9))} placeholder="9 digits" maxLength={9} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500 font-mono" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Account Number</label>
                  <input type="text" value={extAccount} onChange={e => setExtAccount(e.target.value.replace(/\D/g, '').slice(0, 17))} placeholder="4-17 digits" maxLength={17} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500 font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Amount</label>
                <input type="number" value={extAmount} onChange={e => setExtAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
                {extFromAccount && <p className="text-xs text-gray-400 mt-1">Available: {fmt(extFromAccount.available)}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Memo (optional)</label>
                <input type="text" value={extMemo} onChange={e => setExtMemo(e.target.value)} placeholder="e.g., Rent payment" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
              </div>
              <button onClick={submitExternal} className="px-6 py-2.5 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all">Send Money</button>
            </div>
          </div>

          {/* Recent External Transfers */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-7">
            <div className="px-5 py-4 border-b border-gray-100"><div className="text-[15px] font-semibold text-gray-900">Recent External Transfers</div></div>
            {externalTxns.length === 0 && <div className="px-5 py-8 text-center text-sm text-gray-400">No external transfers yet.</div>}
            {externalTxns.map(txn => (
              <div key={txn.id} className="flex items-center px-5 py-3 border-b border-gray-50">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-3 bg-orange-50 text-orange-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M17 7l4 4-4 4M21 11H3" /></svg>
                </div>
                <div className="flex-1"><div className="text-[13px] font-medium text-gray-800">{txn.description}</div><div className="text-[11px] text-gray-400">{fmtDate(txn.date)}</div></div>
                <div className="text-[13px] font-semibold text-gray-800">{fmt(txn.amount)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl p-8 max-w-[420px] w-[90%] shadow-lg text-center">
            <div className="w-12 h-12 border-[3px] border-gray-200 border-t-navy-900 rounded-full animate-spin mx-auto mb-5" />
            <div className="text-[15px] font-semibold text-gray-800 mb-1">{processingStep}</div>
            <p className="text-xs text-gray-400">Please do not close this window.</p>
          </div>
        </div>
      )}

      {/* Internal Transfer Confirmation Modal */}
      {showConfirm && !processing && (
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
              <button onClick={handleInternalConfirm} className="px-5 py-2 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800">Confirm & Verify</button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modals */}
      {showOtp && (
        <OtpModal email={user.email} action="internal_transfer" actionLabel="confirm internal transfer" details={`Transfer ${fmt(parseFloat(amount || '0'))} from ${fromAccount?.name} to ${toAccount?.name}`} onVerified={handleInternalOtp} onCancel={() => setShowOtp(false)} />
      )}
      {extShowOtp && (
        <OtpModal email={user.email} action="external_transfer" actionLabel="confirm external transfer" details={`Send ${fmt(parseFloat(extAmount || '0'))} to ${extRecipient} (Routing: ${extRouting}, Account: ****${extAccount.slice(-4)})`} onVerified={handleExternalOtp} onCancel={() => setExtShowOtp(false)} />
      )}
    </>
  );
}
