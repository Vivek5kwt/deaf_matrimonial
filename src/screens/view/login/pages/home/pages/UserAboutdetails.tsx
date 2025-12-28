import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Easing, Image, Animated, Modal, ActivityIndicator, TouchableOpacity, TextInput, TouchableWithoutFeedback, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { arrow } from '../../../../../../utils/constants/icons/icon';
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { user1 } from '../../../../../../utils/constants/images/image';
import { BackHandler } from 'react-native';


const API_BASE_URL = 'http://82.29.161.246:8002';

const WEB_IMAGE_BASE_URL = 'http://82.29.161.246:8001/my_photos';

const getProfileImageUrl = (photo1: string): string => {
    if (!photo1) return 'https://via.placeholder.com/100';

    // Web user image: just the filename
    if (!photo1.includes('/') && photo1.endsWith('.jpg')) {
        return `${WEB_IMAGE_BASE_URL}/${photo1}`;
    }

    // App user image: relative path
    return `${API_BASE_URL}/${photo1}`;
};

const Screen68 = ({ route, navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    const { matriId } = route.params;
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matchData, setMatchData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isShortlisted, setIsShortlisted] = useState(false);
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [extraDetailsModalVisible, setExtraDetailsModalVisible] = useState(false);
    const [extraDetails, setExtraDetails] = useState(null);
    const [loadingExtraDetails, setLoadingExtraDetails] = useState(false);
    const [membershipModalVisible, setMembershipModalVisible] = useState(false);
    const [membershipMessage, setMembershipMessage] = useState('');

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();

        Animated.timing(translateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    }, []);

    const formatWeight = (value) => {
        if (!value) return 'N/A';

        // Check if it's a number (but not a string like "65 kg")
        const num = parseFloat(value);
        const isNumeric = !isNaN(num) && /^\d+(\.\d+)?$/.test(value.trim());

        return isNumeric ? `${num} KG` : value;
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('auth_token');
                if (!token) throw new Error('No auth token found');

                const response = await fetch(`http://82.29.161.246:8002/api/user/${matriId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.status === 403) {
                    const data = await response.json();
                    setMembershipMessage(data.message || 'Please purchase a membership plan to view this profile.');
                    setMembershipModalVisible(true);
                    setLoading(false);
                    return;
                }

                if (!response.ok) throw new Error(`API Error: ${await response.text()}`);

                const data = await response.json();
                if (data.user) {
                    setUserDetails(data.user);
                    setIsBlocked(data.user.is_blocked || false);
                    setIsShortlisted(data.user.is_favorited || false);
                    fetchMatchData(data.user.index_id, token);
                } else {
                    throw new Error('User data not found');
                }
            } catch (error) {
                if (error.message.includes('membership')) {
                    setMembershipMessage(error.message);
                    setMembershipModalVisible(true);
                } else {
                    Snackbar.show({
                        text: 'Failed to fetch user details.',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: 'red',
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchMatchData = async (index_id, token) => {
            try {
                const response = await fetch(`http://82.29.161.246:8002/api/match-profile/${index_id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch match data');
                }

                const data = await response.json();
                setMatchData(data);
            } catch (error) {
                console.error('Error fetching match data:', error);
            }
        };

        fetchUserDetails();
    }, [matriId]);

    const handleSendMessage = async () => {
        const trimmedMessage = messageText.trim();

        if (!trimmedMessage) {
            Snackbar.show({
                text: 'Please enter a message.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                textColor: 'white',
                fontFamily: 'Lexend-Medium',
            });
            return;
        }

        try {
            setSendingMessage(true);

            const token = await AsyncStorage.getItem('auth_token');
            if (!token) throw new Error('Authentication token not found');

            const receiverMatriId = userDetails?.matri_id;
            if (!receiverMatriId) throw new Error('User matrimony ID not available');

            const formData = new FormData();
            formData.append('to_id', receiverMatriId); // ✅ Now using matri_id
            formData.append('message', trimmedMessage);
            formData.append('screen', 'inbox');

            const response = await fetch(`http://82.29.161.246:8002/api/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // No need to set Content-Type for FormData
                },
                body: formData,
            });

            const contentType = response.headers.get('Content-Type');
            let responseData;

            if (contentType?.includes('application/json')) {
                responseData = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                throw new Error('Server returned unexpected response format');
            }

            if (!response.ok) {
                if (response.status === 403 && responseData.message?.includes('membership')) {
                    setMessageModalVisible(false);
                    setMembershipMessage(responseData.message);
                    setMembershipModalVisible(true);
                    return;
                }
                throw new Error(responseData?.message || 'Failed to send message');
            }

            // Reset input and show success
            setMessageModalVisible(false);
            setMessageText('');

            setTimeout(() => {
                Snackbar.show({
                    text: 'Message sent successfully!',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'green',
                    textColor: 'white',
                    fontFamily: 'Lexend-Medium',
                });
            }, 300);

        } catch (error) {
            Snackbar.show({
                text: error.message || 'Failed to send message.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                textColor: 'white',
                fontFamily: 'Lexend-Medium',
            });
        } finally {
            setSendingMessage(false);
        }
    };


    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Screen26');
            return true; // This prevents default back behavior
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove(); // Cleanup on unmount
    }, [navigation]);

    const fetchExtraDetails = async () => {
        try {
            setLoadingExtraDetails(true);
            const token = await AsyncStorage.getItem('auth_token');
            if (!token) throw new Error('No auth token found');

            const index_id = userDetails?.index_id;
            if (!index_id) throw new Error('Index ID not available');

            // First store the view
            const storeViewResponse = await fetch(`http://82.29.161.246:8002/api/storeMobileViews`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ viewed_id: index_id }),
            });

            if (storeViewResponse.status === 403) {
                const data = await storeViewResponse.json();
                setMembershipMessage(data.message || 'You need an active membership to view contact details.');
                setMembershipModalVisible(true);
                return;
            }

            if (!storeViewResponse.ok) {
                throw new Error('Failed to store view');
            }

            // Then fetch contact details
            const contactResponse = await fetch(`http://82.29.161.246:8002/api/viewContactDetails/${index_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!contactResponse.ok) {
                throw new Error('Failed to fetch contact details');
            }

            const contactData = await contactResponse.json();

            // Make sure the data is properly formatted
            if (!contactData.matri_id) {
                throw new Error('Invalid contact details received');
            }

            setExtraDetails(contactData);
            setExtraDetailsModalVisible(true);

        } catch (error) {
            console.error('Error in fetchExtraDetails:', error);
            Snackbar.show({
                text: error.message || 'Failed to fetch contact details',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
            });
        } finally {
            setLoadingExtraDetails(false);
        }
    };

    const handleBlockToggle = async () => {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            if (!token) {
                throw new Error('No auth token found');
            }

            const url = isBlocked
                ? `http://82.29.161.246:8002/api/block/${matriId}`
                : `http://82.29.161.246:8002/api/block/${matriId}`;

            const method = isBlocked ? 'DELETE' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update block status');
            }

            setIsBlocked(!isBlocked);
            Snackbar.show({
                text: isBlocked ? 'User unblocked successfully!' : 'User blocked successfully!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: isBlocked ? 'green' : 'red',
                fontFamily: 'Lexend-Medium'
            });
        } catch (error) {
            Snackbar.show({
                text: 'Failed to update block status.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                fontFamily: 'Lexend-Medium'
            });
        }
    };

    const handleShortlist = async () => {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            if (!token) {
                throw new Error('No auth token found');
            }

            const url = `http://82.29.161.246:8002/api/favorites/${matriId}`;
            const method = isShortlisted ? 'DELETE' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update shortlist status');
            }

            setIsShortlisted(!isShortlisted);
            Snackbar.show({
                text: isShortlisted ? 'Removed from shortlist!' : 'User added to shortlist!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: isShortlisted ? 'red' : 'green',
            });
        } catch (error) {
            Snackbar.show({
                text: 'Failed to update shortlist status.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
            });
        }
    };


    const handleBuyMembership = () => {
        setMembershipModalVisible(false);
        navigation.navigate('Screen51');
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FF7E00" />
                <Text style={styles.loaderText}>Loading user details...</Text>
            </View>
        );
    }

    if (!userDetails && membershipModalVisible) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={arrow?.Icon5} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>User Profile Details</Text>
                </View>

                <View style={styles.membershipPrompt}>
                    <View style={styles.membershipButtonContainer}>
                        <LottieView
                            source={require('../../../../../../assets/animations/mm.json')}
                            autoPlay
                            loop
                            style={styles.lottieAnimation}
                        />


                    </View>

                    <Text style={styles.membershipPromptText}>
                        Membership required to view this profile
                    </Text>

                    {/* 👉 Membership Benefits with Fade-in */}
                    <Animated.View
                        style={[
                            styles.benefitsContainer,
                            { opacity: fadeAnim, transform: [{ translateY }] },
                        ]}
                    >
                        <Text style={styles.benefitItem}>✓ Unlock Full Profile Access</Text>
                        <Text style={styles.benefitItem}>✓ See Contact Deatils</Text>
                        <Text style={styles.benefitItem}>✓ Priority Support</Text>
                        <Text style={styles.benefitItem}>✓ Messaging</Text>
                    </Animated.View>
                    <Text style={styles.membershipPromptText}>
                        Tap the Button to know more
                    </Text>
                    <TouchableOpacity
                        style={styles.membershipButton}
                        onPress={handleBuyMembership}
                    >
                        <Text style={styles.membershipButtonText}>BUY MEMBERSHIP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    if (!userDetails && !loading) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={styles.errorText}>No user details found.</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Screen26')}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderDetail = (label, value, isMatched) => {
        return (
            <>
                <View style={{}}>
                    <Text style={styles.detailText}>
                        {label}: <Text style={styles.greenText}>{value || 'N/A'}</Text>
                    </Text>
                    {isMatched && <Text style={styles.checkIcon}>✅</Text>}
                </View>
                <View style={styles.separator} />
            </>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={arrow?.Icon5} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>User Profile Details</Text>
            </View>

            <View style={{ padding: 15 }}>
                <View style={styles.profileCard}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image
                            source={
                                getProfileImageUrl(userDetails?.photo1)
                                    ? { uri: getProfileImageUrl(userDetails?.photo1) }
                                    : user1?.IMG34
                            }
                            style={styles.profileImage}
                            defaultSource={user1?.IMG34} // iOS ke liye fallback image
                            onError={() => {
                                // Optional: image load fail hone par kuch karna ho to
                            }}
                        />

                    </TouchableOpacity>
                    {/* <Text style={styles.name}>{userDetails.matri_id || 'N/A'} {userDetails.matri_id || 'N/A'}</Text> */}
                    <Text style={styles.detailText}>Matri ID: {userDetails.matri_id || 'N/A'}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={fetchExtraDetails}>
                        <Text style={styles.buttonText}>📞 View Contact Details</Text>
                    </TouchableOpacity>
                    <Modal visible={extraDetailsModalVisible} transparent={true} animationType="slide">
                        <TouchableWithoutFeedback onPress={() => setExtraDetailsModalVisible(false)}>
                            <View style={styles.modalContainer2}>
                                <View style={styles.modalContent2}>
                                    <Text style={styles.modalHeader2}>User Additional Details</Text>

                                    {loadingExtraDetails ? (
                                        <ActivityIndicator size="large" color="#FF7E00" />
                                    ) : (
                                        extraDetails ? (
                                            <>

                                                <Image
                                                    source={
                                                        getProfileImageUrl(userDetails?.photo1)
                                                            ? { uri: getProfileImageUrl(userDetails?.photo1) }
                                                            : user1?.IMG34
                                                    }
                                                    style={styles.profileImage}
                                                    defaultSource={user1?.IMG34} // For iOS
                                                    onError={() => { }} // You can add error handling here if needed
                                                />
                                                <Text style={styles.detailText2}>
                                                    Matri ID: <Text style={styles.valueText}>{extraDetails.matri_id || 'N/A'}</Text>
                                                </Text>
                                                {/* <Text style={styles.detailText2}>
                                                    Name: <Text style={styles.valueText}>
                                                        {extraDetails?.firstname || 'N/A'} {extraDetails?.lastname || ''}
                                                    </Text>
                                                </Text> */}
                                                <Text style={styles.detailText2}>
                                                    Caste: <Text style={styles.valueText}>{extraDetails.caste || 'N/A'}</Text>
                                                </Text>
                                                <Text style={styles.detailText2}>
                                                    Country: <Text style={styles.valueText}>{extraDetails.country || 'N/A'}</Text>
                                                </Text>
                                                <Text style={styles.detailText2}>
                                                    State: <Text style={styles.valueText}>{extraDetails.state || 'N/A'}</Text>
                                                </Text>
                                                <Text style={styles.detailText2}>
                                                    City: <Text style={styles.valueText}>{extraDetails.city || 'N/A'}</Text>
                                                </Text>
                                                <Text style={styles.detailText2}>
                                                    Mobile No: <Text style={styles.valueText}>{extraDetails.mobile_no || 'N/A'}</Text>
                                                </Text>
                                                <Text style={styles.detailText2}>
                                                    Parent's Mobile No: <Text style={styles.valueText}>{extraDetails?.parent_mobile || 'N/A'}</Text>
                                                </Text>
                                                <Text style={styles.detailText2}>
                                                    Date of Birth: <Text style={styles.valueText}>{extraDetails.dob || 'N/A'}</Text>
                                                </Text>

                                                <Text style={styles.detailText2}>
                                                    Email: <Text style={styles.valueText}>{extraDetails.email || 'N/A'}</Text>
                                                </Text>

                                            </>
                                        ) : (
                                            <Text style={styles.errorText2}>No additional details available.</Text>
                                        )
                                    )}

                                    <TouchableOpacity style={styles.closeButton2} onPress={() => setExtraDetailsModalVisible(false)}>
                                        <Text style={styles.closeButtonText2}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    <TouchableOpacity
                        style={[styles.button, isShortlisted ? styles.shortlistedButton : null]}
                        onPress={handleShortlist}
                        disabled={isShortlisted}
                    >
                        <Text style={styles.buttonText}>
                            {isShortlisted ? '📌 Shortlisted' : '📌 Add to Shortlist'}
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.button} onPress={() => setMessageModalVisible(true)}>
                        <Text style={styles.buttonText}>✉️ Send Personal Message</Text>
                    </TouchableOpacity>

                    {/* Message Modal */}
                    <Modal visible={messageModalVisible} transparent={true} animationType="slide">
                        <TouchableWithoutFeedback onPress={() => setMessageModalVisible(false)}>
                            <View style={styles.modalContainer1}>
                                <View style={styles.messageModalContent1}>
                                    {/* <Text style={styles.modalHeader1}>Send a Message to {userDetails.firstname}</Text> */}
                                    <TextInput
                                        style={styles.messageInput1}
                                        placeholder="Type your message..."
                                        multiline
                                        value={messageText}
                                        onChangeText={setMessageText}
                                        placeholderTextColor="#6c757d"

                                    />
                                    {sendingMessage ? (
                                        <ActivityIndicator size="large" color="#FF7E00" />
                                    ) : (
                                        <TouchableOpacity style={styles.sendButton1} onPress={handleSendMessage}>
                                            <Text style={styles.sendButtonText1}>Send Message</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity style={styles.cancelButton1} onPress={() => setMessageModalVisible(false)}>
                                        <Text style={styles.cancelButtonText1}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    <TouchableOpacity
                        style={[styles.button, isBlocked ? styles.button : styles.blockButton]}
                        onPress={handleBlockToggle}
                    >
                        <Text style={styles.buttonText}>
                            {isBlocked ? '✅ Unblock User' : '🚫 Block User'}
                        </Text>
                    </TouchableOpacity>

                </View>
                <Modal visible={modalVisible} transparent={true} animationType="fade">
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <Image
                                source={
                                    getProfileImageUrl(userDetails?.photo1)
                                        ? { uri: getProfileImageUrl(userDetails?.photo1) }
                                        : user1?.IMG34
                                }
                                style={styles.fullScreenImage}
                            />

                            <View style={styles.bannerContainer}>
                                <Text style={styles.bannerText}>Deaf Matrimonial user's profile Picture</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <View style={styles.card}>
                    <Text style={styles.sectionHeader}>Personal Info</Text>

                    {renderDetail("Marital Status", userDetails.m_status)}
                    {renderDetail("Gender", userDetails.gender)}
                    {renderDetail("Children Living Status", userDetails.status_children)}
                    {renderDetail("Profile Created By", userDetails.profileby)}
                    {renderDetail("Mother Tongue", userDetails?.mother_tongue_data?.mtongue_name || "N/A")}
                </View>

                <View style={styles.aboutMeCard}>
                    <Text style={styles.sectionHeader}>About Me</Text>
                    <Text style={styles.aboutMeText}>{userDetails.profile_text || 'N/A'}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionHeader}>Physical Attributes</Text>

                    {renderDetail("Height", userDetails?.height_data?.height)}
                    {renderDetail("Weight", formatWeight(userDetails.weight))}
                    {renderDetail("Complexion", userDetails.complexion)}
                    {renderDetail("Physical Status", userDetails.physicalStatus)}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionHeader}>Education & Career</Text>

                    {renderDetail("Education", userDetails?.education?.edu_name)}
                    {renderDetail("Occupation", userDetails.occupation_data?.ocp_name)}
                    {renderDetail("Income", userDetails.income)}
                    {renderDetail("Employer", userDetails.emp_in)}
                </View>


                {matchData && (
                    <View style={styles.matchSection}>
                        <Text style={styles.matchTitle}>
                            🔍 You and {userDetails.matri_id}'s Match
                        </Text>
                        <Text style={styles.matchText}>
                            Your profile matches with {matchData.matched_count} / {matchData.total_preferences} of {userDetails.matri_id}'s preferences! ✅
                        </Text>
                    </View>
                )}
                <View style={styles.card}>
                    <Text style={styles.sectionHeader}>Partner Preferences</Text>

                    {renderDetail("Marital Status", userDetails.part_marital_status, matchData?.matches?.m_status)}
                    {renderDetail("Has Children", userDetails.part_have_child)}
                    {renderDetail("Income",
                        userDetails?.part_income?.map(item => item.name).join(", ") || "N/A",
                        matchData?.matches?.part_income
                    )}
                    {renderDetail("Height",
                        `${userDetails?.part_height?.[0]?.name || 'N/A'} to ${userDetails?.part_height_to?.[0]?.name || 'N/A'}`,
                        matchData?.matches?.height
                    )}
                    {renderDetail("Mother Tongue",
                        userDetails?.part_mtongue?.[0]?.name ||
                        userDetails?.mother_tongue_data?.mtongue_name ||
                        "N/A"
                    )}
                    {renderDetail("Religion",
                        userDetails?.part_religion_names?.[0]?.name ||
                        userDetails?.religion_data?.religion_name ||
                        "N/A"
                    )}
                    {renderDetail("Caste",
                        userDetails?.part_caste?.map(item => item.name).join(", ") ||
                        userDetails?.caste_data?.caste_name ||
                        "N/A"
                    )}
                    {renderDetail("Education",
                        userDetails?.part_edu?.map(item => item.name).join(", ") ||
                        "N/A",
                        matchData?.matches?.part_edu
                    )}
                    {renderDetail("Occupation",
                        userDetails?.part_occu?.map(item => item.name).join(", ") ||
                        "N/A",
                        matchData?.matches?.part_occu
                    )}
                    {renderDetail("State",
                        userDetails?.part_state?.map(item => item.name).join(", ") ||
                        userDetails?.state?.state_name ||
                        matchData?.matches?.state?.state_name ||
                        "N/A"
                    )}
                    {renderDetail("Smoking Habit", userDetails.part_smoke, matchData?.matches?.smoke)}
                    {renderDetail("Dietary Preference", userDetails.part_diet, matchData?.matches?.diet)}
                    {renderDetail("Drinking Habit", userDetails.part_drink, matchData?.matches?.drink)}
                    {renderDetail("Physical Condition", userDetails.part_physical, matchData?.matches?.physicalStatus)}
                </View>
                <View style={styles.aboutMeCard}>
                    <Text style={styles.sectionHeader}>Partner Expectation</Text>
                    <Text style={styles.aboutMeText}>{userDetails.part_expect || 'N/A'}</Text>
                </View>

            </View>
            <Modal visible={membershipModalVisible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setMembershipModalVisible(false)}>
                    <View style={styles.membershipModalContainer}>
                        <View style={styles.membershipModalContent}>
                            <Text style={styles.membershipModalHeader}>Membership Required</Text>
                            <Text style={styles.membershipModalText}>{membershipMessage}</Text>
                            <View style={styles.membershipButtonContainer}>
                                <LottieView
                                    source={require('.././../../../../../assets/animations/mm.json')}
                                    autoPlay
                                    loop
                                    style={styles.lottieAnimation}
                                />
                                <TouchableOpacity
                                    style={styles.membershipButton}
                                    onPress={handleBuyMembership}
                                >
                                    <Text style={styles.membershipButtonText}>BUY MEMBERSHIP</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScrollView>
    );
};




