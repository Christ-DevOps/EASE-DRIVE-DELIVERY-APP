import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useCart } from '@/src/context/CartContext';
import CartIcon from '@/src/components/CartIcon';
import NotificationIcon  from '@/src/components/NotificationIcon';
import { router, useRouter } from 'expo-router';
import { useNav } from '@/src/context/NavigationContext';
import { Category, Meal, Restaurant  } from '@/src/types';
import { fetchCategories, fetchPopularMeals, fetchPopularRestaurants } from '@/src/services/databaseService'
import CategoryCard from '@/src/components/client/CategoryCard';
import RestaurantCard from '@/src/components/client/RestaurantCard';
import MealCard from '@/src/components/client/Meal';
import MenuItemPopup from '@/src/components/MealPopup';
import { push } from 'expo-router/build/global-state/routing';

const { width } = Dimensions.get('window');

// Mock database service (replace with real API calls)
type FilterOptions = {
  minRating: number;
  maxDistance: number;
  priceRange: [number, number];
  categories: string[];
};

export default function HomeScreen() {
  const { navigateToLocationAccess } = useNav();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([]);
  const [popularMeals, setPopularMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState({
    categories: true,
    restaurants: true,
    meals: true
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const [error, setError] = useState(null);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
   // Fetch data from database/API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        setLoading(prev => ({ ...prev, categories: false }));
        
        // Fetch restaurants
        const restaurantsData = await fetchPopularRestaurants();
        setPopularRestaurants(restaurantsData);
        setLoading(prev => ({ ...prev, restaurants: false }));
        
        // Fetch meals
        const mealsData = await fetchPopularMeals();
        setPopularMeals(mealsData);
        setLoading(prev => ({ ...prev, meals: false }));
      } catch (err) {
        // setError('Failed to load data. Please try again');
        console.error('Database error:', err);
        throw new Error;
      }
    };

    fetchData();
  }, []);

    const { dispatch } = useCart();

    {/* Add Tocart Function Available All over the page Thanks to CartProvider */}
  const handleAddToCart = (item: any) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurantName: item.restaurant,
        quantity: 1
      }
    });
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} /> 
        {/* Header */}
        <View style={styles.header}>

          {/* Left Container of Header Containign Maps and delivery Info */}
          <View style={{ display: 'flex',flexDirection: 'row' ,justifyContent: 'space-between', alignItems: 'center',  }} >
            <View style={{ backgroundColor: '#ECF0F4', height: 50, width: 50, justifyContent: 'center', display: 'flex', alignItems: 'center', flexDirection: 'row', borderRadius: 20 }} >
            <Ionicons name='map' size={30} color='#181C2E'  />
            </View>
            <View className='' style={{ marginStart: 10 }} >
              <Text style={styles.deliverTo}>DELIVER TO</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.location}>Awae Escalier</Text>
              <Ionicons name="location" size={16} color="#Ff6f6" />
            </View>
            </View>
          </View>

          {/* Notification + Cart Icons */}
          <View style={{ flexDirection: 'row', gap: 5 }} >
            <CartIcon onPress={()=> router.push('/(Client)/(tabs)/ViewCart')} />
          <NotificationIcon />
          </View>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>
          Hey Tangomo, <Text style={styles.bold}>Good Afternoon!</Text>
        </Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
            <TextInput
              placeholder="Search Food, restaurants"
              placeholderTextColor="#aaa"
              style={styles.input}
            />
            <TouchableOpacity style={styles.filterButton} onPress={()=> router.push('/(Client)/(tabs)/search')} >
              <Ionicons name="options" size={20} color="#FF7622" />
            </TouchableOpacity>
          </View>
        </View>

        {/* All Categories */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <TouchableOpacity style={styles.seeAllContainer}>
            <Text style={styles.seeAll}>See All</Text>
            <Ionicons name="arrow-forward" size={16} color="#FF7622" />
          </TouchableOpacity>
        </View>
        

        {/*  Loading categories */}
      {
        loading.categories ?  (
          <ActivityIndicator size="large" color="#FF7622" style={styles.loadingIndicator} />
        ) : (
          <FlatList
            horizontal
            data={categories}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.categoriesContainer}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => 
              <CategoryCard item={item}   />
            }
          />
        )
      }

        {/* Popular Restaurants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Restaurants</Text>
          <TouchableOpacity style={styles.seeAllContainer}>
            <Text style={styles.seeAll}>See All</Text>
            <Ionicons name="arrow-forward" size={16} color="#FF7622" />
          </TouchableOpacity>
        </View>
        
        { loading.restaurants ? (
          <ActivityIndicator size="large" color="#FF7622" style={styles.loadingIndicator} />
        ) : (
          <FlatList
            horizontal
            data={popularRestaurants}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.restaurantsContainer}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item })=> 
              <RestaurantCard item={item}  />
            }
          />
        ) }

        {/* Popular Meals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Meals</Text>
          <TouchableOpacity style={styles.seeAllContainer}>
            <Text style={styles.seeAll}>See All</Text>
            <Ionicons name="arrow-forward" size={16} color="#FF7622" />
          </TouchableOpacity>
        </View>
        
        {
          loading.meals ? 
          (
          <ActivityIndicator size="large" color="#FF7622" style={styles.loadingIndicator} />
        ) : (
          <View style={styles.mealsContainer}>
            {popularMeals.map(item => (
              <MealCard 
              key={item.id} 
              item={item} 
              onAddToCart={handleAddToCart} 
              onPress={()=> {
                setSelectedMeal(item);
                setPopupVisible(true)
              }}
            />
            ))}
          </View>
        )
        }

        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => setError(null)}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <MenuItemPopup
      visible={popupVisible}
      item={selectedMeal}
      onClose={() => setPopupVisible(false)}
      addToCart={handleAddToCart}
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FA',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 15,
    width: '100%'
  },
  deliverTo: {
    fontSize: 13,
    color: '#FF7622',
    fontWeight: '700',
    marginBottom: 0,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'SpaceMono',
    marginRight: 4,
  },
  cartIcon: {
    position: 'relative',
    backgroundColor: '#181C2E',
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: '#FF7622',
    position: 'absolute',
    top: -6,
    right: 4,
    borderRadius: 15,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 20,
    marginVertical: 8,
    paddingHorizontal: 20,
    fontFamily: 'SpaceMono',
    color: '#333',
  },
  bold: {
    color: '#FF7622',
    fontWeight: 'bold',
    fontFamily: 'SpaceMono'
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 5,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#32343E',
    fontFamily: 'SpaceMono'
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    color: '#FF7622',
    fontWeight: '500',
    marginRight: 5,
    fontSize: 14,
  },
  categoriesContainer: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
  // categoryCard: {
  //   width: 100,
  //   backgroundColor: '#FFF8F2',
  //   borderRadius: 20,
  //   padding: 15,
  //   marginRight: 15,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   elevation: 2,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   shadowOffset: { width: 0, height: 2 },
  // },
  // categoryIconContainer: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   backgroundColor: '#FFF',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginBottom: 10,
  // },
  // categoryTitle: {
  //   fontWeight: '600',
  //   fontSize: 14,
  //   color: '#333',
  //   textAlign: 'center',
  // },
   restaurantsContainer: {
     paddingLeft: 20,
   marginTop: 0,
     paddingBottom: 20,
   },
  // restaurantCard: {
  //   width: width * 0.75,
  //   backgroundColor: '#FFF',
  //   borderRadius: 20,
  //   overflow: 'hidden',
  //   marginRight: 20,
  //   elevation: 3,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  // },
  // restaurantImage: {
  //   width: '100%',
  //   height: 150,
  // },
  // restaurantInfo: {
  //   padding: 15,
  // },
  // restaurantName: {
  //   fontWeight: '700',
  //   fontSize: 18,
  //   color: '#333',
  //   marginBottom: 5,
  // },
  // restaurantLocation: {
  //   fontSize: 14,
  //   color: '#666',
  //   marginBottom: 8,
  // },
  // restaurantTags: {
  //   fontSize: 14,
  //   color: '#888',
  //   marginBottom: 12,
  // },
  // restaurantDetails: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  // ratingContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#FFF8F2',
  //   paddingVertical: 4,
  //   paddingHorizontal: 8,
  //   borderRadius: 10,
  // },
  // ratingText: {
  //   fontSize: 14,
  //   fontWeight: '600',
  //   color: '#333',
  //   marginLeft: 4,
  // },
  // deliveryFee: {
  //   fontSize: 14,
  //   color: '#666',
  //   paddingHorizontal: 8,
  //   backgroundColor: '#F5F5F5',
  //   borderRadius: 8,
  // },
  // deliveryTime: {
  //   fontSize: 14,
  //   fontWeight: '500',
  //   paddingHorizontal: 8,
  //   backgroundColor: '#FFF8F2',
  //   borderRadius: 8,
  //   color: '#FF7622',
  // },
   mealsContainer: {
     paddingHorizontal: 20,
     paddingBottom: 30,
   },
  // mealCard: {
  //   backgroundColor: '#FFF',
  //   borderRadius: 15,
  //   marginBottom: 15,
  //   flexDirection: 'row',
  //   overflow: 'hidden',
  //   elevation: 2,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   shadowOffset: { width: 0, height: 2 },
  // },
  // mealImage: {
  //   width: 100,
  //   height: 100,
  //   resizeMode: 'cover',
  // },
  // mealInfo: {
  //   flex: 1,
  //   padding: 15,
  //   justifyContent: 'center',
  // },
  // mealName: {
  //   fontWeight: '700',
  //   fontSize: 16,
  //   color: '#333',
  //   marginBottom: 5,
  // },
  // mealRestaurant: {
  //   fontSize: 14,
  //   color: '#666',
  //   marginBottom: 10,
  // },
  // mealDetails: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  // mealPrice: {
  //   fontSize: 16,
  //   fontWeight: '700',
  //   color: '#FF7622',
  // },
  // mealRating: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#FFF8F2',
  //   paddingVertical: 4,
  //   paddingHorizontal: 8,
  //   borderRadius: 10,
  // },
    loadingIndicator: {
    paddingVertical: 30,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#B71C1C',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF7622',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
    addButton: {
    position: 'absolute',
    bottom: 70,
    right: 15,
    backgroundColor: '#FF7622',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});