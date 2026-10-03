import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '../validation';

describe('auth validation', () => {
  it('validates email', () => {
    expect(validateEmail('')).not.toBeNull();
    expect(validateEmail('agni')).not.toBeNull();
    expect(validateEmail('a@b')).not.toBeNull();
    expect(validateEmail(' agni@example.com ')).toBeNull();
  });

  it('validates password', () => {
    expect(validatePassword('')).not.toBeNull();
    expect(validatePassword('1234567')).not.toBeNull();
    expect(validatePassword('12345678')).toBeNull();
  });

  it('validates confirm', () => {
    expect(validatePasswordConfirm('abcdefgh', '')).not.toBeNull();
    expect(validatePasswordConfirm('abcdefgh', 'abcdefgx')).not.toBeNull();
    expect(validatePasswordConfirm('abcdefgh', 'abcdefgh')).toBeNull();
  });

  it('validates name', () => {
    expect(validateName('   ')).not.toBeNull();
    expect(validateName('x'.repeat(41))).not.toBeNull();
    expect(validateName(' Agni ')).toBeNull();
  });
});
