import React from "react";
import { View, Text, StyleSheet, Image, ScrollView,StatusBar,TouchableOpacity } from "react-native";
import { arrow } from "../../../utils/constants/icons/icon";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Screen66 = (props:any) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{backgroundColor:'#FF7E00',paddingVertical:15,flexDirection:'row',paddingTop:"4%",}}>
    <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
        </TouchableOpacity>
      <Text style={styles.header}>Pay Us</Text>
</View>
      <View style={styles.paymentOptionsContainer}>
        {/* GPay */}
        <View style={styles.paymentOption}>
          <Text style={styles.paymentTitle}>GPay</Text>
          <Image
            source={require("../../../assets/images/QR.png")} // Replace with your QR code file
            style={styles.qrImage}
            resizeMode="contain"
          />
          <Text style={styles.paymentSubtitle}>Pay via UPI ID</Text>
          <Text style={styles.paymentDetail}>9033791538@ybl</Text>
        </View>

        {/* PhonePe */}
        <View style={styles.paymentOption}>
          <Text style={styles.paymentTitle}>PhonePe</Text>
          <Image
            source={require("../../../assets/images/QR2.png")} // Replace with your QR code file
            style={styles.qrImage}
            resizeMode="contain"
          />
          <Text style={styles.paymentSubtitle}>Pay via UPI ID</Text>
          <Text style={styles.paymentDetail}>karanshah101098@oksbi</Text>
        </View>
      </View>

      {/* Bank Transfer Details */}
      <View style={styles.bankDetails}>
        <Text style={styles.paymentSubtitle}>Transfer to Bank Account</Text>
        <Text style={styles.paymentDetail}>Account Name: Sign Vision</Text>
        <Text style={styles.paymentDetail}>Account Number: 50200062278864</Text>
        <Text style={styles.paymentDetail}>IFSC Code: HDFC0003904</Text>
        <Text style={styles.paymentDetail}>Branch: Sola Road, Ahmedabad</Text>
        <Text style={styles.paymentDetail}>Account Type: Current</Text>
      </View>

      <Text style={styles.footer}>
        Membership is ₹3000/year. Please make payment and send payment screenshot on{" "}
        <Text style={styles.contactNumber}>+91 6353294663</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    arrowstyle: {
      height: hp('2.2%'),
      width: wp('6%'),
      marginTop: hp('1.2%'),
      tintColor: 'white',
      marginRight: wp('30%'),
      marginLeft: wp('5%'),
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      fontSize: hp('2.8%'),
      color: 'white',
      textAlign: 'center',
      marginBottom: hp('1.8%'),
      fontFamily: 'Lexend-Medium',
    },
    paymentOptionsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: hp('2.5%'),
      marginTop: hp('3.5%'),
    },
    paymentOption: {
      alignItems: "center",
      width: wp('45%'),
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: wp('4%'),
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    paymentTitle: {
      fontSize: hp('2.2%'),
      fontFamily: "Lexend-Medium",
      color: "#333",
      marginBottom: hp('1.2%'),
    },
    qrImage: {
      width: wp('30%'),
      height: wp('30%'),
      marginBottom: hp('1.2%'),
    },
    paymentSubtitle: {
      fontSize: hp('1.8%'),
      fontFamily: "Lexend-Medium",
      color: "#666",
      marginBottom: hp('0.8%'),
    },
    paymentDetail: {
      fontSize: hp('1.8%'),
      fontFamily: "Lexend-Medium",
      color: "#000",
      textAlign: "center",
    },
    bankDetails: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: wp('4%'),
      marginBottom: hp('2.5%'),
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    footer: {
      fontSize: hp('1.8%'),
      fontFamily: "Lexend-Medium",
      color: "#333",
      textAlign: "center",
      marginTop: hp('2.5%'),
    },
    contactNumber: {
      color: "#D2691E",
      fontWeight: "bold",
      fontFamily: "Lexend-Medium",
    },
  });
  
  export default Screen66;