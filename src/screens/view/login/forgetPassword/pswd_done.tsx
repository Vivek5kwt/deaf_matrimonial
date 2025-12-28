import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import {  arrow } from '../../../../utils/constants/icons/icon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Screen50 = (props: any) => {
    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backButton}>
                <Image style={styles.icon2} source={arrow?.Icon5} />
            </TouchableOpacity>

            <View style={styles.animationContainer}>
                <LottieView
                    source={require('../../../../assets/animations/ok.json')} 
                    autoPlay
                    loop={false}
                    style={styles.animation}
                />
            </View>

            <View style={{ alignItems: 'center' }}>
                <Text style={styles.infoText2}>Congrats!</Text>
                <Text style={styles.infoText}>Password sent successfully</Text>
            </View>

            <TouchableOpacity onPress={() => props.navigation.navigate('Screen3')} style={styles.nextButton}>
                <Text style={styles.nextButtonText}>Back to login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 10,
    },
    icon2: {  height: hp('2.2%'),
                  width: wp('5.5%'),
                  marginTop: hp('3%'),
                  marginLeft: wp('4%') 
    },
    animationContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:"-40%"
    },
    animation: {
        width: 200,
        height: 200,
    },
    infoText: {
        color: '#5BB450',
        fontSize: 22,
        fontFamily: 'Lexend-Regular',
        textAlign: 'center',
    },
    infoText2: {
        color: 'black',
        fontSize: 27,
        fontWeight: '600',
        fontFamily: 'Lexend-Medium',
        marginBottom: 10,
    },
    nextButton: {
        marginTop: 30,
        backgroundColor: '#FFA500',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 15,
    },
    nextButtonText: {
        fontSize: 17,
        fontWeight: '500',
        color: 'white',
        fontFamily: 'Lexend-Medium',
    },
});

export default Screen50;
