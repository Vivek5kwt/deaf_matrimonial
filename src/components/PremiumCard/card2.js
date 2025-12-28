import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { arrowd, callicon1, callicon2, callicon3, callicon4, plan1, plan2, plan3, plandate } from '../../utils/constants/icons/icon';

const CardComponent = () => {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            <View style={{borderTopWidth:8,borderTopLeftRadius:8,borderTopRightRadius:8,width:"90%",alignSelf:'center',borderColor:'#FF7E00'}}/>

            <View style={styles.cardContainer}>
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <Text style={styles.title}>SELECT</Text>
                    <Text style={styles.title1}>SHAADI</Text>
                </View>

                <View style={{ flexDirection: "column" }}>
                    <Text style={styles.subtitle}>Experience Personalized</Text>
                    <Text style={styles.subtitle}> Matchmaking starting at ₹ 34,900</Text>
                </View>

                <View style={styles.featuresContainer}>
                    <View style={styles.feature}>
                        <Image source={callicon1?.Icon46} style={styles.icon} />
                        <Text style={styles.featureText}>Relationship</Text>
                        <Text style={styles.featureText}>Advisor</Text>
                    </View>
                    <View style={styles.feature}>
                        <Image source={callicon2?.Icon47} style={styles.icon} />
                        <Text style={styles.featureText}>Handpicked</Text>
                        <Text style={styles.featureText}>Matches</Text>
                    </View>
                    <View style={styles.feature}>
                        <Image source={callicon3?.Icon48} style={styles.icon} />
                        <Text style={styles.featureText}>Introductions &</Text>
                        <Text style={styles.featureText}>Meetings</Text>
                    </View>
                    <View style={styles.feature}>
                        <Image source={callicon4?.Icon49} style={styles.icon} />
                        <Text style={styles.featureText}>All Premium</Text>
                        <Text style={styles.featureText}>benefits</Text>
                    </View>
                </View>

                <View style={styles.choosePlanContainer}>
                    <View style={styles.line} />
                    <Text style={styles.choosePlanText}>Choose Your Plan</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.button}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>View Plans</Text>
                        <Image source={arrowd?.Icon131}style={styles.downArrow}/> 
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{alignSelf:'center',marginVertical:20}}>
            <Text style={styles.heading}>The safest, smartest, & the most secure</Text>
            <Text style={styles.headingg}> matchmaking service in India</Text>

            </View>
                <View style={styles.footer}>
                    <Image source={plandate?.Icon146} style={styles.Planicon}/> 
                    <Text style={styles.footerTitle}>Money Back Guarantee!</Text>
                    <Text style={styles.footerDescription}>
                        If you do not find a match within 30 days, get a full refund without any questions asked
                    </Text>
                    <View style={styles.footerFeatures}>
                        <View style={styles.footerFeature}>
                            <Image source={plan1?.Icon143} style={styles.icon} />
                            <Text style={styles.footerFeatureText}>Best</Text>
                            <Text style={styles.footerFeatureText}>Matches</Text>

                        </View>
                        <View style={styles.footerFeature}>
                            <Image source={plan2?.Icon144} style={styles.icon} />
                            <Text style={styles.footerFeatureText}>Verified</Text>
                            <Text style={styles.footerFeatureText}>Profiles</Text>

                        </View>
                        <View style={styles.footerFeature}>
                            <Image source={plan3?.Icon145} style={styles.icon} />
                            <Text style={styles.footerFeatureText}>100%</Text>
                            <Text style={styles.footerFeatureText}>Privacy</Text>
                        </View>
                        
                    </View>
                    
                </View>
                <View style={{alignSelf:'center',marginVertical:20}}>
            <Text style={styles.heading}>Frequently Asked Questions</Text>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  
    heading:{
fontFamily:'Lexend-Medium',
fontSize:16,
color:'#434150',
alignSelf:'center'

    },
    headingg:{
        fontFamily:'Lexend-Medium',
        fontSize:14,
        color:'#434150',
        alignSelf:'center'
            },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        width: '90%',
        alignSelf: 'center',
        marginTop:-4
    },
    title: {
        fontSize: 18,
        fontFamily: 'Lexend-Medium',
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 10,
    },
    title1: {
        fontSize: 18,
        fontFamily: 'Lexend-Medium',
        color: '#FF7E00',
        textAlign: 'center',
        marginBottom: 10,
        marginLeft: 5,
    },
    subtitle: {
        fontFamily: 'Lexend-Medium',
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    feature: {
        alignItems: 'center',
        width: '45%',
        marginVertical: 10,
        flexDirection: 'column',
    },
    icon: {
        width: 70,
        height: 70,
        marginBottom: 10,
    },
    featureText: {
        fontSize: 12,
        textAlign: 'center',
        color: '#FFA500',
        fontFamily: 'Lexend-Medium',
    },
    choosePlanContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
        marginHorizontal: 10,
    },
    choosePlanText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Lexend-Medium',
    },
    button: {
        backgroundColor: '#FFA500',
        borderRadius: 25,
        paddingVertical: 10,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 50,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    downArrow: {
        height:20,
        width:20,
        marginLeft: 5,
        color: '#fff',
        fontSize: 16,
        marginTop:5,
    },
    Planicon: {
        height:70,
        width:70,
        marginLeft: 5,
        fontSize: 16,
        marginTop:5,
        alignSelf:'center'
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        width: '90%',
        alignSelf: 'center',
        marginTop:-4,
    },
    footerTitle: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
        fontFamily: 'Lexend-Medium',

    },
    footerDescription: {
        fontSize: 12,
        color: '#BFBFBF',
        textAlign: 'center',
        marginBottom: 60,
        fontFamily: 'Lexend-Medium',

    },
    footerFeatures: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    footerFeature: {
        alignItems: 'center',
        width: '30%',
        flexDirection:'column',
    },
    footerFeatureText: {
        fontSize: 12,
        textAlign: 'center',
        color: '#499202',
        fontFamily: 'Lexend-Medium',

    },
});

export default CardComponent;
