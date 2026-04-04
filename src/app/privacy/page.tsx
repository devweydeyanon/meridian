import { Header, Footer } from '@/components/layout';

export default function PrivacyPage() {
  return (
    <>
      <Header variant="personal" />
      <main id="main-content">
        <section className="bg-navy-900 py-10 max-md:py-7">
          <div className="max-w-container mx-auto px-6">
            <h1 className="text-[30px] font-extrabold text-white mb-1.5 max-md:text-[24px]">Privacy Policy</h1>
            <p className="text-[15px] text-white/60">Last updated: March 2026</p>
          </div>
        </section>
        <section className="py-14 max-md:py-8">
          <div className="max-w-[800px] mx-auto px-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Overview</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">This Privacy Policy governs your use of Meridian Bank services. By accessing our services, you agree to the collection and use of information as described.</p>
            <h2 className="text-xl font-bold text-gray-800">Information We Collect</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">We collect information you provide directly, such as when you open an account, apply for a product, or contact us. This includes your name, address, Social Security number, financial information, and transaction data.</p>
            <h2 className="text-xl font-bold text-gray-800">How We Use Your Information</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">We use your information to provide and improve our services, process transactions, communicate with you, prevent fraud, and comply with legal obligations.</p>
            <h2 className="text-xl font-bold text-gray-800">Data Security</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">We implement industry-standard security measures including 256-bit SSL encryption, multi-factor authentication, and continuous monitoring to protect your personal and financial information.</p>
            <h2 className="text-xl font-bold text-gray-800">Your Rights</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">You have the right to access, correct, or delete your personal information. Contact us at 1-800-MERIDIAN or visit any branch for assistance.</p>
            <p className="text-sm text-gray-400 pt-6 border-t border-gray-200">© 2026 Meridian Bank, N.A. Member FDIC. Equal Housing Lender.</p>
          </div>
        </section>
      </main>
      <Footer variant="personal" />
    </>
  );
}
