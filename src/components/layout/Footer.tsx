import Link from 'next/link';

interface FooterProps {
  variant?: 'personal' | 'business' | 'corporate';
}

const personalColumns = [
  { title: 'Checking', links: [
    { label: 'Total Checking®', href: '/personal/total-checking' },
    { label: 'Secure Checking', href: '/personal/secure-checking' },
    { label: 'Premier Checking', href: '/personal/premier-checking' },
  ]},
  { title: 'Savings & CDs', links: [
    { label: 'High Yield Savings', href: '/personal/high-yield-savings' },
    { label: 'CDs', href: '/personal/certificates-of-deposit' },
    { label: 'CD Rates', href: '/personal/savings-rates' },
  ]},
  { title: 'Credit Cards', links: [
    { label: 'Cash Back', href: '/personal/cash-back-card' },
    { label: 'Travel Rewards', href: '/personal/travel-rewards-card' },
    { label: 'Compare', href: '/personal/compare-cards' },
  ]},
  { title: 'Loans', links: [
    { label: 'Mortgages', href: '/personal/mortgages' },
    { label: 'Personal Loans', href: '/personal/personal-loans' },
    { label: 'Auto Loans', href: '/personal/auto-loans' },
  ]},
];

const businessColumns = [
  { title: 'Checking', links: [
    { label: 'Essential Checking', href: '/business/essential-checking' },
    { label: 'Performance Checking', href: '/business/performance-checking' },
    { label: 'Compare Accounts', href: '/business/compare-accounts' },
  ]},
  { title: 'Cards & Lending', links: [
    { label: 'Business Cash Back', href: '/business/cash-back-card' },
    { label: 'Line of Credit', href: '/business/line-of-credit' },
    { label: 'Term Loans', href: '/business/term-loans' },
  ]},
  { title: 'Solutions', links: [
    { label: 'Payments', href: '/business/payments' },
    { label: 'Business Savings', href: '/business/business-savings' },
  ]},
];

const corporateColumns = [
  { title: 'Investment Banking', links: [
    { label: 'M&A Advisory', href: '/corporate/investment-banking' },
    { label: 'Capital Markets', href: '/corporate/investment-banking' },
  ]},
  { title: 'Markets & Treasury', links: [
    { label: 'Global Markets', href: '/corporate/global-markets' },
    { label: 'Treasury & Payments', href: '/corporate/treasury-payments' },
  ]},
  { title: 'Lending', links: [
    { label: 'Corporate Lending', href: '/corporate/lending' },
    { label: 'Commercial Real Estate', href: '/corporate/lending' },
  ]},
  { title: 'Insights', links: [
    { label: 'Research', href: '/corporate/insights' },
    { label: 'Sector Reports', href: '/corporate/insights' },
  ]},
];

