import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Order } from '@/src/types';
import { getActiveOrders, updateOrderStatus } from '@/src/services/api';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const activeOrders = await getActiveOrders();
      setOrders(activeOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      setUpdating(orderId);
      await updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const formatLocation = (location: { latitude: number; longitude: number }) => {
    return `Lat: ${location.latitude.toFixed(4)}, Long: ${location.longitude.toFixed(4)}`;
  };

  const renderOrderActions = (order: Order) => {
    switch (order.status) {
      case 'Ready':
        return (
          <Button 
            mode="contained" 
            onPress={() => handleUpdateStatus(order.id, 'picked_up')}
            loading={updating === order.id}
            disabled={updating !== null}
            style={styles.actionButton}
            labelStyle={styles.buttonLabel}
          >
            Mark as Picked Up
          </Button>
        );
      case 'picked_up':
        return (
          <View style={styles.actionRow}>
            <Button 
              mode="outlined" 
              onPress={() => router.push({
                pathname: '/(deliveryAgent)/(screens)/delivery/TrackingScreen',
                params: { orderId: order.id }
              })}
              style={[styles.actionButton, styles.trackButton]}
              labelStyle={styles.buttonLabel}
            >
              Track Delivery
            </Button>
            <Button 
              mode="contained" 
              onPress={() => handleUpdateStatus(order.id, 'delivered')}
              loading={updating === order.id}
              disabled={updating !== null}
              style={styles.actionButton}
              labelStyle={styles.buttonLabel}
            >
              Mark as Delivered
            </Button>
          </View>
        );
      case 'delivered':
        return (
          <Button 
            mode="contained" 
            onPress={() => handleUpdateStatus(order.id, 'received')}
            loading={updating === order.id}
            disabled={updating !== null}
            style={styles.actionButton}
            labelStyle={styles.buttonLabel}
          >
            Confirm Received
          </Button>
        );
      default:
        return (
          <Text style={styles.waitingText}>
            Order is being prepared. Please wait...
          </Text>
        );
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Ready': return '#28a745';
      case 'picked_up': return '#ffc107';
      case 'delivered': return '#17a2b8';
      case 'received': return '#6c757d';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF7622" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Active Orders</Title>
      
      {orders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.noOrders}>No active orders</Text>
        </View>
      ) : (
        orders.map(order => (
          <Card key={order.id} style={styles.card}>
            <Card.Content>
              <View style={styles.orderHeader}>
                <Title style={styles.orderTitle}>Order #{order.id.slice(-6)}</Title>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>{order.status.replace('_', ' ')}</Text>
                </View>
              </View>
              
              <Paragraph style={styles.orderDetail}>
                <Text style={styles.label}>Customer:</Text> {order.customerName}
              </Paragraph>
              <Paragraph style={styles.orderDetail}>
                <Text style={styles.label}>Phone:</Text> {order.customerPhone}
              </Paragraph>
              <Paragraph style={styles.orderDetail}>
                <Text style={styles.label}>Restaurant:</Text> {order.PartnerAdress.PartnerName}
              </Paragraph>
              <Paragraph style={styles.orderDetail}>
                <Text style={styles.label}>Pickup Location:</Text> {formatLocation(order.PartnerAdress)}
              </Paragraph>
              <Paragraph style={styles.orderDetail}>
                <Text style={styles.label}>Delivery Location:</Text> {formatLocation(order.deliveryLocation)}
              </Paragraph>
              <Paragraph style={styles.orderDetail}>
                <Text style={styles.label}>Total Amount:</Text> ${order.totalAmount.toFixed(2)}
              </Paragraph>
              
              <View style={styles.actionsContainer}>
                {renderOrderActions(order)}
              </View>
            </Card.Content>
          </Card>
        ))
      )}
      
      <Button 
        mode="outlined" 
        onPress={loadOrders}
        style={styles.refreshButton}
        icon="refresh"
      >
        Refresh Orders
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#0A1F33',
  },
  noOrders: {
    fontSize: 16,
    color: '#6C757D',
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A1F33',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetail: {
    marginBottom: 5,
    fontSize: 14,
  },
  label: {
    fontWeight: 'bold',
    color: '#0A1F33',
  },
  actionsContainer: {
    marginTop: 15,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderRadius: 8,
  },
  trackButton: {
    borderColor: '#FF7622',
  },
  buttonLabel: {
    fontSize: 12,
  },
  waitingText: {
    textAlign: 'center',
    color: '#6C757D',
    fontStyle: 'italic',
    marginVertical: 10,
  },
  refreshButton: {
    margin: 15,
    borderRadius: 8,
  },
});