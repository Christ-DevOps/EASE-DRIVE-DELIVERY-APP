// app/(partner)/AllOrdersScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

type Order = {
  id: string;
  customerName: string;
  totalAmount: string;
  date: string;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
};

const TotalOrdesScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const mockData: Order[] = [
        //   { id: '#ORD-101', customerName: 'John Smith', totalAmount: '$42.50', date: '2023-06-15', status: 'Delivered' },
        //   { id: '#ORD-102', customerName: 'Sarah Johnson', totalAmount: '$14.99', date: '2023-06-15', status: 'Delivered' },
          { id: '#ORD-103', customerName: 'Michael Brown', totalAmount: '$18.75', date: '2023-06-15', status: 'Delivered' },
          { id: '#ORD-104', customerName: 'Emily Davis', totalAmount: '$12.99', date: '2023-06-15', status: 'Preparing' },
          { id: '#ORD-105', customerName: 'David Wilson', totalAmount: '$32.50', date: '2023-06-14', status: 'Delivered' },
          { id: '#ORD-106', customerName: 'Jessica Taylor', totalAmount: '$24.99', date: '2023-06-14', status: 'Delivered' },
        //   { id: '#ORD-107', customerName: 'Robert Anderson', totalAmount: '$45.75', date: '2023-06-14', status: 'Cancelled' },
        ];
        
        setOrders(mockData);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllOrders();
  }, []);

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#4CAF50';
      case 'Preparing': return '#FF9800';
      case 'Ready': return '#2196F3';
      case 'Pending': return '#9C27B0';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7622" />
        <Text style={styles.loadingText}>Loading all orders...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>All Orders</Text>
          <Text style={styles.subtitle}>Complete order history</Text>
        </View>

        {/* Filter Bar */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {['All', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filter === status && styles.activeFilter
              ]}
              onPress={() => setFilter(status)}
            >
              <Text style={[
                styles.filterText,
                filter === status && styles.activeFilterText
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="assignment" size={60} color="#9E9E9E" />
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>There are no orders matching your filter</Text>
          </View>
        ) : (
          filteredOrders.map((order, index) => (
            <View key={index} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              
              <View style={styles.customerRow}>
                <MaterialIcons name="person" size={18} color="#666" />
                <Text style={styles.customerName}>{order.customerName}</Text>
              </View>
              
              <View style={styles.orderFooter}>
                <Text style={styles.amount}>{order.totalAmount}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
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
  filterContainer: {
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 5,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: '#FF7622',
  },
  filterText: {
    color: '#4F46E5',
    fontFamily: 'SpaceMono',
    fontWeight: '600',
  },
  activeFilterText: {
    color: 'white',
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
    marginBottom: 15,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  orderDate: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  customerName: {
    color: '#333',
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
});

export default TotalOrdesScreen;