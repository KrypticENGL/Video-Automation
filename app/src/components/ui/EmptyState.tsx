import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { icon as iconSize, type Tone } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { Button } from './Button';
import { tintBg } from './StatusChip';
import { Text } from './Text';

type Props = {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: { title: string; onPress: () => void };
  tone?: Tone;
};

export function EmptyState({ icon: Icon, title, text, action, tone = 'brand' }: Props) {
  const { on } = useTheme();
  return (
    <View className="items-center gap-3 px-4 py-8">
      <View className={`h-16 w-16 items-center justify-center rounded-full ${tintBg[tone]}`}>
        <Icon size={iconSize.lg} color={on(tone)} strokeWidth={iconSize.stroke} />
      </View>
      <View className="items-center gap-1">
        <Text variant="heading" className="text-center">
          {title}
        </Text>
        <Text tone="muted" className="text-center">
          {text}
        </Text>
      </View>
      {action && (
        <Button title={action.title} onPress={action.onPress} variant="secondary" size="md" />
      )}
    </View>
  );
}
