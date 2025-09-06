import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const AdminDashboard = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 2547,
    clients: 1890,
    partners: 156,
    deliveryAgents: 89,
    activeAgents: 67,
    todayOrders: 234,
    totalOrders: 15678,
    revenue: 45678.90,
    pendingRequests: 12,
    unreadFeedback: 8
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD-2024-234',
      customerName: 'Alice Kamga',
      restaurant: 'Delicious Bites',
      amount: 15500,
      status: 'delivered',
      deliveryAgent: 'John Doe',
      createdAt: '2024-01-15T16:30:00Z'
    },
    {
      id: 'ORD-2024-233',
      customerName: 'Robert Talla',
      restaurant: 'Spicy Kitchen',
      amount: 8750,
      status: 'in_transit',
      deliveryAgent: 'Jane Smith',
      createdAt: '2024-01-15T15:45:00Z'
    },
    {
      id: 'ORD-2024-232',
      customerName: 'Marie Fotso',
      restaurant: 'Pizza Corner',
      amount: 12300,
      status: 'preparing',
      deliveryAgent: null,
      createdAt: '2024-01-15T15:20:00Z'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const StatCard = ({ icon, title, value, trend, colors, onPress }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
      <LinearGradient colors={colors} style={styles.statGradient}>
        <View style={styles.statHeader}>
          <Ionicons name={icon} size={28} color="white" style={styles.statIcon} />
          <Text style={styles.statValue}>{value}</Text>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons name="trending-up" size={12} color="rgba(255,255,255,0.9)" />
            <Text style={styles.trendText}>{trend}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ icon, title, subtitle, colors, onPress, badge }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <LinearGradient colors={colors} style={styles.actionGradient}>
        <View style={styles.actionHeader}>
          <View style={styles.actionIconContainer}>
            <Ionicons name={icon} size={24} color="white" />
            {badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const OrderCard = ({ order }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'delivered': return '#10B981';
        case 'in_transit': return '#3B82F6';
        case 'preparing': return '#F59E0B';
        default: return '#6B7280';
      }
    };

    const getStatusText = (status) => {
      return status.replace('_', ' ').toUpperCase();
    };

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{order.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderDetails}>
          <Text style={styles.orderDetailText}>
            <Text style={styles.orderLabel}>Customer: </Text>
            {order.customerName}
          </Text>
          <Text style={styles.orderDetailText}>
            <Text style={styles.orderLabel}>Restaurant: </Text>
            {order.restaurant}
          </Text>
          {order.deliveryAgent && (
            <Text style={styles.orderDetailText}>
              <Text style={styles.orderLabel}>Agent: </Text>
              {order.deliveryAgent}
            </Text>
          )}
          <Text style={styles.orderDetailText}>
            <Text style={styles.orderLabel}>Amount: </Text>
            {order.amount.toLocaleString()} FCFA
          </Text>
          <Text style={styles.orderDetailText}>
            <Text style={styles.orderLabel}>Time: </Text>
            {new Date(order.createdAt).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient 
        colors={['#FF7622', '#FF9A56']} 
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>Delivery Management System</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Overview Statistics</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="people"
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            trend="+12% this month"
            colors={['#3B82F6', '#1E40AF']}
          />
          <StatCard
            icon="person"
            title="Clients"
            value={stats.clients.toLocaleString()}
            trend="+8% this month"
            colors={['#10B981', '#059669']}
          />
          <StatCard
            icon="storefront"
            title="Partners"
            value={stats.partners.toString()}
            trend="+15% this month"
            colors={['#8B5CF6', '#7C3AED']}
          />
          <StatCard
            icon="bicycle"
            title="Active Agents"
            value={`${stats.activeAgents}/${stats.deliveryAgents}`}
            trend="89% online"
            colors={['#FF7622', '#FF9A56']}
          />
        </View>

        {/* Revenue Cards */}
        <View style={styles.revenueGrid}>
          <StatCard
            icon="bag"
            title="Today's Orders"
            value={stats.todayOrders.toString()}
            trend="+23% vs yesterday"
            colors={['#6366F1', '#4F46E5']}
          />
          <StatCard
            icon="trending-up"
            title="Total Revenue"
            value={`${(stats.revenue / 1000).toFixed(0)}K FCFA`}
            trend="+18% this month"
            colors={['#059669', '#047857']}
          />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <QuickActionCard
            icon="time"
            title="Pending Requests"
            subtitle={`${stats.pendingRequests} awaiting approval`}
            colors={['#EF4444', '#DC2626']}
            badge={stats.pendingRequests}
            onPress={() => router.push('/(admin)/requests')}
          />
          <QuickActionCard
            icon="chatbubbles"
            title="Customer Feedback"
            subtitle={`${stats.unreadFeedback} unread messages`}
            colors={['#F59E0B', '#D97706']}
            badge={stats.unreadFeedback}
            onPress={() => router.push('/(admin)/feedback')}
          />
          <QuickActionCard
            icon="add-circle"
            title="Add Users"
            subtitle="Register partners & agents"
            colors={['#6366F1', '#4F46E5']}
            onPress={() => router.push('/(admin)/add-users')}
          />
          <QuickActionCard
            icon="analytics"
            title="View Reports"
            subtitle="Detailed analytics"
            colors={['#8B5CF6', '#7C3AED']}
            onPress={() => router.push('/(admin)/reports')}
          />
        </View>

        {/* Recent Orders */}
        <View style={styles.ordersSection}>
          <View style={styles.ordersSectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/orders')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.ordersList}>
            {recentOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  profileButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  revenueGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 50) / 2,
    marginBottom: 12,
  },
  statGradient: {
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    opacity: 0.8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    width: (width - 50) / 2,
    marginBottom: 12,
  },
  actionGradient: {
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 120,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  actionIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  ordersSection: {
    marginTop: 8,
  },
  ordersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 16,
    color: '#FF7622',
    fontWeight: '600',
  },
  ordersList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  orderDetails: {
    gap: 4,
  },
  orderDetailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderLabel: {
    fontWeight: '600',
    color: '#374151',
  },
});

export default AdminDashboard;