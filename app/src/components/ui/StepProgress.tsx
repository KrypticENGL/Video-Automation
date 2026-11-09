import { Check, Loader } from 'lucide-react-native';
import { View } from 'react-native';
import { colors, icon as iconSize } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { Text } from './Text';

export type Step = { label: string; hint?: string; state: 'done' | 'active' | 'pending' };

/** Vertical list of pipeline stages. Feed it the real stages from the post status. */
export function StepProgress({ steps }: { steps: Step[] }) {
  const { on } = useTheme();
  return (
    <View accessibilityRole="list">
      {steps.map((step, i) => (
        <View
          key={step.label}
          className="flex-row gap-3"
          accessible
          accessibilityLabel={`${step.label}: ${step.state}`}
        >
          <View className="items-center">
            <View
              className={`h-8 w-8 items-center justify-center rounded-full ${
                step.state === 'done'
                  ? 'bg-success'
                  : step.state === 'active'
                    ? 'bg-brand-tint dark:bg-brand-tint-dark'
                    : 'border border-border dark:border-border-dark'
              }`}
            >
              {step.state === 'done' && (
                <Check size={iconSize.xs} color={colors.white} strokeWidth={iconSize.stroke} />
              )}
              {step.state === 'active' && (
                <Loader size={iconSize.xs} color={on('brand')} strokeWidth={iconSize.stroke} />
              )}
            </View>
            {i < steps.length - 1 && (
              <View
                className={`min-h-4 w-0.5 flex-1 ${
                  step.state === 'done' ? 'bg-success' : 'bg-border dark:bg-border-dark'
                }`}
              />
            )}
          </View>
          <View className="flex-1 pb-5 pt-1">
            <Text
              variant={step.state === 'active' ? 'heading' : 'body'}
              tone={step.state === 'pending' ? 'muted' : 'default'}
            >
              {step.label}
            </Text>
            {step.hint && step.state === 'active' && (
              <Text variant="caption" tone="muted">
                {step.hint}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
