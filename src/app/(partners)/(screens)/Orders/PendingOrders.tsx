// app/(partner)/PendingOrdersScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

type Order = {
  id: string;
  customerName: string;
  items: { name: string; quantity: number }[];
  amount: string;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'received';
  placedTime: string;
};

const PendingOrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const mockData: Order[] = [
          {
            id: '#ORD-101',
            customerName: 'John Smith',
            items: [
              { name: 'Classic Burger', quantity: 2 },
              { name: 'French Fries', quantity: 1 }
            ],
            amount: '$42.50',
            status: 'Pending',
            placedTime: '10:30 AM'
          },
          {
            id: '#ORD-102',
            customerName: 'Sarah Johnson',
            items: [
              { name: 'Margherita Pizza', quantity: 1 }
            ],
            amount: '$14.99',
            status: 'Pending',
            placedTime: '11:15 AM'
          },
          {
            id: '#ORD-103',
            customerName: 'Michael Brown',
            items: [
              { name: 'Caesar Salad', quantity: 1 },
              { name: 'Iced Tea', quantity: 2 }
            ],
            amount: '$18.75',
            status: 'Pending',
            placedTime: '12:40 PM'
          }
        ];
        
        setOrders(mockData);
      } catch (error) {
        Alert.alert('Error', 'Failed to load pending orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingOrders();
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: 'Preparing' | 'Ready') => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // In a real app, this would be an API call to update the status
    // and trigger notifications
    Alert.alert(
      'Status Updated',
      `Order ${orderId} is now ${newStatus}. Notification sent to customer${newStatus === 'Ready' ? ' and delivery team' : ''}.`,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7622" />
        <Text style={styles.loadingText}>Loading pending orders...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Pending Orders</Text>
          <Text style={styles.subtitle}>Orders awaiting preparation</Text>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="check-circle" size={60} color="#4CAF50" />
            <Text style={styles.emptyText}>No pending orders!</Text>
            <Text style={styles.emptySubtext}>All orders are being processed</Text>
          </View>
        ) : (
          orders.map((order, index) => (
            <View key={index} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderTime}>{order.placedTime}</Text>
              </View>
              
              <Text style={styles.customerName}>{order.customerName}</Text>
              
              <View style={styles.itemsContainer}>
                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.orderFooter}>
                <Text style={styles.amount}>{order.amount}</Text>
                <Text style={[styles.status, styles.pendingStatus]}>
                  {order.status}
                </Text>
              </View>
              
              <View style={styles.actionsContainer}>
                {
                    order.status == '' ?  (
                        <Text></Text>
                    ) : (
                        <TouchableOpacity 
                  style={[styles.actionButton, styles.prepareButton]}
                  onPress={() => updateOrderStatus(order.id, 'Preparing')}
                >
                  <Text style={styles.actionText}>Start Preparing</Text>
                </TouchableOpacity>
                    )
                }
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.readyButton]}
                  onPress={() => updateOrderStatus(order.id, 'Ready')}
                >
                  <Text style={styles.actionText}>Mark as Ready</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FA',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F5FA',
  },
  loadingText: {
    marginTop: 20,
    color: '#666',
    fontFamily: 'SpaceMono',
  },
  header: {
    padding: 20,
    backgroundColor: '#0A1F33',
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    color: '#FFFFFF99',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    marginTop: 5,
  },
  emptyContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    fontFamily: 'SpaceMono',
  },
  emptySubtext: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'SpaceMono',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  orderTime: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  customerName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontFamily: 'SpaceMono',
  },
  itemsContainer: {
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5FA',
  },
  itemName: {
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  itemQuantity: {
    color: '#666',
    fontFamily: 'SpaceMono',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  status: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  pendingStatus: {
    backgroundColor: '#FF9800',
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  prepareButton: {
    backgroundColor: '#FF7622',
  },
  readyButton: {
    backgroundColor: '#4CAF50',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
});

export default PendingOrdersScreen;