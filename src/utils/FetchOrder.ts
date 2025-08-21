import { Order } from "../types/OrderTypes";

const API_BASE_URL = 'https://your-api.com/api'; // Will be replaced with actual URL

// Temporary mock data - matches backend schema
// Simulated API call
export const fetchOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        // 1 — Preparing (Active)
        {
          id: 'o1',
          date: '2025-08-13T09:15:00.000Z',
          status: 'preparing',
          statusType: 'Active',
          total: 8500,
          restaurant: {
            id: 'r1',
            name: 'Le Bunker',
            address: 'Avenue Kennedy, Bastos, Yaoundé'
          },
          deliveryAgent: {
            id: 'a1',
            name: 'Samuel Tchoua',
            contact: '+237690123456',
            vehicle: 'CE 123 AB', // immatriculation
            rating: 4.6,
            currentLocation: { latitude: 3.8670, longitude: 11.5180 },
            destination: { latitude: 3.8720, longitude: 11.5200 }
          },
          deliveryAddress: 'House 12, Rue 3, Bastos, Yaoundé',
          estimatedTime: '20-25 mins',
          items: [
            { id: 'm1', name: 'Double Cheeseburger', price: 3000, quantity: 2 },
            { id: 'm2', name: 'French Fries (Large)', price: 1500, quantity: 1 }
          ],
          estimatedDelivery: '2025-08-13T09:40:00.000Z'
        },

        // 2 — On the way (Active)
        {
          id: 'o2',
          date: '2025-08-13T09:30:00.000Z',
          status: 'in-transit',
          statusType: 'Active',
          total: 14500,
          restaurant: {
            id: 'r2',
            name: 'Sakura Yaoundé',
            address: 'Rue de Mokolo, Mokolo, Yaoundé'
          },
          deliveryAgent: {
            id: 'a2',
            name: 'Aisha Mbarga',
            contact: '+237699987654',
            vehicle: 'KB 987 CD',
            rating: 4.9,
            currentLocation: { latitude: 3.8530, longitude: 11.5000 },
            destination: { latitude: 3.8400, longitude: 11.5070 }
          },
          deliveryAddress: 'Apartment 4B, Rue du Marché, Mokolo, Yaoundé',
          estimatedTime: '8 mins',
          items: [
            { id: 'm3', name: 'Sushi Combo (12 pcs)', price: 12000, quantity: 1 },
            { id: 'm4', name: 'Miso Soup', price: 1500, quantity: 1 }
          ],
          estimatedDelivery: '2025-08-13T09:38:00.000Z',
          trackingUrl: 'https://track.example.com/orders/o2'
        },

        // 3 — Delivered (Completed)
        {
          id: 'o3',
          date: '2025-08-13T08:05:00.000Z',
          status: 'delivered',
          statusType: 'Completed',
          total: 5600,
          restaurant: {
            id: 'r3',
            name: 'Chez Louis',
            address: 'Quartier Messa, Yaoundé'
          },
          deliveryAgent: {
            id: 'a3',
            name: 'Paul Nkou',
            contact: '+237696555123',
            vehicle: 'LT 456 EF',
            rating: 4.7,
            currentLocation: { latitude: 3.8785, longitude: 11.5150 },
            destination: { latitude: 3.8785, longitude: 11.5150 } // delivered
          },
          deliveryAddress: 'Villa 7, Messa 2, Yaoundé',
          estimatedTime: 'Delivered',
          items: [
            { id: 'm5', name: 'Margherita Pizza (Medium)', price: 2500, quantity: 2 },
            { id: 'm6', name: 'Soda Can', price: 600, quantity: 1 }
          ]
        },

        // 4 — Cancelled (Cancelled)
        {
          id: 'o4',
          date: '2025-08-13T07:40:00.000Z',
          status: 'preparing',
          statusType: 'Active',
          total: 3500,
          restaurant: {
            id: 'r4',
            name: "Mama's Kitchen",
            address: 'Nsam, Yaoundé'
          },
          deliveryAgent: {
            id: 'a4',
            name: 'Grace Temgoua',
            contact: '+237698222333',
            vehicle: 'AH 321 GH',
            rating: 4.2,
            currentLocation: { latitude: 3.8790, longitude: 11.5100 },
            destination: { latitude: 3.8790, longitude: 11.5100 }
          },
          deliveryAddress: 'Block A, Nsam Heights, Yaoundé',
          estimatedTime: 'Cancelled',
          items: [
            { id: 'm7', name: 'Assorted Pastries (3 pcs)', price: 1200, quantity: 1 },
            { id: 'm8', name: 'Chapati Roll', price: 2300, quantity: 1 }
          ]
        },

        // 5 — On the way (Active)
        {
          id: 'o5',
          date: '2025-08-13T09:05:00.000Z',
          status: 'in-transit',
          statusType: 'Active',
          total: 10250,
          restaurant: {
            id: 'r5',
            name: 'La Casa del Sabor',
            address: 'Emana / Rond-point, Yaoundé'
          },
          deliveryAgent: {
            id: 'a5',
            name: 'Eric Ondo',
            contact: '+237697111222',
            vehicle: 'VR 777 LL',
            rating: 4.4,
            currentLocation: { latitude: 3.8600, longitude: 11.5210 },
            destination: { latitude: 3.8650, longitude: 11.5250 }
          },
          deliveryAddress: 'Rue 10, Quartier Emana, Yaoundé',
          estimatedTime: '12 mins',
          items: [
            { id: 'm9', name: 'Tacos Al Pastor', price: 4200, quantity: 2 },
            { id: 'm10', name: 'Fresh Mango Juice', price: 1250, quantity: 1 }
          ],
          estimatedDelivery: '2025-08-13T09:17:00.000Z',
          trackingUrl: 'https://track.example.com/orders/o5'
        }
      ]);
    }, 800);
  });
};
