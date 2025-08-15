import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function AuthLayout() {
  
  return (
    
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left',
      }}
    >
      <Stack.Screen name="Signup" />
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="ForgotPassword" />
      <Stack.Screen name="ResetPassword" />
    </Stack>
  );
}