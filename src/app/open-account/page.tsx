'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

export default function OpenAccountPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setError('Please fill in all required fields.'); return;
    }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Registration failed.');
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
      <main id="main-content" className="bg-gray-50 py-12 max-md:py-8">
        <div className="max-w-[580px] mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-extrabold text-gray-800 mb-2 max-md:text-[24px]">Open an account</h1>
            <p className="text-sm text-gray-500">It takes just a few minutes to get started with Meridian Bank.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-md:p-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">{error}</div>}

            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">First name *</label>
                <input value={form.first_name} onChange={e => update('first_name', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Last name *</label>
                <input value={form.last_name} onChange={e => update('last_name', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email address *</label>
              <input value={form.email} onChange={e => update('email', e.target.value)} type="email" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
            </div>

            <div className="mt-4">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Phone number</label>
              <input value={form.phone} onChange={e => update('phone', e.target.value)} type="tel" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" placeholder="(555) 000-0000" />
            </div>

            <div className="mt-4">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Create password *</label>
              <input value={form.password} onChange={e => update('password', e.target.value)} type="password" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
              <p className="text-xs text-gray-400 mt-1">Min 8 characters, include uppercase and a number.</p>
            </div>

            <div className="mt-4">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Confirm password *</label>
              <input value={form.confirm} onChange={e => update('confirm', e.target.value)} type="password" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" />
            </div>

            <button onClick={handleSubmit} disabled={loading} className="w-full mt-6 py-3.5 text-[15px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-xs text-gray-400 mt-4 text-center leading-relaxed">
              By creating an account, you agree to our <Link href="/terms" className="text-accent-500 underline">Terms</Link> and <Link href="/privacy" className="text-accent-500 underline">Privacy Policy</Link>.
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link href="/login" className="text-accent-500 font-bold no-underline">Sign in</Link>
          </p>
        </div>
      </main>
      <Footer variant="personal" />
    </>
  );
}
