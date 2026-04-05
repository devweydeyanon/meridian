'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch {
      setError('Connection error.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center font-sans">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-[400px] mx-4">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-cta-primary rounded-lg flex items-center justify-center font-bold text-white text-sm">M</div>
          <div>
            <div className="text-[17px] font-semibold text-gray-900">Meridian Bank</div>
            <div className="text-[10px] uppercase tracking-[1.5px] text-gray-400 font-medium">Admin Portal</div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Sign In</h1>
        <p className="text-sm text-gray-500 mb-6">Authorized personnel only.</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-navy-900" placeholder="admin@meridianbank.com" />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-navy-900" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 text-sm font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 disabled:opacity-60 transition-all">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">This portal is for Meridian Bank administrators only. Unauthorized access is prohibited.</p>
      </div>
    </div>
  );
}
