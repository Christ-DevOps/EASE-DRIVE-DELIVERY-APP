import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getRestaurantById } from '@/src/services/databaseService';
import { Restaurant, Meal } from '@/src/types';
import MealCard from '@/src/components/client/Meal';
import { useCart } from '@/src/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import ImageCarousel from '@/src/components/ImageCarousel';

const RestaurantDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const restaurant = getRestaurantById(id as string);
  const { dispatch } = useCart();

  if (!restaurant) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Restaurant not found</Text>
      </View>
    );
  }

  const handleAddToCart = (item: Meal) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurantName: restaurant.name,
        quantity: 1
      }
    });
  };

  return (
    <View style={styles.container} >
      {/* Restaurant Header Image */}
      <ImageCarousel images={restaurant.image} />
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      
      {/* Restaurant Info */}
      <View style={styles.infoContainer}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }} ><Text style={styles.name} className='text-center' >{restaurant.name}</Text></View>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.ratingText}>{restaurant.rating}</Text>
          <Text style={styles.ratingCount}>(250+ ratings)</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={20} color="#FF7622" />
            <Text style={styles.detailText}>{restaurant.location}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#FF7622" />
            <Text style={styles.detailText}>{restaurant.deliveryTime}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="pricetag-outline" size={20} color="#FF7622" />
            <Text style={styles.detailText}>{restaurant.deliveryFee}</Text>
          </View>
        </View>
        
        <Text style={styles.description}>
          {restaurant.description}
        </Text>
        
        <Text style={styles.sectionTitle}>Menu Items</Text>
      </View>
      
      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {restaurant.menu?.map(item => (
          <MealCard 
            key={item.id} 
            item={item} 
            onAddToCart={handleAddToCart} 
          />
        ))}
      </View>
      
      {/* View Cart Button */}
      <TouchableOpacity 
        style={styles.viewCartButton}
        onPress={() => router.push('/ViewCart')}
      >
        <Text style={styles.viewCartText}>View Cart</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  restaurantImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#333',
  },
  infoContainer: {
    padding: 20,
    fontFamily: 'SpaceMono'
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 5,
    color: '#333',
  },
  ratingCount: {
    fontSize: 14,
    color: '#888',
    marginLeft: 10,
    fontFamily: 'SpaceMono'
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
    
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    minWidth: '30%',
  },
  detailText: {
    marginLeft: 5,
    fontSize: 15,
    color: '#666',
    fontFamily: 'SpaceMono'
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: 'SpaceMono'
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  viewCartButton: {
    backgroundColor: '#FF7622',
    padding: 15,
    margin: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCartText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RestaurantDetailScreen;