// src/components/OrderCard.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '@/src/types/OrderTypes';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
  onRestaurantPress: () => void;
  onTrackPress: () => void;
}

const statusColors: Record<string, string> = {
  'preparing': '#FF7622',
  'in-transit': '#4CAF50',
  'delivered': '#2196F3',
  'cancelled': '#F44336'
};

const statusText: Record<string, string> = {
  'preparing': 'Preparing',
  'in-transit': 'On the Way',
  'delivered': 'Delivered',
  'cancelled': 'Cancelled'
};

const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onPress, 
  onRestaurantPress,
  onTrackPress
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  
  {/* Animation Function executed asynchronously time when the OrderCard component is rendered */}
  useEffect(() => {
    if (order.status === 'in-transit') {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [order.status]);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Restaurant Header */}
      <View style={styles.restaurantHeader}>
        <TouchableOpacity onPress={onRestaurantPress} style={styles.restaurantImageContainer}>
          <Image 
            source={{ uri: order.restaurant.image || 'https://via.placeholder.com/60' }} 
            style={styles.restaurantImage}
          />
          <View style={styles.overlay}>
            <Ionicons name="restaurant" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>
        
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {order.restaurant.name}
          </Text>
          <Text style={styles.restaurantaddress} >
            {order.restaurant.address}📍
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { 
              backgroundColor: statusColors[order.status] 
            }]} />
            <Text style={styles.statusText}>
              {statusText[order.status]}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Order Content Items */}
      <View style={styles.itemsContainer}>
        {order.items.slice(0, 2).map((item, index) => (
          <Text key={index} style={styles.itemText}>
            • {item.quantity}x {item.name}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{order.items.length - 2} more items
          </Text>
        )}
      </View>
      
      {/* Tracking Button (Animated) */}
      {order.status === 'in-transit' && (
        <Animated.View style={[
          styles.trackButtonContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }] 
          }
        ]}>
          <TouchableOpacity 
            onPress={onTrackPress}
            style={styles.trackButton}
          >
            <Ionicons name="navigate" size={20} color="#FFF" />
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Ionicons name="time-outline" size={16} color="#777" />
          <Text style={styles.date}>{order.date}</Text>
        </View>
        <Text style={styles.amount}>{order.total} frs</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  restaurantImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F5FA',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF7622',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 600,
    color: '#333',
    marginBottom: 5,
  },
  restaurantaddress: {
    fontFamily: 'SpaceMono'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
  },
  itemsContainer: {
    marginBottom: 15,
  },
  itemText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 5,
    lineHeight: 22,
  },
  moreItems: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
    marginTop: 5,
  },
  trackButtonContainer: {
    marginBottom: 15,
  },
  trackButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  trackButtonText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 10,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 15,
    marginTop: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    marginLeft: 8,
    fontSize: 14,
    color: '#777',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});

export default OrderCard;