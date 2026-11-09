import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { IconButton } from './IconButton';
import { Text } from './Text';

type Props = {
  title: string;
  subtitle?: string;
  /** Show a back button (also covered by the Android back button). */
  back?: boolean;
  right?: ReactNode;
};

export function ScreenHeader({ title, subtitle, back, right }: Props) {
  const router = useRouter();
  return (
    <View className="min-h-12 flex-row items-center gap-2 pt-2">
      {back && (
        <View className="-ml-3">
          <IconButton icon={ChevronLeft} label="Go back" onPress={() => router.back()} />
        </View>
      )}
      <View className="flex-1">
        <Text variant="title" accessibilityRole="header">
          {title}
        </Text>
        {subtitle && <Text tone="muted">{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}
