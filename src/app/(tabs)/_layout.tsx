import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

function icon(active: IconName, inactive: IconName) {
  return function TabIcon({
    focused,
    color,
    size,
  }: {
    focused: boolean;
    color: ColorValue;
    size: number;
  }) {
    return <Ionicons name={focused ? active : inactive} color={color} size={size} />;
  };
}

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.primary,
        tabBarInactiveTintColor: t.colors.textMuted,
        tabBarStyle: { backgroundColor: t.colors.surface, borderTopColor: t.colors.border },
        tabBarLabelStyle: { fontFamily: t.font.family.medium, fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: icon('barbell', 'barbell-outline') }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'History', tabBarIcon: icon('time', 'time-outline') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: icon('person', 'person-outline') }}
      />
    </Tabs>
  );
}
