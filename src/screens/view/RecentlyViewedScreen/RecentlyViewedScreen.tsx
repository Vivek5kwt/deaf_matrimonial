import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
    FlatList,
    Modal,
    ImageBackground,
} from 'react-native';
import BottomHeader from '../../../components/BottomHeader';

import {cross, phoneM, lockM, vedioM, mailM, messageM, watsappM} from '../../../utils/constants/icons/icon';
import styles from '../../../styles/onboadings/styles';
import { bgM, image2, image3, image4, imageav } from '../../../utils/constants/images/image';
import { useNavigation } from '@react-navigation/native';
import verificationstyles from '../../../styles/verification/verificationstyles';
import GlobalHeader from '../../../components/Header'; // Import GlobalHeader

const ProfileCard = ({ profile, onButtonPress }) => {
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [buttonText, setButtonText] = useState('Connect Now');

    const handlePress = () => {
        if (buttonText === 'Connect Now') {
            setButtonText('Chat Now');
            if (onButtonPress) onButtonPress(profile);
        } else {
            setSelectedProfile(profile);
            setModalVisible(true);
        }
    };

    return (
        <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
        <Image source={profile.image} style={verificationstyles.matchesimage} />
        <View style={{ position: "absolute", top: "55%", left: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                <Text style={[verificationstyles.textnumberwhite11, {}]}>{profile.name}</Text>
                <Text style={verificationstyles.textnumberwhite11}>{profile.age} yrs</Text>
            </View>
            <Text style={[verificationstyles.textnumberwhite11, { marginTop: 5 }]}>{profile.height}, {profile.language}</Text>
            <Text style={[verificationstyles.textnumberwhite11, {}]}>{profile.city}</Text>
        </View>
        <TouchableOpacity
            style={{
                backgroundColor: 'white',
                padding: 5,
                paddingHorizontal: 25,
                borderRadius: 20,
                marginTop: 10,
                borderWidth: 1,
                borderColor: '#FF7E00',
            }}
            onPress={handlePress}
        >
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={verificationstyles.modalOverlayy}>

                    <View style={verificationstyles.modalContentt}>
                        <ImageBackground source={bgM?.IMG18} style={{ width: '100%', height: '70%' }}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} >
                                <Image source={cross?.Icon28} style={styles.Crossicon1} />
                            </TouchableOpacity>
                            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                                <View style={{ width: 120, height: 120, borderRadius: 60, overflow: 'hidden', marginBottom: 20 }}>
                                    <Image
                                        source={selectedProfile?.image || null}
                                        style={{ width: '100%', height: '100%', borderRadius: 60 }}
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text style={verificationstyles.textnumberwhitee11}>Upgrade Now to get full access</Text>
                                <View style={{ backgroundColor: 'white', paddingHorizontal: '8%', paddingVertical: '5%', borderRadius: 20, marginBottom: 30 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Image source={phoneM?.Icon68} style={verificationstyles.Iconheighttt} />
                                        <Text style={verificationstyles.textnumberr2}> +91-78 * * * * * * * *</Text>
                                        <Image source={lockM?.Icon73} style={verificationstyles.Iconheighttt} />
                                    </View>
                                    <View style={verificationstyles.dividerLine} />

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <Image source={vedioM?.Icon69} style={verificationstyles.Iconheighttt} />
                                        <Text style={verificationstyles.textnumberr2}>Voice and Video  Calls</Text>
                                        <Image source={lockM?.Icon73} style={verificationstyles.Iconheighttt} />
                                    </View>
                                    <View style={verificationstyles.dividerLine} />

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <Image source={watsappM?.Icon70} style={verificationstyles.Iconheighttt} />
                                        <Text style={verificationstyles.textnumberr2}>Chat Via Whats app</Text>
                                        <Image source={lockM?.Icon73} style={verificationstyles.Iconheighttt} />
                                    </View>
                                    <View style={verificationstyles.dividerLine} />

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <Image source={messageM?.Icon71} style={verificationstyles.Iconheighttt} />
                                        <Text style={verificationstyles.textnumberr2}>Message via Deaf Chat</Text>
                                        <Image source={lockM?.Icon73} style={verificationstyles.Iconheighttt} />
                                    </View>
                                    <View style={verificationstyles.dividerLine} />

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <Image source={mailM?.Icon72} style={verificationstyles.Iconheighttt} />
                                        <Text style={verificationstyles.textnumberr2}>Email via Deaf Chat</Text>
                                        <Image source={lockM?.Icon73} style={verificationstyles.Iconheighttt} />
                                    </View>
                                </View>
                                <TouchableOpacity style={verificationstyles.continueButtonshort} onPress={() => navigation.navigate('Screen24')}>
                                    <Text style={verificationstyles.continueButtonText}>View Plans</Text>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>

                    </View>
                </View>
            </Modal>
            <Text style={{ color: '#FF7E00', fontSize: 14, fontFamily: 'Lexend-Medium' }}>{buttonText}</Text>
        </TouchableOpacity>
    </View>
    );
};

const Screen38 = () => {
  const profileCounts = {
    Search: 10,
    New: 497,
    Daily: 1,
    'My Matches': 2522,
    'Near Me': 50,
    'More Matches': 100,
  };

    const navigation = useNavigation();
    const premiumProfiles = [
        { id: '1', name: 'Avneet Kaur', age: 31, height: '5’ 2”', language: 'Punjabi', city: 'Kaur, Uttar Pradesh', image: imageav?.IMG14 },
        { id: '2', name: 'Tavneet Kaur', age: 31, height: '5’ 2”', language: 'Punjabi', city: 'Grewal, Madhya Pradesh', image: image2?.IMG15 },
    ];

    const newMatches = [
        { id: '3', name: 'Akshreet Kaur', age: 31, height: '5’ 2”', language: 'Punjabi', city: 'Kaur, Uttar Pradesh', image: image3?.IMG16 },
        { id: '4', name: 'Ravneet Kaur', age: 31, height: '5’ 2”', language: 'Punjabi', city: 'Grewal, Madhya Pradesh', image: image4?.IMG17 },
    ];

    const membersLooking = [
        { id: '5', name: 'Rajneet Kaur', age: 31, height: '5’ 2”', language: 'Punjabi', city: 'Delhi, India', image: image3?.IMG16 },
        { id: '6', name: 'Harmeet Kaur', age: 31, height: '5’ 2”', language: 'Punjabi', city: 'Mumbai, India', image: image4?.IMG17 },
    ];

    const handleProfileButtonPress = (profile) => {
        console.log(`Button pressed for ${profile.name}`);
    };

    const renderProfileList = (title, profiles, descriptions) => (
        <View>
            <View
                style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                    marginHorizontal: 20,
                    marginBottom: 5,
                }}
            >
                <Text style={[verificationstyles.iconText, { marginBottom:0}]}>{title}</Text>
                {descriptions.map((desc, index) => (
                    <Text key={index} style={[verificationstyles.girlTextlight, { marginBottom: 10 }]}>
                        {desc}
                    </Text>
                ))}
                <FlatList
                    data={profiles}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ProfileCard profile={item} onButtonPress={handleProfileButtonPress} />
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <TouchableOpacity
                style={{
                    backgroundColor: 'white',
                    marginHorizontal: 20,
                    marginBottom: 10,
                    paddingVertical: 5,
                }}
                onPress={() => navigation.navigate('Screen27', { category: title })}
            >
                <Text
                    style={[
                        verificationstyles.girlTextlight,
                        {
                            justifyContent: 'center',
                            alignSelf: 'center',
                            color: '#FF7E00',
                            textAlign: 'center',
                            marginBottom: 4,
                            fontFamily: 'Lexend-Medium',
                        },
                    ]}
                >
                    See All
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.containergrey}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <GlobalHeader navigation={navigation} profileCounts={profileCounts} />

            <ScrollView style={{ paddingBottom: 40 }}>
                {renderProfileList('Recently Viewed Members (30)', premiumProfiles, ['Members you have recently Viewed'])}
                
            </ScrollView>
            <View style={verificationstyles.bottomHeaderContainer}>
        <BottomHeader />
      </View>
        </View>
    );
};

export default Screen38;
