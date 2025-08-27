// app/components/CategoryCard.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '@/src/types'

type Props = {
  item: Category;
  onPress?: (item: any) => void;
};

export default function CategoryCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(item)}
      style={[styles.card, { backgroundColor: item.color }]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={22} color="#FF7622" />
      </View>
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    borderRadius: 20,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});