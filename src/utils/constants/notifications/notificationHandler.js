
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
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';

let fcmToken = null;
let navigationRef = null;
let notificationListenersActive = false;

const messagingInstance = getMessaging();

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
      const authStatus = await requestPermission(messagingInstance);
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
    await messagingInstance.registerDeviceForRemoteMessages();
    if (Platform.OS === 'ios') {
      const apnsToken = await messagingInstance.getAPNSToken();
      console.log('📲 APNS Token:', apnsToken);
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
    await deleteToken(messagingInstance);
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
  const unsubscribeForeground = onMessage(messagingInstance, async (remoteMessage) => {
    console.log('🌐 Foreground notification:', remoteMessage);
    await displayNotification(remoteMessage);
  });

  // Background
  setBackgroundMessageHandler(messagingInstance, async (remoteMessage) => {
    console.log('🌐 Background notification:', remoteMessage);
    await displayNotification(remoteMessage);
  });

  // Opened from background
  const unsubscribeOpenedApp = onNotificationOpenedApp(messagingInstance, (remoteMessage) => {
    console.log('🚀 Opened from background:', remoteMessage);
    if (remoteMessage.data) handleNotificationNavigation(remoteMessage.data);
    if (onNotificationTap && remoteMessage.data) onNotificationTap(remoteMessage.data);
  });

  // Quit state
  getInitialNotification(messagingInstance).then((remoteMessage) => {
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
    setBackgroundMessageHandler(messagingInstance, null);
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
