import React, { useEffect, useRef } from 'react';
import { View, StatusBar, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DM, Greentop, IMG_1, OrangeB, oka, patte } from '../../../utils/constants/images/image';
import styles from '../../../styles/onboadings/styles';

const Screen1 = ({ navigation, route = { params: {} } }) => {
    // Ensure route.params exists and is an object
    const safeRoute = {
        ...route,
        params: route?.params && typeof route.params === 'object' ? route.params : {},
    };
    // Initialize animated values
    const fadeAnim = useRef(new Animated.Value(0)).current; // General fade-in
    const slideAnim = useRef(new Animated.Value(100)).current; // Slide up
    const coverAnim = useRef(new Animated.Value(-500)).current; // Move from top
    const dmAnim = useRef(new Animated.Value(0)).current; // DM opacity (0 initially)
    const shakeAnim = useRef(new Animated.Value(0)).current; // Shake effect for Patte
    const okaAnim = useRef(new Animated.Value(0)).current; // Fade-in for Oka
    const greentopScaleAnim = useRef(new Animated.Value(0.5)).current; // Scale effect for Greentop
    const bounceAnim = useRef(new Animated.Value(0)).current; // Bounce effect for DM

    useEffect(() => {
        // Check if user is already logged in
        const checkUserLogin = async () => {
            try {
                const authToken = await AsyncStorage.getItem('auth_token');
                const firstName = await AsyncStorage.getItem('firstName');
                const lastName = await AsyncStorage.getItem('lastName');
                const email = await AsyncStorage.getItem('email');
                const profilePicture = await AsyncStorage.getItem('profile_picture');

                if (authToken && firstName && lastName && email && profilePicture) {
                    // User is logged in, navigate to Home Screen (Screen26)
                    navigation.replace('Screen26');
                } else {
                    // User is not logged in, continue splash animation
                    startAnimations();
                }
            } catch (error) {
                console.error("Error checking user login:", error);
                startAnimations(); // In case of error, continue normal flow
            }
        };

        const startAnimations = () => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.spring(greentopScaleAnim, {
                    toValue: 1,
                    friction: 4,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                Animated.timing(dmAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }).start(() => {
                    Animated.timing(coverAnim, {
                        toValue: 0,
                        duration: 900,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }).start(() => {
                        Animated.loop(
                            Animated.sequence([
                                Animated.timing(shakeAnim, {
                                    toValue: -5,
                                    duration: 150,
                                    useNativeDriver: true,
                                }),
                                Animated.timing(shakeAnim, {
                                    toValue: 5,
                                    duration: 150,
                                    useNativeDriver: true,
                                }),
                            ]),
                            { iterations: 5 }
                        ).start();

                        Animated.timing(okaAnim, {
                            toValue: 1,
                            duration: 800,
                            easing: Easing.out(Easing.ease),
                            useNativeDriver: true,
                        }).start();
                    });
                });

                Animated.sequence([
                    Animated.timing(bounceAnim, {
                        toValue: -20,
                        duration: 200,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceAnim, {
                        toValue: 0,
                        duration: 200,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceAnim, {
                        toValue: -10,
                        duration: 150,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceAnim, {
                        toValue: 0,
                        duration: 150,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]).start();
            });

            setTimeout(() => {
                navigation.replace('Screen2');
            }, 5000);
        };

        checkUserLogin();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.imageView}>
                <Animated.Image
                    source={IMG_1?.IMG1}
                    resizeMode="stretch"
                    style={[
                        styles.imageStyle11,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                />
                <Animated.Image
                    source={Greentop?.IMG2}
                    resizeMode="stretch"
                    style={[
                        styles.imageStyle1,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { translateY: slideAnim },
                                { scale: greentopScaleAnim },
                            ],
                        },
                    ]}
                />
                <Animated.Image
                    source={OrangeB?.IMG4}
                    resizeMode="stretch"
                    style={[
                        styles.imageStyle3,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                />
                <Animated.Image
                    source={oka?.IMG32}
                    resizeMode="contain"
                    style={[
                        styles.okaImage,
                        {
                            position: 'absolute',
                            opacity: okaAnim,
                        },
                    ]}
                />
                <Animated.Image
                    source={DM?.IMG3}
                    resizeMode="contain"
                    style={[
                        styles.imageStyle2,
                        {
                            opacity: dmAnim,
                            transform: [{ translateY: bounceAnim }],
                        },
                    ]}
                />
                <Animated.Image
                    source={patte?.IMG31}
                    resizeMode="cover"
                    style={[
                        styles.coverImage,
                        {
                            transform: [
                                { translateY: Animated.add(coverAnim, shakeAnim) },
                            ],
                        },
                    ]}
                />
            </View>
        </View>
    );
};

export default Screen1;
