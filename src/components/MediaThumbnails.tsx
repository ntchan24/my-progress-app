import { MediaItem } from '@/storage/achievements';
import { colors } from '@/styles/global';
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
    <View style={styles.mediaThumbnailsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.mediaThumbnailsScroll}
      >
        {media.map((item, index) => (
          <View key={index} style={styles.mediaThumbnailWrapper}>
            {item.type === 'image' ? (
              <Image source={{ uri: item.uri }} style={styles.mediaThumbnail} />
            ) : (
              <View style={styles.mediaThumbnail}>
                <Image source={{ uri: item.uri }} style={styles.mediaThumbnail} />
                <View style={styles.videoIndicator}>
                  <Ionicons name='play-circle' size={24} color='#fff' />
                </View>
              </View>
            )}
            <TouchableOpacity
              style={styles.removeThumbnailButton}
              onPress={() => onRemove(index)}
            >
              <Ionicons name='close-circle' size={24} color={colors.alert} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Text style={styles.mediaCount}>{media.length}/20 media items</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mediaThumbnailsContainer: {
    marginTop: 16,
  },
  mediaThumbnailsScroll: {
    flexDirection: 'row',
  },
  mediaThumbnailWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  mediaThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  videoIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
  },
  removeThumbnailButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
  },
  mediaCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'right',
  },
});
