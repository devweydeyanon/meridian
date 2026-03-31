import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
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
        role VARCHAR(20) DEFAULT 'user',
        balance DECIMAL(12,2) DEFAULT 5247.83,
        savings_balance DECIMAL(12,2) DEFAULT 12450.00,
        card_balance DECIMAL(12,2) DEFAULT 1832.47,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
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
        date TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
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
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
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

    // Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages(session_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token)`;

    logger.info('Database initialized successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database tables and indexes created successfully',
      tables: ['users', 'transactions', 'contact_submissions', 'chat_messages', 'password_resets'],
      indexes: ['idx_users_email', 'idx_transactions_user_id', 'idx_transactions_date', 'idx_contact_created', 'idx_chat_session', 'idx_password_resets_token'],
    });
  } catch (error: any) {
    logger.error('DB setup error', { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
