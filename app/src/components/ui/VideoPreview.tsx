// https://docs.expo.dev/versions/latest/sdk/video/
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Play, Volume2, VolumeX } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, icon as iconSize } from '@/theme/tokens';
import { IconButton } from './IconButton';

/** 9:16 preview. Tap to play/pause; mute toggle bottom-right. Controls sit on scrims, never bare video. */
export function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const { muted } = useEvent(player, 'mutedChange', { muted: player.muted });

  return (
    <View className="aspect-[9/16] w-full overflow-hidden rounded-xl bg-black">
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => (isPlaying ? player.pause() : player.play())}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause video' : 'Play video'}
        className="items-center justify-center"
      >
        {!isPlaying && (
          <View className="h-16 w-16 items-center justify-center rounded-full bg-scrim-strong">
            <Play size={iconSize.lg} color={colors.white} strokeWidth={iconSize.stroke} />
          </View>
        )}
      </Pressable>
      <View className="absolute bottom-3 right-3">
        <IconButton
          icon={muted ? VolumeX : Volume2}
          label={muted ? 'Turn sound on' : 'Turn sound off'}
          variant="scrim"
          onPress={() => {
            // expo-video players are mutable by design; this is the documented way to mute.
            // eslint-disable-next-line react-hooks/immutability
            player.muted = !muted;
          }}
        />
      </View>
    </View>
  );
}
