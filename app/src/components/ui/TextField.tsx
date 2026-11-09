import { useState, type ComponentRef, type ReactNode, type Ref } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { Text } from './Text';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'className'> & {
  ref?: Ref<ComponentRef<typeof TextInput>>;
  label: string;
  helper?: string;
  error?: string;
  /** Show "used/max" under the field. Needs maxLength. */
  counter?: boolean;
  /** Element inside the field on the right, e.g. a show-password IconButton. */
  right?: ReactNode;
};

export function TextField({
  ref,
  label,
  helper,
  error,
  counter,
  right,
  multiline,
  onFocus,
  onBlur,
  ...input
}: TextFieldProps) {
  const { c } = useTheme();
  const [focused, setFocused] = useState(false);
  const border = error
    ? 'border-danger'
    : focused
      ? 'border-accent dark:border-accent-dark'
      : 'border-border dark:border-border-dark';
  const length = input.value?.length ?? 0;

  return (
    <View className="gap-2">
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <View
        className={`flex-row rounded-md border bg-field dark:bg-field-dark ${border} ${
          multiline ? 'min-h-32 items-start' : 'h-14 items-center'
        }`}
      >
        <TextInput
          {...input}
          ref={ref}
          multiline={multiline}
          accessibilityLabel={label}
          accessibilityHint={error ?? helper}
          placeholderTextColor={c.muted}
          selectionColor={c.accent}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={`flex-1 self-stretch px-4 font-jakarta text-body text-ink dark:text-ink-dark ${
            multiline ? 'py-3' : ''
          }`}
        />
        {right}
      </View>
      {(error || helper || counter) && (
        <View className="flex-row justify-between gap-3">
          <Text
            variant="caption"
            tone={error ? 'danger' : 'muted'}
            className="flex-1"
            accessibilityLiveRegion={error ? 'polite' : 'none'}
          >
            {error ?? helper ?? ''}
          </Text>
          {counter && input.maxLength !== undefined && (
            <Text variant="caption" tone="muted">
              {length}/{input.maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
