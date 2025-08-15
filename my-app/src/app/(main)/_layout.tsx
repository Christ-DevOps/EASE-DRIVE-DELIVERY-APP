import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { NavigationProvider } from '@/src/context/NavigationContext'

const MainLayout = () => {
  return (
    <NavigationProvider>
        <Stack
    screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name="favorites/index" />
        <Stack.Screen name="location/access" />
      <Stack.Screen name="notifications/index" />
      <Stack.Screen name="Orders/ConfirmDelivery" />
      <Stack.Screen name="Payment/ChoosePaymentMethod" />
      <Stack.Screen name="Profile/EditAddress" />
      <Stack.Screen name="Profile/EditProfile" />
      <Stack.Screen name="Profile/ViewPersonalInfo" />
      <Stack.Screen name="restaurant/[id]" />
      <Stack.Screen name="restaurant/Meal/[id]" />
      <Stack.Screen name="reviews/index" />
      <Stack.Screen name="Success/LoginSuccessful" />
      <Stack.Screen name="Success/PaymentSuccessful" />
      <Stack.Screen name="Success/SignupSuccessful" />
    </Stack>
    </NavigationProvider>
    
  )
}

export default MainLayout

const styles = StyleSheet.create({})