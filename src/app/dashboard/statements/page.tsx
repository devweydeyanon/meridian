'use client';

import { useDashboard } from '../context';

const months = [
  { period: 'March 2026', date: 'Available Apr 5, 2026', ready: false },
  { period: 'February 2026', date: 'Generated Mar 5, 2026', ready: true },
  { period: 'January 2026', date: 'Generated Feb 5, 2026', ready: true },
  { period: 'December 2025', date: 'Generated Jan 5, 2026', ready: true },
  { period: 'November 2025', date: 'Generated Dec 5, 2025', ready: true },
  { period: 'October 2025', date: 'Generated Nov 5, 2025', ready: true },
];

export default function StatementsPage() {
  const { accounts } = useDashboard();

  return (
    <>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 max-md:flex-nowrap scrollbar-hide">
        <button className="px-3.5 py-2 text-xs font-semibold bg-navy-900 text-white border-navy-900 rounded-lg border cursor-pointer font-sans">All Accounts</button>
        {accounts.filter(a => a.type !== 'cd').map(acc => (
          <button key={acc.id} className="px-3.5 py-2 text-xs font-semibold bg-white text-gray-600 border-gray-200 rounded-lg border cursor-pointer font-sans hover:bg-gray-50">{acc.name.replace('Meridian ', '')}</button>
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
              <div className="text-xs text-gray-400">{m.date}</div>
            </div>
            {m.ready && <button className="flex items-center gap-1.5 text-xs font-semibold text-accent-500 cursor-pointer bg-transparent border-none font-sans">PDF</button>}
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
          <button className="flex items-center gap-1.5 text-xs font-semibold text-accent-500 cursor-pointer bg-transparent border-none font-sans">PDF</button>
        </div>
      </div>
    </>
  );
}
