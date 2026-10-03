import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useTheme, type Theme } from '@/theme';

export type TextVariant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption' | 'number';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  muted?: boolean;
  color?: string;
  align?: TextStyle['textAlign'];
}

const variantStyle = (t: Theme, v: TextVariant): TextStyle => {
  const f = t.font.family;
  const s = t.font.size;
  switch (v) {
    case 'display':
      return { fontFamily: f.displayBold, fontSize: s['3xl'], lineHeight: 40 };
    case 'title':
      return { fontFamily: f.display, fontSize: s['2xl'], lineHeight: 32 };
    case 'heading':
      return { fontFamily: f.semibold, fontSize: s.lg, lineHeight: 24 };
    case 'label':
      return { fontFamily: f.medium, fontSize: s.sm, lineHeight: 18 };
    case 'caption':
      return { fontFamily: f.regular, fontSize: s.xs, lineHeight: 16 };
    case 'number':
      return { fontFamily: f.display, fontSize: s.lg, fontVariant: ['tabular-nums'] };
    case 'body':
    default:
      return { fontFamily: f.regular, fontSize: s.md, lineHeight: 22 };
  }
};

export function Text({ variant = 'body', muted, color, align, style, ...rest }: TextProps) {
  const t = useTheme();
  return (
    <RNText
      maxFontSizeMultiplier={1.4}
      {...rest}
      style={[
        variantStyle(t, variant),
        { color: color ?? (muted ? t.colors.textMuted : t.colors.text), textAlign: align },
        style,
      ]}
    />
  );
}
