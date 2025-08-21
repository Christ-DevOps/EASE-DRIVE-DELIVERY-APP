import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Button, Title, ActivityIndicator, Card, Paragraph, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Order } from '@/src/types';
import { getOrderById, updateOrderStatus } from '@/src/services/api';

export default function TrackingScreen() {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{
    latitude: number;
    longitude: number;
  }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch the order details by orderId
      // For now, we'll use mock data from our API service
      const orderData = await getOrderById(orderId as string);
      setOrder(orderData);
      simulateLocationTracking(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateLocationTracking = (order: Order) => {
    // Simulate getting current location (in a real app, use device GPS)
    const mockCurrentLocation = {
      latitude: order.PartnerAdress.latitude + (Math.random() - 0.5) * 0.01,
      longitude: order.PartnerAdress.longitude + (Math.random() - 0.5) * 0.01,
    };
    
    setCurrentLocation(mockCurrentLocation);
    
    // Simulate route coordinates (in a real app, use a directions service)
    const mockRoute = [
      mockCurrentLocation,
      order.deliveryLocation,
    ];
    
    setRouteCoordinates(mockRoute);
  };

  const handleMarkDelivered = async () => {
    try {
      setUpdating(true);
      if (order) {
        await updateOrderStatus(order.id, 'delivered');
        router.back();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatCoordinates = (coords: { latitude: number; longitude: number }) => {
    return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
  };

  if (loading || !order) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF7622" />
        <Title style={styles.loadingText}>Loading order details...</Title>
      </View>
    );
  }

  // Calculate map region that includes both pickup and delivery locations
  const mapRegion = {
    latitude: (order.PartnerAdress.latitude + order.deliveryLocation.latitude) / 2,
    longitude: (order.PartnerAdress.longitude + order.deliveryLocation.longitude) / 2,
    latitudeDelta: Math.abs(order.PartnerAdress.latitude - order.deliveryLocation.latitude) * 2.5,
    longitudeDelta: Math.abs(order.PartnerAdress.longitude - order.deliveryLocation.longitude) * 2.5,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        showsUserLocation={true}
        showsCompass={true}
        showsTraffic={true}
      >
        {/* Restaurant/Pickup Marker */}
        <Marker
          coordinate={order.PartnerAdress}
          title="Pickup Location"
          description={order.PartnerAdress.PartnerName}
          pinColor="#2E86DE" // Blue for pickup
        />
        
        {/* Delivery Location Marker */}
        <Marker
          coordinate={order.deliveryLocation}
          title="Delivery Location"
          description={order.customerName}
          pinColor="#FF7622" // Orange for delivery
        />
        
        {/* Current Location Marker (if available) */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            pinColor="#4CAF50" // Green for current location
          />
        )}
        
        {/* Route from current location to delivery location */}
        {currentLocation && routeCoordinates && (
          <Polyline
            coordinates={[currentLocation, order.deliveryLocation]}
            strokeColor="#FF7622"
            strokeWidth={4}
          />
        )}
      </MapView>
      
      {/* Order Details Card */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Title style={styles.orderTitle}>Order #{order.id.slice(-6)}</Title>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Customer:</Text>
            <Text style={styles.value}>{order.customerName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{order.customerPhone}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Restaurant:</Text>
            <Text style={styles.value}>{order.PartnerAdress.PartnerName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Pickup Location:</Text>
            <Text style={styles.value}>{formatCoordinates(order.PartnerAdress)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Delivery Location:</Text>
            <Text style={styles.value}>{formatCoordinates(order.deliveryLocation)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>${order.totalAmount.toFixed(2)}</Text>
          </View>
        </Card.Content>
      </Card>
      
      {/* Action Buttons */}
      <View style={styles.controls}>
        <Button 
          mode="contained" 
          onPress={handleMarkDelivered}
          loading={updating}
          disabled={updating}
          style={styles.deliverButton}
          labelStyle={styles.buttonLabel}
        >
          Mark as Delivered
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={() => router.back()}
          style={styles.backButton}
          labelStyle={styles.buttonLabel}
        >
          Back to Orders
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    color: '#0A1F33',
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  detailsCard: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 5,
    maxHeight: '40%',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A1F33',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#0A1F33',
    fontSize: 12,
  },
  value: {
    color: '#6C757D',
    fontSize: 12,
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
    maxWidth: '60%',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'column',
  },
  deliverButton: {
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FF7622',
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: '#FF7622',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});