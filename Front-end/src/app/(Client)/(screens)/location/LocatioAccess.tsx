import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function LocationAccess() {
  const router = useRouter();

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      router.replace('/(Client)/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/src/assets/images/3DMap.png')} 
        style={styles.image}
      />
      
      <Text style={styles.title}>Enable Location</Text>
      <Text style={styles.subtitle}>
        To find restaurants near you, we need access to your location
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={requestLocationPermission}
      >
        <Ionicons name="location" size={20} color="white" />
        <Text style={styles.buttonText}>Enable Location</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => router.replace('/(Client)/(tabs)')}
      >
        <Text style={styles.secondaryText}>Enter Location Manually</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#FF7622',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  secondaryButton: {
    padding: 15,
  },
  secondaryText: {
    color: '#FF7622',
    fontSize: 16,
  },
});