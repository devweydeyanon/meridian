import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const cdRates = [
  { term: '3 months', stdRate: '3.50%', stdApy: '3.56%', relRate: '3.75%', relApy: '3.82%' },
  { term: '6 months', stdRate: '4.00%', stdApy: '4.07%', relRate: '4.25%', relApy: '4.33%' },
  { term: '9 months', stdRate: '4.25%', stdApy: '4.33%', relRate: '4.45%', relApy: '4.54%' },
  { term: '12 months', stdRate: '4.50%', stdApy: '4.59%', relRate: '4.70%', relApy: '4.80%', highlight: true },
  { term: '18 months', stdRate: '4.40%', stdApy: '4.49%', relRate: '4.60%', relApy: '4.69%' },
  { term: '24 months', stdRate: '4.25%', stdApy: '4.33%', relRate: '4.45%', relApy: '4.54%' },
  { term: '36 months', stdRate: '4.10%', stdApy: '4.18%', relRate: '4.30%', relApy: '4.38%' },
  { term: '60 months', stdRate: '3.90%', stdApy: '3.97%', relRate: '4.10%', relApy: '4.18%' },
];

const savingsRates = [
  { product: 'High Yield Savings', apy: '4.25%', min: '$0', href: '/personal/high-yield-savings' },
  { product: 'Money Market', apy: '4.00%', min: '$1,000', href: '/personal/money-market' },
  { product: 'Standard Savings', apy: '0.05%', min: '$0', href: '/personal/high-yield-savings' },
];

const faqs = [
  'What is the minimum deposit for a CD?',
  'Can I withdraw early from a CD?',
  'What is the difference between rate and APY?',
  'How do relationship rates work?',
];

export default function SavingsRatesPage() {
  return (
    <>
      <Header variant="personal" />
      <main id="main-content">
        <section className="bg-gradient-to-br from-navy-900 to-navy-700 py-14 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <div className="text-[12.5px] text-white/40 mb-3">
              <Link href="/" className="text-white/50 no-underline">Home</Link>{' / '}
              <span className="text-white/50">Savings & CDs</span>{' / '}
              <span className="text-white/70">Rates</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-3 max-md:text-[26px]">Savings & CD rates</h1>
            <p className="text-[15.5px] text-white/60 max-w-[560px] max-md:text-sm">Current rates for Meridian Bank savings accounts and Certificates of Deposit. Rates effective March 2026.</p>
          </div>
        </section>

        {/* Savings Rates */}
        <section className="py-14 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-6 max-md:text-[22px]">Savings account rates</h2>
            <div className="grid grid-cols-3 gap-5 mb-10 max-md:grid-cols-1">
              {savingsRates.map((s) => (
                <Link key={s.product} href={s.href} className="bg-white border border-gray-200 rounded-[10px] p-6 hover:border-accent-500 hover:shadow-md transition-all no-underline">
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-accent-600 mb-2">Savings</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{s.product}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-[36px] font-extrabold text-navy-900 tracking-tight">{s.apy}</span>
                    <span className="text-sm text-gray-500 font-medium">APY</span>
                  </div>
                  <p className="text-[13px] text-gray-500">Min. balance to open: {s.min}</p>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-accent-500 mt-4">
                    Learn more <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CD Rate Table */}
        <section className="py-14 bg-gray-50 border-t border-gray-200 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-[26px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Certificate of Deposit rates</h2>
              <p className="text-sm text-gray-500">$1,000 minimum deposit. Rates may vary by region. <span className="text-accent-500 font-semibold">Relationship rates</span> available for customers with a qualifying checking account.</p>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full border-collapse min-w-[600px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-5 text-[12px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b-2 border-gray-200">Term</th>
                    <th colSpan={2} className="text-center py-4 px-5 text-[12px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b-2 border-gray-200">Standard</th>
                    <th colSpan={2} className="text-center py-4 px-5 text-[12px] font-bold text-accent-600 uppercase tracking-wider bg-accent-500/5 border-b-2 border-gray-200">Relationship</th>
                  </tr>
                  <tr>
                    <th className="text-left py-2 px-5 text-[11px] font-semibold text-gray-400 bg-gray-50 border-b border-gray-200" />
                    <th className="text-center py-2 px-5 text-[11px] font-semibold text-gray-400 bg-gray-50 border-b border-gray-200">Rate</th>
                    <th className="text-center py-2 px-5 text-[11px] font-semibold text-gray-400 bg-gray-50 border-b border-gray-200">APY</th>
                    <th className="text-center py-2 px-5 text-[11px] font-semibold text-accent-600 bg-accent-500/5 border-b border-gray-200">Rate</th>
                    <th className="text-center py-2 px-5 text-[11px] font-semibold text-accent-600 bg-accent-500/5 border-b border-gray-200">APY</th>
                  </tr>
                </thead>
                <tbody>
                  {cdRates.map((row, i) => (
                    <tr key={row.term} className={`${row.highlight ? 'bg-accent-500/[0.03]' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="py-3.5 px-5 text-[13.5px] font-semibold text-gray-800 border-b border-gray-100">
                        {row.term}
                        {row.highlight && <span className="ml-2 text-[10px] font-bold text-white bg-accent-500 px-1.5 py-0.5 rounded-full">POPULAR</span>}
                      </td>
                      <td className="py-3.5 px-5 text-[13.5px] text-gray-600 text-center border-b border-gray-100">{row.stdRate}</td>
                      <td className="py-3.5 px-5 text-[13.5px] text-gray-600 text-center border-b border-gray-100 font-semibold">{row.stdApy}</td>
                      <td className="py-3.5 px-5 text-[13.5px] text-accent-600 text-center border-b border-gray-100 bg-accent-500/[0.02]">{row.relRate}</td>
                      <td className="py-3.5 px-5 text-[13.5px] text-accent-600 text-center border-b border-gray-100 font-bold bg-accent-500/[0.02]">{row.relApy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              Annual Percentage Yields (APYs) are accurate as of 03/01/2026. Rates are subject to change without notice. Fees could reduce earnings on the account. A penalty may be imposed for early withdrawal. Interest is compounded daily and credited monthly.
            </p>
          </div>
        </section>

        <section className="py-14 text-center max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Ready to start earning?</h2>
            <p className="text-[15px] text-gray-500 mb-6">Open a CD or savings account online in minutes.</p>
            <div className="flex gap-3 justify-center max-md:flex-col max-md:items-center">
              <Link href="/open-account">
                <button className="px-8 py-3 text-sm font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all max-md:w-full">Open an account</button>
              </Link>
              <Link href="/personal/certificates-of-deposit">
                <button className="px-8 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer font-sans hover:border-gray-400 transition-all max-md:w-full">Learn about CDs</button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-gray-200 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[30px] font-extrabold text-gray-800 mb-8 text-center max-md:text-[22px]">Common questions</h2>
            <div className="max-w-[760px] mx-auto">
              {faqs.map((q) => (
                <div key={q} className="border-b border-gray-200 py-4 text-[15px] font-bold text-gray-800">{q}</div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer variant="personal" />
    </>
  );
}
