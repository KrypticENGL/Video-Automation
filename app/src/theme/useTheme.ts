import { useColorScheme } from 'nativewind';
import { colors, type Tone } from './tokens';

/** Colours for places className can't reach: icon colours, gradients, native component props. */
export function useTheme() {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';
  return {
    dark,
    c: dark ? colors.dark : colors.light,
    /** Foreground colour for text/icons on a tone's tint background. */
    on: (tone: Tone) => (dark ? colors[tone].onDark : colors[tone].on),
  };
}
