// Single source of design tokens. tailwind.config.js reads this file, so keep it free of imports.
// Brand colours are placeholders until the client's brand brief arrives: change them here only.

export const colors = {
  primary: '#4F46E5',
  primary2: '#3B82F6',
  gradient: ['#3B82F6', '#6366F1', '#7C3AED'] as const,
  // Darkens the gradient / video just enough for white text to pass WCAG AA.
  scrim: 'rgba(0, 0, 0, 0.16)',
  scrimStrong: 'rgba(0, 0, 0, 0.45)',
  white: '#FFFFFF',
  black: '#000000',
  light: {
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    ink: '#0F172A',
    muted: '#475569',
    border: '#E2E8F0',
    accent: '#4F46E5',
    field: '#FFFFFF',
  },
  dark: {
    bg: '#0B1020',
    surface: '#121933',
    ink: '#F1F5F9',
    muted: '#94A3B8',
    border: '#263056',
    accent: '#A5B4FC',
    field: '#0B1020',
  },
  // base = solid fills; tint + on = soft chip background and the text/icon colour that passes AA on it.
  success: {
    base: '#16A34A',
    tint: '#DCFCE7',
    on: '#166534',
    tintDark: '#12301F',
    onDark: '#4ADE80',
  },
  warning: {
    base: '#D97706',
    tint: '#FEF3C7',
    on: '#92400E',
    tintDark: '#3A2A0C',
    onDark: '#FBBF24',
  },
  danger: {
    base: '#DC2626',
    tint: '#FEE2E2',
    on: '#991B1B',
    tintDark: '#3B1518',
    onDark: '#F87171',
  },
  info: { base: '#2563EB', tint: '#DBEAFE', on: '#1E40AF', tintDark: '#14254F', onDark: '#93C5FD' },
  brand: {
    base: '#4F46E5',
    tint: '#E0E7FF',
    on: '#3730A3',
    tintDark: '#1E1B4B',
    onDark: '#A5B4FC',
  },
  neutral: {
    base: '#64748B',
    tint: '#E2E8F0',
    on: '#334155',
    tintDark: '#1E2747',
    onDark: '#CBD5E1',
  },
} as const;

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'neutral';

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 } as const;

// 4-pt base. Use Tailwind's scale (1 = 4) plus these two named sizes.
export const spacing = { screen: 20, section: 24, hero: 48 } as const;

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const;

export const type = {
  display: { size: 28, line: 34 },
  title: { size: 22, line: 28 },
  heading: { size: 17, line: 24 },
  body: { size: 15, line: 22 },
  caption: { size: 13, line: 18 },
  label: { size: 12, line: 16, tracking: 0.8 },
} as const;

// xs is only for icons inside chips and step dots; everything else is 20–24.
export const icon = { xs: 16, sm: 20, md: 22, lg: 24, stroke: 2 } as const;

export const motion = { fast: 150, base: 200, slow: 250, stagger: 30, pressScale: 0.97 } as const;

// Soft shadow for light mode only; dark mode uses borders instead.
export const elevation = {
  card: { boxShadow: '0px 8px 24px rgba(15, 23, 42, 0.07)' },
  raised: { boxShadow: '0px 12px 32px rgba(15, 23, 42, 0.12)' },
} as const;
