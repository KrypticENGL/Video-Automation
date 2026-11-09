import type { LucideIcon } from 'lucide-react-native';
import { colors, icon as iconSize } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { PressableScale } from './PressableScale';

type Props = {
  icon: LucideIcon;
  /** Read by screen readers; required because there is no visible text. */
  label: string;
  onPress?: () => void;
  /** plain = no background; surface = card-coloured circle; scrim = dark circle for use over video. */
  variant?: 'plain' | 'surface' | 'scrim';
  disabled?: boolean;
};

const box = {
  plain: '',
  surface: 'bg-surface dark:bg-surface-dark border border-border dark:border-border-dark',
  scrim: 'bg-scrim-strong',
} as const;

export function IconButton({ icon: Icon, label, onPress, variant = 'plain', disabled }: Props) {
  const { c } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`h-12 w-12 items-center justify-center rounded-full ${box[variant]} ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <Icon
        size={iconSize.md}
        color={variant === 'scrim' ? colors.white : c.ink}
        strokeWidth={iconSize.stroke}
      />
    </PressableScale>
  );
}
