import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const stats = [
  { value: '500+', label: 'Branches' },
  { value: '16,000+', label: 'ATMs' },
  { value: '48', label: 'States' },
];

export default function BranchesPage() {
  return (
    <>
      <Header variant="personal" />
      <main id="main-content">
        <section className="bg-navy-900 py-10 max-md:py-7">
          <div className="max-w-container mx-auto px-6">
            <h1 className="text-[30px] font-extrabold text-white mb-1.5 max-md:text-[24px]">Find a branch or ATM</h1>
            <p className="text-[15px] text-white/60">Locate the nearest Meridian Bank branch or ATM.</p>
          </div>
        </section>
        <section className="py-10 max-md:py-6">
          <div className="max-w-container mx-auto px-6">
            <div className="flex gap-4 mb-8 max-md:flex-col">
              <input type="text" placeholder="Enter city, state, or ZIP code" className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-accent-500" />
              <button className="px-8 py-3 text-sm font-bold text-white bg-cta-primary border-none rounded-lg cursor-pointer font-sans hover:bg-cta-hover transition-all">Search</button>
            </div>
            <div className="bg-gray-200 rounded-xl h-[400px] flex items-center justify-center text-gray-400 text-sm max-md:h-[240px]">
              Map placeholder — Enter a location to find nearby branches
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8 max-md:grid-cols-1">
              {stats.map((s) => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-[10px] p-5 text-center">
                  <div className="text-[32px] font-extrabold text-navy-900 max-md:text-2xl">{s.value}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer variant="personal" />
    </>
  );
}
