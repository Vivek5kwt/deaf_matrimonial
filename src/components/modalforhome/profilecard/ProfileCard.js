import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, Alert, ActivityIndicator
} from 'react-native';
import verificationstyles from '../../../styles/verification/verificationstyles';
import Modalconnect from '../../../styles/modal/modalconnect';
import { cross, user } from '../../../utils/constants/icons/icon';
import { getAgeFromBirthdate } from '../../../utils/constants/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { useNavigation } from '@react-navigation/native';
import { user1 } from '../../../utils/constants/images/image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/100';
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
                body: JSON.stringify({ viewed_member_id: profile.matri_id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error storing profile view:', errorData);
                Snackbar.show({
                    text: errorData.message || 'Failed to record view.',
                    backgroundColor: 'red'
                });
                return; // Don't navigate if API fails
            }

            console.log('Profile view recorded successfully');

            // Only navigate if API call succeeds
            navigation.navigate('Screen68', {
                matriId: profile.matri_id,
                // You might want to pass the entire profile if needed
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

            const response = await fetch(`http://82.29.161.246:8002/api/send-interest/${profile.matri_id}`, {
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
                    duration: 2000,
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
                    duration: 5000, // 4 seconds
                    backgroundColor: 'green',
                    textColor: 'white',
                    fontFamily: 'Lexend-Medium',
                });
            } else {
                Snackbar.show({
                    text: responseData?.message || 'Failed to send interest',
                    duration: 4000,
                    backgroundColor: 'red',
                    fontFamily: 'Lexend-Medium',
                });
            }
        } catch (error) {
            console.error('❌ Fetch Error:', error);
            Snackbar.show({
                text: 'Something went wrong!',
                duration: 4000,
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

            const response = await fetch(`http://82.29.161.246:8002/api/send-reminder/${profile.matri_id}`, {
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
                <Text style={styles.profileTextWithShadow}>Matri Id {profile.matri_id || 'Unknown'}</Text>

                    {/* <Text style={styles.profileTextWithShadow}>{profile.name || 'Unknown'}</Text> */}
                    <Text style={styles.profileTextWithShadow}>{age} year</Text>
                    <Text style={styles.profileTextWithShadow}>
                        {profile.height || 'N/A'} ft, {profile.language || 'N/A'}
                    </Text>
                    <Text style={styles.profileTextWithShadow}>{profile.caste_data || 'N/A'}</Text>
                    <Text style={styles.profileTextWithShadow}>{profile.city || 'N/A'}</Text>
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
                                    source={{ uri: profile.image || DEFAULT_PROFILE_IMAGE }}
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
                    style={[]}
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
        marginHorizontal: wp('2%'),
        alignItems: 'center',
      },
      connectButton: {
        backgroundColor: 'white',
        paddingVertical: hp('0.5%'),
        paddingHorizontal: wp('3%'),
        borderRadius: wp('5%'),
        marginTop: hp('1.2%'),
        borderWidth: 1,
        borderColor: '#FF7E00',
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        color: '#FF7E00',
        fontSize: wp('3.5%'),
        fontFamily: 'Lexend-Medium',
      },
      disabledButton: {
        borderColor: '#A9A9A9',
      },
      disabledText: {
        color: '#808080',
      },
      profileDetails: {
        position: 'absolute',
        top: '40%',
        paddingHorizontal: wp('1.2%'),
        paddingVertical: hp('1%'), // optional for spacing
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // ✅ semi-transparent dark background
        borderRadius: 8, // for a smoother look
        width:"98.5%"
      },
      profileTextWithShadow: {
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: wp('0.5%'),
        fontFamily: 'Lexend-Medium',
        fontSize: wp('2.6%'),
      },
});

export default ProfileCard;