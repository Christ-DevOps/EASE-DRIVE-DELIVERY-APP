// services/api.ts
import { 
  DeliveryAgentStats, 
  DeliveryAgent, 
  Order, 
  UserRole,
  Restaurant,
  Meal,
  Category
} from '../types';

// Mock data storage
let mockAgent: DeliveryAgent = {
  id: 'agent-123',
  name: 'Michael Delivery',
  email: 'michael.delivery@example.com',
  phone: '+1234567890',
  address: '789 Delivery St, New York, NY',
  avatar: require('../assets/images/login-graphic.png'),
  role: UserRole.DELIVERY,
  vehicleType: 'Motorcycle',
  DrivingLicense: 'DL123456789',
  isAvailable: true,
};

let mockOrders: Order[] = [
  {
    id: 'order-001',
    customerName: 'Alice Johnson',
    customerPhone: '+1987654321',
    status: 'Ready',
    PartnerAdress: {
      PartnerId: 'partner-001',
      PartnerName: 'Burger Palace',
      latitude: 40.7128,
      longitude: -74.0060,
    },
    deliveryLocation: {
      address: '456 Delivery Ave, New York, NY',
      latitude: 40.7282,
      longitude: -73.9942,
    },
    totalAmount: 25.99,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'order-002',
    customerName: 'Bob Smith',
    customerPhone: '+1123456789',
    deliveryAgentId: 'agent-123',
    status: 'Ready',
    PartnerAdress: {
      PartnerId: 'partner-002',
      PartnerName: 'Pizza Heaven',
      latitude: 40.6782,
      longitude: -73.9442,
    },
    deliveryLocation: {
      address: '123 Pizza St, Brooklyn, NY',
      latitude: 40.6892,
      longitude: -74.0445,
    },
    totalAmount: 32.50,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-003',
    customerName: 'Charlie Brown',
    customerPhone: '+1654321890',
    status: 'Preparing',
    PartnerAdress: {
      PartnerId: 'partner-003',
      PartnerName: 'Sushi Express',
      latitude: 40.7580,
      longitude: -73.9855,
    },
    deliveryLocation: {
      address: '123 Sushi St, New York, NY',
      latitude: 40.7505,
      longitude: -73.9934,
    },
    totalAmount: 45.75,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

let mockStats: DeliveryAgentStats = {
  totalOrders: 4,
  totalEarnings: 1256.89,
  processingOrders: 2,
};

// Mock data for other entities
let mockRestaurants: Restaurant[] = [
  {
    id: 'partner-001',
    name: 'Burger Palace',
    location: '123 Main St, New York, NY',
    rating: 4.5,
    deliveryTime: '20-30 min',
    deliveryFee: '$2.99',
    tags: ['Burgers', 'American', 'Fast Food'],
    image: require('../assets/images/restaurants/restaurant.jpg'),
    description: 'The best burgers in town since 1995',
  },
  {
    id: 'partner-002',
    name: 'Pizza Heaven',
    location: '456 Oak Ave, Brooklyn, NY',
    rating: 4.7,
    deliveryTime: '25-35 min',
    deliveryFee: '$3.50',
    tags: ['Pizza', 'Italian', 'Family Style'],
    image: require('../assets/images/restaurants/restaurant.jpg'),
    description: 'Heavenly pizza delivered to your door',
  },
  {
    id: 'partner-003',
    name: 'Sushi Express',
    location: '789 Pine St, Queens, NY',
    rating: 4.8,
    deliveryTime: '30-40 min',
    deliveryFee: '$4.99',
    tags: ['Sushi', 'Japanese', 'Asian'],
    image: require('../assets/images/restaurants/restaurant.jpg'),
    description: 'Fresh sushi delivered fast',
  },
];

let mockCategories: Category[] = [
  { id: 'cat-1', name: 'Burgers', icon: '🍔', color: '#FF7622' },
  { id: 'cat-2', name: 'Pizza', icon: '🍕', color: '#F9A826' },
  { id: 'cat-3', name: 'Sushi', icon: '🍣', color: '#2E86DE' },
  { id: 'cat-4', name: 'Mexican', icon: '🌮', color: '#EE5A24' },
  { id: 'cat-5', name: 'Desserts', icon: '🍰', color: '#A55EEA' },
];

let mockMeals: Meal[] = [
  {
    id: 'meal-001',
    name: 'Classic Cheeseburger',
    restaurant: 'Burger Palace',
    restaurantId: 'partner-001',
    price: 8.99,
    rating: 4.7,
    image: require('../assets/images/login-graphic.png'),
    description: 'Juicy beef patty with cheese, lettuce, and special sauce',
    category: 'Burgers',
  },
  {
    id: 'meal-002',
    name: 'Pepperoni Pizza',
    restaurant: 'Pizza Heaven',
    restaurantId: 'partner-002',
    price: 14.99,
    rating: 4.8,
    image: require('../assets/images/login-graphic.png'),
    description: 'Classic pizza with pepperoni and mozzarella',
    category: 'Pizza',
  },
  {
    id: 'meal-003',
    name: 'California Roll',
    restaurant: 'Sushi Express',
    restaurantId: 'partner-003',
    price: 12.99,
    rating: 4.6,
    image: require('../assets/images/login-graphic.png'),
    description: 'Fresh California roll with crab, avocado and cucumber',
    category: 'Sushi',
  },
];

// Simulate network delay
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

// Simulate API errors (10% chance)
const simulateError = () => Math.random() < 0.1;

// Helper function to handle API responses
const handleResponse = async <T>(data: T): Promise<T> => {
  await simulateNetworkDelay();
  
  if (simulateError()) {
    throw new Error('Network error: Please check your connection and try again.');
  }
  
  return data;
};

// Delivery Agent API functions
export const getDeliveryStats = async (): Promise<DeliveryAgentStats> => {
  // Update stats based on current orders
  const updatedStats = {
    ...mockStats,
    processingOrders: mockOrders.filter(order => 
      order.status === 'Preparing' || order.status === 'Ready' || order.status === 'picked_up'
    ).length,
  };
  
  return handleResponse(updatedStats);
};

export const updateAvailability = async (isAvailable: boolean): Promise<void> => {
  mockAgent.isAvailable = isAvailable;
  return handleResponse(undefined);
};

export const getAgentProfile = async (): Promise<DeliveryAgent> => {
  return handleResponse({ ...mockAgent });
};

export const updateAgentProfile = async (profile: Partial<DeliveryAgent>): Promise<DeliveryAgent> => {
  mockAgent = { ...mockAgent, ...profile };
  return handleResponse({ ...mockAgent });  
};

export const getActiveOrders = async (): Promise<Order[]> => {
  // Only return orders that are assigned to this agent and not delivered/received
  const activeOrders = mockOrders.filter(order => 
    order.deliveryAgentId === mockAgent.id && 
    order.status !== 'delivered' && 
    order.status !== 'received'
  );
  
  return handleResponse(activeOrders);
};

export const getAllOrders = async (): Promise<Order[]> => {
  // Return all orders assigned to this agent
  const agentOrders = mockOrders.filter(order => order.deliveryAgentId === mockAgent.id);
  return handleResponse(agentOrders);
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  await simulateNetworkDelay();
  
  if (simulateError()) {
    throw new Error(`Failed to fetch order with ID ${orderId}`);
  }
  
  const order = mockOrders.find(o => o.id === orderId);
  if (!order) {
    throw new Error(`Order with ID ${orderId} not found`);
  }
  
  return { ...order };
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order> => {
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    throw new Error(`Order with ID ${orderId} not found`);
  }
  
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    status,
  };
  
  // If status is delivered, update stats
  if (status === 'delivered') {
    mockStats = {
      ...mockStats,
      totalOrders: mockStats.totalOrders + 1,
      totalEarnings: mockStats.totalEarnings + mockOrders[orderIndex].totalAmount,
      processingOrders: Math.max(0, mockStats.processingOrders - 1),
    };
  }
  
  return handleResponse({ ...mockOrders[orderIndex] });
};

export const acceptOrder = async (orderId: string): Promise<Order> => {
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    throw new Error(`Order with ID ${orderId} not found`);
  }
  
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    deliveryAgentId: mockAgent.id,
    status: 'picked_up',
  };
  
  mockStats.processingOrders += 1;
  
  return handleResponse({ ...mockOrders[orderIndex] });
};

