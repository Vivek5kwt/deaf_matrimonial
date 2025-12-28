import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Dimensions, StatusBar, TextInput } from 'react-native';
import { arrow, ArrowS } from '../../../../utils/constants/icons/icon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const Screen48 = (props: any) => {
    const { email } = props.route.params;
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = Array.from({ length: 6 }, () => useRef<TextInput>(null));

    const handleVerifyOTP = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://82.29.161.246:8002/api/reset-password-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: otpCode }),
            });

            const data = await response.json();
            if (response.ok) {
                props.navigation.navigate('Screen69', { email, otp: otpCode });
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < inputRefs.length - 1) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
            if (index > 0) {
                inputRefs[index - 1].current?.focus();
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginBottom: 40 }}>
                <Image source={arrow?.Icon5} style={styles.icon2} />
            </TouchableOpacity>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText2}>Verification Code</Text>
                <Text style={styles.infoText}>Please type the verification code sent to</Text>
                <Text style={styles.infoText1}>{email}</Text>

                <View style={styles.inputContainer}>
                    {otp.map((value, index) => (
                        <TextInput
                            key={index}
                            ref={inputRefs[index]}
                            style={styles.inputBox}
                            value={value}
                            maxLength={1}
                            keyboardType="number-pad"
                            onChangeText={(text) => handleTextChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={{ flexDirection: 'row-reverse', marginTop: "20%" }}
                    onPress={handleVerifyOTP}
                    disabled={loading || otp.join('').length !== 6}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Image source={ArrowS?.Icon138} style={styles.icon} />
                    )}
                </TouchableOpacity>

                {error !== '' && (
                    <Text style={styles.errorText}>{error}</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        marginTop: hp(2),
        fontSize: wp(3.5),
        textAlign: 'center',
    },
    container: {
        flex: 1,
        padding:20
    },
    backgroundImage: {
        height: "100%",
        width: screenWidth,
    },
    icon: {
        height: 40,
        width: 40,
        marginLeft:5,
        marginBottom: 10
    },
      icon2: {  height: hp('2.2%'),
                width: wp('5.5%'),
                marginTop: hp('3%'),
                marginLeft: wp('4%') },
    imageContainer: {
       
        alignItems: 'center',
    },
    Tickimage: {
        marginTop: 70,
        width: screenWidth - 6,
        height: screenHeight / 2.3,
        resizeMode: 'contain',
    },
    infoContainer: {
      alignSelf:'center',
      backgroundColor:'#FFA500',
      padding:25,
      borderRadius:20,
      marginTop:30
    },
    infoText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '300',
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Lexend-Regular',
        marginLeft:'-9%'

    },
    infoText1: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
        marginTop: 5,
        marginBottom: 10,
        fontFamily: 'Lexend-Regular',

    },
    infoText2: {
        color: 'white',
        fontSize: 20,
        fontWeight: "600",
        fontFamily: 'Lexend-Bold',

    },
    inputContainer: {
        flexDirection: 'row',
    },
    inputBox: {
        borderColor: '#ccc',
        width: 45,
        height: 45,
        fontSize: 20,
        borderRadius: 13,
        marginHorizontal: 4,
        paddingLeft:15,
        backgroundColor:'white',
        color:"black",
        marginVertical:10,
    },
});

export default Screen48;
