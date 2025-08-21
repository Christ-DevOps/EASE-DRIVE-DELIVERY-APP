import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Title, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { updateAgentProfile } from '@/src/services/api';

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe', // This would come from user data
    email: 'john.doe@example.com', // This would come from user data
    phone: '+1234567890', // This would come from user data
    vehicleType: 'Motorcycle', // This would come from user data
  });
  const router = useRouter();

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateAgentProfile(formData);
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Edit Profile</Title>
      
      <TextInput
        label="Name"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
        mode="outlined"
        outlineColor="#CED4DA"
        activeOutlineColor="#FF7622"
      />
      
      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        style={styles.input}
        mode="outlined"
        outlineColor="#CED4DA"
        activeOutlineColor="#FF7622"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        label="Phone"
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
        style={styles.input}
        mode="outlined"
        outlineColor="#CED4DA"
        activeOutlineColor="#FF7622"
        keyboardType="phone-pad"
      />
      
      <TextInput
        label="Vehicle Type"
        value={formData.vehicleType}
        onChangeText={(text) => handleChange('vehicleType', text)}
        style={styles.input}
        mode="outlined"
        outlineColor="#CED4DA"
        activeOutlineColor="#FF7622"
      />

      <Button 
        mode="contained" 
        onPress={handleUpdate}
        style={styles.button}
        disabled={loading}
        labelStyle={styles.buttonLabel}
      >
        {loading ? <ActivityIndicator color="#fff" /> : 'Update Profile'}
      </Button>

      <Button 
        mode="outlined" 
        onPress={() => router.back()}
        style={styles.button}
        disabled={loading}
        labelStyle={styles.buttonLabel}
      >
        Cancel
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0A1F33',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 5,
    borderRadius: 8,
    paddingVertical: 5,
  },
  buttonLabel: {
    fontSize: 14,
  },
});