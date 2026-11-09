import * as Haptics from 'expo-haptics';
import {
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { motion } from '@/theme/tokens';

type Props = Omit<PressableProps, 'style'> & {
  className?: string;
  /** Light haptic on press (primary actions). */
  haptic?: boolean;
  /** Style for the outer animated wrapper, e.g. { flex: 1 } for side-by-side buttons. */
  wrapperStyle?: StyleProp<ViewStyle>;
};

/** Pressable with the standard 0.97 press scale. Reanimated honours the system "reduce motion" setting. */
export function PressableScale({ haptic, onPress, wrapperStyle, ...rest }: Props) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const to = (v: number) => {
    scale.set(withTiming(v, { duration: motion.fast }));
  };

  return (
    <Animated.View style={[animated, wrapperStyle]}>
      <Pressable
        {...rest}
        onPressIn={() => to(motion.pressScale)}
        onPressOut={() => to(1)}
        onPress={(e: GestureResponderEvent) => {
          if (haptic) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onPress?.(e);
        }}
      />
    </Animated.View>
  );
}
