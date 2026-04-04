import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

const tips = [
  { title: 'Use strong, unique passwords', desc: 'Combine uppercase, lowercase, numbers, and symbols. Never reuse passwords across sites.' },
  { title: 'Enable two-factor authentication', desc: 'Add an extra layer of security to your online banking with SMS or authenticator verification.' },
  { title: 'Monitor your accounts regularly', desc: 'Review transactions weekly and set up real-time alerts for all account activity.' },
  { title: 'Be cautious of phishing', desc: 'Meridian will never ask for your password via email or text. When in doubt, call us directly.' },
  { title: 'Keep software updated', desc: 'Install the latest updates for your devices, browsers, and the Meridian mobile app.' },
  { title: 'Secure your devices', desc: 'Use screen locks, fingerprint, or Face ID. Avoid banking on public Wi-Fi networks.' },
];

export default function SecurityPage() {
  return (
    <>
      <Header variant="personal" />
      <main id="main-content">
        <section className="bg-navy-900 py-10 max-md:py-7">
          <div className="max-w-container mx-auto px-6">
            <h1 className="text-[30px] font-extrabold text-white mb-1.5 max-md:text-[24px]">Security Center</h1>
            <p className="text-[15px] text-white/60">How we protect your accounts and how you can help.</p>
          </div>
        </section>
        <section className="py-14 max-md:py-8">
          <div className="max-w-container mx-auto px-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex gap-4 items-start mb-10 max-md:flex-col">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f7b3f" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <div>
                <h3 className="text-[15px] font-bold text-emerald-800 mb-1">Your accounts are protected</h3>
                <p className="text-sm text-emerald-700">Meridian uses 256-bit SSL encryption, real-time fraud monitoring, and Zero Liability protection on all accounts. Your deposits are FDIC insured up to $250,000.</p>
              </div>
            </div>
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-6 max-md:text-[22px]">Security best practices</h2>
            <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
              {tips.map((tip) => (
                <div key={tip.title} className="bg-white border border-gray-200 rounded-[10px] p-6 max-md:p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-1.5">{tip.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 bg-red-50 border border-red-200 rounded-xl max-md:p-5">
              <h3 className="text-[15px] font-bold text-red-800 mb-2">Report suspicious activity</h3>
              <p className="text-sm text-red-700 mb-4">If you suspect fraud or unauthorized access, act immediately.</p>
              <div className="flex gap-3 max-md:flex-col">
                <a href="tel:18009359935" className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 rounded-md no-underline text-center">Call 1-800-935-9935</a>
                <Link href="/contact" className="px-6 py-2.5 text-sm font-bold text-red-700 bg-white border border-red-300 rounded-md no-underline text-center">Report online</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="personal" />
    </>
  );
}
