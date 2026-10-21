import { MAX_MEDIA_PER_POST } from '@/constants/media';
import { MediaItem } from '@/storage/achievements';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
          <View key={index} className='mr-3 pt-2 pr-2 relative'>
            {item.type === 'image' ? (
              <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            ) : (
              <View className='size-[100px] rounded-xs bg-surface-raised'>
                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                <View className='absolute inset-0 items-center justify-center bg-black/30 rounded-xs'>
                  <Ionicons name='play' size={24} color={colors.textPrimary} />
                </View>
              </View>
            )}
            <Pressable
              className='absolute top-0 right-0 size-6 rounded-full bg-surface-high items-center justify-center active:opacity-70'
              onPress={() => onRemove(index)}
              hitSlop={10}
              accessibilityLabel='Remove media'
            >
              <Ionicons name='close' size={14} color={colors.textPrimary} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <Text className='type-footnote text-text-secondary mt-2 text-right'>{media.length}/{MAX_MEDIA_PER_POST} media items</Text>
    </View>
  );
}

// expo-image's Image doesn't support className, so it keeps a StyleSheet
const styles = StyleSheet.create({
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.surfaceRaised,
  },
});
