import { Header, Footer } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'About Us — Meridian Bank',
  description: 'Learn about Meridian Bank\'s history, mission, values, and leadership team. Serving individuals and businesses since 1987.',
};

const executives = [
  { name: 'Catherine R. Morrison', title: 'Chief Executive Officer', initials: 'CM', years: '2018–Present', bio: 'Over 30 years in financial services. Previously EVP at First National and Managing Director at Goldman Sachs.' },
  { name: 'David L. Park', title: 'Chief Financial Officer', initials: 'DP', years: '2020–Present', bio: '25 years in banking finance. Former CFO of Pacific Commerce Bank. MBA from Wharton.' },
  { name: 'Margaret A. Thornton', title: 'Chief Operating Officer', initials: 'MT', years: '2019–Present', bio: 'Led digital transformation at three major banks. Previously SVP Operations at Wells Fargo.' },
  { name: 'James K. Okonkwo', title: 'Chief Risk Officer', initials: 'JO', years: '2021–Present', bio: 'Two decades in risk management and regulatory compliance. Former Director at the OCC.' },
  { name: 'Sarah E. Whitfield', title: 'Chief Technology Officer', initials: 'SW', years: '2022–Present', bio: 'Led engineering teams at Stripe and Square. Built payment infrastructure processing $80B+ annually.' },
  { name: 'Robert T. Vasquez', title: 'Head of Commercial Banking', initials: 'RV', years: '2017–Present', bio: '28 years in commercial lending. Grew Meridian\'s commercial portfolio from $2B to $14B.' },
  { name: 'Dr. Anika L. Reddy', title: 'Head of Wealth Management', initials: 'AR', years: '2020–Present', bio: 'PhD in Economics from MIT. Previously managed $45B in assets at Merrill Lynch.' },
  { name: 'Thomas W. Chen', title: 'General Counsel', initials: 'TC', years: '2019–Present', bio: 'Former partner at Sullivan & Cromwell. Specializes in banking regulation and M&A.' },
];

const milestones = [
  { year: '1987', event: 'Meridian Bank founded in Philadelphia as a community savings institution with $12M in deposits.' },
  { year: '1994', event: 'Received national bank charter. Expanded to 25 branches across the Mid-Atlantic region.' },
  { year: '2001', event: 'Launched online banking platform. Crossed $5 billion in total assets.' },
  { year: '2008', event: 'Remained well-capitalized through the financial crisis. Acquired two regional banks.' },
  { year: '2012', event: 'Expanded commercial and corporate banking divisions. Total assets surpassed $20 billion.' },
  { year: '2016', event: 'Launched mobile banking app. Named "Best Digital Bank" by American Banker.' },
  { year: '2020', event: 'Processed over $3 billion in PPP loans. Opened innovation lab in San Francisco.' },
  { year: '2024', event: 'Total assets exceeded $85 billion. Expanded wealth management to 14 states.' },
  { year: '2026', event: 'Serving 4.2 million customers. Ranked among the top 25 U.S. banks by assets.' },
];

export default function AboutPage() {
  return (
    <>
      <Header variant="personal" />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-navy-900 text-white py-20 max-md:py-14">
          <div className="max-w-[1100px] mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">About Meridian Bank</p>
            <h1 className="text-[38px] max-md:text-[28px] font-extrabold leading-tight mb-4">Building financial futures<br className="max-md:hidden" /> since 1987.</h1>
            <p className="text-base text-white/70 max-w-[600px] leading-relaxed">
              From a single branch in Philadelphia to a nationally chartered institution serving millions, 
              Meridian Bank has grown by putting clients first — every decision, every day.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 max-md:py-10 bg-white">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="grid grid-cols-2 gap-16 max-md:grid-cols-1 max-md:gap-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent-500 mb-2">Our Mission</p>
                <h2 className="text-[24px] font-bold text-gray-900 mb-4">To empower every person and business to achieve financial confidence.</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We believe banking should be straightforward, secure, and accessible. Every product we build, 
                  every service we offer, and every interaction we have is measured against one standard: 
                  does this make our clients more financially confident?
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent-500 mb-2">Our Values</p>
                <div className="space-y-4">
                  {[
                    { name: 'Integrity', desc: 'We do what\'s right, even when no one is watching. Transparency is not a policy — it\'s our foundation.' },
                    { name: 'Stewardship', desc: 'Your money is your future. We protect it with the same care we\'d give our own.' },
                    { name: 'Innovation', desc: 'Banking should get better every year. We invest in technology that serves people, not the other way around.' },
                    { name: 'Community', desc: 'We reinvest in the communities where our clients live and work. $2.3 billion in community development since 2010.' },
                  ].map(v => (
                    <div key={v.name}>
                      <div className="text-sm font-bold text-gray-900">{v.name}</div>
                      <p className="text-sm text-gray-500 mt-0.5">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Facts */}
        <section className="py-14 max-md:py-10 bg-gray-50">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="grid grid-cols-4 gap-6 max-md:grid-cols-2 text-center">
              {[
                { stat: '$85B+', label: 'Total Assets' },
                { stat: '4.2M', label: 'Customers Served' },
                { stat: '380+', label: 'Branches Nationwide' },
                { stat: '12,000+', label: 'Employees' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-[32px] max-md:text-[24px] font-extrabold text-navy-900">{s.stat}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-16 max-md:py-10 bg-white">
          <div className="max-w-[1100px] mx-auto px-6">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-500 mb-2">Leadership</p>
            <h2 className="text-[24px] font-bold text-gray-900 mb-8">Executive Team</h2>
            <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
              {executives.map(e => (
                <div key={e.name} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-navy-900 text-white flex items-center justify-center text-lg font-bold mb-3">{e.initials}</div>
                  <div className="text-sm font-bold text-gray-900">{e.name}</div>
                  <div className="text-xs font-semibold text-accent-500 mt-0.5">{e.title}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{e.years}</div>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{e.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 max-md:py-10 bg-gray-50">
          <div className="max-w-[800px] mx-auto px-6">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-500 mb-2">Our History</p>
            <h2 className="text-[24px] font-bold text-gray-900 mb-8">Nearly four decades of growth</h2>
            <div className="space-y-0">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0">{m.year}</div>
                    {i < milestones.length - 1 && <div className="w-px flex-1 bg-gray-300 my-1" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm text-gray-700 leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 max-md:py-10 bg-navy-900 text-white text-center">
          <div className="max-w-[600px] mx-auto px-6">
            <h2 className="text-[24px] font-bold mb-3">Ready to bank with Meridian?</h2>
            <p className="text-sm text-white/60 mb-6">Join 4.2 million customers who trust us with their financial future.</p>
            <div className="flex gap-3 justify-center max-md:flex-col max-md:px-6">
              <Link href="/open-account" className="px-6 py-3 text-sm font-bold bg-cta-primary text-white rounded-md no-underline hover:bg-red-700 transition-all">Open an Account</Link>
              <Link href="/contact" className="px-6 py-3 text-sm font-bold bg-white/10 text-white rounded-md no-underline hover:bg-white/20 transition-all">Contact Us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="personal" />
    </>
  );
}
