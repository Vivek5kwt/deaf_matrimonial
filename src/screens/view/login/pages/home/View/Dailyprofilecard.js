import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { pic1, pic2, pic3, pic4, pic5, pic6, pic7 ,bgorange,redtick,line2} from '../../../../../../utils/constants/icons/icon';
import { addIMG } from '../../../../../../utils/constants/images/image';
import BasicDetailsContainer from '../../../../../../components/BasicDetailsContainer';
import BasicCareerDetailsContainer from '../../../../../../components/BasicCareerDeatilsContainer';
import {careerdetails } from '../../../../../../utils/constants/icons/careerdetails';
import { details } from '../../../../../../utils/constants/icons/details';
import ContactDetailsContainer from '../../../../../../screens/view/login/pages/home/View/ContactDetailCustomer';
import ProfileCardContainer from '../../../../../../components/ProfileCard/ProfileCardContainer';
import ConnectButton from '../../../../../../components/ProfileCard/ConnectButton';
import ModalOne from './Modals4Cards/ModalOne';
import ModalTwo from './Modals4Cards/ModalTwo';

const DailyProfileCard = ({ profile, isViewerMembership, profileMembership ,navigation}) => {
    const handleAstroPress = () => {
        navigation.navigate('Screen31');
      };
      const [visibleModal, setVisibleModal] = useState(null); // Track which modal is visible

      const openModalOne = () => setVisibleModal('ModalOne');
      const openModalTwo = () => setVisibleModal('ModalTwo');
      const closeModal = () => setVisibleModal(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [hobbies, setHobbies] = useState([]); // State to store hobbies from the API

    const handleYouAndHerPress = () => setIsModalVisible(true);
    const logo = profile.status === 'Online' ? pic5?.Icon90 : pic7?.Icon93;

    const shouldBlurImage = !isViewerMembership && profileMembership;
    const isJustJoined = (profile.joinDate && (new Date() - new Date(profile.joinDate)) < 7 * 24 * 60 * 60 * 1000);

 
    return (
        <View>
            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    {profile.profileImage ? (
                        <>
                            <Image
                                source={profile.profileImage}
                                style={[
                                    styles.image,
                                    shouldBlurImage && styles.blurredImage,
                                ]}
                            />
                            {shouldBlurImage && (
                                <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradePress}>
                                    <Text style={styles.upgradeButtonText}>Upgrade to View</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <>
                            <Image
                                source={addIMG?.IMG24}
                                style={styles.image}
                            />
                            <TouchableOpacity style={styles.addPhotoButton} onPress={handleRequestPhotoPress}>
                                <Text style={styles.addPhotoText}>Request a Photo</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>


                {isJustJoined && (
                    <View style={styles.justJoined}>
                        <Image source={pic3?.Icon88} style={{ height: 30, width: 120 }} />
                        <Text style={styles.justJoinedText}>Just Joined</Text>
                    </View>
                )}
                <View style={styles.overlay}>
                    {profile.isAstro && (
                      <TouchableOpacity 
                      style={styles.astroBadge} 
                      onPress={handleAstroPress} 
        >
                      <Image source={pic1?.Icon88} style={styles.threeicons} />
                      <Text style={styles.astroText}>Astro</Text>
                  </TouchableOpacity>
                        
                    )}

                    {profile.profileImage && (
                        <TouchableOpacity style={styles.cameraContainer}onPress={openModalOne}>
                            <Image source={pic2?.Icon88} style={styles.threeicons} />
                        </TouchableOpacity>
                    )}

                    {(
                        <TouchableOpacity style={styles.cameraContainer2} onPress={openModalTwo}>
                            <Image source={pic4?.Icon89} style={styles.threeicons} />
                        </TouchableOpacity>
                    )}

                    <View style={styles.details}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>{profile.name}</Text>

                        </View>

                        <Text style={styles.info}>
                            {profile.age} yrs, {profile.height} • {profile.profession}
                        </Text>
                        <Text style={styles.info}>
                            {profile.language}, {profile.caste} • {profile.location}
                        </Text>

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.statusContainer}>
                            <Image
                                source={logo}
                                style={[
                                    styles.threeicons,
                                    logo === pic7?.Icon93 && styles.pic7Style,
                                ]}
                            />
                            <Text style={styles.statusText}>{profile.status}</Text>
                        </View>
                        <TouchableOpacity onPress={handleYouAndHerPress} style={styles.statusContainer}>
                            <Image source={pic6?.Icon91} style={styles.threeicons} />
                            <Text style={[styles.statusText]}>You and Her</Text>
                        </TouchableOpacity>
                    </View>
                    <Modal visible={visibleModal === 'ModalOne'} transparent={true} animationType="slide">
                <ModalOne onClose={closeModal} />
            </Modal>
            <Modal visible={visibleModal === 'ModalTwo'} transparent={true} animationType="slide">
                <ModalTwo onClose={closeModal}  navigation={navigation}/>
            </Modal>
                </View>
                <Modal visible={isModalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>You and Her Details</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Text style={styles.modalClose}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={styles.container22}>                
                <Text style={styles.Textheading}>About Anjali D</Text>
                <Text style={styles.textnomal}>I am a Bachelors in science. At Present, I am working as a Nurse.
                    IN my personal life, I believe in ‘simple living and high thinking’. I am looking for my better half with whom I can always  be myself. Thanks for going through my profile.</Text>
            </View>
            <View style={styles.container22}>
                {/* <Text style={styles.Textheading}>Hobbies & Interests</Text> */}
                {/* <ScrollView horizontal contentContainerStyle={styles.iconsContainer}>
                    {hobbies.slice(0, 4).map((item) => renderIcon(item))} 
                </ScrollView>  */}
                <Text style={styles.Textheading}>Hobbies & Interests</Text>
                <View style={styles.iconsContainer}>
                    {[
                        { id: 1, name: 'Reading', icon: pic1?.Icon88 },
                        { id: 2, name: 'Traveling', icon: pic1?.Icon88 },
                        { id: 3, name: 'Music', icon: pic1?.Icon88 },
                        { id: 4, name: 'Cooking', icon: pic1?.Icon88 },
                        { id: 5, name: 'Photography', icon: pic1?.Icon88 },
                    ].map((item) => (
                        <View key={item.id} style={styles.hobbyContainer}>
                            <Image source={item.icon} style={styles.hobbyIcon} />
                            <Text style={styles.hobbyText}>{item.name}</Text>
                        </View>
                    ))}
                </View>
            </View>
                <View>
            <BasicDetailsContainer details={details} />
        </View>
        <View>
        <ContactDetailsContainer/>
        </View>
        <View>
            <BasicCareerDetailsContainer careerdetails={careerdetails} />
        </View>
        
        <ProfileCardContainer
      bgImage={bgorange?.Icon108}
      checkmarkIcon={redtick?.Icon109}
      dividerIcon={line2?.Icon103}
    />
    <View>
        <ConnectButton/>
    </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container22: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        margin: 15,
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    textnomal: {
        fontFamily: 'Lexend-Regular',
        fontSize: 14,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    iconsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', 
        marginTop: 10,
        
    },
    hobbyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        marginHorizontal: 5,
        padding: 5,
        flexDirection: 'row',
        marginBottom: 10, // Adds spacing between rows
        width: '30%', // Ensures 3 items per row

    },
    hobbyIcon: {
        width: 18,
        height: 18,
        marginBottom: 5,
    },
    hobbyText: {
        fontFamily: 'Lexend-Medium',
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
    Textheading: {
        fontSize: 16,
        fontFamily: 'Lexend-Medium',
        paddingLeft: 10,
        color: 'black'

    },
    pic7Style: {
        height: 8,
        width: 8,
    },
    statusText: {
        fontFamily: 'Lexend-Medium',
        color: 'white',
        marginHorizontal: 5,
        fontSize: 10,
        alignSelf: 'center'

    },
    statusContainer: {
        backgroundColor: '#6A696E',
        paddingHorizontal: 10,
        borderRadius: 20,
        flexDirection: 'row',
        marginRight: 30,
        paddingVertical: 5,
        marginBottom: 20,
        marginLeft: 10,
    },
    threeicons: {
        height: 20,
        width: 20,
        alignSelf: 'center'
    },

    greenicons: {
        height: 40,
        width: 40,
        alignSelf: 'center',
        tintColor: 'white',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    crowniconnn: {
        height: 50,
        width: 50,
        justifyContent: 'center',

    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 500,

    },
    justJoined: {
        position: 'absolute',
        top: 50,
        left: -10,
        borderRadius: 5,
        color: '#000',
    },
    justJoinedText: {
        position: 'absolute',
        top: 4,
        left: 15,
        borderRadius: 5,
        color: '#FF7E00',
        fontFamily: 'Lexend-Medium',
        fontSize: 12,
    },
    overlay: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',

    },
    astroBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 19,
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    astroText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: 'Lexend-Medium',
        alignSelf: 'center',
        marginHorizontal: 10,
    },
    cameraContainer: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        paddingHorizontal: 17,
        paddingVertical: 5,
        borderRadius: 20,
    },
    cameraContainer2: {
        position: 'absolute',
        top: "20%",
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 20,
    },
    cameraText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    details: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    additionalInfo: {
        flexDirection: 'row',
    },
    infoBadge: {
        color: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginHorizontal: 2,
        backgroundColor: 'red'
    },
    youAndHer: {
        backgroundColor: '#f8a017',
    },
    name: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'Lexend-Medium',

    },
    info: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
        fontFamily: 'Lexend-Medium',
    },
    crowniconnn: {
        height: 50,
        width: 50,
    },
    premiumRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    upgradeText: {
        color: '#FF7E00',
        fontSize: 17,
        marginLeft: 10,
        fontFamily: 'Lexend-Bold',

    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalClose: {
        color: 'blue',
        fontSize: 14,
    },
    addPhotoButton: {
        position: 'absolute',
        bottom: "50%",
        backgroundColor: '#FF7E00',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignSelf: 'center',
    },
    addPhotoText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Lexend-Bold',
    },
    blurredImage: {
        opacity: 0.3, // Reduce opacity to simulate a blur effect
    },
    upgradeButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        backgroundColor: '#FF7E00',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    upgradeButtonText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Lexend-Bold',
        textAlign: 'center',
    },

});



export default DailyProfileCard;
