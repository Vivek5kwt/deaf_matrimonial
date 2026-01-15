
import { 
  getMessaging, 
  getToken, 
  onMessage, 
  setBackgroundMessageHandler,
  onNotificationOpenedApp,
  getInitialNotification,
  deleteToken,
  requestPermission,
  AuthorizationStatus
} from '@react-native-firebase/messaging';
import { getApps } from '@react-native-firebase/app';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import { initFirebase } from '../../../config/firebaseConfig';

let fcmToken = null;
let navigationRef = null;
let notificationListenersActive = false;
let messagingInstance = null;


// Get messaging instance - will be initialized after Firebase is ready
function getMessagingInstance() {
  if (!messagingInstance) {
    // Ensure Firebase is initialized first
    if (getApps().length === 0) {
      console.warn('⚠️ Firebase not initialized! Call initFirebase() first.');
      throw new Error('Firebase not initialized. Call initFirebase() before using messaging.');
    }
    messagingInstance = getMessaging();
  }
  return messagingInstance;
}

// ================== 0️⃣ Set Navigation Ref ==================
export function setNavigationReference(ref) {
  navigationRef = ref;
  console.log('📍 Navigation reference set');
}

// ================== 1️⃣ Request Notification Permissions ==================
export async function requestNotificationPermissions() {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('❌ Notification permission denied on Android.');
        return false;
      }
    }

    if (Platform.OS === 'ios') {
      const messaging = getMessagingInstance();
      const authStatus = await requestPermission(messaging);
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;
      if (!enabled) console.warn('❌ Notification permission denied on iOS.');
      return enabled;
    }

    return true;
  } catch (error) {
    console.error('❌ Permission error:', error.message);
    return false;
  }
}

// ================== 2️⃣ Android Notification Channel ==================
export async function setupNotificationChannels() {
  if (Platform.OS === 'android') {
    const existing = await notifee.getChannels();
    const exists = existing.some(c => c.id === 'default');
    if (!exists) {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
      console.log('✅ Notification channel created.');
    }
  }
}

// ================== 3️⃣ FCM Token Management ==================
export async function getFcmToken() {
  try {
    const messagingInstance = getMessagingInstance();
    // For iOS, register device for remote messages (only on iOS)
    // Note: This method is deprecated but still works. The warning can be ignored for now.
    if (Platform.OS === 'ios') {
      try {
        // Call as method on messaging instance (works in v23)
        await messagingInstance.registerDeviceForRemoteMessages();
        const apnsToken = await messagingInstance.getAPNSToken();
        console.log('📲 APNS Token:', apnsToken);
      } catch (error) {
        // Ignore if already registered or other non-critical errors
        if (!error.message.includes('already registered')) {
          console.warn('⚠️ iOS device registration warning:', error.message);
        }
      }
    }
    fcmToken = await getToken(messagingInstance);
    console.log('🔑 FCM Token:', fcmToken);
    return fcmToken;
  } catch (error) {
    console.error('❌ FCM token error:', error.message);
    return null;
  }
}

export function getCurrentToken() {
  return fcmToken;
}

export async function deleteFcmToken() {
  try {
    const messaging = getMessagingInstance();
    await deleteToken(messaging);
    fcmToken = null;
    console.log('🗑️ FCM token deleted');
  } catch (error) {
    console.error('❌ Delete token error:', error.message);
  }
}

// ================== 4️⃣ Display Notification ==================
async function displayNotification(remoteMessage) {
  const notification = remoteMessage.notification || {};
  const { title, body } = notification;
  const data = remoteMessage.data || {};

  await setupNotificationChannels();

  await notifee.displayNotification({
    title: title || 'New Notification',
    body: body || 'You have a new message!',
    data: { ...data, screen: data.screen || 'inbox' },
    android: { channelId: 'default', pressAction: { id: 'default' } },
    ios: { sound: 'default' },
  });
  console.log('🔔 Notification displayed:', title, body);
}

// ================== 5️⃣ Notification Handlers ==================
export function setupNotificationHandlers(onNotificationTap) {
  if (notificationListenersActive) return () => {};

  // Foreground
  const messaging = getMessagingInstance();
  const unsubscribeForeground = onMessage(messaging, async (remoteMessage) => {
    console.log('🌐 Foreground notification:', remoteMessage);
    await displayNotification(remoteMessage);
  });

  // Background
  setBackgroundMessageHandler(messaging, async (remoteMessage) => {
    console.log('🌐 Background notification:', remoteMessage);
    await displayNotification(remoteMessage);
  });

  // Opened from background
  const unsubscribeOpenedApp = onNotificationOpenedApp(messaging, (remoteMessage) => {
    console.log('🚀 Opened from background:', remoteMessage);
    if (remoteMessage.data) handleNotificationNavigation(remoteMessage.data);
    if (onNotificationTap && remoteMessage.data) onNotificationTap(remoteMessage.data);
  });

  // Quit state
  getInitialNotification(messaging).then((remoteMessage) => {
    if (remoteMessage?.data) {
      console.log('🚀 Opened from quit state:', remoteMessage);
      handleNotificationNavigation(remoteMessage.data);
      if (onNotificationTap) onNotificationTap(remoteMessage.data);
    }
  });

  // Foreground tap (Notifee)
  const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification?.data) {
      console.log('🔔 Notification tapped (foreground):', detail.notification.data);
      handleNotificationNavigation(detail.notification.data);
      if (onNotificationTap) onNotificationTap(detail.notification.data);
    }
  });

  notificationListenersActive = true;

  return () => {
    unsubscribeForeground();
    unsubscribeOpenedApp();
    unsubscribeNotifee();
    const messaging = getMessagingInstance();
    setBackgroundMessageHandler(messaging, null);
    notificationListenersActive = false;
  };
}

// ================== 6️⃣ Handle Navigation ==================
function handleNotificationNavigation(data) {
  if (!data || !navigationRef?.current?.isReady()) return;

  const screen = data.screen || 'inbox';
  const params = { ...data, notificationData: data };

  // Ensure navigation reset before navigating
  navigationRef.current.reset({ index: 0, routes: [{ name: 'Screen26' }] });

  if (screen === 'interest') {
    navigationRef.current.navigate('NotificationBell', params);
  } else if (screen === 'inbox') {
    navigationRef.current.navigate('Screen40', params);
  } else {
    navigationRef.current.navigate('NotificationBell', params);
  }
}

// ================== 7️⃣ Initialize FCM ==================
export async function initializeFCM(onNotificationTap) {
  try {
    console.log('🚀 Initializing FCM...');
    
    // Initialize Firebase first
    await initFirebase();
    console.log('✅ Firebase initialized');
    
    const permissionGranted = await requestNotificationPermissions();
    if (!permissionGranted) return false;

    await setupNotificationChannels();
    await getFcmToken();
    setupNotificationHandlers(onNotificationTap);

    console.log('✅ FCM initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ FCM initialization error:', error.message);
    return false;
  }
}
