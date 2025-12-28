import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useActiveIcon } from '../redux/ActiveIconContext';
import {
    homelogo, friendslogo, maillogo, chatlogo, crownlogo,
    homelogo1, friendslogo1, maillogo1, chatlogo1, crownlogo1
} from '../utils/constants/icons/icon';
import verificationstyles from '../styles/verification/verificationstyles';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomHeader = () => {
    const insets = useSafeAreaInsets();

    const { activeIcon, setActiveIcon } = useActiveIcon();
    const navigation = useNavigation();

    const renderIcon = (iconName, defaultIcon, activeIconImage, iconText, navigateTo) => {
        const isActive = activeIcon === iconName;

        const getIconComponent = () => {
            if (iconName === 'home' && isActive) {
                return (
                    <LottieView
                        source={require('../assets/animations/Home.json')}
                        autoPlay
                        loop
                        style={verificationstyles.logoiconsanimated}
                    />
                );
            } else if (iconName === 'settings' && isActive) {
                return (
                    <LottieView
                        source={require('../assets/animations/settings.json')}
                        autoPlay
                        loop
                        style={verificationstyles.logoiconsanimated}
                    />
                );
            } else {
                return (
                    <Image
                        source={isActive ? activeIconImage : defaultIcon}
                        style={verificationstyles.logoicons}
                    />
                );
            }
        };

        return (
            <TouchableOpacity
                onPress={() => {
                    setActiveIcon(iconName);
                    navigation.navigate(navigateTo);
                }}
                style={{ alignItems: 'center' }}
            >
                {getIconComponent()}
                <Text style={[verificationstyles.textlogo, isActive && { color: 'white' }]}>
                    {iconText}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{
            backgroundColor: '#FF7E00',
            paddingTop: 8,
            paddingBottom: insets.bottom + 8, // Safe + default spacing
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 38
        }}>
            {renderIcon('home', homelogo?.Icon58, homelogo1?.Icon63, 'Home', 'Screen26')}
            {renderIcon('Matches', friendslogo?.Icon59, friendslogo1?.Icon64, 'Matches', 'Screen30')}
            {renderIcon('chat', maillogo?.Icon60, maillogo1?.Icon65, 'Chat', 'Screen40')}
            {/* Alternative chat icon (if needed later)
            {renderIcon('chat', chatlogo?.Icon61, chatlogo1?.Icon66, 'Chat', 'Screen40')} */}
            {renderIcon('settings', crownlogo?.Icon62, crownlogo1?.Icon67, 'settings', 'Screen52')}
        </View>
    );
};

export default BottomHeader;
