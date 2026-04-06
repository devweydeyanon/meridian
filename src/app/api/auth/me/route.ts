import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDB } from '@/lib/db';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sql = getDB();

    const userResult = await sql`
      SELECT id, email, first_name, last_name, phone, member_id, 
             dob, ssn_last4, address, city, state, zip,
             created_at, last_login
      FROM users WHERE id = ${authUser.id}
    `;

    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult[0];

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        member_id: user.member_id,
        dob: user.dob,
        ssn_last4: user.ssn_last4,
        address: user.address,
        city: user.city,
        state: user.state,
        zip: user.zip,
        member_since: user.created_at,
        last_login: user.last_login,
      },
    });
  } catch (error: any) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
