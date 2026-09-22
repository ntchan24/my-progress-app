import { Meal } from '@/storage/meals';
import { StyleSheet, Text, View } from 'react-native';
import MealItem from './MealItem';

type RecentMealsProps = {
  meals: Meal[];
  onDelete: () => void;
};

export default function RecentMeals({ meals, onDelete }: RecentMealsProps) {
  return (
    <View style={{ marginTop: 30 }}>
      <Text style={styles.sectionTitle}>Recent Meals</Text>
      {meals.length === 0 ? (
        <Text style={styles.empty}>No meals logged yet.</Text>
      ) : (
        meals
          .slice(0, 5)
          .map((meal) => (
            <MealItem
              key={meal.id}
              id={meal.id}
              name={meal.name}
              calories={meal.calories}
              protein={meal.protein}
              carbs={meal.carbs}
              fat={meal.fat}
              onDelete={onDelete}
            />
          ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  empty: {
    color: '#a0a0b0',
    fontSize: 14,
  },
});