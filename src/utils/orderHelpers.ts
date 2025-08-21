import { Order, OrderStatus } from '../types/OrderTypes';

/**
 * Groups orders by status into active and past orders
 * Active: 'preparing' or 'in-transit'
 * Past: 'delivered'
 */
export const groupOrdersByStatus = (orders: Order[]): {
  activeOrders: Order[];
  pastOrders: Order[];
} => {
  const activeOrders: Order[] = [];
  const pastOrders: Order[] = [];

  orders.forEach(order => {
    if (order.status === 'preparing' || order.status === 'in-transit') {
      activeOrders.push(order);
    } else if (order.status === 'delivered') {
      pastOrders.push(order);
    }
  });

  // Sort orders by date (most recent first)
  const sortByDate = (a: Order, b: Order) => 
    new Date(b.date).getTime() - new Date(a.date).getTime();
  
  activeOrders.sort(sortByDate);
  pastOrders.sort(sortByDate);

  return { activeOrders, pastOrders };
};

/**
 * Formats order date to a readable string
 */
export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculates estimated delivery time (for active orders)
 */
export const getEstimatedDelivery = (order: Order): string => {
  if (!order.estimatedDelivery) return 'Calculating...';
  
  const deliveryTime = new Date(order.estimatedDelivery);
  const now = new Date();
  const diffMinutes = Math.floor((deliveryTime.getTime() - now.getTime()) / 60000);
  
  if (diffMinutes <= 0) return 'Arriving now';
  return `Arriving in ${diffMinutes} min`;
};