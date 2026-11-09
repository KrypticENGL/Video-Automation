// Dev builds only: every ui component in every state. Update this when a component changes.
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Redirect } from 'expo-router';
import { Clapperboard, Moon, Send, Settings, Sun, Wallet } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import {
  Avatar,
  BottomSheet,
  Button,
  Card,
  ConfirmSheet,
  CostBadge,
  Divider,
  EmptyState,
  ErrorState,
  HashtagEditor,
  IconButton,
  ListItem,
  ProgressBar,
  Screen,
  ScreenHeader,
  SegmentedControl,
  Skeleton,
  StatusChip,
  StepProgress,
  Text,
  TextArea,
  TextField,
  useToast,
  VideoPreview,
  type ChipStatus,
} from '@/components/ui';

const SAMPLE_VIDEO = 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';
const statuses: ChipStatus[] = [
  'uploading',
  'processing',
  'ready',
  'publishing',
  'published',
  'failed',
  'discarded',
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text variant="label" tone="muted">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function Gallery() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const toast = useToast();
  const sheet = useRef<BottomSheetModal>(null);
  const confirm = useRef<BottomSheetModal>(null);
  const [text, setText] = useState('');
  const [caption, setCaption] = useState('3 documents you need for an education loan.');
  const [tags, setTags] = useState(['educationloan', 'studyabroad']);
  const [quality, setQuality] = useState<'hook' | 'full'>('hook');
  const [progress, setProgress] = useState(0.4);

  if (!__DEV__) return <Redirect href="/" />;
  const dark = colorScheme === 'dark';

  return (
    <Screen>
      <ScreenHeader
        title="Gallery"
        subtitle={dark ? 'Dark theme' : 'Light theme'}
        back
        right={
          <IconButton
            icon={dark ? Sun : Moon}
            label="Switch theme"
            variant="surface"
            onPress={() => setColorScheme(dark ? 'light' : 'dark')}
          />
        }
      />

      <Section title="Text">
        <Text variant="display">Display 28</Text>
        <Text variant="title">Title 22</Text>
        <Text variant="heading">Heading 17</Text>
        <Text>Body 15. Your reel is ready to review.</Text>
        <Text variant="caption" tone="muted">
          Caption 13, muted
        </Text>
        <Text variant="label" tone="accent">
          Label 12
        </Text>
      </Section>

      <Section title="Button">
        <Button title="Approve & Post" icon={Send} />
        <Button title="Secondary" variant="secondary" />
        <Button title="Ghost" variant="ghost" />
        <Button title="Discard" variant="destructive" />
        <Button title="Loading" loading />
        <Button title="Disabled" disabled />
        <View className="flex-row gap-3">
          <Button title="Medium" size="md" variant="secondary" style={{ flex: 1 }} />
          <Button title="Medium" size="md" style={{ flex: 1 }} />
        </View>
      </Section>

      <Section title="IconButton and Avatar">
        <View className="flex-row items-center gap-3">
          <IconButton icon={Settings} label="Plain" />
          <IconButton icon={Settings} label="Surface" variant="surface" />
          <IconButton icon={Settings} label="Scrim" variant="scrim" />
          <IconButton icon={Settings} label="Disabled" variant="surface" disabled />
          <Avatar name="client@edfinco.com" />
        </View>
      </Section>

      <Section title="Card">
        <Card>
          <Text variant="heading">Card</Text>
          <Text tone="muted">Shadow in light mode, border in dark mode.</Text>
        </Card>
        <Card outlined onPress={() => toast('Card pressed')}>
          <Text variant="heading">Outlined, pressable</Text>
        </Card>
      </Section>

      <Section title="TextField and TextArea">
        <TextField
          label="Topic"
          value={text}
          onChangeText={setText}
          placeholder="3 documents you need for an education loan"
          helper="Keep it to one idea."
        />
        <TextField label="With error" value="abc" error="Enter a valid email address" />
        <TextArea
          label="Caption"
          value={caption}
          onChangeText={setCaption}
          maxLength={2200}
          counter
        />
      </Section>

      <Section title="StatusChip">
        <View className="flex-row flex-wrap gap-2">
          {statuses.map((s) => (
            <StatusChip key={s} status={s} />
          ))}
        </View>
      </Section>

      <Section title="HashtagEditor">
        <HashtagEditor value={tags} onChange={setTags} />
      </Section>

      <Section title="SegmentedControl and CostBadge">
        <SegmentedControl
          label="Reel quality"
          value={quality}
          onChange={setQuality}
          options={[
            { value: 'hook', label: 'Hook only', caption: '≈ ₹120' },
            { value: 'full', label: 'Full AI', caption: '≈ ₹360' },
          ]}
        />
        <View className="flex-row gap-2">
          <CostBadge amountInr={quality === 'hook' ? 120 : 360} />
          <CostBadge amountInr={125000} />
        </View>
      </Section>

      <Section title="ProgressBar">
        <ProgressBar value={progress} label="Uploading your video" />
        <Button
          title="Add 20%"
          size="md"
          variant="secondary"
          onPress={() => setProgress((p) => (p >= 1 ? 0 : p + 0.2))}
        />
      </Section>

      <Section title="StepProgress">
        <StepProgress
          steps={[
            { label: 'Video uploaded', state: 'done' },
            { label: 'Writing your caption', state: 'active', hint: 'Usually under a minute' },
            { label: 'Ready to review', state: 'pending' },
          ]}
        />
      </Section>

      <Section title="Skeleton">
        <View className="flex-row items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <View className="gap-2">
            <Skeleton className="h-4 w-48 rounded-sm" />
            <Skeleton className="h-3 w-28 rounded-sm" />
          </View>
        </View>
      </Section>

      <Section title="ListItem and Divider">
        <Card className="p-0">
          <ListItem icon={Wallet} title="Usage this month" value="₹1,240" onPress={() => {}} />
          <Divider />
          <ListItem icon={Settings} title="With subtitle" subtitle="Second line" />
          <Divider />
          <ListItem icon={Settings} title="Destructive" destructive onPress={() => {}} />
        </Card>
      </Section>

      <Section title="EmptyState and ErrorState">
        <Card className="p-0">
          <EmptyState
            icon={Clapperboard}
            title="No posts yet"
            text="Your reels will show up here once you create one."
            action={{ title: 'Post my video', onPress: () => {} }}
          />
        </Card>
        <Card className="p-0">
          <ErrorState
            text="Can't reach the server. Check your internet connection and try again."
            onRetry={() => toast('Retrying')}
          />
        </Card>
      </Section>

      <Section title="Toast">
        <View className="flex-row gap-2">
          <Button
            title="Info"
            size="md"
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => toast('Caption saved')}
          />
          <Button
            title="Success"
            size="md"
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => toast('Your reel is live', 'success')}
          />
          <Button
            title="Error"
            size="md"
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => toast("Couldn't publish. Try again.", 'danger')}
          />
        </View>
      </Section>

      <Section title="BottomSheet and ConfirmSheet">
        <Button title="Open sheet" variant="secondary" onPress={() => sheet.current?.present()} />
        <Button
          title="Open confirm"
          variant="secondary"
          onPress={() => confirm.current?.present()}
        />
      </Section>

      <Section title="VideoPreview">
        <VideoPreview uri={SAMPLE_VIDEO} />
      </Section>

      <BottomSheet sheetRef={sheet}>
        <Text variant="title">Regenerate caption</Text>
        <Text tone="muted">Sheets size themselves to their content.</Text>
        <Button title="Close" onPress={() => sheet.current?.dismiss()} />
      </BottomSheet>
      <ConfirmSheet
        sheetRef={confirm}
        title="Post this reel?"
        message="It will be published to your Instagram account straight away."
        confirmLabel="Approve & Post"
        onConfirm={() => toast('Confirmed', 'success')}
      />
    </Screen>
  );
}
