import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const TabIcon = ({ focused, icon, title }: any) => {
  return (
    <View style={styles.tabItem}>
      <View style={[
        styles.iconContainer,
        focused && styles.activeIconContainer
      ]}>
        {icon}
      </View>
      <Text style={[
        styles.tabText,
        focused && styles.activeTabText
      ]}>
        {title}
      </Text>
    </View>
  );
};

export default function TabLayout() {


  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                focused={focused} 
                icon={<Ionicons name="home" size={24} color={focused ? "#FFF" : "#FF7622"} />} 
                title="Home" 
              />
            ),

          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                focused={focused} 
                icon={<MaterialIcons name="list-alt" size={24} color={focused ? "#FFF" : "#FF7622"} />} 
                title="Orders" 
              />
            ),
            
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                focused={focused} 
                icon={<Ionicons name="search" size={24} color={focused ? "#FFF" : "#FF7622"} />} 
                title="Search" 
              />
            )
          }}
        />
        <Tabs.Screen
          name="ViewCart"
          options={{
            tabBarStyle: { display: 'none' },
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                focused={focused} 
                icon={<FontAwesome name="shopping-basket" size={22} color={focused ? "#FFF" : "#FF7622"} />} 
                title="Cart" 
              />
            ),
            
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarStyle: {display: 'none'},
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                focused={focused} 
                icon={<MaterialCommunityIcons name="account" size={26} color={focused ? "#FFF" : "#FF7622"} />} 
                title="Profile" 
              />
            )
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  tabBar: {
    position: 'absolute',
    width: '90%',
    bottom: 25,
    left: 20,
    right: 20,
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    backgroundColor: '#FFF',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F2',
  },
  activeIconContainer: {
    backgroundColor: '#FF7622',
    transform: [{ translateY: -5 }],
  },
  tabText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF7622',
    fontWeight: '600',
    
  },
});