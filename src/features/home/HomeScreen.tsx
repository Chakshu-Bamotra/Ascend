import { View } from 'react-native';

import { Card, EmptyState, Screen, Text } from '@/components/ui';
import { timeOfDayLabel } from '@/lib/time';
import { useTheme } from '@/theme';

export function HomeScreen() {
  const t = useTheme();
  return (
    <Screen scroll>
      <View style={{ gap: t.spacing[1], marginBottom: t.spacing[6] }}>
        <Text variant="caption" muted>
          {timeOfDayLabel()}
        </Text>
        <Text variant="display">Ascend</Text>
      </View>
      <Card>
        <EmptyState
          icon="barbell-outline"
          title="No workouts yet"
          description="Your last three sessions show up here."
        />
      </Card>
    </Screen>
  );
}
