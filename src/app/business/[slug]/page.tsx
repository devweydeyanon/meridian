'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import pageData from '../pageData.json';

const data = pageData as Record<string, any>;

const featureIcons = [
  'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'M13 10V3L4 14h7v7l9-11h-7z',
  'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z',
  'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
];

export default function BusinessProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const page = data[slug];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!page) {
    return (
      <>
        <Header variant="business" />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
            <Link href="/business" className="text-accent-500 font-bold">Back to Business Banking</Link>
          </div>
        </div>
        <Footer variant="business" />
      </>
    );
  }

  return (
    <>
      <Header variant="business" />
      <main id="main-content">
        <section className="bg-gradient-to-br from-navy-900 to-navy-700 relative overflow-hidden py-14 max-md:py-8">
          <div className="absolute -top-1/2 -right-[10%] w-[800px] h-[800px] rounded-full border border-white/[0.04] pointer-events-none" />
          <div className="max-w-container mx-auto px-6 relative z-[1]">
            <div className="grid grid-cols-[1fr_340px] gap-16 items-start max-lg:grid-cols-1 max-lg:gap-6">
              <div>
                <div className="text-[12.5px] text-white/40 mb-3">
                  <Link href="/" className="text-white/50 hover:text-white no-underline">Home</Link>{' / '}
                  <Link href="/business" className="text-white/50 hover:text-white no-underline">Business</Link>{' / '}
                  <span className="text-white/70">{page.title}</span>
                </div>
                <h1 className="text-4xl font-extrabold text-white leading-tight mb-3 max-md:text-[26px]">{page.title}</h1>
                <p className="text-[15.5px] text-white/60 leading-relaxed mb-6 max-w-[560px] max-md:text-sm">{page.subtitle}</p>
                <Link href="/open-account">
                  <button className="px-8 py-3.5 text-[15px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all max-md:w-full">
                    Get started
                  </button>
                </Link>
              </div>
              {page.summary?.length > 0 && (
                <div className="bg-white rounded-xl shadow-2xl p-6 max-lg:max-w-[400px]">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Account Summary</h3>
                  {page.summary.map((row: any, i: number) => (
                    <div key={i} className={`flex justify-between py-2.5 text-[13px] ${i < page.summary.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <span className="text-gray-500">{row.label}</span>
                      <span className="font-semibold text-gray-800">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {page.features?.length > 0 && (
          <section className="py-16 max-md:py-10">
            <div className="max-w-container mx-auto px-6">
              <div className="text-center mb-10 max-md:mb-6">
                <h2 className="text-[30px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">What&apos;s included</h2>
              </div>
              <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-3.5">
                {page.features.map((feat: any, i: number) => (
                  <div key={i} className="bg-white rounded-[10px] border border-gray-200 p-6 hover:shadow-md transition-all max-md:flex max-md:gap-4 max-md:items-start max-md:p-5">
                    <div className="w-11 h-11 bg-navy-900/5 rounded-xl flex items-center justify-center text-navy-700 mb-3 max-md:mb-0 max-md:shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={featureIcons[i % 6]} /></svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-1">{feat.title}</h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-14 text-center border-t border-gray-200 bg-gray-50 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">{page.cta_title}</h2>
            <p className="text-[15px] text-gray-500 mb-6">{page.cta_desc}</p>
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

        {page.faqs?.length > 0 && (
          <section className="py-16 max-md:py-10">
            <div className="max-w-container mx-auto px-6">
              <h2 className="text-[30px] font-extrabold text-gray-800 mb-8 text-center max-md:text-[22px]">Common questions</h2>
              <div className="max-w-[760px] mx-auto">
                {page.faqs.map((q: string, i: number) => (
                  <div key={i} className="border-b border-gray-200">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full py-4.5 text-left text-[15px] font-bold text-gray-800 flex justify-between items-center cursor-pointer bg-transparent border-none font-sans hover:text-accent-600">
                      {q}
                      <span className="text-xl text-gray-400 ml-4 shrink-0">{openFaq === i ? '−' : '+'}</span>
                    </button>
                    {openFaq === i && (
                      <div className="pb-4 text-sm text-gray-500 leading-relaxed">
                        Contact our business banking team at 1-800-249-6374 for details, or visit any branch.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer variant="business" />
    </>
  );
}
