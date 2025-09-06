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
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // ADD THIS IMPORT
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API } from '@/src/config/apiConfig'
import UploadField from '@/src/components/UploadFields';
import { useUpload } from '@/src/context/UploadContext';

const API_BASE_URL = process.env.BASE_URL || 'http://192.168.100.54:5000/api';


/* ---------------- validation schema ---------------- */
const PartnerSchema = yup.object().shape({
  business_name: yup.string().required('Business name is required'),
  email: yup.string().required('Email is required').email('Invalid email'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^[0-9\+\-\s]{7,20}$/, 'Invalid phone number'),
  categories: yup.string().required('Food categories are required'),
  account_number: yup
    .string()
    .required('Account number is required')
    .min(6, 'Must be at least 6 digits'),
  address: yup.string().required('Location is required'),
    password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  description: yup
    .string()
    .required('Business description is required')
    .min(20, 'Description must be at least 20 characters'),
});

/* ---------------- types ---------------- */
type PartnerFormData = {
  business_name: string;
  email: string;
  phone: string;
  categories: string;
  account_number: string;
  address: string;
  password: string,
  description: string
};

type BusinessHours = {
  [key: string]: {
    open: boolean;
    openTime: string;
    closeTime: string;
  };
};


/* ---------------- constants ---------------- */
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_IMAGE_WIDTH = 1200; // resized width

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

/* ---------------- main screen ---------------- */
const PartnerSignup = () => {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('@/src/assets/fonts/Quicksand-Bold.ttf'),
  });

  const uploadCtx = useUpload();
  const { uploadToServer } = uploadCtx ?? {};

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormData>({
    resolver: yupResolver(PartnerSchema),
    defaultValues: {
      business_name: '',
      email: '',
      phone: '',
      categories: '',
      account_number: '',
      address: '',
      password: '',
      description: ''
    },
  });

  // store uploaded files in local component state
  const [businessPhotos, setBusinessPhotos] = useState<any[]>([]);
  const [businessDoc, setBusinessDoc] = useState<any | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { open: true, openTime: '09:00', closeTime: '17:00' },
    tuesday: { open: true, openTime: '09:00', closeTime: '17:00' },
    wednesday: { open: true, openTime: '09:00', closeTime: '17:00' },
    thursday: { open: true, openTime: '09:00', closeTime: '17:00' },
    friday: { open: true, openTime: '09:00', closeTime: '17:00' },
    saturday: { open: false, openTime: '09:00', closeTime: '17:00' },
    sunday: { open: false, openTime: '09:00', closeTime: '17:00' },
  });
  const [timePicker, setTimePicker] = useState<{
    visible: boolean;
    day: string;
    type: 'open' | 'close';
    time: string;
  }>({ visible: false, day: '', type: 'open', time: '' });

  const handleTimeChange = (day: string, type: 'open' | 'close', time: string) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type === 'open' ? 'openTime' : 'closeTime']: time,
      },
    }));
  };

  const toggleDayOpen = (day: string) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        open: !prev[day].open,
      },
    }));
  };

  const showTimePicker = (day: string, type: 'open' | 'close', currentTime: string) => {
    setTimePicker({ visible: true, day, type, time: currentTime });
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'set' && selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      handleTimeChange(timePicker.day, timePicker.type, timeString);
    }
    setTimePicker({ visible: false, day: '', type: 'open', time: '' });
  };

  const scanFileOnServer = async (file: { uri: string; name?: string; mime?: string }) => {
    return { ok: true, safe: true };
  };

const onSubmit = async (data: PartnerFormData) => {
  if(!validateFiles()) return;
  try {
    // Validate files first
    if (!businessDoc) {
      Alert.alert('Missing document', 'Please upload your business license/document.');
      return;
    }
    if (businessPhotos.length === 0) {
      Alert.alert('Missing photos', 'Please upload at least one business photo.');
      return;
    }

    setUploadingFiles(true);

    // Scan files for security
    const allFiles = [businessDoc, ...businessPhotos];
    for (const f of allFiles) {
      const scan = await scanFileOnServer(f);
      if (!scan.ok || !scan.safe) {
        throw new Error('One of the uploaded files failed the security scan.');
      }
    }

    // Now submit to server - call the actual submission function
    await submitPartnerToServer(data);

  } catch (err: any) {
    console.error('submit error', err);
    Alert.alert('Error', err.message ?? 'Could not submit registration.');
  } finally {
    setUploadingFiles(false);
  }
};

//checks if the files uploaded correctly
const validateFiles = () => {
  if (!businessDoc) {
    Alert.alert('Missing document', 'Please upload your business license/document.');
    return false;
  }
  if (businessPhotos.length === 0) {
    Alert.alert('Missing photos', 'Please upload at least one business photo.');
    return false;
  }
  return true;
};

// Fix the submitPartnerToServer function in your React Native component