export const logout = async (): Promise<void> => {
  // Clear any auth tokens or session data here
  return handleResponse(undefined);
};

// Additional API functions for other entities
export const getRestaurants = async (): Promise<Restaurant[]> => {
  return handleResponse([...mockRestaurants]);
};

export const getRestaurantById = async (id: string): Promise<Restaurant> => {
  const restaurant = mockRestaurants.find(r => r.id === id);
  if (!restaurant) {
    throw new Error(`Restaurant with ID ${id} not found`);
  }
  return handleResponse({ ...restaurant });
};

export const getCategories = async (): Promise<Category[]> => {
  return handleResponse([...mockCategories]);
};

export const getMeals = async (): Promise<Meal[]> => {
  return handleResponse([...mockMeals]);
};

export const getMealsByRestaurant = async (restaurantId: string): Promise<Meal[]> => {
  const meals = mockMeals.filter(m => m.restaurantId === restaurantId);
  return handleResponse(meals);
};

// Additional helper functions for simulation
export const addNewOrder = (order: Order) => {
  mockOrders.push(order);
  mockStats.processingOrders += 1;
};

export const getAvailableOrders = async (): Promise<Order[]> => {
  // Return orders that are ready but not yet assigned to any delivery agent
  const availableOrders = mockOrders.filter(order => 
    order.status === 'Ready' && !order.deliveryAgentId
  );
  
  return handleResponse(availableOrders);
};

