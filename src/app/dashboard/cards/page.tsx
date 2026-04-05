'use client';

import { useDashboard, fmt } from '../context';

export default function CardsPage() {
  const { user, balanceVisible, cards, loading } = useDashboard();
  const bal = (n: number) => balanceVisible ? fmt(n) : '••••••';

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-6 max-w-[800px]">
      {cards.map(card => (
        <div key={card.id} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className={`rounded-xl p-5 h-[180px] flex flex-col justify-between text-white ${card.type === 'credit' && card.name.includes('Visa') ? 'bg-gradient-to-br from-navy-900 to-accent-600' : card.type === 'credit' ? 'bg-gradient-to-br from-gray-800 to-gray-600' : 'bg-gradient-to-br from-emerald-800 to-emerald-600'}`}>
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
            <div className="text-[15px] font-semibold text-gray-800">{card.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{card.card_number}</div>
            <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.status === 'active' ? 'bg-emerald-50 text-emerald-700' : card.status === 'locked' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{card.status}</span>
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
                <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Status</div><div className="text-[15px] font-semibold text-emerald-700 capitalize">{card.status}</div></div>
              </>
            )}
          </div>

          <div className="flex gap-2.5 mt-5 flex-wrap">
            {['Lock Card', 'Contactless', 'Report Issue'].map(action => (
              <button key={action} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans hover:bg-gray-50 transition-all">{action}</button>
            ))}
          </div>
        </div>
      ))}
      {cards.length === 0 && <div className="text-center py-20 text-sm text-gray-400">No cards found.</div>}
    </div>
  );
}
