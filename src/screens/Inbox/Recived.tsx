
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, FlatList, Modal, Pressable } from "react-native";
import InboxHeader from "./Header";
import { useNavigation } from "@react-navigation/native";
import { filter, heart, heart1, inbox1 } from "../../utils/constants/icons/icon";
import BottomHeader from "../../components/BottomHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Snackbar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getMessaging, onNotificationOpenedApp, getInitialNotification } from '@react-native-firebase/messaging';

const messaging = getMessaging();

interface Message {
    id: number;
    conversation_id: string | null;
    sender_id: string | {
        index_id?: number;
        matri_id?: string;
        prefix?: string | null;
        profile_image?: string | null;
        firstname?: string;
        lastname?: string;
        sent_date: string;

    };
    receiver_id?: {
        index_id?: number;
        matri_id?: string;
        prefix?: string | null;
        profile_image?: string | null;
        firstname?: string;
        lastname?: string;
        [key: string]: any;

    };
    subject: string | null;
    message: string;
    is_read: number;
    is_replied: number;
    is_forwarded: number;
    is_important: number;
    created_at: string;
    updated_at: string;
    is_deleted?: number;

}

const Screen40 = (props: any) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'read' | 'unread'>('all');
    const [isSentMessages, setIsSentMessages] = useState(false); // Flag to check if we're showing sent messages
    const profileCounts = {};
    const navigation = useNavigation();
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    useEffect(() => {
        // Check if we're showing sent messages or inbox based on navigation params
        const showSent = props.route.params?.showSent || false;
        setIsSentMessages(showSent);
        fetchMessages(showSent);
    }, [props.route.params]);

    useEffect(() => {
        applyFilter();
    }, [messages, filterType]);

    const applyFilter = () => {
        switch (filterType) {
            case 'read':
                setFilteredMessages(messages.filter(msg => msg.is_read === 1));
                break;
            case 'unread':
                setFilteredMessages(messages.filter(msg => msg.is_read === 0));
                break;
            default:
                setFilteredMessages([...messages]);
        }
    };
    const markAsImportant = async (matriId: string | undefined) => {
        try {
            if (!matriId) {
                console.log("No matriId provided");
                return;
            }

            const userData = await getUserData();
            if (!userData?.authToken) {
                console.log("No auth token found");
                return;
            }

            console.log("Marking conversation as important for matri_id:", matriId);

            const response = await fetch(`http://82.29.161.246:8002/api/mark-conversation-important/${matriId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userData.authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Response status:", response.status);

            const result = await response.json();
            console.log("API Response:", result);

            if (response.ok && result.success) {
                // Update state - we need to find all messages with this matri_id
                setMessages(prevMessages =>
                    prevMessages.map(msg => {
                        // Check if this message belongs to the conversation with this user
                        const messageMatriId = typeof msg.sender_id === 'object'
                            ? msg.sender_id.matri_id
                            : msg.receiver_id?.matri_id;

                        if (messageMatriId === matriId) {
                            return { ...msg, is_important: msg.is_important === 1 ? 0 : 1 };
                        }
                        return msg;
                    })
                );

                setSnackbarMessage(result.message || "Conversation status updated");
                setSnackbarVisible(true);
            } else {
                setSnackbarMessage(result.message || "Failed to update status");
                setSnackbarVisible(true);
            }
        } catch (error) {
            console.error("Error in markAsImportant:", error);
            setSnackbarMessage("Network error. Please try again.");
            setSnackbarVisible(true);
        }
    };

    const fetchMessages = async (isSent: boolean = false) => {
        try {
            setLoading(true);
            setError(null);

            const userData = await getUserData();

            if (!userData || !userData.authToken) {
                setError("Authentication required. Please login again.");
                setLoading(false);
                return;
            }

            const endpoint = "http://82.29.161.246:8002/api/inbox";

            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${userData.authToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.message && data.messages) {
                const messagesData = Array.isArray(data.messages) ? data.messages : [data.messages];

                const transformedMessages = messagesData.map(msg => {
                    const fromId = msg.from_id;
                    const toId = msg.to_id;

                    // Create fallback sender/receiver object
                    const senderInfo = {
                        matri_id: fromId,
                        index_id: undefined,
                        prefix: null,
                        profile_image: null,
                        firstname: null,
                        lastname: null,
                    };

                    const receiverInfo = {
                        matri_id: toId,
                        index_id: undefined,
                        prefix: null,
                        profile_image: null,
                        firstname: null,
                        lastname: null,
                    };

                    return {
                        id: msg.mes_id,
                        conversation_id: null, // Not available in response
                        sender_id: isSent ? receiverInfo : senderInfo,
                        receiver_id: isSent ? null : receiverInfo,
                        subject: msg.subject || '',
                        message: msg.message,
                        is_read: msg.msg_read_status === 'Yes' ? 1 : 0,
                        is_replied: 0,
                        is_forwarded: 0,
                        is_important: msg.msg_important_status === 'Yes' ? 1 : 0,
                        created_at: msg.sent_date,
                        updated_at: msg.sent_date,
                        is_deleted: 0,
                    };
                });

                setMessages(transformedMessages);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError("Failed to load messages. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const markAsRead = async (messageId: number) => {
        try {
            const userData = await getUserData();
            if (!userData?.authToken) return;

            const response = await fetch(`http://82.29.161.246:8002/api/messages/mark-as-read/${messageId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userData.authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === messageId ? { ...msg, is_read: 1 } : msg
                    )
                );
            }
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    };

    const getUserData = async () => {
        try {
            const matriId = await AsyncStorage.getItem('matri_id');
            const authToken = await AsyncStorage.getItem('auth_token');

            return {
                matriId,
                authToken,
            };
        } catch (error) {
            console.error("Error retrieving user data:", error);
            return null;
        }
    };
    useEffect(() => {
        const handleNotification = (data) => {
          if (data?.screen === 'inbox') {
            // Check if we need to navigate
            if (props.navigation && data.conversation_id) {
              props.navigation.navigate('Screen40', {
                conversation_id: data.conversation_id,
                sender_id: data.sender_id,
                messageId: data.messageId
              });
            }

                // Mark as read if needed
                if (data.messageId) {
                    markAsRead(data.messageId);
                  }
                }
              };

        // Listen for notification events
        const unsubscribeForeground = onNotificationOpenedApp(messaging, handleNotification);

        // Check if app was opened from a notification
        getInitialNotification(messaging)
        .then(notification => {
          if (notification) {
            handleNotification(notification.data);
          }
        });
    
      return unsubscribeForeground;
    }, [props.navigation]);


    const handleMessagePress = (message: Message) => {
        if (message.is_read === 0 && !isSentMessages) {
            markAsRead(message.id);
        }

        // Determine the other user's details (sender or receiver based on context)
        const otherUser = isSentMessages
            ? message.receiver_id
            : typeof message.sender_id === 'object'
                ? message.sender_id
                : null;

        if (!otherUser) {
            console.error("Could not determine user details");
            return;
        }

        // Navigate to chat screen with the user's details
        props.navigation.navigate("Screen33", {
            senderInfo: {
                ...otherUser,
                // Make sure we have the ID that matches what the chat API expects
                id: otherUser.index_id || otherUser.matri_id
            },
            // Pass any existing messages between these users
            existingMessages: messages.filter(msg => {
                // Filter messages between current user and this user
                const currentUserId = AsyncStorage.getItem('matri_id');
                const isFromThisUser = typeof msg.sender_id === 'object'
                    ? msg.sender_id.matri_id === otherUser.matri_id
                    : msg.sender_id === otherUser.matri_id;
                const isToThisUser = msg.receiver_id?.matri_id === otherUser.matri_id;

                return isFromThisUser || isToThisUser;
            })
        });
    };
    const formatTime = (dateString: string) => {
        try {
            if (!dateString || typeof dateString !== "string") return "--:--";

            const parts = dateString.trim().split(" ");
            if (parts.length !== 2) return "--:--";

            const timePart = parts[1];
            const [hour, minute] = timePart.split(":");

            if (!hour || !minute || isNaN(Number(hour)) || isNaN(Number(minute))) {
                return "--:--";
            }

            let hr = parseInt(hour, 10);
            const ampm = hr >= 12 ? "PM" : "AM";
            hr = hr % 12 || 12;

            return `${hr}:${minute} ${ampm}`;
        } catch (error) {
            console.error("formatTime error:", error);
            return "--:--";
        }
    };

    const renderMessageItem = ({ item }: { item: Message }) => {
        const senderInfo = typeof item.sender_id === 'object'
            ? item.sender_id
            : { matri_id: item.sender_id?.toString() || 'Unknown' };

        const receiverInfo = item.receiver_id || {};

        const displayInfo = isSentMessages ? receiverInfo : senderInfo;

        const prefix = displayInfo?.prefix || '';
        const matriId = displayInfo?.matri_id || 'Unknown';
        const name = displayInfo?.firstname
            ? `${displayInfo.firstname} ${displayInfo.lastname || ''}`.trim()
            : displayInfo?.matri_id || 'Unknown';

        const profilePic = displayInfo?.profile_image
            ? `http://82.29.161.246:8002/${displayInfo.profile_image}`
            : null;

        const initial = name.charAt(0);

        // Determine which heart icon to show based on is_important status
        const heartIcon = item.is_important === 1 ? heart1?.Icon157 : heart?.Icon156;

        return (
            <TouchableOpacity
                style={styles.messageCard}
                onPress={() => handleMessagePress(item)}
            >
                <View style={styles.messageContent}>
                    {profilePic ? (
                        <Image
                            source={{ uri: profilePic }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <View style={styles.profilePlaceholder}>
                            <Text style={styles.profileInitial}>
                                {initial}
                            </Text>
                        </View>
                    )}
                    <View style={styles.messageInfo}>
                        <View style={styles.nameHeartContainer}>
                            <Text style={[
                                styles.senderName,
                                item.is_read === 0 && !isSentMessages && styles.unreadText
                            ]}>
                                {name}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    const userMatriId = typeof item.sender_id === 'object'
                                        ? item.sender_id.matri_id
                                        : item.receiver_id?.matri_id;
                                    markAsImportant(userMatriId);
                                }}
                                style={styles.heartButton}
                            >
                                <Image
                                    source={item.is_important === 1 ? heart1?.Icon157 : heart?.Icon156}
                                    style={styles.heartIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={[
                            styles.messageText,
                            item.is_read === 0 && !isSentMessages && styles.unreadText
                        ]} numberOfLines={1}>
                            {item.message}
                        </Text>
                    </View>
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                        {item.created_at ? formatTime(item.created_at) : "No Date"}
                    </Text>




                    {item.is_read === 0 && !isSentMessages && <View style={styles.unreadBadge} />}
                </View>
            </TouchableOpacity>
        );
    };

    const handleRefresh = () => {
        fetchMessages(isSentMessages);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{ paddingTop: hp('0%') }}>

                    <InboxHeader navigation={navigation} profileCounts={profileCounts} />
                </View>

                <View style={styles.headerRow}>
                    <Text style={styles.description}>
                        {isSentMessages ? 'Sent Messages' : 'All Requests'} ({filteredMessages.length})
                    </Text>
                    <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                        <Image source={filter?.Icon136} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={filterModalVisible}
                    onRequestClose={() => setFilterModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Filter Messages</Text>
                            <Pressable
                                style={[styles.filterOption, filterType === 'all' && styles.selectedFilter]}
                                onPress={() => {
                                    setFilterType('all');
                                    setFilterModalVisible(false);
                                }}
                            >
                                <Text style={styles.filterOptionText}>All Messages</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.filterOption, filterType === 'unread' && styles.selectedFilter]}
                                onPress={() => {
                                    setFilterType('unread');
                                    setFilterModalVisible(false);
                                }}
                            >
                                <Text style={styles.filterOptionText}>Unread Only</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.filterOption, filterType === 'read' && styles.selectedFilter]}
                                onPress={() => {
                                    setFilterType('read');
                                    setFilterModalVisible(false);
                                }}
                            >
                                <Text style={styles.filterOptionText}>Read Only</Text>
                            </Pressable>
                            <Pressable
                                style={styles.cancelButton}
                                onPress={() => setFilterModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Loading...</Text>
                    </View>
                ) : filteredMessages.length === 0 ? (
                    <View style={styles.content}>
                        <Image source={inbox1?.Icon134} style={styles.image} />
                        <Text style={styles.title}>
                            {filterType === 'all' ? 'No Messages' :
                                filterType === 'read' ? 'No Read Messages' : 'No Unread Messages'}
                        </Text>
                        <Text style={styles.description}>
                            {filterType === 'all' ? 'Check out more Profiles and continue your Partner search.' :
                                filterType === 'read' ? 'You have no read messages.' : 'All messages are read.'}
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => props.navigation.navigate("Screen26")}
                        >
                            <Text style={styles.buttonText}>View My Matches</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={filteredMessages}
                        renderItem={renderMessageItem}
                        keyExtractor={(item, index) => item?.id ? item.id.toString() : `msg-${index}`}

                        contentContainerStyle={styles.listContainer}
                        refreshing={loading}
                        onRefresh={handleRefresh}
                    />
                )}

                <View style={styles.bottomHeaderContainer}>
                    <BottomHeader />
                </View>
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3000}
                    action={{
                        label: 'OK',
                        onPress: () => setSnackbarVisible(false),
                    }}
                    style={styles.snackbar}
                >
                    {snackbarMessage}
                </Snackbar>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({

    icon: {
        height: wp('5.5%'),
        width: wp('5.5%'),
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',

    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: wp('5%'),
        marginBottom: hp('10%'),

    },
    image: {
        width: wp('25%'),
        height: wp('25%'),
        marginBottom: hp('2.5%'),
    },
    title: {
        fontSize: wp('4.5%'),
        marginBottom: hp('1.2%'),
        fontFamily: 'Lexend-Medium',
    },
    description: {
        fontSize: wp('4%'),
        color: '#666',
        textAlign: 'center',
        marginBottom: hp('0%'),
        fontFamily: 'Lexend-Regular',
    },
    button: {
        backgroundColor: '#ff6f00',
        paddingVertical: hp('1.2%'),
        paddingHorizontal: wp('8%'),
        borderRadius: wp('5%'),
        marginTop: hp('1.5%'),

    },
    buttonText: {
        color: '#fff',
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium',
    },
    bottomHeaderContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white', // ya jo bhi app ka background ho
        zIndex: 10,
        elevation: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingBottom: hp('9%'),
    },
    messageCard: {
        backgroundColor: '#fff',
        marginHorizontal: wp('4%'),
        marginVertical: hp('1%'),
        padding: wp('4%'),
        borderRadius: wp('3%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: wp('1.2%'),
    },
    messageContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileImage: {
        width: wp('13%'),
        height: wp('13%'),
        borderRadius: wp('6.5%'),
        marginRight: wp('4%'),
    },
    profilePlaceholder: {
        width: wp('13%'),
        height: wp('13%'),
        borderRadius: wp('6.5%'),
        backgroundColor: '#ff6f00',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('4%'),
    },
    profileInitial: {
        color: '#fff',
        fontSize: wp('4.5%'),
        fontFamily: 'Lexend-Medium',
    },
    messageInfo: {
        flex: 1,
    },
    senderName: {
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium',
        marginBottom: hp('0.5%'),
        color: 'black',

    },
    messageText: {
        fontSize: wp('3.5%'),
        color: '#666',
        fontFamily: 'Lexend-Regular',
    },
    timeText: {
        fontSize: wp('3%'),
        color: '#999',
        fontFamily: 'Lexend-Regular',
    },
    nameHeartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heartButton: {
        padding: wp('1.5%'),
        marginBottom: hp('2%'),
    },
    heartIcon: {
        width: wp('5%'),
        height: wp('5%'),
        tintColor: '#ff6f00',
        position: 'absolute',
        left: wp('6%'),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: wp('5%'),
        marginVertical: hp('0.7%'),
        alignItems: 'center',
    },
    unreadText: {
        fontWeight: 'bold',
        color: '#000',
    },
    unreadBadge: {
        width: wp('2.5%'),
        height: wp('2.5%'),
        borderRadius: wp('1.25%'),
        backgroundColor: '#ff6f00',
        marginTop: hp('2.5%'),
        position: 'absolute',
        left: wp('5%'),
    },
    timeContainer: {
        alignItems: 'flex-end',
        marginTop: hp('3%'),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: wp('3%'),
        padding: wp('5%'),
        width: wp('80%'),
    },
    modalTitle: {
        fontSize: wp('4.5%'),
        fontFamily: 'Lexend-Medium',
        marginBottom: hp('2.5%'),
        textAlign: 'center',
    },
    filterOption: {
        paddingVertical: hp('2%'),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedFilter: {
        backgroundColor: '#fff8f0',
    },
    filterOptionText: {
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Regular',
    },
    cancelButton: {
        marginTop: hp('2.5%'),
        paddingVertical: hp('1.2%'),
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#ff6f00',
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium',
    },
    snackbar: {
        backgroundColor: '#ff6f00',
        marginBottom: hp('8%'), // Responsive to avoid overlap with bottom header
    },

});

export default Screen40;