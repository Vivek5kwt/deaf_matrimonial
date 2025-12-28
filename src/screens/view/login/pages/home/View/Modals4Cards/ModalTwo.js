import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Image } from 'react-native';
import { line2 } from '../../../../../../../utils/constants/icons/icon';

const { height } = Dimensions.get('window');

const BlockUserModal = ({ visible, onClose }) => 
    (
    
    <Modal transparent={true} visible={visible} animationType="slide">
        <View style={styles.modalBackground}>
            <View style={styles.blockModalContainer}>
                <Text style={styles.blockTitle}>Block User</Text>
                <Text style={styles.blockMessage}>
                    Blocked Member will not be able to view your profile or contact you on Deaf Matrimonial.com.
                </Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton1} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => {
                            alert('User Blocked!');
                            onClose();
                        }}
                    >
                        <Text style={styles.primaryButtonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

const ModalTwo = ({ visible, onClose, onReport, navigation }) => {
    const [blockModalVisible, setBlockModalVisible] = useState(false);

    return (
        <>
            {/* Main Modal */}
            <Modal transparent={true} visible={visible} animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                onClose(); // Close the main modal first
                                alert('Share option clicked');
                            }}
                        >
                            <Text style={styles.optionText}>Share</Text>
                        </TouchableOpacity>
                        <Image source={line2?.Icon103} style={styles.divider} />

                        <TouchableOpacity
                            onPress={() => {
                                onClose(); // Close the main modal first
                                alert('Add to Shortlist option clicked');
                            }}
                        >
                            <Text style={styles.optionText}>Add to Shortlist</Text>
                        </TouchableOpacity>
                        <Image source={line2?.Icon103} style={styles.divider} />

                        {/* Block Profile Option */}
                        <TouchableOpacity
                            onPress={() => {
                                onClose(); // Close the main modal first
                                setBlockModalVisible(true); // Open the BlockUserModal
                            }}
                        >
                            <Text style={styles.optionText}>Block Profile</Text>
                        </TouchableOpacity>
                        <Image source={line2?.Icon103} style={styles.divider} />

                        {/* Report Profile/Photo Option */}
                        <TouchableOpacity
                            onPress={() => {
                                onClose(); // Close the main modal first
                                onReport?.(); // Trigger the report callback
                                navigation.navigate('Screen32'); // Navigate to the report screen
                            }}
                        >
                            <Text style={[styles.optionText, styles.reportText]}>Report profile/Photo</Text>
                        </TouchableOpacity>
                        <Image source={line2?.Icon103} style={styles.divider} />

                        {/* Cancel Button */}
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Block User Modal */}
            <BlockUserModal visible={blockModalVisible} onClose={() => setBlockModalVisible(false)} />
        </>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '100%',
        height: height * 0.4,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'center',
        fontFamily: 'Lexend-Medium',
        color: '#FF7E00',
    },
    reportText: {
        color: 'red',
    },
    divider: {
        height: 2,
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#FF7E00',
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 30,
        marginTop: 40,
    },
    cancelButton1: {
        backgroundColor: '#BFBFBF',
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 30,
        marginTop: 40,
    },
    cancelButtonText: {
        color: 'white',
        fontFamily: "Lexend-Medium"
    },
    blockModalContainer: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: "50%",
    },
    blockTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: "Lexend-Medium",
        color: 'black'
    },
    blockMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
        fontFamily: "Lexend-Regular",
        paddingHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#FF7E00',
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 30,
        marginTop: 40,
    },
    primaryButtonText: {
        color: 'white',
        fontFamily: "Lexend-Medium",
    },
});

export default ModalTwo;
