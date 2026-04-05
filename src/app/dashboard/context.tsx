'use client';

import { createContext, useContext } from 'react';

interface DashboardUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  account_number?: string;
  balance?: number;
  savings_balance?: number;
  member_since?: string;
}

interface DashboardContextType {
  user: DashboardUser;
  balanceVisible: boolean;
}

export const DashboardContext = createContext<DashboardContextType>({
  user: { id: 0, email: '', first_name: '', last_name: '' },
  balanceVisible: true,
});

export function useDashboard() {
  return useContext(DashboardContext);
}

// Demo data for when API doesn't return full account info
export const ACCOUNTS = [
  { id: 'chk-001', type: 'checking', name: 'Meridian Total Checking', number: '****4821', balance: 12847.53, available: 12647.53, pending: 200.00, status: 'active' },
  { id: 'sav-001', type: 'savings', name: 'Meridian Premier Savings', number: '****7392', balance: 45230.18, available: 45230.18, pending: 0, status: 'active', apy: '4.25%' },
  { id: 'sav-002', type: 'savings', name: 'Emergency Fund', number: '****1156', balance: 8500.00, available: 8500.00, pending: 0, status: 'active', apy: '4.25%' },
  { id: 'cd-001', type: 'cd', name: '12-Month CD', number: '****5501', balance: 25000.00, available: 0, pending: 0, status: 'active', apy: '4.75%', maturity: 'Mar 15, 2027' },
];

export interface Card {
  id: string;
  type: 'credit' | 'debit';
  name: string;
  number: string;
  status: string;
  limit?: number;
  balance?: number;
  available?: number;
  minPayment?: number;
  dueDate?: string;
  rewards?: string;
  linkedAccount?: string;
  dailyLimit?: number;
}

export const CARDS: Card[] = [
  { id: 'cc-001', type: 'credit', name: 'Meridian Rewards Visa', number: '****3847', limit: 15000, balance: 2341.67, available: 12658.33, minPayment: 35.00, dueDate: 'Apr 22, 2026', status: 'active', rewards: '24,580 pts' },
  { id: 'cc-002', type: 'credit', name: 'Meridian Cash Back Mastercard', number: '****9012', limit: 8000, balance: 567.23, available: 7432.77, minPayment: 25.00, dueDate: 'Apr 18, 2026', status: 'active', rewards: '$42.15' },
  { id: 'dc-001', type: 'debit', name: 'Meridian Debit Card', number: '****4821', linkedAccount: 'Meridian Total Checking', status: 'active', dailyLimit: 5000 },
];

export const TRANSACTIONS = [
  { id: 't1', date: '2026-04-02', description: 'Direct Deposit — Employer', amount: 3250.00, type: 'credit', category: 'Income', account: 'chk-001', status: 'posted' },
  { id: 't2', date: '2026-04-02', description: 'Whole Foods Market', amount: -87.43, type: 'debit', category: 'Groceries', account: 'chk-001', status: 'pending' },
  { id: 't3', date: '2026-04-01', description: 'Netflix Subscription', amount: -15.99, type: 'debit', category: 'Entertainment', account: 'cc-001', status: 'posted' },
  { id: 't4', date: '2026-04-01', description: 'Transfer to Savings', amount: -500.00, type: 'debit', category: 'Transfer', account: 'chk-001', status: 'posted' },
  { id: 't5', date: '2026-04-01', description: 'Transfer from Checking', amount: 500.00, type: 'credit', category: 'Transfer', account: 'sav-001', status: 'posted' },
  { id: 't6', date: '2026-03-31', description: 'Shell Gas Station', amount: -52.18, type: 'debit', category: 'Auto', account: 'chk-001', status: 'posted' },
  { id: 't7', date: '2026-03-31', description: 'Amazon.com', amount: -124.99, type: 'debit', category: 'Shopping', account: 'cc-001', status: 'posted' },
  { id: 't8', date: '2026-03-30', description: 'Starbucks', amount: -6.45, type: 'debit', category: 'Dining', account: 'chk-001', status: 'posted' },
  { id: 't9', date: '2026-03-30', description: 'Meridian Mortgage Payment', amount: -1842.00, type: 'debit', category: 'Housing', account: 'chk-001', status: 'posted' },
  { id: 't10', date: '2026-03-29', description: 'Uber', amount: -23.50, type: 'debit', category: 'Transport', account: 'cc-002', status: 'posted' },
  { id: 't11', date: '2026-03-29', description: 'CVS Pharmacy', amount: -18.75, type: 'debit', category: 'Health', account: 'chk-001', status: 'posted' },
  { id: 't12', date: '2026-03-28', description: 'Interest Payment', amount: 15.82, type: 'credit', category: 'Interest', account: 'sav-001', status: 'posted' },
  { id: 't13', date: '2026-03-28', description: 'Chipotle Mexican Grill', amount: -12.95, type: 'debit', category: 'Dining', account: 'chk-001', status: 'posted' },
  { id: 't14', date: '2026-03-27', description: 'AT&T Wireless', amount: -89.00, type: 'debit', category: 'Bills', account: 'chk-001', status: 'posted' },
  { id: 't15', date: '2026-03-27', description: 'Zelle — Sarah M.', amount: -150.00, type: 'debit', category: 'Transfer', account: 'chk-001', status: 'posted' },
];

export const PAYEES = [
  { id: 'p1', name: 'Electric Company', category: 'Utilities', lastPaid: 'Mar 15, 2026', amount: 142.50 },
  { id: 'p2', name: 'Water & Sewer', category: 'Utilities', lastPaid: 'Mar 20, 2026', amount: 67.80 },
  { id: 'p3', name: 'Internet Provider', category: 'Utilities', lastPaid: 'Mar 22, 2026', amount: 79.99 },
  { id: 'p4', name: 'Auto Insurance', category: 'Insurance', lastPaid: 'Mar 1, 2026', amount: 156.00 },
  { id: 'p5', name: 'Credit Card Payment', category: 'Finance', lastPaid: 'Mar 25, 2026', amount: 500.00 },
];

export const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export const fmtDate = (d: string) => {
  const date = new Date(d + 'T12:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const groupByDate = (txns: typeof TRANSACTIONS) => {
  const groups: Record<string, typeof TRANSACTIONS> = {};
  txns.forEach(t => {
    const label = fmtDate(t.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
  });
  return groups;
};
