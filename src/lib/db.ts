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
