// Login.tsx
import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CheckBox from '@/src/components/CheckBox';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
});

type FormData = {
  email: string,
  password: string,
};

// ---- CONFIG: set this before testing ----
// If you're developing locally with Expo:
// - Android emulator (default Android emulator): use "http://10.0.2.2:5000"
// - iOS simulator: "http://localhost:5000"
// - Physical device: use your computer LAN IP e.g. "http://192.168.1.50:5000"
// If deployed, set the HTTPS URL: "https://api.yourdomain.com"
const API_BASE_URL = __DEV__ ? 'http://192.168.100.54:5000' : 'https://your-production-api.com';
// Replace the path below if your backend login route differs
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`; // <-- adjust if needed

const Login = () => {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/Quicksand-Bold.ttf'),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // local loading for API call

  const togglePasswordVisibility = () => setShowPassword(v => !v);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Helper: show friendly alert
  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  // Submit handler that calls backend
  const onSubmit = async (data: FormData) => {
    setLoading(true);

    // Abort controller to implement timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s

    try {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      });

      clearTimeout(timeout);

      if (!res.ok) {
        // try to parse body for message
        let errBody = null;
        try { errBody = await res.json(); } catch (e) { /* ignore */ }

        if (res.status === 401 || res.status === 400) {
          const msg = errBody?.message || 'Invalid credentials';
          showAlert('Login failed', msg);
        } else {
          const msg = errBody?.message || 'Unexpected server error';
          showAlert('Server error', msg);
        }
        setLoading(false);
        return;
      }

      const body = await res.json();
      // Expecting { token, user, ... } from your backend
      const token = body.token || body.accessToken;
      const user = body.user || null;

      if (!token) {
        showAlert('Login error', 'No token returned from server.');
        setLoading(false);
        return;
      }

      // Persist token & user
      await AsyncStorage.setItem('token', token);
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }

      // Navigate to main app (adjust route to your app)
      router.replace('/(Client)/(tabs)');

    } catch (err: any) {
      // Distinguish common errors
      if (err.name === 'AbortError') {
        showAlert('Timeout', 'Request timed out. Try again or check your network.');
      } else if (err.message && err.message.includes('Network request failed')) {
        // Very common in Expo -> wrong host/IP
        showAlert(
          'Network Error',
          `Cannot reach the server. If you're running the backend locally, ensure API_BASE_URL is your computer's LAN IP and that the backend is running. On Android emulator use 10.0.2.2.`
        );
      } else {
        showAlert('Error', err.message || 'An unknown error occurred.');
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
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
          <View style={styles.gradientHeader}>
            <LinearGradient
              colors={['#FF7622', '#FF9A56', '#FFB366']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              <View style={styles.decorativeContainer}>
                <Ionicons name="shield-checkmark" size={40} color="rgba(255,255,255,0.3)" style={styles.icon1} />
                <Ionicons name="person-circle" size={45} color="rgba(255,255,255,0.2)" style={styles.icon2} />
                <Ionicons name="lock-closed" size={35} color="rgba(255,255,255,0.25)" style={styles.icon3} />
                <Ionicons name="phone-portrait" size={30} color="rgba(255,255,255,0.2)" style={styles.icon4} />
              </View>

              <View style={styles.headerContent}>
                <Pressable style={styles.backButtonGradient} onPress={() => router.push('/(onboarding)/OnboardingScreen2')}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <View style={styles.titleContainer}>
                  <Text style={styles.mainTitle}>Welcome Back!</Text>   
                  <Text style={styles.subtitle}>Please login to continue</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.form}>
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

            <View style={styles.forgotPassword}>
              <View style={styles.checkboxContainer}>
                <CheckBox label='Remember Me' />
              </View>
              <Pressable onPress={() => router.push('/(auth)/ForgotPassword')}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (isSubmitting || loading) && { opacity: 0.7 }]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || loading}
            >
              {(isSubmitting || loading) ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitText}>Log In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <Link href="/(auth)/Signup" asChild>
                <Pressable>
                  <Text style={styles.signupLink}> SIGN UP</Text>
                </Pressable>
              </Link>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialMedia}>
              <TouchableOpacity style={styles.socialContainer}>
                <Image
                  source={require('../../assets/images/google.png')}
                  style={styles.socialIcons}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialContainer}>
                <Image
                  source={require('../../assets/images/apple.png')}
                  style={styles.socialIcons}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialContainer}>
                <Image
                  source={require('../../assets/images/twitter.png')}
                  style={styles.socialIcons}
                />
              </TouchableOpacity>
            </View>

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
  );
};

export default Login;

// NOTE: your styles unchanged; copy them from your original file below:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: "#0A1F33",
  },
  gradientHeader: {
    height: 320,
    position: 'relative',
  },
  gradientBackground: {
    flex: 1,
    paddingTop: 50,
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
  form: {
    flex: 6,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
    marginTop: -20,
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
