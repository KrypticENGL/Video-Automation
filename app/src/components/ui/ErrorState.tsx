import { CircleAlert } from 'lucide-react-native';
import { EmptyState } from './EmptyState';

type Props = {
  title?: string;
  /** A user-facing message, e.g. ApiError.message. */
  text: string;
  onRetry: () => void;
};

export function ErrorState({ title = "That didn't load", text, onRetry }: Props) {
  return (
    <EmptyState
      icon={CircleAlert}
      tone="danger"
      title={title}
      text={text}
      action={{ title: 'Try again', onPress: onRetry }}
    />
  );
}
