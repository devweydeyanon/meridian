// ============================================
// COMPREHENSIVE SEED DATA — 5 Users, 2 Years of History
// ============================================

export interface UserSeed {
  email: string; password: string; first_name: string; last_name: string; phone: string;
  checking: number; savings: number; emergency: number; cd: number; cdApy: string; cdMaturity: string;
  cc1Name: string; cc1Limit: number; cc1Balance: number; cc1Due: string; cc1Rewards: string;
  cc2Name: string; cc2Limit: number; cc2Balance: number; cc2Due: string; cc2Rewards: string;
  transactions: TxSeed[];
  payees: PayeeSeed[];
}

interface TxSeed {
  desc: string; amount: number; type: 'credit' | 'debit'; category: string;
  acct: 'checking' | 'savings' | 'cc1' | 'cc2'; daysAgo: number; status?: string;
}

interface PayeeSeed {
  name: string; category: string; amount: number; daysAgo: number;
}

// Recurring transaction templates
function recurring(desc: string, amount: number, category: string, acct: 'checking' | 'cc1' | 'cc2', intervalDays: number, count: number): TxSeed[] {
  return Array.from({ length: count }, (_, i) => ({
    desc, amount: -(Math.abs(amount) + (Math.random() * 2 - 1)), type: 'debit' as const,
    category, acct, daysAgo: i * intervalDays + Math.floor(Math.random() * 3),
  }));
}

function paycheck(amount: number, count: number, desc = 'Direct Deposit — Employer'): TxSeed[] {
  return Array.from({ length: count }, (_, i) => ({
    desc, amount, type: 'credit' as const, category: 'Income', acct: 'checking' as const,
    daysAgo: i * 14 + (i % 2),
  }));
}

function interest(count: number, baseAmount: number): TxSeed[] {
  return Array.from({ length: count }, (_, i) => ({
    desc: 'Interest Payment', amount: baseAmount + Math.random() * 5,
    type: 'credit' as const, category: 'Interest', acct: 'savings' as const,
    daysAgo: i * 30 + 1,
  }));
}

function randomSpend(merchants: { desc: string; min: number; max: number; category: string }[], acct: 'checking' | 'cc1' | 'cc2', count: number, maxDaysAgo: number): TxSeed[] {
  return Array.from({ length: count }, () => {
    const m = merchants[Math.floor(Math.random() * merchants.length)];
    const amount = -(m.min + Math.random() * (m.max - m.min));
    return {
      desc: m.desc, amount: Math.round(amount * 100) / 100, type: 'debit' as const,
      category: m.category, acct, daysAgo: Math.floor(Math.random() * maxDaysAgo),
    };
  });
}

const groceryStores = [
  { desc: 'Whole Foods Market', min: 45, max: 185, category: 'Groceries' },
  { desc: 'Trader Joe\'s', min: 35, max: 120, category: 'Groceries' },
  { desc: 'Costco Wholesale', min: 95, max: 350, category: 'Groceries' },
  { desc: 'Safeway', min: 30, max: 145, category: 'Groceries' },
  { desc: 'Target', min: 25, max: 180, category: 'Shopping' },
];

const dining = [
  { desc: 'Starbucks', min: 4, max: 8, category: 'Dining' },
  { desc: 'Chipotle Mexican Grill', min: 10, max: 16, category: 'Dining' },
  { desc: 'Panera Bread', min: 11, max: 18, category: 'Dining' },
  { desc: 'DoorDash', min: 18, max: 55, category: 'Dining' },
  { desc: 'The Cheesecake Factory', min: 45, max: 120, category: 'Dining' },
  { desc: 'McDonald\'s', min: 7, max: 14, category: 'Dining' },
  { desc: 'Sweetgreen', min: 12, max: 18, category: 'Dining' },
];

const transport = [
  { desc: 'Shell Gas Station', min: 35, max: 75, category: 'Auto' },
  { desc: 'Chevron', min: 38, max: 72, category: 'Auto' },
  { desc: 'Uber', min: 12, max: 45, category: 'Transport' },
  { desc: 'Lyft', min: 10, max: 38, category: 'Transport' },
];

