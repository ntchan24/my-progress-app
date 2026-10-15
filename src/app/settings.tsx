import { colors, globalStyles } from '@/styles/global';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView style={[globalStyles.container, styles.container]}>
      <Text style={styles.comingSoon}>More settings are on the way.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // The native header already provides top spacing
  container: {
    paddingTop: 24,
  },
  comingSoon: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
