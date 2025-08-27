import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

export default function OnboardingScreen1() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf'),
  });

  const pan = useRef(new Animated.ValueXY()).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx < -100) {
          navigateToNextScreen();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Navigation handler function
  const navigateToNextScreen = () => {
    router.push('/OnboardingScreen2'); // Fixed route path
  };

  if (!fontsLoaded) {
    return null; // Or loading indicator
  }

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#FFFFFF', '#FFFAF5']} 
        style={styles.gradient}
      >
        {/* Swipeable Content Area */}
        <Animated.View 
          style={[styles.content, {
            transform: [{ translateX: pan.x }]
          }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/images/login-graphic.png')} 
              style={styles.image}
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Welcome to <Text style={styles.brand}>Ease Drive</Text>
            </Text>
            
            <Text style={styles.description}>
              Your journey to effortless driving begins here. Discover the easiest way to navigate, track your trips, and manage your driving experience.
            </Text>
          </View>
        </Animated.View>
        
        {/* Navigation Controls */}
        <View style={styles.controls}>
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={navigateToNextScreen} // Using navigation handler
          >
            <LinearGradient
              colors={['#FF7622', '#FF5722']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
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
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingBottom: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 40,
    shadowColor: '#FF7622',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: width * 0.85,
    height: width * 0.85,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Quicksand-Bold',
    lineHeight: 40,
  },
  brand: {
    color: '#FF7622',
  },
  description: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
  controls: {
    alignItems: 'center',
    width: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    alignItems: 'center',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    letterSpacing: 0.5,
  },
});