const shopping = [
  { desc: 'Amazon.com', min: 15, max: 250, category: 'Shopping' },
  { desc: 'Apple.com', min: 10, max: 200, category: 'Shopping' },
  { desc: 'Nordstrom', min: 50, max: 350, category: 'Shopping' },
  { desc: 'Home Depot', min: 25, max: 280, category: 'Shopping' },
  { desc: 'Nike.com', min: 45, max: 180, category: 'Shopping' },
  { desc: 'Best Buy', min: 30, max: 500, category: 'Shopping' },
];

const health = [
  { desc: 'CVS Pharmacy', min: 8, max: 65, category: 'Health' },
  { desc: 'Walgreens', min: 10, max: 55, category: 'Health' },
  { desc: 'Kaiser Permanente', min: 25, max: 150, category: 'Health' },
];

// ============================================
// USER 1: Michael Chen — Senior Software Engineer
// ============================================
const michael: UserSeed = {
  email: 'michael.chen@meridianbank.demo', password: 'Meridian2026!',
  first_name: 'Michael', last_name: 'Chen', phone: '(415) 555-2847',
  checking: 95664.38, savings: 256900.00, emergency: 70000, cd: 150000,
  cdApy: '4.75%', cdMaturity: '2027-03-15',
  cc1Name: 'Meridian Rewards Visa Signature', cc1Limit: 30000, cc1Balance: 6483.74, cc1Due: '2026-04-22', cc1Rewards: '48,320 pts',
  cc2Name: 'Meridian Cash Back Mastercard', cc2Limit: 20000, cc2Balance: 3134.46, cc2Due: '2026-04-18', cc2Rewards: '$187.45',
  transactions: [
    ...paycheck(4800, 48),
    ...recurring('Meridian Mortgage Payment', 2850, 'Housing', 'checking', 30, 24),
    ...recurring('AT&T Wireless', 89, 'Bills', 'checking', 30, 24),
    ...recurring('Netflix', 15.99, 'Entertainment', 'cc1', 30, 24),
    ...recurring('Spotify Premium', 10.99, 'Entertainment', 'cc1', 30, 24),
    ...recurring('Adobe Creative Cloud', 54.99, 'Bills', 'cc1', 30, 12),
    ...recurring('PG&E Electric', 145, 'Bills', 'checking', 30, 24),
    ...recurring('Comcast Internet', 79.99, 'Bills', 'checking', 30, 24),
    ...recurring('State Farm Insurance', 156, 'Insurance', 'checking', 30, 24),
    ...recurring('Tesla Loan Payment', 687, 'Auto', 'checking', 30, 24),
    ...interest(24, 42.50),
    ...randomSpend(groceryStores, 'checking', 45, 700),
    ...randomSpend(dining, 'cc1', 60, 700),
    ...randomSpend(transport, 'checking', 30, 700),
    ...randomSpend(shopping, 'cc2', 35, 700),
    ...randomSpend(health, 'checking', 12, 700),
    { desc: 'Transfer to Savings', amount: -2000, type: 'debit', category: 'Transfer', acct: 'checking', daysAgo: 5 },
    { desc: 'Transfer from Checking', amount: 2000, type: 'credit', category: 'Transfer', acct: 'savings', daysAgo: 5 },
    { desc: 'Zelle — David W.', amount: -350, type: 'debit', category: 'Transfer', acct: 'checking', daysAgo: 8 },
    { desc: 'Zelle — Lisa K.', amount: 120, type: 'credit', category: 'Transfer', acct: 'checking', daysAgo: 15 },
    { desc: 'Apple Store — MacBook Pro', amount: -2499, type: 'debit', category: 'Shopping', acct: 'cc1', daysAgo: 45 },
    { desc: 'Delta Airlines', amount: -487.50, type: 'debit', category: 'Travel', acct: 'cc1', daysAgo: 62 },
    { desc: 'Marriott Hotels', amount: -892, type: 'debit', category: 'Travel', acct: 'cc1', daysAgo: 60 },
    { desc: 'IRS Tax Refund', amount: 4280, type: 'credit', category: 'Income', acct: 'checking', daysAgo: 90 },
    { desc: 'Annual Bonus — Employer', amount: 12000, type: 'credit', category: 'Income', acct: 'checking', daysAgo: 180 },
    { desc: 'Whole Foods Market', amount: -127.43, type: 'debit', category: 'Groceries', acct: 'checking', daysAgo: 0, status: 'pending' },
    { desc: 'Uber Eats', amount: -34.50, type: 'debit', category: 'Dining', acct: 'cc1', daysAgo: 0, status: 'pending' },
  ],
  payees: [
    { name: 'PG&E Electric', category: 'Utilities', amount: 147.82, daysAgo: 12 },
    { name: 'Comcast Xfinity', category: 'Utilities', amount: 79.99, daysAgo: 8 },
    { name: 'State Farm Insurance', category: 'Insurance', amount: 156.00, daysAgo: 3 },
    { name: 'Tesla Finance', category: 'Auto', amount: 687.00, daysAgo: 15 },
    { name: 'San Jose Water Company', category: 'Utilities', amount: 52.30, daysAgo: 20 },
  ],
};

