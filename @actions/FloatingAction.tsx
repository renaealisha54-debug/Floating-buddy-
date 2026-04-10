

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { 
  Gesture, 
  GestureDetector, 
  GestureHandlerRootView 
} from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- Notification Configuration ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function FloatingActionButton() {
  const translateX = useSharedValue(SCREEN_WIDTH - 90);
  const translateY = useSharedValue(SCREEN_HEIGHT - 150);
  const context = useSharedValue({ x: 0, y: 0 });

  // 1. Permissions & Setup
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions denied');
      }
    })();
  }, []);

  // 2. Real Working Functions (JS Thread)
  const triggerJump = async () => {
    // Feedback: Haptic Impact
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Logic: Trigger Local Push Notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Action Triggered! 🚀",
        body: 'The jump function was called from the UI thread.',
      },
      trigger: null, // immediate
    });
  };

  // 3. Gesture Logic (UI Thread)
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x;
      translateY.value = event.translationY + context.value.y;
    })
    .onEnd(() => {
      // Snap-to-edge logic
      const snapX = translateX.value > SCREEN_WIDTH / 2 
        ? SCREEN_WIDTH - 80 
        : 20;

      translateX.value = withSpring(snapX);
      translateY.value = withSpring(translateY.value); // Keep Y stable

      // Trigger the JS function
      runOnJS(triggerJump)();
    });

  // 4. Animated Styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.ball, animatedStyle]} />
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  ball: {
    width: 60,
    height: 60,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    position: 'absolute',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
