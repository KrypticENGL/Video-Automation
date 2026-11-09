import * as Haptics from 'expo-haptics';
import { CircleAlert, CircleCheck, Info } from 'lucide-react-native';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { elevation, icon as iconSize, motion } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { Text } from './Text';

type ToastTone = 'success' | 'danger' | 'info';
type ToastData = { id: number; message: string; tone: ToastTone };

const icons = { success: CircleCheck, danger: CircleAlert, info: Info };
const VISIBLE_MS = 3500;

const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {});

/** const toast = useToast(); toast('Caption saved', 'success') */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const { on, dark } = useTheme();
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback((message: string, tone: ToastTone = 'info') => {
    clearTimeout(timer.current);
    setToast({ id: Date.now(), message, tone });
    timer.current = setTimeout(() => setToast(null), VISIBLE_MS);
    const type =
      tone === 'success'
        ? Haptics.NotificationFeedbackType.Success
        : tone === 'danger'
          ? Haptics.NotificationFeedbackType.Error
          : null;
    if (type) void Haptics.notificationAsync(type).catch(() => {});
  }, []);

  const Icon = toast ? icons[toast.tone] : null;

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && Icon && (
        <Animated.View
          key={toast.id}
          entering={FadeInUp.duration(motion.base)}
          exiting={FadeOutUp.duration(motion.base)}
          pointerEvents="none"
          style={{ position: 'absolute', left: 0, right: 0, top: insets.top + 8 }}
        >
          <View
            className="mx-screen flex-row items-center gap-3 rounded-lg border border-transparent bg-surface p-4 dark:border-border-dark dark:bg-surface-dark"
            style={dark ? undefined : elevation.raised}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <Icon size={iconSize.md} color={on(toast.tone)} strokeWidth={iconSize.stroke} />
            <Text className="flex-1">{toast.message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}
