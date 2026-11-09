import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff } from 'lucide-react-native';
import { useRef, useState, type ComponentRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  type TextInput as RNTextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandGradient, Button, IconButton, Text, TextField } from '@/components/ui';
import { login } from '@/lib/api';
import { signIn } from '@/lib/session';
import { spacing } from '@/theme/tokens';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<ComponentRef<typeof RNTextInput>>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: () => login(email.trim(), password),
    onSuccess: ({ token }) => signIn(token), // the root layout then swaps Login for Home
    onError: () => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    },
  });

  const emailProblem = !email.trim()
    ? 'Enter your email address'
    : !/^\S+@\S+\.\S+$/.test(email.trim())
      ? 'Enter a valid email address'
      : undefined;
  const emailError = submitted ? emailProblem : undefined;
  const passwordError = submitted && !password ? 'Enter your password' : undefined;

  const submit = () => {
    setSubmitted(true);
    if (!emailProblem && password) mutation.mutate();
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-bg dark:bg-bg-dark">
      <ScrollView
        contentContainerClassName="grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="overflow-hidden rounded-b-xl px-screen pb-10"
          style={{ paddingTop: insets.top + spacing.hero }}
        >
          <BrandGradient />
          {/* The header is the gradient in both themes, so status bar icons are always light here. */}
          <StatusBar style="light" />
          <Text variant="label" tone="inverse">
            EdFinco
          </Text>
          <Text variant="display" tone="inverse" className="mt-2" accessibilityRole="header">
            Welcome back
          </Text>
          <Text tone="inverse" className="mt-1">
            Log in to post your next reel.
          </Text>
        </View>

        <View
          className="gap-4 px-screen pt-section"
          style={{ paddingBottom: insets.bottom + spacing.section }}
        >
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="username"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            submitBehavior="submit"
            editable={!mutation.isPending}
          />
          <TextField
            ref={passwordRef}
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            placeholder="Your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={submit}
            editable={!mutation.isPending}
            right={
              <IconButton
                icon={showPassword ? EyeOff : Eye}
                label={showPassword ? 'Hide password' : 'Show password'}
                onPress={() => setShowPassword((v) => !v)}
              />
            }
          />

          {mutation.isError && (
            <View
              className="rounded-md bg-danger-tint p-3 dark:bg-danger-tint-dark"
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              <Text tone="danger">{mutation.error.message}</Text>
            </View>
          )}

          <View className="mt-2">
            <Button title="Log in" onPress={submit} loading={mutation.isPending} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
