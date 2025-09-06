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
};

export default function AddNewScreen() {
  const [activeTab, setActiveTab] = useState('agent'); // 'agent' or 'partner'
  const [agents, setAgents] = useState([]);
  const [partners, setPartners] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    // Additional fields for partner
    companyName: '',
    businessType: '',
  });

  // Mock data - replace with your actual data source
  useEffect(() => {
    setAgents([
      { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890', address: '123 Main St' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321', address: '456 Oak Ave' },
    ]);
    setPartners([
      { id: '1', name: 'Mike Johnson', email: 'mike@company.com', phone: '+1122334455', companyName: 'ABC Corp', businessType: 'Restaurant' },
    ]);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      companyName: '',
      businessType: '',
    });
    setEditingItem(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Confirmation',
      `Are you sure you want to delete this ${activeTab}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (activeTab === 'agent') {
              setAgents(agents.filter(agent => agent.id !== id));
            } else {
              setPartners(partners.filter(partner => partner.id !== id));
            }
          },
        },
      ]
    );
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (editingItem) {
      // Update existing item
      if (activeTab === 'agent') {
        setAgents(agents.map(agent => 
          agent.id === editingItem.id ? { ...formData, id: editingItem.id } : agent
        ));
      } else {
        setPartners(partners.map(partner => 
          partner.id === editingItem.id ? { ...formData, id: editingItem.id } : partner
        ));
      }
    } else {
      // Add new item
      const newItem = { ...formData, id: Date.now().toString() };
      if (activeTab === 'agent') {
        setAgents([...agents, newItem]);
      } else {
        setPartners([...partners, newItem]);
      }
    }

    setIsModalVisible(false);
    resetForm();
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemEmail}>{item.email}</Text>
          <Text style={styles.itemPhone}>{item.phone}</Text>
          {activeTab === 'partner' && (
            <Text style={styles.itemCompany}>{item.companyName}</Text>
          )}
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.surface} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const currentData = activeTab === 'agent' ? agents : partners;

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'agent' && styles.activeTab]}
          onPress={() => setActiveTab('agent')}
        >
          <Ionicons 
            name="bicycle-outline" 
            size={20} 
            color={activeTab === 'agent' ? COLORS.surface : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'agent' && styles.activeTabText]}>
            Delivery Agents
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'partner' && styles.activeTab]}
          onPress={() => setActiveTab('partner')}
        >
          <Ionicons 
            name="business-outline" 
            size={20} 
            color={activeTab === 'partner' ? COLORS.surface : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'partner' && styles.activeTabText]}>
            Partners
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Ionicons name="add" size={24} color={COLORS.surface} />
        <Text style={styles.addButtonText}>Add New {activeTab === 'agent' ? 'Agent' : 'Partner'}</Text>
      </TouchableOpacity>

      {/* List */}
      <FlatList
        data={currentData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit' : 'Add'} {activeTab === 'agent' ? 'Agent' : 'Partner'}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone *</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>

            {activeTab === 'agent' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Enter address"
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}

            {activeTab === 'partner' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Company Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.companyName}
                    onChangeText={(text) => setFormData({ ...formData, companyName: text })}
                    placeholder="Enter company name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Business Type</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.businessType}
                    onChangeText={(text) => setFormData({ ...formData, businessType: text })}
                    placeholder="e.g. Restaurant, Grocery, etc."
                  />
                </View>
              </>
            )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.surface,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  itemPhone: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  itemCompany: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: COLORS.surface,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});