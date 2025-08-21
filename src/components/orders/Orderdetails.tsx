// src/components/OrderDetailsModal.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../../types/OrderTypes';

interface DetailsModalProps {
  order: Order;
  onClose: () => void;
}

const Orderdetails: React.FC<DetailsModalProps> = ({ order, onClose }) => {
  const statusColors: Record<string, string> = {
    'Preparing': '#FF7622',
    'On the way': '#4CAF50',
    'Delivered': '#2196F3',
    'Cancelled': '#F44336'
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="#FFF" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Order Details</Text>
      
      <View style={styles.restaurantHeader}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' }} 
          style={styles.icon}
        />
        <Text style={styles.restaurant}>{order.restaurant.name}</Text>
        <Text style={styles.restaurant}>{order.restaurant.address}</Text>
      </View>
      
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { 
          backgroundColor: statusColors[order.status] + '22' 
        }]}>
          <Text style={[styles.statusText, { color: statusColors[order.status] }]}>
            {order.status}
          </Text>
        </View>
        <Text style={styles.estimatedTime}>Estimated: {order.estimatedTime}</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Order Items</Text>
      <View style={styles.items}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.summary}>
        {/* <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{order.amount}</Text>
        </View> */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>0.00frs</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{order.total}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  closeButton: {
    position: 'absolute',
    top: -50,
    right: 0,
    backgroundColor: '#FF7622',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  restaurant: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  estimatedTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  items: {
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemName: {
    fontSize: 16,
    color: '#555',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  summary: {
    backgroundColor: '#F0F5FA',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#777',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF7622',
  },
});

export default Orderdetails;