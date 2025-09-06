import { StyleSheet, Text, View } from 'react-native'
import WaitingScreen from '@/src/components/WaitingScreen'
import React from 'react'

const deliveryWaitingScreen = () => {
  return (
    <View style={styles.container}>
      <WaitingScreen userType="delivery" />
    </View>
  )
}

export default deliveryWaitingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Add background color
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  }
})