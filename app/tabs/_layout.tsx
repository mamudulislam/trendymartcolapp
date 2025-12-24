import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const ACTIVE = '#3B82F6';   // Modern blue
const INACTIVE = '#9CA3AF';

const TabIcon = ({ name, focused, color }: any) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Ionicons name={name} size={22} color={color} />
    <View
      style={{
        marginTop: 6,
        width: focused ? 16 : 6,
        height: 3,
        borderRadius: 2,
        backgroundColor: focused ? color : 'transparent',
      }}
    />
  </View>
);

const TabsLayout = () => {
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 12,
          height: 60,
          borderRadius: 20,
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          borderTopWidth: 0,
          ...Platform.select({
            android: { elevation: 12 },
            ios: {
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 6 },
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              name={focused ? 'home' : 'home-outline'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Categories"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              name={focused ? 'grid' : 'grid-outline'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Cart"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              name={focused ? 'cart' : 'cart-outline'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Wishlist"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              name={focused ? 'heart' : 'heart-outline'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              name={focused ? 'person' : 'person-outline'}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
