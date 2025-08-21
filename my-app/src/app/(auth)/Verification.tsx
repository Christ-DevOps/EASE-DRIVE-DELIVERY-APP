import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Validation schema
const schema = yup.object().shape({
  code: yup.string()
    .required('Verification code is required')
    .length(6, 'Code must be 6 characters'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: yup.string()
    .required('Please confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match')
});

export default function ResetPassword() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/Quicksand-Bold.ttf'),
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { 
      code: '',
      password: '',
      confirmPassword: '' 
    }
  });

  const onSubmit = (data: { code: string; password: string }) => {
    console.log('Password reset with:', data);
    Alert.alert(
      'Password Reset',
      'Your password has been successfully updated!',
      [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
    );
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="Ffff6f" />
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter the code sent to your email and your new password</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        {/* Verification Code */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Verification Code</Text>
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder='Enter 6-digit code'
                placeholderTextColor="#888"
                style={[styles.input, errors.code && styles.inputError]}
                keyboardType="number-pad"
                maxLength={6}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.code && (
            <Text style={styles.errorText}>{errors.code.message}</Text>
          )}
        </View>

        {/* New Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder='••••••••'
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

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder='••••••••'
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

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text style={styles.submitText}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1F33",
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    backgroundColor: 'white',
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
    fontFamily: 'SpaceMono',
  },
  formContainer: {
    flex: 3,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  inputGroup: {
    marginBottom: 25,
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
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'SpaceMono',
  },
});