import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Button } from './Button';
import { Text } from './Text';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const t = useTheme();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={[styles.center, { backgroundColor: t.colors.overlay, padding: t.spacing[6] }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
          accessibilityLabel="Dismiss"
        />
        <View
          accessibilityRole="alert"
          style={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: t.colors.surface,
            borderRadius: t.radius.lg,
            padding: t.spacing[5],
            gap: t.spacing[3],
          }}
        >
          <Text variant="heading">{title}</Text>
          {message ? <Text muted>{message}</Text> : null}
          <View style={[styles.actions, { gap: t.spacing[2], marginTop: t.spacing[2] }]}>
            <Button
              title={cancelLabel}
              variant="secondary"
              onPress={onCancel}
              disabled={loading}
              style={styles.flex}
            />
            <Button
              title={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              loading={loading}
              style={styles.flex}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row' },
  flex: { flex: 1 },
});
