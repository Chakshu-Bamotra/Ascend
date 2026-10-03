import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Button } from './Button';
import { Text } from './Text';

interface EmptyStateProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const t = useTheme();
  return (
    <View style={[styles.wrap, { padding: t.spacing[6], gap: t.spacing[3] }]}>
      <Ionicons name={icon} size={40} color={t.colors.textMuted} />
      <Text variant="heading" align="center">
        {title}
      </Text>
      {description ? (
        <Text muted align="center">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} style={{ marginTop: t.spacing[2] }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { alignItems: 'center', justifyContent: 'center' } });
