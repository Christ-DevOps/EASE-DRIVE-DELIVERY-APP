import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const ProfileScreen = () => {
  const restaurantInfo = {
    name: 'Delicious Foods Inc.',
    email: 'contact@deliciousfoods.com',
    phone: '+1 (234) 567-8900',
    address: '123 Food Street, Culinary City',
    rating: 4.7,
    reviews: 0,
  };

  const menuItems = [
    { icon: 'restaurant-menu', name: 'Menu Management', screen: 'menu' },
    { icon: 'list-alt', name: 'Orders History', screen: 'orders' },
    { icon: 'analytics', name: 'Business Analytics', screen: 'analytics' },
    // { icon: 'payment', name: 'WithDraw Methods', screen: 'payment' },
    { icon: 'help', name: 'Help & Support', screen: 'support' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image 
            source={require('@/src/assets/images/restaurants/restaurant.jpg')} 
            style={styles.coverImage}
          />
          <View style={styles.profileContainer}>
            <Image 
              source={require('@/src/assets/images/Logo.png')} 
              style={styles.profileImage}
            />
            <Text style={styles.name}>{restaurantInfo.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={20} color="#FFC107" />
              <Text style={styles.ratingText}>{restaurantInfo.rating} ({restaurantInfo.reviews} reviews)</Text>
            </View>
            <TouchableOpacity style={styles.editProfile} onPress={()=> router.push('/(partners)/(screens)/Profile/EditProfile')} >
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={24} color="#FF7622" />
            <Text style={styles.infoText}>{restaurantInfo.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={24} color="#FF7622" />
            <Text style={styles.infoText}>{restaurantInfo.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={24} color="#FF7622" />
            <Text style={styles.infoText}>{restaurantInfo.address}</Text>
          </View>
        </View>

        {/* Business Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          <View style={styles.hoursContainer}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
              <View key={index} style={styles.hourRow}>
                <Text style={styles.dayText}>{day}</Text>
                <Text style={styles.timeText}>9:00 AM - 10:00 PM</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.editHours}>
            <Text style={styles.editHoursText}>Edit Business Hours</Text>
          </TouchableOpacity>
        </View>

        {/* Management Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={()=>{
                if ( index == 0 ) router.push('/(partners)/(tabs)/Menu')
                if ( index == 1 ) router.push('/(partners)/(screens)/Orders/TotalOrders')
                if ( index == 3 ) router.push('/(partners)/(screens)/support/SendFeedback')
              }} >
                <View style={styles.menuIcon}>
                  <MaterialIcons name={item.icon} size={28} color="#FF7622" />
                </View>
                <Text style={styles.menuText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FA',
  },
  header: {
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -60,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: 'white',
    backgroundColor: 'white',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    fontFamily: 'SpaceMono',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    color: '#666',
    marginLeft: 5,
    fontFamily: 'SpaceMono',
  },
  editProfile: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#FFF0E6',
    borderRadius: 20,
  },
  editText: {
    color: '#FF7622',
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    fontFamily: 'SpaceMono',
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'SpaceMono',
  },
  hoursContainer: {
    marginBottom: 15,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5FA',
  },
  dayText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  timeText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  editHours: {
    alignSelf: 'flex-end',
  },
  editHoursText: {
    color: '#FF7622',
    fontFamily: 'SpaceMono',
    fontWeight: '600',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#F0F5FA',
    borderRadius: 15,
  },
  menuIcon: {
    marginBottom: 10,
  },
  menuText: {
    textAlign: 'center',
    color: '#333',
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#FFF0E6',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 30,
  },
  logoutText: {
    color: '#FF7622',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
});

export default ProfileScreen;