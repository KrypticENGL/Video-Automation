import { View } from 'react-native';
import { formatInr } from '@/lib/format';
import { Text } from './Text';

/** "≈ ₹360" estimate chip. Amount in whole rupees. */
export function CostBadge({ amountInr }: { amountInr: number }) {
  const text = `≈ ${formatInr(amountInr)}`;
  return (
    <View
      className="h-7 justify-center self-start rounded-full bg-info-tint px-3 dark:bg-info-tint-dark"
      accessibilityLabel={`Estimated cost ${formatInr(amountInr)}`}
    >
      <Text variant="caption" tone="info">
        {text}
      </Text>
    </View>
  );
}
