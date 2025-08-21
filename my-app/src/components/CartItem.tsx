import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { CartItems } from '../context/CartContext';

type CartItemProps = {
  item: CartItems;
};

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { dispatch } = useCart();
  
  const updateQuantity = (quantity: number) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { id: item.id, quantity } 
    });
  };
  
  const removeItem = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: item.id });
  };
  
  return (
    <View style={styles.container}>
      <Image source={item.image} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        {item.restaurantName && (
          <Text style={styles.restaurant} numberOfLines={1}>
            {item.restaurantName}
          </Text>
        )}
        <Text style={styles.price}>{item.price}</Text>
      </View>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          onPress={() => updateQuantity(item.quantity - 1)}
          style={styles.quantityButton}
        >
          <Ionicons name="remove" size={16} color="#FF7622" />
        </TouchableOpacity>
        
        <Text style={styles.quantity}>{item.quantity}</Text>
        
        <TouchableOpacity 
          onPress={() => updateQuantity(item.quantity + 1)}
          style={styles.quantityButton}
        >
          <Ionicons name="add" size={16} color="#FF7622" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        onPress={removeItem}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  restaurant: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontWeight: '700',
    fontSize: 16,
    color: '#FF7622',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityButton: {
    backgroundColor: '#FFF8F2',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 10,
    fontWeight: '600',
    fontSize: 16,
  },
  removeButton: {
    padding: 8,
  },
});

export default CartItem;