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
import { useCart } from '../../context/CartContext';
import CartIcon from '../../components/CartIcon';
import NotificationIcon  from '../../components/NotificationIcon';
import { router, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock database service (replace with real API calls)
const databaseService = {
  fetchCategories: () => new Promise(resolve => {
    setTimeout(() => resolve([
      { id: '1', name: 'Fast Food', icon: 'fast-food', color: '#FFD8C9' },
      { id: '2', name: 'Pasteries', icon: 'restaurant', color: '#FFE8D6' },
      { id: '3', name: 'Burger', icon: 'fast-food-outline', color: '#FFF1E6' },
      { id: '4', name: 'Desert', icon: 'ice-cream', color: '#FFD8C9' },
      { id: '5', name: 'Local Meals', icon: 'restaurant', color: '#FFE8D6' }
    ]), 800);
  }),


  //Fetch Popular Restaurants Data from Database
  fetchPopularRestaurants: () => new Promise(resolve => {
    setTimeout(() => resolve([
        {
    id: '1',
    name: 'Rose Garden Restaurant',
    location: '2.5km • Awae Escalier',
    rating: 4.7,
    deliveryTime: '20 min',
    deliveryFee: 'Free',
    tags: 'Burger • Chicken • Rice • Wings',
    image: require('../../assets/images/restaurants/restaurant1.jpg')
  },
  {
    id: '2',
    name: 'Italian Delight',
    location: '1.8km • Downtown',
    rating: 4.5,
    deliveryTime: '25 min',
    deliveryFee: '$2.99',
    tags: 'Pizza • Pasta • Salad',
    image: require('../../assets/images/restaurants/restaurant1.jpg')
  },
  {
    id: '3',
    name: 'Sushi Paradise',
    location: '3.2km • East Side',
    rating: 4.8,
    deliveryTime: '30 min',
    deliveryFee: 'Free',
    tags: 'Sushi • Ramen • Tempura',
    image: require('../../assets/images/restaurants/restaurant1.jpg')
  },
  {
    id: '4',
    name: 'Burger Master',
    location: '1.2km • West End',
    rating: 4.6,
    deliveryTime: '15 min',
    deliveryFee: '$1.99',
    tags: 'Burgers • Fries • Shakes',
    image: require('../../assets/images/restaurants/restaurant1.jpg')
  },
  
      // More restaurant data...
    ]), 1000);
  }),


  //Fetch PopularMeals Data from Database
  fetchPopularMeals: () => new Promise(resolve => {
    setTimeout(() => resolve([
      {
    id: '1',
    name: 'Spicy Chicken Burger',
    restaurant: 'Burger Master',
    price: 2000,
    rating: 4.8,
    image: require('../../assets/images/firstBurger.png')
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    restaurant: 'Italian Delight',
    price: 2500,
    rating: 4.7,
    image: require('../../assets/images/firstBurger.png')
  },
  {
    id: '3',
    name: 'California Roll',
    restaurant: 'Sushi Paradise',
    price: 1500,
    rating: 4.9,
    image: require('../../assets/images/firstBurger.png')
  },
  {
    id: '4',
    name: 'Chocolate Cake',
    restaurant: 'Sweet Corner',
    price: 2500,
    rating: 4.6,
    image: require('../../assets/images/firstBurger.png')
  },
  {
    id: '5',
    name: 'Grilled Salmon',
    restaurant: 'Seafood Grill',
    price: 22.99,
    rating: 4000,
    image: require('../../assets/images/firstBurger.png')
  },
    ]), 1200);
  })

}

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [popularMeals, setPopularMeals] = useState([]);
  const [loading, setLoading] = useState({
    categories: true,
    restaurants: true,
    meals: true
  });
  const [error, setError] = useState(null);

   // Fetch data from database/API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await databaseService.fetchCategories();
        setCategories(categoriesData);
        setLoading(prev => ({ ...prev, categories: false }));
        
        // Fetch restaurants
        const restaurantsData = await databaseService.fetchPopularRestaurants();
        setPopularRestaurants(restaurantsData);
        setLoading(prev => ({ ...prev, restaurants: false }));
        
        // Fetch meals
        const mealsData = await databaseService.fetchPopularMeals();
        setPopularMeals(mealsData);
        setLoading(prev => ({ ...prev, meals: false }));
      } catch (err) {
        setError('Failed to load data. Please try again');
        console.error('Database error:', err);
        throw new Error;
      }
    };

    fetchData();
  }, []);

    const { dispatch } = useCart();

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

    // Data rendering components
  const renderCategory = ({ item }: any) => (
    <TouchableOpacity style={[styles.categoryCard, { backgroundColor: item.color }]}>
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon} size={24} color="#FF7622" />
      </View>
      <Text style={styles.categoryTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  //Restaurants Styled components 
  const renderRestaurant = ({ item }: any) => (
    <TouchableOpacity style={styles.restaurantCard}>
      <Image source={item.image} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.restaurantLocation} numberOfLines={1}>
          <MaterialIcons name="location-on" size={14} color="#FF7622" /> {item.location}
        </Text>
        <Text style={styles.restaurantTags} numberOfLines={1}>{item.tags}</Text>
        <View style={styles.restaurantDetails}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.deliveryFee}>{item.deliveryFee}</Text>
          <Text style={styles.deliveryTime}>
            <Ionicons name="time-outline" size={14} color="#FF7622" /> {item.deliveryTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );


  //Each meal styled component
  const renderMeal = (item : any) => (
    <TouchableOpacity key={item.id} style={styles.mealCard}>
      <Image source={item.image} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.mealRestaurant} numberOfLines={1}>{item.restaurant}</Text>
        <View style={styles.mealDetails}>
          <Text style={styles.mealPrice}>{item.price}{' '}frs</Text>
        </View>
          <View style={styles.mealRating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => handleAddToCart(item)}
      >
        <Ionicons name="add" size={20} color="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} /> 
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <CartIcon onPress={()=> router.push('/(tabs)/ViewCart')} />
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
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options" size={20} color="#FF7622" />
            </TouchableOpacity>
          </View>
        </View>

        {/* All Categories */}
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
            renderItem={renderCategory}
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
            renderItem={renderRestaurant}
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
            {popularMeals.map(renderMeal)}
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
  categoryCard: {
    width: 100,
    backgroundColor: '#FFF8F2',
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  restaurantsContainer: {
    paddingLeft: 20,
    marginTop: 0,
    paddingBottom: 20,
  },
  restaurantCard: {
    width: width * 0.75,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontWeight: '700',
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  restaurantLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  restaurantTags: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  deliveryFee: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  deliveryTime: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 8,
    backgroundColor: '#FFF8F2',
    borderRadius: 8,
    color: '#FF7622',
  },
  mealsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  mealCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  mealImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  mealInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  mealName: {
    fontWeight: '700',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  mealRestaurant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  mealDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF7622',
  },
  mealRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
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