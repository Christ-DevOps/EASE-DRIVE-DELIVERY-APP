import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

export default function OnboardingScreen1() {
  const router = useRouter();
  const [loaded] = useFonts({
      SpaceMono: require('../../assets/fonts/Quicksand-Bold.ttf'),
    });

  const pan = useRef(new Animated.ValueXY()).current;
  
  {/* Animations Function */}
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx < -100) {
          router.push('/(onboarding)/OnboardingScreen2');
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View 
      style={[styles.container]}
      {...panResponder.panHandlers}
    >
      <LinearGradient 
        colors={['#FFFFFF', '#FFFAF5']} 
        style={styles.gradient}
      >
        {/* Animated Content */}
        <Animated.View 
          style={[styles.content, {
            transform: [{ translateX: pan.x }]
          }]}
        >
          <Image 
            source={require('../../assets/images/login-graphic.png')} 
            style={styles.image}
          />
          
          <Text style={styles.title} className='font-bold' >Welcome to <Text style={styles.brand}>Ease Drive</Text></Text>
          
          <Text style={styles.description}>
            Discover amazing food from local restaurants and get it delivered to your door in minutes
          </Text>
        </Animated.View>
        
        {/* Navigation Controls */}
        <View style={styles.controls}>
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(onboarding)/OnboardingScreen2')}
          >
            <LinearGradient
              colors={['#FF7622', '#FF5722']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30,
    paddingBottom: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'SpaceMono',
  },
  brand: {
    color: '#FF7622',
    fontFamily: 'SpaceMono'
  },
  description: {
    fontSize: 18,
    fontFamily: 'SpaceMono',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  controls: {
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#FF7622',
    width: 20,
  },
  button: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FF7622',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter_600SemiBold',
  },
});