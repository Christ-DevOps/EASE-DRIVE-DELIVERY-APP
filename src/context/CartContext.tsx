import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types
export type CartItems = {
  id: string;
  name: string;
  price: string; // Store as string to preserve currency symbol
  image: any; // Could be string for remote images or require() for local
  quantity: number;
  restaurantId?: string;
  restaurantName?: string;
};

type CartState = {
  items: CartItems[];
  total: number; // Numeric value for calculations
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItems }
  | { type: 'REMOVE_ITEM'; payload: string } // item id
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'RESTORE_CART'; payload: CartState };

// Create context
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  getTotalQuantity: () => number;
} | undefined>(undefined);

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
};

// Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      let updatedItems: CartItems[];
      if (existingItemIndex > -1) {
        updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        updatedItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0); // Remove if quantity becomes 0
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    case 'RESTORE_CART':
      return action.payload;
    
    default:
      return state;
  }
};

// Helper function to calculate total
const calculateTotal = (items: CartItems[]): number => {
  return items.reduce((total, item) => {
    // Remove non-numeric characters except decimal point
    const priceValue = parseFloat(item.price);
    return total + (priceValue * item.quantity);
  }, 0);
};

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Load cart from AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          dispatch({ 
            type: 'RESTORE_CART', 
            payload: JSON.parse(savedCart) 
          });
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };
    
    loadCart();
  }, []);
  
  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    };
    
    saveCart();
  }, [state]);
  
  // Get total quantity for badge
  const getTotalQuantity = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };
  
  return (
    <CartContext.Provider value={{ state, dispatch, getTotalQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};