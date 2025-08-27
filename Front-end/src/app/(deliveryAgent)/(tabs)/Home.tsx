// screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Switch, 
  Text, 
  ActivityIndicator, 
  Button, 
  Badge,
  IconButton 
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { DeliveryAgentStats, Order, DeliveryAgent } from '@/src/types';
import { 
  getDeliveryStats, 
  updateAvailability, 
  getAgentProfile, 
  getAvailableOrders, 
  acceptOrder 
} from '@/src/services/api';

const HomeScreen = () => {
  const [stats, setStats] = useState<DeliveryAgentStats>({
    totalOrders: 0,
    totalEarnings: 0,
    processingOrders: 0
  });
  const [agent, setAgent] = useState<DeliveryAgent | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingOrder, setAcceptingOrder] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, agentData, ordersData] = await Promise.all([
        getDeliveryStats(),
        getAgentProfile(),
        getAvailableOrders(),
      ]);
      
      setStats(statsData);
      setAgent(agentData);
      setIsAvailable(agentData.isAvailable);
      setAvailableOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (value: boolean) => {
    try {
      setIsAvailable(value);
      await updateAvailability(value);
      await loadData(); // Refresh data to ensure consistency
    } catch (error) {
      console.error('Error updating availability:', error);
      setIsAvailable(!value);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setAcceptingOrder(orderId);
      await acceptOrder(orderId);
      await loadData(); // Refresh data after accepting order
    } catch (error) {
      console.error('Error accepting order:', error);
    } finally {
      setAcceptingOrder(null);
    }
  };

  const navigateToOrders = () => {
    router.push('/(deliveryAgent)/(tabs)/orders');
  };

  const navigateToNotifications = () => {
    // Would navigate to notifications screen
    console.log('Navigate to notifications');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF7622" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Welcome and Notifications */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.agentName}>{agent?.name || 'Delivery Agent'}</Text>
        </View>
        <TouchableOpacity onPress={navigateToNotifications} style={styles.notificationIcon}>
          <IconButton 
            icon="bell" 
            size={24} 
            iconColor="#0A1F33" 
          />
          {notifications > 0 && (
            <Badge style={styles.badge}>{notifications}</Badge>
          )}
        </TouchableOpacity>
      </View>

      {/* Availability Toggle */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.availabilityContainer}>
            <View>
              <Text style={styles.availabilityLabel}>Availability Status</Text>
              <Text style={styles.availabilityText}>
                {isAvailable ? 'You\'re available for orders' : 'You\'re not available for orders'}
              </Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={handleToggleAvailability}
              color="#FF7622"
            />
          </View>
        </Card.Content>
      </Card>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        {/* Total Orders Card */}
        <Card style={[styles.statCard, { backgroundColor: '#2E86DE' }]} onPress={()=> router.push('/(deliveryAgent)/(tabs)/orders')} >
          <Card.Content style={styles.statContent}>
            <IconButton 
              icon="clipboard-list" 
              size={24} 
              iconColor="#FFF" 
              style={styles.statIcon}
            />
            <Text style={styles.statNumber}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </Card.Content>
        </Card>

        {/* Available Orders Card */}
        <Card style={[styles.statCard, { backgroundColor: '#10AC84' }]}>
          <Card.Content style={styles.statContent}>
            <IconButton 
              icon="package-variant" 
              size={24} 
              iconColor="#FFF" 
              style={styles.statIcon}
            />
            <Text style={styles.statNumber}>{availableOrders.length}</Text>
            <Text style={styles.statLabel}>Available Orders</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.statsRow}>
        {/* Ratings Card */}
        <Card style={[styles.statCard, { backgroundColor: '#F9A826' }]}>
          <Card.Content style={styles.statContent}>
            <IconButton 
              icon="star" 
              size={24} 
              iconColor="#FFF" 
              style={styles.statIcon}
            />
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Your Rating</Text>
          </Card.Content>
        </Card>

        {/* Earnings Card */}
        <Card style={[styles.statCard, { backgroundColor: '#FF7622' }]}>
          <Card.Content style={styles.statContent}>
            <IconButton 
              icon="cash" 
              size={24} 
              iconColor="#FFF" 
              style={styles.statIcon}
            />
            <Text style={styles.statNumber}>${stats.totalEarnings.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Available Orders Section */}
      {isAvailable && availableOrders.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title style={styles.sectionTitle}>Available Orders</Title>
              <Button 
                mode="text" 
                onPress={navigateToOrders}
                style={styles.viewAllButton}
                labelStyle={styles.viewAllLabel}
              >
                View All
              </Button>
            </View>
            
            {availableOrders.slice(0, 3).map(order => (
              <Card key={order.id} style={styles.orderCard} mode="outlined">
                <Card.Content>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
                      <Text style={styles.customerName}>{order.customerName}</Text>
                    </View>
                    <Text style={styles.orderAmount}>${order.totalAmount.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.orderDetails}>
                    <View style={styles.orderDetail}>
                      <IconButton icon="store" size={16} iconColor="#6C757D" />
                      <Text style={styles.orderDetailText}>{order.PartnerAdress.PartnerName}</Text>
                    </View>
                    
                    <View style={styles.orderDetail}>
                      <IconButton icon="map-marker" size={16} iconColor="#6C757D" />
                      <Text style={styles.orderDetailText}>
                        {Math.round(calculateDistance(
                          order.PartnerAdress.latitude, 
                          order.PartnerAdress.longitude,
                          order.deliveryLocation.latitude,
                          order.deliveryLocation.longitude
                        ) * 10) / 10} km away
                      </Text>
                    </View>
                  </View>
                  
                  <Button 
                    mode="contained" 
                    onPress={() => handleAcceptOrder(order.id)}
                    loading={acceptingOrder === order.id}
                    disabled={acceptingOrder !== null}
                    style={styles.acceptButton}
                    labelStyle={styles.acceptButtonLabel}
                  >
                    Accept Order
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </Card.Content>
        </Card>
      )}

      {isAvailable && availableOrders.length === 0 && (
        <Card style={styles.card}>
          <Card.Content style={styles.emptyState}>
            <IconButton icon="package-variant-closed" size={40} iconColor="#6C757D" />
            <Text style={styles.emptyStateText}>No available orders at the moment</Text>
            <Text style={styles.emptyStateSubtext}>New orders will appear here when they're ready</Text>
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <View style={styles.actionsRow}>
            <Button 
              mode="outlined" 
              onPress={navigateToOrders}
              style={styles.actionButton}
              icon="clipboard-list"
              contentStyle={styles.actionButtonContent}
            >
              My Orders
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => router.push('/(deliveryAgent)/(tabs)/Profile')}
              style={styles.actionButton}
              icon="account"
              contentStyle={styles.actionButtonContent}
            >
              Profile
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Button 
        mode="outlined" 
        onPress={loadData}
        style={styles.refreshButton}
        icon="refresh"
        contentStyle={styles.refreshButtonContent}
      >
        Refresh Data
      </Button>
    </ScrollView>
  );
};

// Helper function to calculate distance between two coordinates (simplified)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  // Simplified calculation - in a real app, use a proper geolocation library
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 110;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcome: {
    fontSize: 16,
    color: '#6C757D',
  },
  agentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A1F33',
  },
  notificationIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF7622',
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: 16,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A1F33',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    margin: 0,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A1F33',
  },
  viewAllButton: {
    minWidth: 0,
  },
  viewAllLabel: {
    fontSize: 12,
    color: '#FF7622',
  },
  orderCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A1F33',
  },
  customerName: {
    fontSize: 14,
    color: '#6C757D',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A1F33',
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderDetailText: {
    fontSize: 12,
    color: '#6C757D',
    marginLeft: -8,
  },
  acceptButton: {
    borderRadius: 8,
    backgroundColor: '#FF7622',
  },
  acceptButtonLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A1F33',
    marginTop: 8,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    borderRadius: 8,
    borderColor: '#0A1F33',
  },
  actionButtonContent: {
    flexDirection: 'column',
    height: 80,
  },
  refreshButton: {
    borderRadius: 8,
    borderColor: '#0A1F33',
    marginBottom: 24,
  },
  refreshButtonContent: {
    height: 48,
  },
});

export default HomeScreen;