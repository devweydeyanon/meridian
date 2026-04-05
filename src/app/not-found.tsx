import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

export default function NotFound() {
  return (
    <>
      <Header variant="personal" />
      <main id="main-content" className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-20 max-md:py-12">
        <div className="text-center max-w-[520px] mx-auto px-6">
          {/* Large 404 */}
          <div className="text-[120px] font-extrabold text-gray-200 leading-none mb-2 max-md:text-[80px]">404</div>

          <h1 className="text-[26px] font-extrabold text-gray-800 mb-3 max-md:text-[22px]">
            Page not found
          </h1>
          <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved. 
            Let&apos;s get you back on track.
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center mb-10 max-md:flex-col">
            <Link href="/">
              <button className="px-8 py-3 text-sm font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans hover:bg-cta-hover transition-all max-md:w-full">
                Go to homepage
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-8 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer font-sans hover:border-gray-400 transition-all max-md:w-full">
                Contact support
              </button>
            </Link>
          </div>

          {/* Quick links */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Popular pages</p>
            <div className="grid grid-cols-2 gap-3 max-w-[360px] mx-auto max-md:grid-cols-1">
              {[
                { label: 'Checking Accounts', href: '/personal/compare-checking' },
                { label: 'Savings & CDs', href: '/personal/savings-rates' },
                { label: 'Credit Cards', href: '/personal/compare-cards' },
                { label: 'Home Loans', href: '/personal/mortgages' },
                { label: 'Business Banking', href: '/business' },
                { label: 'Help Center', href: '/help' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-accent-500 hover:text-accent-500 transition-all no-underline"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Help text */}
          <p className="text-xs text-gray-400 mt-8">
            Need help? Call <strong>1-800-MERIDIAN</strong> or{' '}
            <Link href="/contact" className="text-accent-500 font-semibold no-underline">send us a message</Link>.
          </p>
        </div>
      </main>
      <Footer variant="personal" />
    </>
  );
}
