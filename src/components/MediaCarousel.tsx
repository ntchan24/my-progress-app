import { MediaItem } from '@/storage/achievements';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Carousel } from 'react-native-reanimated-carousel';

type MediaCarouselProps = {
  media: MediaItem[];
  isActive: boolean;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Create a separate component for video items to properly use hooks
function VideoItem({ uri, isActive }: { uri: string; isActive: boolean }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.muted = false;
  });

  useEffect(() => {
    try {
      if (isActive) {
        player.play();
      } else {
        player.pause();
      }
    } catch {
      // Silently ignore - player may have been destroyed
    }
  }, [isActive, player]);

  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {
        // Silently ignore - player may have been destroyed during cleanup
      }
    };
  }, [player]);

  return (
    <VideoView
      style={styles.media}
      player={player}
      nativeControls={false}
      contentFit='cover'
    />
  );
}

export default function MediaCarousel({ media, isActive }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem = ({ item, index }: { item: MediaItem; index: number }) => (
    <View style={styles.mediaContainer}>
      {item.type === 'image' ? (
        <Image source={{ uri: item.uri }} style={styles.media} />
      ) : (
        <VideoItem
          uri={item.uri}
          isActive={isActive && currentIndex === index}
        />
      )}
    </View>
  );

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        width={SCREEN_WIDTH}
        height="100%"
        data={media}
        renderItem={renderItem}
        onSnapToItem={(index) => setCurrentIndex(index)}
        pagingEnabled
        loop={false}
        enabled={true}
      />

      {/* Counter Badge */}
      <View style={styles.counterBadge}>
        <Text style={styles.counterText}>
          {currentIndex + 1}/{media.length}
        </Text>
      </View>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {media.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  counterBadge: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});
