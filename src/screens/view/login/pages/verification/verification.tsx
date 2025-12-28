import React, { useState, useEffect } from 'react';
import {
    View, SafeAreaView, TouchableOpacity, Image, Text, TextInput,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { ScrollView } from 'react-native-gesture-handler';
import { Snackbar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import { arrow, sequrity, downarrow, ICONN71, ICONN711 } from '../../../../../utils/constants/icons/icon';
import { getUserData, storeUserData } from '../../../../../utils/constants/storage';

const Screen7 = (props: any) => {
    const [countryCode1, setCountryCode1] = useState('IN');
    const [callingCode1, setCallingCode1] = useState('91');
    const [showCountryPicker1, setShowCountryPicker1] = useState(false);

    const [countryCode2, setCountryCode2] = useState('IN');
    const [callingCode2, setCallingCode2] = useState('91');
    const [showCountryPicker2, setShowCountryPicker2] = useState(false);

    const [email, setEmail] = useState('');
    const [parentNumber, setParentNumber] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [matriId, setMatriId] = useState<string | null>(null);
    const [warning, setWarning] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserData();
                if (!userData?.matriId) {
                    setWarning('Matri ID not found. Please restart the registration process.');
                    return;
                }
    
                setMatriId(userData.matriId);
                if (userData.email) setEmail(userData.email.toLowerCase());
                if (userData.mobileNumber) setWhatsappNumber(userData.mobileNumber);
            } catch (error) {
                console.error('Error retrieving user data:', error);
                setWarning('Failed to retrieve user data.');
            }
        };
    
        fetchUserData();
    }, []);
    

    const onSelect1 = (country: any) => {
        setCountryCode1(country.cca2);
        setCallingCode1(country.callingCode[0]);
        setShowCountryPicker1(false);
    };

    const onSelect2 = (country: any) => {
        setCountryCode2(country.cca2);
        setCallingCode2(country.callingCode[0]);
        setShowCountryPicker2(false);
    };

    const isValidPhoneNumber = (number: string) => {
        return /^[0-9]{10}$/.test(number);
    };

    const isValidEmail = (email: string) => {
        return /^[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);
    };

    const isValidPassword = (pass: string) => {
        return /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(pass);
    };

    const isFormValid =
        isValidEmail(email) &&
        isValidPhoneNumber(parentNumber) &&
        isValidPhoneNumber(whatsappNumber) &&
        isValidPassword(password) &&
        password === confirmPassword;

        const handleSubmit = async () => {
            if (!isFormValid) return;
        
            if (parentNumber === whatsappNumber) {
                setSnackbarMessage('Parent and WhatsApp numbers cannot be the same.');
                setSnackbarVisible(true);
                return;
            }
        
            if (!matriId) {
                setSnackbarMessage('Matri ID is missing. Please restart the registration process.');
                setSnackbarVisible(true);
                return;
            }
        
            setLoading(true);
        
            try {
                const requestBody = {
                    email,
                    phone_code: `+${callingCode1}`,
                    parent_mobile: parentNumber,
                    mobile_code: `+${callingCode2}`,
                    mobile: whatsappNumber,
                    password: password,
                    matri_id: matriId,
                };
        
                const response = await fetch('http://82.29.161.246:8002/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });
        
                const data = await response.json();
        
                if (response.ok) {
                    await storeUserData({ matriId, email });
                    props.navigation.navigate('Screen14', {
                        phoneNumber: whatsappNumber,       // ✅ use bride/groom number
                        countryCode: `+${callingCode2}`,   // ✅ use bride/groom country code
                    });
                    
                } else {
                    if (data.errors && data.errors.email) {
                        setSnackbarMessage(data.errors.email[0] || data.message);
                    } else {
                        setSnackbarMessage(data.message || 'Something went wrong.');
                    }
                    setSnackbarVisible(true);
                }
            } catch (error) {
                console.error('❌ API Error:', error);
                if (error instanceof TypeError) {
                    setSnackbarMessage('Failed to connect to server. Please check your internet connection.');
                } else {
                    setSnackbarMessage('The email or whatsApp has already been taken.');
                }
                setSnackbarVisible(true);
            } finally {
                setLoading(false);
            }
        };
        

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, { paddingHorizontal: wp('4%') }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp('5%') }}>
                <View style={{  }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            paddingVertical: hp('1.5%'),
                            backgroundColor: '#FDF1E3',
                            borderColor: '#FDF1E3',
                            marginTop: hp('2%'),
                            paddingHorizontal: hp('3.5%'),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderRadius: wp(15),
                            marginHorizontal: wp(30),
                            padding: hp(2),
                        }}
                    >
                        <Image
                            source={sequrity?.Icon11}
                            resizeMode="stretch"
                            style={{
                                width: wp('20%'),
                                height: hp('9.5%')
                            }}
                        />
                    </TouchableOpacity>

                    {/* <Text style={[styles.blackViewText1, { 
                        fontSize: hp('2.5%'), 
                        textAlign: 'center',
                        marginTop: hp('2%')
                    }]}>
                        A valid email and phone number are
                    </Text>
                    <Text style={[styles.blackViewText11, { 
                        fontSize: hp('2.5%'), 
                        textAlign: 'center' 
                    }]}>
                        needed to complete your profile.
                    </Text> */}
                </View>

                {/* Email Input */}
                <View style={{ marginTop: hp('0%'), marginHorizontal: wp('0%') }}>
                    <Text style={[styles1.textt, { fontSize: hp('1.8%') }]}>Email ID</Text>
                    <View style={[styles1.viewtextinput, styles1.inputContainerrr, { height: hp('6%') }]}>
                        <TextInput
                            style={[styles1.textInput, { fontSize: hp('1.8%') }]}
                            placeholder="Enter ID"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={(text) => setEmail(text.toLowerCase())}
                        />
                    </View>
                </View>

                {/* Password Input */}
                <View style={{ marginTop: hp('-2%'), marginHorizontal: wp('0%') }}>
                    <Text style={[styles1.textt, { fontSize: hp('1.8%') }]}>Set Password</Text>
                    <View style={[styles1.viewtextinput, {
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: hp('6%')
                    }]}>
                        <TextInput
                            style={styles1.textInput}
                            placeholder="Enter Password"
                            placeholderTextColor="#888"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={{
                                padding: wp('2%'),
                                marginLeft: wp('1%'),
                                marginRight: wp('1%')
                            }}
                        >
                            <Image
                        source={showPassword ? ICONN71?.ICONN_71 : ICONN711?.ICONN_711}
                        style={showPassword ? styles1.icon71 : styles1.icon711}
                      />
                      
                        </TouchableOpacity>
                    </View>
                    {password.length > 0 && !isValidPassword(password) && (
                        <Text style={{ color: 'red', fontSize: hp('1.5%') }}>
                            Password must be at least 6 characters with 1 special character.
                        </Text>
                    )}
                </View>

                {/* Confirm Password */}
                <View style={{ marginTop: hp('-2%'), marginHorizontal: wp('0%') }}>
                    <Text style={[styles1.textt, { fontSize: hp('1.8%') }]}>Confirm Password</Text>
                    <View style={[styles1.viewtextinput, {
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: hp('6%')
                    }]}>
                        <TextInput
                            style={[styles1.textInput, { flex: 1, fontSize: hp('1.8%') }]}
                            placeholder="Confirm Password"
                            placeholderTextColor="#888"
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                                padding: wp('2%'),
                                marginLeft: wp('1%'),
                                marginRight: wp('1%')
                            }}
                        >
                            <Image
                                source={showConfirmPassword ? ICONN71?.ICONN_71 : ICONN711?.ICONN_711}
                                style={showConfirmPassword ? styles1.icon71 : styles1.icon711}
                                />
                        </TouchableOpacity>
                    </View>
                    {confirmPassword.length > 0 && password !== confirmPassword && (
                        <Text style={{ color: 'red', fontSize: hp('1.5%') }}>
                            Passwords do not match.
                        </Text>
                    )}
                </View>

                {/* Parent Phone Number */}
                <View style={{ marginTop: hp('-2%'), marginHorizontal: wp('0%') }}>
                    <Text style={[styles1.textt, { fontSize: hp('1.8%') }]}>Phone Number</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: hp('1%')
                    }}>
                        <TouchableOpacity
                            onPress={() => setShowCountryPicker1(true)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderRadius: wp('2%'),
                                borderColor: '#ccc',
                                paddingHorizontal: wp('2%'),
                                paddingVertical: hp('1.3%'),
                                justifyContent: 'space-between',
                                width: wp('20%'),
                                marginRight: wp('2%'),
                            }}
                        >
                            <Text style={{ color: '#000', fontSize: hp('1.8%') }}>+{callingCode1}</Text>
                            <Image
                                source={downarrow?.Icon15}
                                style={{
                                    width: wp('6%'),
                                    height: hp('3%')
                                }}
                            />
                        </TouchableOpacity>

                        <CountryPicker
                            withCallingCode
                            withFilter
                            withAlphaFilter
                            countryCode={countryCode1}
                            visible={showCountryPicker1}
                            onSelect={onSelect1}
                            withFlagButton={false}
                            onClose={() => setShowCountryPicker1(false)}
                        />

                        <TextInput
                            style={[styles1.textInput, {
                                flex: 1,
                                borderWidth: 1,
                                borderRadius: wp('2%'),
                                borderColor: '#ccc',
                                paddingHorizontal: wp('3%'),
                                paddingVertical: hp('1.5%'),
                                fontSize: hp('1.8%')
                            }]}
                            placeholder="Parents / Guardian Number"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            maxLength={10}
                            value={parentNumber}
                            onChangeText={(text) => {
                                if (/^\d{0,10}$/.test(text)) setParentNumber(text);
                            }}
                        />
                    </View>
                </View>

                {/* WhatsApp Number */}
                <View style={{ marginTop: hp('-2%'), marginHorizontal: wp('0%') }}>

                    <Text style={[styles1.textt, { fontSize: hp('1.8%') }]}>WhatsApp Number</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: hp('1%')
                    }}>
                        <TouchableOpacity
                            onPress={() => setShowCountryPicker2(true)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderRadius: wp('2%'),
                                borderColor: '#ccc',
                                paddingHorizontal: wp('2%'),
                                paddingVertical: hp('1.5%'),
                                justifyContent: 'space-between',
                                width: wp('20%'),
                                marginRight: wp('2%'),
                            }}
                        >
                            <Text style={{ color: '#000', fontSize: hp('1.8%') }}>+{callingCode2}</Text>
                            <Image
                                source={downarrow?.Icon15}
                                style={{
                                    width: wp('6%'),
                                    height: hp('3%')
                                }}
                            />
                        </TouchableOpacity>

                        <CountryPicker
                            withCallingCode
                            withFilter
                            withAlphaFilter
                            countryCode={countryCode2}
                            visible={showCountryPicker2}
                            onSelect={onSelect2}
                            withFlagButton={false}
                            onClose={() => setShowCountryPicker2(false)}
                        />

                        <TextInput
                            style={[styles1.textInput, {
                                flex: 1,
                                borderWidth: 1,
                                borderRadius: wp('2%'),
                                borderColor: '#ccc',
                                paddingHorizontal: wp('3%'),
                                paddingVertical: hp('1.5%'),
                                fontSize: hp('1.8%')
                            }]}
                            placeholder="Bride / Groom Number"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            maxLength={10}
                            value={whatsappNumber}
                            onChangeText={(text) => {
                                if (/^\d{0,10}$/.test(text)) setWhatsappNumber(text);
                            }}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.emgaborder122, {
                        backgroundColor: isFormValid ? '#FF7E00' : '#ccc',
                        marginTop: hp('2%'),
                        paddingVertical: hp('0%'),
                        width: wp('50%'),
                        alignSelf: 'center'
                    }]}
                    onPress={handleSubmit}
                    disabled={!isFormValid || loading}
                >
                    <Text style={[styles.modalText11, { fontSize: hp('2%') }]}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Text>
                </TouchableOpacity>

                <View style={{
                    flexDirection: 'row',
                    marginTop: hp('5%'),
                    alignSelf: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        color: 'black',
                        fontSize: hp('1.7%'),
                        fontFamily: 'Lexend-Regular'
                    }}>
                        By signing up, you agree to our{' '}
                    </Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Screen46')}>
                        <Text style={{
                            color: '#FF7E00',
                            fontSize: hp('1.7%'),
                            fontFamily: 'Lexend-Regular'

                        }}>
                            Privacy Policy
                        </Text>
                    </TouchableOpacity>
                    <Text style={{
                        color: 'black',
                        fontSize: hp('1.7%'),
                        fontFamily: 'Lexend-Regular'
                    }}>
                        {' '}and
                    </Text>
                </View>

                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignSelf: 'center'
                    }}
                    onPress={() => props.navigation.navigate('Screen45')}
                >
                    <Text style={{
                        color: '#FF7E00',
                        fontSize: hp('1.7%'),
                        fontFamily: 'Lexend-Regular',
                        marginTop: hp('0.5%')
                    }}>
                        Terms of Service.
                    </Text>
                </TouchableOpacity>
                </ScrollView>
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3000}
                    action={{ label: 'Close', onPress: () => setSnackbarVisible(false) }}
                    style={{ marginBottom: hp('2%') }}
                >
                    {snackbarMessage}
                </Snackbar>
            </View>
        </SafeAreaView>
    );
};

export default Screen7;