// Values come from src/theme/tokens.ts: change tokens there, not here.
const { colors: c, radius, spacing, fonts, type } = require('./src/theme/tokens.ts');

const px = (n) => `${n}px`;
const pair = (k) => ({ DEFAULT: c.light[k], dark: c.dark[k] });
const tone = (t) => ({
  DEFAULT: t.base,
  tint: t.tint,
  on: t.on,
  'tint-dark': t.tintDark,
  'on-dark': t.onDark,
});
const text = (t) => [
  px(t.size),
  { lineHeight: px(t.line), ...(t.tracking ? { letterSpacing: px(t.tracking) } : {}) },
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // NativeWind follows the system setting; 'class' also lets the dev gallery toggle it
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: c.primary,
        'primary-2': c.primary2,
        scrim: c.scrim,
        'scrim-strong': c.scrimStrong,
        bg: pair('bg'),
        surface: pair('surface'),
        ink: pair('ink'),
        muted: pair('muted'),
        border: pair('border'),
        accent: pair('accent'),
        field: pair('field'),
        success: tone(c.success),
        warning: tone(c.warning),
        danger: tone(c.danger),
        info: tone(c.info),
        brand: tone(c.brand),
        neutral: tone(c.neutral),
      },
      borderRadius: {
        sm: px(radius.sm),
        md: px(radius.md),
        lg: px(radius.lg),
        xl: px(radius.xl),
      },
      spacing: { screen: px(spacing.screen), section: px(spacing.section) },
      fontFamily: {
        jakarta: [fonts.regular],
        'jakarta-medium': [fonts.medium],
        'jakarta-semibold': [fonts.semibold],
        'jakarta-bold': [fonts.bold],
      },
      fontSize: {
        display: text(type.display),
        title: text(type.title),
        heading: text(type.heading),
        body: text(type.body),
        caption: text(type.caption),
        label: text(type.label),
      },
    },
  },
};
