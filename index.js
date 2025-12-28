import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

// Get messaging instance
const messaging = getMessaging();

// ✅ Handle FCM background messages
setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log('[Background] FCM message received:', JSON.stringify(remoteMessage));
  // Show a notification if you want
});

// ✅ Notifee background handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('[Notifee Background Event]', type, detail);

  if (type === EventType.PRESS && detail.notification?.data) {
    console.log('🔔 Notification tapped while app was killed/backgrounded');
    // Do not navigate here — wait for app mount
  }
});

// ✅ Register App
AppRegistry.registerComponent(appName, () => App);