const supportColumn = {
  title: 'Support',
  links: [
    { label: 'Help Center', href: '/help' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Find a Branch', href: '/branches' },
    { label: 'Security', href: '/security' },
  ],
};

export function Footer({ variant = 'personal' }: FooterProps) {
  const columns = variant === 'corporate' ? corporateColumns : variant === 'business' ? businessColumns : personalColumns;

  return (
    <>
      {/* Help Strip */}
      <div className="bg-white border-t border-gray-200 py-5 max-md:py-4">
        <div className="max-w-container mx-auto px-6">
          <div className="flex items-center justify-between max-md:flex-col max-md:gap-4 max-md:text-center">
            <div className="flex items-center gap-3 max-md:flex-col">
              <div className="w-10 h-10 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-500 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Speak with a representative</h3>
                <p className="text-xs text-gray-500">Call <strong>1-800-MERIDIAN</strong> or contact us online.</p>
              </div>
            </div>
            <div className="flex gap-2 max-md:flex-wrap max-md:justify-center">
              {[
                { label: 'Find a branch', href: '/branches', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' },
                { label: 'Schedule consultation', href: '/contact', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
                { label: 'FAQs', href: '/faqs', icon: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-full hover:border-accent-500 hover:text-accent-500 transition-all no-underline max-md:px-3 max-md:text-[11px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 pt-12 pb-6 border-t border-gray-200 max-md:pt-7 max-md:pb-4">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-5 gap-8 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-2 max-md:gap-4">
            {[...columns, supportColumn].map((col) => (
              <div key={col.title}>
                <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-3 max-md:text-[11px] max-md:mb-1.5">{col.title}</h5>
                <ul className="list-none">
                  {col.links.map((link) => (
                    <li key={link.href + link.label} className="mb-1 max-md:mb-0">
                      <Link href={link.href} className="text-[13px] text-gray-500 hover:text-accent-500 transition-colors no-underline max-md:text-xs">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social + App Badges */}
          <div className="flex justify-between items-center pt-5 mt-6 border-t border-gray-200 flex-wrap gap-4 max-md:flex-col max-md:items-center max-md:mt-4 max-md:pt-3.5">
            <div className="flex gap-3.5 items-center">
              <span className="text-xs text-gray-400 font-semibold">Follow us</span>
              {['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
                'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5',
                'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z',
              ].map((d, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center" aria-label="Social">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#6c757d"><path d={d} /></svg>
                </a>
              ))}
            </div>
            <div className="flex gap-2.5 items-center">
              <span className="text-xs text-gray-400 font-semibold">Get the app</span>
              {['App Store', 'Google Play'].map((store) => (
                <a key={store} href="#" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-800 text-white rounded-md text-[11px] font-semibold no-underline">
                  {store}
                </a>
              ))}
            </div>
          </div>

          {/* Regulatory Badges + Legal */}
          <div className="pt-5 mt-5 border-t border-gray-200 max-md:pt-3 max-md:mt-3">
            <div className="flex items-center justify-center gap-6 mb-4">
              {/* FDIC Badge */}
              <div className="flex items-center gap-2 text-gray-500">
                <svg viewBox="0 0 80 32" className="h-7 w-auto opacity-60">
                  <rect x="0" y="0" width="80" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <text x="40" y="14" textAnchor="middle" fontSize="9" fontWeight="800" fill="currentColor" fontFamily="Arial, sans-serif">FDIC</text>
                  <text x="40" y="24" textAnchor="middle" fontSize="5.5" fill="currentColor" fontFamily="Arial, sans-serif">Member FDIC</text>
                </svg>
              </div>
              {/* Equal Housing Lender Badge */}
              <div className="flex items-center gap-1.5 text-gray-500">
                <svg viewBox="0 0 24 24" className="h-6 w-6 opacity-60" fill="currentColor">
                  <path d="M12 3L2 12h3v9h14v-9h3L12 3zm0 2.84L18 11v8H6v-8l6-5.16z"/>
                  <path d="M10 15h4v4h-4z"/>
                </svg>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 leading-tight">Equal Housing<br/>Lender</span>
              </div>
            </div>
            <p className="text-[10.5px] text-gray-400 text-center leading-relaxed max-md:text-[10px]">
              © 2026 Meridian Bank, N.A. Member FDIC. Equal Housing Lender. NMLS #000000.{' '}
              <a href="#" className="text-gray-500">NMLS Consumer Access</a>
              <br />
              Deposit products are offered by Meridian Bank, N.A. Loans are subject to credit approval.
              <br className="max-md:hidden" />{' '}
              Investment products are not FDIC insured, have no bank guarantee, and may lose value.
              <br />
              <Link href="/privacy" className="text-gray-500 no-underline">Privacy</Link> ·{' '}
              <Link href="/terms" className="text-gray-500 no-underline">Terms</Link> ·{' '}
              <Link href="/security" className="text-gray-500 no-underline">Security</Link> ·{' '}
              <Link href="/help" className="text-gray-500 no-underline">Accessibility</Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Copyright Bar */}
      <div className="bg-navy-900 text-white/40 text-center py-3.5 text-[11.5px] max-md:py-2 max-md:text-[10px]">
        Meridian Bank, N.A. · Member FDIC · Equal Housing Lender
      </div>
    </>
  );
}
