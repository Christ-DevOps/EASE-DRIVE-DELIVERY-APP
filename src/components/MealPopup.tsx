import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { Meal, Restaurant } from '@/src/types';
import { getRestaurantById } from '@/src/services/databaseService';
import { router } from 'expo-router';
import { CartProvider } from '../context/CartContext';

type MenuItemPopupProps = {
  visible: boolean;
  item: Meal | null;
  onClose: () => void;
  addToCart: (item: Meal) => void;
};

const { width } = Dimensions.get('window');


const MenuItemPopup = ({ visible, item, onClose, addToCart }: MenuItemPopupProps) => {
  if (!item) return null;
  
  const restaurant = item.restaurantId ? getRestaurantById(item.restaurantId) : null;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropTransitionOutTiming={0}
      style={styles.modal}
      animationIn="zoomIn"
      animationOut="zoomOut"

    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <Image 
          source={item.image} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="pricetag-outline" size={18} color="#FF7622" />
              <Text style={styles.detailText}>{item.price} frs</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={styles.detailText}>{item.rating}</Text>
            </View>
          </View>
          
          {restaurant && (
            <TouchableOpacity 
              style={styles.restaurantLink}
              onPress={() => {
                onClose();
                router.push({
                  pathname: '/(Client)/(screens)/resto/restaurantDetails',
                  params: { id: restaurant.id }
                });
              }}
            >
              <Text style={styles.restaurantLinkText}>
                View at {restaurant.name}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FF7622" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.addButton} onPress={addToCart} >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    width: width * 0.9,
    maxWidth: 400,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  restaurantLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    marginBottom: 20,
  },
  restaurantLinkText: {
    fontSize: 16,
    color: '#FF7622',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#FF7622',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MenuItemPopup;