'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const faqGroups = [
  { title: 'Accounts', faqs: [
    { q: 'What do I need to open an account?', a: 'A government-issued photo ID, Social Security number, and an initial deposit. You can apply online in minutes.' },
    { q: 'How do I close my account?', a: 'Visit any branch or call 1-800-MERIDIAN. Make sure all pending transactions have cleared first.' },
    { q: 'Can I have multiple checking accounts?', a: 'Yes, you can open multiple checking and savings accounts under one profile.' },
    { q: 'How do I switch my direct deposit?', a: 'Provide your employer with routing number 021000089 and your new account number.' },
  ]},
  { title: 'Online & Mobile Banking', faqs: [
    { q: 'How do I enroll in online banking?', a: 'Visit our enrollment page with your account number, SSN, and email. Setup takes about 5 minutes.' },
    { q: 'I forgot my password. How do I reset it?', a: 'Click "Forgot password" on the login page. Verify your identity via email or text, then create a new password.' },
    { q: 'Is mobile banking secure?', a: 'Yes. We use 256-bit encryption, biometric login, and real-time fraud monitoring to protect your accounts.' },
    { q: 'How do I deposit a check with my phone?', a: 'Open the mobile app, tap "Deposit," take photos of the front and back of your check, and confirm the amount.' },
  ]},
  { title: 'Cards & Payments', faqs: [
    { q: 'How do I report a lost or stolen card?', a: 'Call 1-800-935-9935 immediately or lock your card through the mobile app under Card Controls.' },
    { q: 'How do I dispute a transaction?', a: 'Call us or submit a dispute through online banking. We\'ll investigate and issue a provisional credit within 10 days.' },
    { q: 'When is my credit card payment due?', a: 'Your due date is shown on your monthly statement and in the mobile app. Set up autopay to never miss a payment.' },
  ]},
  { title: 'Loans & Mortgages', faqs: [
    { q: 'What credit score do I need for a mortgage?', a: 'Generally 620+ for conventional loans, though FHA loans may accept lower scores. Better scores get better rates.' },
    { q: 'Can I pay off my loan early?', a: 'Yes, there are no prepayment penalties on any Meridian personal loan, auto loan, or mortgage.' },
    { q: 'How long does mortgage approval take?', a: 'Pre-approval takes minutes online. Full approval typically takes 30-45 days depending on documentation.' },
  ]},
  { title: 'Security', faqs: [
    { q: 'How do I protect myself from phishing?', a: 'Meridian will never ask for your password via email or text. Always log in directly through our app or website.' },
    { q: 'What is Zero Liability protection?', a: 'You won\'t be held responsible for unauthorized transactions on your Meridian accounts, as long as you report them promptly.' },
    { q: 'How do I enable two-factor authentication?', a: 'Go to Settings > Security in online banking or the mobile app. Choose text message or authenticator app verification.' },
  ]},
];

export default function FAQsPage() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const filtered = faqGroups.map(group => ({
    ...group,
    faqs: group.faqs.filter(f =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(group => group.faqs.length > 0);

  return (
    <>
      <Header variant="personal" />
      <main id="main-content">
        <section className="bg-navy-900 py-10 max-md:py-7">
          <div className="max-w-container mx-auto px-6">
            <h1 className="text-[30px] font-extrabold text-white mb-1.5 max-md:text-[24px]">Frequently Asked Questions</h1>
            <p className="text-[15px] text-white/60 mb-6">Find answers to common banking questions.</p>
            <div className="max-w-[560px] max-md:max-w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full px-4 py-3 text-sm rounded-lg border-none outline-none"
              />
            </div>
          </div>
        </section>

        <section className="py-14 max-md:py-8">
          <div className="max-w-[800px] mx-auto px-6">
            {filtered.map((group) => (
              <div key={group.title} className="mb-10">
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-navy-900">{group.title}</h2>
                {group.faqs.map((faq, i) => {
                  const key = `${group.title}-${i}`;
                  return (
                    <div key={key} className="border-b border-gray-200">
                      <button
                        onClick={() => setOpenFaq(openFaq === key ? null : key)}
                        className="w-full py-4 text-left text-[15px] font-bold text-gray-800 flex justify-between items-center cursor-pointer bg-transparent border-none font-sans hover:text-accent-600"
                      >
                        {faq.q}
                        <span className="text-xl text-gray-400 ml-4 shrink-0">{openFaq === key ? '−' : '+'}</span>
                      </button>
                      {openFaq === key && <div className="pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</div>}
                    </div>
                  );
                })}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-gray-500 py-10">No questions match your search. Try different keywords or <Link href="/contact" className="text-accent-500 font-bold">contact us</Link>.</p>
            )}
          </div>
        </section>
      </main>
      <Footer variant="personal" />
    </>
  );
}
