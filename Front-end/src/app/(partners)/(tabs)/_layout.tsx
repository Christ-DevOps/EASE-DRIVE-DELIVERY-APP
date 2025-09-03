import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Platform, StatusBar } from 'react-native';
import { styles } from '../../(auth)/Signup';

export default function PartnerLayout() {
    <StatusBar   />
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [{
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
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="restaurant-menu" size={24} color={color} />
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
  );
}