// ============================================
// USER 2: Sarah Johnson — Marketing Director
// ============================================
const sarah: UserSeed = {
  email: 'sarah.johnson@meridianbank.demo', password: 'Meridian2026!',
  first_name: 'Sarah', last_name: 'Johnson', phone: '(212) 555-3491',
  checking: 46837.10, savings: 178400.00, emergency: 40000, cd: 100000,
  cdApy: '4.50%', cdMaturity: '2027-06-30',
  cc1Name: 'Meridian Rewards Visa', cc1Limit: 40000, cc1Balance: 9784.60, cc1Due: '2026-04-20', cc1Rewards: '62,140 pts',
  cc2Name: 'Meridian Cash Back Mastercard', cc2Limit: 16000, cc2Balance: 4269.00, cc2Due: '2026-04-25', cc2Rewards: '$156.80',
  transactions: [
    ...paycheck(3850, 48, 'Direct Deposit — BrandCorp Inc.'),
    ...recurring('Manhattan Rent — Zelle', 3200, 'Housing', 'checking', 30, 24),
    ...recurring('T-Mobile', 75, 'Bills', 'checking', 30, 24),
    ...recurring('HBO Max', 15.99, 'Entertainment', 'cc1', 30, 18),
    ...recurring('Equinox Gym', 260, 'Health', 'cc1', 30, 24),
    ...recurring('ConEd Electric', 92, 'Bills', 'checking', 30, 24),
    ...recurring('Verizon FiOS', 69.99, 'Bills', 'checking', 30, 24),
    ...recurring('Renters Insurance', 45, 'Insurance', 'checking', 30, 24),
    ...interest(24, 31.20),
    ...randomSpend(groceryStores, 'checking', 50, 700),
    ...randomSpend(dining, 'cc1', 80, 700),
    ...randomSpend(transport, 'cc2', 45, 700),
    ...randomSpend(shopping, 'cc1', 40, 700),
    ...randomSpend(health, 'checking', 10, 700),
    { desc: 'Saks Fifth Avenue', amount: -1245, type: 'debit', category: 'Shopping', acct: 'cc1', daysAgo: 30 },
    { desc: 'JetBlue Airways', amount: -324.50, type: 'debit', category: 'Travel', acct: 'cc1', daysAgo: 55 },
    { desc: 'Airbnb — Miami', amount: -680, type: 'debit', category: 'Travel', acct: 'cc1', daysAgo: 53 },
    { desc: 'Bonus — Q4 Performance', amount: 5500, type: 'credit', category: 'Income', acct: 'checking', daysAgo: 120 },
    { desc: 'Venmo — Rachel T.', amount: -85, type: 'debit', category: 'Transfer', acct: 'checking', daysAgo: 3 },
    { desc: 'SoulCycle', amount: -36, type: 'debit', category: 'Health', acct: 'cc2', daysAgo: 1, status: 'pending' },
  ],
  payees: [
    { name: 'ConEdison', category: 'Utilities', amount: 94.50, daysAgo: 10 },
    { name: 'Verizon FiOS', category: 'Utilities', amount: 69.99, daysAgo: 5 },
    { name: 'T-Mobile', category: 'Utilities', amount: 75.00, daysAgo: 14 },
    { name: 'Equinox', category: 'Health', amount: 260.00, daysAgo: 2 },
    { name: 'Lemonade Insurance', category: 'Insurance', amount: 45.00, daysAgo: 18 },
  ],
};

