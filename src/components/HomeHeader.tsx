import { Text, View } from 'react-native';

export default function HomeHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View className='screen__header'>
      <Text className='text-sm text-text-secondary mt-1 mb-[30px]'>{currentDate}</Text>
    </View>
  );
}
