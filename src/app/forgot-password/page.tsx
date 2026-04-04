'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setSent(true); // Still show success to prevent email enumeration
    }
    setLoading(false);
  };

  return (
    <>
      <Header variant="personal" />
      <main id="main-content" className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-16 max-md:py-10">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 w-full max-w-[420px] mx-4 max-md:p-7">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f7b3f" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h1 className="text-xl font-extrabold text-gray-800 mb-2">Check your email</h1>
              <p className="text-sm text-gray-500 mb-6">If an account exists for {email}, we&apos;ve sent a password reset link. Check your inbox.</p>
              <Link href="/login" className="text-accent-500 font-bold text-sm no-underline">Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Forgot password?</h1>
              <p className="text-sm text-gray-500 mb-6">Enter your email and we&apos;ll send you a reset link.</p>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} type="email" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none mb-5 focus:border-accent-500" placeholder="you@example.com" />
              <button onClick={handleSubmit} disabled={loading} className="w-full py-3 text-[15px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all disabled:opacity-60">
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                <Link href="/login" className="text-accent-500 font-semibold no-underline">Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </main>
      <Footer variant="personal" />
    </>
  );
}
