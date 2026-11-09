// https://gorhom.dev/react-native-bottom-sheet/modal
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useEffect, useState, type ReactNode, type RefObject } from 'react';
import { BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export type SheetRef = RefObject<BottomSheetModal | null>;

type Props = {
  /** const sheet = useRef<BottomSheetModal>(null); sheet.current?.present() / .dismiss() */
  sheetRef: SheetRef;
  children: ReactNode;
};

const Backdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
);

/** Themed modal sheet sized to its content. Closes on backdrop tap, swipe down and Android back. */
export function BottomSheet({ sheetRef, children }: Props) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      sheetRef.current?.dismiss();
      return true;
    });
    return () => sub.remove();
  }, [open, sheetRef]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing
      backdropComponent={Backdrop}
      onChange={(index) => setOpen(index >= 0)}
      onDismiss={() => setOpen(false)}
      backgroundStyle={{ backgroundColor: c.surface, borderRadius: radius.xl }}
      handleIndicatorStyle={{ backgroundColor: c.border }}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: spacing.screen,
          paddingTop: 8,
          paddingBottom: insets.bottom + spacing.section,
          gap: 16,
        }}
      >
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
