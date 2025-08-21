import React, { useState } from 'react'
import { Button, Image,Platform, KeyboardAvoidingView, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import CheckBox from '@/src/components/CheckBox';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


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
  },  );

      // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call to your backend
      console.log('Form submitted:', { ...data });
      
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

  return (
    <SafeAreaView className='flex-1' style={styles.container}>
      
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
     style={styles.container} >
      {/* Header Section */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FF7622" onPress={() => router.push('/(onboarding)/OnboardingScreen2')} />
        </Pressable>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back! Please login to continue</Text>
      </View>

      {/* Form Section */}
      <View style={styles.form}>
        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label} className='font-bold' >Email</Text>
          <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="John Doe@gmail.com"
                    placeholderTextColor="#888"
                    style={[
                      styles.input,
                      errors.email && styles.inputError
                    ]}
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

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}  >Password</Text>
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

        {/* Forgot Password */}
        <Pressable style={styles.forgotPassword}>
          <View style={styles.checkboxContainer} >
            <CheckBox label='Remember Me'  />
          </View>
          <Text style={styles.forgotText} onPress={()=> router.push('/(auth)/ForgotPassword')} >Forgot Password?</Text>
        </Pressable>

        {/* Submit Button */}
        <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        >
          <Text style={styles.submitText}>Log In</Text>
        </TouchableOpacity>

        {/* Signup Prompt */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Dont have an account?</Text>
          <Link href="/(auth)/Signup" asChild>
            <Pressable>
              <Text style={styles.signupLink}> SIGN UP</Text>
            </Pressable>
          </Link>
        </View>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} >
          <Text>home</Text>
        </TouchableOpacity>

        {/* Login with Social Media  */}
        <View style={styles.socialMedia} >
            <TouchableOpacity style={styles.SocialContainer} >
              <Image source={require('../../assets/images/google.png')} style={styles.SocialIcons} height={40} width={40} alt='Google image' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.SocialContainer} >
              <Image source={require('../../assets/images/apple.png')} style={styles.SocialIcons} height={40} width={40} alt='Google image' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.SocialContainer} >
              <Image source={require('../../assets/images/twitter.png')} style={styles.SocialIcons} height={40} width={40} alt='Google image' />
            </TouchableOpacity>
        </View>
      </View>
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
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 25,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'SpaceMono'
  },
  subtitle: {
    color: '#FFFFFF99',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  form: {
    flex: 2,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 30,
    paddingTop: 40,
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
  input: {
    backgroundColor: "#F0F5FA",
    padding: 15,
    borderRadius: 10,
    height: 50,
    fontSize: 18,
    fontFamily: 'SpaceMono',
    color: '#333',
  },
    inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
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
  checkbox: {
    width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#888',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
  },
  remember: {
    fontFamily: 'SpaceMono'
  },
  forgotText: {
    color: '#FF7622',
    fontFamily: 'SpaceMono',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: "#FF7622",
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 2,
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
    errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'SpaceMono',
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
  socialMedia: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  SocialContainer: {
    borderColor: '#888',
    borderWidth: 1,
    padding: 20,
    borderRadius: 50
  },
  SocialIcons: {
    height: 200,
    width: 200
  }
})