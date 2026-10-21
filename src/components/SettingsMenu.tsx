import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Fragment, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Settings', icon: 'settings-outline', onPress: () => router.push('/settings') },
  { label: 'Upgrade to Pro', icon: 'diamond-outline', onPress: () => router.push('/paywall') },
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
      <Pressable
        // Translucent so the button stays readable over photos and videos
        className='overlay-btn left-4'
        style={{ top: buttonTop }}
        onPress={() => setIsOpen(true)}
        accessibilityLabel='Open menu'
      >
        <Ionicons name='menu-outline' size={24} color={colors.textPrimary} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={() => setIsOpen(false)}
      >
        {/* Tapping the dimmed area outside the panel closes the menu */}
        <Pressable
          className='flex-1'
          style={{ backgroundColor: colors.scrim }}
          onPress={() => setIsOpen(false)}
        >
          {/* A Pressable with no onPress keeps taps on the panel from closing it.
              Elevation comes from the raised surface step, not a shadow. */}
          <Pressable
            className='list-group absolute left-4 min-w-[220px] bg-surface-raised'
            style={{ top: buttonTop + 52 }}
          >
            {MENU_ITEMS.map((item, index) => (
              <Fragment key={item.label}>
                {index > 0 && <View className='cell__separator ml-[52px]' />}
                <Pressable className='cell' onPress={() => handleSelect(item)}>
                  <Ionicons name={item.icon} size={20} color={colors.textPrimary} />
                  <Text className='cell__title'>{item.label}</Text>
                </Pressable>
              </Fragment>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
