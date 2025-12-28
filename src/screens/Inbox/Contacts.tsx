import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,

} from "react-native";
import InboxHeader from "./Header";
import { useNavigation } from "@react-navigation/native";
import { heart, heart1, inbox1 } from "../../utils/constants/icons/icon";
import BottomHeader from "../../components/BottomHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Snackbar } from "react-native-paper";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

interface Conversation {
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
    sender_id: string | null;
    receiver_id: string | null;
}

const Screen42 = (props: any) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        fetchImportantConversations();
    }, []);

    const fetchImportantConversations = async () => {
        try {
            setLoading(true);
            setError(null);

            const userData = await getUserData();

            if (!userData || !userData.authToken) {
                setError("Authentication required. Please login again.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                "http://82.29.161.246:8002/api/important-conversations",
                {
                    headers: {
                        Authorization: `Bearer ${userData.authToken}`,
                        "Content-Type": "application/json",
                        accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.conversations) {
                const conversationsData = Array.isArray(data.conversations)
                    ? data.conversations
                    : [data.conversations];
                setConversations(conversationsData);
            } else {
                setConversations([]);
            }
        } catch (error) {
            console.error("Error fetching important conversations:", error);
            setError("Failed to load important conversations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const removeFromImportant = async (conversationId: string, matriId: string | undefined) => {
        try {
            if (!conversationId || !matriId) return;

            const userData = await getUserData();
            if (!userData?.authToken) return;

            const response = await fetch(
                `http://82.29.161.246:8002/api/remove-important-conversations/${matriId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${userData.authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const result = await response.json();
                if (result.msg_important_status === "No") {
                    setConversations((prev) =>
                        prev.filter((conv) => conv.mes_id.toString() !== conversationId)
                    );
                    setSnackbarMessage(result.message || "Removed from important");
                    setSnackbarVisible(true);
                }
            } else {
                throw new Error("Failed API call");
            }
        } catch (error) {
            console.error("Error removing conversation from important:", error);
            setSnackbarMessage("Failed to remove from important. Please try again.");
            setSnackbarVisible(true);
        }
    };


    const getUserData = async () => {
        try {
            const matriId = await AsyncStorage.getItem("matri_id");
            const authToken = await AsyncStorage.getItem("auth_token");

            return {
                matriId,
                authToken,
            };
        } catch (error) {
            console.error("Error retrieving user data:", error);
            return null;
        }
    };

    const handleConversationPress = (conversation: Conversation) => {
        props.navigation.navigate("Screen33", {
            conversationId: conversation.mes_id,
            senderInfo: conversation.from_id,
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

            // Convert 24-hour to 12-hour time
            let hr = parseInt(hour, 10);
            const ampm = hr >= 12 ? "PM" : "AM";
            hr = hr % 12 || 12;

            return `${hr}:${minute} ${ampm}`;
        } catch (error) {
            console.error("formatTime error:", error);
            return "--:--";
        }
    };



    const renderConversationItem = ({ item }: { item: Conversation }) => {
        const name = item.from_id || "Unknown";
        const initial = name.charAt(0);

        return (
            <TouchableOpacity
                style={styles.messageCard}
                onPress={() => handleConversationPress(item)}
            >
                <View style={styles.messageContent}>
                    <View style={styles.profilePlaceholder}>
                        <Text style={styles.profileInitial}>{initial}</Text>
                    </View>
                    <View style={styles.messageInfo}>
                        <View style={styles.nameHeartContainer}>
                            <Text style={styles.senderName}>{name}</Text>
                            <TouchableOpacity
                                onPress={() =>
                                    removeFromImportant(
                                        item.mes_id.toString(),
                                        item.to_id
                                    )
                                }
                                style={styles.heartButton}
                            >
                                <Image
                                    source={
                                        item.msg_important_status === "Yes"
                                            ? heart1?.Icon157
                                            : heart?.Icon156
                                    }
                                    style={styles.heartIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.messageText} numberOfLines={1}>
                            {item.message}
                        </Text>
                    </View>
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                        {item.sent_date ? formatTime(item.sent_date) : "--:--"}
                    </Text>



                </View>
            </TouchableOpacity>
        );
    };

    const handleRefresh = () => {
        fetchImportantConversations();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{ marginTop: "-0.6%" }}>
                    <InboxHeader navigation={navigation} />
                </View>
                <View style={styles.headerRow}>
                    <Text style={styles.description}>
                        Important Messages ({conversations.length})
                    </Text>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Loading...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.content}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleRefresh}
                        >
                            <Text style={styles.buttonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : conversations.length === 0 ? (
                    <View style={styles.content}>
                        <Image
                            source={inbox1?.Icon134}
                            style={styles.image}
                        />
                        <Text style={styles.title}>No Important Messages</Text>
                        <Text style={styles.description}>
                            You have no important messages. Long-press on
                            messages to mark them as important.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        renderItem={renderConversationItem}
                        keyExtractor={(item) => item.mes_id.toString()}
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
                        label: "OK",
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
    errorText: {
        color: 'red',
        marginBottom: hp('2.5%'),
        textAlign: 'center',
        fontFamily: 'Lexend-Regular',
    },
    icon: {
        height: wp('5.5%'),
        width: wp('5.5%'),
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',

    },
    content: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
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
        marginBottom: hp('1.5%'),
        fontFamily: 'Lexend-Regular',
    },
    button: {
        backgroundColor: '#ff6f00',
        paddingVertical: hp('1.2%'),
        paddingHorizontal: wp('8%'),
        borderRadius: wp('5%'),
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
        color: 'black'
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
        marginTop: hp('0.6%'),
    },
    nameHeartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heartButton: {
        padding: wp('1.5%'),
        marginRight: wp('-8%'),
    },
    heartIcon: {
        width: wp('5%'),
        height: wp('5%'),
        tintColor: '#ff6f00',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: wp('5%'),
        marginTop: hp('2%'),
        alignItems: 'center',
    },
    timeContainer: {
        alignItems: 'flex-end',
        marginTop: hp('3%'),
    },
    snackbar: {
        backgroundColor: '#ff6f00',
        marginBottom: hp('8%'),
    },
});

export default Screen42;