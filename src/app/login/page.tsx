'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed.');
        setLoading(false);
      }
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Header variant="personal" />
      <main id="main-content" className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-16 max-md:py-10">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 w-full max-w-[420px] mx-4 max-md:p-7">
          <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-6">Access your Meridian Bank accounts.</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}

          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email or username</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="text" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none mb-4 focus:border-accent-500" placeholder="Enter email" />

          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} type="password" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none mb-5 focus:border-accent-500" placeholder="Enter password" />

          <button onClick={handleLogin} disabled={loading} className="w-full py-3 text-[15px] font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all disabled:opacity-60 mb-4">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="flex justify-between text-xs">
            <Link href="/forgot-password" className="text-accent-500 font-semibold no-underline">Forgot password?</Link>
            <Link href="/enroll" className="text-accent-500 font-semibold no-underline">Enroll in online banking</Link>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 mb-3">Don&apos;t have an account?</p>
            <Link href="/open-account">
              <button className="w-full py-2.5 text-sm font-bold text-cta-primary bg-white border-2 border-cta-primary rounded-md cursor-pointer font-sans hover:bg-cta-primary hover:text-white transition-all">
                Open an account
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer variant="personal" />
    </>
  );
}
