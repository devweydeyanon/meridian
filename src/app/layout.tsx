import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meridian Bank — Personal Banking, Business Banking, Loans & Investments',
  description: 'Meridian Bank offers checking, savings, credit cards, mortgages, auto loans, investing, and business banking. Member FDIC.',
  icons: { icon: '/static/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
