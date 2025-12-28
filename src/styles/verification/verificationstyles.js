import { StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const verificationstyles = StyleSheet.create({
    
    imageBox: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    uploadPrompt: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        marginTop: 10,
        color: '#666',
        fontSize: 14,
        fontFamily: 'Lexend-Regular',
    },
    removeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'red',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Lexend-Medium',
        lineHeight: 20,
    },
    labelText: {
        fontSize: 16,
        fontFamily: 'Lexend-Medium',
        color: '#333',
    },
        bottomHeaderContainer: {
            // Add some extra space if needed
            backgroundColor: '#fff', // or whatever your bottom container background is
          
          
    },
    dividerLine: {
        height: hp(0.2),
        backgroundColor: '#d3d3d3',
        marginVertical: hp(1),
        marginHorizontal: wp(-8),
    },
    dividerLine22: {
        height: hp(0.2),
        backgroundColor: '#d3d3d3',
        marginVertical: hp(1),
        marginHorizontal: 0,
        marginBottom: hp(-0.6)
    },
    dividerLine3: {
        height: hp(0.2),
        backgroundColor: '#d3d3d3',
        marginVertical: hp(1),
        marginRight: wp(8)
    },
    button: {
        backgroundColor: 'white',
        padding: hp(0.6),
        paddingHorizontal: wp(8),
        borderRadius: wp(5),
        marginTop: hp(1.2),
        borderWidth: 1,
        borderColor: '#FF7E00',
    },
    buttonText: {
        color: '#FF7E00',
        fontSize: hp(1.7),
        fontFamily: 'Lexend-Medium'
    },
    modalOverlayy: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: hp(0.6),
    },
    modalContentt: {
        backgroundColor: '#F3F3F3',
        width: '100%',
        height: '85%',
        alignItems: 'center',
    },
    modalTitlee: {
        fontSize: hp(2.2),
        fontWeight: 'bold',
        marginBottom: hp(2.5),
    },
    closeButton: {
        backgroundColor: '#FF7E00',
        paddingVertical: hp(0.6),
        paddingHorizontal: wp(5),
        borderRadius: wp(7.5),
    },
    closeButtonText: {
        color: 'white',
        fontSize: hp(1.7),
        fontFamily: 'Lexend-Medium',
    },
    textlogo: {
        color: "white",
        fontFamily: 'Lexend-Medium',
    },
    logoicons: {
        height: hp("3%"),
        width: wp("6%"),
        justifyContent: 'center',
        alignSelf: 'center'
    },
    logoiconsanimated: {
        height: hp("3.2%"),
        width: wp("6.2%"),
        justifyContent: 'center',
        alignSelf: 'center'
    },
    logoiconss: {
        height: hp("3.2%"),
        width: wp("6.2%"),
        justifyContent: 'center',
        alignSelf: 'center'
    },
    matchesimage: {
        height: hp("26%"),
        width: wp("37.5%"),
        borderRadius: wp(3.75),
        marginTop: hp(1.2),
    },
    Iconheight: {
        height: hp(5),
        width: wp(10),
    },
    Iconheighttt: {
        height: hp(2.5),
        width: wp(5),
    },
    Iconheightround: {
        height: hp(7.5),
        width: wp(15),
        marginLeft: wp(-2.5),
        marginVertical: hp(2.5),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        height: '60%',
        backgroundColor: '#EFEFEF',
        borderTopLeftRadius: wp(5),
        borderTopRightRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
        padding: hp(1.2),
    },
    modalText: {
        fontSize: hp(3),
        fontWeight: 'bold',
    },
    modalCloseText: {
        marginTop: hp(2.5),
        fontSize: hp(2.2),
        color: 'blue',
    },
    commonOfferText: {
        fontSize: hp(1.7),
        color: '#555',
        textDecorationLine: "line-through",
        marginBottom: hp(0.5),
        fontFamily: 'Lexend-Medium',
    },
    benefitIcon: {
        tintColor: 'green',
        height: hp(1.9),
        width: wp(5),
        marginTop: hp(0.6),
    },
    crossIcon: {
        height: hp(2),
        width: wp(4),
        alignSelf: 'center'
    },
    offerIcon: {
        height: hp(2.5),
        width: wp(5),
    },
    earthIcon: {
        height: hp(2),
        width: wp(6.5),
    },
    shortIcon: {
        height: hp(1.9),
        width: wp(3.75),
        marginLeft: wp(9),
    },
    shortIconstar: {
        height: hp(2.5),
        width: wp(5),
        justifyContent: 'center'
    },
    bellIcon: {
        height: hp(3),
        width: wp(6.25),
    },
    boldcrownicon: {
        height: hp(2.5),
        width: wp(5),
        marginHorizontal: wp(0.5)
    },
    backgroundImage: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: hp(5.6),
        paddingBottom: hp(1.2),
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: wp(5),
        marginTop: hp(1.2),
    },
    infoBox: {
        backgroundColor: 'white',
        width: wp(87.5),
        justifyContent: 'center',
        marginTop: hp(2.5),
        borderRadius: wp(5),
        height: "85%",
        alignSelf: 'center',
        marginHorizontal: wp(7.5),
    },
    infoHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    infoTextSilver: {
        color: 'black',
        fontFamily: 'Lexend-Medium',
        fontSize: hp(1.9),
        alignSelf: 'center',
    },
    infoTextMonth: {
        color: 'black',
        fontFamily: 'Lexend-Regular',
        fontSize: hp(1.7),
        alignSelf: 'center',
    },
    imageContainer: {
        marginVertical: hp(2.5),
    },
    orangeSlipImage: {
        height: hp(3.75),
        width: "70%",
        alignSelf: 'center',
    },
    autoRenewTextContainer: {
        position: 'absolute',
        right: "25%",
    },
    autoRenewText: {
        color: 'green',
        fontFamily: "Lexend-Medium",
        marginTop: hp(0.25),
    },
    priceText: {
        color: 'black',
        fontFamily: 'Lexend-Regular',
        fontSize: hp(3.1),
        alignSelf: 'center',
    },
    monthlyPriceText: {
        alignSelf: 'center',
        fontFamily: "Lexend-Medium",
        marginVertical: hp(0.6),
    },
    benefitsContainer: {
        justifyContent: "center",
        alignSelf: 'center',
        marginLeft: wp(7.5),
    },
    benefitRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: wp(-9.5)
    },
    benefitRow2: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: wp(-18.75),
    },
    benefitText: {
        color: 'black',
        fontFamily: 'Lexend-Medium',
        fontSize: hp(1.7),
        marginVertical: hp(0.25),
        marginLeft: wp(1.25),
    },
    additionalBenefitText: {
        color: '#BFBFBF',
        fontFamily: 'Lexend-Medium',
        fontSize: hp(1.7),
        marginVertical: hp(0.25),
        textDecorationLine: "line-through",
    },
    textnumberwhitee11: {
        color: 'white',
        fontSize: hp(2),
        fontFamily: 'Lexend-Bold',
        marginBottom: hp(1.9),
    },
    textnumberwhite: {
        color: 'white',
        fontSize: hp(2),
        fontFamily: 'Lexend-Bold'
    },
    textnumberwhite11: {
        color: 'white',
        fontSize: hp(1.25),
        fontFamily: 'Lexend-Bold',
        marginRight: wp(2.5),
    },
    imageLeft: {
        width: wp(67.5),
        height: hp(22.5),
        resizeMode: 'contain',
        marginLeft: wp(-2.5),
    },
    imageRight: {
        width: wp(30),
        height: hp(15),
        resizeMode: 'contain',
        marginTop: hp(8.75),
        marginLeft: wp(1.25)
    },
    abcd: {
        color: 'white',
        fontSize: hp(2),
        textAlign: 'center',
        fontWeight: 'bold',
    },
    circleContainer: {
        borderWidth: 1,
        borderRadius: wp(7.5),
        padding: hp(1.2),
        width: wp(10),
        height: hp(5),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
    },
    alphabetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: wp(10),
        marginTop: hp(2.5),
    },
    downarrow: {
        height: hp(3.75),
        width: wp(7.5),
        position: 'absolute',
        right: wp(1.25),
        top: hp(0.6)
    },
    questionstyle: {
        height: hp(2.25),
        width: wp(4.5),
        tintColor: '#E6E6E6',
        marginLeft: wp(1.25),
        marginTop: hp(0.25),
    },
    cprofileV: {
        borderWidth: 1,
        borderRadius: wp(7.5),
        flexDirection: 'row',
        marginTop: hp(18.75),
        paddingHorizontal: wp(7),
        borderColor: '#E6E6E6',
        justifyContent: 'center',
        marginHorizontal: wp(12.5),
        backgroundColor: '#FF7E00',
    },
    viewtextinputt: {
        borderWidth: 1,
        marginTop: hp(1.2),
        borderColor: "#E6E6E6",
        borderRadius: wp(2.5),
        height: '40%'
    },
    gallerystyle: {
        height: hp(4.4),
        width: wp(8.75),
        marginRight: wp(2),
        marginTop: hp(0.4),
    },
    gallerystyleee: {
        height: hp(4.4),
        width: wp(8.75),
        marginRight: wp(2),
        marginTop: hp(1),
    },
    gallerystyle1: {
        height: hp(3.75),
        width: wp(7.5),
        tintColor: '#FF7E00',
    },
    Ppicon: {
        height: hp(2.25),
        width: wp(4.5),
        marginRight: hp(1.2),
    },
    textnumberr2: {
        color: 'black',
        alignSelf: 'center',
        fontFamily: 'Lexend-Regular',
        fontSize: hp(1.7),
        alignContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(7.5),
        marginBottom: hp(0.75),
    },
    textnumber: {
        color: 'black',
        alignSelf: 'center',
        fontFamily: 'Lexend-Regular'
    },
    smalltextnumber: {
        color: '#5E5D65',
        alignSelf: 'center',
        fontFamily: 'Lexend-Regular',
        fontSize: hp(1.6),
        marginVertical: hp(1.2),
    },
    mobileicon1: {
        height: hp(10),
        width: wp(17.5),
        alignSelf: 'center',
        marginVertical: hp(5)
    },
    textverify: {
        color: 'white',
        fontSize: hp(1.9),
        fontFamily: 'Lexend-Medium',
        alignSelf: 'center',
        marginRight: "20%",
        marginTop: hp(1.2),
    },
    veryfytext: {
        fontFamily: 'Lexend-Regular',
        fontSize: hp(1.25)
    },
    DMcentre: {
        height: hp("7.5%"),
        width: wp("44.5%"),
    },
    logo: {
        width: wp(20),
        height: hp(10),
        resizeMode: 'contain',
    },
    skipText: {
        fontSize: hp(2),
        color: '#999',
        marginLeft: wp(1.25),
    },
    separator: {
        borderWidth: 1,
        borderColor: '#BFBFBF',
        marginVertical: hp(2.5),
    },
    headerText: {
        fontSize: hp(3),
        fontWeight: '600',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: hp(2.5),
        fontWeight: '500',
        textAlign: 'center',
    },
    descriptionText: {
        fontSize: hp(1.7),
        color: '#999',
        textAlign: 'center',
    },
    iconContainer: {
        marginTop: hp(2.5),
        marginBottom: hp(1.2),
    },
    heading: {
        fontSize: hp(2.25),
        fontWeight: '600',
        marginBottom: hp(1.2),
        color: '#333',
    },
    iconsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    iconBox: {
        width: wp(20),
        height: hp(12.5),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp(2.5),
        margin: hp(1.2),
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    iconImage: {
        width: wp(10),
        height: hp(5),
        resizeMode: 'contain',
    },
    iconText: {
        fontSize: hp(1.5),
        color: '#555',
        // marginTop: hp(0.6),
        textAlign: 'center',
        fontFamily: 'Lexend-Medium',

    },
    categoryHeading: {
        fontSize: hp(2),
        color: '#333',
        marginBottom: hp(1.2),
        fontFamily: 'Lexend-Medium',
        marginLeft: wp(1.25)
    },
    iconBox: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: hp(0.6),
        padding: hp(0.6),
        paddingHorizontal: wp(2.5),
        borderRadius: wp(5),
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#F9F9F9',
    },
    iconImageshort: {
        marginRight: wp(1.25),
    },
    viewMoreButton: {
        alignSelf: 'center',
        marginTop: hp(1.2),
        paddingHorizontal: wp(3.75),
        paddingVertical: hp(0.6),
        borderRadius: wp(1.25),
        backgroundColor: '#E8E8E8',
    },
    viewMoreText: {
        fontSize: hp(1.5),
        color: '#007BFF',
    },
    shorticons: {
        height: hp(2.5),
        width: wp(5),
        marginTop: hp(-6),
    },
    scrollContainer: {
        paddingBottom: hp(2.5),
    },
    containerBox: {
        borderWidth: 1,
        borderColor: '#00000040',
        borderRadius: wp(1.25),
        marginVertical: hp(1.2),
        padding: hp(1.2),
    },
    iconContainer: {
        backgroundColor: '#FDF1E3',
        alignItems: 'center',
        justifyContent: 'center',
        padding: hp(1.2),
        borderRadius: wp(5),
        marginLeft: wp(2.5),
    },
    arrowstyle: {
        width: wp(5),
        height: hp(2.5),
        marginRight: wp(2.5),
        tintColor: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: '#BFBFBF',
        marginVertical: hp(2.5),
    },
    basicDetailsContainer: {
        borderWidth: 1,
        borderColor: '#00000040',
        borderRadius: wp(1.25),
        paddingVertical: hp(1.2),
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(1.2),
        paddingHorizontal: wp(2.5),
    },
    girlimgstyle: {
        height: hp(12.5),
        width: wp(22.5),
        borderTopLeftRadius: wp(2.5),
        borderBottomLeftRadius: wp(2.5),
        marginRight: wp(5),
    },
    imgcontainer: {
        borderWidth: 1,
        marginVertical: hp(1.9),
        borderRadius: wp(2.5),
        justifyContent: 'center',
        borderColor: '#00000040',
        paddingVertical: hp(1)
    },
    girlText: {
        color: 'black',
        fontFamily: 'Lexend-Regular',
        fontSize: hp(1.5),
        marginTop: hp(1.2),
    },
    girlTextlight: {
        fontFamily: 'Lexend-Regular',
        fontSize: hp(1.5),
        marginTop: hp(0.6),
    },
    girlTextlight2: {
        fontFamily: 'Lexend-Regular',
        fontSize: hp(1.5),
        marginBottom: hp(1.2)
    },
    activeCircle: {
        backgroundColor: 'white',
    },
    activeAbcd: {
        color: 'green',
    },
    checkboxContainer: {
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
        borderWidth: 0,
        alignItems: 'center',
        marginRight: wp(2.5),
    },
    inactiveBenefitText: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    benefitRowDynamic: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(0.5),
    },
    benefitIconDynamic: {
        width: wp(4),
        height: hp(2),
        marginRight: wp(2),
        resizeMode: 'contain',
        tintColor: 'green',
        marginLeft: wp(-3.75)
    },
    benefitTextDynamic: {
        fontSize: hp(1.7),
        color: '#000',
        fontFamily: 'Lexend-Medium',
    },
    headerText: {
        fontSize: hp(1.9),
        color: 'white',
        fontFamily: 'Lexend-Medium',
    },
    skipText: {
        fontSize: hp(1.9),
        color: 'white',
        fontFamily: 'Lexend-Medium',
    },
    content: {
        alignItems: 'center',
        borderWidth: 1,
        height: '82%',
        marginHorizontal: wp(5),
        borderRadius: wp(2.5),
        marginTop: hp(-3.5),
        backgroundColor: 'white',
        borderColor: '#00000040',
    },
    title: {
        fontSize: hp(3),
        fontWeight: 'bold',
        marginBottom: hp(1.2),
    },
    greenText: {
        color: 'green',
        fontFamily: 'Lexend-Medium',
    },
    orangeText: {
        color: '#FF6F00',
        fontFamily: 'Lexend-Medium',
    },
    subtitle: {
        fontSize: hp(1.7),
        color: 'black',
        textAlign: 'center',
        marginBottom: hp(2.5),
        fontFamily: 'Lexend-Medium',
        paddingHorizontal: wp(20),
    },
    features: {
        width: '100%',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(2.5),
    },
    icon: {
        width: wp(6),
        height: hp(3),
        marginRight: wp(2.5),
        marginLeft: '15%',
    },
    featureText: {
        fontSize: hp(1.6),
        color: '#FF7E00',
        fontFamily: 'Lexend-Medium',
        paddingRight: wp(22.5),
    },
    pricing: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(5),
        marginTop: hp(3.1),
    },
    priceBox: {
        flex: 1,
        padding: hp(1.9),
        borderRadius: wp(2.5),
        alignItems: 'center',
        marginHorizontal: wp(5),
        borderWidth: 1,
    },
    grayBox: {
        backgroundColor: 'white',
        borderColor: '#CCC',
    },
    selectedBox: {
        backgroundColor: 'white',
        borderColor: '#FF7E00',
    },
    priceDuration: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: hp(0.6),
        paddingHorizontal: wp(6.25),
        borderRadius: wp(2),
        overflow: 'hidden',
        width: wp(36.25),
    },
    ribbon: {
        backgroundColor: 'red',
        borderTopLeftRadius: wp(2),
        borderTopRightRadius: wp(2),
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom: hp(1),
        marginTop: hp(-1.9)
    },
    grayRibbon: {
        backgroundColor: '#CCC',
    },
    selectedRibbon: {
        backgroundColor: '#FF7E00',
        marginTop: hp(-1.9)
    },
    selectedPriceDuration: {
        color: 'white',
    },
    price: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
        color: '#000',
        marginVertical: hp(1.9),
    },
    pricePerMonth: {
        fontSize: hp(1.5),
        color: '#666',
    },
    selectedText: {
        color: '#FF7E00',
    },
    continueButton: {
        backgroundColor: '#FF6F00',
        paddingVertical: hp(1.5),
        borderRadius: wp(7.5),
        alignItems: 'center',
        marginBottom: hp(1.2),
        paddingHorizontal: "22%",
    },
    continueButtonshort: {
        backgroundColor: '#FF6F00',
        paddingVertical: hp(1.5),
        borderRadius: wp(7.5),
        alignItems: 'center',
        marginBottom: hp(1.2),
        paddingHorizontal: "10%",
    },
    continueButtonText: {
        fontSize: hp(2),
        color: '#FFF',
        fontFamily: 'Lexend-Medium'
    },
    informationText: {
        fontSize: hp(1.7),
        color: '#666',
        textAlign: 'center',
        marginBottom: hp(0.6),
        fontFamily: 'Lexend-Regular',
        marginVertical: hp(2.5),
    },
    consultationText: {
        fontSize: hp(1.7),
        color: '#FF7E00',
        textAlign: 'center',
        fontFamily: 'Lexend-Medium',
        marginTop: hp(2.5),
    },
});

export default verificationstyles;