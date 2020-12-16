import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
} from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('screen');
const picWidth = height * 0.6;
const aspectRatio = 2 / 3;
const heightForImages = 3 / 2;
const picHeight = picWidth * heightForImages;

const images = [
  require('./assets/media_0.jpg'),
  require('./assets/media_1.jpg'),
  require('./assets/media_2.jpg'),
  require('./assets/media_3.jpg'),
  require('./assets/media_4.jpg'),
  require('./assets/media_5.jpg'),
];

function App() {
  const [picScrollEnabled, setPicScrollEnabled] = useState(true);

  const renderSlides = () => {
    return images.map((pic, index) => {
      return (
        <View style={styles.imageContainer} key={index}>
          <PinchableBox image={pic} />
          <Text style={styles.text}>{index}</Text>
        </View>
      );
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        bounces={false}
        scrollEnabled={picScrollEnabled}
      >
        {renderSlides()}
      </ScrollView>
    </View>
  );
}
const PinchableBox = ({ image }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(true);
  const scaleInterpolate = useRef(
    scale.interpolate({
      inputRange: [1, 2],
      outputRange: [1, 2],
      extrapolate: 'clamp',
    })
  ).current;

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: { scale },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateChange}>
      <Animated.View
        style={{
          transform: [{ scale: scaleInterpolate }],
        }}
      >
        <Image source={image} style={styles.image} resizeMode="cover" />
      </Animated.View>
    </PinchGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    // backgroundColor: 'red',
  },
  imageContainer: {
    flex: 1,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // width: picWidth,
    height: picWidth,
    aspectRatio,
    borderTopLeftRadius: 1000,
    borderTopRightRadius: 1000,
    overflow: 'hidden',
  },

  text: { color: 'black', fontSize: 24 },
});

export default App;
