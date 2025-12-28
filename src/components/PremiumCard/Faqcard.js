import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { upload,downn,bear} from '../../utils/constants/icons/icon'; // Import your arrow icons here

const FAQCard = () => {
    const [expandedIndex, setExpandedIndex] = useState(null); // For handling dropdown state

    const faqs = [
        {
            question: 'What are some of the benefits of Premium Plans?',
            answer: 'Premium plans offer exclusive features, such as better matchmaking, unlimited chat, and priority customer support.',
        },
        {
            question: 'What offers and discounts can I avail?',
            answer: 'Discounts and offers vary based on the current promotions. Check the app or website for details.',
        },
        {
            question: 'What payment options do you offer?',
            answer: 'We accept credit/debit cards, UPI, wallets, and net banking.',
        },
        {
            question: 'How can I be safe on Matrimonial.com?',
            answer: 'Follow our safety tips, avoid sharing sensitive details, and verify profiles before meeting in person.',
        },
    ];

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <View style={styles.cardContainer}>
            <View style={{flexDirection:'row',justifyContent:'space-around',marginBottom:20}}>
            <Text style={{fontSize:30,fontFamily:'Lexend-Medium',alignSelf:'center',color:"#FF7400"}}>Quarry !</Text>
            <Image source={bear?.Icon150}/>
            </View>
            {/* FAQ List */}
            {faqs.map((faq, index) => (
                <View key={index}>
                    <TouchableOpacity 
                        style={styles.faqItem} 
                        onPress={() => toggleExpand(index)}>
                        <Text style={styles.question}>{faq.question}</Text>
                        <Image 
                            source={expandedIndex === index ?upload?.Icon147  :downn?.Icon148 } 
                            style={styles.arrowIcon} 
                        />
                    </TouchableOpacity>
                    {expandedIndex === index && (
                        <Text style={styles.answer}>{faq.answer}</Text>
                    )}
                    <View style={styles.separator} />
                </View>
            ))}

            {/* Contact Section */}
            <View style={styles.contactContainer}>
                <Text style={styles.contactTitle}>Still Need Help?</Text>
                <Text style={styles.contactText}>
                    We are right here to help you. Give us a call or Whatsapp anytime between 10am to 7pm.
                </Text>
                <Text style={styles.contactNumber}>Whatsapp <Text style={styles.phoneNumber}>+91 9316674407</Text></Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4, // For Android shadow
        marginTop:40,
    },
    faqItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    question: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
        flex: 1,
        fontFamily: 'Lexend-Medium',
    },
    arrowIcon: {
        width: 20, // Set appropriate width
        height: 20, // Set appropriate height
        resizeMode: 'contain',
    },
    answer: {
        fontSize: 14,
        color: '#555',
        marginVertical: 5,
        marginLeft: 10,
        lineHeight: 20,
        fontFamily: 'Lexend-Regular',
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 10,
    },
    contactContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    contactTitle: {
        fontSize: 16,
        fontFamily: 'Lexend-Medium',
        color: '#333',
    },
    contactText: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginVertical: 10,
        fontFamily: 'Lexend-Medium',
    },
    contactNumber: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Lexend-Medium',
    },
    phoneNumber: {
        fontFamily: 'Lexend-Medium',
        color: '#FF7400',
    },
});

export default FAQCard;
