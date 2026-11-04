// Still design tokens — React Native. Solid colors only; never use gradients.
import { Platform, TextStyle, useColorScheme } from 'react-native';

export const palette = {
  dark: {
    bg: '#000000', surface: '#141414', surfaceRaised: '#1E1E1E', surfaceHigh: '#2A2A2A',
    border: '#262626', borderStrong: '#3A3A3A',
    textPrimary: '#E8E8E8', textSecondary: '#9C9C9C', textTertiary: '#6E6E6E',
    inverse: '#D6D6D6', onInverse: '#0A0A0A', scrim: 'rgba(0,0,0,0.6)',
    danger: '#E0605A', success: '#5DB07E', warning: '#D9A441',
  },
  light: {
    bg: '#FFFFFF', surface: '#F3F3F3', surfaceRaised: '#EAEAEA', surfaceHigh: '#DEDEDE',
    border: '#E4E4E4', borderStrong: '#CDCDCD',
    textPrimary: '#141414', textSecondary: '#5E5E5E', textTertiary: '#8A8A8A',
    inverse: '#1A1A1A', onInverse: '#F2F2F2', scrim: 'rgba(0,0,0,0.35)',
    danger: '#C8433D', success: '#2F8A57', warning: '#A87414',
  },
} as const;

export type ColorScheme = keyof typeof palette;
export type Colors = { [K in keyof typeof palette.dark]: string };

const family = Platform.select({ ios: 'System', default: 'System' });
const t = (fontSize: number, lineHeight: number, fontWeight: TextStyle['fontWeight'], letterSpacing = 0): TextStyle =>
  ({ fontFamily: family, fontSize, lineHeight, fontWeight, letterSpacing });

export const type = {
  display: t(34, 41, '700', 0.37),
  title1: t(28, 34, '700', 0.36),
  title2: t(22, 28, '700', 0.35),
  title3: t(20, 25, '600', 0.38),
  prompt: t(24, 30, '700'),
  headline: t(17, 22, '600', -0.41),
  body: t(17, 22, '400', -0.41),
  callout: t(16, 21, '400', -0.32),
  subhead: t(15, 20, '400', -0.24),
  footnote: t(13, 18, '400', -0.08),
  caption: t(12, 16, '400'),
  overline: { ...t(12, 16, '600', 1.4), textTransform: 'uppercase' } as TextStyle,
} as const;

export const space = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 14: 56 } as const;
export const radius = { xs: 8, sm: 12, md: 16, lg: 20, xl: 28, pill: 999 } as const;
export const size = {
  hitMin: 44, buttonLg: 56, buttonMd: 48, buttonSm: 36, iconButton: 44, fab: 56,
  icon: 24, iconSm: 20, tabBar: 49, navBar: 44, screenPadding: 20, hairline: 0.5,
} as const;
export const motion = {
  fast: 150, base: 250, slow: 400,
  spring: { damping: 20, stiffness: 220, mass: 1 },
  pressScale: 0.97,
} as const;
export const opacity = { disabled: 0.4, pressed: 0.7 } as const;

/** Dark is the default; light only when the user's system asks for it. */
export function useTheme() {
  const scheme: ColorScheme = useColorScheme() === 'light' ? 'light' : 'dark';
  return { scheme, colors: palette[scheme] as Colors, type, space, radius, size, motion, opacity };
}
