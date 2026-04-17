'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DashboardProvider } from './context';
import SearchModal from '@/components/SearchModal';
import NotificationsPanel from '@/components/NotificationsPanel';
import SessionTimeout from '@/components/SessionTimeout';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

const NAV_ITEMS = [
  { id: '', label: 'Dashboard', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { id: 'accounts', label: 'Accounts', icon: 'M2 17a5 5 0 0110 0M12 17a5 5 0 0110 0M7 7a4 4 0 100 0M17 7a4 4 0 100 0' },
  { id: 'transfers', label: 'Transfers', icon: 'M7 17l-4-4 4-4M3 13h18M17 7l4 4-4 4M21 11H3' },
  { id: 'payments', label: 'Pay Bills', icon: 'M2 5h20v14H2zM2 10h20' },
  { id: 'cards', label: 'Cards', icon: 'M1 4h22v16H1zM1 10h23M6 15h4' },
  { id: 'deposit', label: 'Deposit', icon: 'M12 2v10m0 0l-3-3m3 3l3-3M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3' },
  { id: 'statements', label: 'Statements', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8' },
];

const SUPPORT_ITEMS = [
  { id: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6z' },
  { id: 'help', label: 'Help & Support', icon: 'M12 22a10 10 0 100-20 10 10 0 000 20zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashData, setDashData] = useState<any>({ accounts: [], cards: [], transactions: [] });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me').then(async res => {
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    }).catch(() => { router.push('/login'); setLoading(false); });
  }, [router]);

  // Fetch dashboard data for search
  useEffect(() => {
    if (user) {
      fetch('/api/dashboard').then(r => r.ok ? r.json() : null).then(d => { if (d) setDashData(d); });
    }
  }, [user]);

  // Cmd+K / Ctrl+K shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const currentPage = pathname.replace('/dashboard', '').replace('/', '') || '';

  const pageTitle = {
    '': 'Dashboard',
    'accounts': 'Accounts & Activity',
    'transfers': 'Transfer Money',
    'payments': 'Bill Pay',
    'cards': 'Card Management',
    'statements': 'Statements & Documents',
    'deposit': 'Mobile Deposit',
    'settings': 'Settings',
  }[currentPage] || 'Dashboard';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-300 border-t-navy-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading your accounts...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`;

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gray-100 font-sans">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-[99] md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`w-[260px] bg-navy-900 text-white flex flex-col fixed top-0 left-0 bottom-0 z-[100] transition-transform duration-250 max-md:translate-x-[-100%] ${sidebarOpen ? 'max-md:translate-x-0' : ''}`}>
          <div className="px-5 pt-6 pb-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-cta-primary rounded-lg flex items-center justify-center font-bold text-white text-sm">M</div>
              <div>
                <div className="text-[17px] font-semibold tracking-tight">Meridian Bank</div>
                <div className="text-[10px] uppercase tracking-[1.5px] text-white/40 mt-0.5 font-medium">Online Banking</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-[1.5px] text-white/35 px-3 pb-2 pt-2 font-semibold">Main</div>
            {NAV_ITEMS.map(item => (
              <Link
                key={item.id}
                href={item.id ? `/dashboard/${item.id}` : '/dashboard'}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm no-underline transition-all ${currentPage === item.id ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/[0.06] hover:text-white/90'}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d={item.icon} /></svg>
                {item.label}
              </Link>
            ))}

            <div className="text-[10px] uppercase tracking-[1.5px] text-white/35 px-3 pb-2 pt-4 font-semibold">Support</div>
            {SUPPORT_ITEMS.map(item => (
              <Link
                key={item.id}
                href={item.id === 'help' ? '/help' : `/dashboard/${item.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm no-underline transition-all ${currentPage === item.id ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/[0.06] hover:text-white/90'}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d={item.icon} /></svg>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-white/[0.08]">
            <Link href="/dashboard/settings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer hover:bg-white/[0.06] no-underline transition-all">
              <div className="w-9 h-9 rounded-full bg-navy-700 flex items-center justify-center text-xs font-bold text-white">{initials}</div>
              <div>
                <div className="text-[13px] font-medium text-white">{user.first_name} {user.last_name}</div>
                <div className="text-[11px] text-white/40">{user.email}</div>
              </div>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-2 text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.06] cursor-pointer bg-transparent border-none font-sans transition-all w-full text-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-[260px] max-md:ml-0">
          <div className="sticky top-0 z-50 bg-white border-b border-gray-200 h-[60px] flex items-center justify-between px-6 max-md:px-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="hidden max-md:flex w-9 h-9 items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer">
                <svg viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" className="w-5 h-5"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
              <h1 className="text-[17px] font-semibold text-gray-900">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setShowSearch(true)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-all" title="Search (⌘K)">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" className="w-[18px] h-[18px]"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </button>
              <button onClick={() => setBalanceVisible(!balanceVisible)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-all" title={balanceVisible ? 'Hide balances' : 'Show balances'}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" className="w-[18px] h-[18px]">
                  {balanceVisible
                    ? <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z" />
                    : <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                  }
                </svg>
              </button>
              <button onClick={() => setShowNotifications(!showNotifications)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-all relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" className="w-[18px] h-[18px]"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-cta-primary rounded-full" />
              </button>
            </div>
          </div>

          <div className="p-6 max-md:p-4 max-md:pb-10">
            <DashboardProvider user={user} balanceVisible={balanceVisible}>
              {children}
            </DashboardProvider>
          </div>
        </main>
      </div>

      {showSearch && (
        <SearchModal
          accounts={dashData.accounts}
          cards={dashData.cards}
          transactions={dashData.transactions}
          onClose={() => setShowSearch(false)}
          onNavigate={(path) => router.push(path)}
        />
      )}

      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}

      <SessionTimeout />
    </ErrorBoundary>
  );
}
