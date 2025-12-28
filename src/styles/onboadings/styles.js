import { StyleSheet, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const styles = StyleSheet.create({
    centeredModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      centeredImagePickerModal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: hp(2),
        alignItems: 'center',
        elevation: 5,
      },
      modalTitle: {
        fontWeight: 'bold',
        marginBottom: hp(1.5),
      },
      optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        alignSelf: 'stretch',
        paddingHorizontal: wp(4),
      },
      optionIcon: {
        resizeMode: 'contain',
      },
      optionText: {
        color: '#000',
      },
      divider: {
        // width: '100%',
        // backgroundColor: '#ccc',
        // marginVertical: hp(1),
      },
      cancelButton: {
        alignSelf: 'stretch',
        alignItems: 'center',
      },
      cancelText: {
        color: 'red',
      },
    bottomSheetContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      
      bottomSheetContent: {
        backgroundColor: '#fff',
        paddingVertical: hp('3%'),
        paddingHorizontal: wp('5%'),
        borderTopLeftRadius: wp('6%'),
        borderTopRightRadius: wp('6%'),
        elevation: 5,
      },
    messageBox: {
        position: 'absolute',
        bottom: hp('6%'),
        left: wp('5%'),
        right: wp('5%'),
        padding: wp('2.5%'),
        backgroundColor: '#D3D3D3',
        borderRadius: wp('2.5%'),
        alignItems: 'center',
    },
    messageText: {
        fontFamily: 'Lexend-Medium',
        fontSize: hp('1.5%'),
        textAlign: 'center',
    },
    successText: {
        color: 'green',
    },
    errorText: {
        color: 'red',
    },
    okaImage: {
        position: 'absolute',
        bottom: hp('-2.5%'),
        alignSelf: 'center',
        width: wp('95%'),
    },
    coverImage: {
        width: wp('100%'),
        height: hp('14%'),
    },
    modal2overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    modal2Content: {
        backgroundColor: '#fff',
        width: wp('87%'),
        height: '100%',
        paddingTop: hp('7%'),
        paddingLeft: wp('5%'),
        borderTopRightRadius: wp('2.5%'),
        borderBottomRightRadius: wp('2.5%'),
    },
    roundImageContainer: {
        marginTop: hp('-5%'),
        alignSelf: 'center',
        marginBottom: hp('1.2%'),
        borderRadius: hp('9.5%'),
        overflow: 'hidden',
        width: hp('15%'),
        height: hp('15%'),
    },
    roundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        backgroundColor: 'F5F5F5',

    },
    orangecontainer: {
        flex: 1,
        backgroundColor: '#FF7E00',
    },
    containergrey: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    imageView: {
        flex: 1,
    },
    imageStyle11: {
        width: wp('100%'),
        height: hp('16%'),
        position: 'absolute',
        top: 0,
    },
    imageStyle1: {
        width: wp('100%'),
        height: hp('16%'),
        position: 'absolute',
        top: hp('3.7%'),
    },
    imageStyle2: {
        width: wp('80%'),
        height: hp('20%'),
        alignSelf: 'center',
        position: 'absolute',
        top: hp('30%'),
    },
    imageStyle3: {
        width: wp('100%'),
        height: hp('40%'),
        position: 'absolute',
        bottom: 0,
    },
    onbordingpageViewText: {
        position: 'absolute',
        bottom: hp('10%'),
        alignSelf: 'center'
    },
    blackViewText1: {
        position: 'absolute',
        // bottom: hp('-25%'),
        alignSelf: 'center',
        fontFamily: 'Lexend-Regular',
        color: 'black',
        marginHorizontal: wp('14%'),
        justifyContent: 'center',
        alignSelf: "center",
    },
    blackViewText11: {
        position: 'absolute',
        bottom: hp('0%'),
        alignSelf: 'center',
        fontFamily: 'Lexend-Regular',
        color: 'black',
        marginHorizontal: wp('15%'),
        justifyContent: 'center',
        alignSelf: "center",
    },
    blackViewText: {
        position: 'absolute',
        bottom: hp('-25%'),
        alignSelf: 'center',
        fontFamily: 'Lexend-Regular',
        color: 'black',
        marginHorizontal: wp('14%'),
        justifyContent: 'center',
        alignSelf: "center",
    },
    blackVi: {
        position: 'absolute',
        bottom: hp('-4%'),
        alignSelf: 'center',
        fontFamily: 'Lexend-Regular',
        color: 'black',
        marginHorizontal: wp('14%'),
        justifyContent: 'center',
        alignSelf: "center",
    },
    blackVii: {
        position: 'absolute',
        bottom: hp('-6%'),
        alignSelf: 'center',
        fontFamily: 'Lexend-Regular',
        color: 'black',
        marginHorizontal: wp('14%'),
        justifyContent: 'center',
        alignSelf: "center",
    },
    blackViewText90: {
        position: 'absolute',
        bottom: hp('-4%'),
        alignSelf: 'center',
        fontFamily: 'Lexend-Regular',
        color: 'black',
        marginHorizontal: wp('14%'),
        justifyContent: 'center',
        alignSelf: "center",
    },
    blackViewText2: {
        position: 'absolute',
        bottom: hp('-40%'),
        alignSelf: 'center',
        fontFamily: 'Lexend-Regular',
        color: 'black',
        marginHorizontal: wp('15%'),
        justifyContent: 'center',
        alignSelf: "center",
    },
    onbordingpageText: {
        fontFamily: 'Lexend-Medium',
        color: 'white',
        fontSize: hp('1.9%'),
        textAlign: 'center',
    },
    letsbegin: {
        alignContent: 'center',
        borderRadius: hp('3.8%'),
        borderWidth: 1,
        padding: hp('1.7%'),
        paddingHorizontal: wp('5%'),
        marginTop: hp('2.5%'),
        borderColor: 'white',
        backgroundColor: 'white'
    },
    onbordingpageText2: {
        fontFamily: 'Lexend-Medium',
        color: '#499202',
        fontSize: hp('1.9%'),
        textAlign: 'center',
    },
    accountlogin: {
        alignContent: 'center',
        borderRadius: hp('3.8%'),
        borderWidth: 1,
        padding: hp('1.7%'),
        paddingHorizontal: wp('5%'),
        marginTop: hp('1.2%'),
        borderColor: 'white'
    },
    accountloginn1: {
        alignContent: 'center',
        borderRadius: hp('3.8%'),
        borderWidth: 1,
        padding: hp('1.7%'),
        paddingHorizontal: wp('5%'),
        marginTop: hp('1.2%'),
        borderColor: 'white'
    },
    onbordingpageText3: {
        fontFamily: 'Lexend-Medium',
        color: 'white',
        fontSize: hp('1.9%'),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: wp('5%'),
        borderTopRightRadius: wp('5%'),
        padding: wp('5%'),
        alignItems: 'center',
        paddingVertical: hp('5%'),
    },
    modalContentt1: {
        height: hp('35%'),
        backgroundColor: 'white',
        borderTopLeftRadius: wp('5%'),
        borderTopRightRadius: wp('5%'),
        padding: wp('5%'),
        alignItems: 'center',
    },
    modalText: {
        fontSize: hp('2.1%'),
        marginVertical: hp('1.2%'),
        color: 'black',
        fontFamily: 'Lexend-Regular'
    },
    modalTextt: {
        fontSize: hp('1.9%'),
        marginVertical: hp('1.2%'),
        color: 'black',
        fontFamily: 'Lexend-Regular'
    },
    modalText11: {
        fontSize: hp('1.9%'),
        marginVertical: hp('1.2%'),
        color: 'white',
        fontFamily: 'Lexend-Medium',
    },
    buttond: {
        marginLeft: wp('1.2%'),
        fontSize: hp('1.9%'),
        color: '#FF7E00',
        fontFamily: 'Lexend-Medium',
        flexShrink: 1,
        textAlign: 'center',
    },
    modalT: {
        fontSize: hp('1.9%'),
        marginVertical: hp('1.2%'),
        color: '#FF7E00',
        fontFamily: 'Lexend-Medium',
    },
    closeButton: {
        marginTop: hp('2.5%'),
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('5%'),
        backgroundColor: '#FF7E00',
        borderRadius: hp('3.8%'),
    },
    closeButton1st: {
        marginTop: hp('0%'),
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('1.2%'),
        fontFamily: 'Lexend-Medium',
        color: 'black',

    },
    closeButtonText1: {
        color: 'black',
        fontSize: hp('1.7%'),
        fontFamily: 'Lexend-Regular',
        marginTop: hp('2.5%'),
        marginRight: wp('2%'),
    },
    emgaborder: {
        borderWidth: 1,
        borderRadius: hp('3.8%'),
        paddingHorizontal: wp('10%'),
        marginTop: hp('2.5%'),
        marginHorizontal: wp('2.5%'),
        flexDirection: 'row',
        width: wp('80%'),
        height: hp('5.6%'),
    },
    emgaborder1: {
        borderWidth: 2,
        borderRadius: hp('3.8%'),
        width: wp('70%'),
        marginTop: hp('2.5%'),
        marginHorizontal: wp('2.5%'),
        flexDirection: 'row',
        paddingVertical: wp('2%'),
        alignContent: 'center',
        alignSelf: 'center',
        borderColor: 'green'

    },
    emgabor: {
        borderWidth: 1,
        borderRadius: hp('3.8%'),
        paddingHorizontal: wp('8%'),
        marginTop: hp('2.5%'),
        marginHorizontal: wp('2.5%'),
        flexDirection: 'row',
        paddingTop: wp('2%'),

    },
    Crossicon: {
        position: 'absolute',
        right: wp('1.2%'),
    },
    Crossicon1: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        height: hp('2.2%'),
        width: wp('4.4%'),
        top: hp('1.9%'),
        tintColor: '#FF7E00',
        alignItems: 'flex-end'
    },
    emgaborder11: {
        borderWidth: 1,
        borderRadius: wp('1.2%'),
        marginTop: hp('2.5%'),
        flexDirection: 'row',
        marginTop: hp('5%'),
        paddingHorizontal: wp('5%'),
        borderColor: '#E6E6E6'
    },
    emgaborder111: {
        borderWidth: 1,
        borderRadius: wp('1.2%'),
        marginTop: hp('2.5%'),
        flexDirection: 'row',
        marginTop: hp('12%'),
        paddingHorizontal: wp('7%'),
        borderColor: '#E6E6E6'
    },
    emgaborder112: {
        borderWidth: 1,
        borderRadius: wp('1.2%'),
        flexDirection: 'row',
        marginTop: hp('6%'),
        paddingHorizontal: wp('7%'),
        borderColor: '#E6E6E6',
        justifyContent: 'center',
        marginHorizontal: wp('32%')
    },
    emgaborder122: {
        borderWidth: 1,
        borderRadius: hp('3.8%'),
        flexDirection: 'row',
        marginTop: hp('6%'),
        paddingHorizontal: wp('7%'),
        borderColor: '#E6E6E6',
        justifyContent: 'center',
        marginHorizontal: wp('20%'),
        backgroundColor: '#FF7E00',
    },
    emgaborder132: {
        borderWidth: 1,
        borderRadius: hp('3.8%'),
        flexDirection: 'row',
        marginTop: hp('6%'),
        paddingHorizontal: wp('7%'),
        borderColor: '#E6E6E6',
        justifyContent: 'center',
        marginHorizontal: wp('20%'),
        backgroundColor: '#FF7E00',
    },
    doccumentbutton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: hp('3.8%'),
        marginTop: hp('6%'),
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('5%'),
        borderColor: '#E6E6E6',
        width: wp('70%'),
        alignSelf: 'center',
    },
    emgabor: {
        borderWidth: 1,
        borderRadius: hp('3.8%'),
        flexDirection: 'row',
        marginTop: hp('6%'),
        paddingHorizontal: wp('7%'),
        borderColor: '#E6E6E6',
        justifyContent: 'center',
        marginHorizontal: wp('20%'),
    },
    emgaborder1324: {
        borderWidth: 1,
        borderRadius: hp('3.8%'),
        flexDirection: 'row',
        marginTop: hp('6%'),
        paddingHorizontal: wp('7%'),
        borderColor: '#E6E6E6',
        justifyContent: 'center',
        marginHorizontal: wp('10%'),
        backgroundColor: '#FF7E00',
        marginBottom: hp('25%')
    },
    cprofile: {
        borderWidth: 1,
        borderRadius: hp('3.8%'),
        flexDirection: 'row',
        marginTop: hp('6%'),
        paddingHorizontal: wp('7%'),
        borderColor: '#E6E6E6',
        justifyContent: 'center',
        marginHorizontal: wp('25%'),
        backgroundColor: '#FF7E00',
    },
    cprofile1: {
        borderWidth: 1,
        borderRadius: hp('3.8%'),
        flexDirection: 'row',
        marginTop: hp('6%'),
        paddingHorizontal: wp('7%'),
        borderColor: '#E6E6E6',
        justifyContent: 'center',
        backgroundColor: '#FF7E00',
        width: wp('45%'),
        margin: wp('1.2%')
    },
    addpic: {
        borderWidth: 1,
        borderRadius: hp('3.8%'),
        flexDirection: 'row',
        marginTop: hp('1%'),
        paddingHorizontal: wp('7%'),
        borderColor: '#E6E6E6',
        marginHorizontal: wp('13%'),
        backgroundColor: '#FF7E00',
        paddingVertical: hp('0.5%')
    },
    alreadyaccount: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: hp('2%'),

    },
    logostyle: {
        height: hp('3%'),
        width: wp('5.5%'),
        margin: hp('1.1%'),
        marginRight: wp('5%'),
    },
    logostyle21: {
        height: hp('2.7%'),
        width: wp('5.2%'),
        margin: hp('1.1%'),
    },
    arrowstyle: {
        height: hp('2.2%'),
        width: wp('5.5%'),
        marginTop: hp('3%'),
        marginLeft: wp('1%'),
    },
    arrowstyle3: {
        height: hp('2.2%'),
        width: wp('5.7%'),
        tintColor: 'white',
        marginTop: hp('1.5%'),
        marginLeft: hp('-1.5%'),


    },
    loginText: {
        fontSize: hp('2.2%'),
        marginTop: hp('5%'),
        fontFamily: 'Lexend-Medium',
        color: "black"
    },
    textinput: {
        color: "black",
        fontSize: hp('1.9%'),
        fontFamily: 'Lexend-Regular',
        marginLeft: wp('5%')
    },
    textviewinput: {
        borderWidth: 1.5,
        borderColor: "#E6E6E6",
        borderRadius: wp('2.5%'),
        marginTop: hp('3.1%'),
        paddingVertical: hp('0.7%'),
    },
    textunderline: {
        textDecorationLine: "underline",
        fontFamily: 'Lexend-Medium',
        color: 'black',
        marginTop: hp('1.5%'),
    },
    textunderline2: {
        textDecorationLine: "underline",
        fontFamily: 'Lexend-Regular',
        alignSelf: 'center',
        marginTop: hp('1.9%'),
        fontSize: hp('1.6%'),
        color: "black"

    },
    Continue: {
        fontSize: hp('2.1%'),
        fontFamily: 'Lexend-Regular',
        color: "black"
    },
    Continueview: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('5%')
    },
    countryCodeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: hp('1.2%'),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: wp('1.2%'),
        marginRight: wp('2.5%'),
        backgroundColor: '#f9f9f9',
    },
    countryPickerContainer: {
        marginHorizontal: wp('1.2%'),
    },
    countryCodeText: {
        fontSize: hp('2%'),
        color: '#333',
    },


    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        width: wp('80%'),
        maxHeight: hp('60%'),
        backgroundColor: '#fff',
        borderRadius: wp(3),
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },

    modalItem: {
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },

    modalItemText: {
        fontSize: wp(4),
        color: '#000',
        fontFamily: 'Lexend-Regular',
    },

    emptyText: {
        textAlign: 'center',
        marginTop: hp(2),
        color: '#888',
        fontSize: wp(3.5),
    },
    // modalOverlay: {
    //     flex: 1,
    //     backgroundColor: 'rgba(0,0,0,0.5)',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    imagePickerModal: {
        width: wp('80%'),
        backgroundColor: 'white',
        borderRadius: wp('3.7%'),
        padding: wp('5%'),
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: hp('2.2%'),
        marginBottom: hp('2.5%'),
        fontFamily: "Lexend-Medium",
        color: '#333',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: hp('1.9%'),
        borderBottomWidth: 1,
        borderRadius:5,
        borderBottomColor: '#eee',
    },
    optionIcon: {
        width: wp('6%'),
        height: hp('3%'),
        marginRight: wp('3.7%'),
        tintColor: '#FF7E00',
    },
    optionText: {
        fontSize: hp('2%'),
        fontFamily: "Lexend-Regular",
        color: '#333',
    },
    loadingModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingModalContent: {
        width: wp('80%'),
        backgroundColor: 'white',
        borderRadius: wp('5%'),
        padding: hp('4.3%'),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    loadingModalLogo: {
        width: wp('25%'),
        height: hp('12.5%'),
        marginBottom: hp('2.5%'),
    },
    loadingSpinner: {
        marginBottom: hp('2.5%'),
    },
    loadingModalText: {
        fontSize: hp('2.2%'),
        fontFamily: "Lexend-Medium",
        marginBottom: hp('1.2%'),
        textAlign: 'center',
    },
    loadingModalSubText: {
        fontSize: hp('1.7%'),
        textAlign: 'center',
        color: 'gray',
        fontFamily: "Lexend-Medium",
    },
    cancelButton: {
        width: '100%',
        padding: hp('1.9%'),
        alignItems: 'center',
        marginTop: hp('1.2%'),
    },
    cancelText: {
        fontSize: hp('2%'),
        color: '#FF7E00',
        fontFamily: "Lexend-Medium",
    },
    eyeIconContainer: {
        position: 'absolute',
        right: wp('3.7%'),
        top: hp('2.5%'),
    },
    showPasswordIcon: {
        width: wp('5.4%'),
        height: hp('1.9%'),
    },
    showPasswordIcon1: {
        width: wp('5.7%'),
        height: hp('2.7%'),
    },
    hidePasswordIcon: {
        width: wp('5.5%'),
        height: hp('2.7%'),

    },
    hidePasswordIcon1: {
        width: wp('5.9%'),
        height: hp('1.9%'),

    },
    shadowBox: {
        backgroundColor: '#fff',
        borderRadius: wp('2.5%'),
        ...Platform.select({
            ios: {
                shadowColor: '#808eff',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.7,
                shadowRadius: 15,
            },
            android: {
                elevation: 22,
                shadowColor: '#808eff',
            },
        }),
    },
    dropdownText: {
        fontSize: hp('1.7%'),
        color: '#000000',
        fontFamily: "Lexend-Regular",
        paddingVertical: hp('1.5%'),
        marginLeft: hp('0.5%'),

    },
    modalItem: {
        padding: hp('1.9%'),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalItemText: {
        fontSize: hp('2%'),
        color: '#000',
        fontFamily: "Lexend-Regular",
    },
    emptyText: {
        textAlign: 'center',
        padding: hp('2.5%'),
        color: '#666',
    },
    modalContainer1: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent1: {
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: wp('5%'),
        borderTopRightRadius: wp('5%'),
        paddingVertical: hp('2.5%'),
        paddingHorizontal: wp('3.7%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    logostyle1: {
        width: wp('5%'),
        height: hp('2%'),
        marginRight: wp('2.5%'),
        resizeMode: 'contain',
        marginTop: hp('0.5%'),
        marginLeft: wp('12%'),


    },
    modalText1: {
        fontSize: hp('2%'),
        color: '#000',
        fontFamily: 'Lexend-Medium',
    },
    modalText121: {
        fontSize: hp('1.8%'),
        color: '#000',
        fontFamily: 'Lexend-Medium',


    },
    alreadyaccount1: {
        flexDirection: 'row',
        marginTop: hp('2.5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText11: {
        fontSize: hp('1.7%'),
        color: '#000',
        marginRight: wp('1.2%'),
        fontFamily: 'Lexend-Medium',
    },
    closeButton1st1: {
        backgroundColor: '#FF8000',
        borderRadius: wp('5%'),
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('0.7%'),
        fontFamily: 'Lexend-Medium',
        color: 'white'
    },
});

export default styles;