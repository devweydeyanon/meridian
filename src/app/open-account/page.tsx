'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { useFormAutosave } from '@/components/useFormAutosave';

const products = [
  { id: 'checking', label: 'Checking', desc: 'Everyday banking with debit card and mobile access.', icon: 'M2 5h20v14H2z M2 10h20' },
  { id: 'savings', label: 'Savings & CDs', desc: 'Grow your money with competitive rates.', icon: 'M19 5c-1.5 0-2.8 1.4-3.5 2.5-.7-1.1-2-2.5-3.5-2.5C10.5 5 9 6.5 9 8c0 3.5 5 6 5 6s5-2.5 5-6c0-1.5-1.5-3-2-3z' },
  { id: 'credit-card', label: 'Credit Cards', desc: 'Earn rewards on every purchase.', icon: 'M1 4h22v16H1z M1 10h22' },
  { id: 'home-loan', label: 'Home Loans', desc: 'Mortgages and home equity solutions.', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'investing', label: 'Investing', desc: 'Build wealth with managed or self-directed portfolios.', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  { id: 'business', label: 'Business', desc: 'Accounts and tools for business owners.', icon: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' },
];

const stepLabels = ['Product', 'Personal', 'Employment', 'Review', 'Fund'];

const usStates = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

export default function OpenAccountPage() {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState('');
  const [form, update, clearForm] = useFormAutosave('open_account', {
    first_name: '', last_name: '', email: '', phone: '', dob: '',
    address: '', city: '', state: '', zip: '', ssn: '',
    employment: '', employer: '', job_title: '', income: '',
    other_income: '', other_source: '',
    agree1: false, agree2: false, agree3: false,
    routing: '', account_ext: '', deposit: '',
    password: '', confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const next = () => {
    setError('');
    if (step === 1 && !product) { setError('Please select a product.'); return; }
    if (step === 2) {
      if (!form.first_name || !form.last_name || !form.email || !form.dob || !form.address || !form.city || !form.state || !form.zip || !form.ssn) {
        setError('Please fill in all required fields.'); return;
      }
    }
    if (step === 3 && !form.employment) { setError('Please select your employment status.'); return; }
    if (step === 4) {
      if (!form.agree1 || !form.agree2 || !form.agree3) { setError('Please agree to all terms to continue.'); return; }
      if (!form.password || form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
      if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    }
    if (step === 5) { handleSubmit(); return; }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, first_name: form.first_name, last_name: form.last_name }),
      });
      if (res.ok) {
        clearForm();
        setStep(6);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
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
      <main id="main-content" className="bg-gray-50 min-h-[80vh] py-12 max-md:py-8">
        <div className="max-w-[640px] mx-auto px-4">

          {step <= 5 && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-[28px] font-extrabold text-gray-800 mb-1 max-md:text-[24px]">Open an account</h1>
                <p className="text-sm text-gray-500">Step {step} of 5 — {stepLabels[step - 1]}</p>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-1.5 mb-8">
                {stepLabels.map((label, i) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i + 1 <= step ? 'bg-navy-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {i + 1 < step ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : i + 1}
                    </div>
                    {i < 4 && <div className={`w-6 h-0.5 max-md:w-3 ${i + 1 < step ? 'bg-navy-900' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>
            </>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">{error}</div>}

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-md:p-6">

            {/* STEP 1 — Product */}
            {step === 1 && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Choose a product</h2>
                <p className="text-sm text-gray-500 mb-5">Select the type of account you&apos;d like to open.</p>
                <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                  {products.map((p) => (
                    <button key={p.id} onClick={() => { setProduct(p.id); setError(''); }} className={`flex items-start gap-3 p-4 rounded-lg border-2 text-left cursor-pointer bg-white font-sans transition-all ${product === p.id ? 'border-navy-900 bg-navy-900/[0.02]' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${product === p.id ? 'bg-navy-900/10 text-navy-900' : 'bg-gray-100 text-gray-500'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={p.icon} /></svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">{p.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* STEP 2 — Personal */}
            {step === 2 && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Personal information</h2>
                <p className="text-sm text-gray-500 mb-5">Tell us a bit about yourself to get started.</p>
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">First name *</label><input value={form.first_name} onChange={e => update('first_name', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Last name *</label><input value={form.last_name} onChange={e => update('last_name', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 max-md:grid-cols-1">
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email *</label><input value={form.email} onChange={e => update('email', e.target.value)} type="email" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Phone</label><input value={form.phone} onChange={e => update('phone', e.target.value)} type="tel" placeholder="(555) 000-0000" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                </div>
                <div className="mt-4"><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Date of birth *</label><input value={form.dob} onChange={e => update('dob', e.target.value)} type="date" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                <div className="mt-4"><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Street address *</label><input value={form.address} onChange={e => update('address', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                <div className="grid grid-cols-3 gap-4 mt-4 max-md:grid-cols-1">
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">City *</label><input value={form.city} onChange={e => update('city', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">State *</label><select value={form.state} onChange={e => update('state', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500 bg-white"><option value="">Select</option>{usStates.map(s => <option key={s}>{s}</option>)}</select></div>
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">ZIP *</label><input value={form.zip} onChange={e => update('zip', e.target.value)} maxLength={5} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                </div>
                <div className="mt-4"><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Social Security Number *</label><input value={form.ssn} onChange={e => update('ssn', e.target.value)} type="password" placeholder="•••-••-••••" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /><p className="text-xs text-gray-400 mt-1">Required for identity verification. Encrypted and secure.</p></div>
              </>
            )}

            {/* STEP 3 — Employment */}
            {step === 3 && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Employment information</h2>
                <p className="text-sm text-gray-500 mb-5">This helps us verify your application.</p>
                <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Employment status *</label><select value={form.employment} onChange={e => update('employment', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500 bg-white"><option value="">Select</option><option>Employed</option><option>Self-employed</option><option>Retired</option><option>Student</option><option>Unemployed</option></select></div>
                <div className="grid grid-cols-2 gap-4 mt-4 max-md:grid-cols-1">
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Employer name</label><input value={form.employer} onChange={e => update('employer', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Job title</label><input value={form.job_title} onChange={e => update('job_title', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                </div>
                <div className="mt-4"><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Annual income</label><input value={form.income} onChange={e => update('income', e.target.value)} placeholder="$" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                <div className="grid grid-cols-2 gap-4 mt-4 max-md:grid-cols-1">
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Other income (optional)</label><input value={form.other_income} onChange={e => update('other_income', e.target.value)} placeholder="$" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                  <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Source</label><input value={form.other_source} onChange={e => update('other_source', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                </div>
              </>
            )}

            {/* STEP 4 — Review */}
            {step === 4 && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Review & create credentials</h2>
                <p className="text-sm text-gray-500 mb-5">Confirm your details and set up your login.</p>
                <div className="bg-gray-50 rounded-lg p-5 mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Application summary</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Product', products.find(p => p.id === product)?.label || ''],
                      ['Name', `${form.first_name} ${form.last_name}`],
                      ['Email', form.email],
                      ['Address', `${form.city}, ${form.state} ${form.zip}`],
                      ['Employment', form.employment],
                    ].filter(([,v]) => v).map(([k, v]) => (
                      <div key={k} className="flex justify-between"><span className="text-gray-500">{k}</span><span className="font-semibold text-gray-800">{v}</span></div>
                    ))}
                  </div>
                </div>
                <div className="mb-4"><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Create password *</label><input value={form.password} onChange={e => update('password', e.target.value)} type="password" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /><p className="text-xs text-gray-400 mt-1">Min 8 characters, include uppercase and a number.</p></div>
                <div className="mb-6"><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Confirm password *</label><input value={form.confirm} onChange={e => update('confirm', e.target.value)} type="password" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                <div className="space-y-3">
                  {[
                    { f: 'agree1', t: 'I have read and agree to the Deposit Account Agreement and Electronic Consent.' },
                    { f: 'agree2', t: 'I have read and agree to the Privacy Policy and Terms of Service.' },
                    { f: 'agree3', t: 'I certify that the information provided is accurate and complete.' },
                  ].map((a) => (
                    <label key={a.f} className="flex items-start gap-2.5 cursor-pointer"><input type="checkbox" checked={(form as any)[a.f]} onChange={e => update(a.f, e.target.checked)} className="mt-0.5 w-4 h-4 accent-navy-900" /><span className="text-[13px] text-gray-600 leading-snug">{a.t}</span></label>
                  ))}
                </div>
              </>
            )}

            {/* STEP 5 — Fund */}
            {step === 5 && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Fund your account</h2>
                <p className="text-sm text-gray-500 mb-5">Link an external account to make your initial deposit. You can also skip this step.</p>
                <div><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Routing number</label><input value={form.routing} onChange={e => update('routing', e.target.value)} placeholder="9 digits" maxLength={9} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                <div className="mt-4"><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Account number</label><input value={form.account_ext} onChange={e => update('account_ext', e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                <div className="mt-4"><label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Deposit amount</label><input value={form.deposit} onChange={e => update('deposit', e.target.value)} placeholder="$25 minimum" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" /></div>
                <p className="text-xs text-gray-400 mt-3">Your deposit will be transferred within 1–3 business days. You can also fund later from the dashboard.</p>
              </>
            )}

            {/* STEP 6 — Success */}
            {step === 6 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0f7b3f" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h2 className="text-[24px] font-extrabold text-gray-800 mb-2">Your account is open!</h2>
                <p className="text-sm text-gray-500 mb-2">Welcome to Meridian Bank, {form.first_name}.</p>
                <p className="text-sm text-gray-500 mb-8">Your new {products.find(p => p.id === product)?.label} account is ready. A confirmation email has been sent to {form.email}.</p>
                <Link href="/dashboard">
                  <button className="px-8 py-3.5 text-[15px] font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 transition-all">Go to dashboard</button>
                </Link>
              </div>
            )}

            {/* Navigation */}
            {step <= 5 && (
              <div className="flex justify-between items-center mt-7 pt-5 border-t border-gray-200">
                {step > 1 ? (
                  <button onClick={() => { setStep(step - 1); setError(''); }} className="text-sm font-semibold text-gray-500 bg-transparent border-none cursor-pointer font-sans hover:text-gray-800">← Back</button>
                ) : <div />}
                <div className="flex gap-3">
                  {step === 5 && (
                    <button onClick={() => setStep(6)} className="px-6 py-2.5 text-sm font-semibold text-gray-500 bg-transparent border border-gray-300 rounded-md cursor-pointer font-sans hover:border-gray-400">Skip for now</button>
                  )}
                  <button onClick={next} disabled={loading} className="px-8 py-2.5 text-sm font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all disabled:opacity-60">
                    {loading ? 'Processing...' : step === 5 ? 'Fund & finish' : step === 4 ? 'Submit application' : 'Continue'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {step <= 5 && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account? <Link href="/login" className="text-accent-500 font-bold no-underline">Sign in</Link>
            </p>
          )}
        </div>
      </main>
      <Footer variant="personal" />
    </>
  );
}
