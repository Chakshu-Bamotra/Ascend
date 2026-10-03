export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MAX_LENGTH = 40;

// Pragmatic check; Firebase does the authoritative validation.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return 'Enter your email.';
  if (!EMAIL_RE.test(value)) return 'Enter a valid email address.';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Enter a password.';
  if (password.length < PASSWORD_MIN_LENGTH)
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  return null;
}

export function validatePasswordConfirm(password: string, confirm: string): string | null {
  if (!confirm) return 'Confirm your password.';
  if (password !== confirm) return "Passwords don't match.";
  return null;
}

export function validateName(name: string): string | null {
  const value = name.trim();
  if (!value) return 'Enter your name.';
  if (value.length > NAME_MAX_LENGTH) return `Keep it under ${NAME_MAX_LENGTH} characters.`;
  return null;
}
