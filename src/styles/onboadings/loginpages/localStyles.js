
import { StyleSheet, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const localStyles = StyleSheet.create({
    otpBoxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        marginTop: 20,
        marginBottom: 20,
      },
      otpBox: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'Lexend-Medium',
      },
      
    mobileInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: hp('1%'),
      paddingHorizontal: wp('5%'),
      marginBottom:hp('-1%'),
    },
    mobileInput: {
      flex: 1,
      height: hp('4.5%'),
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: hp('3%'),
      paddingHorizontal: wp('3.4%'),
      marginRight: wp('2%'),
      fontFamily: 'Lexend-Regular',
      marginHorizontal:"6%"
    },
    sendOtpButton: {
      backgroundColor: '#FF8000',
      paddingHorizontal: wp('2%'),
      height: hp('4.5%'),
      borderRadius: hp('3%'),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight:"6%"

    },
    sendOtpText: {
      color: 'white',
      fontFamily: 'Lexend-Regular',
      fontSize: hp('1.1%'),
    },
    otpTitle: {
      fontFamily: 'Lexend-Bold',
      fontSize: hp('2.5%'),
      textAlign: 'center',
      marginBottom: hp('1%'),
    },
    otpSubtitle: {
      fontFamily: 'Lexend-Regular',
      fontSize: hp('1.8%'),
      textAlign: 'center',
      marginBottom: hp('3%'),
      color: '#666',
    },
    otpInput: {
      height: hp('5%'),
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: hp('1%'),
      paddingHorizontal: wp('3%'),
      marginBottom: hp('3%'),
      textAlign: 'center',
      fontFamily: 'Lexend-Regular',
      fontSize: hp('2.5%'),
    },
    verifyButton: {
        backgroundColor: '#FF8000',
        height: hp('6%'),
      borderRadius: hp('1%'),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp('2%'),
    },
    verifyButtonText: {
      color: 'white',
      fontFamily: 'Lexend-Bold',
      fontSize: hp('2%'),
    },
    resendButton: {
      alignSelf: 'center',
    },
    resendText: {
      color: '#FF8000',
      fontFamily: 'Lexend-Regular',
      fontSize: hp('1.8%'),
      textDecorationLine: 'underline',
    },
  });
  
  export default localStyles;