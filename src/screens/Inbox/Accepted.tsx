import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import InboxHeader from "./Header";
import { useNavigation } from "@react-navigation/native";
import { inbox1 } from "../../utils/constants/icons/icon";
import BottomHeader from "../../components/BottomHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const Screen41 = (props: any) => {
    const profileCounts = {
        Recevied: 10,
        Accepted: 7,
        Contacts: 1,
        Sent: 2,
        More: 10,
    };

    const [selectedButton, setSelectedButton] = useState<"her" | "me" | null>(null);

    const navigation = useNavigation();

    return (
   <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
            <InboxHeader navigation={navigation} profileCounts={profileCounts} />
            <View style={{ borderTopWidth: 1, borderColor: "#BFBFBF", borderBottomWidth: 1 }}>
                <View style={styles.topButtonsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            selectedButton === "her" && styles.selectedButton,
                        ]}
                        onPress={() => setSelectedButton("her")}
                    >
                        <Text
                            style={[
                                styles.toggleButtonText,
                                selectedButton === "her" && styles.selectedButtonText,
                            ]}
                        >
                            Accepted by Her
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            selectedButton === "me" && styles.selectedButton,
                        ]}
                        onPress={() => setSelectedButton("me")}
                    >
                        <Text
                            style={[
                                styles.toggleButtonText,
                                selectedButton === "me" && styles.selectedButtonText,
                            ]}
                        >
                            Accepted by Me
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.content}>
                <Image source={inbox1?.Icon134} style={styles.image} />
                <Text style={styles.title}>No Accepted Requests</Text>
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
            <View style={styles.bottomHeaderContainer}>
                <BottomHeader />
            </View>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    topButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
        marginHorizontal: 20,
    },
    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#BFBFBF",
        borderRadius: 20,
        backgroundColor: "#fff",
    },
    selectedButton: {
        backgroundColor: "#FF7E00",
    },
    toggleButtonText: {
        fontSize: 14,
        color: "#BFBFBF",
        textAlign: "center",
        fontFamily: "Lexend-Medium",
    },
    selectedButtonText: {
        color: "#fff",
    },
    content: {
        flex: 0.8,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: "Lexend-Medium",
    },
    description: {
        fontSize: 15,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
        fontFamily: "Lexend-Regular",
    },
    button: {
        backgroundColor: "#ff6f00",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Lexend-Medium",
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
});

export default Screen41;
