import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="OnboardingScreen1" />
      <Stack.Screen name="OnboardingScreen2" />
    </Stack>
  );
}