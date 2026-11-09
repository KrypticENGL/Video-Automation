import {
  CircleAlert,
  CircleCheck,
  CloudUpload,
  Eye,
  Loader,
  Send,
  Trash2,
  type LucideIcon,
} from 'lucide-react-native';
import { View } from 'react-native';
import { icon as iconSize, type Tone } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { Text } from './Text';

export type ChipStatus =
  'uploading' | 'processing' | 'ready' | 'publishing' | 'published' | 'failed' | 'discarded';

const map: Record<ChipStatus, { label: string; tone: Tone; icon: LucideIcon }> = {
  uploading: { label: 'Uploading', tone: 'info', icon: CloudUpload },
  processing: { label: 'Processing', tone: 'brand', icon: Loader },
  ready: { label: 'Ready to review', tone: 'warning', icon: Eye },
  publishing: { label: 'Publishing', tone: 'info', icon: Send },
  published: { label: 'Published', tone: 'success', icon: CircleCheck },
  failed: { label: 'Failed', tone: 'danger', icon: CircleAlert },
  discarded: { label: 'Discarded', tone: 'neutral', icon: Trash2 },
};

// Written out in full so Tailwind can see every class name.
export const tintBg: Record<Tone, string> = {
  success: 'bg-success-tint dark:bg-success-tint-dark',
  warning: 'bg-warning-tint dark:bg-warning-tint-dark',
  danger: 'bg-danger-tint dark:bg-danger-tint-dark',
  info: 'bg-info-tint dark:bg-info-tint-dark',
  brand: 'bg-brand-tint dark:bg-brand-tint-dark',
  neutral: 'bg-neutral-tint dark:bg-neutral-tint-dark',
};

export function StatusChip({ status }: { status: ChipStatus }) {
  const { on } = useTheme();
  const { label, tone, icon: Icon } = map[status];
  return (
    <View
      className={`h-7 flex-row items-center gap-1 self-start rounded-full px-2 ${tintBg[tone]}`}
      accessibilityLabel={`Status: ${label}`}
    >
      <Icon size={iconSize.xs} color={on(tone)} strokeWidth={iconSize.stroke} />
      <Text variant="caption" tone={tone}>
        {label}
      </Text>
    </View>
  );
}
