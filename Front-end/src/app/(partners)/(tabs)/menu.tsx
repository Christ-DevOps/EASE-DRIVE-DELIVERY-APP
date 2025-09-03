import React, { useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, 
  TextInput, Image, Modal, Alert, Pressable, Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // <-- added

// Types
type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  popular: boolean;
  image: any; // can be require(...) or { uri: string }
};

const DEFAULT_IMAGE = require('@/src/assets/images/login-graphic.png');

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItem>({
    id: '',
    name: '',
    category: '',
    price: 0,
    description: '',
    popular: false,
    image: DEFAULT_IMAGE,
  });
  
  // Helper to resolve local/remote images
  const resolveImageSource = (image: any) => {
    if (!image) return DEFAULT_IMAGE;
    if (typeof image === 'string') return { uri: image }; // stored raw uri string
    if (image?.uri) return { uri: image.uri }; // object with uri
    return image; // require(...) number
  };

  // Filter menu items based on search
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open modal for adding new item
  const openAddModal = () => {
    setFormData({
      id: '',
      name: '',
      category: '',
      price: '',
      description: '',
      popular: false,
      image: DEFAULT_IMAGE,
    });
    setCurrentItem(null);
    setIsModalVisible(true);
  };

  // Open modal for editing item
  const openEditModal = (item: MenuItem) => {
    setCurrentItem(item);
    setFormData({ ...item });
    setIsModalVisible(true);
  };

  // Handle form input changes
  const handleInputChange = (field: keyof MenuItem, value: string | boolean | any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // --- IMAGE PICKER HANDLERS ---
  const pickImageFromLibrary = async () => {
    try {
      // Request permission first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant photo library permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      // `result` shape differs across SDKs; handle both
      const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri;

      if (!result.cancelled && uri) {
        // store as object with uri for consistency
        handleInputChange('image', { uri });
      }
    } catch (err) {
      console.error('ImagePicker error', err);
      Alert.alert('Error', 'Could not pick the image. Try again.');
    }
  };

  const removeSelectedImage = () => {
    handleInputChange('image', DEFAULT_IMAGE);
  };

  // Save menu item (add or update)
  const saveMenuItem = () => {
    if (!formData.name || !formData.category || !formData.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (currentItem) {
      // Update existing item
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === currentItem.id ? formData : item
        )
      );
    } else {
      // Add new item
      const newId = (menuItems.length === 0 ? 1 : Math.max(...menuItems.map(item => parseInt(item.id))) + 1).toString();
      setMenuItems(prevItems => [
        ...prevItems,
        { ...formData, id: newId }
      ]);
    }
    
    setIsModalVisible(false);
    Alert.alert('Success', `Item ${currentItem ? 'updated' : 'added'} successfully`);
  };

  // Confirm delete action
  const confirmDelete = (item: MenuItem) => {
    setCurrentItem(item);
    setIsDeleteModalVisible(true);
  };

  // Delete menu item
  const deleteMenuItem = () => {
    if (currentItem) {
      setMenuItems(prevItems => 
        prevItems.filter(item => item.id !== currentItem.id)
      );
      setIsDeleteModalVisible(false);
      Alert.alert('Success', 'Item deleted successfully');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Menu Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add-circle" size={28} color="#FF7622" />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu items..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <MaterialIcons name="search" size={24} color="#888" style={styles.searchIcon} />
      </View>

      {/* Menu List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Image source={resolveImageSource(item.image)} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.itemFooter}>
                <Text style={styles.itemCategory}>{item.category}</Text>
                {item.popular && (
                  <View style={styles.popularBadge}>
                    <MaterialIcons name="star" size={16} color="#FFC107" />
                    <Text style={styles.popularText}>Popular</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
                <MaterialIcons name="edit" size={20} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item)}>
                <MaterialIcons name="delete" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{currentItem ? 'Edit Menu Item' : 'Add New Item'}</Text>
            
            <ScrollView style={styles.modalContent}>
              {/* Image preview + upload */}
              <Text style={styles.inputLabel}>Image</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Image source={resolveImageSource(formData.image)} style={{ width: 80, height: 80, borderRadius: 10, marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={{ marginBottom: 8 }} onPress={pickImageFromLibrary}>
                    <Text style={{ color: '#FF7622', fontWeight: '600' }}>Upload Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={removeSelectedImage}>
                    <Text style={{ color: '#888' }}>Remove image</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.inputLabel}>Item Name*</Text>
              <TextInput style={styles.input} value={formData.name} onChangeText={(text) => handleInputChange('name', text)} placeholder="Enter item name" />
              
              <Text style={styles.inputLabel}>Category*</Text>
              <TextInput style={styles.input} value={formData.category} onChangeText={(text) => handleInputChange('category', text)} placeholder="Enter category" />
              
              <Text style={styles.inputLabel}>Price*</Text>
              <TextInput style={styles.input} value={formData.price} onChangeText={(text) => handleInputChange('price', text)} placeholder="Enter price" keyboardType="decimal-pad" />
              
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput style={[styles.input, styles.descriptionInput]} value={formData.description} onChangeText={(text) => handleInputChange('description', text)} placeholder="Enter description" multiline numberOfLines={4} />
              
              <View style={styles.popularSwitch}>
                <Text style={styles.inputLabel}>Mark as Popular</Text>
                <Switch value={formData.popular} onValueChange={(value) => handleInputChange('popular', value)} trackColor={{ false: '#767577', true: '#FF7622' }} thumbColor={formData.popular ? '#f4f3f4' : '#f4f3f4'} />
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveMenuItem}>
                <Text style={styles.saveButtonText}>{currentItem ? 'Update Item' : 'Add Item'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal animationType="fade" transparent={true} visible={isDeleteModalVisible} onRequestClose={() => setIsDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            <Text style={styles.deleteModalTitle}>Delete Item</Text>
            <Text style={styles.deleteModalText}>Are you sure you want to delete "{currentItem?.name}"? This action cannot be undone.</Text>
            <View style={styles.deleteModalActions}>
              <Pressable style={[styles.deleteModalButton, styles.cancelDeleteButton]} onPress={() => setIsDeleteModalVisible(false)}>
                <Text style={styles.deleteModalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.deleteModalButton, styles.confirmDeleteButton]} onPress={deleteMenuItem}>
                <Text style={styles.deleteModalButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ... keep your styles unchanged (same as original). For brevity I reuse your styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F5FA', paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', fontFamily: 'SpaceMono' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0E6', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  addButtonText: { color: '#FF7622', marginLeft: 5, fontWeight: '600', fontFamily: 'SpaceMono' },
  searchContainer: { position: 'relative', paddingHorizontal: 20, marginBottom: 15 },
  searchInput: { backgroundColor: 'white', borderRadius: 15, padding: 15, paddingLeft: 45, fontSize: 16, fontFamily: 'SpaceMono', elevation: 2 },
  searchIcon: { position: 'absolute', left: 35, top: 15 },
  menuList: { paddingHorizontal: 15 },
  menuItem: { backgroundColor: 'white', borderRadius: 15, marginBottom: 15, flexDirection: 'row', overflow: 'hidden', elevation: 2 },
  itemImage: { width: 100, height: 100, resizeMode: 'cover' },
  itemInfo: { flex: 1, padding: 15 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#333', fontFamily: 'SpaceMono', flex: 1 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#FF7622', fontFamily: 'SpaceMono', marginLeft: 10 },
  itemDescription: { color: '#666', fontSize: 14, fontFamily: 'SpaceMono', marginBottom: 5 },
  itemFooter: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  itemCategory: { backgroundColor: '#F0F5FA', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 15, fontSize: 12, color: '#666', fontFamily: 'SpaceMono', marginRight: 10 },
  popularBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 15 },
  popularText: { color: '#FFC107', fontSize: 12, fontWeight: 'bold', marginLeft: 5, fontFamily: 'SpaceMono' },
  actions: { flexDirection: 'row', padding: 10 },
  editButton: { padding: 5, marginRight: 5 },
  deleteButton: { padding: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: 'white', borderRadius: 20, width: '90%', maxHeight: '80%', overflow: 'hidden' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', padding: 20, textAlign: 'center', color: '#333', backgroundColor: '#F8F9FA', fontFamily: 'SpaceMono' },
  modalContent: { paddingHorizontal: 20, paddingTop: 10, maxHeight: 400 },
  inputLabel: { marginBottom: 8, fontSize: 16, color: '#333', fontFamily: 'SpaceMono', fontWeight: '600' },
  input: { backgroundColor: '#F8F9FA', borderRadius: 10, padding: 15, marginBottom: 20, fontSize: 16, fontFamily: 'SpaceMono' },
  descriptionInput: { minHeight: 100, textAlignVertical: 'top' },
  popularSwitch: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  cancelButton: { flex: 1, padding: 15, backgroundColor: '#F0F5FA', borderRadius: 15, alignItems: 'center', marginRight: 10 },
  cancelButtonText: { color: '#666', fontWeight: '600', fontFamily: 'SpaceMono' },
  saveButton: { flex: 1, padding: 15, backgroundColor: '#FF7622', borderRadius: 15, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: '600', fontFamily: 'SpaceMono' },
  deleteModal: { backgroundColor: 'white', borderRadius: 20, width: '90%', padding: 20 },
  deleteModalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, fontFamily: 'SpaceMono' },
  deleteModalText: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#666', fontFamily: 'SpaceMono', lineHeight: 24 },
  deleteModalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  deleteModalButton: { flex: 1, padding: 15, borderRadius: 15, alignItems: 'center' },
  cancelDeleteButton: { backgroundColor: '#F0F5FA', marginRight: 10 },
  confirmDeleteButton: { backgroundColor: '#FF3B30' },
  deleteModalButtonText: { fontWeight: '600', fontFamily: 'SpaceMono' },
});

export default MenuScreen;
