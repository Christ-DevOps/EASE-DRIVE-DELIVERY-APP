import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

/**
 * Simple EditProfile screen.
 * Replace initialData with real data from your store / API.
 */
const initialData = {
  name: 'Delicious Foods Inc.',
  email: 'contact@deliciousfoods.com',
  phone: '+1 (234) 567-8900',
  address: '123 Food Street, Culinary City',
  rating: 4.7,
  reviews: 0,
  image: require('@/src/assets/images/Logo.png'), // keep a default
};

export default function EditProfileScreen() {
  const [profile, setProfile] = useState({
    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone,
    address: initialData.address,
    image: initialData.image as any, // can be require() or { uri }
  });

  const [saving, setSaving] = useState(false);

  const resolveImageSource = (image: any) => {
    if (!image) return require('@/src/assets/images/Logo.png');
    if (typeof image === 'string') return { uri: image };
    if (image?.uri) return { uri: image.uri };
    return image;
  };

  const handleChange = (field: keyof typeof profile, value: string | any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Please grant photo library permissions to upload a profile image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      // handle both older and newer result shapes
      const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri;

      if (!result.cancelled && uri) {
        handleChange('image', { uri });
      }
    } catch (err) {
      console.error('pickImage error', err);
      Alert.alert('Error', 'Could not open image library.');
    }
  };

  const removeImage = () => {
    handleChange('image', require('@/src/assets/images/Logo.png'));
  };

  const validate = () => {
    if (!profile.name.trim()) return 'Name is required';
    if (!profile.email.trim()) return 'Email is required';
    // very simple email check — replace with robust validation if needed
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(profile.email)) return 'Enter a valid email';
    if (!profile.phone.trim()) return 'Phone number is required';
    if (!profile.address.trim()) return 'Address is required';
    return null;
  };

  const saveProfileToServer = async (payload: typeof profile) => {
    // TODO: replace this with your API call (upload image if needed)
    // Example pattern:
    // 1) if payload.image.uri -> upload image to storage -> get url
    // 2) send PATCH/PUT to /restaurants/:id with fields and image url
    // For now we just mimic a network call:
    await new Promise(res => setTimeout(res, 800));
    return { ok: true };
  };

  const onSave = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Validation', err);
      return;
    }

    setSaving(true);
    try {
      const res = await saveProfileToServer(profile);
      if (res.ok) {
        Alert.alert('Success', 'Profile updated');
        router.back(); // go back to previous screen
      } else {
        throw new Error('Save failed');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Edit Profile</Text>

        <View style={styles.imageRow}>
          <Image source={resolveImageSource(profile.image)} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Ionicons name="cloud-upload-outline" size={18} color="#FF7622" />
              <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.removeBtn} onPress={removeImage}>
              <MaterialIcons name="delete-outline" size={18} color="#888" />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Business Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Restaurant name"
          value={profile.name}
          onChangeText={t => handleChange('name', t)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={profile.email}
          onChangeText={t => handleChange('email', t)}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="+1 (xxx) xxx-xxxx"
          keyboardType="phone-pad"
          value={profile.phone}
          onChangeText={t => handleChange('phone', t)}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
          placeholder="Full address"
          multiline
          value={profile.address}
          onChangeText={t => handleChange('address', t)}
        />

        <View style={{ height: 18 }} />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancel} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.save} onPress={onSave} disabled={saving}>
            <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F5FA', paddingTop: 20 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 18, color: '#333', fontFamily: 'SpaceMono' },
  imageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: 'white', resizeMode: 'cover' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  uploadText: { color: '#FF7622', fontWeight: '600', marginLeft: 8, fontFamily: 'SpaceMono' },
  removeBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  removeText: { color: '#888', marginLeft: 8, fontFamily: 'SpaceMono' },
  label: { fontSize: 14, color: '#333', marginBottom: 6, fontFamily: 'SpaceMono', fontWeight: '600' },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    fontFamily: 'SpaceMono',
    elevation: 1,
  },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  cancel: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F0F5FA',
    alignItems: 'center',
  },
  cancelText: { color: '#666', fontWeight: '600', fontFamily: 'SpaceMono' },
  save: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FF7622',
    alignItems: 'center',
  },
  saveText: { color: 'white', fontWeight: '700', fontFamily: 'SpaceMono' },
});
