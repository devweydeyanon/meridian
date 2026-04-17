'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Account {
  id: number; type: string; name: string; account_number: string;
  balance: number; available: number; pending: number;
  apy?: string; maturity_date?: string; status: string;
}

interface Card {
  id: number; linked_account_id: number; type: string; name: string;
  card_number: string; credit_limit: number; balance: number;
  available: number; min_payment: number; due_date?: string;
  daily_limit: number; rewards?: string; status: string;
  linkedAccount?: string;
}

interface Transaction {
  id: number; account_id: number; card_id?: number;
  description: string; amount: number; type: string;
  category: string; status: string; date: string;
  account_name?: string;
}

interface Payee {
  id: number; name: string; category: string;
  last_paid?: string; last_amount: number;
}

interface DashboardUser {
  id: number; email: string; first_name: string; last_name: string;
  phone?: string; member_id?: string;
  dob?: string;
  address?: string; city?: string; state?: string; zip?: string;
}

interface DashboardContextType {
  user: DashboardUser;
  balanceVisible: boolean;
  accounts: Account[];
  cards: Card[];
  transactions: Transaction[];
  payees: Payee[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextType>({
  user: { id: 0, email: '', first_name: '', last_name: '' },
  balanceVisible: true,
  accounts: [], cards: [], transactions: [], payees: [],
  loading: true,
  refreshData: async () => {},
});

export function useDashboard() {
  return useContext(DashboardContext);
}

export function DashboardProvider({ user, balanceVisible, children }: {
  user: DashboardUser; balanceVisible: boolean; children: React.ReactNode;
}) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payees, setPayees] = useState<Payee[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
        setCards(data.cards || []);
        setTransactions(data.transactions || []);
        setPayees(data.payees || []);
      }
    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  return (
    <DashboardContext.Provider value={{ user, balanceVisible, accounts, cards, transactions, payees, loading, refreshData }}>
      {children}
    </DashboardContext.Provider>
  );
}

// Utility functions
export const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export const fmtDate = (d: string) => {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const groupByDate = (txns: Transaction[]) => {
  const groups: Record<string, Transaction[]> = {};
  txns.forEach(t => {
    const label = fmtDate(t.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
  });
  return groups;
};
