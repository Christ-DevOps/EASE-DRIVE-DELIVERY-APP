// app/components/RestaurantCard.tsx
import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Restaurant } from '@/src/types';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

type Props = {
  item: Restaurant;
};

export default function RestaurantCard({ item }: Props) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() =>
        router.push({
          pathname: '/(Client)/(screens)/resto/restaurantDetails',
          params: { id: item.id }
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={Array.isArray(item.image) ? item.image[0] : item.image} 
          style={styles.image}
          resizeMode="cover"
        />
        {/* Optional: Add a gradient overlay or favorite button */}
        <View style={styles.imageOverlay} />
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={14} color="#FF7622" />
          <Text style={styles.location} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
          )}
        </View>
        
        <View style={styles.details}>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          
          <View style={styles.deliveryInfo}>
            <Text style={styles.fee}>{item.deliveryFee}</Text>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={12} color="#FF7622" />
              <Text style={styles.time}>{item.deliveryTime}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.75,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 0.5,
    borderColor: '#F0F0F0',
  },
  
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.05)', // Subtle overlay for better text contrast
  },
  
  info: {
    padding: 16,
  },
  
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 22,
  },
  
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  location: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  
  tag: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1E9FF',
  },
  
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#2563EB',
  },
  
  moreTagsText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888888',
    alignSelf: 'center',
    marginLeft: 4,
  },
  
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE8D6',
  },
  
  ratingText: {
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 13,
    color: '#1A1A1A',
  },
  
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  fee: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  time: {
    color: '#FF7622',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});