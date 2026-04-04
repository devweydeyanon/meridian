import { Header, Footer } from '@/components/layout';

export default function TermsPage() {
  return (
    <>
      <Header variant="personal" />
      <main id="main-content">
        <section className="bg-navy-900 py-10 max-md:py-7">
          <div className="max-w-container mx-auto px-6">
            <h1 className="text-[30px] font-extrabold text-white mb-1.5 max-md:text-[24px]">Terms of Use</h1>
            <p className="text-[15px] text-white/60">Last updated: March 2026</p>
          </div>
        </section>
        <section className="py-14 max-md:py-8">
          <div className="max-w-[800px] mx-auto px-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Acceptance of Terms</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">By accessing or using Meridian Bank services, you agree to be bound by these Terms of Use and all applicable laws and regulations.</p>
            <h2 className="text-xl font-bold text-gray-800">Account Responsibilities</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.</p>
            <h2 className="text-xl font-bold text-gray-800">Electronic Communications</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">By using our online and mobile services, you consent to receive electronic communications from us regarding your accounts, including statements, notices, and disclosures.</p>
            <h2 className="text-xl font-bold text-gray-800">Limitation of Liability</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">Meridian Bank shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services, except as required by applicable law.</p>
            <h2 className="text-xl font-bold text-gray-800">Governing Law</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">These terms are governed by the laws of the State of Delaware and applicable federal law.</p>
            <p className="text-sm text-gray-400 pt-6 border-t border-gray-200">© 2026 Meridian Bank, N.A. Member FDIC. Equal Housing Lender.</p>
          </div>
        </section>
      </main>
      <Footer variant="personal" />
    </>
  );
}
