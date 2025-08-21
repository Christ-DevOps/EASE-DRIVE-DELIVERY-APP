import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type OrderConfirmationScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'OrderConfirmation'>;
  route: { params: { orderTotal: string } };
};

const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({ 
  navigation,
  route 
}) => {
  const orderTotal = route.params?.orderTotal || '0.00';
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/success.png')} 
          style={styles.image}
        />
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.message}>
          Your order has been placed successfully
        </Text>
        <Text style={styles.total}>Total: ${orderTotal}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Continue Shopping</Text>
        <Ionicons name="arrow-forward" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    marginTop: 50,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  total: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FF7622',
  },
  button: {
    backgroundColor: '#FF7622',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 15,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
    marginRight: 10,
  },
});

export default OrderConfirmationScreen;