'use client';

import { useState } from 'react';
import { useDashboard } from '../context';

const months = [
  { period: 'March 2026', month: 3, year: 2026, ready: true },
  { period: 'February 2026', month: 2, year: 2026, ready: true },
  { period: 'January 2026', month: 1, year: 2026, ready: true },
  { period: 'December 2025', month: 12, year: 2025, ready: true },
  { period: 'November 2025', month: 11, year: 2025, ready: true },
  { period: 'October 2025', month: 10, year: 2025, ready: true },
  { period: 'September 2025', month: 9, year: 2025, ready: true },
  { period: 'August 2025', month: 8, year: 2025, ready: true },
  { period: 'July 2025', month: 7, year: 2025, ready: true },
  { period: 'June 2025', month: 6, year: 2025, ready: true },
  { period: 'May 2025', month: 5, year: 2025, ready: true },
  { period: 'April 2025', month: 4, year: 2025, ready: true },
];

export default function StatementsPage() {
  const { accounts } = useDashboard();
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [downloading, setDownloading] = useState<string | null>(null);

  const download = async (month: number, year: number, period: string) => {
    const key = `${month}-${year}`;
    setDownloading(key);
    try {
      const res = await fetch(`/api/dashboard/statement?month=${month}&year=${year}&account=${selectedAccount}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Meridian_Statement_${period.replace(' ', '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {}
    setDownloading(null);
  };

  return (
    <>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 max-md:flex-nowrap scrollbar-hide">
        <button onClick={() => setSelectedAccount('all')} className={`px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer font-sans whitespace-nowrap transition-all ${selectedAccount === 'all' ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>All Accounts</button>
        {accounts.filter(a => a.type !== 'cd').map(acc => (
          <button key={acc.id} onClick={() => setSelectedAccount(String(acc.id))} className={`px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer font-sans whitespace-nowrap transition-all ${selectedAccount === String(acc.id) ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {acc.name.replace('Meridian ', '')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-7">
        <div className="px-5 py-4 border-b border-gray-100"><div className="text-[15px] font-semibold text-gray-900">Monthly Statements</div></div>
        {months.map(m => (
          <div key={m.period} className="flex items-center px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0 mr-3.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8" /></svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">{m.period}</div>
              <div className="text-xs text-gray-400">Generated {new Date(m.year, m.month, 5).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <button onClick={() => download(m.month, m.year, m.period)} disabled={downloading === `${m.month}-${m.year}`} className="flex items-center gap-1.5 text-xs font-semibold text-accent-500 cursor-pointer bg-transparent border-none font-sans hover:text-accent-600 disabled:opacity-50">
              {downloading === `${m.month}-${m.year}` ? (
                <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-accent-500 rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              )}
              Download
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100"><div className="text-[15px] font-semibold text-gray-900">Tax Documents</div></div>
        <div className="flex items-center px-5 py-3.5 hover:bg-gray-50 transition-all">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0 mr-3.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8" /></svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">2025 Tax Year — 1099-INT</div>
            <div className="text-xs text-gray-400">Generated Jan 31, 2026</div>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-accent-500 cursor-pointer bg-transparent border-none font-sans hover:text-accent-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Download
          </button>
        </div>
      </div>
    </>
  );
}
