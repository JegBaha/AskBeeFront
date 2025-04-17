import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderRadius: 30, // Rounded corners for the tab bar container
          marginHorizontal: 40, // Center the tab bar with margin
          borderTopWidth: 0, // Remove top border
          position: 'absolute', // Ensure precise positioning
          left: 0,
          right: 0,
          bottom: 0, // Stick to the very bottom of the screen
          alignSelf: 'center', // Center horizontally
          width: 'auto', // Adjust width based on content
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#B0BEC5',
        tabBarLabelStyle: {
          display: 'none', // Hide the labels
        },
        tabBarIconStyle: {
          padding: 4, // Reduced padding to prevent overlap
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="characterselection"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
      {/* Hide the following routes from the tab bar */}
      <Tabs.Screen
        name="camera"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="cartoon"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}