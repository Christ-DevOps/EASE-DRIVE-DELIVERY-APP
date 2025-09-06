import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WaitingScreen from '@/src/components/WaitingScreen'

const partnerWaitingScreen = () => {
  return (
    <View style={styles.container} >
      <WaitingScreen userType="partner" />
    </View>
  )
}

export default partnerWaitingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})