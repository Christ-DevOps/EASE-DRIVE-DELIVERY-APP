// src/components/OrderTrackingModal.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapPlaceholder from '../MapPlaceholder';
import { Order } from '../../types/OrderTypes';

interface TrackingModalProps {
  order: Order;
  onClose: () => void;
}

const OrderTrackingModal: React.FC<TrackingModalProps> = ({ order, onClose }) => {
  if (!order.deliveryAgent) return null;
  
  const agent = order.deliveryAgent;
  
  const handleCall = () => Linking.openURL(`tel:${agent.contact}`);
  const handleSMS = () => Linking.openURL(`sms:${agent.contact}`);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="#FFF" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Your order is on the way!</Text>
      
      <MapPlaceholder />
      
      <View style={styles.agentInfo}>
        <Image 
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
          style={styles.avatar}
        />
        <View style={styles.details}>
          <Text style={styles.name}>{agent.name}</Text>
          <View style={styles.meta}>
            {/* <Text style={styles.vehicle}>{agent.vehicle}</Text> */}
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text style={styles.ratingText}>{agent.rating}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <Text style={styles.estimatedTime}>Estimated delivery: {order.estimatedTime}</Text>
      
      <View style={styles.communication}>
        <TouchableOpacity style={styles.commButton} onPress={handleCall}>
          <Ionicons name="call" size={24} color="#FFF" />
          <Text style={styles.commText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.commButton} onPress={handleSMS}>
          <Ionicons name="chatbubble" size={24} color="#FFF" />
          <Text style={styles.commText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.commButton}>
          <Ionicons name="chatbox" size={24} color="#FFF" />
          <Text style={styles.commText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex:1,
  },
  closeButton: {
    position: 'absolute',
    top: -50,
    right: 0,
    backgroundColor: '#FF7622',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicle: {
    fontSize: 14,
    color: '#777',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  estimatedTime: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 10,
    color: '#FF7622',
  },
  communication: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  commButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#FF7622',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  commText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default OrderTrackingModal;