import { colors } from '@/constants/colors';
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
        // Semi-transparent so the button stays readable over photos and videos
        className='overlay-btn left-4 bg-background/60'
        style={{ top: buttonTop }}
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
        <Pressable className='flex-1 bg-black/40' onPress={() => setIsOpen(false)}>
          {/* A Pressable with no onPress keeps taps on the panel from closing it */}
          <Pressable
            className='absolute left-4 min-w-[200px] py-2 rounded-2xl bg-surface'
            style={[styles.shadow, { top: buttonTop + 52 }]}
          >
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                className='flex-row items-center gap-3 px-4 py-3.5'
                onPress={() => handleSelect(item)}
              >
                <Ionicons name={item.icon} size={20} color={colors.text} />
                <Text className='text-base text-text'>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

// Shadows use StyleSheet because iOS and Android need different props
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
