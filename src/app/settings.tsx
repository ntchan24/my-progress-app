import { colors } from '@/constants/colors';
import { useSubscriptionStore } from '@/store/subscription';
import { ScrollView, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const isPro = useSubscriptionStore((s) => s.isPro);
  const setIsPro = useSubscriptionStore((s) => s.setIsPro);

  return (
    // The native header already provides top spacing
    <ScrollView className='screen pt-6'>
      {/* Dev-only: flip between Free and Pro to test gated features before purchases exist */}
      {__DEV__ && (
        <View className='list-group mb-6'>
          <View className='cell'>
            <Text className='cell__title'>Pro (dev)</Text>
            <Switch
              value={isPro}
              onValueChange={setIsPro}
              trackColor={{ false: colors.surfaceHigh, true: colors.inverse }}
              thumbColor={isPro ? colors.onInverse : colors.textSecondary}
              ios_backgroundColor={colors.surfaceHigh}
            />
          </View>
        </View>
      )}

      <Text className='type-subhead text-text-secondary text-center'>More settings are on the way.</Text>
    </ScrollView>
  );
}
