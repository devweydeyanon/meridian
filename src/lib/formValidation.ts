// ============================================
// Client-side form validation + formatting
// ============================================

export const validators = {
  email: (val: string): string | null => {
    if (!val.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Please enter a valid email address.';
    return null;
  },

  password: (val: string): string | null => {
    if (!val) return 'Password is required.';
    if (val.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(val)) return 'Password must include an uppercase letter.';
    if (!/[0-9]/.test(val)) return 'Password must include a number.';
    return null;
  },

  passwordMatch: (password: string, confirm: string): string | null => {
    if (!confirm) return 'Please confirm your password.';
    if (password !== confirm) return 'Passwords do not match.';
    return null;
  },

  phone: (val: string): string | null => {
    if (!val.trim()) return null; // optional by default
    const digits = val.replace(/\D/g, '');
    if (digits.length !== 10) return 'Phone number must be 10 digits.';
    return null;
  },

  phoneRequired: (val: string): string | null => {
    if (!val.trim()) return 'Phone number is required.';
    const digits = val.replace(/\D/g, '');
    if (digits.length !== 10) return 'Phone number must be 10 digits.';
    return null;
  },

  ssn: (val: string): string | null => {
    if (!val.trim()) return 'Social Security Number is required.';
    const digits = val.replace(/\D/g, '');
    if (digits.length !== 9) return 'SSN must be 9 digits.';
    if (/^0{3}/.test(digits) || /^9/.test(digits)) return 'Please enter a valid SSN.';
    return null;
  },

  ssnLast4: (val: string): string | null => {
    if (!val.trim()) return 'Last 4 of SSN is required.';
    const digits = val.replace(/\D/g, '');
    if (digits.length !== 4) return 'Must be exactly 4 digits.';
    return null;
  },

  zip: (val: string): string | null => {
    if (!val.trim()) return 'ZIP code is required.';
    if (!/^\d{5}$/.test(val.trim())) return 'ZIP code must be 5 digits.';
    return null;
  },

  required: (val: string, label = 'This field'): string | null => {
    if (!val.trim()) return `${label} is required.`;
    return null;
  },

  dob: (val: string): string | null => {
    if (!val) return 'Date of birth is required.';
    const date = new Date(val);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate()) ? age - 1 : age;
    if (actualAge < 18) return 'You must be at least 18 years old.';
    if (actualAge > 120) return 'Please enter a valid date of birth.';
    return null;
  },

  routing: (val: string): string | null => {
    if (!val.trim()) return null; // optional
    const digits = val.replace(/\D/g, '');
    if (digits.length !== 9) return 'Routing number must be 9 digits.';
    return null;
  },

  deposit: (val: string): string | null => {
    if (!val.trim()) return null; // optional
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num < 0) return 'Please enter a valid amount.';
    if (num > 0 && num < 25) return 'Minimum deposit is $25.';
    return null;
  },

  income: (val: string): string | null => {
    if (!val.trim()) return null; // optional
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num < 0) return 'Please enter a valid amount.';
    return null;
  },
};

// ============================================
// Formatting helpers (live input masking)
// ============================================

export const formatters = {
  phone: (val: string): string => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  },

  ssn: (val: string): string => {
    const digits = val.replace(/\D/g, '').slice(0, 9);
    if (digits.length === 0) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  },

  zip: (val: string): string => {
    return val.replace(/\D/g, '').slice(0, 5);
  },

  ssnLast4: (val: string): string => {
    return val.replace(/\D/g, '').slice(0, 4);
  },

  routing: (val: string): string => {
    return val.replace(/\D/g, '').slice(0, 9);
  },

  currency: (val: string): string => {
    const clean = val.replace(/[^0-9.]/g, '');
    if (!clean) return '';
    return clean;
  },

  accountNumber: (val: string): string => {
    return val.replace(/\D/g, '').slice(0, 17);
  },
};
