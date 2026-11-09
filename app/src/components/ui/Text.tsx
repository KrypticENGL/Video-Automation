import { Text as RNText, type TextProps } from 'react-native';

const variants = {
  display: 'text-display font-jakarta-bold',
  title: 'text-title font-jakarta-semibold',
  heading: 'text-heading font-jakarta-semibold',
  body: 'text-body font-jakarta',
  caption: 'text-caption font-jakarta-medium',
  label: 'text-label font-jakarta-semibold uppercase',
} as const;

const tones = {
  default: 'text-ink dark:text-ink-dark',
  muted: 'text-muted dark:text-muted-dark',
  accent: 'text-accent dark:text-accent-dark',
  inverse: 'text-white',
  success: 'text-success-on dark:text-success-on-dark',
  warning: 'text-warning-on dark:text-warning-on-dark',
  danger: 'text-danger-on dark:text-danger-on-dark',
  info: 'text-info-on dark:text-info-on-dark',
  brand: 'text-brand-on dark:text-brand-on-dark',
  neutral: 'text-neutral-on dark:text-neutral-on-dark',
} as const;

export type TextTone = keyof typeof tones;

type Props = TextProps & {
  variant?: keyof typeof variants;
  tone?: TextTone;
  /** Layout classes only (margins, flex, alignment). Use `variant` and `tone` for type and colour. */
  className?: string;
};

export function Text({ variant = 'body', tone = 'default', className = '', ...rest }: Props) {
  return <RNText className={`${variants[variant]} ${tones[tone]} ${className}`} {...rest} />;
}
