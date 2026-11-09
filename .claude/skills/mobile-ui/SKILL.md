---
name: mobile-ui
description: Design system and UI rules for the Expo app. Use for any screen, component, style or UX change in /app.
---

# Mobile UI — design system and rules

## Direction
Clean, premium fintech feel: calm, trustworthy, modern. Generous whitespace, one strong brand gradient used sparingly (headers, primary CTA, success moments), and everything else neutral. The user is a non-technical business owner, so each screen has one obvious next action.

## Tokens (defined once in /app/src/theme/tokens.ts; tailwind.config.js reads them from there)
- Brand: primary #4F46E5 (indigo), primary-2 #3B82F6 (blue), brand gradient 135° #3B82F6 → #6366F1 → #7C3AED. These are placeholders until the client's brand brief colours arrive, so keep them in tokens only.
- Neutrals: slate scale. Background light #F8FAFC / dark #0B1020. Surface light #FFFFFF / dark #121933.
- Semantic: success #16A34A, warning #D97706, danger #DC2626, info #2563EB, each with a soft tint background.
- Radius: sm 8, md 12, lg 16, xl 24, full. Cards use lg; sheets and hero blocks use xl.
- Spacing: 4-pt base; screen padding 20; gap between sections 24.
- Type: Plus Jakarta Sans via @expo-google-fonts. Display 28/34 bold, Title 22/28 semibold, Heading 17/24 semibold, Body 15/22 regular, Caption 13/18 medium, Label 12/16 semibold uppercase with tracking. Always render text with the ui `Text` component and its `variant` prop.
- Elevation: soft shadows only (low opacity, large blur); in dark mode use borders instead of shadows.
- Light and dark mode, following the system setting. Classes come in pairs: `bg-surface dark:bg-surface-dark`. For colours needed in JS (icons, gradients) use `useTheme()`.

## Component library (/app/src/components/ui), built before screens use them
Button (primary gradient / secondary / ghost / destructive; sizes md/lg; loading state; haptic on press), IconButton, Card, ScreenHeader, TextField (label, helper, error, counter), TextArea, StatusChip (uploading, processing, ready, publishing, published, failed, discarded), each with its own colour and icon, HashtagEditor (chips, add/remove, max 5), VideoPreview (expo-video, 9:16 frame, rounded, tap to play/pause, mute toggle), ProgressBar, StepProgress (vertical list of pipeline stages with done/active/pending states), Skeleton (shimmer), EmptyState (icon, title, text, action), ErrorState (with Retry), Toast, BottomSheet (@gorhom/bottom-sheet), ConfirmSheet, SegmentedControl (for Hook only / Full AI), CostBadge (₹ estimate), Avatar, ListItem, Divider. Plus the base pieces they share: Text, Screen, PressableScale.

## Rules
- Icons: lucide-react-native only, 20–24 px, stroke 2. The one exception is `icon.xs` (16 px) inside chips and step dots.
- Touch targets ≥ 48 dp. Primary actions sit at the bottom of the screen within thumb reach, inside the safe area.
- Every data view handles 4 states: loading (skeleton, not a spinner), empty, error (with retry), and success.
- Motion: Reanimated. 150–250 ms ease-out, entering lists fade-in-up with 30 ms stagger, press scale 0.97. Respect "reduce motion".
- Haptics (expo-haptics): light on primary press, success on publish, error on failure.
- Text contrast meets WCAG AA in both themes. Never put text over video or a gradient without a scrim.
- Use real copy: short, friendly and specific ("Your reel is ready to review"), never lorem ipsum. Indian number formatting for ₹.
- Handle the Android back button and keyboard (KeyboardAvoidingView / keyboard-aware scroll) on every form screen.
- No inline magic numbers or colours in screens; always use tokens and ui components.
- Keep the /dev/gallery route (dev builds only) that shows every ui component in every state and both themes. Update it when you add or change a component.

## Screen patterns
- Home: greeting, then two large action cards (gradient "Post my video", outlined "Create from topic") with icon, title and one line of description, then a "Recent posts" list with a thumbnail, first line of caption, status chip and relative time.
- Processing: a StepProgress of the real pipeline stages from the post status, a friendly line that they can leave the app and will get a notification, and a "Back to home" button.
- Review: VideoPreview on top, caption TextArea with character counter, HashtagEditor, a "Regenerate caption" ghost button that opens a sheet with an optional instruction, then a sticky bottom bar with Discard (ghost) and Approve & Post (primary). Approve opens a ConfirmSheet first.
- Published: a success moment (subtle scale + check animation and a success haptic), then "Open in Instagram" and "Back to home".
- Settings: grouped list (Instagram connection with status, Brand brief, Usage this month, Logout).

## Self-check before finishing UI work
Open /dev/gallery and each changed screen in both themes. If possible, run Expo web and take Playwright screenshots of the changed screens at 412×915 for a self-review. Fix spacing, alignment and contrast problems before saying it's done.
