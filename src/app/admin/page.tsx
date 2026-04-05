'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');
  const [typeFilter, setTypeFilter] = useState('all');
  const router = useRouter();

  const typeLabels: Record<string, string> = {
    login: 'Login',
    transfer: 'Transfer',
    internal_transfer: 'Internal Transfer',
    external_transfer: 'External Transfer',
    bill_pay: 'Bill Payment',
    card_lock: 'Card Lock/Unlock',
    card_cancel: 'Card Cancellation',
  };

  useEffect(() => {
    fetch('/api/admin')
      .then(res => { if (!res.ok) throw new Error('Not authorized'); return res.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-navy-900 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading admin panel...</p>
      </div>
    </div>
  );

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  const fmtTime = (d: string) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  const filteredCodes = typeFilter === 'all'
    ? (data.verification_codes || [])
    : (data.verification_codes || []).filter((vc: any) => vc.type === typeFilter);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cta-primary rounded-lg flex items-center justify-center font-bold text-sm">M</div>
          <div>
            <div className="text-base font-semibold">Meridian Bank</div>
            <div className="text-[10px] uppercase tracking-[1.5px] text-white/40">Admin Panel</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-white/60 hover:text-white no-underline">Website</Link>
          <button onClick={async () => { await fetch('/api/admin/logout', { method: 'POST' }); router.push('/admin/login'); }} className="text-xs text-white/60 hover:text-white bg-transparent border border-white/20 rounded-md px-3 py-1.5 cursor-pointer font-sans">Sign Out</button>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 max-md:grid-cols-1">
          {[
            { label: 'Total Users', value: data.stats.total_users },
            { label: 'Contact Submissions', value: data.stats.total_contacts },
            { label: 'Chat Messages', value: data.stats.total_chat_messages },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{s.label}</div>
              <div className="text-[28px] font-bold text-gray-900 mt-1">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-white rounded-lg border border-gray-200 p-1 w-fit">
          {['users', 'contacts', 'verification'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-semibold rounded-md cursor-pointer font-sans transition-all ${tab === t ? 'bg-navy-900 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}>
              {t === 'verification' ? 'Verification Codes' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="text-[15px] font-semibold text-gray-900">Registered Users ({data.users.length})</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Member ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((u: any) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-800">{u.name}</td>
                      <td className="px-5 py-3 text-gray-600">{u.email}</td>
                      <td className="px-5 py-3 text-gray-500 font-mono text-xs">{u.member_id || '—'}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{u.created_at ? fmtTime(u.created_at) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {tab === 'contacts' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="text-[15px] font-semibold text-gray-900">Contact Submissions</div>
            </div>
            {data.recent_contacts?.length > 0 ? data.recent_contacts.map((c: any) => (
              <div key={c.id} className="px-5 py-4 border-b border-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-medium text-gray-800">{c.first_name} {c.last_name}</div>
                  <div className="text-xs text-gray-400">{c.created_at ? fmtTime(c.created_at) : ''}</div>
                </div>
                <div className="text-xs text-gray-500 mb-1">{c.email} · {c.topic || 'General'}</div>
                <div className="text-sm text-gray-600">{c.message}</div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No contact submissions yet.</div>
            )}
          </div>
        )}

        {/* Verification Codes Tab */}
        {tab === 'verification' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="text-[15px] font-semibold text-gray-900">Verification Codes</div>
              <div className="text-xs text-gray-400 mt-0.5">OTP codes generated for user actions. Share codes with users to authorize their requests.</div>
            </div>

            {/* Type filter */}
            <div className="px-5 py-3 border-b border-gray-100 flex gap-2 flex-wrap">
              {['all', 'login', 'transfer', 'internal_transfer', 'external_transfer', 'bill_pay', 'card_lock', 'card_cancel'].map(f => (
                <button key={f} onClick={() => setTypeFilter(f)} className={`px-3 py-1.5 text-[11px] font-semibold rounded-full border cursor-pointer font-sans transition-all ${typeFilter === f ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                  {f === 'all' ? 'All' : typeLabels[f] || f}
                </button>
              ))}
            </div>

            {filteredCodes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Purpose</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Expires</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCodes.map((vc: any) => {
                      const expired = new Date(vc.expires_at) < new Date();
                      const status = vc.used ? 'Used' : expired ? 'Expired' : 'Active';
                      const statusColor = vc.used ? 'text-gray-400 bg-gray-100' : expired ? 'text-red-600 bg-red-50' : 'text-emerald-700 bg-emerald-50';
                      const typeColor: Record<string, string> = {
                        login: 'text-blue-700 bg-blue-50',
                        transfer: 'text-purple-700 bg-purple-50',
                        internal_transfer: 'text-indigo-700 bg-indigo-50',
                        external_transfer: 'text-orange-700 bg-orange-50',
                        bill_pay: 'text-teal-700 bg-teal-50',
                        card_lock: 'text-amber-700 bg-amber-50',
                        card_cancel: 'text-red-700 bg-red-50',
                      };
                      return (
                        <tr key={vc.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-5 py-3 font-medium text-gray-800">{vc.user_name}</td>
                          <td className="px-5 py-3 text-gray-600">{vc.email}</td>
                          <td className="px-5 py-3 text-center">
                            <span className="font-mono text-lg font-bold text-navy-900 tracking-widest">{vc.code}</span>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${typeColor[vc.type] || 'text-gray-600 bg-gray-100'}`}>{typeLabels[vc.type] || vc.type}</span>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>{status}</span>
                          </td>
                          <td className="px-5 py-3 text-gray-400 text-xs">{fmtTime(vc.expires_at)}</td>
                          <td className="px-5 py-3 text-gray-400 text-xs">{fmtTime(vc.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No verification codes {typeFilter !== 'all' ? `for "${typeLabels[typeFilter] || typeFilter}"` : 'generated yet'}.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
