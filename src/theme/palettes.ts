/**
 * Set-type colors borrow from calibrated competition plates:
 * blue (20 kg) = primary, green (10 kg) = warm-up, red (25 kg) = failure.
 */
export interface Palette {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryPressed: string;
  onPrimary: string;
  success: string;
  successSoft: string;
  warning: string;
  danger: string;
  onDanger: string;
  pr: string;
  warmup: string;
  drop: string;
  failure: string;
  overlay: string;
}

export const light: Palette = {
  background: '#F3F5F8',
  surface: '#FFFFFF',
  surfaceAlt: '#E8ECF1',
  border: '#D5DBE3',
  text: '#151A22',
  textMuted: '#5D6776',
  primary: '#1F4FD6',
  primaryPressed: '#1941B3',
  onPrimary: '#FFFFFF',
  success: '#17864A',
  successSoft: '#E1F3E8',
  warning: '#B7791F',
  danger: '#C8283B',
  onDanger: '#FFFFFF',
  pr: '#B8860B',
  warmup: '#17864A',
  drop: '#D2691E',
  failure: '#C8283B',
  overlay: 'rgba(16, 19, 24, 0.45)',
};

export const dark: Palette = {
  background: '#101318',
  surface: '#181C23',
  surfaceAlt: '#222833',
  border: '#2E3542',
  text: '#E9ECF1',
  textMuted: '#9AA3B2',
  primary: '#5B82F0',
  primaryPressed: '#4A6FD9',
  onPrimary: '#0B1020',
  success: '#3DBA74',
  successSoft: '#17301F',
  warning: '#E0A43A',
  danger: '#EF5A6B',
  onDanger: '#1A0A0D',
  pr: '#E3B341',
  warmup: '#3DBA74',
  drop: '#F0924A',
  failure: '#EF5A6B',
  overlay: 'rgba(0, 0, 0, 0.6)',
};
