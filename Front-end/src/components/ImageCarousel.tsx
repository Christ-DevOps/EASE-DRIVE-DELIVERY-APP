import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const { width } = Dimensions.get('window');

type ImageItem = number | string; // number = require(...), string = remote uri
type Props = {
  images?: ImageItem | ImageItem[]; // allow undefined, single item, or array
  height?: number;
};

export default function ImageCarousel({ images, height = 300 }: Props) {
  // Normalize incoming prop into a safe array
  const imgs: ImageItem[] = useMemo(() => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    return [images];
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<ImageItem> | null>(null);

  // Use momentum end event for more reliable index calculation
  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / width);
    setActiveIndex(index);
  };

  const renderItem = ({ item }: { item: ImageItem }) => {
    // If item is a number (require), pass it directly.
    // If it's a string, pass { uri: item }.
    const source = typeof item === 'number' ? item : { uri: item };

    return (
      <Image
        source={source as any}
        style={[styles.image, { height }]}
        resizeMode="cover"
      />
    );
  };

  // If there are no images, render a placeholder area to avoid crash
  if (imgs.length === 0) {
    return (
      <View style={[styles.placeholder, { height }]}>
        {/* Optionally put a local placeholder image or icon here */}
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={flatListRef}
        data={imgs}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        initialNumToRender={1}
        windowSize={2}
        removeClippedSubviews
      />

      <View style={styles.pagination}>
        {imgs.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    position: 'relative',
  },
  image: {
    width,
  },
  placeholder: {
    width,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#FF7622',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});
