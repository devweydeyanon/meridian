'use client';

import { useState } from 'react';
import { useDashboard, fmt } from '../context';
import OtpModal from '@/components/OtpModal';

export default function DepositPage() {
  const { user, accounts, refreshData } = useDashboard();
  const depositAccounts = accounts.filter(a => a.type !== 'cd' && a.status === 'active');

  const [acctId, setAcctId] = useState('');
  const [amount, setAmount] = useState('');
  const [checkNum, setCheckNum] = useState('');
  const [step, setStep] = useState<'form' | 'photo' | 'confirm' | 'processing' | 'done'>('form');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const selectedAcct = depositAccounts.find(a => a.id === Number(acctId || depositAccounts[0]?.id));

  const handleContinue = () => {
    setError('');
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount.'); return; }
    if (parseFloat(amount) > 25000) { setError('Mobile deposit limit is $25,000 per check.'); return; }
    setStep('photo');
  };

  const handlePhotoCapture = () => {
    setStep('confirm');
  };

  const handleSubmit = () => {
    setShowOtp(true);
  };

  const handleOtp = async () => {
    setShowOtp(false);
    setStep('processing');

    await new Promise(r => setTimeout(r, 1500));
    try {
      const res = await fetch('/api/dashboard/deposit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: Number(acctId || depositAccounts[0]?.id), amount: parseFloat(amount), check_number: checkNum }),
      });
      const data = await res.json();
      if (res.ok) { setResult(data.message); setStep('done'); await refreshData(); }
      else { setError(data.error || 'Deposit failed.'); setStep('confirm'); }
    } catch { setError('Connection error.'); setStep('confirm'); }
  };

  return (
    <>
      {step === 'form' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-[560px]">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Deposit a check</h2>
          <p className="text-xs text-gray-400 mb-5">Take a photo of your check to deposit it instantly. Up to $25,000 per check.</p>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Deposit to</label>
              <select value={acctId || depositAccounts[0]?.id} onChange={e => setAcctId(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none bg-white focus:border-accent-500">
                {depositAccounts.map(a => <option key={a.id} value={a.id}>{a.name} — {fmt(a.available)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Check amount</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" min="0.01" max="25000" step="0.01" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Check number (optional)</label>
              <input value={checkNum} onChange={e => setCheckNum(e.target.value)} placeholder="1234" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
            </div>
          </div>
          <button onClick={handleContinue} className="mt-5 w-full py-3 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all">Continue</button>
        </div>
      )}

      {step === 'photo' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-[560px]">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Capture check images</h2>
          <p className="text-xs text-gray-400 mb-5">In a real app, you'd use your camera. For this demo, click to simulate.</p>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-36 flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent-500 hover:bg-accent-500/5 transition-all" onClick={handlePhotoCapture}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="w-8 h-8 mb-2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
              <div className="text-xs font-semibold text-gray-500">Front of check</div>
              <div className="text-[10px] text-gray-400">Tap to capture</div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-36 flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent-500 hover:bg-accent-500/5 transition-all" onClick={handlePhotoCapture}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="w-8 h-8 mb-2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
              <div className="text-xs font-semibold text-gray-500">Back of check</div>
              <div className="text-[10px] text-gray-400">Tap to capture</div>
            </div>
          </div>
          <button onClick={() => setStep('form')} className="text-xs font-semibold text-gray-500 bg-transparent border-none cursor-pointer font-sans">← Back</button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-[560px]">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Confirm deposit</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm mb-5">
            <div className="flex justify-between"><span className="text-gray-500">Account</span><span className="font-medium">{selectedAcct?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-base">{fmt(parseFloat(amount))}</span></div>
            {checkNum && <div className="flex justify-between"><span className="text-gray-500">Check #</span><span>{checkNum}</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Check images</span><span className="text-emerald-600 font-medium">✓ Captured</span></div>
          </div>
          <p className="text-[11px] text-gray-400 mb-4">First $225 is available immediately. The remaining balance is typically available the next business day.</p>
          <div className="flex gap-3">
            <button onClick={() => setStep('photo')} className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans">Back</button>
            <button onClick={handleSubmit} className="flex-1 py-2.5 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800">Submit Deposit</button>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-[3px] border-gray-200 border-t-navy-900 rounded-full animate-spin mx-auto mb-5" />
            <div className="text-[15px] font-semibold text-gray-800 mb-1">Processing deposit...</div>
            <p className="text-xs text-gray-400">Verifying check image and amount.</p>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-[460px] text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f7b3f" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Deposit submitted!</h2>
          <p className="text-sm text-gray-500 mb-6">{result}</p>
          <button onClick={() => { setStep('form'); setAmount(''); setCheckNum(''); setError(''); setResult(''); }} className="px-6 py-2.5 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800">Deposit another check</button>
        </div>
      )}

      {showOtp && (
        <OtpModal email={user.email} action="mobile_deposit" actionLabel="confirm mobile deposit" details={`Deposit ${fmt(parseFloat(amount || '0'))} to ${selectedAcct?.name}${checkNum ? ` (Check #${checkNum})` : ''}`} onVerified={handleOtp} onCancel={() => setShowOtp(false)} />
      )}
    </>
  );
}
