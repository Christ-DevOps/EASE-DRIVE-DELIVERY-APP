// app/(main)/feedback/FeedbackPage.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface FeedbackCategory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
}

interface FeedbackData {
  category: string;
  rating: number;
  title: string;
  description: string;
  userInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

const feedbackCategories: FeedbackCategory[] = [
  {
    id: 'order',
    title: 'Order Issue',
    icon: 'restaurant-outline',
    color: '#FF7622',
    backgroundColor: '#FFF5F5',
  },
  {
    id: 'delivery',
    title: 'Delivery Problem',
    icon: 'car-outline',
    color: '#4ECDC4',
    backgroundColor: '#F0FDFC',
  },
  {
    id: 'payment',
    title: 'Payment Issue',
    icon: 'card-outline',
    color: '#45B7D1',
    backgroundColor: '#F0F9FF',
  },
  {
    id: 'app',
    title: 'App Bug',
    icon: 'phone-portrait-outline',
    color: '#96CEB4',
    backgroundColor: '#F0FDF4',
  },
  {
    id: 'service',
    title: 'Customer Service',
    icon: 'people-outline',
    color: '#FECA57',
    backgroundColor: '#FFFBEB',
  },
  {
    id: 'other',
    title: 'Other',
    icon: 'chatbubble-outline',
    color: '#A55EEA',
    backgroundColor: '#FAF5FF',
  },
];

const FeedbackPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [feedbackTitle, setFeedbackTitle] = useState<string>('');
  const [feedbackDescription, setFeedbackDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleRatingPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const validateForm = (): boolean => {
    if (!selectedCategory) {
      Alert.alert('Missing Category', 'Please select a feedback category.');
      return false;
    }
    if (rating === 0) {
      Alert.alert('Missing Rating', 'Please provide a rating for your experience.');
      return false;
    }
    if (!feedbackTitle.trim()) {
      Alert.alert('Missing Title', 'Please provide a brief title for your feedback.');
      return false;
    }
    if (!feedbackDescription.trim()) {
      Alert.alert('Missing Description', 'Please describe your feedback in detail.');
      return false;
    }
    return true;
  };

  const submitFeedback = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const feedbackData: FeedbackData = {
        category: selectedCategory,
        rating,
        title: feedbackTitle.trim(),
        description: feedbackDescription.trim(),
        userInfo: {
          name: 'Tangomo Pujalte', // This would come from user context
          email: 'example@gmail.com',
          phone: '+237 680-589-567',
        },
      };

      // TODO: Replace with actual API call
      console.log('Submitting feedback:', feedbackData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Feedback Submitted!',
        'Thank you for your feedback. Our team will review it and get back to you soon.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Submission Failed',
        'There was an error submitting your feedback. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryData = feedbackCategories.find(cat => cat.id === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#181C2E" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Send Feedback</Text>
          
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's your feedback about?</Text>
            <View style={styles.categoriesGrid}>
              {feedbackCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: category.backgroundColor,
                      borderColor: selectedCategory === category.id ? category.color : 'transparent',
                      borderWidth: selectedCategory === category.id ? 2 : 0,
                    }
                  ]}
                  onPress={() => handleCategorySelect(category.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={category.icon} 
                    size={24} 
                    color={category.color} 
                  />
                  <Text style={[styles.categoryText, { color: category.color }]}>
                    {category.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How would you rate your experience?</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRatingPress(star)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color={star <= rating ? '#FFD700' : '#E5E7EB'}
                    style={styles.star}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingText}>
              {rating === 0 ? 'Tap to rate' : 
               rating === 1 ? 'Poor' :
               rating === 2 ? 'Fair' :
               rating === 3 ? 'Good' :
               rating === 4 ? 'Very Good' :
               'Excellent'}
            </Text>
          </View>

          {/* Feedback Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tell us more</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.titleInput}
                placeholder="Brief title for your feedback"
                placeholderTextColor="#A0A5BA"
                value={feedbackTitle}
                onChangeText={setFeedbackTitle}
                maxLength={100}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Describe your experience in detail. What happened? How can we improve?"
                placeholderTextColor="#A0A5BA"
                value={feedbackDescription}
                onChangeText={setFeedbackDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>
            
            <Text style={styles.characterCount}>
              {feedbackDescription.length}/500 characters
            </Text>
          </View>

          {/* Selected Category Summary */}
          {selectedCategoryData && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <Ionicons 
                  name={selectedCategoryData.icon} 
                  size={20} 
                  color={selectedCategoryData.color} 
                />
                <Text style={styles.summaryText}>
                  {selectedCategoryData.title} • {rating} star{rating !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { opacity: isSubmitting ? 0.7 : 1 }
            ]}
            onPress={submitFeedback}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Submitting...</Text>
            ) : (
              <>
                <MaterialIcons name="send" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FeedbackPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 40,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F5FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181C2E',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181C2E',
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  star: {
    marginHorizontal: 4,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  inputContainer: {
    backgroundColor: '#F6F8FA',
    borderRadius: 12,
    marginBottom: 15,
  },
  titleInput: {
    padding: 15,
    fontSize: 16,
    color: '#181C2E',
  },
  descriptionInput: {
    padding: 15,
    fontSize: 16,
    color: '#181C2E',
    minHeight: 120,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#A0A5BA',
    marginTop: -10,
  },
  summaryCard: {
    backgroundColor: '#F0F5FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181C2E',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  submitButton: {
    backgroundColor: '#FF7622',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#FF7622',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});