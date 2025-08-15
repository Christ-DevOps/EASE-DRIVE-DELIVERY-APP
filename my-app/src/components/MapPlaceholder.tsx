// src/components/MapPlaceholder.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const MapPlaceholder: React.FC = () => (
  <View style={styles.container}>
    <Image 
      source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2206/2206368.png' }} 
      style={styles.mapImage}
    />
    <View style={styles.markerContainer}>
      <View style={styles.marker}>
        <Text style={styles.markerText}>Delivery Agent</Text>
      </View>
      <View style={styles.destinationMarker}>
        <Text style={styles.destinationText}>Your Location</Text>
      </View>
    </View>
    <Text style={styles.note}>
      Google Maps will show real-time tracking here when integrated
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#F0F5FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
    position: 'absolute',
  },
  markerContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
  markerText: {
    color: '#FFF',
    fontWeight: '600',
  },
  destinationMarker: {
    position: 'absolute',
    bottom: '20%',
    right: '30%',
    backgroundColor: '#FF7622',
    padding: 10,
    borderRadius: 10,
  },
  destinationText: {
    color: '#FFF',
    fontWeight: '600',
  },
  note: {
    textAlign: 'center',
    color: '#777',
    padding: 20,
    fontStyle: 'italic',
  },
});

export default MapPlaceholder;