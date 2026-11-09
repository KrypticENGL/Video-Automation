import { View } from 'react-native';
import { BottomSheet, type SheetRef } from './BottomSheet';
import { Button } from './Button';
import { Text } from './Text';

type Props = {
  sheetRef: SheetRef;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

/** "Are you sure?" sheet. Always put one in front of publishing, discarding and logging out. */
export function ConfirmSheet({
  sheetRef,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive,
  onConfirm,
}: Props) {
  return (
    <BottomSheet sheetRef={sheetRef}>
      <View className="gap-2">
        <Text variant="title">{title}</Text>
        <Text tone="muted">{message}</Text>
      </View>
      <View className="gap-2">
        <Button
          title={confirmLabel}
          variant={destructive ? 'destructive' : 'primary'}
          onPress={() => {
            sheetRef.current?.dismiss();
            onConfirm();
          }}
        />
        <Button title={cancelLabel} variant="ghost" onPress={() => sheetRef.current?.dismiss()} />
      </View>
    </BottomSheet>
  );
}
