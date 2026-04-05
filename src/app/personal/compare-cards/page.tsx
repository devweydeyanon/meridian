import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const columns = ['Cash Rewards Visa®', 'Travel Rewards Visa Signature®', 'Balance Transfer Visa®'];
const slugs = ['/personal/cash-back-card', '/personal/travel-rewards-card', '/personal/balance-transfer-card'];

const rows = [
  { feature: 'Annual fee', values: ['$0', '$95', '$0'] },
  { feature: 'Rewards rate', values: ['1.5% unlimited cash back', '3X travel & dining, 1.5X everything', '1% cash back'] },
  { feature: 'Welcome bonus', values: ['$200 cash back', '60,000 points', '—'] },
  { feature: 'Intro APR', values: ['0% for 15 months', '—', '0% for 21 months (transfers)'] },
  { feature: 'Regular APR', values: ['18.74%–28.74%', '20.74%–29.74%', '16.74%–26.74%'] },
  { feature: 'Foreign transaction fee', values: ['None', 'None', '3%'] },
  { feature: 'Cell phone protection', values: ['—', '✓', '—'] },
  { feature: 'Travel insurance', values: ['—', '✓', '—'] },
  { feature: 'Purchase protection', values: ['✓', '✓', '✓'] },
  { feature: 'Best for', values: ['Everyday spending', 'Travel & dining', 'Paying down debt'] },
];

const faqs = [
  'How do I check if I\'m pre-approved?',
  'Will applying affect my credit score?',
  'Can I upgrade my card later?',
  'How do I redeem my rewards?',
  'What is the minimum credit score needed?',
];

export default function CompareCardsPage() {
  return (
    <>
      <Header variant="personal" />
      <main id="main-content">
        <section className="bg-gradient-to-br from-navy-900 to-navy-700 py-14 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <div className="text-[12.5px] text-white/40 mb-3">
              <Link href="/" className="text-white/50 no-underline">Home</Link>{' / '}
              <span className="text-white/70">Compare Cards</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-3 max-md:text-[26px]">Compare credit cards</h1>
            <p className="text-[15.5px] text-white/60 max-w-[560px] max-md:text-sm">Find the right card for your goals. Compare rewards, rates, and benefits side by side.</p>
          </div>
        </section>

        <section className="py-16 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-5 text-[13px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b-2 border-gray-200 w-[200px]">Feature</th>
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
                            Apply now
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
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Not sure which card is right for you?</h2>
            <p className="text-[15px] text-gray-500 mb-6">Check your pre-approval status with no impact to your credit score.</p>
            <Link href="/open-account">
              <button className="px-8 py-3 text-sm font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all">Check pre-approval</button>
            </Link>
          </div>
        </section>

        <section className="py-16 max-md:py-10">
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
