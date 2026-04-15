'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { validators } from '@/lib/formValidation';

export function LoginPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const emailErr = validators.email(email);
    if (emailErr) e.email = emailErr;
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setApiError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.requiresVerification) {
          router.push(`/verify?email=${encodeURIComponent(data.email)}`);
        } else {
          router.push('/dashboard');
        }
      } else {
        setApiError(data.error || 'Invalid email or password.');
        setLoading(false);
      }
    } catch {
      setApiError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-2xl p-7 max-w-[400px] max-lg:max-w-full max-md:p-6 max-md:mb-8">
      <h2 className="text-xl font-extrabold text-gray-800 mb-1">Welcome back</h2>
      <p className="text-[13px] text-gray-500 mb-5">Sign in to manage your accounts.</p>

      {!expanded ? (
        <>
          <button
            onClick={() => setExpanded(true)}
            className="w-full py-3 text-[15px] font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans transition-all hover:bg-navy-800"
          >
            Sign in to Online Banking
          </button>
          <div className="flex justify-between mt-3.5 text-xs">
            <Link href="/forgot-password" className="text-accent-500 font-semibold no-underline">Forgot password?</Link>
            <Link href="/enroll" className="text-accent-500 font-semibold no-underline">Enroll now</Link>
          </div>
        </>
      ) : (
        <>
          {apiError && <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-lg p-2.5 mb-3.5">{apiError}</div>}

          <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Email address</label>
          <input
            type="email"
            autoComplete="username"
            name="identifier"
            value={email}
            onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }}
            className={`w-full px-3.5 py-2.5 text-sm border rounded-md outline-none mb-1 focus:ring-2 focus:ring-accent-500/10 ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-accent-500'}`}
            placeholder="you@example.com"
            autoFocus
          />
          {errors.email && <p className="text-xs text-red-500 mb-2">{errors.email}</p>}
          {!errors.email && <div className="mb-2.5" />}

          <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            name="credential"
            value={password}
            onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: '' })); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className={`w-full px-3.5 py-2.5 text-sm border rounded-md outline-none mb-1 focus:ring-2 focus:ring-accent-500/10 ${errors.password ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-accent-500'}`}
            placeholder="Enter password"
          />
          {errors.password && <p className="text-xs text-red-500 mb-2">{errors.password}</p>}
          {!errors.password && <div className="mb-3" />}

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
        </>
      )}
    </div>
  );
}
