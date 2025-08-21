import { string } from "yup";

export type OrderStatus = 'preparing' | 'in-transit' | 'delivered' | 'received';
export type OrderStatusType = 'Active' | 'Completed' | 'Cancelled';

export interface MenuItem {
    id: string,
    name: string,
    price: number,
    quantity: number
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  image?: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  contact: string;
  vehicle: string;
  rating: number;
  currentLocation: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
}

export interface Order {
  id: string;
  date: string; // ISO string
  status: OrderStatus;
  statusType: OrderStatusType;
  total: number;
  restaurant: Restaurant;
  deliveryAgent: DeliveryAgent;
  deliveryAddress: string;
   estimatedTime: string;
  items: MenuItem[];
  estimatedDelivery?: string; // For active orders
  trackingUrl?: string; // For active orders
}



