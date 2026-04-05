'use client';

import { useState, useRef, useEffect } from 'react';

interface OtpModalProps {
  email: string;
  action: string;
  actionLabel: string;
  onVerified: () => void;
  onCancel: () => void;
}

export default function OtpModal({ email, action, actionLabel, onVerified, onCancel }: OtpModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Send OTP on mount
  useEffect(() => {
    sendCode();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const sendCode = async () => {
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action }),
      });
      if (res.ok) {
        setSent(true);
        setCountdown(60);
        setTimeout(() => refs.current[0]?.focus(), 100);
      } else {
        setError('Failed to send verification code.');
      }
    } catch {
      setError('Connection error.');
    }
    setSending(false);
  };

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');
    if (value && index < 5) refs.current[index + 1]?.focus();
    if (newCode.every(d => d !== '') && value) verify(newCode.join(''));
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
      verify(pasted);
    }
  };

  const verify = async (codeStr: string) => {
    setVerifying(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeStr }),
      });
      if (res.ok) {
        onVerified();
      } else {
        setError('Invalid or expired code.');
        setCode(['', '', '', '', '', '']);
        refs.current[0]?.focus();
      }
    } catch {
      setError('Connection error.');
    }
    setVerifying(false);
  };

  const masked = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] backdrop-blur-[2px]" onClick={onCancel}>
      <div className="bg-white rounded-2xl p-8 max-w-[420px] w-[90%] shadow-lg" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-14 h-14 bg-navy-900/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="1.8" className="w-7 h-7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-1">Verify to {actionLabel}</h3>
          <p className="text-sm text-gray-500 mb-5">
            {sending ? 'Sending verification code...' : <>We sent a 6-digit code to <strong>{masked}</strong></>}
          </p>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-2.5 mb-4">{error}</div>}

          {sending ? (
            <div className="py-6">
              <div className="w-8 h-8 border-[3px] border-gray-200 border-t-navy-900 rounded-full animate-spin mx-auto" />
            </div>
          ) : verifying ? (
            <div className="py-6">
              <div className="w-8 h-8 border-[3px] border-gray-200 border-t-navy-900 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Verifying...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-2.5 mb-5" onPaste={handlePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { refs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleInput(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-lg outline-none transition-all ${error ? 'border-red-400' : digit ? 'border-navy-900' : 'border-gray-300 focus:border-navy-900'}`}
                  />
                ))}
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Didn&apos;t receive it?{' '}
                <button onClick={sendCode} disabled={countdown > 0} className="text-accent-500 font-semibold bg-transparent border-none cursor-pointer font-sans disabled:text-gray-400">
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                </button>
              </p>
            </>
          )}

          <button onClick={onCancel} className="text-sm text-gray-500 bg-transparent border-none cursor-pointer font-sans hover:text-gray-700 mt-2">Cancel</button>
        </div>
      </div>
    </div>
  );
}
