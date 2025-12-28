import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, StatusBar, TextInput } from 'react-native';
import { ICONN71, ICONN72, ICONN73, Back } from '../../../../utils/constants/icons/icon';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const Screen49 = (props: any) => {
    const [smsInput, setSmsInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [smsVisible, setSmsVisible] = useState(false);
    const [eye, setEmailVisible] = useState(false);

    const isPasswordLong = smsInput.length >= 8;
    const hasUpperCase = /[A-Z]/.test(smsInput);
    const hasLowerCase = /[a-z]/.test(smsInput);
    const hasNumber = /\d/.test(smsInput);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(smsInput);

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, paddingTop: 40 }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Image source={Back?.Icon139} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>Reset Your Password Here</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Select which contact details should we</Text>
                    <Text style={styles.infoText}>use to reset your password</Text>
                </View>

                {/* SMS Input */}
                <View style={styles.inputContainer}>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.inputText}
                            placeholder=" • • • •   • • • •  4235"
                            value={smsInput}
                            onChangeText={setSmsInput}
                            placeholderTextColor={'#BFBFBF'}
                            secureTextEntry={!smsVisible}
                            selectionColor={'black'}
                        />
                        {/* <TouchableOpacity onPress={() => setSmsVisible(!smsVisible)}>
                            <View
                                style={[
                                    styles.eyeContainer,
                                    smsVisible ? styles.eyeActive : styles.eyeInactive,
                                ]}
                            >
                                <Image source={ICONN71?.ICONN_71} style={styles.icon3} />
                                {!smsVisible && <View style={styles.crossLine} />}
                            </View>
                        </TouchableOpacity> */}
                    </View>
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer2}>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="J@55  4455  4235"
                            value={emailInput}
                            onChangeText={setEmailInput}
                            placeholderTextColor={'#BFBFBF'}
                            secureTextEntry={!eye}
                        />
                        {/* <TouchableOpacity onPress={() => setEmailVisible(!eye)}>
                            <View
                                style={[
                                    styles.eyeContainer,
                                    eye ? styles.eyeActive : styles.eyeInactive,
                                ]}
                            >
                                <Image source={ICONN71?.ICONN_71} style={styles.icon3} />
                                {!eye && <View style={styles.crossLine} />}
                            </View>
                        </TouchableOpacity> */}
                    </View>
                </View>

                {/* Password Requirements */}
                <View style={{ marginTop: 15 }}>
                    <View style={styles.requirementContainer}>
                        <Image
                            source={isPasswordLong ? ICONN72?.ICONN_72 : ICONN73?.ICONN_73}
                            style={styles.icon2}
                        />
                        <Text style={styles.Text1}>The password must have at least 8 characters.</Text>
                    </View>
                    <View style={styles.requirementContainer}>
                        <Image
                            source={hasUpperCase ? ICONN72?.ICONN_72 : ICONN73?.ICONN_73}
                            style={styles.icon2}
                        />
                        <Text style={styles.Text1}>At least 1 uppercase letter (A-Z).</Text>
                    </View>
                    <View style={styles.requirementContainer}>
                        <Image
                            source={hasLowerCase ? ICONN72?.ICONN_72 : ICONN73?.ICONN_73}
                            style={styles.icon2}
                        />
                        <Text style={styles.Text1}>At least 1 lowercase letter (a-z).</Text>
                    </View>
                    <View style={styles.requirementContainer}>
                        <Image
                            source={hasNumber ? ICONN72?.ICONN_72 : ICONN73?.ICONN_73}
                            style={styles.icon2}
                        />
                        <Text style={styles.Text1}>At least 1 numeric digit (0-9).</Text>
                    </View>
                    <View style={styles.requirementContainer}>
                        <Image
                            source={hasSpecialChar ? ICONN72?.ICONN_72 : ICONN73?.ICONN_73}
                            style={styles.icon2}
                        />
                        <Text style={styles.Text1}>At least 1 special character.</Text>
                    </View>
                </View>

                {/* Next Button */}
                <TouchableOpacity onPress={() => props.navigation.navigate('Screen50')} style={styles.nextButton}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    icon3:{
height:15,
width:22,
    },
    container: {
        flex: 1,
        padding:10
        
    },
    backgroundImage: {
        height: screenHeight,
        width: screenWidth,
    },
    backIcon: {
        marginTop: 50,
        height: 40,
        width: 40,
        marginBottom: 10,
        marginLeft: 5,
    },
    title: {
        color: '#09051C',
        fontSize: 22,
        fontWeight: '600',
        marginLeft: 20,
        fontFamily: 'Lexend-Bold',

    },
    infoContainer: {
        marginVertical: 30,
        marginLeft: 20,
    },
    infoText: {
        color: '#09051C',
        fontSize: 14,
        fontWeight: '400',
        marginTop: 5,
        fontFamily: 'Lexend-Regular',

    },
    inputContainer: {
        marginHorizontal: 20,
        marginTop: 10,
    },
    inputContainer2: {
        marginHorizontal: 20,
        marginTop: 25,
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 18,
        paddingHorizontal: 10,
        paddingVertical:-20,

    },
    inputText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '500',
        marginLeft: 10,
        marginVertical: 6,
        fontFamily: 'Lexend-Regular',
        color:'black'

    },
    nextButton: {
        flexDirection: "column",
        alignItems: 'center',
        marginTop: 55,

    },
    nextButtonText: {
        fontSize: 17,
        fontWeight: "500",
        color: 'white',
        backgroundColor: '#FFA500',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 15,
        fontFamily: 'Lexend-Medium',

    },
    Text1: {
        color: '#09051C',
        marginLeft: 5,
        fontSize: 12,
        fontFamily: 'Lexend-Regular',

    },
    requirementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 25,
        marginTop: 5,
    },
    icon: {
        height: 40,
        width: 40,
        marginLeft:5,
        marginBottom: 10
    },
    icon2: {
        height: 12,
        width: 12,
        marginLeft:5,
        marginBottom:0,
    },
    eyeContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    crossLine: {
        position: 'absolute',
        top: 7,
        width: 28, 
        height: 1.5, 
        backgroundColor: '#D1D1D1',
        transform: [{ rotate: '60deg' }], 
    },
    eyeActive: {
        tintColor: 'red', 
    },
    eyeInactive: {
        tintColor: 'gray', 
    },
});

export default Screen49; 
 