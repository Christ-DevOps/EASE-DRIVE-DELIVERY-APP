import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WaitingScreen from '@/src/components/WaitingScreen'

const partnerWaitingScreen = () => {
  return (
    <View>
      <WaitingScreen userType="partner" />
    </View>
  )
}

export default partnerWaitingScreen

const styles = StyleSheet.create({})