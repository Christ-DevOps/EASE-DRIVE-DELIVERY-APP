import { useNav } from '@/src/context/NavigationContext'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const ProfileScreen = () => {
  const { navigateToProfileData } = useNav();
  const  router = useRouter()
  
  return (
    <SafeAreaView style={styles.container}>

      {/* Header section */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#181C2E" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Your Profile</Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={24} color="#181C2E" />
        </TouchableOpacity>
      </View> 

      {/* Profile Content */}
      <View style={styles.profileContainer}>

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity style={{ backgroundColor: '##FF7622' }} >
            <Image 
            source={require('../../assets/icons/person.png')} 
            style={styles.profileImage}
          />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editIcon}>
            <MaterialIcons name="edit" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Tangomo, Pujalte</Text>
          <Text style={styles.location}>Awae Escalier, IAI Cameroon</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Years</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false} >
        {/* Personal Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToProfileData} >
            <View style={styles.menuIcon}>
              <Ionicons name="person-outline" size={24} color="#FF7622" />
            </View>
            <Text style={styles.menuText}>Personal Info</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#A0A5BA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="location-outline" size={24} color="#FF7622" />
            </View>
            <Text style={styles.menuText}>Addresses</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#A0A5BA" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.menuItem} onPress={()=> router.push('/(tabs)/ViewCart')}>
            <View style={styles.menuIcon}>
              <Ionicons name="cart-outline" size={24} color="#FF7622" />
            </View>
            <Text style={styles.menuText}>My Cart</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#A0A5BA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="heart-outline" size={24} color="#FF7622" />
            </View>
            <Text style={styles.menuText}>Favorites</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#A0A5BA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <MaterialCommunityIcons name="bell-outline" size={24} color="#FF7622" />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#A0A5BA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <FontAwesome5 name="money-bill-wave" size={20} color="#FF7622" />
            </View>
            <Text style={styles.menuText}>Payment Methods</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#A0A5BA" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="help-circle-outline" size={24} color="#FF7622" />
            </View>
            <Text style={styles.menuText}>Help Center</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#A0A5BA" />
          </TouchableOpacity>
          
          {/* <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <MaterialIcons name="privacy-tip" size={24} color="#FF7622" />
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#A0A5BA" />
          </TouchableOpacity> */}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <View style={styles.logoutIcon}>
            <MaterialIcons name="logout" size={24} color="#FF3B30" />
          </View>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
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
    fontFamily: 'SpaceMono',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFC6AE',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF7622',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'SpaceMono',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
    color: '#181C2E',
  },
  location: {
    color: '#A0A5BA',
    fontSize: 15,
    marginBottom: 15,
    fontFamily: 'SpaceMono',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statValue: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    fontWeight: '700',
    color: '#181C2E',
  },
  statLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#A0A5BA',
  },
  menuContainer: {
    flex: 1,
  },
  menuSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    fontWeight: '600',
    color: '#A0A5BA',
    marginBottom: 15,
    paddingLeft: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: '#F6F8FA',
    borderRadius: 15,
    marginBottom: 10,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#181C2E',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: '#FFF5F5',
    borderRadius: 15,
    marginTop: 10,
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBE9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logoutText: {
    flex: 1,
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
})