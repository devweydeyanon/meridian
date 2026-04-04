export interface NavItem {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
}

export const personalNav: NavItem[] = [
  {
    label: 'Checking',
    href: '/personal/compare-checking',
    dropdown: [
      { label: 'Total Checking®', href: '/personal/total-checking' },
      { label: 'Secure Checking', href: '/personal/secure-checking' },
      { label: 'Premier Checking', href: '/personal/premier-checking' },
      { label: 'Student Checking', href: '/personal/student-checking' },
    ],
  },
  {
    label: 'Savings & CDs',
    href: '/personal/savings-rates',
    dropdown: [
      { label: 'High Yield Savings', href: '/personal/high-yield-savings' },
      { label: 'Money Market', href: '/personal/money-market' },
      { label: 'CDs', href: '/personal/certificates-of-deposit' },
      { label: 'CD Rates', href: '/personal/savings-rates' },
    ],
  },
  {
    label: 'Credit Cards',
    href: '/personal/compare-cards',
    dropdown: [
      { label: 'Cash Back', href: '/personal/cash-back-card' },
      { label: 'Travel Rewards', href: '/personal/travel-rewards-card' },
      { label: 'Balance Transfer', href: '/personal/balance-transfer-card' },
    ],
  },
  {
    label: 'Loans',
    href: '/personal/mortgages',
    dropdown: [
      { label: 'Mortgages', href: '/personal/mortgages' },
      { label: 'Home Equity', href: '/personal/home-equity' },
      { label: 'Personal Loans', href: '/personal/personal-loans' },
      { label: 'Auto Loans', href: '/personal/auto-loans' },
    ],
  },
  {
    label: 'Investing',
    href: '/personal/self-directed-investing',
    dropdown: [
      { label: 'Self-Directed', href: '/personal/self-directed-investing' },
      { label: 'Managed Portfolios', href: '/personal/managed-portfolios' },
      { label: 'Retirement', href: '/personal/retirement-accounts' },
      { label: 'Education Savings', href: '/personal/education-savings' },
    ],
  },
];

export const businessNav: NavItem[] = [
  {
    label: 'Checking',
    href: '/business/compare-accounts',
    dropdown: [
      { label: 'Essential Checking', href: '/business/essential-checking' },
      { label: 'Performance Checking', href: '/business/performance-checking' },
      { label: 'Business Savings', href: '/business/business-savings' },
      { label: 'Compare Accounts', href: '/business/compare-accounts' },
    ],
  },
  {
    label: 'Credit Cards',
    href: '/business/cash-back-card',
    dropdown: [
      { label: 'Business Cash Back', href: '/business/cash-back-card' },
      { label: 'Business Travel', href: '/business/travel-rewards-card' },
    ],
  },
  {
    label: 'Lending',
    href: '/business/line-of-credit',
    dropdown: [
      { label: 'Line of Credit', href: '/business/line-of-credit' },
      { label: 'Term Loans & SBA', href: '/business/term-loans' },
    ],
  },
  {
    label: 'Payments',
    href: '/business/payments',
  },
];

export const corporateNav: NavItem[] = [
  { label: 'Investment Banking', href: '/corporate/investment-banking' },
  { label: 'Global Markets', href: '/corporate/global-markets' },
  { label: 'Treasury & Payments', href: '/corporate/treasury-payments' },
  { label: 'Lending', href: '/corporate/lending' },
  { label: 'Insights', href: '/corporate/insights' },
];

export interface MobileNavSection {
  title: string;
  links: { label: string; href: string }[];
}

export const personalMobileNav: MobileNavSection[] = [
  {
    title: 'Checking',
    links: [
      { label: 'Total Checking®', href: '/personal/total-checking' },
      { label: 'Secure Checking', href: '/personal/secure-checking' },
      { label: 'Premier Checking', href: '/personal/premier-checking' },
      { label: 'Student Checking', href: '/personal/student-checking' },
    ],
  },
  {
    title: 'Savings & CDs',
    links: [
      { label: 'High Yield Savings', href: '/personal/high-yield-savings' },
      { label: 'Money Market', href: '/personal/money-market' },
      { label: 'CDs', href: '/personal/certificates-of-deposit' },
    ],
  },
  {
    title: 'Credit Cards',
    links: [
      { label: 'Cash Back', href: '/personal/cash-back-card' },
      { label: 'Travel Rewards', href: '/personal/travel-rewards-card' },
      { label: 'Balance Transfer', href: '/personal/balance-transfer-card' },
    ],
  },
  {
    title: 'Loans',
    links: [
      { label: 'Mortgages', href: '/personal/mortgages' },
      { label: 'Home Equity', href: '/personal/home-equity' },
      { label: 'Personal Loans', href: '/personal/personal-loans' },
      { label: 'Auto Loans', href: '/personal/auto-loans' },
    ],
  },
  {
    title: 'Investing',
    links: [
      { label: 'Self-Directed', href: '/personal/self-directed-investing' },
      { label: 'Managed Portfolios', href: '/personal/managed-portfolios' },
      { label: 'Retirement', href: '/personal/retirement-accounts' },
      { label: 'Education Savings', href: '/personal/education-savings' },
    ],
  },
];

export const businessMobileNav: MobileNavSection[] = [
  {
    title: 'Checking & Savings',
    links: [
      { label: 'Essential Checking', href: '/business/essential-checking' },
      { label: 'Performance Checking', href: '/business/performance-checking' },
      { label: 'Business Savings', href: '/business/business-savings' },
      { label: 'Compare Accounts', href: '/business/compare-accounts' },
    ],
  },
  {
    title: 'Credit Cards',
    links: [
      { label: 'Business Cash Back', href: '/business/cash-back-card' },
      { label: 'Business Travel', href: '/business/travel-rewards-card' },
    ],
  },
  {
    title: 'Lending',
    links: [
      { label: 'Line of Credit', href: '/business/line-of-credit' },
      { label: 'Term Loans & SBA', href: '/business/term-loans' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Payments', href: '/business/payments' },
    ],
  },
];

export const corporateMobileNav: MobileNavSection[] = [
  {
    title: 'Services',
    links: [
      { label: 'Investment Banking', href: '/corporate/investment-banking' },
      { label: 'Global Markets', href: '/corporate/global-markets' },
      { label: 'Treasury & Payments', href: '/corporate/treasury-payments' },
      { label: 'Lending', href: '/corporate/lending' },
      { label: 'Insights', href: '/corporate/insights' },
    ],
  },
];
