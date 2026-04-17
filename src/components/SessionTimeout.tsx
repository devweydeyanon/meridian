'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_MS = 2 * 60 * 1000;  // warn 2 minutes before

export default function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const router = useRouter();

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    setCountdown(120);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const startTimer = () => {
      clearTimeout(timeout);
      clearInterval(interval);

      // Show warning before timeout
      timeout = setTimeout(() => {
        setShowWarning(true);
        setCountdown(120);
        interval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              fetch('/api/auth/logout', { method: 'POST' }).then(() => router.push('/login'));
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, TIMEOUT_MS - WARNING_MS);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      if (!showWarning) startTimer();
    };

    events.forEach(e => window.addEventListener(e, handleActivity));
    startTimer();

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      events.forEach(e => window.removeEventListener(e, handleActivity));
    };
  }, [router, showWarning]);

  const extend = () => {
    resetTimer();
    // Touch the server to keep session alive
    fetch('/api/auth/me');
  };

  if (!showWarning) return null;

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[300] backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl p-8 max-w-[380px] w-[90%] shadow-lg text-center">
        <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" className="w-7 h-7"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Session expiring</h3>
        <p className="text-sm text-gray-500 mb-1">For your security, your session will expire in</p>
        <p className="text-3xl font-bold text-gray-900 mb-4 font-mono">{mins}:{String(secs).padStart(2, '0')}</p>
        <p className="text-xs text-gray-400 mb-5">Click below to stay signed in.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { fetch('/api/auth/logout', { method: 'POST' }).then(() => router.push('/login')); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans hover:bg-gray-50">Sign out</button>
          <button onClick={extend} className="px-5 py-2.5 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800">Stay signed in</button>
        </div>
      </div>
    </div>
  );
}
