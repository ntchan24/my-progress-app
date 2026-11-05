import { useToastStore } from '@/store/toast';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

// Mounted once in the root layout; call useToastStore.getState().show('...') or the hook to display.
export default function Toast() {
  const message = useToastStore((s) => s.message);
  if (!message) return null;

  return (
    <View className='toast' pointerEvents='none'>
      <Animated.View key={message} entering={FadeInDown.duration(250)} exiting={FadeOut.duration(250)}>
        <View className='toast__pill'>
          <Text className='toast__label'>{message}</Text>
        </View>
      </Animated.View>
    </View>
  );
}
