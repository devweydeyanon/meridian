'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function LoginPanel() {
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
        setError(data.error || 'Invalid credentials.');
        setLoading(false);
      }
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-7 max-w-[400px] max-lg:max-w-full max-md:p-6 max-md:mb-8">
      <h2 className="text-xl font-extrabold text-gray-800 mb-1">Welcome back</h2>
      <p className="text-[13px] text-gray-500 mb-5">Sign in to manage your accounts.</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-lg p-2.5 mb-3.5">{error}</div>}

      <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Username or email</label>
      <input
        type="text"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none mb-3.5 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10"
        placeholder="Enter username"
      />

      <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Password</label>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleLogin()}
        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none mb-4 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10"
        placeholder="Enter password"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full py-3 text-[15px] font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans transition-all hover:bg-navy-800 disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="flex justify-between mt-3.5 text-xs">
        <Link href="/forgot-password" className="text-accent-500 font-semibold no-underline">Forgot password?</Link>
        <Link href="/enroll" className="text-accent-500 font-semibold no-underline">Enroll now</Link>
      </div>
    </div>
  );
}
