import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const stats = [
  { value: '250K+', label: 'Business customers served' },
  { value: '$12B', label: 'In business loans originated' },
  { value: '16,000+', label: 'ATMs nationwide' },
  { value: '#1', label: 'Small business online banking' },
];

const products = [
  { cat: 'Checking', title: 'Essential Checking', desc: 'For businesses getting started. No minimum balance.', href: '/business/essential-checking' },
  { cat: 'Checking', title: 'Performance Checking', desc: 'Full-featured account for growing businesses.', href: '/business/performance-checking' },
  { cat: 'Savings', title: 'Business Savings', desc: 'Earn interest on idle cash with easy access.', href: '/business/business-savings' },
  { cat: 'Credit', title: 'Business Cash Rewards', desc: 'Earn 1.5% cash back on business purchases.', href: '/business/cash-back-card' },
  { cat: 'Lending', title: 'Line of Credit', desc: 'Flexible revolving credit up to $250K.', href: '/business/line-of-credit' },
  { cat: 'Lending', title: 'Term Loans & SBA', desc: 'Financing for expansion, equipment, and more.', href: '/business/term-loans' },
];

const resources = [
  { title: '5 ways to manage cash flow', cat: 'Growth', href: '/insights/business-cash-flow' },
  { title: 'How to open a business account', cat: 'Getting Started', href: '/insights/open-business-account' },
  { title: 'Tax deductions you shouldn\'t miss', cat: 'Tax Planning', href: '/insights/small-business-tax-deductions' },
];

export default function BusinessPage() {
  return (
    <>
      <Header variant="business" />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-900 to-navy-700 relative overflow-hidden py-16 max-md:py-10">
          <div className="max-w-container mx-auto px-6 relative z-[1]">
            <h1 className="text-[42px] font-extrabold text-white leading-tight mb-4 max-md:text-[28px]">
              Banking built for<br />your business.
            </h1>
            <p className="text-[16px] text-white/60 leading-relaxed mb-8 max-w-[520px] max-md:text-sm">
              From your first business account to complex treasury management — Meridian grows with you.
            </p>
            <Link href="/open-account">
              <button className="px-8 py-3.5 text-[15px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all max-md:w-full">
                Get started
              </button>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="py-3 border-b border-gray-200">
          <div className="max-w-container mx-auto px-6">
            <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 max-md:gap-3">
              {stats.map((s) => (
                <div key={s.label} className="text-center py-5 max-md:py-3">
                  <div className="text-[28px] font-extrabold text-navy-900 max-md:text-xl">{s.value}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-16 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <div className="text-center mb-10 max-md:mb-6">
              <h2 className="text-[30px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Products for every stage</h2>
              <p className="text-[15px] text-gray-500">Accounts, cards, and lending designed for business.</p>
            </div>
            <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
              {products.map((p) => (
                <Link key={p.title} href={p.href} className="bg-white rounded-[10px] border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-accent-600 mb-2 block">{p.cat}</span>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{p.title}</h3>
                  <p className="text-[13.5px] text-gray-500">{p.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-accent-500 mt-4">
                    Learn more <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-16 bg-gray-50 border-t border-gray-200 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[30px] font-extrabold text-gray-800 mb-8 text-center max-md:text-[22px]">Business resources</h2>
            <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
              {resources.map((r) => (
                <Link key={r.title} href={r.href} className="bg-white rounded-[10px] border border-gray-200 p-6 hover:shadow-md transition-all no-underline">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-accent-600 mb-2 block">{r.cat}</span>
                  <h3 className="text-[15px] font-bold text-gray-800">{r.title}</h3>
                  <span className="text-[12.5px] font-bold text-accent-500 mt-3 inline-block">Read article →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 text-center max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Ready to grow your business?</h2>
            <p className="text-[15px] text-gray-500 mb-6">Open a business account in minutes or speak with a specialist.</p>
            <div className="flex gap-3 justify-center max-md:flex-col max-md:items-center">
              <Link href="/open-account">
                <button className="px-8 py-3 text-sm font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all max-md:w-full">Get started</button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer font-sans max-md:w-full">Contact us</button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="business" />
    </>
  );
}
