import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, FlatListComponent, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import CartIcon from '@/src/components/CartIcon';
import { router } from 'expo-router';
import RestaurantCard from '@/src/components/client/RestaurantCard';
import { Category, Meal, Restaurant } from '@/src/types';
import { fetchLocalMeals, fetchPopularRestaurants, fetchSuggestedRestaurants } from '@/src/services/databaseService';
import MealCard from '@/src/components/client/Meal';
import { useNav } from '@/src/context/NavigationContext';
import { useCart } from '@/src/context/CartContext';
import FilterModal from '@/src/components/FilterModal';

type FilterOptions = {
  minRating: number;
  maxDistance: number;
  priceRange: [number, number];
  categories: string[];
};

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedRestaurant, setSuggestedRestaurants] = useState<Restaurant[]>([]);
  const [localMeal, setLocalMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  
  useEffect(() => {
    const LoadRestaurantSuggestion = async() =>{
      const data  = await fetchSuggestedRestaurants();
      setSuggestedRestaurants(data);
    }
    const LoadLocalMeals = async() => {
      const Meals = await fetchLocalMeals();
      setLocalMeals(Meals);
    }
    LoadRestaurantSuggestion();
    LoadLocalMeals();
  }, [])

  const RecentKey = [
    {id: 1, name:'Eru'},
    {id: 2, name:'Jellof Rice'},
    {id: 3, name:'Pizza'},
    {id: 4, name:'Koki'}
  ]

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

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    // Navigate to filtered results screen
    router.push({
      pathname: '/(Client)/(screens)/filter/FilterResults',
      params: {
        filters: JSON.stringify(filters),
        searchQuery: searchText
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name='arrow-back' size={24} color='black' style={{ backgroundColor: '#ECF0F4', padding: 10, borderRadius: 20 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
        </View>

       <View style={{ flexDirection: 'row', alignItems:"center", justifyContent: 'center', gap: 10}} >
         <TouchableOpacity onPress={()=> setShowFilterModal(true)} >
          <Ionicons name="options" size={20} color="#FF7622" style={{ backgroundColor: 'white', padding: 5, borderRadius: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <CartIcon onPress={()=> router.push('/(Client)/(tabs)/ViewCart')} />
        </TouchableOpacity>
       </View>

      </View>

      {/* Search Container */}
      <View style={styles.searchContainer}>
        <Ionicons name='search' size={20} color='#888' style={styles.searchIcon} />
        <TextInput 
          placeholder='What are you craving?'
          placeholderTextColor='#888'
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name='close-circle' size={20} color='#888' />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Recent Keywords */}
      <Text style={styles.sectionTitle}>Recent Keywords</Text>
      <View style={styles.keywordsContainer}>
        {
          RecentKey.map((item) => (
            <TouchableOpacity key={item.id} style={styles.keywordItem}>
            <Text style={styles.keywordText}>{item.name}</Text>
          </TouchableOpacity>
          ))
        }
      </View>

      <ScrollView showsVerticalScrollIndicator={false} >

        {/* Suggested Restaurants */}
      <Text style={styles.sectionTitle}>Suggested Restaurants</Text>
      <FlatList 
        data={suggestedRestaurant}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.restaurantList}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.restaurantCard} onPress={()=> router.push({
            pathname:'/(Client)/(screens)/resto/restaurantDetails',
            params: { id: item.id }
          })} >
            <View style={styles.restaurantInfo}>
              <Image source={Array.isArray(item.image) ? item.image[0] : item.image}  style={styles.image} />
              <View>
                <Text style={styles.restaurantName}>{item.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name='star' size={14} color='#FF7622' style={{ }} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Local Meals */}
      <Text style={styles.sectionTitle}>Local Meals</Text>
      <FlatList 
        data={localMeal}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        style={{ paddingBottom: 50 }}
        contentContainerStyle={styles.mealsList}
        renderItem={({item}) => (
          <MealCard item={item} onAddToCart={handleAddToCart} />
        )}
      />

      {/* Filter Modal */}
      <FilterModal 
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        categories={categories}
      />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 17,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Quicksand-bold'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    // flex: 1,
    width: '50%',
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'SpaceMono',
    marginBottom: 15,
    color: '#333',
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  keywordItem: {
    backgroundColor: '#ffffff',
    borderColor: '#ECF0F4',
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  keywordText: {
    color: '#666',
  },
  restaurantList: {
    paddingBottom: 10,
  },
  restaurantInfo:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 20
  },
  restaurantCard: {
    // backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 15,
    width: '100%',
    borderBottomColor: '#EBEBEB',
    borderBottomWidth: 2,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: 'Quicksand-bold',
    marginBottom: 5,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 5,
    color: '#666',
  },
  deliveryText: {
    color: '#666',
    fontSize: 14,
  },
  mealsList: {
    paddingBottom: 20,
  },
  mealCard: {
    marginRight: 15,
    width: 150,
  },
  mealImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#eee', // Placeholder if images not available
  },
  mealName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3,
  },
  mealPrice: {
    fontSize: 14,
    color: '#E35F21',
    fontWeight: 'bold',
  },
});