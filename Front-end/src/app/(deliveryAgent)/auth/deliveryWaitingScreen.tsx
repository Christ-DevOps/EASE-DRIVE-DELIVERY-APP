import { StyleSheet, Text, View } from 'react-native'
import WaitingScreen from '@/src/components/WaitingScreen'
import React from 'react'

const deliveryWaitingScreen = () => {
  return (
    <View>
        
      <View>
        <WaitingScreen userType="delivery" />
        <Text>Delivery Agent</Text>
      </View>
    </View>
  )
}

export default deliveryWaitingScreen

const styles = StyleSheet.create({})