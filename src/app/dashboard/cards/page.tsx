'use client';

import { useState } from 'react';
import { useDashboard, fmt } from '../context';
import OtpModal from '@/components/OtpModal';

export default function CardsPage() {
  const { user, balanceVisible, cards, refreshData, loading } = useDashboard();
  const bal = (n: number) => balanceVisible ? fmt(n) : '••••••';

  const [showOtp, setShowOtp] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ cardId: number; action: string; cardName: string } | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState<number | null>(null);

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Loading...</div>;

  // Step 1: User clicks action → trigger OTP
  const handleAction = (cardId: number, action: string, cardName: string) => {
    setError('');
    setSuccess('');
    setPendingAction({ cardId, action, cardName });
    setShowCancelConfirm(null);
    setShowOtp(true);
  };

  // Step 2: OTP verified → execute action
  const handleOtpVerified = async () => {
    if (!pendingAction) return;
    setShowOtp(false);
    setProcessing(pendingAction.cardId);

    try {
      const res = await fetch('/api/dashboard/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: pendingAction.cardId, action: pendingAction.action }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        await refreshData();
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Action failed.');
      }
    } catch {
      setError('Connection error.');
    }
    setProcessing(null);
    setPendingAction(null);
  };

  const otpAction = pendingAction?.action === 'cancel' ? 'card_cancel' : 'card_lock';
  const otpLabel = pendingAction?.action === 'lock' ? `lock ${pendingAction.cardName}` 
    : pendingAction?.action === 'unlock' ? `unlock ${pendingAction.cardName}`
    : `cancel ${pendingAction?.cardName}`;

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

      <div className="grid grid-cols-1 gap-6 max-w-[800px] w-full">
        {cards.map(card => (
          <div key={card.id} className={`bg-white rounded-xl border p-6 ${card.status === 'cancelled' ? 'border-red-200 opacity-60' : card.status === 'locked' ? 'border-amber-300' : 'border-gray-200'}`}>
            {/* Card Visual */}
            <div className={`rounded-xl p-5 h-[180px] max-md:h-[160px] flex flex-col justify-between text-white relative overflow-hidden ${card.type === 'credit' && card.name.includes('Visa') ? 'bg-gradient-to-br from-navy-900 to-accent-600' : card.type === 'credit' ? 'bg-gradient-to-br from-gray-800 to-gray-600' : 'bg-gradient-to-br from-emerald-800 to-emerald-600'}`}>
              {card.status === 'locked' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    <span className="text-white font-bold text-sm">LOCKED</span>
                  </div>
                </div>
              )}
              {card.status === 'cancelled' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-red-500/80 rounded-lg px-4 py-2">
                    <span className="text-white font-bold text-sm">CANCELLED</span>
                  </div>
                </div>
              )}
              <div>
                <div className="text-[14px] font-semibold tracking-wider uppercase opacity-90">MERIDIAN BANK</div>
                <div className="w-9 h-[26px] bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-[5px] mt-2" />
              </div>
              <div>
                <div className="text-base tracking-[3px] font-mono opacity-90">•••• •••• •••• {card.card_number.slice(-4)}</div>
                <div className="flex justify-between items-end mt-2">
                  <div className="text-[11px] uppercase tracking-[1.5px] opacity-80">{user.first_name} {user.last_name}</div>
                  <div className="text-[13px] font-bold opacity-90">{card.name.includes('Visa') ? 'VISA' : card.name.includes('Mastercard') ? 'MC' : 'DEBIT'}</div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2">
                <div className="text-[15px] font-semibold text-gray-800">{card.name}</div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.status === 'active' ? 'bg-emerald-50 text-emerald-700' : card.status === 'locked' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{card.status}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{card.card_number}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5 max-md:grid-cols-1">
              {card.type === 'credit' ? (
                <>
                  <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Current Balance</div><div className="text-[15px] font-semibold text-gray-800">{bal(card.balance)}</div></div>
                  <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Available Credit</div><div className="text-[15px] font-semibold text-gray-800">{bal(card.available)}</div></div>
                  <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Credit Limit</div><div className="text-[15px] font-semibold text-gray-800">{fmt(card.credit_limit)}</div></div>
                  <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Min Payment</div><div className="text-[15px] font-semibold text-gray-800">{fmt(card.min_payment)}</div></div>
                  {card.due_date && <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Due Date</div><div className="text-[15px] font-semibold text-gray-800">{new Date(card.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div></div>}
                  {card.rewards && <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Rewards</div><div className="text-[15px] font-semibold text-gray-800">{card.rewards}</div></div>}
                </>
              ) : (
                <>
                  <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Daily Limit</div><div className="text-[15px] font-semibold text-gray-800">{fmt(card.daily_limit)}</div></div>
                  <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Status</div><div className={`text-[15px] font-semibold capitalize ${card.status === 'active' ? 'text-emerald-700' : card.status === 'locked' ? 'text-amber-700' : 'text-red-700'}`}>{card.status}</div></div>
                </>
              )}
            </div>

            {/* Actions */}
            {card.status !== 'cancelled' && (
              <div className="flex gap-2.5 mt-5 flex-wrap">
                {card.status === 'active' ? (
                  <button onClick={() => handleAction(card.id, 'lock', card.name)} disabled={processing === card.id} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans hover:bg-gray-50 transition-all disabled:opacity-50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    {processing === card.id ? 'Processing...' : 'Lock Card'}
                  </button>
                ) : (
                  <button onClick={() => handleAction(card.id, 'unlock', card.name)} disabled={processing === card.id} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md cursor-pointer font-sans hover:bg-emerald-100 transition-all disabled:opacity-50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    {processing === card.id ? 'Processing...' : 'Unlock Card'}
                  </button>
                )}
                {showCancelConfirm === card.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-600 font-medium">Are you sure?</span>
                    <button onClick={() => handleAction(card.id, 'cancel', card.name)} className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 border-none rounded-md cursor-pointer font-sans hover:bg-red-700">Yes, cancel</button>
                    <button onClick={() => setShowCancelConfirm(null)} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans">No</button>
                  </div>
                ) : (
                  <button onClick={() => setShowCancelConfirm(card.id)} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-md cursor-pointer font-sans hover:bg-red-50 transition-all">
                    Cancel Card
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {cards.length === 0 && <div className="text-center py-20 text-sm text-gray-400">No cards found.</div>}
      </div>

      {showOtp && pendingAction && (
        <OtpModal
          email={user.email}
          action={otpAction}
          actionLabel={otpLabel}
          onVerified={handleOtpVerified}
          onCancel={() => { setShowOtp(false); setPendingAction(null); }}
        />
      )}
    </>
  );
}
