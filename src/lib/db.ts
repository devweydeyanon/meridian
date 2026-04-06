import { neon } from '@neondatabase/serverless';

export function getDB() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function initializeDatabase() {
  const sql = getDB();

  // Users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      dob DATE,
      ssn_last4 VARCHAR(4),
      address VARCHAR(255),
      city VARCHAR(100),
      state VARCHAR(2),
      zip VARCHAR(10),
      employment VARCHAR(50),
      employer VARCHAR(100),
      income VARCHAR(50),
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
// SEED DATA — imported from seedData.ts
// ============================================

import { TEST_USERS } from './seedData';
import type { UserSeed } from './seedData';

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

    await sql`
      INSERT INTO accounts (user_id, type, name, account_number, balance, available, apy, status)
      VALUES (${userId}, 'savings', 'Emergency Fund', ${emgNum}, ${u.emergency}, ${u.emergency}, '4.25%', 'active')
    `;

    let cdId = null;
    if (u.cd > 0) {
      const cdNum = '****' + Math.random().toString().slice(2, 6);
      const cdResult = await sql`
        INSERT INTO accounts (user_id, type, name, account_number, balance, available, apy, maturity_date, status)
        VALUES (${userId}, 'cd', '12-Month CD', ${cdNum}, ${u.cd}, 0, ${u.cdApy}, ${u.cdMaturity}, 'active')
        RETURNING id
      `;
      cdId = cdResult[0].id;
    }

    // Create cards
    const cc1Num = '****' + Math.random().toString().slice(2, 6);
    const cc2Num = '****' + Math.random().toString().slice(2, 6);

    const cc1Result = await sql`
      INSERT INTO cards (user_id, linked_account_id, type, name, card_number, credit_limit, balance, available, min_payment, due_date, rewards, status)
      VALUES (${userId}, ${chkId}, 'credit', ${u.cc1Name}, ${cc1Num}, ${u.cc1Limit}, ${u.cc1Balance}, ${u.cc1Limit - u.cc1Balance}, ${Math.max(25, Math.round(u.cc1Balance * 0.02 * 100) / 100)}, ${u.cc1Due}, ${u.cc1Rewards}, 'active')
      RETURNING id
    `;
    const cc1Id = cc1Result[0].id;

    const cc2Result = await sql`
      INSERT INTO cards (user_id, linked_account_id, type, name, card_number, credit_limit, balance, available, min_payment, due_date, rewards, status)
      VALUES (${userId}, ${chkId}, 'credit', ${u.cc2Name}, ${cc2Num}, ${u.cc2Limit}, ${u.cc2Balance}, ${u.cc2Limit - u.cc2Balance}, ${Math.max(25, Math.round(u.cc2Balance * 0.02 * 100) / 100)}, ${u.cc2Due}, ${u.cc2Rewards}, 'active')
      RETURNING id
    `;
    const cc2Id = cc2Result[0].id;

    await sql`
      INSERT INTO cards (user_id, linked_account_id, type, name, card_number, daily_limit, status)
      VALUES (${userId}, ${chkId}, 'debit', 'Meridian Debit Card', ${chkNum}, 5000, 'active')
    `;

    // Create transactions — map acct types to real IDs
    const acctMap: Record<string, { accountId: number; cardId?: number }> = {
      checking: { accountId: chkId },
      savings: { accountId: savId },
      cc1: { accountId: chkId, cardId: cc1Id },
      cc2: { accountId: chkId, cardId: cc2Id },
    };

    for (const t of u.transactions) {
      const txDate = new Date();
      txDate.setDate(txDate.getDate() - t.daysAgo);
      const target = acctMap[t.acct] || acctMap.checking;
      await sql`
        INSERT INTO transactions (user_id, account_id, card_id, description, amount, type, category, status, date)
        VALUES (${userId}, ${target.accountId}, ${target.cardId || null}, ${t.desc}, ${t.amount}, ${t.type}, ${t.category}, ${t.status || 'posted'}, ${txDate.toISOString()})
      `;
    }

    // Create payees
    for (const p of u.payees) {
      const paidDate = new Date();
      paidDate.setDate(paidDate.getDate() - p.daysAgo);
      await sql`
        INSERT INTO payees (user_id, name, category, last_paid, last_amount)
        VALUES (${userId}, ${p.name}, ${p.category}, ${paidDate.toISOString()}, ${p.amount})
      `;
    }

    results.push({ email: u.email, status: 'created', id: userId, transactions: u.transactions.length });
  }

  return results;
}
