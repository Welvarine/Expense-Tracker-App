export const isRequired  = v => !!String(v ?? '').trim() || 'This field is required'
export const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address'
export const isStrongPassword = v =>
  v.length >= 8 || 'Password must be at least 8 characters'
export const isPositiveAmount = v =>
  (parseFloat(v) > 0) || 'Amount must be greater than 0'
