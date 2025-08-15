import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderStatus } from '../../types/OrderTypes';

interface StatusBadgeProps {
  status: OrderStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    preparing: { text: 'Preparing', color: '#f39c12' },
    'in-transit': { text: 'On the way', color: '#3498db' },
    delivered: { text: 'Delivered', color: '#2ecc71' },
    received: { text: 'Received', color: '#2ecc71' },
  };

  const { text, color } = statusConfig[status];

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  }
});

export default StatusBadge;