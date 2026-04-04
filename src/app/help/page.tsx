'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const categories = [
  { title: 'Accounts & Banking', icon: 'M2 5h20v14H2z M2 10h20', topics: ['Opening an account', 'Closing an account', 'Account statements', 'Direct deposit setup'] },
  { title: 'Cards & Payments', icon: 'M1 4h22v16H1z M1 10h22', topics: ['Lost or stolen card', 'Dispute a charge', 'Card activation', 'Payment due dates'] },
  { title: 'Transfers & Zelle', icon: 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14', topics: ['Wire transfers', 'Zelle setup', 'Transfer limits', 'International transfers'] },
  { title: 'Online & Mobile', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', topics: ['Login issues', 'Mobile app', 'Alerts & notifications', 'Bill pay'] },
  { title: 'Loans & Mortgages', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', topics: ['Apply for a loan', 'Mortgage rates', 'Payment options', 'Payoff request'] },
  { title: 'Security & Fraud', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', topics: ['Report fraud', 'Identity theft', 'Secure messaging', 'Two-factor auth'] },
];

const quickFaqs = [
  { q: 'How do I reset my online banking password?', a: 'Go to the login page and click "Forgot password?" Follow the prompts to verify your identity and create a new password.' },
  { q: 'What are Meridian\'s routing and account numbers?', a: 'Your routing number is 021000089. Your account number can be found in the mobile app under Account Details or on your statement.' },
  { q: 'How do I set up direct deposit?', a: 'Provide your employer with your Meridian routing number (021000089) and your account number. You can find both in the app.' },
  { q: 'How do I report a lost or stolen card?', a: 'Call 1-800-935-9935 immediately, or lock your card instantly through the mobile app under Card Controls.' },
  { q: 'What are the branch hours?', a: 'Most branches are open Monday-Friday 9am-5pm and Saturday 9am-1pm. Use our branch locator for specific locations.' },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Header variant="personal" />
      <main id="main-content">
        <section className="bg-navy-900 py-10 max-md:py-7">
          <div className="max-w-container mx-auto px-6">
            <h1 className="text-[30px] font-extrabold text-white mb-1.5 max-md:text-[24px]">Help Center</h1>
            <p className="text-[15px] text-white/60">Find answers, get support, and manage your accounts.</p>
          </div>
        </section>

        <section className="py-14 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-6 max-md:text-[22px]">Browse by topic</h2>
            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
              {categories.map((cat) => (
                <div key={cat.title} className="bg-white border border-gray-200 rounded-[10px] p-5 hover:border-accent-500/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3 max-md:mb-2">
                    <div className="w-10 h-10 bg-navy-900/5 rounded-[10px] flex items-center justify-center text-navy-700 shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={cat.icon} /></svg>
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-800">{cat.title}</h3>
                  </div>
                  <ul className="list-none space-y-1.5">
                    {cat.topics.map((topic) => (
                      <li key={topic}>
                        <Link href="/faqs" className="text-[13px] text-gray-500 hover:text-accent-500 no-underline">{topic}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 bg-gray-50 border-t border-gray-200 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-8 text-center max-md:text-[22px]">Frequently asked questions</h2>
            <div className="max-w-[760px] mx-auto">
              {quickFaqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-200">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full py-4 text-left text-[15px] font-bold text-gray-800 flex justify-between items-center cursor-pointer bg-transparent border-none font-sans hover:text-accent-600">
                    {faq.q}
                    <span className="text-xl text-gray-400 ml-4 shrink-0">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && <div className="pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</div>}
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
