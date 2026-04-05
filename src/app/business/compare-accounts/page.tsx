import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const columns = ['Essential Checking', 'Performance Checking', 'Business Savings'];
const slugs = ['/business/essential-checking', '/business/performance-checking', '/business/business-savings'];

const rows = [
  { feature: 'Monthly fee', values: ['$10 (waivable)', '$30 (waivable)', '$0 with $500 balance'] },
  { feature: 'Fee waiver', values: ['$1,500 min balance', '$25,000 min balance', '$500 min balance'] },
  { feature: 'Transactions', values: ['200/month free', 'Unlimited', '6 transfers/month'] },
  { feature: 'Cash deposits', values: ['$5,000/month free', '$20,000/month free', '—'] },
  { feature: 'Wire transfers', values: ['$25 each', '10 free/month', '—'] },
  { feature: 'Interest', values: ['—', 'Earnings credit', '3.50% APY'] },
  { feature: 'Debit card', values: ['✓', '✓', '—'] },
  { feature: 'Employee cards', values: ['Up to 5', 'Unlimited', '—'] },
  { feature: 'QuickBooks sync', values: ['✓', '✓', '✓'] },
  { feature: 'Dedicated advisor', values: ['—', '✓', '—'] },
  { feature: 'Positive pay', values: ['—', '✓', '—'] },
  { feature: 'Best for', values: ['Small businesses & startups', 'Growing businesses', 'Reserves & savings'] },
];

export default function CompareBusinessAccountsPage() {
  return (
    <>
      <Header variant="business" />
      <main id="main-content">
        <section className="bg-gradient-to-br from-navy-900 to-navy-700 py-14 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <div className="text-[12.5px] text-white/40 mb-3">
              <Link href="/" className="text-white/50 no-underline">Home</Link>{' / '}
              <Link href="/business" className="text-white/50 no-underline">Business</Link>{' / '}
              <span className="text-white/70">Compare Accounts</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-3 max-md:text-[26px]">Compare business accounts</h1>
            <p className="text-[15.5px] text-white/60 max-w-[560px] max-md:text-sm">Find the right account for your business. Compare features, fees, and benefits side by side.</p>
          </div>
        </section>

        <section className="py-16 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-5 text-[13px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b-2 border-gray-200 w-[180px]">Feature</th>
                    {columns.map((col, i) => (
                      <th key={col} className="text-center py-4 px-5 text-[13.5px] font-bold text-navy-900 bg-gray-50 border-b-2 border-gray-200">
                        <Link href={slugs[i]} className="text-navy-900 hover:text-accent-500 no-underline">{col}</Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="py-3.5 px-5 text-[13.5px] font-semibold text-gray-700 border-b border-gray-100">{row.feature}</td>
                      {row.values.map((val, j) => (
                        <td key={j} className="py-3.5 px-5 text-[13.5px] text-gray-600 text-center border-b border-gray-100">{val}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-4 px-5" />
                    {slugs.map((slug, i) => (
                      <td key={i} className="py-4 px-5 text-center">
                        <Link href={slug}>
                          <button className="px-5 py-2 text-[13px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all">
                            Learn more
                          </button>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-14 text-center border-t border-gray-200 bg-gray-50 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Ready to open a business account?</h2>
            <p className="text-[15px] text-gray-500 mb-6">Apply online in minutes or speak with a business banker.</p>
            <div className="flex gap-3 justify-center max-md:flex-col max-md:items-center">
              <Link href="/open-account">
                <button className="px-8 py-3 text-sm font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all max-md:w-full">Get started</button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer font-sans hover:border-gray-400 transition-all max-md:w-full">Contact us</button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="business" />
    </>
  );
}
