'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  account_number: string;
  account_type: string;
  balance: number;
  savings_balance: number;
  card_balance: number;
  member_since: string;
  last_login: string;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setTransactions(data.transactions);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', fontFamily: "'Open Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e9ecef', borderTopColor: '#0a1628', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6c757d', fontSize: 14 }}>Loading your accounts...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const totalBalance = user.balance + user.savings_balance;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Open Sans', sans-serif" }}>
      {/* Header */}
      <header style={{ background: '#0a1628', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#c8102e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.8)' }} />
            </div>
            <span style={{ color: 'white', fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>Meridian<span style={{ fontWeight: 400, opacity: 0.7 }}>Bank</span></span>
          </a>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginLeft: 8 }}>Online Banking</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Welcome, {user.first_name}</span>
          <button onClick={handleLogout} style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit' }}>
            Log out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user.first_name}</h1>
          <p style={{ fontSize: 14, color: '#6c757d' }}>Here&apos;s your financial overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
        </div>

        {/* Account Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 32 }}>
          {/* Checking */}
          <div style={{ background: 'linear-gradient(135deg, #0a1628 0%, #142d54 100%)', borderRadius: 12, padding: 24, color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 12, opacity: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{user.account_type}</p>
                <p style={{ fontSize: 11, opacity: 0.35 }}>••••{user.account_number.slice(-4)}</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}>{formatCurrency(user.balance)}</p>
            <p style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>Available balance</p>
          </div>

          {/* Savings */}
          <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e9ecef' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 12, color: '#6c757d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>High Yield Savings</p>
                <p style={{ fontSize: 11, color: '#adb5bd' }}>4.25% APY</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>{formatCurrency(user.savings_balance)}</p>
            <p style={{ fontSize: 11, color: '#adb5bd', marginTop: 4 }}>Available balance</p>
          </div>

          {/* Credit Card */}
          <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e9ecef' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 12, color: '#6c757d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Cash Rewards Visa®</p>
                <p style={{ fontSize: 11, color: '#adb5bd' }}>1.5% cash back</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#c8102e', letterSpacing: '-0.02em' }}>{formatCurrency(user.card_balance)}</p>
            <p style={{ fontSize: 11, color: '#adb5bd', marginTop: 4 }}>Current balance</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          {[
            { label: 'Transfer', icon: 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3' },
            { label: 'Pay bills', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
            { label: 'Deposit', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
            { label: 'Send money', icon: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' },
            { label: 'Statements', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
          ].map((action) => (
            <button key={action.label} style={{ flex: 1, padding: '14px 12px', background: 'white', border: '1px solid #e9ecef', borderRadius: 8, cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0077be'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,119,190,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.boxShadow = 'none'; }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="1.8" style={{ display: 'block', margin: '0 auto 6px' }}><path d={action.icon}/></svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#495057' }}>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e9ecef', marginBottom: 24 }}>
          {['overview', 'transactions'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '12px 20px', fontSize: 14, fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? '#0a1628' : '#6c757d', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #0a1628' : '2px solid transparent', marginBottom: -2, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
            {/* Recent Transactions */}
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e9ecef', overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Recent transactions</h3>
                <button onClick={() => setActiveTab('transactions')} style={{ fontSize: 12, fontWeight: 600, color: '#0077be', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>View all</button>
              </div>
              {transactions.slice(0, 8).map(t => (
                <div key={t.id} style={{ padding: '13px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8f9fa' }}>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a2e', marginBottom: 2 }}>{t.description}</p>
                    <p style={{ fontSize: 11, color: '#adb5bd' }}>{formatDate(t.date)} · {t.category}</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.amount > 0 ? '#0f7b3f' : '#1a1a2e' }}>
                    {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Net Worth */}
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e9ecef', padding: 22 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Total relationship</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#0a1628', letterSpacing: '-0.02em' }}>{formatCurrency(totalBalance)}</p>
                <p style={{ fontSize: 11, color: '#adb5bd', marginTop: 4 }}>Across all accounts (excl. credit)</p>
              </div>

              {/* Account Info */}
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e9ecef', padding: 22 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>Account details</p>
                {[
                  { label: 'Account holder', value: `${user.first_name} ${user.last_name}` },
                  { label: 'Account number', value: `••••${user.account_number.slice(-4)}` },
                  { label: 'Routing number', value: '021000089' },
                  { label: 'Account type', value: user.account_type },
                  { label: 'Member since', value: formatDate(user.member_since) },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8f9fa', fontSize: 13 }}>
                    <span style={{ color: '#6c757d' }}>{row.label}</span>
                    <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Security */}
              <div style={{ background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0', padding: 18, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f7b3f" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f7b3f', marginBottom: 2 }}>Account secured</p>
                  <p style={{ fontSize: 11.5, color: '#166534', lineHeight: 1.4 }}>256-bit encryption active. Last login: {user.last_login ? formatDate(user.last_login) : 'First login'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e9ecef', overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f3f5' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>All transactions</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '10px 22px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '10px 22px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                  <th style={{ padding: '10px 22px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                  <th style={{ padding: '10px 22px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '12px 22px', fontSize: 13, color: '#6c757d' }}>{formatDate(t.date)}</td>
                    <td style={{ padding: '12px 22px', fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>{t.description}</td>
                    <td style={{ padding: '12px 22px' }}><span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', background: '#f1f3f5', borderRadius: 100, color: '#495057' }}>{t.category}</span></td>
                    <td style={{ padding: '12px 22px', fontSize: 13.5, fontWeight: 700, color: t.amount > 0 ? '#0f7b3f' : '#1a1a2e', textAlign: 'right' }}>{t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          [style*="gridTemplateColumns: 'repeat(3, 1fr)'"],
          [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
