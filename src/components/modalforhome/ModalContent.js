import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Image,
    TouchableWithoutFeedback,
    TextInput,
    Animated,
    Alert,
    ActivityIndicator,
    Platform,
    FlatList
} from 'react-native';
import verificationstyles from '../../styles/verification/verificationstyles';
import styles3 from '../../styles/modal/modal';
import {
    backr, pencil, cross, copymodal, modal1, modal3, modal4, modal5, modal6, modal7, modal8, modal9, modal12, modal11, modal10, modal55, camera,
    gallery,
    heart1,
    modal13
} from '../../utils/constants/icons/icon';
import styles from '../../styles/onboadings/styles';
import { removeUserData } from '../../utils/constants/storage';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import { ToastAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getProfileImageUrl } from '../../utils/constants/imageUrl';

const SideMenuModal = ({
    isModal2Visible,
    closeModal2,
    userData = {},
    navigation,
    setUserData = () => { }
}) => {
    const slideAnim = useRef(new Animated.Value(-wp(75))).current;
    const [uploading, setUploading] = useState(false);
    const [showImagePickerModal, setShowImagePickerModal] = useState(false);
    const [modalAnim] = useState(new Animated.Value(0));
    const [showFullImageModal, setShowFullImageModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');

    const openFullImage = () => {
        setShowFullImageModal(true);
    };

    const closeFullImage = () => {
        setShowFullImageModal(false);
    };

    useEffect(() => {
        if (isModal2Visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isModal2Visible]);

    useEffect(() => {
        if (showImagePickerModal) {
            Animated.timing(modalAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(modalAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [showImagePickerModal]);

    const uploadWithRetry = async (url, formData, headers, retryCount = 2) => {
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            try {
                const response = await axios.post(url, formData, {
                    headers,
                    timeout: 30000,
                });
                return response;
            } catch (err) {
                console.warn(`Upload attempt ${attempt} failed`, err.message);

                if (attempt === retryCount) {
                    throw err;
                }

                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    };

    const handleImageUpdate = async (uri, type, fileName) => {
        const finalUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');

        if (!finalUri || typeof finalUri !== 'string') {
            Snackbar.show({
                text: 'Invalid image selected',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Lexend-Medium',
            });
            return;
        }

        setUploading(true);

        try {
            const authToken = await AsyncStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('User not authenticated');
            }

            const userId = Number(
                userData?.indexId ||
                userData?.index_id ||
                userData?.id ||
                (await AsyncStorage.getItem('user_id'))
            );

            if (!userId || isNaN(userId)) {
                throw new Error('User ID not found. Please re-login.');
            }

            const formData = new FormData();
            formData.append('photo1', {
                uri: finalUri,
                type: type || 'image/jpeg',
                name: fileName || `profile_${Date.now()}.jpg`,
            });

            const apiUrl = `http://82.29.161.246:8002/api/update/${userId}`;
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
            };

            const response = await uploadWithRetry(apiUrl, formData, headers, 2);

            if (response.data?.message === "user updated successfully") {
                Snackbar.show({
                    text: 'Profile image updated successfully!',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'green',
                    fontFamily: 'Lexend-Regular',
                });

                if (response.data.user?.photo1) {
                    const newProfilePicture = response.data.user.photo1;
                    const updatedUserData = {
                        ...userData,
                        profilePicture: newProfilePicture,
                        indexId: userId.toString(),
                    };

                    await AsyncStorage.setItem('user_data', JSON.stringify(updatedUserData));
                    await AsyncStorage.setItem('profile_picture', newProfilePicture);

                    if (setUserData) {
                        setUserData(updatedUserData);
                    }

                    return updatedUserData;
                }
            } else {
                throw new Error(response.data?.message || 'Image update failed');
            }
        } catch (error) {
            console.error('Image upload error:', error);

            Snackbar.show({
                text: error.message || 'Image upload failed',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                fontFamily: 'Lexend-Medium',
            });
        } finally {
            setUploading(false);
        }
    };

    const selectImage = () => {
        setShowImagePickerModal(true);
    };

    const handleCamera = async () => {
        try {
            setShowImagePickerModal(false);
            const response = await launchCamera({
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 800,
                maxHeight: 800,
                includeBase64: false,
                saveToPhotos: false,
            });

            if (response.didCancel) {
                console.log('User cancelled camera');
                return;
            }

            if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
                throw new Error(response.errorMessage || 'Camera error');
            }

            if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];

                setTimeout(async () => {
                    const updatedUser = await handleImageUpdate(
                        asset.uri,
                        asset.type,
                        asset.fileName
                    );
                    if (updatedUser) {
                        setUserData(updatedUser);
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Error handling camera:', error);
            Snackbar.show({
                text: error.message || 'Failed to take photo',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                fontFamily: 'Lexend-Medium',
            });
        }
    };

    const handleGallery = async () => {
        try {
            setShowImagePickerModal(false);
            const response = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 800,
                maxHeight: 800,
                includeBase64: false,
                selectionLimit: 1,
            });

            if (response.didCancel) {
                console.log('User cancelled image picker');
                return;
            }

            if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
                throw new Error(response.errorMessage || 'Image picker error');
            }

            if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                const updatedUser = await handleImageUpdate(
                    asset.uri,
                    asset.type,
                    asset.fileName
                );
                if (updatedUser) {
                    setUserData(updatedUser);
                }
            }
        } catch (error) {
            console.error('Error handling gallery:', error);
            Snackbar.show({
                text: error.message || 'Failed to select image',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                fontFamily: 'Lexend-Medium',
            });
        }
    };

    const copyMatriIdToClipboard = (matriId) => {
        Clipboard.setString(matriId);
        ToastAndroid.show('Matri ID copied!', ToastAndroid.SHORT);
    };

    const logoutUser = async () => {
        try {
            closeModal2();

            const authToken = await AsyncStorage.getItem('auth_token');
            console.log('🔹 Auth Token Found:', authToken);

            if (!authToken) {
                await removeUserData();
                Snackbar.show({
                    text: 'Already logged out! Ready to log back in anytime. 😎',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    fontFamily: 'Lexend-Medium',
                });
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Screen3' }],
                });
                return;
            }

            console.log('🔹 Sending logout request to backend...');
            const response = await fetch('http://82.29.161.246:8002/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });

            console.log('🔹 Logout Response Status:', response.status);
            const responseData = await response.json();
            console.log('🔹 Logout Response Data:', responseData);

            if (response.ok) {
                console.log('✅ Logout successful, removing user data...');
                await removeUserData();

                Snackbar.show({
                    text: 'Goodbye! Come back soon 😊',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'green',
                    fontFamily: 'Lexend-Medium',
                });

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Screen3' }],
                });
            } else {
                Snackbar.show({
                    text: responseData?.message || 'Failed to logout',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'red',
                    fontFamily: 'Lexend-Medium',
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
            Snackbar.show({
                text: 'An error occurred while logging out',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                fontFamily: 'Lexend-Medium',
            });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            let matriId = userData?.matriId;

            if (!matriId) {
                const storedUser = await AsyncStorage.getItem('user_data');
                const parsedUser = storedUser ? JSON.parse(storedUser) : null;
                matriId = parsedUser?.matriId;
            }

            if (!matriId) {
                throw new Error('Matri ID not found.');
            }

            if (!deleteReason.trim()) {
                Snackbar.show({
                    text: 'Please provide a reason for deleting your account.',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'orange',
                    fontFamily: 'Lexend-Medium',
                });
                return;
            }

            const authToken = await AsyncStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('User not authenticated. Please log in again.');
            }

            const formData = new FormData();
            formData.append('matri_id', matriId);
            formData.append('delete_reason', deleteReason);

            const response = await fetch('https://deafapi.ampleteck.com/api/user-delete', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`, // ✅ Add token here
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await response.json();
            console.log('🔹 Delete API Response:', data);

            if (response.ok && data.message?.includes('User marked as deleted')) {
                Snackbar.show({
                    text: 'Account deleted successfully.',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'green',
                    fontFamily: 'Lexend-Medium',
                });

                setShowDeleteModal(false);
                await logoutUser();
            } else {
                throw new Error(data?.message || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Delete error:', error);
            Snackbar.show({
                text: error.message || 'Delete failed',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                fontFamily: 'Lexend-Medium',
            });
        }
    };



    const menuItems = useMemo(() => [
        {
            id: 'profile',
            icon: modal1?.Icon75,
            text: 'View and Edit your Profile',
            action: () => {
                closeModal2();
                setTimeout(() => navigation.navigate("Screen67"), 300);
            }
        },
        {
            id: 'premium',
            icon: modal3?.Icon77,
            text: 'Upgrade to Premium',
            action: () => {
                closeModal2();
                setTimeout(() => navigation.navigate("Screen51"), 300);
            }
        },
        {
            id: 'stories',
            icon: heart1?.Icon157,
            text: 'Success Stories',
            action: () => {
                closeModal2();
                setTimeout(() => navigation.navigate("SuccessStories"), 300);
            }
        },
        {
            type: 'header',
            id: 'discover-header',
            text: 'Discover your matches'
        },
        {
            id: 'details',
            icon: modal4?.Icon78,
            text: 'Profile Details',
            action: () => {
                closeModal2();
                setTimeout(() => navigation.navigate("Screen57"), 300);
            }
        },
        {
            id: 'inbox',
            icon: modal5?.Icon79,
            text: 'Inbox',
            action: () => {
                closeModal2();
                setTimeout(() => navigation.navigate("Screen40"), 300);
            }
        },
        {
            id: 'chat',
            icon: modal6?.Icon80,
            text: 'Chat',
            action: () => {
                closeModal2();
                setTimeout(() => navigation.navigate("Screen43"), 300);
            }
        },
        {
            type: 'header',
            id: 'help-header',
            text: 'Help & Support'
        },
        {
            id: 'contact',
            icon: modal7?.Icon81,
            text: 'Contact Us',
            action: () => {
                closeModal2();
                setTimeout(() => navigation.navigate("Screen63"), 300);
            }
        },
        {
            id: 'faq',
            icon: modal8?.Icon82,
            text: 'FAQ',
            action: () => {
                closeModal2();
                setTimeout(() => navigation.navigate("Screen64"), 300);
            }
        },
        {
            id: 'privacy',
            icon: modal9?.Icon83,
            text: 'Privacy Policy',
            action: () => {
                closeModal2();
                setTimeout(() => navigation.navigate("Screen46"), 300);
            }
        },
        {
            id: 'refund',
            icon: modal10?.Icon84,
            text: 'Refund Policy & About us',
            action: () => {
                closeModal2();
                setTimeout(() => navigation.navigate("Screen65"), 300);
            }
        },
        {
            id: 'terms',
            icon: modal11?.Icon85,
            text: 'Term & Conditions',
            action: () => {
                closeModal2();
                setTimeout(() => navigation.navigate("Screen45"), 300);
            }
        },
        {
            id: 'delete_account',
            icon: modal13?.Icon866,
            text: 'Delete Account',
            action: () => {
                setShowDeleteModal(true);
            }
        },
        {
            id: 'logout',
            icon: modal12?.Icon86,
            text: 'Logout',
            action: logoutUser
        }
    ], []);

    const renderItem = ({ item }) => {
        if (item.type === 'header') {
            return (
                <Text style={[styles3.headingmodal3text, { fontSize: hp(1.8), marginTop: hp(1) }]}>
                    {item.text}
                </Text>
            );
        }

        return (
            <View key={item.id}>
                <TouchableOpacity
                    style={[styles3.optionRow, { paddingVertical: hp(1.5) }]}
                    onPress={item.action}
                    activeOpacity={0.7}
                >
                    <Image
                        source={item.icon}
                        style={[styles3.modalIcon3, { width: wp('4.5%'), height: hp('2.1%') }]}
                    />
                    <Text style={[styles3.modaltext33, { fontSize: hp(1.8) }]}>{item.text}</Text>
                    {item.id !== 'logout' && (
                        <Image
                            source={backr?.Icon25}
                            style={[styles3.backershort, { width: wp(3), height: hp(1.5) }]}
                        />
                    )}
                </TouchableOpacity>
                <View style={[verificationstyles.dividerLine3, { height: hp(0.1) }]} />
            </View>
        );
    };

    const keyExtractor = (item) => item.id;

    if (!userData) return null;
    return (
        <>
            {/* Main Side Menu Modal */}
            <Modal
                visible={isModal2Visible}
                transparent={true}
                animationType="none"
                onRequestClose={closeModal2}
            >
                <TouchableWithoutFeedback onPress={closeModal2}>
                    <View style={[styles.modal2overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                        <Animated.View
                            style={[styles.modal2Content,
                            {
                                width: wp(85),
                                transform: [{ translateX: slideAnim }],
                            }
                            ]}
                        >
                            <TouchableOpacity onPress={closeModal2} >
                                <Image source={cross?.Icon28} style={styles3.modalcross3} />
                            </TouchableOpacity>
                            <View style={styles3.userwithname3}>
                                <TouchableOpacity onPress={openFullImage}>
                                    <Image
                                        source={{
                                            uri:
                                                userData?.profilePicture?.startsWith('http')
                                                    ? userData.profilePicture
                                                    : userData?.localProfilePicture
                                                        ? userData.localProfilePicture
                                                        : getProfileImageUrl(userData?.profilePicture) ||
                                                        Image.resolveAssetSource(require('../../assets/icons/nouser.png')).uri,
                                        }}
                                        style={[styles3.usermodal3, { width: wp(20), height: wp(20), borderRadius: wp(10) }]}
                                        onError={async (e) => {
                                            console.log('Image load error:', e.nativeEvent.error);
                                            try {
                                                const userId = userData?.indexId || userData?.index_id || userData?.id;
                                                if (userId) {
                                                    const response = await axios.get(`http://82.29.161.246:8002/api/user/${userId}`);
                                                    if (response.data.user?.photo1) {
                                                        const newProfilePicture = response.data.user.photo1;
                                                        const updatedUserData = {
                                                            ...userData,
                                                            profilePicture: getProfileImageUrl(newProfilePicture),
                                                        };

                                                        await AsyncStorage.setItem('user_data', JSON.stringify(updatedUserData));
                                                        setUserData(updatedUserData);
                                                    }
                                                }
                                            } catch (refreshError) {
                                                console.error('Image refresh failed:', refreshError);
                                            }
                                        }}
                                    />
                                </TouchableOpacity>

                                <Modal
                                    visible={showFullImageModal}
                                    transparent={true}
                                    onRequestClose={closeFullImage}
                                >
                                    <View style={{
                                        flex: 1,
                                        backgroundColor: 'rgba(0,0,0,0.9)',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <TouchableWithoutFeedback onPress={closeFullImage}>
                                            <View style={{
                                                position: 'absolute',
                                                top: hp(5),
                                                right: wp(5),
                                                zIndex: 1
                                            }}>
                                                <Image
                                                    source={cross?.Icon28}
                                                    style={{
                                                        tintColor: 'white',
                                                        width: wp(8),
                                                        height: wp(8)
                                                    }}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>

                                        <Image
                                            source={{
                                                uri:
                                                    userData?.profilePicture?.startsWith('http')
                                                        ? userData.profilePicture
                                                        : getProfileImageUrl(userData?.profilePicture) ||
                                                        Image.resolveAssetSource(require('../../assets/icons/nouser.png')).uri,
                                            }}
                                            style={{
                                                width: wp(90),
                                                height: wp(90),
                                                resizeMode: 'contain',
                                            }}
                                            onError={(e) => console.log('Failed to load full image:', e.nativeEvent.error)}
                                        />
                                    </View>
                                </Modal>
                                <TouchableOpacity
                                    style={{ position: 'absolute', left: wp(15) }}
                                    onPress={selectImage}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <View style={{
                                            width: wp(8),
                                            height: wp(8),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <ActivityIndicator size="small" color="#000" />
                                        </View>
                                    ) : (
                                        <Image
                                            source={pencil?.Icon155}
                                            style={{ height: hp(2), width: wp(4.4), tintColor: 'black' }}
                                        />
                                    )}
                                </TouchableOpacity>

                                <Modal
                                    visible={showImagePickerModal}
                                    transparent={true}
                                    animationType="fade"
                                    onRequestClose={() => setShowImagePickerModal(false)}
                                >
                                    <TouchableWithoutFeedback onPress={() => setShowImagePickerModal(false)}>
                                        <View style={styles.centeredModalOverlay}>
                                            <Animated.View
                                                style={[
                                                    styles.centeredImagePickerModal,
                                                    {
                                                        width: wp(80),
                                                        opacity: modalAnim,
                                                        transform: [{
                                                            translateY: modalAnim.interpolate({
                                                                inputRange: [0, 1],
                                                                outputRange: [hp(5), 0]
                                                            })
                                                        }]
                                                    }
                                                ]}
                                            >
                                                <Text style={[styles.modalTitle, { fontSize: hp(2.2) }]}>Update Profile Picture</Text>

                                                <TouchableOpacity
                                                    style={[styles.optionButton, { paddingVertical: hp(1.5) }]}
                                                    onPress={handleCamera}
                                                >
                                                    <Image
                                                        source={camera?.Icon21}
                                                        style={[styles.optionIcon, { width: wp(6), height: hp(3) }]}
                                                    />
                                                    <Text style={[styles.optionText, { fontSize: hp(1.8) }]}>Take Photo</Text>
                                                </TouchableOpacity>

                                                <View style={[styles.divider, { height: hp(0.1) }]} />

                                                <TouchableOpacity
                                                    style={[styles.optionButton, { paddingVertical: hp(1.5) }]}
                                                    onPress={handleGallery}
                                                >
                                                    <Image
                                                        source={gallery?.Icon20}
                                                        style={[styles.optionIcon, { width: wp(6), height: hp(3) }]}
                                                    />
                                                    <Text style={[styles.optionText, { fontSize: hp(1.8) }]}>Choose from Gallery</Text>
                                                </TouchableOpacity>

                                                <View style={[styles.divider, { height: hp(0.1) }]} />

                                                <TouchableOpacity
                                                    style={[styles.cancelButton, { paddingVertical: hp(1.5) }]}
                                                    onPress={() => setShowImagePickerModal(false)}
                                                >
                                                    <Text style={[styles.cancelText, { fontSize: hp(1.8) }]}>Cancel</Text>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </Modal>

                                <View style={{ flexDirection: "column", marginHorizontal: wp(5), alignSelf: 'center' }}>
                                    <Text style={styles3.modaltext3}>{userData?.firstName} {userData?.lastName}</Text>
                                    <Text style={styles3.moda}>{userData?.email}</Text>
                                    <View style={{ flexDirection: 'row', alignSelf: "flex-start", borderWidth: 0.5, borderRadius: wp(5), padding: wp(1), paddingHorizontal: wp(2), marginTop: hp(0.6) }}>
                                        <Text style={{ fontSize: hp(1.2), color: '#333', }}>{userData?.matriId}</Text>
                                        <TouchableOpacity onPress={() => copyMatriIdToClipboard(userData?.matriId)}>
                                            <Image source={copymodal?.Icon87} style={{ height: hp(1.8), width: wp(3.8) }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <FlatList
                                data={menuItems}
                                renderItem={renderItem}
                                keyExtractor={keyExtractor}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: hp(2) }}
                                style={{ marginTop: hp(2) }}
                                initialNumToRender={10}
                                maxToRenderPerBatch={5}
                                windowSize={5}
                            />
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Delete Account Confirmation Modal */}
            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View style={styles.centeredModalOverlay}>
                    <View style={[styles.centeredImagePickerModal, { width: wp(85), padding: wp(5) }]}>
                        <Text style={[styles.modalTitle, { fontSize: hp(2.2), marginBottom: hp(1), textAlign: 'center' }]}>
                            Delete Your Account!
                        </Text>

                        <Text style={{
                            fontSize: hp(1.8), marginBottom: hp(1), color: '#555', textAlign: 'center', fontFamily: "Lexend-Medium",
                        }}>
                            Please tell us why you're leaving:
                        </Text>

                        <TextInput
                            placeholder="E.g. I didn't find my match"
                            value={deleteReason}
                            onChangeText={setDeleteReason}
                            style={{
                                borderWidth: 1,
                                borderRadius: 5,
                                borderColor: '#ccc',
                                padding: hp(1.5),
                                marginBottom: hp(2),
                                fontSize: hp(1.8),
                                textAlignVertical: 'top',
                                minHeight: hp(10),
                                fontFamily: "Lexend-Regular",
                                color: '#333',

                            }}
                            multiline
                            numberOfLines={4}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                style={[styles.cancelButton, {
                                    flex: 1,
                                    marginRight: wp(2),
                                    backgroundColor: '#f5f5f5'
                                }]}
                                onPress={() => setShowDeleteModal(false)}
                            >
                                <Text style={[styles.cancelText, { fontSize: hp(1.8) }]}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.optionButton, {
                                    flex: 1,
                                    backgroundColor: '#e74c3c'
                                }]}
                                onPress={handleDeleteAccount}
                            >
                                <Text style={[styles.optionText, {
                                    fontSize: hp(1.8),
                                    color: 'white',
                                    fontFamily: "Lexend-Medium",

                                }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default SideMenuModal;