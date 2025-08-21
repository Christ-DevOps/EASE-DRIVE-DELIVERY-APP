import React, { useState } from 'react'
import { 
  Button, 
  Image,
  Platform, 
  KeyboardAvoidingView, 
  Pressable, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // ADD THIS IMPORT
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import { usePredefinedAlerts } from '../../hooks/AlertHook'; // Ensure this import is correct
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import  CheckBox  from '@/src/components/CheckBox'; // Ensure this import is correct
import * as yup from 'yup';

//
const SUCCESS_IMAGE = 'https://cdn-icons-png.flaticon.com/512/190/190411.png';

const LoginSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Invalid Email'),
  password: yup.string()
    .required('Password required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number'),
})

type FormData = {
  email: string,
  password: string,
}

const Login = () => {
  const router = useRouter();
  const { loginSuccess } = usePredefinedAlerts();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/Quicksand-Bold.ttf'),
  });

  const [showPassword, setShowPassword] = useState(false);

  {/* Toggle Visibility of Both Password fields and Confirm Password */}
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { control, handleSubmit, formState: {errors, isSubmitting} } = useForm<FormData>({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call to your backend
      console.log('Form submitted:', { ...data });
      
      // Show success alert
      loginSuccess(SUCCESS_IMAGE);
    } catch (error) {
      Alert.alert(
        'Error',
        'Login failed. Please check your credentials.',
        [{ text: 'OK' }]
      );
    }
  };

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          
          {/* NEW GRADIENT HEADER */}
          <View style={styles.gradientHeader}>
            <LinearGradient
              colors={['#FF7622', '#FF9A56', '#FFB366']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              {/* Decorative elements - login themed */}
              <View style={styles.decorativeContainer}>
                <Ionicons name="shield-checkmark" size={40} color="rgba(255,255,255,0.3)" style={styles.icon1} />
                <Ionicons name="person-circle" size={45} color="rgba(255,255,255,0.2)" style={styles.icon2} />
                <Ionicons name="lock-closed" size={35} color="rgba(255,255,255,0.25)" style={styles.icon3} />
                <Ionicons name="phone-portrait" size={30} color="rgba(255,255,255,0.2)" style={styles.icon4} />
              </View>
              
              {/* Back button and title */}
              <View style={styles.headerContent}>
                <Pressable style={styles.backButtonGradient} onPress={() => router.push('/(onboarding)/OnboardingScreen2')}>
                  <Ionicons name="arrow-back" size={24} color="white"  />
                </Pressable>
                <View style={styles.titleContainer}>
                  <Text style={styles.mainTitle}>Welcome Back!</Text>
                  <Text style={styles.subtitle}>Please login to continue</Text>
                </View>
              </View>

            </LinearGradient>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail" size={20} color="#888" style={styles.inputIcon} />
                    <TextInput
                      placeholder="john.doe@gmail.com"
                      placeholderTextColor="#888"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[
                        styles.input,
                        errors.email && styles.inputError
                      ]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={20} color="#888" style={styles.inputIcon} />
                    <TextInput
                      placeholder="••••••••"
                      placeholderTextColor="#888"
                      style={[
                        styles.passwordInput,
                        errors.password && styles.inputError
                      ]}
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon}
                      onPress={togglePasswordVisibility}
                    >
                      <MaterialIcons 
                        name={showPassword ? "visibility-off" : "visibility"} 
                        size={24} 
                        color="#888" 
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}  
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.forgotPassword}>
              <View style={styles.checkboxContainer}>
                <CheckBox label='Remember Me' />
              </View>
              <Pressable onPress={() => router.push('/(auth)/ForgotPassword')}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitText}>Log In</Text>
              )}
            </TouchableOpacity>

            {/* Signup Prompt */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <Link href="/(auth)/Signup" asChild>
                <Pressable>
                  <Text style={styles.signupLink}> SIGN UP</Text>
                </Pressable>
              </Link>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Media Login */}
            <View style={styles.socialMedia}>
              <TouchableOpacity style={styles.socialContainer}>
                <Image 
                  source={require('../../assets/images/google.png')} 
                  style={styles.socialIcons} 
                  alt='Google login' 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialContainer}>
                <Image 
                  source={require('../../assets/images/apple.png')} 
                  style={styles.socialIcons} 
                  alt='Apple login' 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialContainer}>
                <Image 
                  source={require('../../assets/images/twitter.png')} 
                  style={styles.socialIcons} 
                  alt='Twitter login' 
                />
              </TouchableOpacity>
            </View>

            {/* Quick Navigation - Remove this in production */}
            <TouchableOpacity 
              onPress={() => router.replace('/(Client)/(tabs)')} 
              style={styles.quickNavButton}
            >
              <Text style={styles.quickNavText}>Quick Access to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1F33",
  },

  // NEW GRADIENT HEADER STYLES
  gradientHeader: {
    height: 320,
    position: 'relative',
  },
  gradientBackground: {
    flex: 1,
    paddingTop: 50, // Account for status bar
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  icon1: {
    position: 'absolute',
    top: 30,
    right: 40,
    transform: [{ rotate: '15deg' }],
  },
  icon2: {
    position: 'absolute',
    top: 80,
    left: 30,
    transform: [{ rotate: '-10deg' }],
  },
  icon3: {
    position: 'absolute',
    top: 120,
    right: 25,
    transform: [{ rotate: '20deg' }],
  },
  icon4: {
    position: 'absolute',
    top: 160,
    left: 60,
    transform: [{ rotate: '-15deg' }],
  },
  headerContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButtonGradient: {
    backgroundColor: '#1E1E2E',
    borderRadius: 50,
    padding: 12,
    marginRight: 30,
  },
  titleContainer: {
    flex: 1,
    paddingTop: 8,
  },
  mainTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginTop: 6,
    fontFamily: 'SpaceMono',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    fontFamily: 'SpaceMono',
  },

  // REMOVE THESE OLD STYLES:
  // header: { ... },
  // backButton: { ... },
  // title: { ... },

  form: {
    flex: 6,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
    marginTop: -20, // Creates overlap with gradient
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 15,
    fontFamily: 'SpaceMono',
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F0F5FA",
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  inputIcon: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontFamily: 'SpaceMono',
    color: '#333',
  },
  eyeIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontFamily: 'SpaceMono',
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'SpaceMono',
  },
  forgotPassword: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginBottom: 25,
    marginVertical: 10
  },
  checkboxContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotText: {
    color: '#FF7622',
    fontFamily: 'SpaceMono',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: "#FF7622",
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#FF7622',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'SpaceMono',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signupText: {
    color: '#666',
    fontFamily: 'SpaceMono',
  },
  signupLink: {
    color: '#FF7622',
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },

  // ENHANCED DIVIDER
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },

  // ENHANCED SOCIAL MEDIA SECTION
  socialMedia: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  socialContainer: {
    borderColor: '#E5E7EB',
    borderWidth: 2,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialIcons: {
    height: 32,
    width: 32,
  },

  // QUICK NAV BUTTON (Remove in production)
  quickNavButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  quickNavText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
});