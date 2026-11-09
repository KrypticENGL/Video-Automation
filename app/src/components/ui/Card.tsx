import type { ReactNode } from 'react';
import { View } from 'react-native';
import { elevation, radius } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { PressableScale } from './PressableScale';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  /** outlined = visible border in both themes, no shadow. */
  outlined?: boolean;
  /** Layout classes (padding, gap). Default padding is p-4. */
  className?: string;
};

export function Card({
  children,
  onPress,
  accessibilityLabel,
  outlined,
  className = 'p-4',
}: Props) {
  const { dark } = useTheme();
  const classes = `rounded-lg border bg-surface dark:bg-surface-dark dark:border-border-dark ${
    outlined ? 'border-border' : 'border-transparent'
  } ${className}`;
  // Dark mode: border instead of shadow.
  const style = dark || outlined ? undefined : elevation.card;

  if (!onPress) {
    return (
      <View className={classes} style={style}>
        {children}
      </View>
    );
  }
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={classes}
      // The shadow sits on the animated wrapper, which needs the card's radius to shape it.
      wrapperStyle={style && { ...style, borderRadius: radius.lg }}
    >
      {children}
    </PressableScale>
  );
}
