import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://meridianplc.com';

  const staticPages = [
    '', 'about', 'contact', 'login', 'open-account', 'help', 'faqs',
    'branches', 'security', 'privacy', 'terms',
  ];

  const personalPages = [
    'checking', 'savings', 'credit-cards', 'cash-back-credit-card', 'travel-rewards-card',
    'secured-credit-card', 'mortgage', 'home-equity', 'auto-loans', 'personal-loans',
    'student-loans', 'investments', 'retirement', 'wealth-management',
    'rewards', 'mobile-banking', 'financial-tools', 'student-banking',
  ];

  const businessPages = [
    '', 'checking', 'savings', 'credit-cards', 'lending', 'merchant-services',
    'payroll', 'treasury', 'sba-loans',
  ];

  const corporatePages = [
    '', 'investment-banking', 'treasury-payments', 'lending', 'global-markets',
    'risk-management', 'technology', 'healthcare', 'real-estate', 'energy',
  ];

  const insightsSlugs = [
    'first-home-guide', 'retirement-planning-basics', 'small-business-cash-flow',
    'credit-score-guide', 'tax-planning-strategies', 'market-outlook-2026',
    'digital-banking-security', 'estate-planning-essentials',
    'sustainable-investing', 'ai-banking-future', 'global-trade-finance',
  ];

  return [
    ...staticPages.map(p => ({ url: `${base}/${p}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.8 })),
    ...personalPages.map(p => ({ url: `${base}/personal/${p}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...businessPages.map(p => ({ url: `${base}/business${p ? '/' + p : ''}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...corporatePages.map(p => ({ url: `${base}/corporate${p ? '/' + p : ''}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...insightsSlugs.map(p => ({ url: `${base}/insights/${p}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.5 })),
  ];
}
