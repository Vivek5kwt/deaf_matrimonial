import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import { cross, notification } from '../../../../../utils/constants/icons/icon';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getMessaging, getInitialNotification } from '@react-native-firebase/messaging';

const NotificationBell = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [loading, setLoading] = useState(false);

  const showSnackbar = (message, type = 'success') => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
      fontFamily: 'Lexend-Medium',
      backgroundColor: type === 'success' ? '#4CAF50' : '#F44336',
    });
  };

  useEffect(() => {
    const checkInitialNotification = async () => {
      try {
        // Get messaging instance inside useEffect to ensure Firebase is initialized
        const messaging = getMessaging();
        const initialNotification = await getInitialNotification(messaging);
        if (initialNotification?.data?.screen === 'interest') {
          setSelectedInterest({
            id: initialNotification.data.interest_id,
            sender_id: initialNotification.data.sender_id,
            message: initialNotification.notification?.body || ''
          });
          setModalVisible(true);
        }
      } catch (error) {
        console.error('Error checking initial notification:', error);
      }
    };
    checkInitialNotification();
  }, []);

  useEffect(() => {
    const notificationData = route.params?.notificationData;
    if (notificationData && notificationData.screen === 'interest') {
      console.log("🔔 Interest notification received in NotificationBell");
      setSelectedInterest({
        id: notificationData.interest_id,
        sender_id: notificationData.sender_id,
        message: notificationData.body || '',
      });
      setModalVisible(true);
    }
  }, [route.params?.notificationData]);

  useEffect(() => {
    return () => {
      setModalVisible(false);
      setSelectedInterest(null);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        console.error('Token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://82.29.161.246:8002/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.notifications) {
        setUnreadCount(response.data.unread_notifications);
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return;

      await axios.post(`http://82.29.161.246:8002/api/mark-as-read/${notificationId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const updated = notifications.map(n =>
        n.noti_id === notificationId ? { ...n, seen: "1" } : n
      );

      setNotifications(updated);
      setUnreadCount(prevCount => prevCount - 1);

    } catch (error) {
      console.error('Error marking notification as read:', error);
      showSnackbar('Failed to mark as read', 'error');
    }
  };

  const handleNotificationPress = async (notification) => {
    await markAsRead(notification.noti_id);

    if (notification.status === 'accepted' || notification.status === 'rejected') {
      console.log("Modal not opened because status is:", notification.status);
      return;
    }

    if (notification.sender_id && !notification.status) {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const response = await axios.get(
          `http://82.29.161.246:8002/api/check-interest-status/${notification.noti_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data.status) {
          setSelectedInterest({
            id: notification.noti_id,
            sender_id: notification.sender_id,
            receiver_id: notification.receiver_id,
            message: notification.notification,
          });
          setResponseModalVisible(true);
        }
      } catch (error) {
        console.error("Status check failed:", error);
      }
    }
  };

  const respondToInterest = async (status) => {
    if (!selectedInterest) return;
  
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      // First check if we need to use GET instead of POST
      // Try GET request first
      const response = await axios.get(
        `http://82.29.161.246:8002/api/respond-minwest/${selectedInterest.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            status: status === 'accepted' ? 'accept' : 'reject',
            screen: 'interest', 
          }
        }
      );
  
      // If GET works, proceed with status update
      const updatedStatus = response.data.status || status;
  
      setNotifications(prev =>
        prev.map(n =>
          n.noti_id === selectedInterest.id
            ? { ...n, status: updatedStatus, notification: `Interest ${updatedStatus}` }
            : n
        )
      );
  
      showSnackbar(`Interest ${updatedStatus}`);
    } catch (error) {
      console.error("Response failed:", error.response?.data || error.message);
      
      // If GET fails, show appropriate error
      showSnackbar(
        `Failed to respond: ${error.response?.data?.message || "Endpoint may not be configured properly"}`,
        'error'
      );
    } finally {
      setResponseModalVisible(false);
      setSelectedInterest(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 190000);
    return () => clearInterval(interval);
  }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('Screen26');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Screen29')}>
        <LottieView
          source={require('../../../../../assets/animations/search.json')}
          autoPlay
          loop
          style={styles.searchIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { fetchNotifications(); setModalVisible(true); }}>
        <View style={styles.bellContainer}>
          <LottieView
            source={require('../../../../../assets/animations/notifi.json')}
            autoPlay={unreadCount > 0}
            loop={unreadCount > 0}
            style={styles.bellIcon}
            progress={unreadCount > 0 ? undefined : 1}
          />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Image source={cross?.Icon28} style={styles.closeIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.notificationsContainer}>
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : notifications.length > 0 ? (
              notifications.map((item) => (
                <TouchableOpacity
                  key={item.noti_id}
                  style={[
                    styles.notificationItem,
                    item.seen === "0" && styles.unreadNotification,
                    item.status === 'accepted' && styles.acceptedNotification,
                    item.status === 'rejected' && styles.rejectedNotification
                  ]}
                  onPress={() => handleNotificationPress(item)}
                >
                  <Image source={notification.Icon52} style={styles.notificationIcon} />

                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{item.notification_type}</Text>
                    <Text style={styles.notificationBody}>{item.notification}</Text>
                    <Text style={styles.timeText}>
                      {new Date(item.date.replace(' ', 'T')).toLocaleString()}
                    </Text>

                  </View>

                  {item.seen === "0" && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>Unread</Text>
                    </View>
                  )}

                  {item.status && (
                    <Text style={styles.statusText}>
                      {item.status === 'accepted' ? '✓ Accepted' : '✗ Rejected'}
                    </Text>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No notifications yet</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={responseModalVisible}
        onRequestClose={() => setResponseModalVisible(false)}
      >
        <View style={styles.responseModalContainer}>
          <View style={styles.responseModalContent}>
            <Text style={styles.responseModalTitle}>Respond to Interest</Text>

            {selectedInterest && (
              <>
                <Text style={styles.senderName}>User ID: {selectedInterest.sender_id}</Text>
                <Text style={styles.responseModalText}>
                  {selectedInterest.message || 'No message provided'}
                </Text>
              </>
            )}

            <View style={styles.responseButtonsContainer}>
              <TouchableOpacity
                style={[styles.responseButton, styles.acceptButton]}
                onPress={() => respondToInterest('accepted')}
              >
                <Text style={styles.responseButtonText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.responseButton, styles.rejectButton]}
                onPress={() => respondToInterest('rejected')}
              >
                <Text style={styles.responseButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setResponseModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 15,
    flexDirection: 'row',
  },
  bellContainer: {
    position: 'relative',

  },
  bellIcon: {
    width: 50,
    height: 50,
    tintColor: '#FF7E00',
    marginTop: -10,

  },
  searchIcon: {
    width: 65,
    height: 65,
    tintColor: '#FF7E00',
    marginTop: -20,
    marginRight: -13,

  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Lexend-Medium',
    color: '#FF7E00',

  },
  closeButton: {
    height: 20,
    width: 20,
  },
  notificationsContainer: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  unreadNotification: {
    backgroundColor: '#f0f8ff',
  },
  notificationIcon: {
    width: 25,
    height: 25,
    marginRight: 15,
    tintColor: '#008000',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: 'Lexend-Regular',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  notificationBody: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontFamily: 'Lexend-Medium',

  },
  senderText: {
    fontSize: 12,
    color: '#777',
    marginBottom: 3,
    fontFamily: 'Lexend-Medium',

  },
  timeText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Lexend-Regular',

  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontFamily: 'Lexend-Medium',

  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
    fontFamily: 'Lexend-Medium',

  },
  responseModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  responseModalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  responseModalTitle: {
    fontSize: 18,
    fontFamily: 'Lexend-Medium',
    marginBottom: 15,
    color: '#FF7E00',
  },
  senderName: {
    fontSize: 16,
    fontFamily: 'Lexend-Medium',
    marginBottom: 10,
    color: '#333',
  },
  responseModalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
    fontFamily: 'Lexend-Medium',

  },
  unreadBadge: {
    backgroundColor: '#FF5252',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Lexend-Medium',
  },

  responseButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 15,
  },
  responseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '48%',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    fontFamily: 'Lexend-Medium',

  },
  rejectButton: {
    backgroundColor: '#F44336',
    fontFamily: 'Lexend-Medium',
  },
  responseButtonText: {
    color: 'white',
    fontFamily: 'Lexend-Medium',
  },

  cancelButtonText: {
    color: '#FF7E00',
    fontFamily: 'Lexend-Medium',

  },
  closeIcon: {
    height: 20,
    width: 20,
    tintColor: '#FF7E00',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 5,
  },
  responseButton: {
    padding: 5,
    marginRight: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptedNotification: {
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  rejectedNotification: {
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  notificationBadge: {
    position: 'absolute',
    right: 10,
    top: -2,
    backgroundColor: '#FF5252',
    borderRadius: 12,
    width: 14,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

});

export default NotificationBell;