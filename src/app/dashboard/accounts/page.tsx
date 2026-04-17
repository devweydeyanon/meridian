'use client';

import { useState } from 'react';
import { useDashboard, fmt, groupByDate } from '../context';

export default function AccountsPage() {
  const { balanceVisible, accounts, transactions, loading } = useDashboard();
  const [selected, setSelected] = useState<number | 'all'>('all');
  const bal = (n: number) => balanceVisible ? fmt(n) : '••••••';

  if (loading) return <div className="text-center py-20 text-sm text-gray-400">Loading...</div>;

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...Array.from(new Set(transactions.map(t => t.category)))];
  const filteredTxns = (selected === 'all' ? transactions : transactions.filter(t => t.account_id === selected))
    .filter(t => categoryFilter === 'all' || t.category === categoryFilter)
    .filter(t => !search || t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
  const grouped = groupByDate(filteredTxns);

  return (
    <>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 max-md:flex-nowrap scrollbar-hide">
        <button onClick={() => setSelected('all')} className={`px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer font-sans transition-all ${selected === 'all' ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>All Accounts</button>
        {accounts.map(acc => (
          <button key={acc.id} onClick={() => setSelected(acc.id)} className={`px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer font-sans transition-all ${selected === acc.id ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {acc.name.replace('Meridian ', '')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">
        {accounts.map(acc => (
          <div key={acc.id} className={`bg-white rounded-xl border p-5 transition-all cursor-pointer ${selected === acc.id ? 'border-accent-500 shadow-md' : 'border-gray-200'}`} onClick={() => setSelected(acc.id)}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{acc.type === 'cd' ? 'CD' : acc.type}</div>
                <div className="text-[15px] font-semibold text-gray-800 mt-0.5">{acc.name}</div>
                <div className="text-xs text-gray-400">{acc.account_number}</div>
              </div>
              <div className={`w-2 h-2 rounded-full ${acc.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            </div>
            <div className="text-[24px] max-md:text-[20px] font-bold text-gray-900 mt-3">{bal(acc.balance)}</div>
            <div className="text-[11px] text-gray-400 mb-2">Current balance</div>
            <div className="flex gap-4 text-xs text-gray-400">
              {acc.apy && <div>APY: <span className="font-semibold text-gray-600">{acc.apy}</span></div>}
              {acc.type !== 'cd' && <div>Available: <span className="font-semibold text-gray-600">{bal(acc.available)}</span></div>}
              {acc.maturity_date && <div>Matures: <span className="font-semibold text-gray-600">{new Date(acc.maturity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[15px] font-semibold text-gray-900">Transaction History</div>
            <div className="text-xs text-gray-400">{filteredTxns.length} transactions</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..." className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-md outline-none focus:border-accent-500" />
            </div>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 text-xs border border-gray-200 rounded-md outline-none bg-white focus:border-accent-500">
              {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
            </select>
          </div>
        </div>
        {Object.keys(grouped).length === 0 && <div className="px-5 py-8 text-center text-sm text-gray-400">No transactions found.</div>}
        {Object.entries(grouped).map(([date, txns]) => (
          <div key={date}>
            <div className="px-5 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">{date}</div>
            {txns.map(txn => (
              <div key={txn.id} className="flex items-center px-5 py-3 border-b border-gray-50 hover:bg-gray-50/50">
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
    </>
  );
}
