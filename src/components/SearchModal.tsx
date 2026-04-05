'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchResult {
  type: 'transaction' | 'account' | 'card';
  title: string;
  subtitle: string;
  amount?: string;
  icon: 'credit' | 'debit' | 'account' | 'card';
}

interface SearchModalProps {
  accounts: any[];
  cards: any[];
  transactions: any[];
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function SearchModal({ accounts, cards, transactions, onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const results: SearchResult[] = [];
  const q = query.toLowerCase().trim();

  if (q.length >= 2) {
    // Search accounts
    accounts.forEach(a => {
      if (a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) || a.account_number.includes(q)) {
        results.push({ type: 'account', title: a.name, subtitle: `${a.type} · ${a.account_number}`, amount: fmt(a.balance), icon: 'account' });
      }
    });

    // Search cards
    cards.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q) || c.card_number.includes(q)) {
        results.push({ type: 'card', title: c.name, subtitle: `${c.type} · ${c.card_number} · ${c.status}`, amount: c.type === 'credit' ? fmt(c.balance) : undefined, icon: 'card' });
      }
    });

    // Search transactions
    transactions.forEach(t => {
      if (t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)) {
        results.push({ type: 'transaction', title: t.description, subtitle: `${t.category} · ${new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, amount: fmt(t.amount), icon: t.type === 'credit' ? 'credit' : 'debit' });
      }
    });
  }

  const handleClick = (r: SearchResult) => {
    if (r.type === 'account') onNavigate('/dashboard/accounts');
    else if (r.type === 'card') onNavigate('/dashboard/cards');
    else onNavigate('/dashboard/accounts');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-[200] pt-[15vh] backdrop-blur-[2px]" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-[520px] mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" className="w-5 h-5 shrink-0"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search transactions, accounts, cards..."
            className="flex-1 text-sm outline-none border-none bg-transparent text-gray-900 placeholder:text-gray-400"
          />
          <kbd className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {q.length < 2 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Type at least 2 characters to search.</div>
          )}

          {q.length >= 2 && results.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No results for &ldquo;{query}&rdquo;</div>
          )}

          {results.slice(0, 15).map((r, i) => (
            <div key={i} onClick={() => handleClick(r)} className="flex items-center px-5 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-all">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-3 ${
                r.icon === 'credit' ? 'bg-emerald-50 text-emerald-600' :
                r.icon === 'debit' ? 'bg-red-50 text-red-500' :
                r.icon === 'account' ? 'bg-blue-50 text-blue-600' :
                'bg-purple-50 text-purple-600'
              }`}>
                {r.icon === 'credit' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>}
                {r.icon === 'debit' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 19V5M5 12l7-7 7 7" /></svg>}
                {r.icon === 'account' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><rect x="2" y="3" width="20" height="18" rx="2" /><line x1="2" y1="9" x2="22" y2="9" /></svg>}
                {r.icon === 'card' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-gray-800 truncate">{r.title}</div>
                <div className="text-[11px] text-gray-400">{r.subtitle}</div>
              </div>
              {r.amount && (
                <div className={`text-[13px] font-semibold ml-3 ${r.icon === 'credit' ? 'text-emerald-700' : 'text-gray-800'}`}>{r.amount}</div>
              )}
            </div>
          ))}

          {results.length > 15 && (
            <div className="px-5 py-3 text-xs text-gray-400 text-center">{results.length - 15} more results...</div>
          )}
        </div>
      </div>
    </div>
  );
}
