export function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}. Check your .env.local file.`);
  }
  
  if (process.env.JWT_SECRET === 'meridian-bank-jwt-secret-change-this-in-production') {
    console.warn('[WARN] Using default JWT_SECRET — change this in production');
  }
}
