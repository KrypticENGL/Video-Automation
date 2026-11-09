import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, motion, radius } from '@/theme/tokens';
import { Text } from './Text';

type Props = {
  /** 0 to 1 */
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: Props) {
  const clamped = Math.min(1, Math.max(0, value));
  const progress = useSharedValue(clamped);
  useEffect(() => {
    progress.set(withTiming(clamped, { duration: motion.slow }));
  }, [clamped, progress]);
  const fill = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));
  const percent = Math.round(clamped * 100);

  return (
    <View className="gap-2">
      {label && (
        <View className="flex-row justify-between">
          <Text variant="caption" tone="muted">
            {label}
          </Text>
          <Text variant="caption" tone="muted">
            {percent}%
          </Text>
        </View>
      )}
      <View
        className="h-2 overflow-hidden rounded-full bg-neutral-tint dark:bg-neutral-tint-dark"
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: percent }}
      >
        <Animated.View
          style={[
            { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
            fill,
          ]}
        />
      </View>
    </View>
  );
}
