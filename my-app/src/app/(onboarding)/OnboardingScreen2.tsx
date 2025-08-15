import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Animated, Dimensions, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function OnboardingScreen2() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(1);
  const pan = useRef(new Animated.ValueXY()).current;
  
  // Create swipe animation values
  const swipeAnim = useRef(new Animated.Value(0)).current;
  
  // Create fade animations
  const titleAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  
  // Initialize animations on component mount
  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(titleAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true
        }),
        Animated.spring(descAnim, {
          toValue: 1,
          friction: 8,
          delay: 100,
          useNativeDriver: true
        }),
        Animated.spring(buttonAnim, {
          toValue: 1,
          friction: 8,
          delay: 200,
          useNativeDriver: true
        })
      ])
    ]).start();
    
    // Pulse animation for the image
    Animated.loop(
      Animated.sequence([
        Animated.timing(swipeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true
        }),
        Animated.timing(swipeAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  // Create pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        pan.x.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > width * 0.25 || Math.abs(gestureState.vx) > 0.5) {
          // Swipe right (go back)
          if (gestureState.dx > 0) {
            Animated.timing(pan.x, {
              toValue: width,
              duration: 300,
              useNativeDriver: true
            }).start(() => router.replace('/'));
          } 
          // Swipe left (go to login)
          else {
            Animated.timing(pan.x, {
              toValue: -width,
              duration: 300,
              useNativeDriver: true
            }).start(() => router.push('/(auth)/LoginScreen'));
          }
        } else {
          // Return to original position
          Animated.spring(pan.x, {
            toValue: 0,
            friction: 10,
            useNativeDriver: true
          }).start();
        }
      }
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { 
            transform: [
              { translateX: pan.x },
              { 
                scale: swipeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.03]
                }) 
              }
            ] 
          }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Animated Image */}
        <Animated.View style={[
          styles.imageContainer,
          { 
            transform: [{
              translateY: swipeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10]
              })
            }]
          }
        ]}>
          <Image 
            source={require('../../assets/images/restaurants/restaurant.jpg')} 
            style={styles.image}
          />
        </Animated.View>
        
        {/* Title with fade animation */}
        <Animated.Text style={[
          styles.title,
          { 
            opacity: titleAnim,
            transform: [{
              translateY: titleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }
        ]}>
          Connect with Others
        </Animated.Text>
        
        {/* Description with fade animation */}
        <Animated.Text style={[
          styles.description,
          { 
            opacity: descAnim,
            transform: [{
              translateY: descAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }
        ]}>
          Join our community and share your experiences with people around the world
        </Animated.Text>
        
        {/* Buttons with fade animation */}
        <Animated.View style={[
          styles.buttonContainer,
          { 
            opacity: buttonAnim,
            transform: [{
              translateY: buttonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0]
              })
            }]
          }
        ]}> 
                  {/* Progress Indicators */}
        <View style={styles.indicatorContainer}>
          <View style={styles.indicator} />
          <View style={[styles.indicator, styles.activeIndicator]} />
        </View>

        {/* The Buttons at the bottom of onboarding 2 page */}
        <View style={styles.Buttons} >
                        <TouchableOpacity 
            style={[styles.button, styles.backButton]}
            onPress={() => {
              Animated.timing(pan.x, {
                toValue: width,
                duration: 300,
                useNativeDriver: true
              }).start(() => router.back());
            }}
          >
            <Text style={[styles.buttonText, styles.backButtonText]}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.nextButton]}
            onPress={() => {
              Animated.timing(pan.x, {
                toValue: -width,
                duration: 200,
                useNativeDriver: true
              }).start(() => router.push('/LoginScreen'));
            }}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
        </Animated.View>
        
      </Animated.View>
      
      {/* Swipe Hint */}
      <Animated.Text style={[
        styles.swipeHint,
        { opacity: swipeAnim }
      ]}>
        Swipe to continue →
      </Animated.Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 30,
    paddingBottom: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#FF7622',
    borderRadius: 50,
    marginBottom: 40,
    elevation: 10,
    shadowColor: '#FF7622',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  image: {
    width: 280,
    height: 310,
    resizeMode: 'contain',
    borderRadius: 20
  },
  title: {
    fontSize: 32,
    color: '#0A1F33',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'SpaceMono'
  },
  description: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 26,
    fontFamily: 'SpaceMono',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  Buttons:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 20,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FF7622',
  },
  nextButton: {
    backgroundColor: '#FF7622',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    color: 'white'
  },
  backButtonText: {
    color: '#FF7622',
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
  swipeHint: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    color: '#FF7622',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  }
});