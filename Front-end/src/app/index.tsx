import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // Added useRouter

const AppLogo = require('../assets/images/Logo.png'); 

export default function Index() {
  const scaleValue = new Animated.Value(0.4);
  const opacityValue = new Animated.Value(0);
  const router = useRouter(); // Get router instance

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    // Animation sequence
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      SplashScreen.hideAsync().then(() => {
        // Navigate to onboarding after splash
        router.replace('/(onboarding)/OnbaordingScreen1');
      });
    });
  }, []);

  return (
    <LinearGradient colors={['#FA7622', '#E56A1F']} style={styles.container}>
      <Animated.Image
        source={AppLogo}
        style={[
          styles.logo,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          }
        ]}
        resizeMode="contain"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    // Add subtle drop shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    backgroundColor: 'white',
    borderRadius: 100,
  },
});