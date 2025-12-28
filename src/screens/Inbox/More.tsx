import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import InboxHeader from "./Header";
import { useNavigation } from "@react-navigation/native";
import { inbox1 } from "../../utils/constants/icons/icon";
import BottomHeader from "../../components/BottomHeader";

const Screen41 = (props: any) => {
    const profileCounts = {
        // Recevied: 10,
        // Accepted: 7,
        // Contacts: 1,
        Sent: 2,
        // More: 10,
    };

    const [selectedTab, setSelectedTab] = useState("Accepted"); // Manage the active tab

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <InboxHeader navigation={navigation} profileCounts={profileCounts} />
            <View style={{ borderTopWidth: 1, borderColor: "#BFBFBF", borderBottomWidth: 1 }}>
                <View style={styles.tabContainer}>
                    {/* Request and Deleted buttons */}
                    <View style={styles.tabButtonGroup}>
                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                selectedTab === "Accepted" && styles.activeTabButton,
                            ]}
                            onPress={() => setSelectedTab("Accepted")}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === "Accepted" && styles.activeTabText,
                                ]}
                            >
                                Accepted
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                selectedTab === "Rejected" && styles.activeTabButton,
                            ]}
                            onPress={() => setSelectedTab("Rejected")}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === "Rejected" && styles.activeTabText,
                                ]}
                            >
                                Rejected
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                selectedTab === "Pending" && styles.activeTabButton,
                            ]}
                            onPress={() => setSelectedTab("Pending")}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === "Pending" && styles.activeTabText,
                                ]}
                            >
                                Pending
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {selectedTab === "Requests" && (
                <Text style={styles.heading}>Pending Requests</Text>
            )}

            <View
                style={[
                    styles.content,
                    selectedTab === "Rejected" && styles.deletedContent,
                ]}
            >
                {selectedTab === "Accepted" ? (
                    <View style={styles.requestsContainer}>
                        <View style={styles.imageWrapper}>
                            <Image source={inbox1?.Icon134} style={styles.image} />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>0</Text>
                            </View>
                        </View>

                        {/* No Requests Text */}
                        <Text style={styles.title}>There are no Accepted Requests</Text>
                    </View>
                ) : selectedTab === "Rejected" ? (
                    <View style={styles.deletedContainer}>
                        <Image source={inbox1?.Icon134} style={styles.image} />
                        <Text style={styles.title}>No Requests</Text>
                        <Text style={styles.description}>
                            Check out more Profiles and continue your Partner search.
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => props.navigation.navigate("Screen26")}
                        >
                            <Text style={styles.buttonText}>View My Matches</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.requestsContainer}>
                        <Image source={inbox1?.Icon134} style={styles.image} />
                        <Text style={styles.title}>There are no Pending Requests</Text>
                    </View>
                )}
            </View>

            <View style={styles.bottomHeaderContainer}>
                <BottomHeader />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        backgroundColor: "#fff",
        paddingHorizontal: 20, // Ensure space between left and right elements
    },
    tabButtonGroup: {
        flexDirection: "row",
        alignItems: "center",
    },
    tabButton: {
        paddingVertical: 6,
        paddingHorizontal: 30,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#BFBFBF",
        marginRight: 10, // Add spacing between buttons
    },
    activeTabButton: {
        backgroundColor: "#FF7E00",
        borderColor: "#FF7E00",
    },
    tabText: {
        color: "#BFBFBF",
        fontSize: 12,
        fontFamily: "Lexend-Medium",
    },
    activeTabText: {
        color: "#fff",
    },
    heading: {
        fontSize: 16,
        fontFamily: "Lexend-Medium",
        color: "#BFBFBF",
        marginLeft: 20,
        marginTop: 10,
    },
    content: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        marginHorizontal: 30,
        marginTop: "40%",
        paddingVertical: 50,
        borderRadius: 8,
        backgroundColor: "white",
        borderColor: "white",
    },
    deletedContent: {
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    requestsContainer: {
        alignItems: "center",
    },
    imageWrapper: {
        position: "relative",
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
    },
    badge: {
        position: "absolute",
        top: 0,
        right: 10,
        backgroundColor: "#FF7E00",
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontFamily: "Lexend-Medium",
    },
    title: {
        fontSize: 15,
        fontFamily: "Lexend-Medium",
        marginBottom: 10,
        color: "black",
        marginVertical: 10,
    },
    deletedContainer: {
        alignItems: "center",
    },
    description: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
        fontFamily: "Lexend-Regular",
        paddingHorizontal: 40,
    },
    button: {
        backgroundColor: "#ff6f00",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Lexend-Medium",
    },
    bottomHeaderContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: "#fff",
    },
});

export default Screen41;
