// src/screens/FilteredResults.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchPopularRestaurants } from '@/src/services/databaseService';
import { Restaurant } from '@/src/types';
import { SafeAreaView } from 'react-native';

const FilteredResults = () => {
  const params = useLocalSearchParams();
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const loadAndFilterRestaurants = async () => {
      try {
        const allRestaurants = await fetchPopularRestaurants();
        const filters = params.filters ? JSON.parse(params.filters as string) : null;
        const searchQuery = params.searchQuery as string || '';

        let results = allRestaurants;

        // Apply filters if they exist
        if (filters) {
          results = results.filter(restaurant => {
            // Rating filter
            if (restaurant.rating < filters.minRating) return false;
            
            // Distance filter (mock implementation - in real app you'd use location data)
            const distance = parseFloat(restaurant.location.split('km')[0]);
            if (distance > filters.maxDistance) return false;
            
            // Price range filter (check if any menu item falls within range)
            const hasMatchingPrice = restaurant.menu?.some(item => 
              item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
            );
            if (!hasMatchingPrice) return false;
            
            // Category filter (check if restaurant has any matching tags)
            if (filters.categories.length > 0) {
              const hasMatchingCategory = restaurant.tags.some(tag => 
                filters.categories.some(catId => 
                  tag.toLowerCase().includes(
                    params.categories?.find(c => c.id === catId)?.name.toLowerCase() || ''
                  )
                )
              );
              if (!hasMatchingCategory) return false;
            }
            
            return true;
          });
        }

        // Apply search query if it exists
        if (searchQuery) {
          results = results.filter(restaurant => 
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        }

        setFilteredRestaurants(results);
      } catch (error) {
        console.error('Error filtering restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAndFilterRestaurants();
  }, [params]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filtered Results</Text>
        <Text style={styles.resultCount}>{filteredRestaurants.length} restaurants found</Text>
      </View>

      {filteredRestaurants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="sad-outline" size={48} color="#888" />
          <Text style={styles.emptyText}>No restaurants match your filters</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRestaurants}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.restaurantCard}>
              <Image 
                source={Array.isArray(item.image) ? item.image[0] : item.image} 
                style={styles.restaurantImage} 
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <View style={styles.detailsRow}>
                  <Ionicons name="star" size={16} color="#FF7622" />
                  <Text style={styles.rating}>{item.rating}</Text>
                  <Text style={styles.distance}>{item.location.split('•')[0].trim()}</Text>
                </View>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resultCount: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
  },
  restaurantCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  restaurantInfo: {
    flex: 1,
    padding: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    marginRight: 12,
    color: '#FF7622',
  },
  distance: {
    color: '#888',
  },
  description: {
    color: '#666',
    fontSize: 14,
  },
});

export default FilteredResults;