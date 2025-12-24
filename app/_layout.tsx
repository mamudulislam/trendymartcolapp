import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import LoginScreen from './login';

const RootLayoutNav = () => {
  const { isDark } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password-otp" options={{ headerShown: false }} />
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen 
          name="checkout" 
          options={{ 
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_bottom'
          }} 
        />
        <Stack.Screen 
          name="notifications" 
          options={{ 
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
        <Stack.Screen name="addresses" options={{ headerShown: false }} />
        <Stack.Screen name="payment-methods" options={{ headerShown: false }} />
        <Stack.Screen name="help" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

const AppLayout = () => {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  const isAuthPage = ['/login', '/register', '/forgot-password', '/forgot-password-otp'].includes(pathname);

  if (!isLoggedIn && !isAuthPage) {
    return <LoginScreen />;
  }

  return <RootLayoutNav />;
}

const RootLayout = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppLayout />
        </ThemeProvider>
      </AuthProvider>
    </AppProvider>
  );
};

export default RootLayout;
