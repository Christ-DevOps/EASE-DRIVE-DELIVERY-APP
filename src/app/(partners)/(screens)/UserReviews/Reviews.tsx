// app/(partner)/ReviewsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

type Review = {
  id: string;
  username: string;
  comment: string;
  rating: number;
  date: string;
};

const ReviewsScreen = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const mockData: Review[] = [
          {
            id: '1',
            username: 'John Smith',
            comment: 'The burger was amazing! Will definitely order again.',
            rating: 5,
            date: '2023-06-15'
          },
          {
            id: '2',
            username: 'Sarah Johnson',
            comment: 'Good food but delivery was a bit late. Pizza was delicious though.',
            rating: 4,
            date: '2023-06-14'
          },
          {
            id: '3',
            username: 'Michael Brown',
            comment: 'The salad was fresh and tasty. Portion size was perfect.',
            rating: 5,
            date: '2023-06-13'
          },
          {
            id: '4',
            username: 'Emily Davis',
            comment: 'Chocolate cake was too sweet for my taste, but overall good experience.',
            rating: 3,
            date: '2023-06-12'
          },
          {
            id: '5',
            username: 'David Wilson',
            comment: 'Best pizza in town! Crust was perfectly crispy.',
            rating: 5,
            date: '2023-06-10'
          },
        ];
        
        setReviews(mockData);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7622" />
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} >
        <View style={styles.header}>
          <Text style={styles.title}>Customer Reviews</Text>
          <Text style={styles.subtitle}>Feedback from your customers</Text>
        </View>

        {reviews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="reviews" size={60} color="#9E9E9E" />
            <Text style={styles.emptyText}>No reviews yet</Text>
            <Text style={styles.emptySubtext}>Your customers haven't left any feedback</Text>
          </View>
        ) : (
          reviews.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.username}>{review.username}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{review.rating}/5</Text>
                  <MaterialIcons name="star" size={20} color="#FFC107" />
                </View>
              </View>
              
              <Text style={styles.date}>{review.date}</Text>
              
              <Text style={styles.comment}>{review.comment}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FA',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F5FA',
  },
  loadingText: {
    marginTop: 20,
    color: '#666',
    fontFamily: 'SpaceMono',
  },
  header: {
    padding: 20,
    backgroundColor: '#0A1F33',
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    color: '#FFFFFF99',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    marginTop: 5,
  },
  emptyContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    fontFamily: 'SpaceMono',
  },
  emptySubtext: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'SpaceMono',
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#333',
    marginRight: 5,
    fontFamily: 'SpaceMono',
  },
  date: {
    color: '#666',
    marginBottom: 15,
    fontFamily: 'SpaceMono',
  },
  comment: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'SpaceMono',
  },
});

export default ReviewsScreen;