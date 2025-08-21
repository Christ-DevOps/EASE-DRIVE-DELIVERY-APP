// app/components/MealCard.tsx
import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Meal } from '@/src/types';

type Props = {
  item: any;
  onAddToCart?: (item: Meal ) => void;
  onPress?: () => void;
};

export default function MealCard({ item, onAddToCart, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.restaurant} numberOfLines={1}>{item.restaurant}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{item.price} frs</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={() => onAddToCart && onAddToCart(item)}>
        <Ionicons name="add" size={18} color="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    marginBottom: 12, 
    overflow: 'hidden', 
    elevation: 2 ,
  padding: 10},

  image: { 
    width: 100, 
    height: 100, 
    resizeMode: 'cover' 
  },
  info: { 
    flex: 1, 
    padding: 12, 
    justifyContent: 'center' 
  },
  name: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
  restaurant: { color: '#666', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: '#FF7622', fontWeight: '700' },
  rating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8F2', padding: 6, borderRadius: 8 },
  ratingText: { marginLeft: 6 },
  addBtn: { position: 'absolute', right: 12, bottom: 70, backgroundColor: '#FF7622', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});