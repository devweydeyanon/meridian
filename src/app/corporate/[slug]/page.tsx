'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import pageData from '../pageData.json';

const data = pageData as Record<string, any>;

export default function CorporateSubPage() {
  const params = useParams();
  const slug = params.slug as string;
  const page = data[slug];

  if (!page) {
    return (
      <>
        <Header variant="corporate" />
        <div className="min-h-[60vh] flex items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800">Page not found</h1>
        </div>
        <Footer variant="corporate" />
      </>
    );
  }

  return (
    <>
      <Header variant="corporate" />
      <main id="main-content">
        <section className="bg-gradient-to-br from-navy-900 to-[#0d1f3c] py-14 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <div className="text-[12.5px] text-white/40 mb-4">
              <Link href="/" className="text-white/50 no-underline">Home</Link>{' / '}
              <Link href="/corporate" className="text-white/50 no-underline">Corporate</Link>{' / '}
              <span className="text-white/70">{page.title}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-3 max-md:text-[26px]">{page.title}</h1>
            <p className="text-[15.5px] text-white/60 leading-relaxed mb-6 max-w-[560px] max-md:text-sm">{page.subtitle}</p>
            <Link href="/contact">
              <button className="px-8 py-3.5 text-[15px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all">
                Contact our team
              </button>
            </Link>
          </div>
        </section>

        {page.services?.length > 0 && (
          <section className="py-16 max-md:py-10">
            <div className="max-w-container mx-auto px-6">
              <h2 className="text-[30px] font-extrabold text-gray-800 mb-8 max-md:text-[22px]">Our capabilities</h2>
              <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                {page.services.map((s: any, i: number) => (
                  <div key={i} className="bg-white rounded-[10px] border border-gray-200 p-7 hover:border-accent-500/30 hover:shadow-md transition-all max-md:p-5">
                    <h3 className="text-[17px] font-bold text-gray-800 mb-1.5">{s.title}</h3>
                    <p className="text-[13.5px] text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-14 text-center border-t border-gray-200 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Discuss your objectives</h2>
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
