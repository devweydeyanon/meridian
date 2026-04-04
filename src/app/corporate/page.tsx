import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const capabilities = [
  { title: 'Investment Banking', desc: 'M&A advisory, equity and debt capital markets, and strategic financing.', href: '/corporate/investment-banking', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  { title: 'Global Markets', desc: 'Fixed income, currencies, commodities, equities, and structured products.', href: '/corporate/global-markets', icon: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' },
  { title: 'Treasury & Payments', desc: 'Cash management, liquidity optimization, trade finance, and cross-border payments.', href: '/corporate/treasury-payments', icon: 'M21 12V7H5a2 2 0 0 1 0-4h14v4' },
  { title: 'Corporate Lending', desc: 'Revolving facilities, term loans, acquisition financing, and project finance.', href: '/corporate/lending', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { title: 'Commercial Real Estate', desc: 'Agency lending, CMBS, balance sheet lending, and structured finance.', href: '/corporate/lending', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { title: 'Risk Management', desc: 'Interest rate, FX, and commodity hedging to protect against volatility.', href: '/corporate/risk-management', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
];

const industries = [
  { title: 'Technology & Innovation', desc: 'Growth lending, IPO advisory, and M&A for tech companies.', href: '/corporate/technology' },
  { title: 'Healthcare & Life Sciences', desc: 'Financing and advisory for healthcare providers and pharma.', href: '/corporate/healthcare' },
  { title: 'Energy & Infrastructure', desc: 'Project finance and capital markets for energy transition.', href: '/corporate/energy' },
  { title: 'Real Estate', desc: 'Commercial mortgage, CMBS, and equity solutions.', href: '/corporate/real-estate' },
];

const insights = [
  { title: 'U.S. economic outlook: Navigating rate policy in 2026', cat: 'Economic Commentary', href: '/insights/economic-outlook-2026', img: 'photo-1611974789855-9c2a0a7236a3' },
  { title: 'Global M&A activity: Trends and outlook', cat: 'Capital Markets', href: '/insights/global-ma-trends', img: 'photo-1507679799987-c73b1a816610' },
];

export default function CorporatePage() {
  return (
    <>
      <Header variant="corporate" />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-900 to-[#0d1f3c] relative overflow-hidden py-20 max-md:py-12">
          <div className="max-w-container mx-auto px-6 relative z-[1]">
            <div className="max-w-[600px]">
              <h1 className="text-[42px] font-extrabold text-white leading-tight mb-4 max-md:text-[28px]">
                Strategic solutions for complex enterprises.
              </h1>
              <p className="text-[16px] text-white/60 leading-relaxed mb-8 max-md:text-sm">
                Investment banking, capital markets, treasury, and lending for corporations, institutions, and government entities worldwide.
              </p>
              <Link href="/contact">
                <button className="px-8 py-3.5 text-[15px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all">
                  Contact our team
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-16 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-[30px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Our capabilities</h2>
              <p className="text-[15px] text-gray-500">Comprehensive financial solutions for corporations and institutions.</p>
            </div>
            <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
              {capabilities.map((cap) => (
                <Link key={cap.title} href={cap.href} className="bg-white rounded-[10px] border border-gray-200 p-7 hover:border-accent-500/30 hover:shadow-md transition-all no-underline">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-navy-700 mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={cap.icon} /></svg>
                  </div>
                  <h3 className="text-[17px] font-bold text-gray-800 mb-1.5">{cap.title}</h3>
                  <p className="text-[13.5px] text-gray-500 leading-relaxed mb-3">{cap.desc}</p>
                  <span className="text-[13px] font-bold text-accent-500">Learn more →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-16 bg-gray-50 border-t border-gray-200 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-[30px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Industry expertise</h2>
              <p className="text-[15px] text-gray-500">Deep sector knowledge and dedicated coverage teams.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              {industries.map((ind) => (
                <Link key={ind.title} href={ind.href} className="bg-white border border-gray-200 rounded-[10px] p-5 flex items-center gap-4 hover:border-accent-500 hover:shadow-md transition-all no-underline">
                  <div className="w-12 h-12 bg-gray-50 rounded-[10px] flex items-center justify-center text-navy-700 shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                  </div>
                  <div>
                    <h4 className="text-[14.5px] font-bold text-gray-800 mb-0.5">{ind.title}</h4>
                    <p className="text-[12.5px] text-gray-500">{ind.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Insights */}
        <section className="py-16 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[30px] font-extrabold text-gray-800 mb-8 text-center max-md:text-[22px]">Economics & insights</h2>
            <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
              {insights.map((ins) => (
                <Link key={ins.title} href={ins.href} className="bg-white rounded-[10px] border border-gray-200 overflow-hidden hover:shadow-lg transition-all no-underline">
                  <div className="h-[200px] overflow-hidden bg-gray-200">
                    <img src={`https://images.unsplash.com/${ins.img}?w=600&h=400&fit=crop&q=80`} alt={ins.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-accent-600 mb-2 block">{ins.cat}</span>
                    <h3 className="text-[15px] font-bold text-gray-800 leading-snug">{ins.title}</h3>
                    <span className="text-[12.5px] font-bold text-accent-500 mt-3 inline-block">Read report →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 text-center border-t border-gray-200 bg-gray-50 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Ready to partner with Meridian?</h2>
            <p className="text-[15px] text-gray-500 mb-6">Connect with our team for a confidential consultation.</p>
            <Link href="/contact">
              <button className="px-8 py-3 text-sm font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all">
                Contact our team
              </button>
            </Link>
          </div>
        </section>
      </main>
      <Footer variant="corporate" />
    </>
  );
}
