import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { AtSign, LayoutGrid, LogOut, Palette, Wallet } from 'lucide-react-native';
import { useRef } from 'react';
import { View } from 'react-native';
import {
  Avatar,
  Card,
  ConfirmSheet,
  Divider,
  ErrorState,
  ListItem,
  Screen,
  ScreenHeader,
  Skeleton,
  Text,
} from '@/components/ui';
import { getMe } from '@/lib/api';
import { signOut } from '@/lib/session';

function Account() {
  const me = useQuery({ queryKey: ['me'], queryFn: getMe });

  if (me.isPending) {
    return (
      <View
        className="flex-row items-center gap-3 p-4"
        accessible
        accessibilityLabel="Loading your account"
      >
        <Skeleton className="h-12 w-12 rounded-full" />
        <View className="gap-2">
          <Skeleton className="h-4 w-40 rounded-sm" />
          <Skeleton className="h-3 w-24 rounded-sm" />
        </View>
      </View>
    );
  }
  if (me.isError) {
    return <ErrorState text={me.error.message} onRetry={() => void me.refetch()} />;
  }
  return (
    <View className="flex-row items-center gap-3 p-4">
      <Avatar name={me.data.email} />
      <View className="flex-1">
        <Text variant="heading" numberOfLines={1}>
          {me.data.email}
        </Text>
        <Text variant="caption" tone="muted">
          Signed in
        </Text>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const logoutSheet = useRef<BottomSheetModal>(null);

  return (
    <Screen>
      <ScreenHeader title="Settings" back />

      <Card className="p-0">
        <Account />
      </Card>

      <View className="gap-2">
        <Text variant="label" tone="muted">
          Your account
        </Text>
        <Card className="p-0">
          <ListItem icon={AtSign} title="Instagram" value="Not connected" />
          <Divider />
          <ListItem icon={Palette} title="Brand brief" value="Coming soon" />
          <Divider />
          <ListItem icon={Wallet} title="Usage this month" value="Coming soon" />
        </Card>
      </View>

      {__DEV__ && (
        <Card className="p-0">
          <ListItem
            icon={LayoutGrid}
            title="Component gallery"
            subtitle="Development builds only"
            onPress={() => router.push('/dev/gallery')}
          />
        </Card>
      )}

      <Card className="p-0">
        <ListItem
          icon={LogOut}
          title="Log out"
          destructive
          onPress={() => logoutSheet.current?.present()}
        />
      </Card>

      <ConfirmSheet
        sheetRef={logoutSheet}
        title="Log out?"
        message="You will need your email and password to log in again."
        confirmLabel="Log out"
        destructive
        onConfirm={() => void signOut()}
      />
    </Screen>
  );
}
