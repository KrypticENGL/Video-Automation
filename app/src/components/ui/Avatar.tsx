import { View } from 'react-native';
import { Text } from './Text';

/** Initial of a name or email in a brand-tinted circle. */
export function Avatar({ name }: { name: string }) {
  return (
    <View
      className="h-12 w-12 items-center justify-center rounded-full bg-brand-tint dark:bg-brand-tint-dark"
      accessibilityLabel={name}
    >
      <Text variant="heading" tone="brand">
        {name.trim().charAt(0).toUpperCase() || '?'}
      </Text>
    </View>
  );
}
