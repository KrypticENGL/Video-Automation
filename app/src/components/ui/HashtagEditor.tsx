import { Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { addHashtag, MAX_HASHTAGS } from '@/lib/hashtags';
import { icon as iconSize } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { IconButton } from './IconButton';
import { Text } from './Text';

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
};

export function HashtagEditor({ value, onChange, max = MAX_HASHTAGS }: Props) {
  const { c, on } = useTheme();
  const [draft, setDraft] = useState('');
  const full = value.length >= max;

  const add = () => {
    onChange(addHashtag(value, draft, max));
    setDraft('');
  };

  return (
    <View className="gap-2">
      <View className="flex-row justify-between">
        <Text variant="caption" tone="muted">
          Hashtags
        </Text>
        <Text variant="caption" tone="muted">
          {value.length}/{max}
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {value.map((tag) => (
          <View
            key={tag}
            className="flex-row items-center rounded-full bg-brand-tint pl-3 dark:bg-brand-tint-dark"
          >
            <Text variant="caption" tone="brand">
              #{tag}
            </Text>
            {/* Full 48 dp touch target: hitSlop can't reach outside the chip on Android. */}
            <Pressable
              onPress={() => onChange(value.filter((t) => t !== tag))}
              accessibilityRole="button"
              accessibilityLabel={`Remove hashtag ${tag}`}
              className="h-12 w-12 items-center justify-center"
            >
              <X size={iconSize.xs} color={on('brand')} strokeWidth={iconSize.stroke} />
            </Pressable>
          </View>
        ))}
      </View>
      {full ? (
        <Text variant="caption" tone="muted">
          That’s the maximum. Remove one to add another.
        </Text>
      ) : (
        <View className="h-14 flex-row items-center rounded-md border border-border bg-field pl-4 dark:border-border-dark dark:bg-field-dark">
          <Text tone="muted">#</Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={add}
            submitBehavior="submit"
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Add a hashtag"
            placeholderTextColor={c.muted}
            accessibilityLabel="Add a hashtag"
            className="flex-1 self-stretch px-1 font-jakarta text-body text-ink dark:text-ink-dark"
          />
          <IconButton icon={Plus} label="Add hashtag" onPress={add} disabled={!draft.trim()} />
        </View>
      )}
    </View>
  );
}
