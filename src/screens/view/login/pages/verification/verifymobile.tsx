import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, SafeAreaView, Image, TextInput, ActivityIndicator
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import axios from 'axios';
import styles from '../../../../../styles/onboadings/styles';
import { arrow, mobile } from '../../../../../utils/constants/icons/icon';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import styles2 from '../../../../../styles/verification/verificationstyles';
import { getUserData } from '../../../../../utils/constants/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const API_BASE_URL = "http://82.29.161.246:8002/api";

const Screen14 = (props: any) => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [isVerifyActive, setIsVerifyActive] = useState(false);
    const [isRequestPinActive, setIsRequestPinActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarColor, setSnackbarColor] = useState('#4CAF50');
    const [matriId, setMatriId] = useState(null);
    const [warning, setWarning] = useState('');
    const [sessionId, setSessionId] = useState('');

    const phoneNumber = props.route.params?.phoneNumber || 'Unknown Number';
    const countryCode = props.route.params?.countryCode || '+--';

    useEffect(() => {
        const fetchMatriId = async () => {
            const storedMatriId = await getUserData();
            if (!storedMatriId) {
                setWarning('Matri ID not found. Please restart the registration process.');
            } else {
                setMatriId(storedMatriId);
            }
        };
        fetchMatriId();
    }, []);

    useEffect(() => {
        let interval: any;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
            setIsRequestPinActive(true);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const showSnackbar = (message: string, type: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarColor(type === 'success' ? '#4CAF50' : '#F44336');
        setSnackbarVisible(true);
    };

    const handleOtpChange = (value: string) => {
        setOtp(value);
        setIsVerifyActive(value.length === 4);
    };

    const sendOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/send-otp`, { 
                mobile: phoneNumber 
            });
            setSessionId(response.data.details.Details); // Store the session ID
            showSnackbar(response.data.message, 'success');
        } catch (error) {
            showSnackbar("Failed to send OTP. Please try again.", 'error');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!matriId) {
            showSnackbar("Matri ID not found. Please restart registration.", 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
                mobile: phoneNumber,
                otp,
                matri_id: matriId,
                session_id: sessionId
            });
            showSnackbar(response.data.message, 'success');
            setTimeout(() => props.navigation.navigate('Screen6'), 2000);
        } catch (error) {
            showSnackbar("Invalid OTP. Please try again.", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestPin = () => {
        setTimer(30);
        setIsTimerActive(true);
        setOtp('');
        setIsVerifyActive(false);
        setIsRequestPinActive(false);
        sendOtp();
    };

    useEffect(() => {
        sendOtp();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.containergrey}>
                <View style={{ backgroundColor: 'white', paddingBottom: hp('2%') }}>
                    {/* Header */}
                    <View style={{
                        backgroundColor: '#FF7E00',
                        paddingVertical: hp('1.5%'),
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                            <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle3} />
                        </TouchableOpacity>
                        <Text style={styles2.textverify}>Verify Mobile Number</Text>
                    </View>

                    {/* Content */}
                    <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <Image source={mobile?.Icon26} style={styles2.mobileicon1} />
                        <Text style={styles2.textnumber}>All Deaf Matrimonial profiles are 100% Verified</Text>
                        <Text style={styles2.smalltextnumber}>You will receive an SMS with verification PIN to</Text>
                        <Text style={styles2.textnumber}>{`${countryCode} ${phoneNumber}`}</Text>
                    </View>

                    {warning && (
                        <Text style={{
                            color: 'red',
                            fontSize: wp('3.5%'),
                            marginBottom: hp('1%'),
                            textAlign: 'center'
                        }}>
                            {warning}
                        </Text>
                    )}

                    {/* OTP Input */}
                    <View style={[styles1.viewtextinputnumber, styles1.inputContainer]}>
                        <TextInput
                            style={styles1.textInput}
                            placeholder="Enter OTP"
                            placeholderTextColor="#888"
                            keyboardType="number-pad"
                            maxLength={4}
                            value={otp}
                            onChangeText={handleOtpChange}
                        />
                    </View>

                    {/* Timer/Resend */}
                    {isTimerActive ? (
                        <Text style={{ textAlign: 'center', color: '#888', marginTop: hp('1.5%') }}>
                            Resend OTP in {timer}s
                        </Text>
                    ) : (
                        <Text style={{
                            textAlign: 'center',
                            color: '#FF7E00',
                            marginTop: hp('1.5%'),
                            fontFamily: 'Lexend-Regular'
                        }}>
                            Didn't receive OTP? Request PIN again.
                        </Text>
                    )}

                    {/* Buttons */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: hp('2.5%') }}>
                        <TouchableOpacity
                            style={[styles.cprofile1, { backgroundColor: isRequestPinActive ? '#FF7E00' : '#ccc' }]}
                            onPress={handleRequestPin}
                            disabled={!isRequestPinActive}
                        >
                            <Text style={styles.modalText11}>Request PIN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.cprofile1, { backgroundColor: isVerifyActive ? '#FF7E00' : '#ccc' }]}
                            onPress={verifyOtp}
                            disabled={!isVerifyActive}
                        >
                            <Text style={styles.modalText11}>Verify</Text>
                        </TouchableOpacity>
                    </View>

                    {loading && <ActivityIndicator size="large" color="#FF7E00" style={{ marginTop: hp('2%') }} />}
                </View>

                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={2000}
                    style={{ backgroundColor: snackbarColor }}
                    action={{ label: 'OK', textColor: 'white', onPress: () => setSnackbarVisible(false) }}
                >
                    <Text style={{ color: 'white', fontFamily: 'Lexend-Regular' }}>{snackbarMessage}</Text>
                </Snackbar>
            </View>
        </SafeAreaView>
    );
};

export default Screen14;