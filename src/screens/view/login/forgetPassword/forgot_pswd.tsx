import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Dimensions,
    StatusBar, Image, TextInput, Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Snackbar, ActivityIndicator } from 'react-native-paper';
import { arrow } from '../../../../utils/constants/icons/icon';
import { forgetpass } from '../../../../utils/constants/images/image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width: screenWidth } = Dimensions.get('screen');

const Screen47 = (props: any) => {
    const [contact, setContact] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigation = useNavigation();

    const isValidEmail = (email: string) => {
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    };

    const handleSendOTP = async () => {
        if (!isValidEmail(contact)) {
            setSnackbarMessage('Please enter a valid email address.');
            setSnackbarVisible(true);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://82.29.161.246:8002/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: contact }),
            });

            const data = await response.json();

            if (response.ok) {
                setModalVisible(true);
            } else {
                setSnackbarMessage(data.message || 'Something went wrong. Please try again.');
                setSnackbarVisible(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage('Network error. Please check your Email or connection.');
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <Image source={arrow?.Icon5} style={styles.icon} />
            </TouchableOpacity>

            <Text style={styles.title}>Forgot password?</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Select which contact details should we</Text>
                <Text style={styles.infoText}>use to reset your password</Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="User Id / Email Id"
                    placeholderTextColor="#C4C4C4"
                    value={contact}
                    onChangeText={setContact}
                />
            </View>

            <View style={{ alignSelf: 'center' }}>
                <Image source={forgetpass?.IMG33} style={{ height: 250, width: 250 }} />
            </View>

            <View style={{ marginVertical: 45 }}></View>

            {/* Submit Button */}
            <TouchableOpacity
                onPress={handleSendOTP}
                style={[
                    styles.nextButton,
                    { opacity: isValidEmail(contact) && !loading ? 1 : 0.5 }
                ]}
                disabled={!isValidEmail(contact) || loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.nextButtonText}>Submit</Text>
                )}
            </TouchableOpacity>

            {/* Snackbar */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={{ backgroundColor: '#D9534F',width:"100%" }}
            >
                {snackbarMessage}
            </Snackbar>

            {/* Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            Reminder! You can get your OTP on valid Email
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setModalVisible(false);
                            props.navigation.navigate('Screen48', { email: contact });
                        }}
                            style={styles.modalButton}
                        >
                            <Text style={styles.modalButtonText}>Sure!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    input: { fontSize: 16, color: '#333', marginLeft: 20, fontFamily: 'Lexend-Regular' },
    container: { flex: 1, backgroundColor: '#F4F4F4', padding: 10 },
    icon: {  height: hp('2.2%'),
            width: wp('5.5%'),
            marginTop: hp('3%'),
            marginLeft: wp('4%') },
    title: { color: 'black', fontSize: 25, fontWeight: '600', marginLeft: 20, fontFamily: 'Lexend-Regular' },
    infoContainer: { marginVertical: 20, marginLeft: 20 },
    infoText: { color: 'black', fontSize: 14, fontWeight: '400', marginTop: 5, fontFamily: 'Lexend-Regular' },
    inputContainer: { marginHorizontal: 20, marginTop: 10, borderWidth: 0.2, borderRadius: 8, backgroundColor: 'white' },
    nextButton: { flexDirection: "column", alignItems: 'center', marginTop: '-10%' },
    nextButtonText: { fontSize: 17, fontWeight: "500", color: 'white', backgroundColor: '#FFA500', paddingHorizontal: 40, paddingVertical: 12, borderRadius: 15, fontFamily: 'Lexend-Medium' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center', width: 300 },
    modalText: { fontSize: 14, fontWeight: '500', marginBottom: 20, fontFamily: 'Lexend-Medium' },
    modalButton: { backgroundColor: '#FFA500', paddingHorizontal: 30, paddingVertical: 5, borderRadius: 10 },
    modalButtonText: { fontSize: 16, color: 'white', fontWeight: '500' },
});

export default Screen47;
