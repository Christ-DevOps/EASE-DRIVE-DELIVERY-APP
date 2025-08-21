// app/(partner)/home.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Types
type Order = {
  id: string;
  time: string;
  items: number;
  amount: string;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
  customerName: string;
  date: string;
};

type Review = {
  id: string;
  username: string;
  comment: string;
  rating: number;
  date: string;
};

type MenuItem = {
  id: string;
  name: string;
  ordersToday: number;
};

type Stats = {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: string;
  newReviews: number;
};

const HomeScreen = () => {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulated API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Fetch stats
        const statsData: Stats = {
          totalOrders: 0,
          pendingOrders: 0,
          totalRevenue: '$0',
          newReviews: 0,
        };
        
        // Fetch recent orders
        const ordersData: Order[] = [
          { id: '#ORD-001', time: '10:30 AM', items: 3, amount: '$42.50', status: 'Preparing', customerName: 'John Smith', date: '2023-06-15' },
          { id: '#ORD-002', time: '11:15 AM', items: 2, amount: '$28.00', status: 'Ready', customerName: 'Sarah Johnson', date: '2023-06-15' },
          { id: '#ORD-003', time: '12:40 PM', items: 5, amount: '$65.75', status: 'Delivered', customerName: 'Michael Brown', date: '2023-06-15' },
          { id: '#ORD-004', time: '1:20 PM', items: 1, amount: '$12.99', status: 'Preparing', customerName: 'Emily Davis', date: '2023-06-15' },
        ];
        
        // Fetch popular items
        const popularItemsData: MenuItem[] = [
          { id: '1', name: 'Classic Burger', ordersToday: 24 },
          { id: '2', name: 'Pepperoni Pizza', ordersToday: 18 },
          { id: '3', name: 'Caesar Salad', ordersToday: 12 },
          { id: '4', name: 'Chocolate Cake', ordersToday: 9 },
        ];
        
        setStats(statsData);
        setRecentOrders(ordersData);
        setPopularItems(popularItemsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const statsData = [
    { label: 'Total Orders', value: stats?.totalOrders || '0', icon: 'shopping-cart' },
    { label: 'Pending Orders', value: stats?.pendingOrders || '0', icon: 'hourglass-empty' },
    { label: 'Total Revenue', value: stats?.totalRevenue || '$0', icon: 'attach-money' },
    { label: 'New Reviews', value: stats?.newReviews || '0', icon: 'rate-review' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7622" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.name}>Delicious Foods Inc.</Text>
          </View>
          <TouchableOpacity style={styles.notification}>
            <MaterialIcons name="notifications" size={28} color="#FF7622" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {statsData.map((stat, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.statCard}
              onPress={() => {
                if (index === 0) router.push('/(partners)/(screens)/Orders/TotalOrders');
                if (index === 1) router.push('/(partners)/(screens)/Orders/PendingOrders');
                if (index === 3) router.push('/(partners)/(screens)/UserReviews/Reviews');
              }}
            >
              <View style={styles.statIcon}>
                <MaterialIcons name={stat.icon} size={24} color="#FF7622" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/(partners)/(screens)/Orders/TotalOrders')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ordersContainer}>
            {recentOrders.map((order, index) => (
              <View key={index} style={styles.orderCard}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderTime}>{order.time}</Text>
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderItems}>{order.items} items</Text>
                  <Text style={styles.orderAmount}>{order.amount}</Text>
                </View>
                <View style={[styles.orderStatus, 
                  { backgroundColor: 
                    order.status === 'Delivered' ? '#4CAF50' : 
                    order.status === 'Ready' ? '#FFC107' : 
                    order.status === 'Cancelled' ? '#F44336' : '#FF7622' 
                  }]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Popular Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Items</Text>
            <TouchableOpacity onPress={() => router.push('/(partners)/(tabs)/Menu')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.popularContainer}>
            {popularItems.slice(0, 2).map((item, index) => (
              <View key={index} style={styles.popularCard}>
                <Image 
                  source={require('@/src/assets/images/login-graphic.png')} 
                  style={styles.popularImage}
                />
                <View style={styles.popularInfo}>
                  <Text style={styles.popularName}>{item.name}</Text>
                  <Text style={styles.popularOrders}>{item.ordersToday} orders today</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FA',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0A1F33',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    color: '#FFFFFF99',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  name: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  notification: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  statIcon: {
    backgroundColor: '#FFF0E6',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  statLabel: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 15,
    padding: 20,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  seeAll: {
    color: '#FF7622',
    fontFamily: 'SpaceMono',
    fontWeight: '600',
  },
  ordersContainer: {
    marginTop: 10,
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5FA',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  orderTime: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    marginTop: 5,
  },
  orderDetails: {
    alignItems: 'flex-end',
  },
  orderItems: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono',
    marginTop: 5,
  },
  orderStatus: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  popularContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  popularCard: {
    width: '48%',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F0F5FA',
  },
  popularImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  popularInfo: {
    padding: 10,
  },
  popularName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  popularOrders: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    marginTop: 5,
  },
});

export default HomeScreen;