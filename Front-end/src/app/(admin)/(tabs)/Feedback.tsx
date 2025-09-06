import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Replace these with your actual primary colors
const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  orange: '#FF9500',
  purple: '#AF52DE',
};

const FEEDBACK_STATUS = {
  PENDING: 'pending',
  RESPONDED: 'responded',
  RESOLVED: 'resolved',
};

const FEEDBACK_TYPES = {
  COMPLAINT: 'complaint',
  SUGGESTION: 'suggestion',
  COMPLIMENT: 'compliment',
  BUG_REPORT: 'bug_report',
  GENERAL: 'general',
};

export default function FeedbackScreen() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with your actual API calls
  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = () => {
    // Mock feedback data
    const mockFeedbacks = [
      {
        id: '1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        type: FEEDBACK_TYPES.COMPLAINT,
        title: 'Delivery was late',
        message: 'My order was delivered 45 minutes late and the food was cold. This is unacceptable for a premium service.',
        rating: 2,
        status: FEEDBACK_STATUS.PENDING,
        createdAt: '2024-12-10T10:30:00Z',
        adminResponse: null,
        orderId: 'ORD-001',
      },
      {
        id: '2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        type: FEEDBACK_TYPES.COMPLIMENT,
        title: 'Excellent service!',
        message: 'The delivery was super fast and the driver was very polite. Keep up the great work!',
        rating: 5,
        status: FEEDBACK_STATUS.RESPONDED,
        createdAt: '2024-12-09T15:20:00Z',
        adminResponse: 'Thank you so much for your kind words! We really appreciate your feedback.',
        respondedAt: '2024-12-09T16:00:00Z',
        orderId: 'ORD-002',
      },
      {
        id: '3',
        userName: 'Mike Johnson',
        userEmail: 'mike@example.com',
        type: FEEDBACK_TYPES.SUGGESTION,
        title: 'Add vegetarian options',
        message: 'It would be great if you could add more vegetarian and vegan options to the menu.',
        rating: 4,
        status: FEEDBACK_STATUS.RESOLVED,
        createdAt: '2024-12-08T12:15:00Z',
        adminResponse: 'Great suggestion! We are working with our partner restaurants to expand vegetarian options.',
        respondedAt: '2024-12-08T14:30:00Z',
        orderId: null,
      },
      {
        id: '4',
        userName: 'Sarah Wilson',
        userEmail: 'sarah@example.com',
        type: FEEDBACK_TYPES.BUG_REPORT,
        title: 'App crashes on payment',
        message: 'The app keeps crashing when I try to make a payment using my credit card.',
        rating: 1,
        status: FEEDBACK_STATUS.PENDING,
        createdAt: '2024-12-07T09:45:00Z',
        adminResponse: null,
        orderId: null,
      },
    ];
    setFeedbacks(mockFeedbacks);
    setFilteredFeedbacks(mockFeedbacks);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFeedbacks();
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    filterFeedbacks();
  }, [selectedFilter, searchQuery, feedbacks]);

  const filterFeedbacks = () => {
    let filtered = feedbacks;

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(feedback => feedback.status === selectedFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(feedback =>
        feedback.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFeedbacks(filtered);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case FEEDBACK_TYPES.COMPLAINT: return 'alert-circle';
      case FEEDBACK_TYPES.SUGGESTION: return 'bulb';
      case FEEDBACK_TYPES.COMPLIMENT: return 'heart';
      case FEEDBACK_TYPES.BUG_REPORT: return 'bug';
      default: return 'chatbubble';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case FEEDBACK_TYPES.COMPLAINT: return COLORS.danger;
      case FEEDBACK_TYPES.SUGGESTION: return COLORS.warning;
      case FEEDBACK_TYPES.COMPLIMENT: return COLORS.success;
      case FEEDBACK_TYPES.BUG_REPORT: return COLORS.purple;
      default: return COLORS.textSecondary;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case FEEDBACK_STATUS.PENDING: return COLORS.warning;
      case FEEDBACK_STATUS.RESPONDED: return COLORS.primary;
      case FEEDBACK_STATUS.RESOLVED: return COLORS.success;
      default: return COLORS.textSecondary;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color={COLORS.warning}
          />
        ))}
      </View>
    );
  };

  const handleRespond = (feedback) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.adminResponse || '');
    setIsResponseModalVisible(true);
  };

  const submitResponse = () => {
    if (!responseText.trim()) {
      Alert.alert('Error', 'Please enter a response');
      return;
    }

    // Update feedback with response
    const updatedFeedbacks = feedbacks.map(feedback =>
      feedback.id === selectedFeedback.id
        ? {
            ...feedback,
            adminResponse: responseText,
            status: FEEDBACK_STATUS.RESPONDED,
            respondedAt: new Date().toISOString(),
          }
        : feedback
    );

    setFeedbacks(updatedFeedbacks);
    setIsResponseModalVisible(false);
    setResponseText('');
    setSelectedFeedback(null);

    Alert.alert('Success', 'Response sent successfully');
  };

  const markAsResolved = (feedbackId) => {
    const updatedFeedbacks = feedbacks.map(feedback =>
      feedback.id === feedbackId
        ? { ...feedback, status: FEEDBACK_STATUS.RESOLVED }
        : feedback
    );
    setFeedbacks(updatedFeedbacks);
  };

  const renderFeedbackItem = ({ item }) => (
    <TouchableOpacity style={styles.feedbackCard} activeOpacity={0.7}>
      <View style={styles.feedbackHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.userEmail}>{item.userEmail}</Text>
        </View>
        <View style={styles.typeIndicator}>
          <Ionicons
            name={getTypeIcon(item.type)}
            size={20}
            color={getTypeColor(item.type)}
          />
        </View>
      </View>

      <Text style={styles.feedbackTitle}>{item.title}</Text>
      <Text style={styles.feedbackMessage} numberOfLines={3}>{item.message}</Text>

      <View style={styles.feedbackMeta}>
        <View style={styles.leftMeta}>
          {renderStars(item.rating)}
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          {item.orderId && <Text style={styles.orderText}>Order: {item.orderId}</Text>}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      {item.adminResponse && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel}>Admin Response:</Text>
          <Text style={styles.responseText}>{item.adminResponse}</Text>
          <Text style={styles.responseDate}>Responded: {formatDate(item.respondedAt)}</Text>
        </View>
      )}

      <View style={styles.actionButtons}>
        {item.status !== FEEDBACK_STATUS.RESOLVED && (
          <TouchableOpacity
            style={[styles.actionButton, styles.respondButton]}
            onPress={() => handleRespond(item)}
          >
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.surface} />
            <Text style={styles.actionButtonText}>
              {item.adminResponse ? 'Edit Response' : 'Respond'}
            </Text>
          </TouchableOpacity>
        )}

        {item.status === FEEDBACK_STATUS.RESPONDED && (
          <TouchableOpacity
            style={[styles.actionButton, styles.resolveButton]}
            onPress={() => markAsResolved(item.id)}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.surface} />
            <Text style={styles.actionButtonText}>Mark Resolved</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const filterOptions = [
    { key: 'all', label: 'All', count: feedbacks.length },
    { key: FEEDBACK_STATUS.PENDING, label: 'Pending', count: feedbacks.filter(f => f.status === FEEDBACK_STATUS.PENDING).length },
    { key: FEEDBACK_STATUS.RESPONDED, label: 'Responded', count: feedbacks.filter(f => f.status === FEEDBACK_STATUS.RESPONDED).length },
    { key: FEEDBACK_STATUS.RESOLVED, label: 'Resolved', count: feedbacks.filter(f => f.status === FEEDBACK_STATUS.RESOLVED).length },
  ];

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search feedback..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterTab,
              selectedFilter === option.key && styles.activeFilterTab,
            ]}
            onPress={() => setSelectedFilter(option.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === option.key && styles.activeFilterText,
              ]}
            >
              {option.label} ({option.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Feedback List */}
      <FlatList
        data={filteredFeedbacks}
        renderItem={renderFeedbackItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />

      {/* Response Modal */}
      <Modal
        visible={isResponseModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsResponseModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Respond to Feedback</Text>
            <TouchableOpacity onPress={submitResponse}>
              <Text style={styles.saveButton}>Send</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedFeedback && (
              <View style={styles.feedbackPreview}>
                <Text style={styles.previewTitle}>{selectedFeedback.title}</Text>
                <Text style={styles.previewMessage}>{selectedFeedback.message}</Text>
                <Text style={styles.previewUser}>- {selectedFeedback.userName}</Text>
              </View>
            )}

            <View style={styles.responseInputContainer}>
              <Text style={styles.responseInputLabel}>Your Response:</Text>
              <TextInput
                style={styles.responseInput}
                value={responseText}
                onChangeText={setResponseText}
                placeholder="Type your response here..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  filterContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeFilterText: {
    color: COLORS.surface,
  },
  listContainer: {
    padding: 16,
  },
  feedbackCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  typeIndicator: {
    padding: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  feedbackMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  feedbackMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftMeta: {
    flex: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  orderText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.surface,
  },
  responseContainer: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  responseDate: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  respondButton: {
    backgroundColor: COLORS.primary,
  },
  resolveButton: {
    backgroundColor: COLORS.success,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.surface,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  cancelButton: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  feedbackPreview: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  previewMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  previewUser: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  responseInputContainer: {
    flex: 1,
  },
  responseInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  responseInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: COLORS.surface,
    minHeight: 120,
    textAlignVertical: 'top',
  },
});