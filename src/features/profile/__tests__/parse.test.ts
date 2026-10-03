import { parseUserProfile, toMillis } from '../parse';

describe('parseUserProfile', () => {
  it('fills defaults for missing or invalid fields', () => {
    expect(parseUserProfile({ units: 'stone', defaultRestSeconds: 5 })).toEqual({
      name: '',
      units: 'kg',
      themePreference: 'system',
      defaultRestSeconds: 90,
      onboardedAt: null,
      createdAt: null,
    });
  });

  it('reads valid fields and timestamps', () => {
    const ts = { toMillis: () => 1700000000000 };
    const p = parseUserProfile({
      name: 'Agni',
      units: 'lb',
      themePreference: 'dark',
      defaultRestSeconds: 120,
      onboardedAt: ts,
      createdAt: 5,
    });
    expect(p).toMatchObject({
      name: 'Agni',
      units: 'lb',
      themePreference: 'dark',
      defaultRestSeconds: 120,
      onboardedAt: 1700000000000,
      createdAt: 5,
    });
  });

  it('toMillis handles junk', () => {
    expect(toMillis(undefined)).toBeNull();
    expect(toMillis('2024')).toBeNull();
  });
});
