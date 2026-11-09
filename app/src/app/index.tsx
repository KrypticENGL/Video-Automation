import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Clapperboard, Settings, Sparkles, Upload } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  BottomSheet,
  BrandGradient,
  Button,
  Card,
  EmptyState,
  IconButton,
  PressableScale,
  Screen,
  ScreenHeader,
  Text,
} from '@/components/ui';
import { getMe } from '@/lib/api';
import { colors, icon, motion } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const comingSoon = {
  video:
    'Posting your own video arrives in the next update. You will pick a video and we will write the caption.',
  topic:
    'Creating a reel from a topic arrives in a later update. You will type a topic and we will make the video.',
};

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
}

const enter = (index: number) => FadeInUp.duration(motion.base).delay(index * motion.stagger);

export default function HomeScreen() {
  const router = useRouter();
  const { on } = useTheme();
  const sheet = useRef<BottomSheetModal>(null);
  const [soon, setSoon] = useState<keyof typeof comingSoon>('video');
  // Checks the saved token with the server; an expired one signs the user out (see lib/api.ts).
  useQuery({ queryKey: ['me'], queryFn: getMe });

  const open = (which: keyof typeof comingSoon) => {
    setSoon(which);
    sheet.current?.present();
  };

  return (
    <Screen>
      <ScreenHeader
        title={greeting()}
        subtitle="What would you like to post today?"
        right={
          <IconButton
            icon={Settings}
            label="Settings"
            variant="surface"
            onPress={() => router.push('/settings')}
          />
        }
      />

      <View className="gap-4">
        <Animated.View entering={enter(0)}>
          <PressableScale
            haptic
            onPress={() => open('video')}
            accessibilityRole="button"
            accessibilityLabel="Post my video. Pick a video from your phone and we will write the caption."
            className="gap-4 overflow-hidden rounded-xl p-5"
          >
            <BrandGradient />
            <View className="h-12 w-12 items-center justify-center rounded-full bg-scrim">
              <Upload size={icon.lg} color={colors.white} strokeWidth={icon.stroke} />
            </View>
            <View className="gap-1">
              <Text variant="title" tone="inverse">
                Post my video
              </Text>
              <Text tone="inverse">Pick a video from your phone. We’ll write the caption.</Text>
            </View>
          </PressableScale>
        </Animated.View>

        <Animated.View entering={enter(1)}>
          <Card
            outlined
            onPress={() => open('topic')}
            accessibilityLabel="Create from topic. Type a topic and we will make the reel for you."
            className="gap-4 rounded-xl p-5"
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-brand-tint dark:bg-brand-tint-dark">
              <Sparkles size={icon.lg} color={on('brand')} strokeWidth={icon.stroke} />
            </View>
            <View className="gap-1">
              <Text variant="title">Create from topic</Text>
              <Text tone="muted">Type a topic and we’ll make the reel for you.</Text>
            </View>
          </Card>
        </Animated.View>
      </View>

      <Animated.View entering={enter(2)} className="gap-2">
        <Text variant="label" tone="muted">
          Recent posts
        </Text>
        {/* GET /posts arrives in Part 2; until then there is nothing to load, so this is always empty. */}
        <Card className="p-0">
          <EmptyState
            icon={Clapperboard}
            title="No posts yet"
            text="Your reels will show up here once you create one."
          />
        </Card>
      </Animated.View>

      <BottomSheet sheetRef={sheet}>
        <View className="gap-2">
          <Text variant="title">Coming soon</Text>
          <Text tone="muted">{comingSoon[soon]}</Text>
        </View>
        <Button title="Got it" onPress={() => sheet.current?.dismiss()} />
      </BottomSheet>
    </Screen>
  );
}
