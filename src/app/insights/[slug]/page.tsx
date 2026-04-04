'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import pageData from '../pageData.json';

const data = pageData as Record<string, any>;

export default function InsightArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const page = data[slug];

  // Determine variant based on category
  const corpCategories = ['Economics', 'Investment Banking', 'Capital Markets'];
  const bizCategories = ['Growth', 'Getting Started', 'Tax Planning'];
  const variant = page && corpCategories.includes(page.category) ? 'corporate'
    : page && bizCategories.includes(page.category) ? 'business' : 'personal';

  if (!page) {
    return (
      <>
        <Header variant="personal" />
        <div className="min-h-[60vh] flex items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800">Article not found</h1>
        </div>
        <Footer variant="personal" />
      </>
    );
  }

  // Get related articles (same category or random)
  const related = Object.entries(data)
    .filter(([s]) => s !== slug)
    .slice(0, 2) as [string, any][];

  return (
    <>
      <Header variant={variant} />
      <main id="main-content">
        <section className="bg-gradient-to-br from-navy-900 to-navy-700 py-10 max-md:py-7">
          <div className="max-w-container mx-auto px-6">
            <div className="text-[12.5px] text-white/40 mb-3">
              <Link href="/" className="text-white/50 no-underline">Home</Link>{' / '}
              <span className="text-white/50">Insights</span>{' / '}
              <span className="text-white/70">{page.category}</span>
            </div>
            <h1 className="text-[32px] font-extrabold text-white leading-tight mb-2.5 max-w-[700px] max-md:text-[24px]">{page.title}</h1>
            <div className="flex gap-4 text-[13px] text-white/50">
              <span>{page.category}</span>
              <span>{page.date}</span>
              <span>{page.read_time}</span>
            </div>
          </div>
        </section>

        <div className="max-w-container mx-auto px-6">
          <div className="max-w-[720px] py-12 max-md:py-8">
            {page.image && (
              <img src={page.image} alt={page.title} className="w-full h-[360px] object-cover rounded-[10px] mb-8 max-md:h-[200px]" loading="lazy" />
            )}

            <div className="space-y-4">
              {page.content?.map((para: string, i: number) => {
                // If it looks like a heading (short, no period)
                if (para.length < 60 && !para.includes('.')) {
                  return <h2 key={i} className="text-[22px] font-bold text-gray-800 mt-8 mb-3 max-md:text-[19px]">{para}</h2>;
                }
                return <p key={i} className="text-[15px] text-gray-600 leading-[1.75]">{para}</p>;
              })}
            </div>

            {/* CTA */}
            <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-7 my-8 text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-1.5">Ready to take the next step?</h3>
              <p className="text-sm text-gray-500 mb-4">Explore Meridian products designed to help you reach your goals.</p>
              <Link href="/open-account">
                <button className="px-7 py-2.5 text-sm font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all">
                  Open an account
                </button>
              </Link>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="pt-12 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-5">Related insights</h3>
                <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                  {related.map(([rSlug, rData]) => (
                    <Link key={rSlug} href={`/insights/${rSlug}`} className="border border-gray-200 rounded-lg p-5 hover:border-accent-500 transition-all no-underline">
                      <h4 className="text-[15px] font-bold text-gray-800 mb-1">{rData.title}</h4>
                      <p className="text-[13px] text-gray-500">{rData.category} · {rData.read_time}</p>
                      <span className="text-[12.5px] font-bold text-accent-500 mt-2 inline-block">Read article →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer variant={variant} />
    </>
  );
}
