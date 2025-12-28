import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import { arrow } from "../../../utils/constants/icons/icon";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Screen63 = (props: any) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        contact: '',
        subject: '',
        query: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        contact: '',
        fullName: ''
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [token, setToken] = useState('');

    useEffect(() => {
        // Check if all fields are filled and valid
        const allFieldsFilled = Object.values(formData).every(field => field.trim() !== '');
        const noErrors = Object.values(errors).every(error => error === '');
        setIsButtonDisabled(!allFieldsFilled || !noErrors);
    }, [formData, errors]);

    useEffect(() => {
        // Get token from AsyncStorage when component mounts
        const getToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token') || await AsyncStorage.getItem('auth_token');
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                Snackbar.show({ 
                    text: 'Failed to get authentication token', 
                    duration: Snackbar.LENGTH_SHORT 
                });
            }
        };
        getToken();
    }, []);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateContact = (contact: string) => {
        const re = /^\d{10}$/;
        return re.test(contact);
    };

    const validateName = (name: string) => {
        const re = /^[a-zA-Z ]+$/;
        return re.test(name);
    };

    const handleInputChange = (field: string, value: string) => {
        // Validation logic
        let error = '';
        
        if (field === 'email' && value.trim() !== '' && !validateEmail(value)) {
            error = 'Please enter a valid email address';
        }
        
        if (field === 'contact') {
            if (isNaN(Number(value)) && value !== '') {
                error = 'Contact number must contain only digits';
            } else if (value.trim() !== '' && !validateContact(value)) {
                error = 'Contact number must be 10 digits';
            }
        }
        
        if (field === 'fullName' && value.trim() !== '' && !validateName(value)) {
            error = 'Name should contain only letters and spaces';
        }
        
        setErrors({ ...errors, [field]: error });
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (isButtonDisabled) return;
    
        if (!token) {
            Snackbar.show({ 
                text: 'Authentication token not found. Please login again.', 
                duration: Snackbar.LENGTH_SHORT 
            });
            return;
        }
    
        try {
            const response = await fetch('http://82.29.161.246:8002/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.fullName,
                    email: formData.email,
                    mobile: formData.contact,
                    subject: formData.subject,
                    query: formData.subject   // ✅ Same value for query and subject
                }),
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                Snackbar.show({ 
                    text: responseData.message || 'Query submitted successfully!', 
                    duration: Snackbar.LENGTH_SHORT 
                });
    
                // ✅ Optional: you can log feedback or use it somewhere
                console.log('Submitted Feedback:', responseData.feedback);
    
                setFormData({ 
                    fullName: '', 
                    email: '', 
                    contact: '', 
                    subject: '', 
                    query: '' 
                });
            } else {
                Snackbar.show({ 
                    text: responseData?.message || 'Submission failed. Please try again.', 
                    duration: Snackbar.LENGTH_SHORT 
                });
            }
        } catch (error) {
            Snackbar.show({ 
                text: 'Network error. Please check your connection and try again.', 
                duration: Snackbar.LENGTH_SHORT 
            });
        }
    };
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <View style={{ backgroundColor: '#FF7E00', paddingTop:"5%", paddingHorizontal: "5%"}}>
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
                </TouchableOpacity>
                <Text style={styles.startConversationText}>Contact Us</Text>
                </View>
                <Text style={styles.boldText1}>Feel free to contact us you can ask your questions and query here.</Text>
            </View>
            <ScrollView
                style={styles.container2}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.contactSection}>
                    <Text style={styles.heading}>Main Branch Address</Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.boldText}>Company Name:</Text> Sign Vision
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.boldText}>Email:</Text> info@deafmatrimonial.com
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.boldText}>Contact no:</Text> +91-6353294663 (Deaf) (WhatsApp Only)
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.boldText}>Phone:</Text> +91-8141200284 (Hearing)
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.boldText}>Website:</Text> www.deafmatrimonial.com
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.boldText}>Office Address:</Text> Ahmedabad, Gujarat, India
                    </Text>
                </View>

                {/* Feedback Form Section */}
                <View style={styles.feedbackSection}>
                    <Text style={styles.heading}>Ask query or give us feedback</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Full Name Here"
                        placeholderTextColor="#888"
                        value={formData.fullName}
                        onChangeText={(text) => handleInputChange("fullName", text)}
                    />
                    {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Email Id Here"
                        placeholderTextColor="#888"
                        value={formData.email}
                        onChangeText={(text) => handleInputChange("email", text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Contact No Here"
                        placeholderTextColor="#888"
                        value={formData.contact}
                        onChangeText={(text) => handleInputChange("contact", text)}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                    {errors.contact ? <Text style={styles.errorText}>{errors.contact}</Text> : null}

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Subject Here"
                        placeholderTextColor="#888"
                        value={formData.subject}
                        onChangeText={(text) => handleInputChange("subject", text)}
                    />

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter Your Query Here"
                        placeholderTextColor="#888"
                        multiline
                        value={formData.query}
                        onChangeText={(text) => handleInputChange("query", text)}
                    />

                    <TouchableOpacity 
                        style={[styles.submitButton, isButtonDisabled && styles.disabledButton]} 
                        onPress={handleSubmit}
                        disabled={isButtonDisabled}
                    >
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      container2: {
        flex: 1,
      },
      arrowstyle: {
        height: hp('2.5%'),
        width: wp('6%'),
        marginRight: wp('5%'),
        marginTop: hp('0.8%'),
        tintColor: 'white',
      },
      startConversationText: {
        color: '#fff',
        fontSize: wp('5%'),
        fontFamily: 'Lexend-Medium',
        marginBottom: hp('1.5%'),
        marginLeft: wp('20%'),
      },
      boldText1: {
        color: '#fff',
        fontSize: wp('3.5%'),
        marginBottom: hp('2%'),
        fontFamily: 'Lexend-Medium',
      },
      contactSection: {
        padding: wp('5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      heading: {
        fontSize: wp('4.5%'),
        fontFamily: 'Lexend-Medium',
        marginBottom: hp('2%'),
        color: '#333',
      },
      infoText: {
        fontSize: wp('3.5%'),
        marginBottom: hp('1%'),
        color: '#555',
        fontFamily: 'Lexend-Regular',
      },
      boldText: {
        fontFamily: 'Lexend-Medium',
      },
      feedbackSection: {
        padding: wp('5%'),
      },
      input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: wp('2%'),
        padding: wp('4%'),
        marginBottom: hp('0.8%'),
        fontSize: wp('3.5%'),
        fontFamily: 'Lexend-Regular',
      },
      textArea: {
        height: hp('13%'),
        textAlignVertical: 'top',
      },
      submitButton: {
        backgroundColor: '#FF7E00',
        padding: hp('1.2%'),
        borderRadius: wp('4%'),
        alignItems: 'center',
        width: wp('40%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
      },
      disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.7,
      },
      submitText: {
        color: '#fff',
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium',
      },
      errorText: {
        color: 'red',
        fontSize: wp('3%'),
        marginBottom: hp('1%'),
        fontFamily: 'Lexend-Regular',
      },
});

export default Screen63;