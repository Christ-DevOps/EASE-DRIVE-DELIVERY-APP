import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';

const SplashScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after delay
    const timer = setTimeout(() => {
      navigation.navigate('RoleSelect');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Logo */}
      <Animated.View style={[
        styles.logoContainer,
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }] 
        }
      ]}>
        <Image 
          source={require('../assets/images/Logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </Animated.View>
      
      {/* App Name */}
      <Animated.Text style={[
        styles.appName,
        { opacity: fadeAnim }
      ]}>
        Ease Drive
      </Animated.Text>
      
      {/* Tagline */}
      <Animated.Text style={[
        styles.tagline,
        { opacity: fadeAnim }
      ]}>
        Delivering Local Flavors
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 180,

  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#114B5F',
    marginTop: 10,
    letterSpacing: 1.2,
  },
  tagline: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default SplashScreen;