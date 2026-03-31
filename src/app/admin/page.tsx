'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin')
      .then(res => {
        if (!res.ok) throw new Error('Not authorized');
        return res.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => router.push('/login'));
  }, [router]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Open Sans', sans-serif" }}>
      <p style={{ color: '#6c757d' }}>Loading admin panel...</p>
    </div>
  );

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Open Sans', sans-serif" }}>
      <header style={{ background: '#0a1628', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ color: 'white', fontSize: 17, fontWeight: 700, textDecoration: 'none' }}>Meridian<span style={{ fontWeight: 400, opacity: 0.7 }}>Bank</span></a>
          <span style={{ color: '#c8102e', fontSize: 11, fontWeight: 700, background: 'rgba(200,16,46,0.15)', padding: '3px 10px', borderRadius: 100 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' }}>Dashboard</a>
          <button onClick={() => { fetch('/api/auth/logout', { method: 'POST' }).then(() => router.push('/')); }} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Log out</button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 24 }}>Admin Panel</h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Registered Users', value: data.stats.total_users, color: '#0a1628' },
            { label: 'Contact Submissions', value: data.stats.total_contacts, color: '#0077be' },
            { label: 'Chat Messages', value: data.stats.total_chat_messages, color: '#0f7b3f' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', border: '1px solid #e9ecef', borderRadius: 10, padding: 22 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div style={{ background: 'white', border: '1px solid #e9ecef', borderRadius: 10, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #e9ecef' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Registered Users</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '10px 22px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '10px 22px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '10px 22px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase' }}>Account</th>
                <th style={{ padding: '10px 22px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase' }}>Balance</th>
                <th style={{ padding: '10px 22px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u: any) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '12px 22px', fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{u.name}</td>
                  <td style={{ padding: '12px 22px', fontSize: 13, color: '#6c757d' }}>{u.email}</td>
                  <td style={{ padding: '12px 22px', fontSize: 12, color: '#6c757d' }}>{u.account_number}</td>
                  <td style={{ padding: '12px 22px', fontSize: 13, fontWeight: 700, color: '#1a1a2e', textAlign: 'right' }}>{formatCurrency(u.balance)}</td>
                  <td style={{ padding: '12px 22px', fontSize: 12, color: '#adb5bd' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contact Submissions */}
        <div style={{ background: 'white', border: '1px solid #e9ecef', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #e9ecef' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Recent Contact Submissions</h2>
          </div>
          {data.recent_contacts.length === 0 ? (
            <p style={{ padding: 22, fontSize: 13, color: '#adb5bd' }}>No submissions yet.</p>
          ) : (
            data.recent_contacts.map((c: any) => (
              <div key={c.id} style={{ padding: '14px 22px', borderBottom: '1px solid #f8f9fa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{c.first_name} {c.last_name} — {c.topic || 'General'}</span>
                  <span style={{ fontSize: 11, color: '#adb5bd' }}>{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: 13, color: '#6c757d' }}>{c.email}</p>
                <p style={{ fontSize: 13, color: '#495057', marginTop: 4 }}>{c.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
