import { Meal, Category, Restaurant } from "../types"; 

const categoriesData: Category[] = [
  { id: '1', name: 'Fast Food', icon: 'fast-food', color: '#FFD8C9' },
  { id: '2', name: 'Pasteries', icon: 'restaurant', color: '#FFE8D6' },
  { id: '3', name: 'Burger', icon: 'fast-food-outline', color: '#FFF1E6' },
  { id: '4', name: 'Desert', icon: 'ice-cream', color: '#FFD8C9' },
  { id: '5', name: 'Local Meals', icon: 'restaurant', color: '#FFE8D6' },
];

const popularRestaurantsData: Restaurant[] = [
  {
    id: '1',
    name: 'Rose Garden Restaurant',
    location: '2.5km • Awae Escalier',
    rating: 4.7,
    deliveryTime: '20 min',
    deliveryFee: 'Estimated',
    tags: ['Burger' , 'Chicken' , 'Rice' , 'Wings'],
    image: [require('../assets/images/restaurants/restaurant1.jpg'),
        require('../assets/images/firstBurger.png'),
        require('../assets/images/firstBurger.png')
    ],
    description: 'Authentic local cuisine with a modern twist. Famous for our signature burgers and chicken wings.',
    menu: [
      {
        id: '101',
        name: 'Spicy Chicken Burger',
        restaurant: 'Rose Garden Restaurant',
        restaurantId: '1',
        price: 2000,
        rating: 4.8,
        image: require('../assets/images/firstBurger.png'),
      },
      {
        id: '102',
        name: 'BBQ Beef Burger',
        restaurant: 'Rose Garden Restaurant',
        restaurantId: '1',
        price: 2200,
        rating: 4.6,
        image: require('../assets/images/firstBurger.png'),
      },
    ]
  },
  {
    id: '2',
    name: 'Italian Delight',
    location: '1.8km • Downtown',
    rating: 4.5,
    deliveryTime: '25 min',
    deliveryFee: 'Estimated',
    tags: ['Pizza' , 'Pasta' ,'Salad'],
    image: require('../assets/images/restaurants/restaurant1.jpg'),
    description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes.',
    menu: [
      {
        id: '201',
        name: 'Margherita Pizza',
        restaurant: 'Italian Delight',
        restaurantId:'2',
        price: 2500,
        rating: 4.7,
        image: require('../assets/images/firstBurger.png'),
      },
      {
        id: '202',
        name: 'Spaghetti Carbonara',
        restaurant: 'Italian Delight',
        restaurantId: '2',
        price: 1800,
        rating: 4.5,
        image: require('../assets/images/firstBurger.png'),
      },
    ]
  },
  {
    id: '3',
    name: 'Sushi Paradise',
    location: '3.2km • East Side',
    rating: 4.8,
    deliveryTime: '30 min',
    deliveryFee: 'Free',
    tags: ['Sushi ', 'Ramen' , 'Tempura'],
    image: require('../assets/images/restaurants/restaurant1.jpg'),
    description: 'Fresh Japanese cuisine with authentic flavors and presentation.',
    menu: [
      {
        id: '301',
        name: 'California Roll',
        restaurant: 'Sushi Paradise',
        restaurantId: '3',
        price: 1500,
        rating: 4.9,
        image: require('../assets/images/firstBurger.png'),
      },
      {
        id: '302',
        name: 'Miso Ramen',
        restaurant: 'Sushi Paradise',
        restaurantId: '3',
        price: 1700,
        rating: 4.7,
        image: require('../assets/images/firstBurger.png'),
      },
    ]
  },
  {
    id: '4',
    name: 'Cameroon Delights',
    location: '1.2km • Bonamoussadi',
    rating: 4.9,
    deliveryTime: '15 min',
    deliveryFee: 'Free',
    tags: ['Ndole', 'Achu', 'Koki Corn'],
    image: [require('../assets/images/restaurants/restaurant1.jpg')],
    description: 'Traditional Cameroonian dishes made with authentic recipes and fresh ingredients.',
    menu: [
      {
        id: '401',
        name: 'Ndole with Plantains',
        restaurant: 'Cameroon Delights',
        restaurantId: '4',
        price: 1800,
        rating: 4.9,
        image: require('../assets/images/firstBurger.png'),
      },
      {
        id: '402',
        name: 'Achu Soup',
        restaurant: 'Cameroon Delights',
        restaurantId: '4',
        price: 2200,
        rating: 4.8,
        image: require('../assets/images/firstBurger.png'),
      },
    ]
  },
  {
    id: '5',
    name: 'Grill Masters',
    location: '3.5km • Deido',
    rating: 4.6,
    deliveryTime: '25 min',
    deliveryFee: '300 FCFA',
    tags: ['Grilled Fish', 'Brochettes', 'Suya'],
    image: [require('../assets/images/restaurants/restaurant1.jpg')],
    description: 'Specializing in perfectly grilled meats and fish with secret marinades.',
    menu: [
      {
        id: '501',
        name: 'Grilled Tilapia',
        restaurant: 'Grill Masters',
        restaurantId: '5',
        price: 3500,
        rating: 4.7,
        image: require('../assets/images/firstBurger.png'),
      },
      {
        id: '502',
        name: 'Beef Brochettes',
        restaurant: 'Grill Masters',
        restaurantId: '5',
        price: 1500,
        rating: 4.6,
        image: require('../assets/images/firstBurger.png'),
      },
    ]
  },
  {
    id: '6',
    name: 'Sweet Sensations',
    location: '2.0km • Akwa',
    rating: 4.8,
    deliveryTime: '20 min',
    deliveryFee: '200 FCFA',
    tags: ['Cakes', 'Pastries', 'Desserts'],
    image: [require('../assets/images/restaurants/restaurant1.jpg')],
    description: 'Artisanal bakery creating delicious cakes, pastries and sweet treats.',
    menu: [
      {
        id: '601',
        name: 'Chocolate Fudge Cake',
        restaurant: 'Sweet Sensations',
        restaurantId: '6',
        price: 4500,
        rating: 4.9,
        image: require('../assets/images/firstBurger.png'),
      },
      {
        id: '602',
        name: 'Croissant Assortment',
        restaurant: 'Sweet Sensations',
        restaurantId: '6',
        price: 2500,
        rating: 4.7,
        image: require('../assets/images/firstBurger.png'),
      },
    ]
  },
  {
    id: '7',
    name: 'Vegetarian Haven',
    location: '1.5km • Bonanjo',
    rating: 4.7,
    deliveryTime: '18 min',
    deliveryFee: 'Free',
    tags: ['Vegan', 'Salads', 'Smoothies'],
    image: [require('../assets/images/restaurants/restaurant1.jpg')],
    description: 'Plant-based cuisine that delights even the most devoted meat lovers.',
    menu: [
      {
        id: '701',
        name: 'Buddha Bowl',
        restaurant: 'Vegetarian Haven',
        restaurantId: '7',
        price: 2800,
        rating: 4.8,
        image: require('../assets/images/firstBurger.png'),
      },
      {
        id: '702',
        name: 'Quinoa Salad',
        restaurant: 'Vegetarian Haven',
        restaurantId: '7',
        price: 2200,
        rating: 4.6,
        image: require('../assets/images/firstBurger.png'),
      },
    ]
  },
  {
    id: '8',
    name: 'Seafood Cove',
    location: '4.0km • Youpwe',
    rating: 4.9,
    deliveryTime: '30 min',
    deliveryFee: '500 FCFA',
    tags: ['Lobster', 'Shrimp', 'Oysters'],
    image: [require('../assets/images/restaurants/restaurant1.jpg')],
    description: 'Fresh seafood sourced daily from local fishermen and coastal waters.',
    menu: [
      {
        id: '801',
        name: 'Grilled Lobster',
        restaurant: 'Seafood Cove',
        restaurantId: '8',
        price: 6500,
        rating: 4.9,
        image: require('../assets/images/firstBurger.png'),
      },
      {
        id: '802',
        name: 'Shrimp Platter',
        restaurant: 'Seafood Cove',
        restaurantId: '8',
        price: 4800,
        rating: 4.8,
        image: require('../assets/images/firstBurger.png'),
      },
    ]
  },
  {
    id: '9',
    name: 'Chicken Express',
    location: '1.3km • New Bell',
    rating: 4.5,
    deliveryTime: '15 min',
    deliveryFee: '250 FCFA',
    tags: ['Fried Chicken', 'Wings', 'Sandwiches'],
    image: [require('../assets/images/restaurants/restaurant1.jpg')],
    description: 'Crispy fried chicken made with our secret blend of herbs and spices.',
    menu: [
      {
        id: '901',
        name: 'Family Bucket',
        restaurant: 'Chicken Express',
        restaurantId: '9',
        price: 5000,
        rating: 4.6,
        image: require('../assets/images/firstBurger.png'),
      },
      {
        id: '902',
        name: 'Spicy Wings',
        restaurant: 'Chicken Express',
        restaurantId: '9',
        price: 2800,
        rating: 4.7,
        image: require('../assets/images/firstBurger.png'),
      },
    ]
  },
  {
    id: '10',
    name: 'Café Bistro',
    location: '0.8km • Bonapriso',
    rating: 4.8,
    deliveryTime: '12 min',
    deliveryFee: '150 FCFA',
    tags: ['Coffee', 'Sandwiches', 'Breakfast'],
    image: [require('../assets/images/restaurants/restaurant1.jpg')],
    description: 'European-style café serving premium coffee and light meals in a cozy atmosphere.',
    menu: [
      {
        id: '1001',
        name: 'Avocado Toast',
        restaurant: 'Café Bistro',
        restaurantId: '10',
        price: 2200,
        rating: 4.8,
        image: require('../assets/images/firstBurger.png'),
      },
      {
        id: '1002',
        name: 'Cappuccino',
        restaurant: 'Café Bistro',
        restaurantId: '10',
        price: 1200,
        rating: 4.9,
        image: require('../assets/images/firstBurger.png'),
      },
    ]
  }
];

