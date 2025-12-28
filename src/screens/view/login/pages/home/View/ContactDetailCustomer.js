import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { red1, red2, familylogo, lock2, line2 } from '../../../../../../utils/constants/icons/icon';
import { oimage } from '../../../../../../utils/constants/images/image';

const ContactDetailsContainer = () => {
    return (
        <View style={styles.container}>
            <View style={styles.contactDetails}>
                <Text style={styles.header}>Contact Details</Text>
                <View style={styles.detailRow}>
                    <Image
                        source={red1?.Icon105}
                        style={styles.icon}
                    />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.label}>Contact No.</Text>
                        <View style={styles.detailValueContainer}>
                            <Text style={styles.value}>+9198721 *****</Text>
                            <Image
                                source={lock2?.Icon102}
                                style={styles.lockIcon}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <Image
                        source={red2?.Icon106}
                        style={styles.icon}
                    />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.label}>Email ID</Text>
                        <View style={styles.detailValueContainer}>
                            <Text style={styles.value}>********@gmail.com</Text>
                            <Image
                                source={lock2?.Icon102}
                                style={styles.lockIcon}
                            />
                        </View>
                    </View>
                </View>

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
            
            <View style={styles.familyDetailsSection}>
                <Image source={oimage?.IMG29} style={{height:208,width:"110%"}}/>
                <View style={{position:'absolute',alignSelf:'center',top:30}}>
                <Image
                    source={familylogo?.Icon107}
                    style={styles.familyIcon}
                />
                <Text style={styles.familyText1}>Add your details</Text>
                <Text style={styles.familyText}>
                    to see Anjali D family details
                </Text>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add Now</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    premiumText: {
        color: 'white',
        fontWeight: '600',
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
    line: {
        width: "100%",
        height: 2.5
    },
    container: {
        flex: 1,
        padding: 16,
    },
    contactDetails: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    header: {
        fontSize: 18,
        marginBottom: 12,
        color: '#333',
        fontFamily: 'Lexend-Medium',

    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 16,
    },
    detailTextContainer: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: '#555',
        fontFamily: 'Lexend-Medium'
    },
    detailValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Lexend-Medium'

    },
    lockIcon: {
        width: 16,
        height: 16,
        marginLeft: 8,
    },
    premiumSection: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },

    premiumButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Lexend-Medium'

    },
    familyDetailsSection: {
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    familyIcon: {
        width: 60,
        height: 60,
        marginBottom: 12,
        alignSelf:'center'
    },
    familyText1: {
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
        fontFamily: 'Lexend-Medium'

    },
    familyText: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
        fontFamily: 'Lexend-Medium'

    },
    addButton: {
        borderRadius: 24,
        paddingVertical: 8,
        borderColor: 'white',
        borderWidth: 1,
        alignSelf:'center',
        paddingHorizontal:25
    },
    addButtonText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Lexend-Medium',
        alignSelf:'center'

    },
});

export default ContactDetailsContainer;
