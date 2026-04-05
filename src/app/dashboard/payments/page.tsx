'use client';

import { ACCOUNTS, PAYEES, fmt } from '../context';

export default function PaymentsPage() {
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-7 mb-7 max-md:p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Pay a Bill</h2>
        <div className="max-w-[480px] space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Payee</label>
            <select className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none bg-white focus:border-accent-500">
              <option>Select a payee</option>
              {PAYEES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">From Account</label>
            <select className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none bg-white focus:border-accent-500">
              {ACCOUNTS.filter(a => a.type === 'checking').map(acc => <option key={acc.id}>{acc.name} — {fmt(acc.available)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Amount</label>
              <input type="number" placeholder="0.00" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Payment Date</label>
              <input type="date" defaultValue="2026-04-05" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
            </div>
          </div>
          <button className="px-6 py-2.5 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all">Schedule Payment</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="text-[15px] font-semibold text-gray-900">Saved Payees</div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans hover:bg-gray-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Add Payee
          </button>
        </div>
        {PAYEES.map(p => (
          <div key={p.id} className="flex items-center px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-navy-900/5 flex items-center justify-center text-navy-700 font-bold text-sm shrink-0 mr-3.5">{p.name.charAt(0)}</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">{p.name}</div>
              <div className="text-xs text-gray-400">{p.category} · Last paid {p.lastPaid}</div>
            </div>
            <div className="text-sm font-semibold text-gray-700 mx-4">{fmt(p.amount)}</div>
            <button className="px-3 py-1.5 text-xs font-semibold text-accent-500 bg-white border border-gray-200 rounded-md cursor-pointer font-sans hover:bg-gray-50">Pay Now</button>
          </div>
        ))}
      </div>
    </>
  );
}