const popularMealsData: Meal[] = [
  {
    id: '1',
    name: 'Spicy Chicken Burger',
    restaurant: 'Burger Master',
    restaurantId: '2',
    price: 2000,
    rating: 4.8,
    image: require('../assets/images/firstBurger.png'),
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    restaurant: 'Italian Delight',
    restaurantId: '1',
    price: 2500,
    rating: 4.7,
    image: require('../assets/images/firstBurger.png'),
  },
  {
    id: '3',
    name: 'California Roll',
    restaurant: 'Sushi Paradise',
    restaurantId: '3',
    price: 1500,
    rating: 4.9,
    image: require('../assets/images/firstBurger.png'),
  },
];

// New local meals data Mock-up (10 items)
const localMealsData: Meal[] = [
  {
    id: '100',
    name: 'Ndole with Plantains',
    restaurant: 'Cameroon Delights',
    restaurantId: '4',
    price: 2800,
    rating: 4.9,
    image: require('../assets/images/firstBurger.png'),
  },
  {
    id: '101',
    name: 'Achu Soup',
    restaurant: 'Cameroon Delights',
    restaurantId: '4',
    price: 3200,
    rating: 4.8,
    image: require('../assets/images/firstBurger.png'),
  },
  {
    id: '102',
    name: 'Koki Corn',
    restaurant: 'Local Kitchen',
    restaurantId: '11',
    price: 1800,
    rating: 4.7,
    image: require('../assets/images/firstBurger.png'),
  },
  {
    id: '103',
    name: 'Eru and Water Fufu',
    restaurant: 'Traditional Taste',
    restaurantId: '12',
    price: 2500,
    rating: 4.9,
    image: require('../assets/images/firstBurger.png'),
  },
  {
    id: '104',
    name: 'Poulet DG',
    restaurant: 'Cameroon Delights',
    restaurantId: '4',
    price: 3500,
    rating: 4.8,
    image: require('../assets/images/firstBurger.png'),
  },
  {
    id: '105',
    name: 'Mbongo Tchobi',
    restaurant: 'Spice House',
    restaurantId: '13',
    price: 3000,
    rating: 4.7,
    image: require('../assets/images/firstBurger.png'),
  },
  {
    id: '106',
    name: 'Grilled Tilapia',
    restaurant: 'Grill Masters',
    restaurantId: '5',
    price: 4500,
    rating: 4.8,
    image: require('../assets/images/firstBurger.png'),
  },
  {
    id: '107',
    name: 'Beef Brochettes',
    restaurant: 'Grill Masters',
    restaurantId: '5',
    price: 2000,
    rating: 4.6,
    image: require('../assets/images/firstBurger.png'),
  },
  {
    id: '108',
    name: 'Kondre with Plantains',
    restaurant: 'Traditional Taste',
    restaurantId: '12',
    price: 2800,
    rating: 4.7,
    image: require('../assets/images/firstBurger.png'),
  },
  {
    id: '109',
    name: 'Pepper Soup',
    restaurant: 'Spice House',
    restaurantId: '13',
    price: 2200,
    rating: 4.8,
    image: require('../assets/images/firstBurger.png'),
  }
];

