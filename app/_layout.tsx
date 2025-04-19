import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { UserProvider } from '../context/UserContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@expo-google-fonts/inter/Inter_400Regular.ttf'),
    'Inter-Bold': require('@expo-google-fonts/inter/Inter_700Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <UserProvider>
      
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginPage" />
        <Stack.Screen name="SignUpPage" />
        <Stack.Screen name="NewAccount1" />
        <Stack.Screen name="NewAccount2" />
        <Stack.Screen name="Tabs" options={{ gestureEnabled: false }} />
      </Stack>
      <StatusBar style="dark" />
    </UserProvider>
  );
}