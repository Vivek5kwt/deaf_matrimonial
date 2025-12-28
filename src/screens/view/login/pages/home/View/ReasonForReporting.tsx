import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { RadioButton } from "react-native-paper";
import { angel, arrow } from "../../../../../../utils/constants/icons/icon";
import { useNavigation } from "@react-navigation/native";
import ReportModal from "../../../../login/pages/home/View/Modals4Cards/ReportModal";

export const Screen32 = (props) => {
    const navigation = useNavigation();

    const [checked, setChecked] = useState(null);
    const [inputs, setInputs] = useState({});
    const [modalVisible, setModalVisible] = useState(false);

    const reasons = [
        "Fake/Misleading profile Information",
        "Multiple Profile",
        "Phone number is incorrect",
        "Photos are fake or obscene",
        "Has sent abusive emails/chats",
        "Is already married/engaged",
        "Asking for money/scammer",
        "Not responding",
        "Other misuse reasons",
    ];

    const handleInputChange = (index, text) => {
        setInputs((prev) => ({ ...prev, [index]: text }));
    };

    const handleReportSubmission = () => {
        if (checked === null) {
            alert("Please select a reason before submitting.");
            return;
        }

        setModalVisible(true);

        setTimeout(() => {
            setChecked(null);
            setInputs({});
            setModalVisible(false);
        }, 2000);
    };

    const renderReason = ({ item, index }) => (
        <>
            <TouchableOpacity style={styles.radioItem} onPress={() => setChecked(index)}>
                <RadioButton
                    value={item}
                    status={checked === index ? "checked" : "unchecked"}
                    color="#FF6600"
                    uncheckedColor="#CCCCCC"
                    onPress={() => setChecked(index)}
                />
                <Text style={styles.radioText}>{item}</Text>
            </TouchableOpacity>

            {checked === index && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Provide details for appropriate action."
                        placeholderTextColor="#999"
                        multiline={true}
                        value={inputs[index] || ""}
                        onChangeText={(text) => handleInputChange(index, text)}
                    />
                </View>
            )}
        </>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                source={arrow?.Icon5}
                                style={{ height: 20, width: 28, tintColor: "white" }}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Reason for Reporting</Text>
                    </View>

                    <FlatList
                        data={reasons}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderReason}
                        ListFooterComponent={
                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={[styles.reportButton, { backgroundColor: checked !== null ? "#FF6600" : "#E0E0E0" }]}
                                    onPress={handleReportSubmission}
                                    disabled={checked === null}
                                >
                                    <Text style={styles.reportButtonText}>Report</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => props.navigation.goBack()}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        contentContainerStyle={{ paddingBottom: 90 }}
                        keyboardShouldPersistTaps="handled"
                    />

                    <ReportModal visible={modalVisible} onClose={() => setModalVisible(false)} />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF6600",
        height: 74,
        paddingHorizontal: 16,
        justifyContent: "center",
        paddingTop: 20,
    },
    backButton: {
        position: "absolute",
        left: 16,
        top: 35,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFF",
        textAlign: "center",
        fontFamily: "Lexend-Medium",
    },
    radioItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },
    radioText: {
        fontSize: 16,
        color: "#333333",
        marginLeft: 8,
        fontFamily: "Lexend-Regular",
    },
    inputContainer: {
        marginHorizontal: 16,
        marginTop: 10,
    },
    textInput: {
        backgroundColor: "#F9F9F9",
        borderColor: "#E5E5E5",
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        fontSize: 14,
        color: "#333",
        fontFamily: "Lexend-Regular",
        textAlignVertical: "top",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
    },
    reportButton: {
        flex: 0.48,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 4,
    },
    reportButtonText: {
        fontSize: 16,
        color: "#FFF",
        fontFamily: "Lexend-Medium",
    },
    cancelButton: {
        flex: 0.48,
        backgroundColor: "#E0E0E0",
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 4,
    },
    cancelButtonText: {
        fontSize: 16,
        color: "#333",
        fontFamily: "Lexend-Medium",
    },
});

export default Screen32;