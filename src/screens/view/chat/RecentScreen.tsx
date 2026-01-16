import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import BottomHeader from '../../../components/BottomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import { arrow } from '../../../utils/constants/icons/icon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';

interface SenderInfo {
  index_id: number;
  matri_id: string;
  prefix: string | null;
}

interface Message {
  mes_id: number;
  to_id: string;
  from_id: string;
  subject: string;
  message: string;
  sent_date: string;
  msg_status: string;
  msg_read_status: string;
  msg_important_status: string;
  trash_receiver: string;
  trash_sender: string;
  screen: string;
}

const Screen33 = (props: any) => {
  const navigation = useNavigation();
  const route = useRoute();
  const flatListRef = useRef<FlatList>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [membershipModalVisible, setMembershipModalVisible] = useState(false);
  const [membershipMessage, setMembershipMessage] = useState('');

  useEffect(() => {
    const getCurrentUserId = async () => {
      const id = await AsyncStorage.getItem('matri_id');
      setCurrentUserId(id);
    };
    getCurrentUserId();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    if (route.params?.senderInfo) {
      setUserDetails({
        ...route.params.senderInfo,
        id: route.params.senderInfo.index_id || route.params.senderInfo.matri_id
      });

      if (route.params?.existingMessages) {
        const sortedMessages = route.params.existingMessages.sort((a: Message, b: Message) => 
          new Date(a.sent_date).getTime() - new Date(b.sent_date).getTime()
        );
        setMessages(sortedMessages);
        setInitialLoading(false);
      } else {
        setInitialLoading(true);
      }
    }
  }, [route.params]);

  useEffect(() => {
    if (userDetails?.id && currentUserId) {
      fetchMessages();
    }
  }, [userDetails, currentUserId]);

  useEffect(() => {
    if (userDetails?.id && currentUserId) {
      // Initial fetch
      fetchMessages();

      // Set up interval for refreshing messages
      const intervalId = setInterval(fetchMessages, 2000);

      // Clean up interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [userDetails, currentUserId]);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token found');

      const response = await fetch(`http://82.29.161.246:8002/api/getMessages/${userDetails.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();

      if (data.success && data.messages) {
        // Sort messages in chronological order (oldest first)
        const sortedMessages = data.messages.sort((a: Message, b: Message) =>
          new Date(a.sent_date).getTime() - new Date(b.sent_date).getTime()
        );

        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
  
    try {
      setSendingMessage(true);
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return;
  
      const formData = new FormData();
      formData.append('to_id', userDetails.id);
      formData.append('message', messageText);
      formData.append('screen', 'inbox');
  
      const messageToSend = messageText;
      setMessageText(''); // Clear input immediately
  
      const response = await fetch(`http://82.29.161.246:8002/api/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      const responseText = await response.text();
      console.log('Raw response:', responseText);
  
      // Check for membership error in text response
      if (responseText.includes('membership') || response.status === 403) {
        setMembershipMessage('You need an active membership to send messages.');
        setMembershipModalVisible(true);
        setMessageText(messageToSend);
        return;
      }
  
      // If response contains success indicator or empty, consider it successful
      if (response.ok || responseText.includes('success') || responseText === '') {
        // Add the new message to the local state
        const newMessage = {
          mes_id: Date.now(),
          to_id: userDetails.id,
          from_id: currentUserId || '',
          subject: "No Subject",
          message: messageToSend,
          sent_date: new Date().toISOString(),
          msg_status: "sent",
          msg_read_status: "No",
          msg_important_status: "No",
          trash_receiver: "No",
          trash_sender: "No",
          screen: "inbox"
        };
  
        setMessages(prev => {
          const updatedMessages = [...prev, newMessage];
          return updatedMessages.sort((a, b) => 
            new Date(a.sent_date).getTime() - new Date(b.sent_date).getTime()
          );
        });
  
        setTimeout(fetchMessages, 500);
      } else {
        // Show generic error
        Snackbar.show({
          text: 'Failed to send message',
          duration: Snackbar.LENGTH_LONG,
        });
        setMessageText(messageToSend);
      }
  
    } catch (error) {
      console.error('Error sending message:', error);
      Snackbar.show({
        text: 'Network error',
        duration: Snackbar.LENGTH_LONG,
      });
      setMessageText(messageText);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleBuyMembership = () => {
    setMembershipModalVisible(false);
    navigation.navigate('Screen51');
  };

  const formatMessageTime = (dateTimeString: string) => {
    if (!dateTimeString) return '--:--';
  
    try {
      // If it's just a time like "05:18 PM"
      if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(dateTimeString)) {
        return dateTimeString;
      }
  
      // If it's full ISO date-time (e.g., "2025-07-30T17:18:00Z")
      const date = new Date(dateTimeString);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12) || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
      }
  
      // If it's "YYYY-MM-DD HH:MM:SS" format
      if (dateTimeString.includes(' ')) {
        const [datePart, timePart] = dateTimeString.split(' ');
        if (timePart) {
          const [hours, minutes] = timePart.split(':');
          const hourNum = parseInt(hours);
          const ampm = hourNum >= 12 ? 'PM' : 'AM';
          const formattedHours = (hourNum % 12) || 12;
          return `${formattedHours}:${minutes} ${ampm}`;
        }
      }
  
      return '--:--';
    } catch (e) {
      console.warn('Error parsing time:', dateTimeString, e);
      return '--:--';
    }
  };

  const renderMessageItem = ({ item, index }: { item: Message; index: number }) => {
    const isCurrentUser = item.from_id === currentUserId;

    return (
      <View style={[
        styles.messageBubble,
        isCurrentUser ? styles.sentMessage : styles.receivedMessage
      ]}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.messageTime}>
          {formatMessageTime(item.sent_date)}
        </Text>
      </View>
    );
  };

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Chat</Text>
        </View>
        <View style={styles.noChatsContainer}>
          <Text style={styles.noChatsText}>No chat selected</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('Screen30')}>
            <Text style={styles.goToMatches}>Go to My Matches</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomHeaderContainer}>
          <BottomHeader />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
        </TouchableOpacity>
        {userDetails.profile_image ? (
          <Image
            source={{ uri: `http://82.29.161.246:8002/${userDetails.profile_image}` }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profileInitial}>
              {userDetails.firstname?.charAt(0)?.toUpperCase() ||
                userDetails.lastname?.charAt(0)?.toUpperCase() ||
                userDetails.matri_id?.charAt(0)?.toUpperCase() ||
                '?'}
            </Text>
          </View>
        )}
        <Text style={styles.headerText}>
          {userDetails.firstname || userDetails.matri_id}
        </Text>
      </View>

      {initialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7E00" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.noMessagesContainer}>
          <Text style={styles.noMessagesText}>No messages yet</Text>
          <Text style={styles.startConversationText}>Start a conversation with {userDetails.firstname || 'this user'}</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) => (item?.mes_id ? item.mes_id.toString() : index.toString())}
          contentContainerStyle={styles.messagesContainer}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustContentInsets={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchMessages}
              colors={['#FF7E00']}
              tintColor="#FF7E00"
            />
          }
          onContentSizeChange={() => {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 50);
          }}
          onLayout={() => {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
        />
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TextInput
          style={styles.textInput}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!messageText.trim() || sendingMessage) && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={sendingMessage || !messageText.trim()}
        >
          {sendingMessage ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <View style={styles.bottomHeaderContainer}>
        <BottomHeader />
      </View>
      
      {/* Membership Modal */}
      <Modal visible={membershipModalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setMembershipModalVisible(false)}>
          <View style={styles.membershipModalContainer}>
            <View style={styles.membershipModalContent}>
              <Text style={styles.membershipModalHeader}>Membership Required</Text>
              <Text style={styles.membershipModalText}>{membershipMessage}</Text>
              <View style={styles.membershipButtonContainer}>
                <LottieView
                  source={require('../../../assets/animations/mm.json')}
                  autoPlay
                  loop
                  style={styles.lottieAnimation}
                />
                <TouchableOpacity
                  style={styles.membershipButton}
                  onPress={handleBuyMembership}
                >
                  <Text style={styles.membershipButtonText}>BUY MEMBERSHIP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  membershipButtonContainer: {
    width: '100%',
    marginTop: hp('2%'),
  },
  membershipModalHeader: {
    fontSize: wp('4.5%'),
    marginBottom: hp('1%'),
    fontFamily: 'Lexend-Medium',
    color: '#FF7E00',
  },
  lottieAnimation: {
    width: wp('50%'),
    height: hp('25%'),
    alignSelf: 'center',
    marginBottom: hp('2.5%'),
  },
  membershipModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  membershipModalContent: {
    width: wp('80%'),
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('5%'),
    alignItems: 'center',
  },
  membershipModalText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginVertical: hp('1.5%'),
    fontFamily: 'Lexend-Medium',
  },
  membershipButton: {
    backgroundColor: '#FF7E00',
    padding: hp('1.5%'),
    borderRadius: wp('5%'),
    marginVertical: hp('0.8%'),
    width: '100%',
    alignItems: 'center',
  },
  membershipButtonText: {
    color: 'white',
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.8%'),
  },
  closeMembershipButton: {
    backgroundColor: '#e0e0e0',
    padding: hp('1.5%'),
    borderRadius: wp('5%'),
    marginVertical: hp('0.8%'),
    width: '100%',
    alignItems: 'center',
  },
  closeMembershipButtonText: {
    color: '#333',
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.8%'),
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7E00',
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1.5%'),
  },
  backButton: {
    color: '#fff',
    fontSize: wp('6%'),
    marginRight: wp('4%'),
  },
  profileImage: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    marginRight: wp('2.5%'),
  },
  profilePlaceholder: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('2.5%'),
  },
  profileInitial: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontFamily: "Lexend-Medium"
  },
  headerText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontFamily: 'Lexend-Medium',
  },
  messagesContainer: {
    flexGrow: 1,
    padding: wp('4%'),
    paddingBottom: hp('2%'), // Reduced padding to prevent overlap
  },
  messageBubble: {
    maxWidth: '80%',
    padding: wp('3.5%'),
    borderRadius: wp('3.5%'),
    marginBottom: hp('1.5%'),
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 0,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: wp('4%'),
    color: '#000',
    fontFamily: 'Lexend-Regular',
  },
  messageTime: {
    fontSize: wp('3%'),
    color: '#666',
    marginTop: hp('0.5%'),
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // Removed absolute positioning to prevent overlap
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('6%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
    maxHeight: hp('14%'),
    backgroundColor: '#fff',
    marginRight: wp('2.5%'),
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.8%'),
    color: "black"
  },
  sendButton: {
    backgroundColor: '#FF7E00',
    borderRadius: wp('5%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
  },
  sendButtonText: {
    color: '#fff',
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.8%'),
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('12%'),
  },
  noMessagesText: {
    fontSize: wp('4.5%'),
    fontFamily: 'Lexend-Medium',
    color: '#333',
    marginBottom: hp('1.5%'),
  },
  startConversationText: {
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Regular',
    color: '#666',
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('12%'),
  },
  noChatsText: {
    fontSize: wp('4.5%'),
    fontFamily: 'Lexend-Medium',
    color: '#333',
    marginBottom: hp('1.5%'),
  },
  goToMatches: {
    fontSize: wp('4%'),
    color: '#FF7E00',
    fontFamily: 'Lexend-Medium',
  },
  bottomHeaderContainer: {
    // Removed absolute positioning to maintain proper layout
  },
  arrowstyle: {
    height: hp('2.2%'),
    width: wp('6%'),
    marginRight: wp('2%'),
    tintColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('12%'),
  },
  loadingText: {
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Regular',
    color: '#666',
    marginTop: hp('2%'),
  },
});

export default Screen33;