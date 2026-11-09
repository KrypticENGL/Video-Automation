import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  /** Sticky area at the bottom, inside the safe area: put the primary action here. */
  footer?: ReactNode;
  /** Set false for a fixed layout that manages its own scrolling. */
  scroll?: boolean;
};

/** Page shell: themed background, safe area, screen padding, keyboard avoidance, optional sticky footer. */
export function Screen({ children, footer, scroll = true }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-bg-dark">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-screen pb-section gap-section"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1 gap-section px-screen">{children}</View>
        )}
        {footer && <View className="gap-3 px-screen pb-4 pt-3">{footer}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
