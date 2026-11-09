import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  /** Size and shape classes, e.g. "h-4 w-40 rounded-sm" or "h-12 w-12 rounded-full". */
  className: string;
};

/** Loading placeholder with a soft pulse. Use instead of spinners for data views. */
export function Skeleton({ className }: Props) {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.set(withRepeat(withTiming(0.45, { duration: 800 }), -1, true));
  }, [opacity]);
  const pulse = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    // Hidden from screen readers: label the group of skeletons once instead ("Loading your account").
    <Animated.View style={pulse} accessible={false} importantForAccessibility="no-hide-descendants">
      <View className={`bg-neutral-tint dark:bg-neutral-tint-dark ${className}`} />
    </Animated.View>
  );
}