export const resetMockData = () => {
  mockAgent = {
    id: 'agent-123',
    name: 'Michael Delivery',
    email: 'michael.delivery@example.com',
    phone: '+1234567890',
    address: '789 Delivery St, New York, NY',
    avatar: require('../assets/images/login-graphic.png'),
    role: UserRole.DELIVERY,
    vehicleType: 'Motorcycle',
    DrivingLicense: 'DL123456789',
    isAvailable: true,
  };

  mockOrders = [
    {
      id: 'order-001',
      customerName: 'Alice Johnson',
      customerPhone: '+1987654321',
      deliveryAgentId: 'agent-123',
      status: 'picked_up',
      PartnerAdress: {
        PartnerId: 'partner-001',
        PartnerName: 'Burger Palace',
        latitude: 40.7128,
        longitude: -74.0060,
      },
      deliveryLocation: {
        address: '456 Delivery Ave, New York, NY',
        latitude: 40.7282,
        longitude: -73.9942,
      },
      totalAmount: 25.99,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'order-002',
      customerName: 'Bob Smith',
      customerPhone: '+1123456789',
      deliveryAgentId: 'agent-123',
      status: 'Ready',
      PartnerAdress: {
        PartnerId: 'partner-002',
        PartnerName: 'Pizza Heaven',
        latitude: 40.6782,
        longitude: -73.9442,
      },
      deliveryLocation: {
        address: '123 Pizza St, Brooklyn, NY',
        latitude: 40.6892,
        longitude: -74.0445,
      },
      totalAmount: 32.50,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'order-003',
      customerName: 'Charlie Brown',
      customerPhone: '+1654321890',
      status: 'Preparing',
      PartnerAdress: {
        PartnerId: 'partner-003',
        PartnerName: 'Sushi Express',
        latitude: 40.7580,
        longitude: -73.9855,
      },
      deliveryLocation: {
        address: '123 Sushi St, New York, NY',
        latitude: 40.7505,
        longitude: -73.9934,
      },
      totalAmount: 45.75,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ];

  mockStats = {
    totalOrders: 4,
    totalEarnings: 1256.89,
    processingOrders: 2,
  };
};