const styles = StyleSheet.create({
    backButton: {
        marginTop: 20,
        backgroundColor: '#FF7E00',
        padding: 15,
        borderRadius: 10,
        width: '50%',
        alignSelf: 'center'
    },
    backButtonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Lexend-Medium'
    },
    benefitsContainer: {
        marginTop: 20,
        marginBottom: 20,

        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        width: "90%"
    },
    benefitItem: {
        fontSize: 16,
        color: '#333',
        marginVertical: 6,
        fontWeight: '600',
        fontFamily: 'Lexend-Medium',


    },

    membershipPrompt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp('4%'),

    },
    membershipPromptText: {
        fontSize: wp('4%'),
        color: '#FF7E00',
        textAlign: 'center',
        fontFamily: 'Lexend-Medium',
    },
    lottieAnimation: {
        width: wp('50%'),
        height: hp('25%'),
        alignSelf: 'center',
        marginTop: hp('-15%'),
    },
    membershipModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignContent: 'center'
    },
    membershipModalContent: {
        width: wp('80%'),
        backgroundColor: 'white',
        borderRadius: wp('2%'),
        padding: wp('5%'),
        alignItems: 'center',
    },
    membershipModalText: {
        fontSize: wp('4%'),
        textAlign: 'center',
        marginVertical: hp('1.5%'),
        fontFamily: 'Lexend-Medium',
    },
    membershipButton: {
        backgroundColor: '#FF7E00',
        padding: hp('1.5%'),
        borderRadius: wp('5%'),
        marginVertical: hp('0.8%'),
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
    },
    membershipButtonText: {
        color: 'white',
        fontFamily: 'Lexend-Medium',
        fontSize: wp('3.8%'),

    },
    closeMembershipButton: {
        backgroundColor: '#e0e0e0',
        padding: hp('1.5%'),
        borderRadius: wp('5%'),
        marginVertical: hp('0.8%'),
        width: '100%',
        alignItems: 'center',
    },
    closeMembershipButtonText: {
        color: '#333',
        fontFamily: 'Lexend-Medium',
        fontSize: wp('3.8%'),
    },
    membershipModalHeader: {
        fontSize: wp('4.5%'),
        marginBottom: hp('1%'),
        fontFamily: 'Lexend-Medium',
        color: '#FF7E00',
    },
    membershipButtonContainer: {
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F5F7',
    },
    header: {
        backgroundColor: '#FF7E00',
        paddingVertical: hp('2%'),
        alignItems: 'center',
        marginBottom: hp('2.5%'),
        borderBottomLeftRadius: wp('3%'),
        borderBottomRightRadius: wp('3%'),
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    headerText: {
        fontSize: wp('5.5%'),
        color: '#FFF',
        fontFamily: 'Lexend-Medium',
        marginRight: wp('14%'),
    },
    profileCard: {
        backgroundColor: '#FFF',
        padding: wp('5%'),
        borderRadius: wp('4%'),
        elevation: 5,
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    profileImage: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: wp('12.5%'),
        marginBottom: hp('1.5%'),
    },
    name: {
        fontSize: wp('5.5%'),
        fontFamily: 'Lexend-Medium',
        color: '#333',
    },
    sectionHeader: {
        fontSize: wp('4.5%'),
        color: '#FF7E00',
        marginBottom: hp('1%'),
        fontFamily: 'Lexend-Medium',
    },
    detailText: {
        fontSize: wp('4%'),
        color: '#555',
        marginBottom: hp('0.8%'),
        fontFamily: 'Lexend-Medium',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: hp('1%'),
    },
    aboutMeCard: {
        backgroundColor: '#FFF',
        padding: wp('4%'),
        borderRadius: wp('3%'),
        elevation: 3,
        marginBottom: hp('2%'),
    },
    aboutMeText: {
        fontSize: wp('4%'),
        color: '#555',
        fontFamily: 'Lexend-Medium',
    },
    card: {
        backgroundColor: '#FFF',
        padding: wp('4%'),
        borderRadius: wp('3%'),
        elevation: 3,
        marginBottom: hp('2%'),
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        fontSize: wp('4%'),
        color: '#555',
        fontFamily: 'Lexend-Medium',
    },
    errorText: {
        color: 'red',
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: wp('90%'),
        height: hp('70%'),
        resizeMode: 'contain',
    },
    icon: {
        height: hp('2.5%'),
        width: wp('7%'),
        tintColor: 'white',
    },
    bannerContainer: {
        position: 'absolute',
        top: '55%',
        left: '5%',
        transform: [{ translateX: -100 }, { translateY: -15 }],
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: hp('0.5%'),
        paddingHorizontal: wp('2%'),
        borderRadius: wp('3%'),
        width: wp('140%'),
    },
    bannerText: {
        color: '#FFF',
        fontSize: wp('1.5%'),
        textAlign: 'center',
        fontFamily: 'Lexend-Medium',
    },
    matchSection: {
        padding: wp('4%'),
        backgroundColor: 'white',
        borderRadius: wp('3%'),
        marginVertical: hp('2%'),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#64B5F6',
    },
    matchTitle: {
        fontSize: wp('4.5%'),
        fontFamily: 'Lexend-Medium',
        color: '#1E88E5',
        marginBottom: hp('0.5%'),
    },
    matchText: {
        fontSize: wp('4%'),
        color: '#333',
        fontFamily: 'Lexend-Medium',
    },
    greenText: {
        color: '#009900',
        fontFamily: 'Lexend-Medium',
        fontSize: wp('3.5%'),
    },
    checkIcon: {
        position: 'absolute',
        right: 0,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: hp('2.5%'),
    },
    button: {
        width: '48%',
        padding: hp('1.2%'),
        backgroundColor: '#FF7E00',
        borderRadius: wp('2%'),
        alignItems: 'center',
        marginBottom: hp('1%'),
    },
    blockButton: {
        backgroundColor: '#D32F2F',
    },
    buttonText: {
        color: '#fff',
        fontSize: wp('2.5%'),
        fontFamily: 'Lexend-Medium',
    },
    shortlistedButton: {
        backgroundColor: '#ccc',
        borderColor: '#999',
    },
    modalContainer1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    messageModalContent1: {
        backgroundColor: '#fff',
        padding: wp('5%'),
        borderRadius: wp('3%'),
        width: '90%',
    },
    modalHeader1: {
        fontSize: wp('4.5%'),
        marginBottom: hp('1.5%'),
        fontFamily: 'Lexend-Medium',
    },
    messageInput1: {
        height: hp('20%'),
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: wp('2%'),
        padding: wp('2.5%'),
        fontFamily: 'Lexend-Medium',
        color:"black"

    },
    sendButton1: {
        backgroundColor: '#FF7E00',
        padding: hp('2%'),
        borderRadius: wp('2%'),
        marginVertical: hp('1.5%'),
    },
    sendButtonText1: {
        color: '#fff',
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium',
    },
    valueText: {
        fontSize: wp('3%'),
        color: 'black',
        fontFamily: 'Lexend-Medium',
    },
    cancelButton1: {
        backgroundColor: '#ccc',
        padding: hp('2%'),
        borderRadius: wp('2%'),
    },
    cancelButtonText1: {
        color: '#000',
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium',
    },
    modalContainer2: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent2: {
        width: wp('90%'),
        backgroundColor: '#fff',
        borderRadius: wp('3%'),
        padding: wp('5%'),
        elevation: 10,
    },
    modalHeader2: {
        fontSize: wp('5%'),
        fontFamily: 'Lexend-Medium',
        marginBottom: hp('2%'),
        color: '#FF7E00',
    },
    detailText2: {
        fontSize: wp('4%'),
        marginBottom: hp('1%'),
        color: '#FF7E00',
        fontFamily: 'Lexend-Medium',
    },
    closeButton2: {
        marginTop: hp('2%'),
        backgroundColor: '#FF7E00',
        padding: hp('1%'),
        borderRadius: wp('2%'),
        width: wp('30%'),
        alignContent: "center",
        alignSelf: 'center'
    },
    closeButtonText2: {
        color: '#fff',
        textAlign: 'center',
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium',
    },
    errorText2: {
        color: 'red',
        fontSize: wp('4%'),
        textAlign: 'center',
    },


});

export default Screen68;
