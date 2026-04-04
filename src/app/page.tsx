import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const shortcuts = [
  { label: 'Checking', href: '/personal/compare-checking', icon: 'M2 5h20v14H2z M2 10h20' },
  { label: 'Savings & CDs', href: '/personal/savings-rates', icon: 'M19 5c-1.5 0-2.8 1.4-3.5 2.5-.7-1.1-2-2.5-3.5-2.5C10.5 5 9 6.5 9 8c0 3.5 5 6 5 6s5-2.5 5-6c0-1.5-1.5-3-2-3z' },
  { label: 'Credit Cards', href: '/personal/compare-cards', icon: 'M1 4h22v16H1z M1 10h22' },
  { label: 'Home Loans', href: '/personal/mortgages', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { label: 'Investing', href: '/personal/self-directed-investing', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  { label: 'Business', href: '/business', icon: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' },
];

const offers = [
  { label: 'Checking', title: 'Meridian Total Checking®', desc: 'No monthly service fee with direct deposit. Includes free debit card, mobile banking, and 16,000+ fee-free ATMs.', highlight: '$300', highlightSub: 'bonus for new customers', href: '/personal/total-checking', color: 'bg-navy-700' },
  { label: 'Credit Cards', title: 'Cash Rewards Credit Card', desc: 'Earn unlimited 1.5% cash back on all purchases. No annual fee, no rotating categories.', highlight: '1.5%', highlightSub: 'unlimited cash back', href: '/personal/cash-back-card', color: 'bg-cta-primary' },
  { label: 'Savings', title: 'High Yield Savings', desc: 'Competitive rate with no minimum balance to open. FDIC insured. Access anytime through online and mobile banking.', highlight: '4.25%', highlightSub: 'APY', href: '/personal/high-yield-savings', color: 'bg-accent-500' },
];

const trustItems = [
  { title: 'FDIC Insured', desc: 'Deposits insured up to $250,000 per depositor.', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { title: 'Bank-Level Encryption', desc: '256-bit SSL protects every transaction.', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { title: 'Zero Liability', desc: 'Not responsible for unauthorized transactions.', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3' },
  { title: 'Real-Time Alerts', desc: 'Instant notifications for all account activity.', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' },
];

const guides = [
  { cat: 'Home Buying', title: 'First-time homebuyer guide', desc: 'Steps to buying your first home with confidence.', href: '/insights/first-time-homebuyer-guide', img: 'photo-1570129477492-45c003edd2be' },
  { cat: 'Credit & Debt', title: 'How to build a strong credit score', desc: 'Practical strategies to boost your credit.', href: '/insights/build-strong-credit-score', img: 'photo-1554224155-6726b3ff858f' },
  { cat: 'Investing', title: 'Retirement planning at every age', desc: 'A decade-by-decade retirement roadmap.', href: '/insights/retirement-planning-guide', img: 'photo-1579621970563-ebec7560ff3e' },
  { cat: 'Savings', title: 'How to build an emergency fund', desc: 'Build 3-6 months of expenses in savings.', href: '/insights/emergency-fund-guide', img: 'photo-1579621970795-87facc2f976d' },
  { cat: 'Banking Basics', title: 'Student banking 101', desc: 'Checking, budgeting, and credit basics.', href: '/insights/student-banking-101', img: 'photo-1523240795612-9a054b0db644' },
  { cat: 'Home Buying', title: '7 mortgage mistakes to avoid', desc: 'Common pitfalls that delay approval.', href: '/insights/mortgage-mistakes-to-avoid', img: 'photo-1560520031-3a4dc4e9de0c' },
];

const cardFeatures = [
  'Unlimited 1.5% cash back on every purchase',
  '0% intro APR for 15 months',
  'No foreign transaction fees',
  'Real-time fraud monitoring',
];

export default function HomePage() {
  return (
    <>
      <Header variant="personal" />

      <main id="main-content">
        {/* HERO */}
        <section className="bg-gradient-to-br from-navy-900 to-navy-700 relative overflow-hidden min-h-[500px] max-md:min-h-0">
          <div className="absolute -top-1/2 -right-[10%] w-[800px] h-[800px] rounded-full border border-white/[0.04] pointer-events-none" />
          <div className="max-w-container mx-auto px-6 grid grid-cols-[1fr_380px] gap-16 items-center min-h-[500px] relative z-[1] py-12 max-lg:grid-cols-1 max-md:min-h-0 max-md:gap-5 max-md:py-0">
            <div className="py-14 max-md:py-8 max-md:pt-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.08] rounded-full border border-white/10 mb-5">
                <div className="w-[7px] h-[7px] bg-emerald-400 rounded-full" />
                <span className="text-[13px] font-semibold text-white/85">Limited time offer for new customers</span>
              </div>
              <h1 className="text-[40px] font-extrabold text-white leading-[1.18] tracking-tight mb-4 max-md:text-[26px]">
                Open a checking account.<br />Earn a $300 bonus.
              </h1>
              <p className="text-[15.5px] text-white/65 leading-relaxed mb-7 max-w-[460px] max-md:text-sm max-md:mb-5">
                Open a Meridian Total Checking® account with qualifying direct deposits. No hidden fees, no minimum balance.
              </p>
              <div className="flex gap-3.5 max-md:flex-col max-md:gap-2.5">
                <Link href="/open-account">
                  <button className="px-8 py-3.5 text-[15px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans transition-all hover:bg-cta-hover max-md:w-full max-md:py-3 max-md:text-sm">
                    Open an account
                  </button>
                </Link>
                <Link href="/personal/compare-checking">
                  <button className="px-7 py-3.5 text-[15px] font-bold text-white/90 bg-white/[0.08] border border-white/15 rounded-md cursor-pointer font-sans transition-all hover:bg-white/[0.12] max-md:w-full max-md:py-3 max-md:text-sm">
                    Compare accounts
                  </button>
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4 flex-wrap max-md:gap-2.5 max-md:mt-4">
                {['FDIC Insured', '16,000+ ATMs', '24/7 Support'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-xs text-white/45 font-medium">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Login Panel */}
            <div className="bg-white rounded-xl shadow-2xl p-7 max-w-[400px] max-lg:max-w-full max-md:p-6 max-md:mb-8">
              <h2 className="text-xl font-extrabold text-gray-800 mb-1">Welcome back</h2>
              <p className="text-[13px] text-gray-500 mb-5">Sign in to manage your accounts.</p>
              <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Username or email</label>
              <input type="text" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none mb-3.5 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10" placeholder="Enter username" />
              <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Password</label>
              <input type="password" className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md outline-none mb-4 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10" placeholder="Enter password" />
              <Link href="/login">
                <button className="w-full py-3 text-[15px] font-bold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans transition-all hover:bg-navy-800">
                  Sign in
                </button>
              </Link>
              <div className="flex justify-between mt-3.5 text-xs">
                <Link href="/forgot-password" className="text-accent-500 font-semibold no-underline">Forgot password?</Link>
                <Link href="/enroll" className="text-accent-500 font-semibold no-underline">Enroll now</Link>
              </div>
            </div>
          </div>
        </section>

        {/* SHORTCUTS */}
        <section className="py-5 border-b border-gray-200 max-md:py-3">
          <div className="max-w-container mx-auto px-6">
            <div className="grid grid-cols-6 gap-3 max-lg:grid-cols-3 max-md:grid-cols-3 max-md:gap-2">
              {shortcuts.map((s) => (
                <Link key={s.label} href={s.href} className="flex flex-col items-center gap-2 py-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer no-underline max-md:py-2.5">
                  <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-navy-700 max-md:w-10 max-md:h-10 max-md:rounded-[10px]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={s.icon} /></svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 max-md:text-[11px]">{s.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* OFFERS */}
        <section className="py-16 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <div className="text-center mb-10 max-md:mb-6">
              <h2 className="text-[30px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Choose what&apos;s right for you</h2>
              <p className="text-[15px] text-gray-500">Explore our most popular products designed to help you reach your financial goals.</p>
            </div>
            <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1 max-md:gap-4">
              {offers.map((offer) => (
                <div key={offer.title} className="bg-white rounded-[10px] border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className={`h-[5px] ${offer.color}`} />
                  <div className="p-6 flex flex-col flex-1 max-md:p-5">
                    <span className="inline-block text-[10.5px] font-bold uppercase tracking-wider text-accent-600 mb-2">{offer.label}</span>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{offer.title}</h3>
                    <p className="text-[13.5px] text-gray-500 leading-relaxed flex-1 mb-4">{offer.desc}</p>
                    <div className="flex items-center gap-3 mb-4 p-3.5 bg-gray-50 rounded-lg">
                      <span className="text-[32px] font-extrabold text-navy-900 tracking-tight max-md:text-[26px]">{offer.highlight}</span>
                      <span className="text-xs text-gray-500 font-medium leading-tight">{offer.highlightSub}</span>
                    </div>
                    <Link href={offer.href} className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-accent-500 cursor-pointer no-underline">
                      Learn more <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="py-16 bg-gray-50 border-t border-gray-200 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <div className="text-center mb-10 max-md:mb-6">
              <h2 className="text-[30px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Your security is our priority</h2>
              <p className="text-[15px] text-gray-500">Advanced technology and strict protocols to keep your accounts safe.</p>
            </div>
            <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-md:grid-cols-2 max-md:gap-2.5">
              {trustItems.map((item) => (
                <div key={item.title} className="bg-white rounded-[10px] border border-gray-200 p-6 text-center max-md:p-3.5 max-md:text-center">
                  <div className="w-12 h-12 bg-navy-900/5 rounded-xl flex items-center justify-center mx-auto mb-3 text-navy-700 max-md:w-9 max-md:h-9 max-md:rounded-lg max-md:mb-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="max-md:w-[18px] max-md:h-[18px]"><path d={item.icon} /></svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 mb-1 max-md:text-[12.5px] max-md:mb-0.5">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-snug max-md:text-[11px] max-sm:hidden">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CARD SHOWCASE */}
        <section className="py-16 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <div className="grid grid-cols-2 gap-20 items-center max-lg:grid-cols-1 max-lg:gap-10 max-md:gap-6">
              {/* Card Visual */}
              <div className="relative flex justify-center items-center min-h-[380px] max-md:min-h-[260px] max-md:order-first">
                <div className="absolute w-[340px] h-[220px] bg-[radial-gradient(ellipse,rgba(0,102,164,0.18)_0%,transparent_70%)] blur-[50px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-[1]" style={{ perspective: '1200px' }}>
                  <div className="absolute -top-3.5 -right-3.5 bg-cta-primary text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full z-10 shadow-lg max-md:text-[9px] max-md:px-2.5 max-md:py-1 max-md:-top-2.5 max-md:-right-2">NO ANNUAL FEE</div>
                  <div className="w-[360px] h-[228px] rounded-2xl p-7 flex flex-col justify-between bg-gradient-to-br from-navy-900 via-navy-700 to-accent-600/80 shadow-[0_25px_60px_rgba(10,22,40,0.4)] max-md:w-[290px] max-md:h-[184px] max-md:p-5 max-md:rounded-[14px] max-sm:w-[260px] max-sm:h-[166px] max-sm:p-[18px]">
                    <div className="flex justify-between items-start relative z-[1]">
                      <div>
                        <div className="text-sm font-extrabold text-white tracking-wider uppercase max-md:text-xs">MERIDIAN</div>
                        <div className="text-[9.5px] font-semibold text-white/50 tracking-widest mt-0.5">Cash Rewards</div>
                      </div>
                    </div>
                    <div className="relative z-[1] flex items-center gap-3.5">
                      <div className="w-10 h-[30px] rounded-[5px] bg-gradient-to-br from-yellow-500 via-yellow-300 to-yellow-600 max-md:w-[34px] max-md:h-[26px]" />
                      <div className="text-[17px] text-white/80 tracking-[0.18em] font-medium max-md:text-sm max-sm:text-[13px]">4821 •••• •••• 7156</div>
                    </div>
                    <div className="flex justify-between items-end relative z-[1]">
                      <div>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-white/35 mb-0.5 max-md:text-[7px]">Card Holder</div>
                        <div className="text-[12.5px] font-semibold text-white/85 tracking-wider uppercase max-md:text-[11px]">J. Anderson</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[7.5px] font-bold uppercase tracking-wider text-white/35 mb-0.5 max-md:text-[7px]">Valid Thru</div>
                        <div className="text-[12.5px] font-semibold text-white/70 max-md:text-[11px]">09/28</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div>
                <h2 className="text-[30px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Meridian Cash Rewards Card</h2>
                <div className="text-[15px] font-bold text-accent-600 mb-3">Unlimited 1.5% cash back. No annual fee.</div>
                <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
                  Earn cash back on every purchase with no rotating categories. Plus, get a $200 bonus after spending $1,000 in the first 90 days.
                </p>
                <ul className="list-none mb-7">
                  {cardFeatures.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 py-2 text-sm text-gray-700 font-medium">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f7b3f" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 max-md:flex-col">
                  <Link href="/personal/cash-back-card">
                    <button className="px-7 py-3 text-sm font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans transition-all hover:bg-cta-hover max-md:w-full">Learn more</button>
                  </Link>
                  <Link href="/personal/compare-cards">
                    <button className="px-7 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer font-sans transition-all hover:border-gray-400 max-md:w-full">See all cards</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GUIDANCE */}
        <section className="py-16 bg-gray-50 border-t border-gray-200 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <div className="text-center mb-10 max-md:mb-6">
              <h2 className="text-[30px] font-extrabold text-gray-800 mb-2 max-md:text-[22px]">Financial guidance and resources</h2>
              <p className="text-[15px] text-gray-500">Tools and articles to help you make informed financial decisions.</p>
            </div>
            <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4">
              {guides.map((g) => (
                <Link key={g.title} href={g.href} className="bg-white rounded-[10px] border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer no-underline">
                  <div className="h-[180px] overflow-hidden bg-gray-200">
                    <img src={`https://images.unsplash.com/${g.img}?w=600&h=400&fit=crop&q=80`} alt={g.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-accent-600 mb-2 block">{g.cat}</span>
                    <h3 className="text-[15px] font-bold text-gray-800 mb-1 leading-snug">{g.title}</h3>
                    <p className="text-[13px] text-gray-500">{g.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-accent-500 mt-3">
                      Read more <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* MOBILE APP */}
        <section className="py-16 bg-gradient-to-br from-navy-900 to-navy-700 max-md:py-10">
          <div className="max-w-container mx-auto px-6">
            <div className="grid grid-cols-[1fr_360px] gap-16 items-center max-lg:grid-cols-1 max-md:text-center">
              <div>
                <h2 className="text-[30px] font-extrabold text-white mb-3 max-md:text-[24px]">Banking in your pocket.</h2>
                <p className="text-[15px] text-white/60 leading-relaxed mb-8 max-w-[440px] max-md:max-w-none">
                  Manage accounts, send payments, deposit checks, and track spending — all from the Meridian Bank mobile app.
                </p>
                <ul className="list-none mb-8">
                  {['Mobile check deposit', 'Instant balance alerts', 'Card lock & unlock', 'Fingerprint & Face ID'].map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 py-1.5 text-sm text-white/80 font-medium max-md:justify-center">
                      <div className="w-5 h-5 rounded-full bg-emerald-400/15 flex items-center justify-center shrink-0">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/open-account">
                  <button className="px-8 py-3.5 text-[15px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans transition-all hover:bg-cta-hover">
                    Explore the app
                  </button>
                </Link>
              </div>

              {/* Phone Mockup */}
              <div className="flex justify-center max-lg:hidden">
                <div className="relative">
                  <div className="absolute w-[280px] h-[380px] bg-[radial-gradient(ellipse,rgba(0,102,164,0.25)_0%,transparent_70%)] blur-[50px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <div className="w-[260px] h-[530px] bg-[#111] rounded-[36px] p-[11px] relative z-[1] shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
                    <div className="w-full h-full bg-white rounded-[27px] overflow-hidden">
                      <div className="bg-gradient-to-b from-navy-800 to-navy-700 pb-5">
                        <div className="px-5 pt-3 pb-1.5 flex justify-between text-[11px] font-semibold text-white">
                          <span>9:41</span><span>●●●</span>
                        </div>
                        <div className="px-4 text-white">
                          <div className="text-[11px] text-white/60">Good morning</div>
                          <div className="text-[17px] font-bold mt-0.5">James A.</div>
                        </div>
                      </div>
                      <div className="-mt-2.5 mx-3.5 bg-white rounded-xl p-4 shadow-md relative z-[2]">
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Total Balance</div>
                        <div className="text-[26px] font-extrabold text-gray-800 mt-0.5 mb-2.5 tracking-tight">$17,697.83</div>
                        <div className="flex gap-1.5">
                          {[{ name: 'Checking', amt: '$5,247' }, { name: 'Savings', amt: '$12,450' }].map((acc) => (
                            <div key={acc.name} className="flex-1 p-2 bg-gray-50 rounded-lg text-center">
                              <div className="text-[9px] font-semibold text-gray-500">{acc.name}</div>
                              <div className="text-[13px] font-bold text-gray-800 mt-0.5">{acc.amt}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="personal" />
    </>
  );
}
