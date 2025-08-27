import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { DeliveryAgent } from '@/src/types';
import { getAgentProfile, logout } from '@/src/services/api';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<DeliveryAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await getAgentProfile();
      setUserData(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/LoginScreen');
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF7622" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Profile Information</Title>
          
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userData?.name}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData?.email}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{userData?.phone}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Vehicle Type:</Text>
            <Text style={styles.value}>{userData?.vehicleType}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, userData?.isAvailable ? styles.available : styles.unavailable]}>
              {userData?.isAvailable ? 'Available' : 'Not Available'}
            </Text>
          </View>

          <Button 
            mode="contained" 
            onPress={() => router.push('/(deliveryAgent)/(screens)/Profile/editProfile')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Edit Profile
          </Button>

          <Button 
            mode="outlined" 
            onPress={handleLogout}
            style={[styles.button, styles.logoutButton]}
            labelStyle={styles.buttonLabel}
          >
            Log Out
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0A1F33',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
    color: '#0A1F33',
  },
  value: {
    flex: 1,
    color: '#6C757D',
  },
  available: {
    color: '#28A745',
    fontWeight: 'bold',
  },
  unavailable: {
    color: '#DC3545',
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 5,
    borderRadius: 8,
    paddingVertical: 5,
  },
  logoutButton: {
    borderColor: '#DC3545',
  },
  buttonLabel: {
    fontSize: 14,
  },
});