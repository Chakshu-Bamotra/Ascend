const messages: Record<string, string> = {
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
  'auth/weak-password': 'That password is too weak. Use at least 8 characters.',
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
  'auth/network-request-failed': 'No internet connection. Check your network and try again.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/requires-recent-login': 'Please sign in again to continue.',
};

export const GENERIC_AUTH_ERROR = 'Something went wrong. Please try again.';

export function getErrorCode(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: unknown }).code;
    return typeof code === 'string' ? code : null;
  }
  return null;
}

export function mapAuthError(error: unknown): string {
  const code = getErrorCode(error);
  if (code && messages[code]) return messages[code];
  if (__DEV__) console.warn('Unmapped auth error', error);
  return GENERIC_AUTH_ERROR;
}
