import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Platform, StatusBar, StyleSheet } from 'react-native';

export default function DeliveryLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0A1F33" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: [styles.tabbar, {
            backgroundColor: '#0A1F33',
            borderTopWidth: 0,
            height: Platform.OS === 'ios' ? 90 : 70,
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          }],
          tabBarActiveTintColor: '#FF7622',
          tabBarInactiveTintColor: '#FFFFFF99',
          tabBarLabelStyle: {
            fontFamily: 'SpaceMono',
            fontSize: 12,
            marginBottom: 4,
          },
          tabBarHideOnKeyboard: true,
        }}
      >

        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="delivery-dining" size={24} color={color} />
            ),
          }}
        />
          <Tabs.Screen
          name="Home"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user-circle-o" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    // Additional tabbar styles if needed
  },
});