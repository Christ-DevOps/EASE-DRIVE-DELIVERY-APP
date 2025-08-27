
// Category type
export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

// Restaurant type
export type Restaurant = {
  id: string;
  name: string;
  location: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  tags: any[];
  image: any[] | any; // React Native ImageSourcePropType
  description?: string;
  menu?: Meal[];
};

// Meal type
export type Meal = {
  id: string;
  name: string;
  restaurant: string;
  restaurantId: string;
  price: number;
  rating: number;
  image: any; // React Native ImageSourcePropType
  description?: string;
  category?: string;
};

// src/types/index.ts
export enum UserRole {
  CLIENT = 'CLIENT',
  PARTNER = 'PARTNER',
  DELIVERY = 'DELIVERY',
  ADMIN = 'ADMIN'
}

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  avatar?: string;
  role: UserRole;
  // ... other common fields
};

export type Partner = User & {
  restaurantId: string;
  isVerified: boolean;
  Category: string;
  // ... partner specific fields
};

export type DeliveryAgent = User & {
  vehicleType: string;
  DrivingLicense: string
  isAvailable: boolean;
  // ... delivery specific fields
};

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAgentId?: string; // optional if not yet assigned
  status: 'pending' | 'Preparing' | 'Ready' | 'picked_up' | 'delivered' | 'received';
  PartnerAdress: {
    PartnerId: string;
    PartnerName: string;
    latitude: number;
    longitude: number;
  };
  deliveryLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  totalAmount: number;
  createdAt: string;
}

export interface DeliveryAgentStats {
  totalOrders: number;
  totalEarnings: number;
  processingOrders: number;
}