import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const columns = ['Total Checking®', 'Secure Checking', 'Premier Checking', 'Student Checking'];
const slugs = ['/personal/total-checking', '/personal/secure-checking', '/personal/premier-checking', '/personal/student-checking'];

const rows = [
  { feature: 'Monthly fee', values: ['$12 or $0', '$4.95 or $0', '$25 or $0', '$0'] },
  { feature: 'Fee waiver', values: ['$500+ direct deposit', 'Ages 17–24', '$15K+ balance', 'Ages 17–24'] },
  { feature: 'Overdraft fees', values: ['Assist (≤$50 free)', 'None — ever', 'Assist (≤$50 free)', 'Assist (≤$50 free)'] },
  { feature: 'Early direct deposit', values: ['Up to 2 days', 'Up to 2 days', 'Up to 2 days', 'Up to 2 days'] },
  { feature: 'ATM access', values: ['16,000+ free', 'Meridian ATMs free', 'All ATMs worldwide', '16,000+ free'] },
  { feature: 'Mobile banking', values: ['✓', '✓', '✓', '✓'] },
  { feature: 'Zelle®', values: ['✓', '✓', '✓', '✓'] },
  { feature: 'Interest earning', values: ['—', '—', '✓', '—'] },
  { feature: 'Free checks', values: ['—', '—', '✓', '—'] },
  { feature: 'Best for', values: ['Everyday banking', 'Fee-sensitive', 'High balances', 'Ages 17–24'] },
];

const faqs = [
  'What do I need to open a checking account?',
  'Can I switch my checking account type later?',
  'How do I set up direct deposit?',
  'Are there fees for using other banks\' ATMs?',
];

export default function CompareCheckingPage() {
  return (
    <>
      <Header variant="personal" />
      <main id="main-content">
        <section className="bg-gradient-to-br from-navy-900 to-navy-700 py-14 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <div className="text-[12.5px] text-white/40 mb-3">
              <Link href="/" className="text-white/50 no-underline">Home</Link>{' / '}
              <span className="text-white/70">Compare Checking</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-3 max-md:text-[26px]">Compare checking accounts</h1>
            <p className="text-[15.5px] text-white/60 max-w-[560px] max-md:text-sm">Find the right checking account for your needs. Compare features, fees, and benefits side by side.</p>
          </div>
        </section>

        <section className="py-16 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full border-collapse min-w-[700px]">
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
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Ready to open your account?</h2>
            <p className="text-[15px] text-gray-500 mb-6">It takes just a few minutes to get started.</p>
            <Link href="/open-account">
              <button className="px-8 py-3 text-sm font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all">Open an account</button>
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
