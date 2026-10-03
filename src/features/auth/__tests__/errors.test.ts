import { GENERIC_AUTH_ERROR, mapAuthError } from '../errors';

describe('mapAuthError', () => {
  it('maps known codes', () => {
    expect(mapAuthError({ code: 'auth/invalid-credential' })).toBe('Incorrect email or password.');
    expect(mapAuthError({ code: 'auth/email-already-in-use' })).toMatch(/already exists/);
  });

  it('falls back for unknown errors', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(mapAuthError(new Error('boom'))).toBe(GENERIC_AUTH_ERROR);
    expect(mapAuthError({ code: 'auth/whatever' })).toBe(GENERIC_AUTH_ERROR);
    expect(mapAuthError(null)).toBe(GENERIC_AUTH_ERROR);
    warn.mockRestore();
  });
});
