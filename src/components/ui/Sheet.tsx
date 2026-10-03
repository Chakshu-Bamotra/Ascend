import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

import { Text } from './Text';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Bottom sheet built on Modal. Tap backdrop or Android back to close. */
export function Sheet({ visible, onClose, title, children }: SheetProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <Pressable
        style={[StyleSheet.absoluteFill, { backgroundColor: t.colors.overlay }]}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
      />
      <View style={styles.anchor} pointerEvents="box-none">
        <View
          style={{
            backgroundColor: t.colors.surface,
            borderTopLeftRadius: t.radius.lg,
            borderTopRightRadius: t.radius.lg,
            paddingTop: t.spacing[2],
            paddingBottom: insets.bottom + t.spacing[4],
          }}
        >
          <View style={[styles.grabber, { backgroundColor: t.colors.border }]} />
          {title ? (
            <Text
              variant="heading"
              style={{ paddingHorizontal: t.spacing[4], paddingVertical: t.spacing[3] }}
            >
              {title}
            </Text>
          ) : null}
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  anchor: { flex: 1, justifyContent: 'flex-end' },
  grabber: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, marginBottom: 4 },
});
