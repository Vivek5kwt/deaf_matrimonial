import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const Modalconnect = StyleSheet.create({
    modalOverlay4: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'flex-end', // Ensures modal opens from the bottom
    },
    modalContent4: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        width: '100%',
        maxHeight: screenHeight * 0.7, // Limit modal height to prevent overflow
    },
    crossButton4: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    crossIcon4: {
        width: 20,
        height: 20,
        tintColor: '#FF7E00',
        marginTop:10,
        marginRight:15,
    },
    imageContainer4: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 20,
        alignSelf: 'center',
    },
    profileImage4: {
        width:90,
        height:90,
        borderRadius:100,
        marginTop:10,

    },
    header4: {
        marginTop:20,
        fontSize: 18,
        color: '#FF7E00',
        marginBottom: 20,
        fontFamily: 'Lexend-Medium',
        textAlign: 'center',
    },
    option4: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#FF7E00',
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
        minHeight: 60,
        justifyContent: 'space-between', // Space between top-left and bottom-left content
        alignItems: 'flex-start', // Aligns the text to the top-left
    },
    selectedOption4: {
        
        backgroundColor: '#FFEEE0', // Highlight the selected option
    },
    optionText4: {
        fontSize: 14,
        color: '#333333',
        fontFamily: 'Lexend-Medium',
        textAlign: 'left', // Ensures text starts from the left
        lineHeight: 18, // Spacing between lines
    },
    dateTime4: {
        fontSize: 12,
        color: '#777777',
        marginVertical: 10,
        fontFamily: 'Lexend-Medium',
        textAlign: 'center', // Centered date and time
    },
    sendButton4: {
        marginBottom:20,
        backgroundColor: '#FF7E00',
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center', // Center the button text
        marginHorizontal: '10%', // Provide spacing from left and right
        width: '80%', // Center and adjust button width
    },
    sendButtonText4: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'Lexend-Medium',
    },
});

export default Modalconnect;
