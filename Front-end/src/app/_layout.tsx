// app/_layout.tsx
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { UploadProvider } from '../context/UploadContext';
import { CartProvider } from '../context/CartContext';
import { NavigationProvider } from '../context/NavigationContext';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { AlertProvider } from '../context/AlertContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    // Keep splash until fonts are ready (returns null so expo splash remains)
    return null;
  }

  return (
    <NavigationProvider>
      <UploadProvider>
      <CartProvider>
        <AlertProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(onboarding)" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false, statusBarHidden: true }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(Client)/screens" options={{ headerShown: false, statusBarHidden: true }} />
          </Stack>

          <StatusBar style="auto" />
        </ThemeProvider>
        </AlertProvider>
      </CartProvider>
      </UploadProvider>
    </NavigationProvider>
  );
}