// ============================================
// USER 3: James Williams — Retired
// ============================================
const james: UserSeed = {
  email: 'james.williams@meridianbank.demo', password: 'Meridian2026!',
  first_name: 'James', last_name: 'Williams', phone: '(480) 555-7821',
  checking: 312583.74, savings: 685600.00, emergency: 100000, cd: 400000,
  cdApy: '4.80%', cdMaturity: '2027-09-01',
  cc1Name: 'Meridian Rewards Visa Platinum', cc1Limit: 60000, cc1Balance: 2491.20, cc1Due: '2026-04-15', cc1Rewards: '185,420 pts',
  cc2Name: 'Meridian Cash Back Mastercard', cc2Limit: 30000, cc2Balance: 1780.00, cc2Due: '2026-04-28', cc2Rewards: '$892.30',
  transactions: [
    ...Array.from({ length: 24 }, (_, i) => ({ desc: 'Social Security Administration', amount: 3450, type: 'credit' as const, category: 'Income', acct: 'checking' as const, daysAgo: i * 30 + 2 })),
    ...Array.from({ length: 12 }, (_, i) => ({ desc: 'Pension — AZ State Retirement', amount: 2800, type: 'credit' as const, category: 'Income', acct: 'checking' as const, daysAgo: i * 30 + 1 })),
    ...recurring('HOA Dues — Scottsdale Estates', 450, 'Housing', 'checking', 30, 24),
    ...recurring('Arizona Electric', 185, 'Bills', 'checking', 30, 24),
    ...recurring('Cox Internet', 59.99, 'Bills', 'checking', 30, 24),
    ...recurring('AARP Membership', 16, 'Bills', 'cc2', 365, 2),
    ...recurring('Medicare Supplement', 245, 'Health', 'checking', 30, 24),
    ...recurring('Allstate Insurance', 198, 'Insurance', 'checking', 30, 24),
    ...interest(24, 118.50),
    ...randomSpend([...groceryStores, { desc: 'Fry\'s Food', min: 40, max: 130, category: 'Groceries' }], 'checking', 40, 700),
    ...randomSpend(dining, 'cc1', 30, 700),
    ...randomSpend(transport, 'checking', 15, 700),
    ...randomSpend(health, 'checking', 20, 700),
    { desc: 'Scottsdale Golf Club', amount: -275, type: 'debit', category: 'Entertainment', acct: 'cc1', daysAgo: 7 },
    { desc: 'American Airlines', amount: -1842, type: 'debit', category: 'Travel', acct: 'cc1', daysAgo: 40 },
    { desc: 'Hilton Hotels — Maui', amount: -2450, type: 'debit', category: 'Travel', acct: 'cc1', daysAgo: 38 },
    { desc: 'Charles Schwab — RMD Distribution', amount: 8500, type: 'credit', category: 'Income', acct: 'checking', daysAgo: 95 },
    { desc: 'Dividend Payment — Vanguard', amount: 1240, type: 'credit', category: 'Income', acct: 'savings', daysAgo: 45 },
    { desc: 'Property Tax — Maricopa County', amount: -3280, type: 'debit', category: 'Housing', acct: 'checking', daysAgo: 75 },
  ],
  payees: [
    { name: 'Arizona Public Service', category: 'Utilities', amount: 187.40, daysAgo: 8 },
    { name: 'Cox Communications', category: 'Utilities', amount: 59.99, daysAgo: 12 },
    { name: 'Scottsdale HOA', category: 'Housing', amount: 450.00, daysAgo: 1 },
    { name: 'Allstate Insurance', category: 'Insurance', amount: 198.00, daysAgo: 15 },
    { name: 'Maricopa Water District', category: 'Utilities', amount: 68.20, daysAgo: 20 },
  ],
};

