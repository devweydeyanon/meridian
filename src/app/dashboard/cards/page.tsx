'use client';

import { useDashboard, CARDS, fmt } from '../context';

export default function CardsPage() {
  const { user, balanceVisible } = useDashboard();
  const bal = (n: number) => balanceVisible ? fmt(n) : '••••••';

  return (
    <div className="grid grid-cols-1 gap-6 max-w-[800px]">
      {CARDS.map(card => (
        <div key={card.id} className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Card Visual */}
          <div className={`rounded-xl p-5 h-[180px] flex flex-col justify-between text-white ${card.type === 'credit' && card.name.includes('Visa') ? 'bg-gradient-to-br from-navy-900 to-accent-600' : card.type === 'credit' ? 'bg-gradient-to-br from-gray-800 to-gray-600' : 'bg-gradient-to-br from-emerald-800 to-emerald-600'}`}>
            <div>
              <div className="text-[14px] font-semibold tracking-wider uppercase opacity-90">MERIDIAN BANK</div>
              <div className="w-9 h-[26px] bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-[5px] mt-2" />
            </div>
            <div>
              <div className="text-base tracking-[3px] font-mono opacity-90">•••• •••• •••• {card.number.slice(-4)}</div>
              <div className="flex justify-between items-end mt-2">
                <div className="text-[11px] uppercase tracking-[1.5px] opacity-80">{user.first_name} {user.last_name}</div>
                <div className="text-[13px] font-bold opacity-90">{card.name.includes('Visa') ? 'VISA' : card.name.includes('Mastercard') ? 'MC' : 'DEBIT'}</div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[15px] font-semibold text-gray-800">{card.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{card.number}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5 max-md:grid-cols-1">
            {card.type === 'credit' ? (
              <>
                <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Current Balance</div><div className="text-[15px] font-semibold text-gray-800">{bal(card.balance || 0)}</div></div>
                <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Available Credit</div><div className="text-[15px] font-semibold text-gray-800">{bal(card.available || 0)}</div></div>
                <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Credit Limit</div><div className="text-[15px] font-semibold text-gray-800">{fmt(card.limit || 0)}</div></div>
                <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Min Payment</div><div className="text-[15px] font-semibold text-gray-800">{fmt(card.minPayment || 0)}</div></div>
                <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Due Date</div><div className="text-[15px] font-semibold text-gray-800">{card.dueDate}</div></div>
                <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Rewards</div><div className="text-[15px] font-semibold text-gray-800">{card.rewards}</div></div>
              </>
            ) : (
              <>
                <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Linked Account</div><div className="text-[15px] font-semibold text-gray-800">{card.linkedAccount}</div></div>
                <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Daily Limit</div><div className="text-[15px] font-semibold text-gray-800">{fmt(card.dailyLimit || 0)}</div></div>
                <div><div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">Status</div><div className="text-[15px] font-semibold text-emerald-700">Active</div></div>
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
    </div>
  );
}
