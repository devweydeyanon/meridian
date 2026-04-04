import type { Metadata } from 'next';
import { CookieBanner } from '@/components/layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meridian Bank — Personal Banking, Business Banking, Loans & Investments',
  description: 'Meridian Bank offers checking, savings, credit cards, mortgages, auto loans, investing, and business banking. Member FDIC.',
  icons: { icon: '/favicon.svg' },
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
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