// ============================================
// USER 4: Emily Davis — Small Business Owner
// ============================================
const emily: UserSeed = {
  email: 'emily.davis@meridianbank.demo', password: 'Meridian2026!',
  first_name: 'Emily', last_name: 'Davis', phone: '(512) 555-4392',
  checking: 77346.44, savings: 135000.00, emergency: 30000, cd: 50000,
  cdApy: '4.60%', cdMaturity: '2027-01-15',
  cc1Name: 'Meridian Rewards Visa', cc1Limit: 24000, cc1Balance: 11780.80, cc1Due: '2026-04-19', cc1Rewards: '31,250 pts',
  cc2Name: 'Meridian Cash Back Mastercard', cc2Limit: 12000, cc2Balance: 6400.00, cc2Due: '2026-04-24', cc2Rewards: '$94.60',
  transactions: [
    ...Array.from({ length: 36 }, (_, i) => ({ desc: ['Etsy Seller Deposit', 'Shopify Payout', 'Square Deposit', 'PayPal Transfer'][Math.floor(Math.random() * 4)], amount: 1200 + Math.random() * 4800, type: 'credit' as const, category: 'Income', acct: 'checking' as const, daysAgo: i * 20 + Math.floor(Math.random() * 10) })),
    ...recurring('Austin Energy', 118, 'Bills', 'checking', 30, 24),
    ...recurring('Spectrum Internet', 69.99, 'Bills', 'checking', 30, 24),
    ...recurring('Mailchimp', 29.99, 'Bills', 'cc1', 30, 18),
    ...recurring('Canva Pro', 12.99, 'Bills', 'cc1', 30, 18),
    ...recurring('Shopify Subscription', 39, 'Bills', 'cc1', 30, 24),
    ...recurring('Self Storage Unit', 165, 'Bills', 'checking', 30, 18),
    ...recurring('USAA Auto Insurance', 134, 'Insurance', 'checking', 30, 24),
    ...interest(24, 22.80),
    ...randomSpend(groceryStores, 'checking', 35, 700),
    ...randomSpend(dining, 'cc2', 45, 700),
    ...randomSpend(transport, 'checking', 25, 700),
    ...randomSpend(shopping, 'cc1', 30, 700),
    ...randomSpend([
      { desc: 'USPS Shipping', min: 8, max: 45, category: 'Business' },
      { desc: 'Michaels Arts & Crafts', min: 20, max: 150, category: 'Business' },
      { desc: 'UPS Store', min: 12, max: 65, category: 'Business' },
      { desc: 'Office Depot', min: 15, max: 90, category: 'Business' },
    ], 'cc1', 40, 700),
    { desc: 'Wholesale Supplier — Materials', amount: -2340, type: 'debit', category: 'Business', acct: 'checking', daysAgo: 22 },
    { desc: 'Craft Fair Booth Fee', amount: -350, type: 'debit', category: 'Business', acct: 'checking', daysAgo: 48 },
    { desc: 'TX Franchise Tax Payment', amount: -890, type: 'debit', category: 'Business', acct: 'checking', daysAgo: 100 },
    { desc: 'IRS Quarterly Estimated Tax', amount: -2200, type: 'debit', category: 'Business', acct: 'checking', daysAgo: 85 },
    { desc: 'Craft fair supplies', amount: -186.50, type: 'debit', category: 'Business', acct: 'cc2', daysAgo: 1, status: 'pending' },
  ],
  payees: [
    { name: 'Austin Energy', category: 'Utilities', amount: 121.30, daysAgo: 7 },
    { name: 'Spectrum', category: 'Utilities', amount: 69.99, daysAgo: 10 },
    { name: 'USAA Insurance', category: 'Insurance', amount: 134.00, daysAgo: 4 },
    { name: 'Extra Space Storage', category: 'Storage', amount: 165.00, daysAgo: 14 },
    { name: 'Austin Water Utility', category: 'Utilities', amount: 42.80, daysAgo: 22 },
  ],
};