//API SERVICE FUNCTIONS
export const fetchCategories = (): Promise<Category[]> =>
    new Promise((resolve) => {
    setTimeout(() => resolve(categoriesData), 600);
});

export const fetchPopularRestaurants = (): Promise<Restaurant[]> =>
    new Promise((resolve) => {
        setTimeout(()=> resolve(popularRestaurantsData) , 600)
});

export const fetchPopularMeals = (): Promise<Meal[]> =>
    new Promise((resolve) => {
        setTimeout(() => resolve(popularMealsData), 600);
});

export const fetchLocalMeals = (): Promise<Meal[]> =>
  new Promise((resolve) => {
        setTimeout(()=> resolve(localMealsData), 600)
  });

  // In your API file
export const fetchSuggestedRestaurants = async (): Promise<Restaurant[]> => {
  // In a real backend, you would have:
  // 1. User-based recommendations (based on order history)
  // 2. Location-based filtering (nearby restaurants)
  // 3. Popularity metrics (rating + order count)
  
  // For mock data, implement smart sorting:
  return new Promise((resolve) => {
    setTimeout(() => {
      // Clone to avoid mutating original data
      const suggested = [...popularRestaurantsData]
        .sort((a, b) => {
          // Priority 1: Highest rated
          if (b.rating !== a.rating) return b.rating - a.rating;
          
          // Priority 2: Fastest delivery
          const aTime = parseInt(a.deliveryTime);
          const bTime = parseInt(b.deliveryTime);
          return aTime - bTime;
        })
        .slice(0, 5); // Top 4 suggested restaurants
        
      resolve(suggested);
    }, 600);
  });
};

export const getRestaurantById = (id: string): Restaurant | undefined =>{
    return popularRestaurantsData.find((restaurant) => restaurant.id === id );
}