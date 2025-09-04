import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const WaitingScreen = ({ userType }) => {
  const [currentScreen, setCurrentScreen] = useState(userType); // 'delivery' or 'partner'
  
  // Animation value for the progress indicator
  const progressAnim = new Animated.Value(0);
  
  // Start the animation when component mounts
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  // Interpolate the animation value for the progress bar width
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Tabs for switching between views */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'delivery' && styles.activeTab]}
          onPress={() => setCurrentScreen('delivery')}
        >
          <Text style={[styles.tabText, currentScreen === 'delivery' && styles.activeTabText]}>
            Delivery Agent
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'partner' && styles.activeTab]}
          onPress={() => setCurrentScreen('partner')}
        >
          <Text style={[styles.tabText, currentScreen === 'partner' && styles.activeTabText]}>
            Partner
          </Text>
        </TouchableOpacity>
      </View>

      {currentScreen === 'delivery' ? (
        // Delivery Agent Waiting Screen
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(67, 97, 238, 0.1)' }]}>
            <Ionicons name="bicycle" size={60} color="#4361ee" />
          </View>
          
          <Text style={styles.title}>Registration Under Review</Text>
          
          <Text style={styles.description}>
            Thank you for signing up as a Delivery Agent. Your account is currently being reviewed by our administration team.
            This process typically takes 1-2 business days.
          </Text>
          
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { width: progressWidth, backgroundColor: '#4361ee' }
              ]} 
            />
          </View>
          
          <Text style={styles.note}>
            You will receive a notification email once your account has been approved. 
            Thank you for your patience.
          </Text>
          
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Need help?</Text>
            <View style={styles.contactItem}>
              <MaterialIcons name="email" size={18} color="#4361ee" />
              <Text style={styles.contactText}>support@deliveryapp.com</Text>
            </View>
            <View style={styles.contactItem}>
              <FontAwesome5 name="phone" size={16} color="#4361ee" />
              <Text style={styles.contactText}>+1 (800) 123-4567</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        // Partner Waiting Screen
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(114, 9, 183, 0.1)' }]}>
            <Ionicons name="business" size={60} color="#7209b7" />
          </View>
          
          <Text style={styles.title}>Partner Account Pending Approval</Text>
          
          <Text style={styles.description}>
            Thank you for your interest in becoming a Partner. Your registration request has been received 
            and is currently under review by our administration team.
          </Text>
          
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { width: progressWidth, backgroundColor: '#7209b7' }
              ]} 
            />
          </View>
          
          <Text style={styles.note}>
            We will carefully evaluate your application and notify you via email within 3-5 business days. 
            We appreciate your patience during this process.
          </Text>
          
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Partnership inquiries?</Text>
            <View style={styles.contactItem}>
              <MaterialIcons name="email" size={18} color="#7209b7" />
              <Text style={styles.contactText}>partners@deliveryapp.com</Text>
            </View>
            <View style={styles.contactItem}>
              <FontAwesome5 name="phone" size={16} color="#7209b7" />
              <Text style={styles.contactText}>+1 (800) 987-6543</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4361ee',
  },
  tabText: {
    fontWeight: '600',
    color: '#6c757d',
  },
  activeTabText: {
    color: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    color: '#212529',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6c757d',
    lineHeight: 24,
    marginBottom: 30,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginVertical: 30,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  note: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6c757d',
    lineHeight: 22,
    marginBottom: 30,
  },
  contactContainer: {
    width: '100%',
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#495057',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#6c757d',
  },
});

export default WaitingScreen;