// ============================================
// USER 5: Demo User — Everyday Banker
// ============================================
const demo: UserSeed = {
  email: 'demo@meridianbank.com', password: 'Demo1234!',
  first_name: 'Alex', last_name: 'Morgan', phone: '(555) 555-0100',
  checking: 170000.00, savings: 500000.00, emergency: 80000, cd: 200000,
  cdApy: '4.75%', cdMaturity: '2027-04-01',
  cc1Name: 'Meridian Rewards Visa Signature', cc1Limit: 50000, cc1Balance: 4200.00, cc1Due: '2026-04-22', cc1Rewards: '72,800 pts',
  cc2Name: 'Meridian Cash Back Mastercard', cc2Limit: 24000, cc2Balance: 1500.00, cc2Due: '2026-04-18', cc2Rewards: '$245.90',
  transactions: [
    ...paycheck(5200, 48),
    ...recurring('Meridian Mortgage Payment', 2450, 'Housing', 'checking', 30, 24),
    ...recurring('Verizon Wireless', 95, 'Bills', 'checking', 30, 24),
    ...recurring('Netflix', 15.99, 'Entertainment', 'cc1', 30, 24),
    ...recurring('Apple iCloud+', 9.99, 'Entertainment', 'cc1', 30, 24),
    ...recurring('YouTube Premium', 13.99, 'Entertainment', 'cc1', 30, 18),
    ...recurring('Xfinity Internet', 85, 'Bills', 'checking', 30, 24),
    ...recurring('Geico Auto Insurance', 168, 'Insurance', 'checking', 30, 24),
    ...recurring('Planet Fitness', 24.99, 'Health', 'cc2', 30, 24),
    ...interest(24, 85.40),
    ...randomSpend(groceryStores, 'checking', 50, 700),
    ...randomSpend(dining, 'cc1', 55, 700),
    ...randomSpend(transport, 'checking', 30, 700),
    ...randomSpend(shopping, 'cc1', 35, 700),
    ...randomSpend(health, 'checking', 15, 700),
    { desc: 'Transfer to Savings', amount: -3000, type: 'debit', category: 'Transfer', acct: 'checking', daysAgo: 3 },
    { desc: 'Transfer from Checking', amount: 3000, type: 'credit', category: 'Transfer', acct: 'savings', daysAgo: 3 },
    { desc: 'Zelle — Sarah M.', amount: -250, type: 'debit', category: 'Transfer', acct: 'checking', daysAgo: 6 },
    { desc: 'Zelle — Tom B.', amount: 180, type: 'credit', category: 'Transfer', acct: 'checking', daysAgo: 12 },
    { desc: 'Annual Bonus', amount: 15000, type: 'credit', category: 'Income', acct: 'checking', daysAgo: 150 },
    { desc: 'IRS Tax Refund', amount: 3820, type: 'credit', category: 'Income', acct: 'checking', daysAgo: 85 },
    { desc: 'United Airlines', amount: -542, type: 'debit', category: 'Travel', acct: 'cc1', daysAgo: 35 },
    { desc: 'Hyatt Hotels', amount: -1180, type: 'debit', category: 'Travel', acct: 'cc1', daysAgo: 33 },
    { desc: 'REI Co-op', amount: -287.50, type: 'debit', category: 'Shopping', acct: 'cc1', daysAgo: 20 },
    { desc: 'Costco Wholesale', amount: -234.18, type: 'debit', category: 'Groceries', acct: 'checking', daysAgo: 0, status: 'pending' },
    { desc: 'DoorDash', amount: -42.30, type: 'debit', category: 'Dining', acct: 'cc1', daysAgo: 0, status: 'pending' },
  ],
  payees: [
    { name: 'Xfinity', category: 'Utilities', amount: 85.00, daysAgo: 6 },
    { name: 'Verizon Wireless', category: 'Utilities', amount: 95.00, daysAgo: 9 },
    { name: 'Geico Insurance', category: 'Insurance', amount: 168.00, daysAgo: 3 },
    { name: 'City Water Department', category: 'Utilities', amount: 58.40, daysAgo: 15 },
    { name: 'HOA — Lakewood Estates', category: 'Housing', amount: 325.00, daysAgo: 1 },
  ],
};

export const TEST_USERS: UserSeed[] = [michael, sarah, james, emily, demo];
