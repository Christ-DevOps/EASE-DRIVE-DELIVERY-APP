import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen2() {
  const router = useRouter();
  
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
  }, []);

  // Direct navigation handlers
  const goBack = () => router.push('/(onboarding)/OnbaordingScreen1');
  const goNext = () => router.push('/(onboarding)/OnboardingScreen3');

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#FFFFFF', '#FFFAF5']} 
        style={styles.gradient}
      >
        {/* Content */}
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/images/login-graphic.png')} 
              style={[styles.image, { width: width * 0.8, height: width * 0.8 }]}
            />
          </View>
          
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
        </View>
        
        {/* Navigation Controls */}
        <Animated.View style={[
          styles.controls,
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
          <View style={styles.indicatorContainer}>
            <View style={styles.indicator} />
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.backButton]}
              onPress={goBack}
            >
              <Text style={[styles.buttonText, styles.backButtonText]}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.nextButton]}
              onPress={goNext}
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
        </Animated.View>
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
    paddingTop: height * 0.05,
    paddingBottom: height * 0.07,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: height * 0.03,
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
  title: {
    fontSize: width * 0.08,
    color: '#333',
    textAlign: 'center',
    marginBottom: height * 0.02,
    fontFamily: 'SpaceMono',
    lineHeight: width * 0.1,
    maxWidth: '90%',
  },
  description: {
    fontSize: width * 0.045,
    fontFamily: 'SpaceMono',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: width * 0.1,
    lineHeight: width * 0.06,
    maxWidth: '90%',
  },
  controls: {
    alignItems: 'center',
    width: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.04,
    justifyContent: 'center',
  },
  indicator: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: '#E0E0E0',
    marginHorizontal: width * 0.01,
  },
  activeIndicator: {
    backgroundColor: '#FF7622',
    width: width * 0.05,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: width * 0.05,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FF7622',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    minWidth: width * 0.35,
  },
  backButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FF7622',
  },
  nextButton: {
    flex: 1,
    marginLeft: width * 0.04,
  },
  buttonGradient: {
    paddingVertical: height * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: width * 0.045,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
    color: 'white',
  },
  backButtonText: {
    color: '#FF7622',
    paddingVertical: height * 0.015,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: width * 0.045,
  },
});