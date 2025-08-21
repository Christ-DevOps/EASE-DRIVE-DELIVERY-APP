import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type CartIconProps = {
  onPress: ()=> void
};

const CartIcon: React.FC<CartIconProps> = ({ onPress }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { getTotalQuantity } = useCart();
  const totalItems = getTotalQuantity();
  
  return (
    <TouchableOpacity 
      style={styles.cartIcon} 
      onPress={onPress}
    >
      <Ionicons name="cart-outline" size={24} color="white" />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cartIcon: {
    position: 'relative',
    backgroundColor: '#181C2E',
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: 4,
    backgroundColor: '#FF7622',
    borderRadius: 15,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CartIcon;