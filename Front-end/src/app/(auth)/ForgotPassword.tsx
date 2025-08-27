import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Ionicons } from '@expo/vector-icons';

// Validation schema
const schema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format')
});

export default function ForgotPassword() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/Quicksand-Bold.ttf'),
  });
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '' }
  });

  const onSubmit = (data: { email: string }) => {
    console.log('Password reset requested for:', data.email);
    Alert.alert(
      'Reset Email Sent',
      `We've sent password reset instructions to ${data.email}`,
      [{ text: 'OK', onPress: () => router.push('/(auth)/reset-password') }]
    );
  };

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#Ff6f6" style={styles.arrow} />
        </TouchableOpacity>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your email to reset your password</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter Your Email:</Text>
              <TextInput
                placeholder='example@gmail.com'
                placeholderTextColor="#888"
                style={[styles.input, errors.email && styles.inputError]}
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity 
          style={styles.submitButton}
        //   onPress={handleSubmit(onSubmit)}
        onPress={()=> router.push('/Verification')}
          disabled={isSubmitting}
        >
          <Text style={styles.submitText}>
            {isSubmitting ? 'Sending...' : 'Send Code'}
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
    top: 40,
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
    marginBottom: 15,
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