import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const API_URL = 'http://192.168.100.54:5000/api'; // Replace with your backend URL

const AdminRequestsScreen = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'partner', 'delivery_agent'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState([]);

  // Fetch pending requests from backend
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('adminToken'); // Assuming admin has a separate token
      
      // Fetch pending partners
      const partnerResponse = await axios.get(`${API_URL}/admin/partners/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch pending delivery agents
      const deliveryAgentResponse = await axios.get(`${API_URL}/admin/delivery-agents/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Format and combine the data
      const partnerRequests = partnerResponse.data.map(partner => ({
        id: partner._id,
        type: 'partner',
        name: partner.restaurantName,
        email: partner.user?.email || 'N/A',
        phone: partner.user?.phone || 'N/A',
        location: partner.restaurantLocation || partner.address || 'N/A',
        submittedAt: partner.createdAt || new Date(),
        description: partner.description,
        categories: partner.categories || [],
        bankAccount: partner.BankAccount,
        documents: partner.documents || [],
        status: partner.approved === false ? 'pending' : partner.approved ? 'approved' : 'pending'
      }));

      const deliveryAgentRequests = deliveryAgentResponse.data.map(agent => ({
        id: agent._id,
        type: 'delivery_agent',
        name: agent.name || agent.user?.name || 'N/A',
        email: agent.user?.email || 'N/A',
        phone: agent.user?.phone || 'N/A',
        location: agent.address || 'N/A',
        submittedAt: agent.createdAt || new Date(),
        vehicleType: agent.vehicleType,
        vehicleImmatriculation: agent.vehicleImmatriculation,
        idCard: agent.IDcard,
        documents: agent.documents || [],
        status: agent.approved === false ? 'pending' : agent.approved ? 'approved' : 'pending'
      }));

      setRequests([...partnerRequests, ...deliveryAgentRequests]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Error', 'Failed to fetch registration requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPendingRequests();
    setRefreshing(false);
  };

  const handleApproveRequest = async (id, type) => {
    Alert.alert(
      'Approve Request',
      `Are you sure you want to approve this ${type === 'partner' ? 'partner' : 'delivery agent'} request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            setLoading(true);
            try {
              const token = await AsyncStorage.getItem('adminToken');
              const endpoint = type === 'partner' 
                ? `${API_URL}/admin/partners/${id}/approve`
                : `${API_URL}/admin/delivery-agents/${id}/approve`;
              
              await axios.patch(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              await fetchPendingRequests();
              setSelectedRequest(null);
              Alert.alert('Success', `${type === 'partner' ? 'Partner' : 'Delivery Agent'} approved successfully!`);
            } catch (error) {
              console.error('Error approving request:', error);
              Alert.alert('Error', 'Failed to approve request');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRejectRequest = async (id, type) => {
    Alert.alert(
      'Reject Request',
      `Are you sure you want to reject this ${type === 'partner' ? 'partner' : 'delivery agent'} request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const token = await AsyncStorage.getItem('adminToken');
              const endpoint = type === 'partner' 
                ? `${API_URL}/admin/partners/${id}/reject`
                : `${API_URL}/admin/delivery-agents/${id}/reject`;
              
              await axios.patch(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              await fetchPendingRequests();
              setSelectedRequest(null);
              Alert.alert('Request Rejected', `${type === 'partner' ? 'Partner' : 'Delivery Agent'} request has been rejected.`);
            } catch (error) {
              console.error('Error rejecting request:', error);
              Alert.alert('Error', 'Failed to reject request');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm);
    
    const matchesType = filterType === 'all' || request.type === filterType;
    
    return matchesSearch && matchesType && request.status === 'pending';
  });

  const RequestCard = ({ request }) => (
    <TouchableOpacity 
      style={styles.requestCard}
      onPress={() => setSelectedRequest(request)}
    >
      <View style={styles.requestHeader}>
        <View style={styles.requestInfo}>
          <View style={styles.typeContainer}>
            <Ionicons 
              name={request.type === 'partner' ? 'storefront' : 'bicycle'} 
              size={24} 
              color={request.type === 'partner' ? '#FF7622' : '#3B82F6'} 
            />
            <Text style={styles.requestName}>{request.name}</Text>
          </View>
          <View style={[
            styles.typeBadge, 
            { backgroundColor: request.type === 'partner' ? '#FEF3E2' : '#EBF4FF' }
          ]}>
            <Text style={[
              styles.typeBadgeText,
              { color: request.type === 'partner' ? '#FF7622' : '#3B82F6' }
            ]}>
              {request.type === 'partner' ? 'Restaurant' : 'Delivery Agent'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.viewButton}>
          <Ionicons name="eye" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.requestDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="mail" size={14} color="#6B7280" />
          <Text style={styles.detailText}>{request.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call" size={14} color="#6B7280" />
          <Text style={styles.detailText}>{request.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={14} color="#6B7280" />
          <Text style={styles.detailText}>{request.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={14} color="#6B7280" />
          <Text style={styles.detailText}>
            {new Date(request.submittedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleApproveRequest(request.id, request.type)}
        >
          <Ionicons name="checkmark-circle" size={16} color="white" />
          <Text style={styles.approveButtonText}>Approve</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleRejectRequest(request.id, request.type)}
        >
          <Ionicons name="close-circle" size={16} color="white" />
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const RequestDetailModal = ({ request, visible, onClose }) => {
    if (!request) return null;

    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Request Details</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalSection}>
              <View style={styles.requestTypeHeader}>
                <Ionicons 
                  name={request.type === 'partner' ? 'storefront' : 'bicycle'} 
                  size={32} 
                  color={request.type === 'partner' ? '#FF7622' : '#3B82F6'} 
                />
                <View style={styles.requestTypeInfo}>
                  <Text style={styles.modalRequestName}>{request.name}</Text>
                  <Text style={styles.modalRequestType}>
                    {request.type === 'partner' ? 'Restaurant Partner' : 'Delivery Agent'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Ionicons name="mail" size={16} color="#6B7280" />
                  <Text style={styles.infoText}>{request.email}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="call" size={16} color="#6B7280" />
                  <Text style={styles.infoText}>{request.phone}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="location" size={16} color="#6B7280" />
                  <Text style={styles.infoText}>{request.location}</Text>
                </View>
              </View>
            </View>

            {request.type === 'partner' && (
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Business Information</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Ionicons name="restaurant" size={16} color="#6B7280" />
                    <Text style={styles.infoText}>{request.categories.join(', ')}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="card" size={16} color="#6B7280" />
                    <Text style={styles.infoText}>Account: {request.bankAccount}</Text>
                  </View>
                </View>
                <Text style={styles.descriptionTitle}>Description:</Text>
                <Text style={styles.descriptionText}>{request.description}</Text>
              </View>
            )}

            {request.type === 'delivery_agent' && (
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Agent Information</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Ionicons name="car" size={16} color="#6B7280" />
                    <Text style={styles.infoText}>{request.vehicleType}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="barcode" size={16} color="#6B7280" />
                    <Text style={styles.infoText}>{request.vehicleImmatriculation}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="card" size={16} color="#6B7280" />
                    <Text style={styles.infoText}>ID: {request.idCard}</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>Submitted Documents</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {request.documents.map((doc, index) => (
                  <TouchableOpacity key={index} style={styles.documentItem}>
                    {doc.includes('.jpg') || doc.includes('.png') || doc.includes('.jpeg') ? (
                      <Image source={{ uri: doc }} style={styles.documentImage} />
                    ) : (
                      <View style={styles.documentFile}>
                        <Ionicons name="document" size={32} color="#6B7280" />
                        <Text style={styles.documentText} numberOfLines={1}>
                          {doc.split('/').pop()}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>Submission Details</Text>
              <View style={styles.infoItem}>
                <Ionicons name="calendar" size={16} color="#6B7280" />
                <Text style={styles.infoText}>
                  Submitted: {new Date(request.submittedAt).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.approveButton]}
                onPress={() => handleApproveRequest(request.id, request.type)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={18} color="white" />
                    <Text style={styles.modalButtonText}>Approve</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.rejectButton]}
                onPress={() => handleRejectRequest(request.id, request.type)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="close-circle" size={18} color="white" />
                    <Text style={styles.modalButtonText}>Reject</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registration Requests</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, or phone"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'all' && styles.activeFilter]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterText, filterType === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'partner' && styles.activeFilter]}
          onPress={() => setFilterType('partner')}
        >
          <Text style={[styles.filterText, filterType === 'partner' && styles.activeFilterText]}>
            Restaurants
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'delivery_agent' && styles.activeFilter]}
          onPress={() => setFilterType('delivery_agent')}
        >
          <Text style={[styles.filterText, filterType === 'delivery_agent' && styles.activeFilterText]}>
            Delivery Agents
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRequests}
        renderItem={({ item }) => <RequestCard request={item} />}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#FF7622" style={styles.loader} />
          ) : (
            <Text style={styles.noResults}>No pending requests found</Text>
          )
        }
        contentContainerStyle={styles.listContent}
      />

      <RequestDetailModal
        request={selectedRequest}
        visible={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  placeholder: {
    width: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#FF7622',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  loader: {
    marginTop: 32,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#6B7280',
  },
  requestCard: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  typeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  viewButton: {
    padding: 8,
  },
  requestDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  approveButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
  },
  rejectButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSection: {
    marginBottom: 24,
  },
  requestTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  requestTypeInfo: {
    marginLeft: 12,
  },
  modalRequestName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
  },
  modalRequestType: {
    fontSize: 14,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  infoGrid: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  documentItem: {
    marginRight: 12,
    alignItems: 'center',
  },
  documentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  documentFile: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  documentText: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  modalActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AdminRequestsScreen;