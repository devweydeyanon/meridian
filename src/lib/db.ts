import { neon } from '@neondatabase/serverless';

export function getDB() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function initializeDatabase() {
  const sql = getDB();

  // Users table (simplified — balances live in accounts now)
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      member_id VARCHAR(20),
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      last_login TIMESTAMP
    )
  `;

  // Accounts — checking, savings, CD per user
  await sql`
    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      type VARCHAR(20) NOT NULL,
      name VARCHAR(100) NOT NULL,
      account_number VARCHAR(20) NOT NULL,
      balance DECIMAL(12,2) DEFAULT 0,
      available DECIMAL(12,2) DEFAULT 0,
      pending DECIMAL(12,2) DEFAULT 0,
      apy VARCHAR(10),
      maturity_date DATE,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Cards — credit and debit per user
  await sql`
    CREATE TABLE IF NOT EXISTS cards (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      linked_account_id INTEGER REFERENCES accounts(id),
      type VARCHAR(20) NOT NULL,
      name VARCHAR(100) NOT NULL,
      card_number VARCHAR(20) NOT NULL,
      credit_limit DECIMAL(12,2) DEFAULT 0,
      balance DECIMAL(12,2) DEFAULT 0,
      available DECIMAL(12,2) DEFAULT 0,
      min_payment DECIMAL(12,2) DEFAULT 0,
      due_date DATE,
      daily_limit DECIMAL(12,2) DEFAULT 5000,
      rewards VARCHAR(50),
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Transactions — linked to account
  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      account_id INTEGER,
      card_id INTEGER,
      description VARCHAR(255) NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      type VARCHAR(20) NOT NULL,
      category VARCHAR(50),
      status VARCHAR(20) DEFAULT 'posted',
      date TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Payees — saved bill pay recipients
  await sql`
    CREATE TABLE IF NOT EXISTS payees (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      name VARCHAR(100) NOT NULL,
      category VARCHAR(50),
      account_number VARCHAR(50),
      routing_number VARCHAR(20),
      last_paid TIMESTAMP,
      last_amount DECIMAL(12,2),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Keep existing tables
  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      topic VARCHAR(100),
      account_number VARCHAR(20),
      message TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(100),
      role VARCHAR(20) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      email VARCHAR(255) NOT NULL,
      code VARCHAR(6) NOT NULL,
      type VARCHAR(30) DEFAULT 'login',
      used BOOLEAN DEFAULT FALSE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_cards_user ON cards(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_payees_user ON payees(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_verification_email ON verification_codes(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_verification_code ON verification_codes(code, email)`;

  return { success: true };
}

// ============================================
// SEED DATA
// ============================================

interface UserSeed {
  email: string; password: string; first_name: string; last_name: string; phone: string;
  checking: number; savings: number; emergency: number; cd: number;
  creditCard1Balance: number; creditCard1Limit: number;
  creditCard2Balance: number; creditCard2Limit: number;
}

const TEST_USERS: UserSeed[] = [
  { email: 'michael.chen@meridianbank.demo', password: 'Meridian2026!', first_name: 'Michael', last_name: 'Chen', phone: '(555) 234-5678', checking: 12847.53, savings: 45230.18, emergency: 8500, cd: 25000, creditCard1Balance: 2341.67, creditCard1Limit: 15000, creditCard2Balance: 567.23, creditCard2Limit: 8000 },
  { email: 'sarah.johnson@meridianbank.demo', password: 'Meridian2026!', first_name: 'Sarah', last_name: 'Johnson', phone: '(555) 345-6789', checking: 8432.10, savings: 22100, emergency: 5000, cd: 10000, creditCard1Balance: 1200.50, creditCard1Limit: 12000, creditCard2Balance: 340.00, creditCard2Limit: 5000 },
  { email: 'james.williams@meridianbank.demo', password: 'Meridian2026!', first_name: 'James', last_name: 'Williams', phone: '(555) 456-7890', checking: 34291.87, savings: 78500, emergency: 15000, cd: 50000, creditCard1Balance: 4120.55, creditCard1Limit: 25000, creditCard2Balance: 890.00, creditCard2Limit: 10000 },
  { email: 'emily.davis@meridianbank.demo', password: 'Meridian2026!', first_name: 'Emily', last_name: 'Davis', phone: '(555) 567-8901', checking: 5673.22, savings: 15800, emergency: 3200, cd: 0, creditCard1Balance: 890.40, creditCard1Limit: 8000, creditCard2Balance: 0, creditCard2Limit: 3000 },
  { email: 'demo@meridianbank.com', password: 'Demo1234!', first_name: 'Demo', last_name: 'User', phone: '(555) 000-0000', checking: 25000, savings: 50000, emergency: 10000, cd: 25000, creditCard1Balance: 1500, creditCard1Limit: 15000, creditCard2Balance: 450, creditCard2Limit: 8000 },
];

const DEMO_TRANSACTIONS = [
  { desc: 'Direct Deposit — Employer', amount: 3250.00, type: 'credit', category: 'Income', acctType: 'checking' },
  { desc: 'Whole Foods Market', amount: -87.43, type: 'debit', category: 'Groceries', acctType: 'checking', status: 'pending' },
  { desc: 'Netflix Subscription', amount: -15.99, type: 'debit', category: 'Entertainment', acctType: 'credit' },
  { desc: 'Transfer to Savings', amount: -500.00, type: 'debit', category: 'Transfer', acctType: 'checking' },
  { desc: 'Transfer from Checking', amount: 500.00, type: 'credit', category: 'Transfer', acctType: 'savings' },
  { desc: 'Shell Gas Station', amount: -52.18, type: 'debit', category: 'Auto', acctType: 'checking' },
  { desc: 'Amazon.com', amount: -124.99, type: 'debit', category: 'Shopping', acctType: 'credit' },
  { desc: 'Starbucks', amount: -6.45, type: 'debit', category: 'Dining', acctType: 'checking' },
  { desc: 'Meridian Mortgage Payment', amount: -1842.00, type: 'debit', category: 'Housing', acctType: 'checking' },
  { desc: 'Uber', amount: -23.50, type: 'debit', category: 'Transport', acctType: 'credit2' },
  { desc: 'CVS Pharmacy', amount: -18.75, type: 'debit', category: 'Health', acctType: 'checking' },
  { desc: 'Interest Payment', amount: 15.82, type: 'credit', category: 'Interest', acctType: 'savings' },
  { desc: 'Chipotle Mexican Grill', amount: -12.95, type: 'debit', category: 'Dining', acctType: 'checking' },
  { desc: 'AT&T Wireless', amount: -89.00, type: 'debit', category: 'Bills', acctType: 'checking' },
  { desc: 'Zelle — Sarah M.', amount: -150.00, type: 'debit', category: 'Transfer', acctType: 'checking' },
];

const DEMO_PAYEES = [
  { name: 'Electric Company', category: 'Utilities', amount: 142.50 },
  { name: 'Water & Sewer', category: 'Utilities', amount: 67.80 },
  { name: 'Internet Provider', category: 'Utilities', amount: 79.99 },
  { name: 'Auto Insurance', category: 'Insurance', amount: 156.00 },
  { name: 'Credit Card Payment', category: 'Finance', amount: 500.00 },
];

export async function seedTestUsers() {
  const sql = getDB();
  const bcrypt = await import('bcryptjs');
  const results = [];

  for (const u of TEST_USERS) {
    const existing = await sql`SELECT id FROM users WHERE email = ${u.email}`;
    if (existing.length > 0) {
      results.push({ email: u.email, status: 'exists', id: existing[0].id });
      continue;
    }

    const hash = await bcrypt.hash(u.password, 10);
    const memberId = 'MRB-' + Math.random().toString().slice(2, 9);

    const inserted = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, member_id)
      VALUES (${u.email}, ${hash}, ${u.first_name}, ${u.last_name}, ${u.phone}, ${memberId})
      RETURNING id
    `;
    const userId = inserted[0].id;

    // Create accounts
    const chkNum = '****' + Math.random().toString().slice(2, 6);
    const savNum = '****' + Math.random().toString().slice(2, 6);
    const emgNum = '****' + Math.random().toString().slice(2, 6);

    const chkResult = await sql`
      INSERT INTO accounts (user_id, type, name, account_number, balance, available, pending, status)
      VALUES (${userId}, 'checking', 'Meridian Total Checking', ${chkNum}, ${u.checking}, ${u.checking - 200}, 200, 'active')
      RETURNING id
    `;
    const chkId = chkResult[0].id;

    const savResult = await sql`
      INSERT INTO accounts (user_id, type, name, account_number, balance, available, apy, status)
      VALUES (${userId}, 'savings', 'Meridian Premier Savings', ${savNum}, ${u.savings}, ${u.savings}, '4.25%', 'active')
      RETURNING id
    `;
    const savId = savResult[0].id;

    const emgResult = await sql`
      INSERT INTO accounts (user_id, type, name, account_number, balance, available, apy, status)
      VALUES (${userId}, 'savings', 'Emergency Fund', ${emgNum}, ${u.emergency}, ${u.emergency}, '4.25%', 'active')
      RETURNING id
    `;

    let cdId = null;
    if (u.cd > 0) {
      const cdNum = '****' + Math.random().toString().slice(2, 6);
      const cdResult = await sql`
        INSERT INTO accounts (user_id, type, name, account_number, balance, available, apy, maturity_date, status)
        VALUES (${userId}, 'cd', '12-Month CD', ${cdNum}, ${u.cd}, 0, '4.75%', '2027-03-15', 'active')
        RETURNING id
      `;
      cdId = cdResult[0].id;
    }

    // Create cards
    const cc1Num = '****' + Math.random().toString().slice(2, 6);
    const cc2Num = '****' + Math.random().toString().slice(2, 6);
    const dcNum = chkNum; // debit linked to checking

    const cc1Result = await sql`
      INSERT INTO cards (user_id, linked_account_id, type, name, card_number, credit_limit, balance, available, min_payment, due_date, rewards, status)
      VALUES (${userId}, ${chkId}, 'credit', 'Meridian Rewards Visa', ${cc1Num}, ${u.creditCard1Limit}, ${u.creditCard1Balance}, ${u.creditCard1Limit - u.creditCard1Balance}, ${Math.max(25, u.creditCard1Balance * 0.02)}, '2026-04-22', '24,580 pts', 'active')
      RETURNING id
    `;
    const cc1Id = cc1Result[0].id;

    const cc2Result = await sql`
      INSERT INTO cards (user_id, linked_account_id, type, name, card_number, credit_limit, balance, available, min_payment, due_date, rewards, status)
      VALUES (${userId}, ${chkId}, 'credit', 'Meridian Cash Back Mastercard', ${cc2Num}, ${u.creditCard2Limit}, ${u.creditCard2Balance}, ${u.creditCard2Limit - u.creditCard2Balance}, ${Math.max(25, u.creditCard2Balance * 0.02)}, '2026-04-18', '$42.15', 'active')
      RETURNING id
    `;
    const cc2Id = cc2Result[0].id;

    await sql`
      INSERT INTO cards (user_id, linked_account_id, type, name, card_number, daily_limit, status)
      VALUES (${userId}, ${chkId}, 'debit', 'Meridian Debit Card', ${dcNum}, 5000, 'active')
    `;

    // Create transactions
    const acctMap: Record<string, { id: number; cardId?: number }> = {
      checking: { id: chkId },
      savings: { id: savId },
      credit: { id: chkId, cardId: cc1Id },
      credit2: { id: chkId, cardId: cc2Id },
    };

    for (let i = 0; i < DEMO_TRANSACTIONS.length; i++) {
      const t = DEMO_TRANSACTIONS[i];
      const daysAgo = Math.floor(i * 0.5) + 1;
      const txDate = new Date();
      txDate.setDate(txDate.getDate() - daysAgo);

      const target = acctMap[t.acctType] || acctMap.checking;
      await sql`
        INSERT INTO transactions (user_id, account_id, card_id, description, amount, type, category, status, date)
        VALUES (${userId}, ${target.id}, ${target.cardId || null}, ${t.desc}, ${t.amount}, ${t.type}, ${t.category}, ${t.status || 'posted'}, ${txDate.toISOString()})
      `;
    }

    // Create payees
    for (const p of DEMO_PAYEES) {
      const paidDate = new Date();
      paidDate.setDate(paidDate.getDate() - Math.floor(Math.random() * 20));
      await sql`
        INSERT INTO payees (user_id, name, category, last_paid, last_amount)
        VALUES (${userId}, ${p.name}, ${p.category}, ${paidDate.toISOString()}, ${p.amount})
      `;
    }

    results.push({ email: u.email, status: 'created', id: userId });
  }

  return results;
}
