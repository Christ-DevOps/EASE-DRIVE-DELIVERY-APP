// app/(main)/payment/PaymentSuccessPage.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface OrderDetails {
  orderId: string;
  estimatedDelivery: string;
  address: string;
  totalAmount: FlatArray<number, any>;
  restaurantName: string;
  rating: number;
  cuisineType: string;
}

type Props = {
  orderDetails?: OrderDetails;
};

export default function PaymentSuccessPage({ 
  orderDetails = {
    orderId: '#ORD-2024-0816',
    estimatedDelivery: '25-30 minutes',
    address: '123 Main Street, Apt 4B',
    totalAmount: 5500,
    restaurantName: "Mario's Italian Kitchen",
    rating: 4.8,
    cuisineType: 'Italian Cuisine'
  }
}: Props) {
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(40)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Staggered animation sequence
    Animated.sequence([
      // Checkmark animation
      Animated.spring(checkmarkScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      // Content fade in
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Cards animation
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Buttons animation
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleTrackOrder = () => {
    router.push('/(Client)/(screens)/Orders/ConfirmDelivery');
  };

  const handleBackHome = () => {
    router.push('/(Client)/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDF4" />
      
      {/* Success Animation */}
      <View style={styles.successSection}>
        <Animated.View
          style={[
            styles.checkmarkContainer,
            {
              transform: [{ scale: checkmarkScale }]
            }
          ]}
        >
          <Ionicons name="checkmark-circle" size={80} color="#22C55E" />
        </Animated.View>
        
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }]
            }
          ]}
        >
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.subtitle}>
            Your order has been confirmed and is being prepared
          </Text>
        </Animated.View>
      </View>

      {/* Order Details Card */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }]
          }
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Confirmed</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialIcons name="receipt" size={20} color="#9CA3AF" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>{orderDetails.orderId}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={20} color="#9CA3AF" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Delivery Address</Text>
              <Text style={styles.detailValue}>{orderDetails.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalAmount}>{orderDetails.totalAmount} frs</Text>
        </View>
      </Animated.View>


      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.buttonsContainer,
          {
            opacity: buttonsOpacity,
            transform: [{ translateY: buttonsTranslateY }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleTrackOrder}
          activeOpacity={0.8}
        >
          <Ionicons name="time-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Track Your Order</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBackHome}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={20} color="#374151" />
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4', // Light green gradient effect
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  
  successSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  
  checkmarkContainer: {
    marginBottom: 20,
  },
  
  titleContainer: {
    alignItems: 'center',
  },
  
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  
  statusText: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '500',
  },
  
  detailsContainer: {
    marginBottom: 20,
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  
  detailLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16A34A',
  },
  
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  restaurantIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FF7622',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  restaurantEmoji: {
    fontSize: 24,
  },
  
  restaurantDetails: {
    flex: 1,
  },
  
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  
  separator: {
    color: '#D1D5DB',
    marginHorizontal: 8,
  },
  
  cuisineText: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  
  primaryButton: {
    backgroundColor: '#FF7622',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#FF7622',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  
  secondaryButton: {
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});