import { NativeModules, Platform, PermissionsAndroid } from 'react-native';

const { FloatingModule } = NativeModules;

class OverlayService {
  // Check if we have "Draw over other apps" permission
  static async checkPermission() {
    if (Platform.OS === 'android') {
      const hasPermission = await FloatingModule.hasOverlayPermission();
      if (!hasPermission) {
        FloatingModule.requestOverlayPermission(); // Opens Android Settings
      }
      return hasPermission;
    }
    return true;
  }

  // Tell Android to spawn the Buddy
  static startBuddy(config) {
    FloatingModule.startService(JSON.stringify(config));
  }

  // Kill the buddy
  static stopBuddy() {
    FloatingModule.stopService();
  }
}

export default OverlayService;

