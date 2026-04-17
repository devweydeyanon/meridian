'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'password_reset' }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setSent(true); // Still show success to prevent enumeration
      }
    } catch {
      setSent(true);
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
              <p className="text-sm text-gray-500 mb-6">We&apos;ve sent a 6-digit verification code to <strong>{email}</strong>. Enter it on the next page to reset your password.</p>
              <button onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)} className="w-full py-3 text-[15px] font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all mb-4">
                Enter code
              </button>
              <Link href="/login" className="text-accent-500 font-bold text-sm no-underline">Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Forgot password?</h1>
              <p className="text-sm text-gray-500 mb-6">Enter your email and we&apos;ll send you a verification code.</p>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} type="email" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none mb-5 focus:border-accent-500" placeholder="you@example.com" />
              <button onClick={handleSubmit} disabled={loading} className="w-full py-3 text-[15px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all disabled:opacity-60">
                {loading ? 'Sending...' : 'Send verification code'}
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
