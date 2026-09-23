import CopyButton from '@/components/CopyButton';
import HomeHeader from '@/components/HomeHeader';
import RecentMeals from '@/components/RecentMeals';
import ReminderToggle from '@/components/ReminderToggle';
import ShareButton from '@/components/ShareButton';
import { getMeals, Meal } from '@/storage/meals';
import { globalStyles } from '@/styles/global';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
export default function HomeScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);

  const loadMeals = async () => {
    const data = await getMeals();
    setMeals(data);
    console.log('Loaded meals:', data);
  };

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, []),
  );

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>MacroZone</Text>
        <ShareButton meals={meals} />
      </View>
      <HomeHeader />

      <CopyButton meals={meals}></CopyButton>
      <ReminderToggle />

      <View style={{height:250}}>
      <ScrollView nestedScrollEnabled>      
      <RecentMeals meals = {meals} onDelete={loadMeals} />
      </ScrollView>
      </View>
    </ScrollView>
  );
}