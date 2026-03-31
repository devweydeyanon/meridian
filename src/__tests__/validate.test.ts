import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, sanitize, validateRequired, validateLength } from '@/lib/validate';

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user@bank.co.uk')).toBe(true);
  });
  it('rejects invalid emails', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('@nodomain')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('accepts strong passwords', () => {
    expect(validatePassword('Meridian2026!')).toBe(null);
  });
  it('rejects short passwords', () => {
    expect(validatePassword('Ab1')).not.toBe(null);
  });
  it('rejects passwords without uppercase', () => {
    expect(validatePassword('meridian2026')).not.toBe(null);
  });
  it('rejects passwords without numbers', () => {
    expect(validatePassword('MeridianBank')).not.toBe(null);
  });
});

describe('sanitize', () => {
  it('escapes HTML characters', () => {
    expect(sanitize('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });
  it('trims whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello');
  });
  it('truncates long strings', () => {
    const long = 'a'.repeat(6000);
    expect(sanitize(long).length).toBe(5000);
  });
});

describe('validateRequired', () => {
  it('passes when all fields present', () => {
    expect(validateRequired({ name: 'John', email: 'a@b.com' }, ['name', 'email'])).toBe(null);
  });
  it('fails when field missing', () => {
    expect(validateRequired({ name: 'John' }, ['name', 'email'])).not.toBe(null);
  });
});

describe('validateLength', () => {
  it('passes valid length', () => {
    expect(validateLength('hello', 1, 100, 'Name')).toBe(null);
  });
  it('fails too short', () => {
    expect(validateLength('', 1, 100, 'Name')).not.toBe(null);
  });
  it('fails too long', () => {
    expect(validateLength('a'.repeat(101), 1, 100, 'Name')).not.toBe(null);
  });
});
