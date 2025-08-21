import { SafeAreaView, StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native'
import React from 'react'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useNav } from '@/src/context/NavigationContext'

const ViewPersonaInfo = () => {
  const router = useRouter();
  const { navigateToEditProfile } = useNav();
  
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
        
        <Text style={styles.headerTitle}>Personal Info</Text>
        
        <TouchableOpacity style={styles.editButton} onPress={navigateToEditProfile} >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View> 

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image 
            source={require('@/src/assets/icons/person.png')} 
            style={styles.profileImage}
          />
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

      {/* Personal Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Ionicons name="person-outline" size={24} color="#FF7622" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>FULLNAME</Text>
            <Text style={styles.infoText}>Tangomo Pujalte</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Ionicons name="mail-outline" size={24} color="#FF7622" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>EMAIL</Text>
            <Text style={styles.infoText}>example@gmail.com</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Ionicons name="call-outline" size={24} color="#FF7622" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>PHONE</Text>
            <Text style={styles.infoText}>+237 680-589-567</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ViewPersonaInfo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 40,
    paddingHorizontal: 20,
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
  editButton: {
    padding: 8,
    borderRadius: 6,
  },
  editText: {
    color: '#FF7622',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181C2E',
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
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
    color: '#181C2E',
  },
  location: {
    color: '#A0A5BA',
    fontSize: 15,
    marginBottom: 15,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#181C2E',
  },
  statLabel: {
    fontSize: 14,
    color: '#A0A5BA',
  },
  infoContainer: {
    backgroundColor: '#F6F8FA',
    borderRadius: 20,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
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
  textContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 12,
    color: '#A0A5BA',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#181C2E',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAECF0',
  },
})