import { Pressable, View } from 'react-native';
import { elevation } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { Text } from './Text';

type Option<T extends string> = { value: T; label: string; caption?: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Read by screen readers, e.g. "Reel quality". */
  label: string;
};

export function SegmentedControl<T extends string>({ options, value, onChange, label }: Props<T>) {
  const { dark } = useTheme();
  return (
    <View
      className="flex-row gap-1 rounded-lg bg-neutral-tint p-1 dark:bg-neutral-tint-dark"
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={[option.label, option.caption].filter(Boolean).join(', ')}
            style={selected && !dark ? elevation.card : undefined}
            className={`min-h-12 flex-1 items-center justify-center rounded-md px-2 py-2 ${
              selected ? 'bg-surface dark:bg-accent-dark/20' : ''
            }`}
          >
            <Text variant="heading" tone={selected ? 'default' : 'muted'}>
              {option.label}
            </Text>
            {option.caption && (
              <Text variant="caption" tone={selected ? 'accent' : 'muted'}>
                {option.caption}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
