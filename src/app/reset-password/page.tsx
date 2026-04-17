'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

function ResetContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const router = useRouter();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep] = useState<'code' | 'password' | 'done'>('code');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');
    if (value && index < 5) refs.current[index + 1]?.focus();
    if (newCode.every(d => d !== '') && value) verifyCode(newCode.join(''));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) refs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      refs.current[5]?.focus();
      verifyCode(pasted);
    }
  };

  const verifyCode = async (codeStr: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeStr }),
      });
      if (res.ok) {
        setStep('password');
      } else {
        setError('Invalid or expired code.');
        setCode(['', '', '', '', '', '']);
        refs.current[0]?.focus();
      }
    } catch {
      setError('Connection error.');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!/[A-Z]/.test(password)) { setError('Password must contain an uppercase letter.'); return; }
    if (!/\d/.test(password)) { setError('Password must contain a number.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep('done');
      } else {
        setError(data.error || 'Reset failed.');
      }
    } catch {
      setError('Connection error.');
    }
    setLoading(false);
  };

  if (!email) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-extrabold text-gray-800 mb-2">No email provided</h1>
        <p className="text-sm text-gray-500 mb-6">Please start the password reset process from the forgot password page.</p>
        <Link href="/forgot-password" className="text-accent-500 font-bold text-sm no-underline">Go to forgot password</Link>
      </div>
    );
  }

  return (
    <>
      {step === 'code' && (
        <div className="text-center">
          <div className="w-14 h-14 bg-navy-900/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="1.8" className="w-7 h-7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <h1 className="text-xl font-extrabold text-gray-800 mb-1">Enter verification code</h1>
          <p className="text-sm text-gray-500 mb-5">Enter the 6-digit code sent to <strong>{email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}</strong></p>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
          <div className="flex justify-center gap-2.5 mb-5" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input key={i} ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={e => handleInput(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)} disabled={loading}
                className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-lg outline-none transition-all ${error ? 'border-red-400' : digit ? 'border-navy-900' : 'border-gray-300 focus:border-navy-900'} disabled:opacity-50`}
              />
            ))}
          </div>
          {loading && <div className="flex items-center justify-center gap-2 text-sm text-gray-500"><div className="w-4 h-4 border-2 border-gray-300 border-t-navy-900 rounded-full animate-spin" />Verifying...</div>}
        </div>
      )}

      {step === 'password' && (
        <>
          <h1 className="text-xl font-extrabold text-gray-800 mb-1">Set new password</h1>
          <p className="text-sm text-gray-500 mb-5">Choose a strong password for your account.</p>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">New password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none mb-3 focus:border-accent-500" placeholder="8+ characters, uppercase, number" />
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Confirm password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReset()} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none mb-5 focus:border-accent-500" placeholder="Re-enter password" />
          <button onClick={handleReset} disabled={loading} className="w-full py-3 text-[15px] font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all disabled:opacity-60">
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </>
      )}

      {step === 'done' && (
        <div className="text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f7b3f" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="text-xl font-extrabold text-gray-800 mb-2">Password reset!</h1>
          <p className="text-sm text-gray-500 mb-6">Your password has been updated. You can now sign in with your new password.</p>
          <Link href="/login"><button className="w-full py-3 text-[15px] font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all">Sign in</button></Link>
        </div>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Header variant="personal" />
      <main id="main-content" className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-16 max-md:py-10">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 w-full max-w-[420px] mx-4 max-md:p-7">
          <Suspense fallback={<div className="text-center py-10"><div className="w-8 h-8 border-3 border-gray-300 border-t-navy-900 rounded-full animate-spin mx-auto" /></div>}>
            <ResetContent />
          </Suspense>
        </div>
      </main>
      <Footer variant="personal" />
    </>
  );
}
