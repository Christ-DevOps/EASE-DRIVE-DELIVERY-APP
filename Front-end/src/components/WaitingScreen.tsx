import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type WaitingScreenParamType = {
  userType: 'delivery' | 'partner'
}

const WaitingScreen = ({ userType }: WaitingScreenParamType) => {
  // Animation values
  const progressAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);
  const fadeAnim = new Animated.Value(0);
  
  // Start animations when component mounts
  React.useEffect(() => {
    // Progress bar animation
    Animated.loop(
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      })
    ).start();

    // Pulse animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  // Interpolate the animation value for the progress bar
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isDelivery = userType === 'delivery';
  const primaryColor = isDelivery ? '#FF7622' : '#32027A';
  const secondaryColor = isDelivery ? '#FF7622' : '#2F29EC';
  const accentColor = '#C3640B';

  const getContent = () => {
    if (isDelivery) {
      return {
        icon: 'bicycle',
        title: 'Welcome to Our Delivery Team!',
        subtitle: 'Your Application is Under Review',
        description: 'Thank you for joining QuickEats as a Delivery Agent. Our team is carefully reviewing your application and documents to ensure the best experience for both you and our customers.',
        timeframe: '1-2 business days',
        benefits: [
          'Flexible working hours',
          'Competitive earnings',
          'Real-time order tracking',
          'Dedicated support team'
        ],
        contactEmail: 'digitalcommunity@gmail.com',
        contactPhone: '+237 680-589-567'
      };
    } else {
      return {
        icon: 'storefront',
        title: 'Welcome to EaseDrive Partnership!',
        subtitle: 'Restaurant Verification in Progress',
        description: 'We\'re excited to have you join our restaurant network. Our partnership team is reviewing your restaurant details and documentation to ensure quality standards.',
        timeframe: '2-3 business days',
        benefits: [
          'Expanded customer reach',
          'Professional order management',
          'Marketing support',
          'Analytics dashboard'
        ],
        contactEmail: 'digitalcommunity@gmail.com',
        contactPhone: '+237 680-589-567'
      };
    }
  };

  const content = getContent();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={primaryColor} />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={[primaryColor, secondaryColor, accentColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1}}
        style={styles.headerGradient}
      >
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>EaseDrive</Text>
          <Text style={styles.headerSubtitle}>Food Delivery Platform</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
          {/* Animated Icon */}
          <Animated.View 
            style={[
              styles.iconContainer, 
              { 
                backgroundColor: `${primaryColor}15`,
                transform: [{ scale: pulseAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={[primaryColor, secondaryColor]}
              style={styles.iconGradient}
            >
              <Ionicons name={content.icon as any} size={50} color="white" />
            </LinearGradient>
          </Animated.View>
          
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={[styles.subtitle, { color: primaryColor }]}>
              {content.subtitle}
            </Text>
          </View>
          
          {/* Description */}
          <Text style={styles.description}>
            {content.description}
          </Text>
          
          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Processing your application...</Text>
            <View style={styles.progressContainer}>
              <Animated.View 
                style={[
                  styles.progressBar, 
                  { 
                    width: progressWidth,
                  }
                ]} 
              >
                <LinearGradient
                  colors={[primaryColor, secondaryColor]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressGradient}
                />
              </Animated.View>
            </View>
            <Text style={styles.timeframe}>
              Expected completion: {content.timeframe}
            </Text>
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>What's Next?</Text>
            {content.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={[styles.benefitDot, { backgroundColor: primaryColor }]} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Status Cards */}
          <View style={styles.statusCards}>
            <View style={styles.statusCard}>
              <View style={[styles.statusIcon, { backgroundColor: `${primaryColor}15` }]}>
                <Ionicons name="document-text" size={24} color={primaryColor} />
              </View>
              <Text style={styles.statusTitle}>Documents</Text>
              <Text style={styles.statusValue}>Received ✓</Text>
            </View>
            
            <View style={styles.statusCard}>
              <View style={[styles.statusIcon, { backgroundColor: `${secondaryColor}15` }]}>
                <Ionicons name="time" size={24} color={secondaryColor} />
              </View>
              <Text style={styles.statusTitle}>Review</Text>
              <Text style={styles.statusValue}>In Progress</Text>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Need Assistance?</Text>
            <Text style={styles.contactSubtitle}>
              Our support team is here to help
            </Text>
            
            <View style={styles.contactMethods}>
              <View style={styles.contactItem}>
                <View style={[styles.contactIcon, { backgroundColor: `${primaryColor}15` }]}>
                  <MaterialIcons name="email" size={20} color={primaryColor} />
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactLabel}>Email Support</Text>
                  <Text style={styles.contactValue}>{content.contactEmail}</Text>
                </View>
              </View>
              
              <View style={styles.contactItem}>
                <View style={[styles.contactIcon, { backgroundColor: `${secondaryColor}15` }]}>
                  <FontAwesome5 name="phone" size={18} color={secondaryColor} />
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactLabel}>Phone Support</Text>
                  <Text style={styles.contactValue}>{content.contactPhone}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Footer Note */}
          <View style={styles.footerNote}>
            <Ionicons name="information-circle" size={20} color="#6B7280" />
            <Text style={styles.footerText}>
              You'll receive an email notification once your account is approved and ready to use.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    paddingTop: 15,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContent: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: -10, // Pull up into the gradient
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  progressSection: {
    width: '100%',
    marginBottom: 30,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 4,
  },
  timeframe: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  benefitsSection: {
    width: '100%',
    marginBottom: 30,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#4B5563',
    flex: 1,
  },
  statusCards: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 30,
    gap: 16,
  },
  statusCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  contactSection: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactMethods: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    color: '#6B7280',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default WaitingScreen;