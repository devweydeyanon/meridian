'use client';

import { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'security' | 'transaction' | 'alert' | 'info';
}

const NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Security Alert', message: 'Two-factor authentication is enabled on your account.', time: 'Just now', read: false, type: 'security' },
  { id: '2', title: 'Direct Deposit Received', message: 'Your payroll deposit of $5,200.00 has been credited to your checking account.', time: '2 hours ago', read: false, type: 'transaction' },
  { id: '3', title: 'Bill Payment Reminder', message: 'Your Xfinity payment of $85.00 is due in 3 days.', time: '1 day ago', read: false, type: 'alert' },
  { id: '4', title: 'Statement Ready', message: 'Your March 2026 statement is now available for download.', time: '2 days ago', read: true, type: 'info' },
  { id: '5', title: 'Card Transaction', message: 'A charge of $127.43 at Whole Foods Market was posted to your Visa ending in 3847.', time: '3 days ago', read: true, type: 'transaction' },
  { id: '6', title: 'Interest Credited', message: '$85.40 interest has been credited to your Premier Savings account.', time: '5 days ago', read: true, type: 'transaction' },
  { id: '7', title: 'Login From New Device', message: 'Your account was accessed from a new device in San Francisco, CA.', time: '1 week ago', read: true, type: 'security' },
];

interface NotificationsPanelProps {
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const iconColor: Record<string, string> = {
    security: 'bg-amber-50 text-amber-600',
    transaction: 'bg-emerald-50 text-emerald-600',
    alert: 'bg-red-50 text-red-500',
    info: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="fixed inset-0 z-[200]" onClick={onClose}>
      {/* Panel positioned from top-right */}
      <div className="absolute top-[60px] right-4 w-[380px] max-h-[500px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-md:right-2 max-md:w-[calc(100%-16px)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <div className="text-[15px] font-semibold text-gray-900">Notifications</div>
            {unreadCount > 0 && <div className="text-xs text-gray-400">{unreadCount} unread</div>}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs font-semibold text-accent-500 bg-transparent border-none cursor-pointer font-sans">Mark all read</button>
          )}
        </div>

        <div className="overflow-y-auto max-h-[400px]">
          {notifications.map(n => (
            <div key={n.id} className={`flex gap-3 px-5 py-3.5 border-b border-gray-50 transition-all ${n.read ? '' : 'bg-blue-50/30'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${iconColor[n.type]}`}>
                {n.type === 'security' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                {n.type === 'transaction' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>}
                {n.type === 'alert' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
                {n.type === 'info' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-[13px] font-medium text-gray-800">{n.title}</div>
                  {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />}
                </div>
                <div className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{n.message}</div>
                <div className="text-[11px] text-gray-400 mt-1">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
