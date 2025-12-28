import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { copy2, line2, lock2 } from '../utils/constants/icons/icon';
const BasicDetailsContainer = ({ details }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>Basic Details</Text>
            {/* First Row */}
            <View style={styles.row}>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>Created by Self</Text>
                </View>
                <View style={styles.tag}>
                    <View style={{flexDirection:'row'}}>
                    <Text style={styles.tagText}>ID: SH345687</Text>
                    <Image source={copy2?.Icon104} style={styles.lockIcon2}/>
</View>
                </View>
            </View>

            {/* Second Row */}
            <View style={styles.row}>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>24 yrs old</Text>
                </View>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>Height- 4’5”</Text>
                </View>
            </View>

     {details.map((item, index) => (
                <View key={index} style={styles.detailRow}>
                    <Image source={item.icon} style={styles.icon} />
                    <View style={styles.textContainer}>
                        <Text style={styles.detailLabel}>{item.label}</Text>
                        <View style={styles.detailValueContainer}>
                        <View style={{flexDirection:"row"}}>

                            <Text style={styles.detailText}>{item.value}</Text>
                            {/* Conditionally Render Lock Icon */}
                            {item.label === 'Birth Date' && (
                                <Image source={lock2?.Icon102} style={styles.lockIcon} />
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
                <Text style={styles.footerText}>To unlock Birth date</Text>
                <TouchableOpacity style={styles.premiumButton}>
                    <Text style={styles.premiumText}>Go Premium Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BasicDetailsContainer;

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
       margin:2
    },
    lockIcon2: {
        width: 16,
        height: 16,
        alignSelf:'center'
    },
});
