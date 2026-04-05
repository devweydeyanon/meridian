import { neon } from '@neondatabase/serverless';

export function getDB() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function initializeDatabase() {
  const sql = getDB();
  
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      account_number VARCHAR(20),
      account_type VARCHAR(50) DEFAULT 'Total Checking',
      balance DECIMAL(12,2) DEFAULT 5247.83,
      savings_balance DECIMAL(12,2) DEFAULT 12450.00,
      card_balance DECIMAL(12,2) DEFAULT 1832.47,
      created_at TIMESTAMP DEFAULT NOW(),
      last_login TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      description VARCHAR(255) NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      type VARCHAR(20) NOT NULL,
      category VARCHAR(50),
      date TIMESTAMP DEFAULT NOW()
    )
  `;

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

  await sql`CREATE INDEX IF NOT EXISTS idx_verification_email ON verification_codes(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_verification_code ON verification_codes(code, email)`;

  return { success: true };
}

export async function seedDemoData(userId: number) {
  const sql = getDB();
  
  const transactions = [
    { desc: 'Direct Deposit — Payroll', amount: 3245.00, type: 'credit', category: 'Income' },
    { desc: 'Whole Foods Market', amount: -127.43, type: 'debit', category: 'Groceries' },
    { desc: 'Netflix Subscription', amount: -15.99, type: 'debit', category: 'Entertainment' },
    { desc: 'Transfer to Savings', amount: -500.00, type: 'debit', category: 'Transfer' },
    { desc: 'Amazon.com', amount: -64.29, type: 'debit', category: 'Shopping' },
    { desc: 'Meridian Auto Pay — Mortgage', amount: -1850.00, type: 'debit', category: 'Housing' },
    { desc: 'Shell Gas Station', amount: -48.72, type: 'debit', category: 'Transport' },
    { desc: 'Venmo — Payment Received', amount: 75.00, type: 'credit', category: 'Transfer' },
    { desc: 'Starbucks', amount: -6.45, type: 'debit', category: 'Dining' },
    { desc: 'AT&T Mobile', amount: -89.00, type: 'debit', category: 'Utilities' },
    { desc: 'Target', amount: -43.87, type: 'debit', category: 'Shopping' },
    { desc: 'Interest Payment', amount: 4.12, type: 'credit', category: 'Interest' },
  ];

  for (const t of transactions) {
    const daysAgo = Math.floor(Math.random() * 30);
    await sql`
      INSERT INTO transactions (user_id, description, amount, type, category, date)
      VALUES (${userId}, ${t.desc}, ${t.amount}, ${t.type}, ${t.category}, NOW() - INTERVAL '${daysAgo} days')
    `;
  }
}

export async function seedTestUsers() {
  const sql = getDB();
  const bcrypt = await import('bcryptjs');
  
  const testUsers = [
    { email: 'michael.chen@meridianbank.demo', password: 'Meridian2026!', first_name: 'Michael', last_name: 'Chen', phone: '(555) 234-5678', balance: 12847.53, savings: 45230.18, card: 2341.67 },
    { email: 'sarah.johnson@meridianbank.demo', password: 'Meridian2026!', first_name: 'Sarah', last_name: 'Johnson', phone: '(555) 345-6789', balance: 8432.10, savings: 22100.00, card: 567.23 },
    { email: 'james.williams@meridianbank.demo', password: 'Meridian2026!', first_name: 'James', last_name: 'Williams', phone: '(555) 456-7890', balance: 34291.87, savings: 78500.00, card: 4120.55 },
    { email: 'emily.davis@meridianbank.demo', password: 'Meridian2026!', first_name: 'Emily', last_name: 'Davis', phone: '(555) 567-8901', balance: 5673.22, savings: 15800.00, card: 890.40 },
    { email: 'demo@meridianbank.com', password: 'Demo1234!', first_name: 'Demo', last_name: 'User', phone: '(555) 000-0000', balance: 25000.00, savings: 50000.00, card: 1500.00 },
  ];

  const results = [];

  for (const u of testUsers) {
    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${u.email}`;
    if (existing.length > 0) {
      results.push({ email: u.email, status: 'exists', id: existing[0].id });
      continue;
    }

    const hash = await bcrypt.hash(u.password, 10);
    const acctNum = 'MRB-' + Math.random().toString().slice(2, 9);

    const inserted = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, account_number, balance, savings_balance, card_balance)
      VALUES (${u.email}, ${hash}, ${u.first_name}, ${u.last_name}, ${u.phone}, ${acctNum}, ${u.balance}, ${u.savings}, ${u.card})
      RETURNING id
    `;

    // Seed transactions for this user
    await seedDemoData(inserted[0].id);
    results.push({ email: u.email, status: 'created', id: inserted[0].id });
  }

  return results;
}
