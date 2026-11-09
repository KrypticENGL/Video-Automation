import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { colors, icon as iconSize } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { Text } from './Text';

type Props = {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  /** Short status text on the right, e.g. "Not connected". */
  value?: string;
  /** Custom element on the right instead of `value`. */
  right?: ReactNode;
  onPress?: () => void;
  destructive?: boolean;
};

export function ListItem({
  icon: Icon,
  title,
  subtitle,
  value,
  right,
  onPress,
  destructive,
}: Props) {
  const { c, dark } = useTheme();
  const danger = dark ? colors.danger.onDark : colors.danger.on;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={[title, subtitle, value].filter(Boolean).join(', ')}
      className="min-h-14 flex-row items-center gap-3 px-4 py-2 active:opacity-60"
    >
      {Icon && (
        <Icon
          size={iconSize.md}
          color={destructive ? danger : c.muted}
          strokeWidth={iconSize.stroke}
        />
      )}
      <View className="flex-1">
        <Text variant="heading" tone={destructive ? 'danger' : 'default'}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" tone="muted">
            {subtitle}
          </Text>
        )}
      </View>
      {right ??
        (value && (
          <Text variant="caption" tone="muted">
            {value}
          </Text>
        ))}
      {onPress && !destructive && (
        <ChevronRight size={iconSize.sm} color={c.muted} strokeWidth={iconSize.stroke} />
      )}
    </Pressable>
  );
}
