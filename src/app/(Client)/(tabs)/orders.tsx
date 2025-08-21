// src/screens/OrdersScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  Modal,
  Animated,
  TouchableOpacity,
  Image
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import OrderCard from '@/src/components/orders/OrderCard';
import OrderTrackingModal from '@/src/components/orders/OrderTracking';
import OrderDetailsModal from '@/src/components/orders/Orderdetails';
import { Order } from '@/src/types/OrderTypes';
import { fetchOrders } from '@/src/utils/FetchOrder';

const OrdersScreen = () => {
  const [activeCategory, setActiveCategory] = useState('Active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [trackingMode, setTrackingMode] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const fetchOrderData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterOrders = (category: string, ordersList = orders) => {
    const filtered = ordersList.filter(order => order.statusType === category);
    setFilteredOrders(filtered);
  };

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
    filterOrders(category);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrderData();
  };

  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setTrackingMode(order.status === 'in-transit');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
    
    setModalVisible(true);
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      setModalVisible(false);
      setSelectedOrder(null);
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4555/4555971.png' }} 
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>No {activeCategory} Orders</Text>
      <Text style={styles.emptyText}>
        You don't have any {activeCategory.toLowerCase()} orders at the moment
      </Text>
    </View>
  );

  useEffect(() => {
    fetchOrderData();
  }, []);

  const handleRestaurantPress = (restaurantId: string) => {
    navigation.navigate('ViewRestaurant', { restaurantId });
  };

  const handleTrackPress = (orderId: string) => {
    navigation.navigate('OrderTracking', { orderId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <TouchableOpacity style={styles.filterButton}>
            <FontAwesome5 name="filter" size={18} color="#FF7622" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        {['Active', 'Completed', 'Cancelled'].map((category) => (
          <TouchableOpacity 
            key={category}
            style={[
              styles.tabButton, 
              activeCategory === category && styles.activeTab
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={[
              styles.tabText,
              activeCategory === category && styles.activeTabText
            ]}>
              {category}
            </Text>
            {activeCategory === category && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7622" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => 
            <OrderCard 
            order={item}
            onPress={() => handleOrderPress(item)}
            onRestaurantPress={() => handleRestaurantPress(item.restaurant.id)}
            onTrackPress={() => handleTrackPress(item.id)}  />
        }

          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#FF7622']}
              tintColor="#FF7622"
            />
          }
        />
      )}
      
      {/* Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.modalBackground} 
            activeOpacity={1}
            onPress={closeModal}
          />
          
          <View style={styles.modalContent}>
            {trackingMode && selectedOrder ? (
              <OrderTrackingModal order={selectedOrder} onClose={closeModal} />
            ) : selectedOrder ? (
              <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
            ) : null}
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FA',
  },
  header: {
    backgroundColor: '#FF7622',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#FF762211',
    borderRadius: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#777',
  },
  activeTabText: {
    color: '#FF7622',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 5,
    height: 3,
    width: '60%',
    backgroundColor: '#FF7622',
    borderRadius: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 50,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    maxWidth: 300,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FF7622',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '90%',
  },
});

export default OrdersScreen;