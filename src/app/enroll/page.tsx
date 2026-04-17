'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { validators, formatters } from '@/lib/formValidation';

export default function EnrollPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ account: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const updateFormatted = (field: string, value: string, formatter: (v: string) => string) => {
    update(field, formatter(value));
  };

  const nextStep = () => {
    const fe: Record<string, string> = {};

    if (step === 1) {
      const acc = validators.required(form.account, 'Account number'); if (acc) fe.account = acc;
    }
    if (step === 2) {
      const em = validators.email(form.email); if (em) fe.email = em;
      const pw = validators.password(form.password); if (pw) fe.password = pw;
      if (!fe.password) { const pm = validators.passwordMatch(form.password, form.confirm); if (pm) fe.confirm = pm; }
    }

    setFieldErrors(fe);
    if (Object.keys(fe).length > 0) { setError('Please fix the errors below.'); return; }
    setError('');
    if (step < 3) setStep(step + 1);
    else handleEnroll();
  };

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, first_name: 'Account', last_name: 'Holder' }),
      });
      if (res.ok) router.push('/dashboard');
      else { setError('Enrollment failed. Please try again.'); setLoading(false); }
    } catch { setError('Connection error.'); setLoading(false); }
  };

  return (
    <>
      <Header variant="personal" />
      <main id="main-content" className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-16 max-md:py-10">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 w-full max-w-[460px] mx-4 max-md:p-7">
          <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Enroll in online banking</h1>
          <p className="text-sm text-gray-500 mb-6">Step {step} of 3</p>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${s <= step ? 'bg-navy-900 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-navy-900' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}

          {step === 1 && (
            <>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Account or card number</label>
              <input value={form.account} onChange={e => updateFormatted('account', e.target.value, formatters.accountNumber)} className={`w-full px-3.5 py-2.5 text-sm border rounded-md outline-none focus:ring-2 focus:ring-accent-500/10 ${fieldErrors.account ? 'border-red-400' : 'border-gray-300 focus:border-accent-500'} mb-1`} placeholder="Enter your account number" />
              {fieldErrors.account && <p className="text-xs text-red-500 mb-2">{fieldErrors.account}</p>}
              {!fieldErrors.account && <div className="mb-3" />}
            </>
          )}

          {step === 2 && (
            <>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email address</label>
              <input value={form.email} onChange={e => update('email', e.target.value)} type="email" className={`w-full px-3.5 py-2.5 text-sm border rounded-md outline-none focus:ring-2 focus:ring-accent-500/10 ${fieldErrors.email ? 'border-red-400' : 'border-gray-300 focus:border-accent-500'} mb-1`} />
              {fieldErrors.email && <p className="text-xs text-red-500 mb-2">{fieldErrors.email}</p>}
              {!fieldErrors.email && <div className="mb-3" />}
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Create password</label>
              <input value={form.password} onChange={e => update('password', e.target.value)} type="password" className={`w-full px-3.5 py-2.5 text-sm border rounded-md outline-none focus:ring-2 focus:ring-accent-500/10 ${fieldErrors.password ? 'border-red-400' : 'border-gray-300 focus:border-accent-500'} mb-1`} />
              {fieldErrors.password && <p className="text-xs text-red-500 mb-2">{fieldErrors.password}</p>}
              {!fieldErrors.password && <div className="mb-3" />}
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Confirm password</label>
              <input value={form.confirm} onChange={e => update('confirm', e.target.value)} type="password" className={`w-full px-3.5 py-2.5 text-sm border rounded-md outline-none focus:ring-2 focus:ring-accent-500/10 ${fieldErrors.confirm ? 'border-red-400' : 'border-gray-300 focus:border-accent-500'} mb-1`} />
              {fieldErrors.confirm && <p className="text-xs text-red-500 mb-2">{fieldErrors.confirm}</p>}
              {!fieldErrors.confirm && <div className="mb-4" />}
            </>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-navy-900/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Confirm enrollment</h2>
              <p className="text-sm text-gray-500 mb-4">You&apos;re enrolling with email: <strong>{form.email}</strong></p>
            </div>
          )}

          <button onClick={nextStep} disabled={loading} className="w-full py-3 text-[15px] font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all disabled:opacity-60">
            {loading ? 'Processing...' : step === 3 ? 'Complete enrollment' : 'Continue'}
          </button>

          {step > 1 && (
            <button onClick={() => { setStep(step - 1); setError(''); }} className="w-full py-2.5 text-sm font-semibold text-gray-500 bg-transparent border-none cursor-pointer mt-2">
              Back
            </button>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already enrolled? <Link href="/login" className="text-accent-500 font-bold no-underline">Sign in</Link>
          </p>
        </div>
      </main>
      <Footer variant="personal" />
    </>
  );
}
