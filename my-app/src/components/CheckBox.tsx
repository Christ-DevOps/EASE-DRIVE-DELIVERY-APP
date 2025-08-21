import { StyleSheet, Text,TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

interface Label{
    label: string
}

const CheckBox = ({ label }: Label) => {

    const [isRemember, setIsRemember] = useState(false);
    const handleRemember =() => {
        setIsRemember(!isRemember);
    }

  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={handleRemember} >
      <View style={styles.checkbox} >
        {isRemember && <Text style={styles.check} >✓</Text>}
      </View>
      <Text style={styles.remember} >{label}</Text> 
    </TouchableOpacity>
  )
}

export default CheckBox

const styles = StyleSheet.create({
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
  check:{
    textAlign: 'center',
    backgroundColor: '#FF7622',
    paddingHorizontal: 3,
    paddingBottom: 1.5,
    width: '100%',
    color: 'white',
  },
   remember: {
    fontFamily: 'SpaceMono'
  },
})