import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/src/context/CartContext';
import CartItem from '@/src/components/CartItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/src/navigation/types';
import { router, useRouter } from 'expo-router';

type CartScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Cart'>;
};

// small helper to safely format numbers
const safeToFixed = (value: unknown, decimals = 2, fallback = '0.00') => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return n.toFixed(decimals);
};

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const Route = useRouter();
  const { state, dispatch } = useCart();
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Defensive defaults: ensure numeric subtotal even if state.total is null/undefined
  const subtotal = Number(state?.total ?? 0);
  const deliveryFee = 2.99;
  const taxRate = 0.08;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + deliveryFee + taxAmount;

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' });
      setIsProcessing(false);
      router.push({
        pathname: '/(Client)/(screens)/Success/PaymentSuccessful',
        params: { orderTotal: String(totalAmount) } // make sure we pass string
      })
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Header with symmetric design */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => Route.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Cart</Text>
        </View>

        <TouchableOpacity
          onPress={() => dispatch({ type: 'CLEAR_CART' })}
          style={styles.headerButton}
        >
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {(!state?.items || state.items.length === 0) ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('@/src/assets/icons/empty-state.png')}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Looks like you have not added anything to your cart yet
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => Route.push('/')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollContainer}>
            {state.items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{safeToFixed(subtotal, 2)} frs</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>{safeToFixed(deliveryFee, 2)} frs</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax ({(taxRate * 100).toFixed(0)}%)</Text>
                <Text style={styles.summaryValue}>{safeToFixed(taxAmount, 2)} frs</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{safeToFixed(totalAmount, 2)} frs</Text>
              </View>
            </View>

          </ScrollView>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.checkoutButtonText}>
                Place Order Now
              </Text>
            )}
          </TouchableOpacity>

        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 0
  },
  // Enhanced Header Styles
  header: {
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'flex-end',
    backgroundColor: '#FF7622',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  clearButton: {
    color: '#FFF',
    fontWeight: '600',
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
  },
  emptyContainer: {
    flex: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#FFF',
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    fontFamily: 'SpaceMono',
  },
  shopButton: {
    backgroundColor: '#FF7622',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  shopButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  summaryContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  summaryValue: {
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 15,
  },
  totalLabel: {
    fontWeight: '700',
    fontSize: 18,
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  totalValue: {
    fontWeight: '700',
    fontSize: 18,
    color: '#FF7622',
    fontFamily: 'SpaceMono',
  },
  checkoutButton: {
    backgroundColor: '#FF7622',
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 15,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#FF7622',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'SpaceMono',
  },
});

export default CartScreen;
