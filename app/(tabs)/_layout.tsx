import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#ECEFF1',
          borderRadius: 36,
          marginHorizontal: 32,
          borderTopWidth: 0,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 16,
          alignSelf: 'center',
          width: 'auto',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.05)',
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#90A4AE',
        tabBarLabelStyle: {
          display: 'none',
        },
        tabBarIconStyle: {
          padding: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="characterselection"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          href: null,
        }}
      />
        <Tabs.Screen
        name="LoginPage"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="arrow-undo" size={26} color={color} />
          ),
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
        <Tabs.Screen
        name="Hoscakal1"
        options={{
          href: null,
        }}
      />
        <Tabs.Screen
        name="chat"
        options={{
          href: null,
        }}
      />
        <Tabs.Screen
        name="NewAccount2"
        options={{
          href: null,
        }}
      />
       <Tabs.Screen
        name="Mola"
        options={{
          href: null,
        }}
      /> <Tabs.Screen
      name="SignUpPage"
      options={{
        href: null,
      }}
    />
    <Tabs.Screen
      name="NewAccount1"
      options={{
        href: null,
      }}
    />
    
    </Tabs>
  );
}