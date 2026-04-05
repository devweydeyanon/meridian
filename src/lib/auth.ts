import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'meridian-bank-secret-key-change-in-production';

export interface UserPayload {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export function signToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('meridian_auth')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function createSession(userId: number, response: any) {
  // This is used by the verify route to set auth cookie after OTP verification
  // The actual token is set in the login route via Set-Cookie header
  // Here we just need to set the cookie on the response
  const token = signToken({ id: userId, email: '', first_name: '', last_name: '' });
  response.cookies.set('meridian_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

const ADMIN_EMAILS = ['admin@meridianbank.com'];

export async function getAdminUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('meridian_admin')?.value;
  if (!token) return null;
  const user = verifyToken(token);
  if (!user) return null;
  // Must be in admin list
  if (!ADMIN_EMAILS.includes(user.email)) return null;
  return user;
}