async function submitPartnerToServer(formValues: PartnerFormData) {
  try {
    const test = await fetch('https://www.google.com', { method: 'HEAD' });
    console.log('Internet test ok', test.status);
  } catch (e) {
    console.warn('No network connectivity (device).', e);
  }

  try {
    // Build FormData with CORRECT backend field names
    const fd = new FormData();
    fd.append('role', 'partner');
    fd.append('name', formValues.business_name);
    fd.append('email', formValues.email);
    fd.append('phone', formValues.phone);
    fd.append('password', formValues.password);
    fd.append('address', formValues.address);
    
    // FIXED: Backend expects 'restaurantLocation' for partner-specific address
    fd.append('restaurantLocation', formValues.address);
    
    // FIXED: Backend expects 'BankAccount' (capital B)
    fd.append('BankAccount', formValues.account_number);
    fd.append('description', formValues.description);
    
    // FIXED: Backend expects 'foodcategory', not 'categories'
    fd.append('foodcategory', formValues.categories);
    
    // OPTIONAL: Add business hours if you want to extend the backend
    fd.append('businessHours', JSON.stringify(businessHours));

    // Append files as 'partnerDocs'
    fd.append('partnerDocs', {
      uri: businessDoc.uri,
      name: businessDoc.name || 'business_doc.pdf',
      type: businessDoc.type || 'application/pdf'
    } as any);

    businessPhotos.forEach((photo, index) => {
      fd.append('partnerDocs', {
        uri: photo.uri,
        name: photo.name || `photo_${index}.jpg`,
        type: photo.type || 'image/jpeg'
      } as any);
    });

    console.log("Uploading files to server...");

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: fd,
      
    });

    if (!response.ok) {
      let errorBody = null;
      console.log("An error occurred at response level, status:", response.status);
      try { 
        errorBody = await response.json(); 
      } catch (_) { 
        // If JSON parsing fails, use status text
        errorBody = { message: `Server error: ${response.statusText}` };
      }
      throw new Error(errorBody?.message || `Server returned ${response.status}`);
    }

    const result = await response.json();
    console.log('Registration successful:', result);
    
    Alert.alert(
      'Success', 
      'Partner registration submitted successfully. We will review and contact you.',
      [
        {
          text: 'OK',
          onPress: () => router.replace('/(partners)/auth/partnerWaitingScreen')
        }
      ]
    );

  } catch (err: any) {
    console.error('submitPartnerToServer error:', err);
    throw err; // Re-throw to be handled by caller
  }
}

  const handleAddPhoto = (file: any | null) => {
    if (!file) return;
    setBusinessPhotos((prev) => [...prev, file]);
  };
  
  const handleRemovePhotoAt = (index: number) => {
    setBusinessPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetDoc = (file: any | null) => {
    setBusinessDoc(file);
  };

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.outerContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
          
          {/* NEW GRADIENT HEADER - REPLACES THE OLD headerImage AND headerRow */}
          <View style={styles.gradientHeader}>
            <LinearGradient
              colors={['#FF7622', '#FF9A56', '#FFB366']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              {/* Decorative elements */}
              <View style={styles.decorativeContainer}>
                <Ionicons name="restaurant" size={40} color="rgba(255,255,255,0.3)" style={styles.icon1} />
                <Ionicons name="bicycle" size={35} color="rgba(255,255,255,0.2)" style={styles.icon2} />
                <Ionicons name="storefront" size={30} color="rgba(255,255,255,0.25)" style={styles.icon3} />
              </View>
              
              {/* Back button and title */}
              <View style={styles.headerContent}>
                <Pressable style={styles.backButtonGradient} onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <View style={styles.titleContainer}>
                  <Text style={styles.mainTitle}>Partner Registration</Text>
                  <Text style={styles.subtitle}>Join our delivery network</Text>
                  <TouchableOpacity onPress={()=> router.replace('/(partners)/(tabs)/home')} ><Text>home</Text></TouchableOpacity>
                </View>
                {/* <TouchableOpacity onP,90'ress={()=> router.push('/(partners)/(tabs)/home')} ><Text>Home</Text></TouchableOpacity> */}
              </View>
            </LinearGradient>
          </View>

          <View style={styles.form}>
            {/* RHF inputs */}
            <Controller
              control={control}
              name="business_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Business Name</Text>
                  <TextInput
                    placeholder="Delicious Foods Inc."
                    style={[styles.input, errors.business_name && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.business_name && <Text style={styles.errorText}>{errors.business_name.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Business Email</Text>
                  <TextInput
                    placeholder="contact@business.com"
                    keyboardType="email-address"
                    style={[styles.input, errors.email && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
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
                  <Text style={styles.label}>Contact Number</Text>
                  <TextInput
                    placeholder="+237 656-xxx-xxx"
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
                  <Text style={styles.label}>Location</Text>
                  <TextInput
                    placeholder="Mimboman, Santa-Lucia"
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
              name="categories"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Food Categories</Text>
                  <TextInput
                    placeholder="Fast Food, Desserts, Healthy..."
                    style={[styles.input, errors.categories && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.categories && <Text style={styles.errorText}>{errors.categories.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="account_number"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Bank Account Number</Text>
                  <TextInput
                    placeholder="Account number for payouts"
                    keyboardType="number-pad"
                    secureTextEntry={true}
                    style={[styles.input, errors.account_number && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.account_number && <Text style={styles.errorText}>{errors.account_number.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    placeholder="password (min 6 characters)"
                    secureTextEntry={true}
                    style={[styles.input, errors.password && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                  />
                  {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                </View>
              )}
            />

            {/* Add Description field after password */}
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Business Description</Text>
                  <TextInput
                    placeholder="Tell us about your business, cuisine, specialties..."
                    multiline
                    numberOfLines={4}
                    style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    textAlignVertical="top"
                  />
                  {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
                </View>
              )}
            />


            {/* Business Hours Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Hours</Text>
              <View style={styles.hoursContainer}>
                {DAYS_OF_WEEK.map((day) => (
                  <View key={day.id} style={styles.hourRow}>
                    <View style={styles.dayContainer}>
                      <TouchableOpacity 
                        onPress={() => toggleDayOpen(day.id)}
                        style={styles.toggleContainer}
                      >
                        <View style={[styles.toggle, businessHours[day.id].open && styles.toggleActive]}>
                          {businessHours[day.id].open && <View style={styles.toggleKnob} />}
                        </View>
                        <Text style={styles.dayText}>{day.label}</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {businessHours[day.id].open ? (
                      <View style={styles.timeContainer}>
                        <TouchableOpacity 
                          style={styles.timeInput}
                          onPress={() => showTimePicker(day.id, 'open', businessHours[day.id].openTime)}
                        >
                          <Text style={styles.timeText}>{businessHours[day.id].openTime}</Text>
                        </TouchableOpacity>
                        <Text style={styles.timeSeparator}>-</Text>
                        <TouchableOpacity 
                          style={styles.timeInput}
                          onPress={() => showTimePicker(day.id, 'close', businessHours[day.id].closeTime)}
                        >
                          <Text style={styles.timeText}>{businessHours[day.id].closeTime}</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text style={styles.closedText}>Closed</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Upload fields */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Documents & Photos</Text>
              
              <View style={styles.uploadCard}>
                <UploadField
                  type="document"
                  value={businessDoc}
                  onChange={handleSetDoc}
                  label="Business License / Registration Document"
                  accept={[
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ]}
                  maxFileSize={MAX_FILE_SIZE}
                />
                
                {businessDoc && (
                  <View style={styles.docPreview}>
                    <Ionicons name="document-text" size={24} color="#4F46E5" />
                    <View style={styles.docInfo}>
                      <Text style={styles.docName} numberOfLines={1}>{businessDoc.name}</Text>
                      <Text style={styles.docSize}>
                        {businessDoc.size ? `${Math.round(businessDoc.size / 1024)} KB` : ''}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.uploadCard}>
                <Text style={styles.uploadLabel}>Business Photos (shop front, menu)</Text>
                
                <UploadField
                  type="image"
                  value={null}
                  onChange={handleAddPhoto}
                  label="Add photo"
                  maxFileSize={MAX_FILE_SIZE}
                />
                
                {businessPhotos.length > 0 && (
                  <View style={styles.photosContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {businessPhotos.map((p, idx) => (
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
              style={[styles.submitButton, (isSubmitting || uploadingFiles) && { opacity: 0.7 }]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || uploadingFiles}
            >
              {(isSubmitting || uploadingFiles) ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitText}>Register as Partner</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {timePicker.visible && (
        <DateTimePicker
          value={new Date(`2000-01-01T${timePicker.time}:00`)}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

/* ---------------- UPDATED STYLES ---------------- */
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0A1F33',
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
    top: 30,
    right: 40,
    transform: [{ rotate: '15deg' }],
  },
  icon2: {
    position: 'absolute',
    top: 80,
    right: 80,
    transform: [{ rotate: '-10deg' }],
  },
  icon3: {
    position: 'absolute',
    top: 120,
    right: 20,
    transform: [{ rotate: '20deg' }],
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
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
  // headerImage: { ... },
  // headerRow: { ... },
  // backButton: { ... },
  // title: { ... },

  form: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingTop: 18,
    paddingBottom: 40,
    marginTop: -12,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  input: {
    backgroundColor: '#F0F5FA',
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#333',
    fontFamily: 'SpaceMono',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 6,
    fontFamily: 'SpaceMono',
  },
  submitButton: {
    backgroundColor: '#FF7622',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 8,
  },
  submitText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  section: {
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
  hoursContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    padding: 2,
    marginRight: 12,
  },
  toggleActive: {
    backgroundColor: '#10B981',
  },
  toggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    marginLeft: 20,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  timeSeparator: {
    marginHorizontal: 8,
    color: '#6B7280',
  },
  closedText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  uploadCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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
  },
  docPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  docInfo: {
    marginLeft: 12,
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  docSize: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
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
  textArea: {
    height: 50,
    textAlignVertical: 'top'
  }
});

export default PartnerSignup;