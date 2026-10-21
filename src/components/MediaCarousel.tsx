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
      <View className='absolute inset-0'>
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
    <View className='absolute inset-0'>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className='flex-1'
      >
        {media.map((item, index) => (
          <View key={index} className='h-full' style={{ width: SCREEN_WIDTH }}>
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
      <View
        className='absolute top-[60px] right-5 bg-black/60 px-3 py-1.5 rounded-[20px]'
        pointerEvents='none'
      >
        <Text className='text-white text-sm font-semibold'>
          {currentIndex + 1}/{media.length}
        </Text>
      </View>

      {/* Pagination Dots */}
      <View
        className='absolute bottom-[200px] left-0 right-0 flex-row justify-center items-center gap-1.5'
        pointerEvents='none'
      >
        {media.map((_, index) => (
          <View
            key={index}
            className={`rounded-full ${
              index === currentIndex ? 'size-2 bg-white' : 'size-1.5 bg-white/50'
            }`}
          />
        ))}
      </View>
    </View>
  );
}

// expo-image and expo-video don't support className, so they keep a StyleSheet
const styles = StyleSheet.create({
  media: {
    width: '100%',
    height: '100%',
  },
});
