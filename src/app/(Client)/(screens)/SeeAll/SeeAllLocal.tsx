// SeeAllMeals.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchLocalMeals } from '@/src/services/databaseService'; // Import your API functions
import { Meal } from '@/src/types';
import { useRouter } from 'expo-router';

const SeeAllMeals = () => {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const data = await fetchLocalMeals();
        setMeals(data);
      } catch (error) {
        console.error('Error loading meals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMeals();
  }, []);

  const handleMealPress = (meal: Meal) => {
    router.push({
        pathname: '/(main)/SeeAll/SeeAllLocal',
        params: { Meal}
    });
  };

  const renderMealItem = ({ item }: { item: Meal }) => (
    <TouchableOpacity 
      style={styles.mealCard}
      onPress={() => handleMealPress(item)}
    >
      <Image source={item.image} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.restaurantName}>{item.restaurant}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{item.price} FCFA</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name='star' size={16} color='#FFD700' />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E35F21" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Local Meals</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        {['all', 'popular', 'breakfast', 'lunch', 'dinner'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              category === cat && styles.activeCategory
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[
              styles.categoryText,
              category === cat && styles.activeCategoryText
            ]}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Meal List */}
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={renderMealItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fast-food-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No meals found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
  },
  categoryText: {
    color: '#666',
  },
  activeCategory: {
    backgroundColor: '#E35F21',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  mealCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  mealInfo: {
    padding: 10,
  },
  mealName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  restaurantName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E35F21',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 3,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    color: '#999',
    fontSize: 16,
  },
});

export default SeeAllMeals;