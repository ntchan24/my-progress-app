import { MAX_MEDIA_PER_POST } from '@/constants/media';
import { MediaItem } from '@/storage/achievements';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type MediaThumbnailsProps = {
  media: MediaItem[];
  onRemove: (index: number) => void;
};

export default function MediaThumbnails({ media, onRemove }: MediaThumbnailsProps) {
  if (media.length === 0) return null;

  return (
    <View className='mt-4'>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {media.map((item, index) => (
          <View key={index} className='mr-2.5 relative'>
            {item.type === 'image' ? (
              <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            ) : (
              <View className='w-[100px] h-[100px] rounded-[10px] bg-surface'>
                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                <View className='absolute inset-0 items-center justify-center bg-black/30 rounded-[10px]'>
                  <Ionicons name='play-circle' size={24} color='#fff' />
                </View>
              </View>
            )}
            <TouchableOpacity
              className='absolute -top-2 -right-2 bg-black/70 rounded-xl'
              onPress={() => onRemove(index)}
            >
              <Ionicons name='close-circle' size={24} color={colors.alert} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Text className='text-xs text-text-secondary mt-2 text-right'>{media.length}/{MAX_MEDIA_PER_POST} media items</Text>
    </View>
  );
}

// expo-image's Image doesn't support className, so it keeps a StyleSheet
const styles = StyleSheet.create({
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
});
