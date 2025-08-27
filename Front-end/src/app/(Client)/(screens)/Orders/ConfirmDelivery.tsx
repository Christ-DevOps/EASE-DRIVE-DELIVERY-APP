import { View, Text, Image, ScrollView,TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNav } from '@/src/context/NavigationContext';
import { Ionicons } from '@expo/vector-icons';

const MealDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { goBack, navigateToReviews } = useNav();
  
  // Mock data
  const meal = {
    id: id as string,
    name: "Grilled Salmon",
    description: "Fresh salmon fillet grilled to perfection with herbs and lemon, served with seasonal vegetables.",
    price: "18.99",
    rating: 4.8,
    reviewCount: 124,
    image: "https://source.unsplash.com/random/800x600?salmon",
    calories: 420,
    preparationTime: "20-25 min"
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: meal.image }} style={styles.headerImage} />
      
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>{meal.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#FFC107" />
          <Text style={styles.ratingText}>{meal.rating} ({meal.reviewCount} reviews)</Text>
          <TouchableOpacity onPress={navigateToReviews} style={styles.reviewsButton}>
            <Text style={styles.reviewsText}>View Reviews</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.description}>{meal.description}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="flame" size={20} color="#FF7622" />
            <Text style={styles.detailText}>{meal.calories} kcal</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={20} color="#FF7622" />
            <Text style={styles.detailText}>{meal.preparationTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cash" size={20} color="#FF7622" />
            <Text style={styles.detailText}>{meal.price} frs</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerImage: {
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#181C2E',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  reviewsButton: {
    marginLeft: 15,
  },
  reviewsText: {
    color: '#FF7622',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 25,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    marginTop: 5,
    fontSize: 14,
    color: '#777',
  },
  addToCartButton: {
    backgroundColor: '#FF7622',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MealDetailsScreen;