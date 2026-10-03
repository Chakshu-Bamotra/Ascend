import { EmptyState, Screen, Text } from '@/components/ui';
import { useTheme } from '@/theme';

export function HistoryScreen() {
  const t = useTheme();
  return (
    <Screen scroll>
      <Text variant="title" style={{ marginBottom: t.spacing[6] }}>
        History
      </Text>
      <EmptyState
        icon="time-outline"
        title="No workouts yet"
        description="Finished workouts, weekly stats, and PRs appear here."
      />
    </Screen>
  );
}
