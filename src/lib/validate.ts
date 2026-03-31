export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): string | null {
  if (!password || password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain a number';
  return null;
}

export function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, 5000); // max length
}

export function validateRequired(fields: Record<string, any>, required: string[]): string | null {
  for (const field of required) {
    if (!fields[field] || (typeof fields[field] === 'string' && fields[field].trim() === '')) {
      return `${field.replace('_', ' ')} is required`;
    }
  }
  return null;
}

export function validateLength(value: string, min: number, max: number, fieldName: string): string | null {
  if (value.length < min) return `${fieldName} must be at least ${min} characters`;
  if (value.length > max) return `${fieldName} must be less than ${max} characters`;
  return null;
}
