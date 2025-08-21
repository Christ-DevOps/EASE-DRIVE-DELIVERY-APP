import React, { useState } from 'react';
import { 
  Alert, 
  KeyboardAvoidingView,
  ScrollView, 
  Platform, 
  Pressable, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Image,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // ADD THIS IMPORT
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import UploadField from '@/src/components/UploadFields';
import { UploadProvider } from '@/src/context/UploadContext';
import * as yup from 'yup';

const DeliverySchema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().required('Email is required').email('Invalid email'),
  phone: yup.string()
    .required('Phone is required')
    .matches(/^[0-9]{10,15}$/, 'Invalid phone number'),
  address: yup.string().required('Address is required'),
  vehicle_type: yup.string().required('Vehicle type is required'),
  license_number: yup.string()
    .required('License number is required')
    .min(8, 'Must be at least 8 characters'),
});

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_IMAGE_WIDTH = 1200; // resized width

type DeliveryFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  vehicle_type: string;
  license_number: string;
};

const DeliverySignup = () => {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('@/src/assets/fonts/Quicksand-Bold.ttf'),
  });
  const [licensePhotos, setLicensePhotos] = useState<any[]>([]);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<DeliveryFormData>({
    resolver: yupResolver(DeliverySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      vehicle_type: '',
      license_number: '',
    }
  });

  const onSubmit = async (data: DeliveryFormData) => {
    try {
      if (licensePhotos.length === 0) {
        Alert.alert('Missing photo', 'Please upload your driver\'s license photo.');
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Delivery Agent Signup:', data);
      Alert.alert(
        'Registration Successful',
        'Your delivery agent account has been created!',
        [{ text: 'OK', onPress: () => router.replace('/(deliveryAgent)/(tabs)/Home') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  const handleAddPhoto = (file: any | null) => {
    if (!file) return;
    setLicensePhotos((prev) => [...prev, file]);
  };
  
  const handleRemovePhotoAt = (index: number) => {
    setLicensePhotos((prev) => prev.filter((_, i) => i !== index));
  };

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
          
          {/* NEW GRADIENT HEADER */}
          <View style={styles.gradientHeader}>
            <LinearGradient
              colors={['#32027aff', '#2f29ecff', '#c3640bff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              {/* Decorative elements - delivery themed */}
              <View style={styles.decorativeContainer}>
                <Ionicons name="bicycle" size={45} color="rgba(255,255,255,0.3)" style={styles.icon1} />
                <Ionicons name="car-sport" size={35} color="rgba(255,255,255,0.2)" style={styles.icon2} />
                <Ionicons name="location" size={30} color="rgba(255,255,255,0.25)" style={styles.icon3} />
                <Ionicons name="time" size={25} color="rgba(255,255,255,0.2)" style={styles.icon4} />
              </View>
              
              {/* Back button and title */}
              <View style={styles.headerContent}>
                <Pressable style={styles.backButtonGradient} onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <View style={styles.titleContainer}>
                  <Text style={styles.mainTitle}>Delivery Agent</Text>
                  <Text style={styles.subtitle}>Start earning with us today</Text>
                  <TouchableOpacity onPress={()=> router.push('/(deliveryAgent)/(tabs)/Home')} ><Text>Home</Text></TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    placeholder="John Doe"
                    style={[styles.input, errors.name && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    placeholder="john@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.input, errors.email && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    placeholder="+1 234 567 8900"
                    keyboardType="phone-pad"
                    style={[styles.input, errors.phone && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput
                    placeholder="123 Main St, City"
                    style={[styles.input, errors.address && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="vehicle_type"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Vehicle Type</Text>
                  <TextInput
                    placeholder="Motorcycle, Car, Bicycle..."
                    style={[styles.input, errors.vehicle_type && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.vehicle_type && <Text style={styles.errorText}>{errors.vehicle_type.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="license_number"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Driving License Number</Text>
                  <TextInput
                    placeholder="DL12345678"
                    style={[styles.input, errors.license_number && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.license_number && <Text style={styles.errorText}>{errors.license_number.message}</Text>}
                </View>
              )}
            />

            {/* Upload Section */}
            <View style={styles.uploadSection}>
              <Text style={styles.sectionTitle}>Required Documents</Text>
              
              <View style={styles.uploadCard}>
                <Text style={styles.uploadLabel}>Driver's License Photo</Text>
                <UploadField
                  type="image"
                  value={null}
                  onChange={handleAddPhoto}
                  label="Add license photo"
                  maxFileSize={MAX_FILE_SIZE} 
                />

                {licensePhotos.length > 0 && (
                  <View style={styles.photosContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {licensePhotos.map((p, idx) => (
                        <View key={idx} style={styles.photoItem}>
                          <Image source={{ uri: p.uri }} style={styles.photoThumb} />
                          <TouchableOpacity 
                            style={styles.removePhotoBtn}
                            onPress={() => handleRemovePhotoAt(idx)}
                          >
                            <Ionicons name="close-circle" size={24} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitText}>Register as Agent</Text>
              )}
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>Want to register as Partner?</Text>
              <TouchableOpacity onPress={() => router.push('/(partners)/auth/Signup')}>
                <Text style={styles.switchLink}> Switch to Partner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1F33",
  },

  // NEW GRADIENT HEADER STYLES
  gradientHeader: {
    height: 200,
    position: 'relative',
  },
  gradientBackground: {
    flex: 1,
    paddingTop: 50, // Account for status bar
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  icon1: {
    position: 'absolute',
    top: 25,
    right: 30,
    transform: [{ rotate: '15deg' }],
  },
  icon2: {
    position: 'absolute',
    top: 75,
    right: 70,
    transform: [{ rotate: '-10deg' }],
  },
  icon3: {
    position: 'absolute',
    top: 110,
    right: 25,
    transform: [{ rotate: '20deg' }],
  },
  icon4: {
    position: 'absolute',
    top: 45,
    right: 100,
    transform: [{ rotate: '-15deg' }],
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButtonGradient: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 12,
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
    paddingTop: 8,
  },
  mainTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'SpaceMono',
  },

  // REMOVE THESE OLD STYLES:
  // header: { ... },
  // backButton: { ... },
  // title: { ... },

  form: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
    marginTop: -12, // Creates overlap with gradient
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'SpaceMono'
  },
  input: {
    backgroundColor: "#F0F5FA",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'SpaceMono'
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'SpaceMono',
  },

  // ENHANCED UPLOAD SECTION
  uploadSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1F2937',
    fontFamily: 'SpaceMono',
  },
  uploadCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  uploadLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#374151',
    fontFamily: 'SpaceMono',
  },

  submitButton: {
    backgroundColor: "#FF7622",
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'SpaceMono',
  },
  uploadButton: {
    backgroundColor: "#E0E7FF",
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5
  },
  uploadText: {
    color: "#4F46E5",
    fontWeight: '600',
    fontFamily: 'SpaceMono'
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  switchText: {
    color: '#666',
    fontFamily: 'SpaceMono',
  },
  switchLink: {
    color: '#FF7622',
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  photosContainer: {
    marginTop: 12,
  },
  photoItem: {
    position: 'relative',
    marginRight: 12,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});

export default DeliverySignup;