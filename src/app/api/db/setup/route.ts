import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    const result = await initializeDatabase();
    return NextResponse.json({ 
      success: true, 
      message: 'Database tables created successfully',
      ...result 
    });
  } catch (error: any) {
    console.error('DB setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
