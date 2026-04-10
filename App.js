

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { create } from 'zustand';
import { Accelerometer } from 'expo-sensors';
import Slider from '@react-native-community/slider';

// --- 1. THE BRAIN (Store) ---
const useBuddyStore = create((set) => ({
  appearance: {
    skin: '#E0AC69', // Not White / Deep Tan
    hairColor: '#2c1e1a',
    clothingColor: '#3498db',
    expression: 'happy',
  },
  settings: { size: 1, speed: 1 },
  updateAppearance: (attr) => set((s) => ({ appearance: { ...s.appearance, ...attr } })),
  updateSettings: (setts) => set((s) => ({ settings: { ...s.settings, ...setts } })),
}));

// --- 2. THE VISUAL (BuddyView) ---
const BuddyView = ({ appearance, sizeMultiplier }) => {
  const baseSize = 80 * sizeMultiplier;
  return (
    <View style={{ alignItems: 'center', width: baseSize, height: baseSize }}>
      {/* Hair */}
      <View style={[styles.hair, { backgroundColor: appearance.hairColor, width: baseSize * 0.6 }]} />
      {/* Head */}
      <View style={[styles.head, { backgroundColor: appearance.skin, width: baseSize * 0.5, height: baseSize * 0.5 }]}>
        <View style={styles.eyeRow}>
           <View style={styles.eye} /><View style={styles.eye} />
        </View>
        <View style={styles.mouth} />
      </View>
      {/* Shirt */}
      <View style={[styles.shirt, { backgroundColor: appearance.clothingColor, width: baseSize * 0.7, height: baseSize * 0.4 }]} />
    </View>
  );
};

// --- 3. THE FLOATING LOGIC ---
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FloatingBuddy = () => {
  const { appearance, settings } = useBuddyStore();
  const translateX = useSharedValue(SCREEN_WIDTH - 100);
  const translateY = useSharedValue(SCREEN_HEIGHT / 2);

  // Shake Detection for Galaxy A54
  useEffect(() => {
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      if (Math.abs(x) + Math.abs(y) + Math.abs(z) > 2.5) {
        translateY.value = withSequence(withSpring(translateY.value - 60), withSpring(translateY.value));
      }
    });
    return () => sub.remove();
  }, []);

  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.absoluteX - 40;
      translateY.value = e.absoluteY - 40;
    })
    .onFinalize(() => {
      const snapX = translateX.value > SCREEN_WIDTH / 2 ? SCREEN_WIDTH - 90 : 10;
      translateX.value = withSpring(snapX);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={dragGesture}>
      <Animated.View style={[styles.buddyContainer, animatedStyle]}>
        <BuddyView appearance={appearance} sizeMultiplier={settings.size} />
      </Animated.View>
    </GestureDetector>
  );
};

// --- 4. THE MAIN SCREEN ---
export default function App() {
  const { appearance, settings, updateAppearance, updateSettings } = useBuddyStore();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.main}>
        <Text style={styles.title}>Buddy Control Center</Text>
        
        <ScrollView style={styles.controls}>
          <Text style={styles.label}>Skin Tone</Text>
          <View style={styles.row}>
            {['#FFDBAC', '#E0AC69', '#8D5524'].map(c => (
              <TouchableOpacity key={c} style={[styles.colorBox, {backgroundColor: c}]} onPress={() => updateAppearance({skin: c})} />
            ))}
          </View>

          <Text style={styles.label}>Size ({settings.size.toFixed(1)}x)</Text>
          <Slider minimumValue={0.5} maximumValue={2} value={settings.size} onValueChange={(v) => updateSettings({size: v})} />
        </ScrollView>

        <FloatingBuddy />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#f0f0f0', paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  buddyContainer: { position: 'absolute', zIndex: 999 },
  head: { borderRadius: 50, zIndex: 2, alignItems: 'center', justifyContent: 'center' },
  hair: { height: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginBottom: -10, zIndex: 3 },
  shirt: { borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: -5 },
  eyeRow: { flexDirection: 'row', gap: 10, marginBottom: 5 },
  eye: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#000' },
  mouth: { width: 15, height: 2, backgroundColor: '#000', borderRadius: 1 },
  controls: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 5 },
  label: { fontWeight: 'bold', marginTop: 15 },
  row: { flexDirection: 'row', gap: 10, marginTop: 5 },
  colorBox: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' }
});
