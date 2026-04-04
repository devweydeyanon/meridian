'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const sideCards = [
  { title: 'Call us', desc: 'Available 24/7', link: 'tel:18006374342', linkText: '1-800-MERIDIAN', icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z' },
  { title: 'Secure message', desc: 'Sign in to send a secure message', link: '/login', linkText: 'Sign in →', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
  { title: 'Visit a branch', desc: '500+ locations nationwide', link: '/branches', linkText: 'Find a branch →', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' },
  { title: 'Report fraud', desc: 'Suspected unauthorized activity?', link: '/security', linkText: 'Security Center →', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { title: 'Mail', desc: 'Meridian Bank, N.A.\nP.O. Box 15000\nWilmington, DE 19850', link: '', linkText: '', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
];

const departments = [
  { name: 'Personal Banking', phone: '1-800-637-4342' },
  { name: 'Business Banking', phone: '1-800-249-6374' },
  { name: 'Mortgage', phone: '1-800-764-8243' },
  { name: 'Credit Cards', phone: '1-800-527-4637' },
  { name: 'Lost/Stolen Cards', phone: '1-800-935-9935' },
  { name: 'International', phone: '+1-302-552-3100' },
];

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async () => {
    const form = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('.form-field');
    const fields = ['first_name', 'last_name', 'email', 'phone', 'topic', 'account_number', 'message'];
    const data: Record<string, string> = {};
    form.forEach((el, i) => { if (fields[i]) data[fields[i]] = el.value; });

    if (!data.email || !data.message) { alert('Please enter your email and message.'); return; }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('sent');
        form.forEach(el => { el.value = ''; });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Header variant="personal" />
      <main id="main-content">
        <section className="bg-navy-900 py-10 max-md:py-7">
          <div className="max-w-container mx-auto px-6">
            <div className="text-[12.5px] text-white/40 mb-3">
              <Link href="/" className="text-white/50 no-underline">Home</Link>{' / '}<span className="text-white/70">Contact Us</span>
            </div>
            <h1 className="text-[30px] font-extrabold text-white mb-1.5 max-md:text-[24px]">Contact us</h1>
            <p className="text-[15px] text-white/60">Send us a message or reach out through one of the options below.</p>
          </div>
        </section>

        <div className="max-w-container mx-auto px-6 py-14 max-md:py-8">
          <div className="grid grid-cols-[1fr_380px] gap-10 items-start max-lg:grid-cols-1">
            {/* Form */}
            <div className="bg-white border border-gray-200 rounded-xl p-9 shadow-sm max-md:p-6">
              <h2 className="text-[22px] font-bold text-gray-800 mb-1">Send us a message</h2>
              <p className="text-sm text-gray-500 mb-6">We&apos;ll get back to you within 1 business day.</p>

              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">First name</label>
                  <input className="form-field w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" placeholder="First name" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Last name</label>
                  <input className="form-field w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" placeholder="Last name" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email address</label>
                <input className="form-field w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" type="email" placeholder="you@example.com" />
              </div>
              <div className="mt-4">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Phone (optional)</label>
                <input className="form-field w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" type="tel" placeholder="(555) 000-0000" />
              </div>
              <div className="mt-4">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Topic</label>
                <select className="form-field w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500 bg-white">
                  <option>Select a topic...</option>
                  <option>Account inquiry</option>
                  <option>Open a new account</option>
                  <option>Credit card question</option>
                  <option>Loan or mortgage</option>
                  <option>Online/mobile banking</option>
                  <option>Dispute or fraud</option>
                  <option>Feedback or complaint</option>
                  <option>Business banking</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Account number (optional)</label>
                <input className="form-field w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500" placeholder="If you have an existing account" />
              </div>
              <div className="mt-4">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Message</label>
                <textarea className="form-field w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-accent-500 min-h-[120px] resize-y" placeholder="How can we help you?" />
              </div>

              <button onClick={handleSubmit} disabled={status === 'sending'} className="w-full mt-6 py-3 text-[15px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all disabled:opacity-60">
                {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Message sent!' : 'Send message'}
              </button>
              {status === 'error' && <p className="text-sm text-red-500 mt-2">Failed to send. Please try again.</p>}
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">For urgent matters like lost cards or suspected fraud, please call us directly at 1-800-MERIDIAN.</p>
            </div>

            {/* Side Cards */}
            <div className="flex flex-col gap-4 max-lg:flex-row max-lg:flex-wrap max-md:flex-col">
              {sideCards.map((card) => (
                <div key={card.title} className="bg-white border border-gray-200 rounded-[10px] p-5 flex gap-3.5 items-start hover:border-accent-500/40 transition-all max-lg:flex-1 max-lg:min-w-[260px] max-md:min-w-0">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-accent-500 shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={card.icon} /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-0.5">{card.title}</h4>
                    <p className="text-[12.5px] text-gray-500 leading-snug whitespace-pre-line">{card.desc}</p>
                    {card.link && (
                      <Link href={card.link} className="text-[12.5px] font-bold text-accent-500 mt-1 inline-block no-underline">{card.linkText}</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Numbers */}
        <section className="py-12 bg-gray-50 border-t border-gray-200 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Department phone numbers</h2>
            <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
              {departments.map((dept) => (
                <div key={dept.name} className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-[13px] font-bold text-gray-800 mb-0.5">{dept.name}</h4>
                  <p className="text-[13px] font-semibold text-accent-500">{dept.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer variant="personal" />
    </>
  );
}
