// src/components/FilterModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Category } from '../types';

type FilterOptions = {
  minRating: number;
  maxDistance: number;
  priceRange: [number, number];
  categories: string[];
};

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  categories: Category[];
};

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, categories }) => {
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(10); // in km
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const handleApply = () => {
    onApply({
      minRating,
      maxDistance,
      priceRange,
      categories: selectedCategories,
    });
    onClose();
  };

  const handleReset = () => {
    setMinRating(0);
    setMaxDistance(10);
    setPriceRange([0, 10000]);
    setSelectedCategories([]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#FF7622" />
          </TouchableOpacity>
          <Text style={styles.title}>Filter Options</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Rating Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimum Rating</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{minRating.toFixed(1)}</Text>
              <Ionicons name="star" size={20} color="#FF7622" />
            </View>
            <Slider
              minimumValue={0}
              maximumValue={5}
              step={0.5}
              value={minRating}
              onValueChange={setMinRating}
              minimumTrackTintColor="#FF7622"
              maximumTrackTintColor="#ECF0F4"
              thumbTintColor="#FF7622"
            />
          </View>

          {/* Distance Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maximum Distance</Text>
            <Text style={styles.distanceText}>{maxDistance} km</Text>
            <Slider
              minimumValue={1}
              maximumValue={50}
              step={1}
              value={maxDistance}
              onValueChange={setMaxDistance}
              minimumTrackTintColor="#FF7622"
              maximumTrackTintColor="#ECF0F4"
              thumbTintColor="#FF7622"
            />
          </View>

          {/* Price Range Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <View style={styles.priceRangeContainer}>
              <Text style={styles.priceText}>{priceRange[0]} FCFA</Text>
              <Text style={styles.priceText}>{priceRange[1]} FCFA</Text>
            </View>
            <View style={styles.rangeSliderContainer}>
              <Slider
                style={styles.rangeSlider}
                minimumValue={0}
                maximumValue={10000}
                step={500}
                value={priceRange[0]}
                onValueChange={(value) => setPriceRange([value, priceRange[1]])}
                minimumTrackTintColor="#ECF0F4"
                maximumTrackTintColor="#ECF0F4"
                thumbTintColor="#FF7622"
              />
              <Slider
                style={styles.rangeSlider}
                minimumValue={0}
                maximumValue={10000}
                step={500}
                value={priceRange[1]}
                onValueChange={(value) => setPriceRange([priceRange[0], value])}
                minimumTrackTintColor="#ECF0F4"
                maximumTrackTintColor="#ECF0F4"
                thumbTintColor="#FF7622"
              />
            </View>
          </View>

          {/* Categories Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    {
                      backgroundColor: selectedCategories.includes(category.id) 
                        ? category.color 
                        : '#ECF0F4',
                    },
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  resetText: {
    color: '#FF7622',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    marginRight: 4,
    color: '#FF7622',
  },
  distanceText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    color: '#333',
  },
  rangeSliderContainer: {
    height: 40,
    justifyContent: 'center',
  },
  rangeSlider: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  categoryText: {
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#FF7622',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FilterModal;