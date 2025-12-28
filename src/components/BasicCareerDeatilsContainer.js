import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {  line2, lock2 } from '../utils/constants/icons/icon';

const BasicCareerDetailsContainer = ({ careerdetails }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Basic Details</Text>
        
     {careerdetails.map((item, index) => (
                <View key={index} style={styles.detailRow}>
                    <Image source={item.icon} style={styles.icon} />
                    <View style={styles.textContainer}>
                        <Text style={styles.detailLabel}>{item.label}</Text>
                        <View style={styles.detailValueContainer}>
                            <View style={{flexDirection:"row"}}>
                            <Text style={styles.detailText}>{item.value}</Text>
                            {item.label === 'College Name' && (
                                <Image source={lock2?.Icon102} style={styles.lockIcon2} />
                            )}
                             {item.label === 'Company Name' && (
                                <Image source={lock2?.Icon102} style={styles.lockIcon2} />
                            )}
                            </View>
                        </View>
                    </View>
                </View>
            ))}

            {/* Footer */}
            <View>
                <Image source={line2?.Icon103} style={styles.line} />
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>To unlock Contact No.& Email  ID</Text>
                <TouchableOpacity style={styles.premiumButton}>
                    <Text style={styles.premiumText}>Go Premium Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BasicCareerDetailsContainer;

const styles = StyleSheet.create({
    line: {
        width: "100%",
        height: 2.5
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        margin: 15,
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
        fontFamily: 'Lexend-Medium'

    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    tag: {
        borderWidth: 1,
        borderColor: '#66b266',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginRight: 5,
    },
    tagText: {
        fontSize: 14,
        fontFamily: 'Lexend-Medium'
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        width: 35,
        height: 35,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,

    },
    detailLabel: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Lexend-Medium'

    },
    detailText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        fontFamily: 'Lexend-Medium'

    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#999',
        marginBottom: 10,
        fontFamily: 'Lexend-Medium'

    },
    premiumButton: {
        backgroundColor: '#ff8c00',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    premiumText: {
        color: 'white',
        fontWeight: '600',
        fontFamily: 'Lexend-Medium'

    },
    lockIcon: {
        width: 16,
        height: 16,
        tintColor: '#777', 
        position:'absolute',
        right:"45%",
        marginTop:5,
    },
    lockIcon2: {
        width: 16,
        height: 16,
        alignSelf:'center'
    },
});
