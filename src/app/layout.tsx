import type { Metadata } from 'next';
import { CookieBanner } from '@/components/layout';
import { OfflineBanner } from '@/components/OfflineBanner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meridian Bank — Personal Banking, Business Banking, Loans & Investments',
  description: 'Meridian Bank offers checking, savings, credit cards, mortgages, auto loans, investing, and business banking. Member FDIC. Equal Housing Lender.',
  icons: { icon: '/favicon.svg' },
  metadataBase: new URL('https://meridianplc.com'),
  openGraph: {
    title: 'Meridian Bank — Banking Built Around You',
    description: 'Checking, savings, credit cards, mortgages, investments, and business banking. Trusted by 4.2 million customers. Member FDIC.',
    url: 'https://meridianplc.com',
    siteName: 'Meridian Bank',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meridian Bank — Banking Built Around You',
    description: 'Checking, savings, credit cards, mortgages, investments, and business banking. Member FDIC.',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'theme-color': '#0a1628',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans text-gray-800 bg-white leading-normal antialiased">
        <a href="#main-content" className="absolute -top-10 left-0 bg-accent-500 text-white px-4 py-2 z-[99999] text-sm font-semibold no-underline focus:top-0 transition-[top] duration-200">
          Skip to main content
        </a>
        <OfflineBanner />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
