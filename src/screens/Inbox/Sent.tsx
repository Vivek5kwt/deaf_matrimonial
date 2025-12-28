import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, FlatList, Modal, Pressable } from "react-native";
import InboxHeader from "./Header";
import { useNavigation } from "@react-navigation/native";
import { filter, inbox1 } from "../../utils/constants/icons/icon";
import BottomHeader from "../../components/BottomHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
    receiver_id: any;
}

const Screen43 = (props: any) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'read' | 'unread'>('all');
    const profileCounts = {};
    const navigation = useNavigation();

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [messages, filterType]);

    const applyFilter = () => {
        switch (filterType) {
            case 'read':
                setFilteredMessages(messages.filter(msg => msg.msg_read_status === "Yes"));
                break;
            case 'unread':
                setFilteredMessages(messages.filter(msg => msg.msg_read_status === "No"));
                break;
            default:
                setFilteredMessages([...messages]);
        }
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError(null);

            const userData = await getUserData();

            if (!userData || !userData.authToken) {
                setError("Authentication required. Please login again.");
                setLoading(false);
                return;
            }

            const endpoint = "http://82.29.161.246:8002/api/sent";

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
                // Ensure messages is always an array
                const messagesData = Array.isArray(data.messages) ? data.messages : [data.messages];

                // Filter out any invalid messages that don't have mes_id
                const validMessages = messagesData.filter(msg => msg && msg.mes_id !== undefined);

                setMessages(validMessages);
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

    const handleMessagePress = (message: Message) => {
        // Navigate to chat screen with the message details
        props.navigation.navigate("Screen33", {
            senderInfo: {
                matri_id: message.to_id,  // The recipient of the sent message
                // Add any other required fields that Screen33 expects
                firstname: "", // You might want to fetch this from your data
                lastname: "",
                profile_image: "" // If available
            },
            existingMessages: [message], // Pass the current message as initial data
            isSentMessage: true
        });
    };

    const renderMessageItem = ({ item }: { item: Message }) => {
        // For sent messages, we want to show who the message was sent to
        const receiverId = item.to_id;
        const name = receiverId ? `${receiverId}` : 'Unknown recipient';

        return (
            <TouchableOpacity
                style={styles.messageCard}
                onPress={() => handleMessagePress(item)}
            >
                <View style={styles.messageContent}>
                    <View style={styles.profilePlaceholder}>
                        <Text style={styles.profileInitial}>
                            {name.charAt(0)}
                        </Text>
                    </View>
                    <View style={styles.messageInfo}>
                        <Text style={styles.senderName}>
                            {name}
                        </Text>
                        <Text style={styles.messageText} numberOfLines={1}>
                            {item.message}
                        </Text>
                    </View>
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                        {item.sent_date || "No Date"}
                    </Text>


                </View>
            </TouchableOpacity>
        );
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

    const handleRefresh = () => {
        fetchMessages();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingTop: hp('0%') }}>
                <InboxHeader navigation={navigation} profileCounts={profileCounts} />
            </View>
            <View style={styles.headerRow}>
                <Text style={styles.description}>
                    Sent Messages ({filteredMessages.length})
                </Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                    <Image source={filter?.Icon136} style={styles.icon} />
                </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={styles.contentContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Loading...</Text>
                    </View>
                ) : filteredMessages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Image source={inbox1?.Icon134} style={styles.image} />
                        <Text style={styles.title}>
                            {filterType === 'all' ? 'No Sent Messages' :
                                filterType === 'read' ? 'No Read Messages' : 'No Unread Messages'}
                        </Text>
                        <Text style={styles.description}>
                            {filterType === 'all' ? 'You have not sent any messages yet.' :
                                filterType === 'read' ? 'You have no read messages.' : 'All sent messages are read.'}
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
                        keyExtractor={(item, index) => item.mes_id?.toString() || `msg-${index}`}
                        contentContainerStyle={styles.listContainer}
                        refreshing={loading}
                        onRefresh={handleRefresh}
                    />
                )}
            </View>

            {/* Bottom Header */}
            <View style={styles.bottomHeaderContainer}>
                <BottomHeader />
            </View>

            {/* Filter Modal */}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",

    },

    contentContainer: {
        flex: 1,
    },
    icon: {
        height: wp('5.5%'),
        width: wp('5.5%'),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: wp('5%'),
    },
    image: {
        width: wp('25%'),
        height: wp('25%'),
        marginBottom: hp('2%'),
    },
    title: {
        fontSize: wp('4.5%'),
        marginBottom: hp('1.2%'),
        fontFamily: 'Lexend-Medium',
    },
    description: {
        fontSize: wp('4%'),
        color: "#FF7E00",
        textAlign: "center",
        marginBottom: hp('0%'),
        fontFamily: 'Lexend-Medium',
    },
    button: {
        backgroundColor: "#ff6f00",
        paddingVertical: hp('1.2%'),
        paddingHorizontal: wp('8%'),
        borderRadius: wp('5%'),
        marginTop: hp('1.5%'),
    },
    buttonText: {
        color: "#fff",
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium',
    },
    bottomHeaderContainer: {
        height: hp('7%'),
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingBottom: hp('7%'), // Adjust for bottom header
        paddingTop: hp('1%'),
    },
    messageCard: {
        backgroundColor: '#fff',
        marginHorizontal: wp('4%'),
        marginVertical: hp('0.5%'),
        padding: wp('4%'),
        borderRadius: wp('3%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: wp('1%'),
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
        fontWeight: 'bold',
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: wp('5%'),
        marginVertical: hp('1%'),
        alignItems: 'center',
        paddingTop: hp('1%'),
    },
    unreadText: {
        fontFamily: 'Lexend-Medium',
        color: '#000',
    },
    unreadBadge: {
        width: wp('2.5%'),
        height: wp('2.5%'),
        borderRadius: wp('1.25%'),
        backgroundColor: '#ff6f00',
        marginTop: hp('0.6%'),
    },
    timeContainer: {
        alignItems: 'flex-end',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: wp('2.5%'),
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
});

export default Screen43;