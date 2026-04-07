# Floating-buddy-# 🤖 Hey Zeus Floating Buddy (Chromebook Optimized)

## 🛠 Setup Instructions
1. **Native Linking**: In `MainApplication.java`, register the `FloatingModule`.
2. **Permissions**: The user MUST manually enable "Display over other apps" in 
   `Settings > Apps > Special App Access`.
3. **Zustand Bridge**: When `useBuddyStore` updates, call `OverlayService.startBuddy()` 
   to sync the new size/color to the native overlay.

## 🚀 Working Functions
- `snapToEdge()`: Recalculates X-position to 0 or ScreenWidth on touch release.
- `onShake()`: Uses `expo-sensors` to send a signal to the Service to trigger 'Jump'.
- `persistState()`: Uses `AsyncStorage` so the buddy remembers his hair/clothes 
  after a Chromebook reboot.

