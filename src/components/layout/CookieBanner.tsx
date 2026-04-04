'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('meridian_cookies');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('meridian_cookies', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('meridian_cookies', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy-900 text-white py-4 z-[10000] border-t border-white/10">
      <div className="max-w-container mx-auto px-6">
        <div className="flex items-center justify-between gap-5 flex-wrap max-md:flex-col max-md:text-center">
          <p className="text-[13px] text-white/75 leading-relaxed flex-1 min-w-[200px]">
            We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our{' '}
            <Link href="/privacy" className="text-accent-400 underline">Cookie Policy</Link>.
          </p>
          <div className="flex gap-2.5 shrink-0 max-md:w-full">
            <button onClick={accept} className="px-5 py-2.5 text-[13px] font-bold bg-white text-navy-900 border-none rounded-[5px] cursor-pointer font-sans max-md:flex-1">
              Accept all
            </button>
            <button onClick={decline} className="px-5 py-2.5 text-[13px] font-semibold bg-transparent text-white/70 border border-white/25 rounded-[5px] cursor-pointer font-sans max-md:flex-1">
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
