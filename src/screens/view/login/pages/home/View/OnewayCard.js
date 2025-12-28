import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Modal,
    ActivityIndicator, Dimensions, Platform, Alert
} from 'react-native';
import { cross } from '../../../../../../utils/constants/icons/icon';
import { getAgeFromBirthdate } from '../../../../../../utils/constants/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { useNavigation } from '@react-navigation/native';
import Modalconnect from '../../../../../../styles/modal/modalconnect';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { user1 } from '../../../../../../utils/constants/images/image';
import verificationstyles from '../../../../../../styles/verification/verificationstyles';

const { width, height } = Dimensions.get('screen');
const isSmallScreen = width < 375;
const API_BASE_URL = 'http://82.29.161.246:8002';

const ProfileCard = ({ profile, onButtonPress }) => {
    const navigation = useNavigation();
    const age = getAgeFromBirthdate(profile.birthdate);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [buttonText, setButtonText] = useState('Connect Now');
    const [isLoading, setIsLoading] = useState(false);
    const [reminderSent, setReminderSent] = useState(false);

    const options = [
        'I am interested in your profile. Please Accept if you are interested.',
        'You are the kind of person we have been looking for. Please respond to proceed further.',
        'We liked your profile and interested to take it forward. Please reply at the earliest.',
        'You seem to be the kind of person who suits our family. We would like to contact your parents to proceed further.',
        "Your profile matches my sister's/brother's profile. Please 'Accept' if you are interested.",
        "Our child's profile seems to match. Please reply to proceed further.",
        'We find a good life partner in you for our friend. Please reply to proceed further.',
    ];

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toLocaleString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    };

    const sendInterest = async () => {
        if (selectedOption === null) {
            Alert.alert('Info', 'Please select an option before proceeding!');
            return;
        }

        setIsLoading(true);

        try {
            const authToken = await AsyncStorage.getItem('auth_token');
            const requestBody = JSON.stringify({
                message: options[selectedOption],
                screen: 'interest',
            });

            const response = await fetch(`${API_BASE_URL}/api/send-interest/${profile.matri_id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            const text = await response.text();
            let responseData;
            try {
                responseData = JSON.parse(text);
            } catch (jsonError) {
                console.error('❌ JSON Parse Error:', jsonError);
                Snackbar.show({
                    text: 'Server returned an invalid response!',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'red',
                });
                return;
            }

            if (response.ok) {
                setModalVisible(false);
                setButtonText('🔔 Send Reminder');
                await AsyncStorage.setItem(`interest_sent_${profile.id}_${authToken}`, 'true');
                Snackbar.show({
                    text: 'Interest sent successfully!',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'green',
                    textColor: 'white',
                    fontFamily: 'Lexend-Medium',
                    duration: 5000,
                });
            } else {
                Snackbar.show({
                    text: responseData?.message || 'Failed to send interest',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'red',
                    fontFamily: 'Lexend-Medium',
                });
            }
        } catch (error) {
            console.error('❌ Fetch Error:', error);
            Snackbar.show({
                text: 'Something went wrong!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                fontFamily: 'Lexend-Medium',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const sendReminder = async () => {
        if (reminderSent) return;

        setIsLoading(true);

        try {
            const authToken = await AsyncStorage.getItem('auth_token');

            const response = await fetch(`${API_BASE_URL}/api/send-reminder/${profile.matri_id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ screen: 'interest' })

            });

            const text = await response.text();
            let responseData;
            try {
                responseData = JSON.parse(text);
            } catch {
                Snackbar.show({
                    text: 'Server returned an invalid response!',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'red',
                    fontFamily: 'Lexend-Medium',
                });
                return;
            }

            if (response.ok) {
                await AsyncStorage.setItem(`reminder_sent_${profile.id}_${authToken}`, 'true');
                setReminderSent(true);
                setButtonText('⏳ Reminder Sent');
                Snackbar.show({
                    text: 'Reminder sent successfully!',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'blue',
                    fontFamily: 'Lexend-Medium',
                });
            } else {
                Snackbar.show({
                    text: responseData?.message || 'Failed to send reminder',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'red',
                    fontFamily: 'Lexend-Medium',
                });
            }
        } catch (error) {
            Snackbar.show({
                text: 'Something went wrong!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                fontFamily: 'Lexend-Medium',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkInterestAndReminderStatus = async () => {
            try {
                if (profile?.interest && profile?.reminder_received) {
                    setButtonText('⏳ Reminder Sent');
                    setReminderSent(true);
                } else if (profile?.interest) {
                    setButtonText('🔔 Send Reminder');
                } else {
                    setButtonText('❤️ Send Interest');
                }
            } catch (error) {
                console.error('❌ Error checking interest/reminder status:', error);
            }
        };

        checkInterestAndReminderStatus();
    }, [profile?.interest, profile?.reminder_received]);

    const handleProfileView = async () => {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            if (!token) {
                Snackbar.show({
                    text: 'Authentication error. Please log in again.',
                    backgroundColor: 'red',
                });
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/visit-profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ viewed_id: profile.matri_id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error storing profile view:', errorData);
                Snackbar.show({
                    text: errorData.message || 'Failed to record view.',
                    backgroundColor: 'red'
                });
                return;
            }

            navigation.navigate('Screen68', {
                matriId: profile.matri_id,
                profileData: profile
            });

        } catch (error) {
            console.error('API error:', error);
            Snackbar.show({
                text: 'Network error. Please try again.',
                backgroundColor: 'red'
            });
        }
    };

    const handlePress = () => {
        if (buttonText === 'Connect Now') {
            setButtonText('❤️ Send Interest');
        } else if (buttonText === '❤️ Send Interest') {
            setModalVisible(true);
        } else {
            sendReminder();
        }
    };

    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity onPress={handleProfileView}>
                <Image
                    source={profile.image ? { uri: profile.image } : user1?.IMG34}
                    style={verificationstyles.matchesimage}
                    defaultSource={user1?.IMG34} // For iOS
                    onError={() => { }} // You can add error handling here if needed
                />

                <View style={styles.profileDetails}>
                    <Text style={styles.profileAge}>Matri Id {profile.matri_id || 'Unknown'}</Text>
                    {/* <Text style={styles.profileName}>{profile.name || 'Unknown'}</Text> */}
                    <Text style={styles.profileAge}>{age} year</Text>
                    <Text style={styles.profileInfo}>{profile.height || 'N/A'} ft, {profile.language || 'N/A'}</Text>
                    <Text style={styles.profileInfo}>{profile.caste_data || 'N/A'},{profile.city || 'N/A'}</Text>

                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.connectButton} onPress={handlePress}>
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={Modalconnect.modalOverlay4}>
                        <View style={Modalconnect.modalContent4}>
                            <TouchableOpacity
                                style={Modalconnect.crossButton4}
                                onPress={() => setModalVisible(false)}
                            >
                                <Image source={cross?.Icon28} style={Modalconnect.crossIcon4} />
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        profile.image
                                            ? { uri: profile.image }
                                            : user1?.IMG34 // 👈 fallback to local asset
                                    }
                                    style={Modalconnect.profileImage4}
                                    resizeMode="cover"
                                />

                                <Text style={Modalconnect.header4}>❤️ Express Interest</Text>
                            </View>
                            <FlatList
                                data={options}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        style={[
                                            Modalconnect.option4,
                                            selectedOption === index && Modalconnect.selectedOption4,
                                        ]}
                                        onPress={() => setSelectedOption(index)}
                                    >
                                        <Text style={Modalconnect.optionText4}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <Text style={Modalconnect.dateTime4}>Date – {getCurrentDateTime()}</Text>
                            <TouchableOpacity style={Modalconnect.sendButton4} onPress={sendInterest}>
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={Modalconnect.sendButtonText4}>Submit</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <TouchableOpacity
                    style={{ width: '100%' }}
                    onPress={handlePress}
                    disabled={reminderSent}
                >
                    <Text style={[styles.buttonText, reminderSent && styles.disabledText]}>
                        {buttonText}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        alignItems: 'center',
        marginBottom: hp('1.5%'),
        backgroundColor: '#FFFFFF',
        borderRadius: wp('5%'),
        shadowColor: '#FF7E00',
        shadowOffset: { width: 0, height: hp('0.25%') },
        shadowOpacity: 0.1,
        shadowRadius: wp('5%'),
        elevation: 5,
        borderWidth: 1,
        borderColor: 'green',
        paddingBottom: hp('0.7%'),
        paddingHorizontal: wp('1.5%'),
        margin: wp('2.5%'),
        paddingTop: hp('0.3%'),
        width: '100%',
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    profileImage: {
        width: '100%',
        aspectRatio: 0.7,
        borderRadius: wp('5%'),
        maxHeight: hp('35%'),
    },
    profileDetails: {
        position: 'absolute',
        top: '42%',
        paddingHorizontal: wp('1.2%'),
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // ✅ semi-transparent dark background
        borderRadius: 8, // for a smoother look
        width: '98%'


    },
    profileName: {
        fontSize: wp('3%'),
        fontFamily: 'Lexend-Medium',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: wp('2.5%'),
    },
    profileAge: {
        fontSize: wp('2.5%'),
        fontFamily: 'Lexend-Medium',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: wp('2.5%'),
    },
    profileInfo: {
        fontSize: wp('2.5%'),
        fontFamily: 'Lexend-Medium',
        color: 'white',
        marginTop: hp('0.5%'),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: wp('2.5%'),
    },
    connectButton: {
        backgroundColor: 'white',
        borderRadius: wp('5%'),
        borderWidth: 1,
        borderColor: '#FF7E00',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.6%'),
        marginTop: hp('1.2%'),
    },
    buttonText: {
        color: '#FF7E00',
        fontSize: wp('3.2%'),
        fontFamily: 'Lexend-Medium',
    },
    disabledText: {
        color: '#808080',
    },
});

export default ProfileCard;