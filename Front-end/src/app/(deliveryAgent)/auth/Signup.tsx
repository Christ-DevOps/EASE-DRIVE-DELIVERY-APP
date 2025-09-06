// DeliverySignup.tsx
import React, { useEffect, useRef, useState } from 'react';
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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import UploadField from '@/src/components/UploadFields';
import * as yup from 'yup';

/**
 * IMPORTANT:
 * - Set API_BASE_URL to your backend
 * - Partner check endpoint used: POST `${API_BASE_URL}/api/partners/check-exists`
 * - Register endpoint used: POST `${API_BASE_URL}/api/auth/register`b
 */
const API_BASE_URL =  'http://192.168.100.54:5000';
const PARTNER_CHECK = `${API_BASE_URL}/api/partners/check-exists`;
const REGISTER_ENDPOINT = `${API_BASE_URL}/api/auth/register`;

const DeliverySchema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().required('Email is required').email('Invalid email'),
  phone: yup.string()
    .required('Phone is required')
    .matches(/^[0-9()+\- \s]{7,20}$/, 'Invalid phone number'),
  address: yup.string().required('Address is required'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  vehicle_type: yup.string().required('Vehicle type is required'),
  Immatriculation: yup.string().required('Vehicle registration is required'),
  IDcard: yup.string()
    .required('License number is required')
    .min(3, 'Must be at least 3 characters'),
  restaurant_name: yup.string().when('has_restaurant', {
    is: true,
    then: (schema) => schema.required('Restaurant name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const MAX_FILE_SIZE = 20 * 1024 * 1024;

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  vehicle_type: string;
  Immatriculation: string;
  IDcard: string;
  restaurant_name?: string;
  has_restaurant?: boolean;
};

export default function DeliverySignup() {
  const router = useRouter();
  const [loaded] = useFonts({ SpaceMono: require('@/src/assets/fonts/Quicksand-Bold.ttf') });
  const { control, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, reset } = useForm<FormValues>({
    resolver: yupResolver(DeliverySchema),
    defaultValues: {
      name: '', email: '', phone: '', address: '', password: '',
      vehicle_type: '',Immatriculation: '', IDcard: '', restaurant_name: '', has_restaurant: false
    }
  });

  // UI state
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [licensePhotos, setLicensePhotos] = useState<any[]>([]);
  const [hasRestaurant, setHasRestaurant] = useState(false);
  const [restaurantVerifying, setRestaurantVerifying] = useState(false);
  const [restaurantVerified, setRestaurantVerified] = useState<boolean | null>(null);
  const [verifiedPartnerId, setVerifiedPartnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // password toggle
  const [showPassword, setShowPassword] = useState(false);

  //handles profile photo upload
  const handleAddProfilePhoto = (file: any | null) => {
    if (!file) return; 
    if(file.size && file.size > MAX_FILE_SIZE) {
      Alert.alert('File too large', 'Please upload files smaller than 20 MB.');
      return;
    }
    setProfilePhoto(file);
  };

  //handle license photos upload
  const handleAddLicensePhoto = (file: any | null) => {
    if (!file) return;
    if(file.size && file.size > MAX_FILE_SIZE) {
      Alert.alert('File too large', 'Please upload files smaller than 20 MB.');
      return;
    }
    setLicensePhotos(prev =>
    {
      if (prev.length >= 4) {
        Alert.alert('Limit reached', 'You can upload up to 4 license photos.');
        return prev;
    }
      return [...prev, file]
    });
  };

  // Watch restaurant name (debounce)
  const watchRestaurantName = watch('restaurant_name', '');
  const verifyTimeout = useRef<number | null>(null);
  const lastCheckedName = useRef<string | null>(null);

  //remove photo at index
const handleRemoveLicenseAt = (idx: number) => setLicensePhotos(prev => prev.filter((_, i) => i !== idx));
const handleRemoveProfilePhoto = () => setProfilePhoto(null);

  const handleRestaurantToggle = (v: boolean) => {
    setHasRestaurant(v);
    setValue('has_restaurant', v);
    if (!v) {
      setValue('restaurant_name', '');
      setRestaurantVerified(null);
      setVerifiedPartnerId(null);
    }
  };

  useEffect(() => {
    if (!hasRestaurant) {
      setRestaurantVerified(null);
      setVerifiedPartnerId(null);
      if (verifyTimeout.current) { clearTimeout(verifyTimeout.current); verifyTimeout.current = null; }
      return;
    }

    const name = (watchRestaurantName || '').trim();
    if (!name) {
      setRestaurantVerified(null);
      setVerifiedPartnerId(null);
      return;
    }

    if (lastCheckedName.current === name && restaurantVerified !== null) return;

    setRestaurantVerifying(true);
    setRestaurantVerified(null);

    if (verifyTimeout.current) clearTimeout(verifyTimeout.current);
    verifyTimeout.current = (setTimeout(async () => {
      try {
        lastCheckedName.current = name;
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(PARTNER_CHECK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
          signal: controller.signal,
        });
        clearTimeout(t);

        if (!res.ok) {
          setRestaurantVerified(false);
          setVerifiedPartnerId(null);
        } else {
          const j = await res.json();
          if (j.exists && j.partner && j.partner._id) {
            setRestaurantVerified(true);
            setVerifiedPartnerId(j.partner._id);
          } else {
            setRestaurantVerified(false);
            setVerifiedPartnerId(null);
          }
        }
      } catch (err: any) {
        console.warn('Partner check error', err?.message || err);
        setRestaurantVerified(false);
        setVerifiedPartnerId(null);
      } finally {
        setRestaurantVerifying(false);
      }
    }, 800) as unknown) as number;

    return () => {
      if (verifyTimeout.current) { clearTimeout(verifyTimeout.current); verifyTimeout.current = null; }
    };
  }, [watchRestaurantName, hasRestaurant]);

  const onSubmit = async (data: FormValues) => {
    if (licensePhotos.length === 0) {
      Alert.alert('Missing document', "Please upload at least one driver's license photo.");
      return;
    }
    if (hasRestaurant && restaurantVerified !== true) {
      Alert.alert('Restaurant verification', 'Please verify the restaurant exists (green check) or toggle off.');
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      if (!profilePhoto) {
        Alert.alert('Missing photo', 'Please upload a personal profile photo.');
        setLoading(false);
        clearTimeout(timeoutId);
        return;
      }
      if(licensePhotos.length < 3) {
        Alert.alert('Incomplete upload', 'Please upload all required license photos (front and back). You may add a 3rd if needed.');
        setLoading(false);
        clearTimeout(timeoutId);
        return;
      }
      if(licensePhotos.length > 4) {
        Alert.alert('Too many files', 'You can upload up to 4 license photos.');
        setLoading(false);
        clearTimeout(timeoutId);
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('password', data.password);
      formData.append('role', 'delivery_agent');
      formData.append('vehicleType', data.vehicle_type);
      formData.append('vehicleImmatriculation', data.Immatriculation);
      formData.append('IDcard', data.IDcard);

      if (hasRestaurant && verifiedPartnerId) {
        formData.append('restaurantId', verifiedPartnerId);
      } else if (hasRestaurant && data.restaurant_name) {
        formData.append('restaurantName', data.restaurant_name.trim());
        formData.append('restaurantId', '');
      } else {
        formData.append('restaurantId', '');
      }

      //helper to pass image
      const makeFileObject = (file:any, fallbackName: string) => ({
        uri: file.uri,
        name: file.name || fallbackName,
        type: file.type || 'jpeg/image'
      });

      formData.append('profilePhoto', makeFileObject(profilePhoto, 'profile.jpg'));
      licensePhotos.forEach((p:any, i:number) => {
        formData.append('licensePhotos', makeFileObject(p, `license-${i+1}.jpg`)); 
      })


      const res = await fetch(REGISTER_ENDPOINT, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let parsed = null;
        try { parsed = await res.json(); } catch (_) {}
        const msg = parsed?.message || `Server returned ${res.status}`;
        Alert.alert('Registration failed', msg);
        return;
      }

      await res.json();
      Alert.alert('Success', 'Your delivery agent account has been created. Waiting approval.', [
        { text: 'OK', onPress: () => {
          reset();
          setLicensePhotos([]);
          setHasRestaurant(false);
          setRestaurantVerified(null);
          setVerifiedPartnerId(null);
          router.replace('/(deliveryAgent)/auth/deliveryWaitingScreen');
        } }
      ]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        Alert.alert('Timeout', 'Request took too long. Check your network and try again.');
      } else if (err.message && err.message.includes('Network request failed')) {
        Alert.alert('Network error', `Cannot reach server. Confirm API_BASE_URL is correct for your environment.`);
      } else {
        console.error('Register error', err);
        Alert.alert('Error', err.message || 'Registration failed');
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
          <View style={styles.gradientHeader}>
            <LinearGradient colors={['#32027aff', '#2f29ecff', '#c3640bff']} style={styles.gradientBackground}>
              <View style={styles.headerContent}>
                <Pressable style={styles.backButtonGradient} onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <View style={styles.titleContainer}>
                  <Text style={styles.mainTitle}>Delivery Agent</Text>
                  <Text style={styles.subtitle}>Start earning with us today</Text>
                  <TouchableOpacity onPress={()=> router.replace('/(deliveryAgent)/(tabs)/Home')}><Text>home</Text></TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.form}>
            {/* Name */}
            <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="person" size={20} color="#6B7280" style={styles.leftIcon} />
                  <TextInput placeholder="John Doe" style={[styles.input, errors.name && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
              </View>
            )} />

            {/* Email */}
            <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="mail" size={20} color="#6B7280" style={styles.leftIcon} />
                  <TextInput placeholder="john@example.com" keyboardType="email-address" autoCapitalize="none" style={[styles.input, errors.email && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>
            )} />

            {/* Phone */}
            <Controller control={control} name="phone" render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="call" size={20} color="#6B7280" style={styles.leftIcon} />
                  <TextInput placeholder="+237 680-xxx-xxx" keyboardType="phone-pad" style={[styles.input, errors.phone && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
              </View>
            )} />

            {/* Address */}
            <Controller control={control} name="address" render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="location" size={20} color="#6B7280" style={styles.leftIcon} />
                  <TextInput placeholder="123 Main St, City" style={[styles.input, errors.address && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} />
                </View>
                {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
              </View>
            )} />

            {/* Password with toggle */}
            <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="lock-closed" size={20} color="#6B7280" style={styles.leftIcon} />
                  <TextInput placeholder="Choose a password" secureTextEntry={!showPassword} style={[styles.input, errors.password && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} />
                  <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={styles.eyeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>
            )} />

            {/* Vehicle */}
            <Controller control={control} name="vehicle_type" render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Type</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="car-sport" size={20} color="#6B7280" style={styles.leftIcon} />
                  <TextInput placeholder="Motorcycle, Car, Bicycle..." style={[styles.input, errors.vehicle_type && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} />
                </View>
                {errors.vehicle_type && <Text style={styles.errorText}>{errors.vehicle_type.message}</Text>}
              </View>
            )} />

            {/* Immatriculation */}
            <Controller control={control} name='Immatriculation' render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Immatriculation</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="reader" size={20} color="#6B7280" style={styles.leftIcon} />
                  <TextInput placeholder="AB123CD" style={[styles.input, errors.Immatriculation && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} />
                </View>
                {errors.Immatriculation && <Text style={styles.errorText}>{errors.Immatriculation.message}</Text>}
              </View>
            )} />

            {/* License number */}
            <Controller control={control} name="IDcard" render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID Card Number</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="card" size={20} color="#6B7280" style={styles.leftIcon} />
                  <TextInput placeholder="DL12345678" style={[styles.input, errors.IDcard && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} />
                </View>
                {errors.IDcard && <Text style={styles.errorText}>{errors.IDcard.message}</Text>}
              </View>
            )} />

            {/* Restaurant toggle & input */}
            <View style={styles.toggleSection}>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Are you associated with a restaurant?</Text>
                <Switch value={hasRestaurant} onValueChange={handleRestaurantToggle} trackColor={{ false: '#E5E7EB', true: '#FF7622' }} thumbColor={hasRestaurant ? '#FFF' : '#9CA3AF'} />
              </View>

              {hasRestaurant && (
                <Controller control={control} name="restaurant_name" render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Restaurant Name</Text>
                    <View style={styles.iconInput}>
                      <Ionicons name="restaurant" size={20} color="#6B7280" style={styles.leftIcon} />
                      <TextInput placeholder="Enter restaurant name" style={[
                        styles.input, styles.restaurantInput,
                        errors.restaurant_name && styles.inputError,
                        restaurantVerified === true && styles.inputSuccess,
                        restaurantVerified === false && styles.inputError
                      ]} value={value} onChangeText={onChange} onBlur={onBlur} />
                      <View style={styles.verificationIndicator}>
                        {restaurantVerifying && <ActivityIndicator size="small" color="#FF7622" />}
                        {!restaurantVerifying && restaurantVerified === true && <Ionicons name="checkmark-circle" size={20} color="#10B981" />}
                        {!restaurantVerifying && restaurantVerified === false && <Ionicons name="close-circle" size={20} color="#EF4444" />}
                      </View>
                    </View>
                    {errors.restaurant_name && <Text style={styles.errorText}>{errors.restaurant_name.message}</Text>}
                    {restaurantVerified === false && <Text style={styles.errorText}>Restaurant not found. We'll register you as independent unless a matching restaurant exists.</Text>}
                    {restaurantVerified === true && <Text style={styles.successText}>Restaurant verified — request will be sent to them.</Text>}
                  </View>
                )} />
              )}
            </View>

            {/* Uploads */}
            <View style={styles.uploadCard}>
              <Text style={styles.uploadLabel}>Personal Profile Photo</Text>
              <UploadField type="image" onChange={handleAddProfilePhoto} maxFileSize={MAX_FILE_SIZE} />
              {profilePhoto ? (
                <View style={[styles.photoItem, { marginTop: 8 }]}>
                  <Image source={{ uri: profilePhoto.uri }} style={styles.photoThumb} />
                  <TouchableOpacity style={styles.removePhotoBtn} onPress={handleRemoveProfilePhoto}>
                    <Ionicons name="close-circle" size={22} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>Upload a clear face photo</Text>
              )}
            </View>

            <View style={[styles.uploadCard, { marginTop: 12 }]}>
              <Text style={styles.uploadLabel}>Driver's License (Front & Back)</Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Upload 2 photos (front + back). You may add a 3rd if needed.</Text>
              <UploadField type="image" onChange={handleAddLicensePhoto} maxFileSize={MAX_FILE_SIZE} />
              {licensePhotos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
                  {licensePhotos.map((p, idx) => (
                    <View key={idx} style={styles.photoItem}>
                      <Image source={{ uri: p.uri }} style={styles.photoThumb} />
                      <TouchableOpacity style={styles.removePhotoBtn} onPress={() => handleRemoveLicenseAt(idx)}>
                        <Ionicons name="close-circle" size={22} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>


            <TouchableOpacity style={[styles.submitButton, (isSubmitting || loading) && { opacity: 0.7 }]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting || loading}>
              {(isSubmitting || loading) ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Register as Agent</Text>}
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
}


// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A1F33" },
  gradientHeader: { height: 200, position: 'relative' },
  gradientBackground: { flex: 1, paddingTop: 50 },
  headerContent: { flex: 1, paddingHorizontal: 25, paddingTop: 20, flexDirection: 'row', alignItems: 'flex-start' },
  backButtonGradient: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50, padding: 12, marginRight: 16 },
  titleContainer: { flex: 1, paddingTop: 8 },
  mainTitle: { color: 'white', fontSize: 28, fontWeight: '700', fontFamily: 'SpaceMono' },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 16, marginTop: 4, fontFamily: 'SpaceMono' },
  form: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 30, paddingTop: 24, paddingBottom: 30, marginTop: -12 },
  inputGroup: { marginBottom: 16 },
  label: { marginBottom: 8, fontSize: 15, fontWeight: '600', color: '#333', fontFamily: 'SpaceMono' },

  // Icon + input row
  iconInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#F0F5FA", borderRadius: 10, paddingHorizontal: 8 },
  leftIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333', fontFamily: 'SpaceMono' },
  eyeBtn: { padding: 8 },

  inputError: { borderColor: '#FF3B30', borderWidth: 1 },
  inputSuccess: { borderColor: '#10B981', borderWidth: 1 },
  errorText: { color: '#FF3B30', fontSize: 12, marginTop: 6, fontFamily: 'SpaceMono' },
  successText: { color: '#10B981', fontSize: 12, marginTop: 6, fontFamily: 'SpaceMono' },

  toggleSection: { marginBottom: 18, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleLabel: { fontSize: 15, fontWeight: '600', color: '#374151', fontFamily: 'SpaceMono', flex: 1, marginRight: 12 },
  restaurantInputContainer: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  restaurantInput: { flex: 1, paddingRight: 48 },
  verificationIndicator: { position: 'absolute', right: 12, justifyContent: 'center', alignItems: 'center' },

  uploadSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#1F2937', fontFamily: 'SpaceMono' },
  uploadCard: { backgroundColor: 'white', borderRadius: 8, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  uploadLabel: { fontSize: 15, fontWeight: '600', marginBottom: 8, color: '#374151', fontFamily: 'SpaceMono' },
  photosContainer: { marginTop: 8 },
  photoItem: { marginRight: 12, position: 'relative' },
  photoThumb: { width: 80, height: 80, borderRadius: 8 },
  removePhotoBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: 'white', borderRadius: 12, padding: 2 },

  submitButton: { backgroundColor: "#FF7622", padding: 14, justifyContent: 'center', alignItems: 'center', borderRadius: 12, marginTop: 14 },
  submitText: { color: 'white', fontWeight: '700', fontSize: 16, fontFamily: 'SpaceMono' },

  switchContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  switchText: { color: '#666', fontFamily: 'SpaceMono' },
  switchLink: { color: '#FF7622', fontWeight: '700', fontFamily: 'SpaceMono', marginLeft: 8 },
});
