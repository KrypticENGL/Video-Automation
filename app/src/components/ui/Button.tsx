import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import { colors, icon } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { BrandGradient } from './BrandGradient';
import { PressableScale } from './PressableScale';
import { Text, type TextTone } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';

const box: Record<Variant, string> = {
  primary: '',
  secondary: 'bg-surface dark:bg-surface-dark border border-border dark:border-border-dark',
  ghost: '',
  destructive: 'bg-danger',
};
const textTone: Record<Variant, TextTone> = {
  primary: 'inverse',
  secondary: 'default',
  ghost: 'accent',
  destructive: 'inverse',
};

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  /** e.g. { flex: 1 } when two buttons share a row. */
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  icon: Icon,
  style,
}: Props) {
  const { c } = useTheme();
  const fg = {
    primary: colors.white,
    secondary: c.ink,
    ghost: c.accent,
    destructive: colors.white,
  }[variant];
  const off = disabled || loading;

  return (
    <PressableScale
      haptic
      onPress={onPress}
      disabled={off}
      wrapperStyle={style}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: off, busy: loading }}
      className={`flex-row items-center justify-center gap-2 overflow-hidden rounded-lg px-5 ${
        size === 'lg' ? 'h-14' : 'h-12'
      } ${box[variant]} ${disabled ? 'opacity-50' : ''}`}
    >
      {variant === 'primary' && <BrandGradient />}
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {Icon && <Icon size={icon.sm} color={fg} strokeWidth={icon.stroke} />}
          <Text variant="heading" tone={textTone[variant]} numberOfLines={1}>
            {title}
          </Text>
        </>
      )}
    </PressableScale>
  );
}
