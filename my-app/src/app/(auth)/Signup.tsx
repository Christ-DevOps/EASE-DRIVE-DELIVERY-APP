import { KeyboardAvoidingView,Platform,  SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useFonts } from 'expo-font';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


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
  }, );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  {/* Toggle Visibility of Both Password fields and Confirm Password */}
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
      
      // In a real app, this would be an API call to your backend
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



  const [userType, setUserType] = React.useState<'individual' | 'partner'>('individual');
  
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/Quicksand-Bold.ttf'),
  });

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container} >
        {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#FF7622" />
        </TouchableOpacity>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Please sign up to get started</Text>
      </View>

      {/* Scrollable Form Section */}
      <View style={styles.formContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* User Type Selection */}
          {/* <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'individual' && styles.activeUserType
              ]}
              onPress={() => setUserType('individual')}
            >
              <Text style={[
                styles.userTypeText,
                userType === 'individual' && styles.activeUserTypeText
              ]}>
                Individual
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'partner' && styles.activeUserType
              ]}
              onPress={() => setUserType('partner')}
            >
              <Text style={[
                styles.userTypeText,
                userType === 'partner' && styles.activeUserTypeText
              ]}>
                Partner
              </Text>
            </TouchableOpacity>
          </View> */}

          {/* Name and Phone in Single Row */}
          <View style={styles.doubleInputContainer}>
            <View style={styles.halfInputGroup}>
              <Text style={styles.label}>Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="John Doe"
                    placeholderTextColor="#888"
                    style={[
                      styles.input,
                      errors.name && styles.inputError
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
               {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>
            
            <View style={styles.halfInputGroup}>
              <Text style={styles.label}>Phone</Text>
                            <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="+1 234 567 890"
                    placeholderTextColor="#888"
                    style={[
                      styles.input,
                      errors.phone && styles.inputError
                    ]}
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone.message}</Text>
              )}
            </View>
          </View>

          {/* Individual Fields */}

          {/* Email Field here */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="john@example.com"
                  placeholderTextColor="#888"
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
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

            {/* Password Field here */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.passwordContainer}>
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

            {/* Confirm Password Field Here */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Re-Type Password</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#888"
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
                      size={24} 
                      color="#888" 
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
            )}
          </View>


          {/* Submit Button */}
          <TouchableOpacity 
            style={[
              styles.submitButton,
              isSubmitting && styles.submittingButton
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitText}>Creating Account...</Text>
            ) : (
              <Text style={styles.submitText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Social Media Signup */}
          <View style={styles.socialContainer}>
            <Text style={styles.socialText}>Or sign up with</Text>
            
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="google" size={24} color="#DB4437" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="apple" size={24} color="black" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="twitter" size={24} color="#1DA1F2" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Additional space at bottom for scrolling */}
          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1F33",
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 10,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#FFFFFF99',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  formContainer: {
    flex: 2.5,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 20,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F0F5FA',
    borderRadius: 10,
    padding: 5,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeUserType: {
    backgroundColor: '#FF7622',
  },
  userTypeText: {
    fontFamily: 'SpaceMono',
    fontWeight: '600',
    color: '#666',
  },
  activeUserTypeText: {
    color: 'white',
  },
  doubleInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInputGroup: {
    width: '48%',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 8,
    fontSize: 15,
    fontFamily: 'SpaceMono',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    backgroundColor: "#F0F5FA",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'SpaceMono',
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F0F5FA",
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontFamily: 'SpaceMono',
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'SpaceMono',
  },
  submitButton: {
    backgroundColor: "#FF7622",
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
    elevation: 2,
  },
  submittingButton: {
    backgroundColor: '#E56A1F',
    opacity: 0.8,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'SpaceMono',
  },
  socialContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  socialText: {
    color: '#666',
    fontFamily: 'SpaceMono',
    marginBottom: 15,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});