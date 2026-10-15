import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Settings', icon: 'settings-outline', onPress: () => router.push('/settings') },
  { label: 'Upgrade to Pro', icon: 'sparkles', onPress: () => router.push('/paywall') },
];

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const buttonTop = insets.top + 8;

  const handleSelect = (item: MenuItem) => {
    setIsOpen(false);
    item.onPress();
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.menuButton, { top: buttonTop }]}
        onPress={() => setIsOpen(true)}
        accessibilityLabel='Open menu'
      >
        <Ionicons name='menu' size={26} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={() => setIsOpen(false)}
      >
        {/* Tapping the dimmed area outside the panel closes the menu */}
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          {/* A Pressable with no onPress keeps taps on the panel from closing it */}
          <Pressable style={[styles.panel, { top: buttonTop + 52 }]}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Ionicons name={item.icon} size={20} color={colors.text} />
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    // Semi-transparent so the button stays readable over photos and videos
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  panel: {
    position: 'absolute',
    left: 16,
    minWidth: 200,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemText: {
    fontSize: 16,
    color: colors.text,
  },
});
