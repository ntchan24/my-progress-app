import { MediaItem } from '@/storage/achievements';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
  const scrollViewRef = useRef<ScrollView>(null);

  // If only one media item, render directly without carousel
  if (media.length === 1) {
    const item = media[0];
    return (
      <View style={styles.carouselContainer}>
        {item.type === 'image' ? (
          <Image source={{ uri: item.uri }} style={styles.media} />
        ) : (
          <VideoItem uri={item.uri} isActive={isActive} />
        )}
      </View>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {media.map((item, index) => (
          <View key={index} style={styles.mediaContainer}>
            {item.type === 'image' ? (
              <Image source={{ uri: item.uri }} style={styles.media} />
            ) : (
              <VideoItem
                uri={item.uri}
                isActive={isActive && currentIndex === index}
              />
            )}
          </View>
        ))}
      </ScrollView>

      {/* Counter Badge */}
      <View style={styles.counterBadge} pointerEvents="none">
        <Text style={styles.counterText}>
          {currentIndex + 1}/{media.length}
        </Text>
      </View>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer} pointerEvents="none">
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
  scrollView: {
    flex: 1,
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
