import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as yup from 'yup';

const { width, height } = Dimensions.get('window');

// Form validation schema
const signupSchema = yup.object().shape({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: yup.string()
    .required('Phone is required')
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number (E.164 format)'),
  email: yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: yup.string()
    .required('Please confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match')
});

type FormData = {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {
  const router = useRouter();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'partner'>('individual');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', { ...data, userType });
      
      Alert.alert(
        'Account Created',
        'Your account has been successfully created!',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/LoginScreen') }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to create account. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/Quicksand-Bold.ttf'),
  });

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0A1F33', '#1A2F4A', '#2A3F5A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header Section with Enhanced Styling */}
          <View style={styles.header}>
            {/* Back Button with Gradient Background */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <LinearGradient
                colors={['rgba(255, 118, 34, 0.2)', 'rgba(255, 118, 34, 0.1)']}
                style={styles.backButtonGradient}
              >
                <Ionicons name="arrow-back" size={24} color="#FF7622" />
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join us and start your journey</Text>
              
              {/* Decorative Elements */}
              <View style={styles.decorativeContainer}>
                <View style={styles.decorativeDot} />
                <View style={styles.decorativeLine} />
                <View style={styles.decorativeDot} />
              </View>
            </View>
          </View>

          {/* Form Container with Glass Effect */}
          <View style={styles.formContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.98)']}
              style={styles.formGradient}
            >
              <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >


                {/* Name and Phone in Single Row */}
                <View style={styles.doubleInputContainer}>
                  <View style={styles.halfInputGroup}>
                    <Text style={styles.label}>
                      <MaterialIcons name="person-outline" size={16} color="#FF7622" /> Name
                    </Text>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                          <TextInput
                            placeholder="John Doe"
                            placeholderTextColor="#999"
                            style={[
                              styles.input,
                              errors.name && styles.inputError
                            ]}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        </View>
                      )}
                    />
                    {errors.name && (
                      <Text style={styles.errorText}>{errors.name.message}</Text>
                    )}
                  </View>
                  
                  <View style={styles.halfInputGroup}>
                    <Text style={styles.label}>
                      <MaterialIcons name="phone" size={16} color="#FF7622" /> Phone
                    </Text>
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                          <TextInput
                            placeholder="+237 694567890"
                            placeholderTextColor="#999"
                            style={[
                              styles.input,
                              errors.phone && styles.inputError
                            ]}
                            keyboardType="phone-pad"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        </View>
                      )}
                    />
                    {errors.phone && (
                      <Text style={styles.errorText}>{errors.phone.message}</Text>
                    )}
                  </View>
                </View>

                {/* Email Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <MaterialIcons name="email" size={16} color="#FF7622" /> Email
                  </Text>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputWrapper}>
                        <TextInput
                          placeholder="john@example.com"
                          placeholderTextColor="#999"
                          style={[
                            styles.input,
                            errors.email && styles.inputError
                          ]}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
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

                {/* Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <MaterialIcons name="lock-outline" size={16} color="#FF7622" /> Password
                  </Text>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.passwordWrapper}>
                        <View style={styles.passwordContainer}>
                          <TextInput
                            placeholder="••••••••"
                            placeholderTextColor="#999"
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
                              size={22} 
                              color="#FF7622" 
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password.message}</Text>
                  )}  
                </View>

                {/* Confirm Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <MaterialIcons name="lock" size={16} color="#FF7622" /> Confirm Password
                  </Text>
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.passwordWrapper}>
                        <View style={styles.passwordContainer}>
                          <TextInput
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            style={[
                              styles.passwordInput,
                              errors.confirmPassword && styles.inputError
                            ]}
                            secureTextEntry={!showConfirmPassword}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                          <TouchableOpacity 
                            style={styles.eyeIcon}
                            onPress={toggleConfirmPasswordVisibility}
                          >
                            <MaterialIcons 
                              name={showConfirmPassword ? "visibility-off" : "visibility"} 
                              size={22} 
                              color="#FF7622" 
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                  )}
                </View>

                {/* Submit Button with Gradient */}
                <TouchableOpacity 
                  style={styles.submitButtonContainer}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={isSubmitting 
                      ? ['#E56A1F', '#CC5A15'] 
                      : ['#FF7622', '#FF8A42', '#FFA162']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitButton}
                  >
                    {isSubmitting ? (
                      <View style={styles.loadingContainer}>
                        <MaterialIcons name="hourglass-empty" size={20} color="white" />
                        <Text style={styles.submitText}>Creating Account...</Text>
                      </View>
                    ) : (
                      <View style={styles.submitContent}>
                        <Text style={styles.submitText}>Sign Up</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="white" />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Partner Section with Enhanced Styling */}
                <TouchableOpacity 
                  style={styles.partnerContainer} 
                  onPress={() => router.push('/(auth)/SignupType')}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255, 118, 34, 0.1)', 'rgba(255, 118, 34, 0.05)']}
                    style={styles.partnerGradient}
                  >
                    <MaterialIcons name="handshake" size={24} color="#FF7622" />
                    <Text style={styles.partnerText}>Partner with Us</Text>
                    <MaterialIcons name="arrow-forward-ios" size={16} color="#FF7622" />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Terms and Privacy */}
                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    By signing up, you agree to our{' '}
                    <Text style={styles.linkText}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.linkText}>Privacy Policy</Text>
                  </Text>
                </View>
                
                {/* Additional space at bottom for scrolling */}
                <View style={{ height: 40 }} />
              </ScrollView>
            </LinearGradient>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Signup;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 25,
    zIndex: 10,
  },
  backButtonGradient: {
    borderRadius: 25,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 118, 34, 0.3)',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'SpaceMono',
  },
  decorativeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF7622',
  },
  decorativeLine: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255, 118, 34, 0.5)',
    marginHorizontal: 10,
  },
  formContainer: {
    flex: 2.2,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  formGradient: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 35,
    paddingBottom: 20,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    backgroundColor: 'rgba(240, 245, 250, 0.7)',
    borderRadius: 15,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userTypeButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  userTypeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  activeUserType: {
    // Handled by gradient
  },
  userTypeText: {
    fontFamily: 'SpaceMono',
    fontWeight: '600',
    color: '#666',
    fontSize: 14,
  },
  activeUserTypeText: {
    color: 'white',
  },
  doubleInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  halfInputGroup: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 15,
    fontFamily: 'SpaceMono',
    fontWeight: '600',
    color: '#2C3E50',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: "rgba(240, 245, 250, 0.8)",
    padding: 16,
    borderRadius: 15,
    fontSize: 16,
    fontFamily: 'SpaceMono',
    color: '#2C3E50',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 118, 34, 0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  passwordWrapper: {
    position: 'relative',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(240, 245, 250, 0.8)",
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 118, 34, 0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: 'SpaceMono',
    color: '#2C3E50',
  },
  eyeIcon: {
    padding: 12,
    marginRight: 4,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 6,
    fontFamily: 'SpaceMono',
    fontWeight: '500',
  },
  submitButtonContainer: {
    marginTop: 25,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#FF7622',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButton: {
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'SpaceMono',
  },
  partnerContainer: {
    marginTop: 25,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 118, 34, 0.2)',
  },
  partnerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  partnerText: {
    color: '#FF7622',
    fontFamily: 'SpaceMono',
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    fontFamily: 'SpaceMono',
    lineHeight: 18,
  },
  linkText: {
    color: '#FF7622',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});