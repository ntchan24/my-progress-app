import { ScrollView, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    // The native header already provides top spacing
    <ScrollView className='screen pt-6'>
      <Text className='type-subhead text-text-secondary text-center'>More settings are on the way.</Text>
    </ScrollView>
  );
}
