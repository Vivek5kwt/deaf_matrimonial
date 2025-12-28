import React, { useState } from 'react';
import { View, StatusBar, TouchableOpacity, Image, Text, ScrollView } from 'react-native';
import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import { arrow, backr, orgcheck, user } from '../../../../../utils/constants/icons/icon';

const Screen18 = (props: any) => {

    return (
        <ScrollView style={styles.container}>
            <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', right: "0%", top: '20%' }}
                    onPress={() => props.navigation.navigate('Screen21')}
                >
                    <Text style={styles1.lightcolor}>Skip</Text>
                    <Image source={backr?.Icon25} style={styles1.backimage1} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderRadius: 60,
                        marginHorizontal: '37%',
                        padding: 20,
                        paddingHorizontal: 50,
                        backgroundColor: '#FDF1E3',
                        borderColor: '#FDF1E3',
                    }}
                >
                    <Image source={user?.Icon6} resizeMode="stretch" style={styles1.userinfoimage1} />
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: '5%', marginHorizontal: '5%', marginVertical: "5%", alignSelf: 'center' }}>
                <Text style={styles1.textt3}>Verify Profile</Text>
                <Text style={styles1.lightcolorBB1}>Verified Profiles are trusted more</Text>
            </View>

            <View style={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: 10,
                marginHorizontal: 20,
                padding: 15,
                backgroundColor: '#FFFFFF'
            }}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Image source={orgcheck?.Icon30} style={{ height: 20, width: 25, marginHorizontal: 5, marginTop: 15 }} />
                    <Text style={[styles1.textInputt, { flex:0.9 }]}>Verified Profiles are shown higher in the listing</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Image source={orgcheck?.Icon30} style={{ height: 20, width: 25, marginHorizontal: 5, marginTop: 15 }} />
                    <Text style={[styles1.textInputt, { flex: 0.8}]}>Standout with a Blue Tick your Profile</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Image source={orgcheck?.Icon30} style={{ height: 20, width: 25, marginHorizontal: 5, marginTop: 15 }} />
                    <Text style={[styles1.textInputt, { flex: 0.8 }]}>Filter and find exclusive verified Profiles for you</Text>
                </View>
            </View>

            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Text style={styles1.textInputt}>Verify and get all benefits for a year</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:-10 }}>
                    <Text style={[styles1.textInputt, { textDecorationLine: 'line-through', marginRight: 10 }]}>₹399</Text>
                    <Text style={{ color: '#74C723', fontWeight: 'bold',marginTop:-12 }}>FREE</Text>
                </View>
            </View>

            <TouchableOpacity style={[styles.emgaborder122, { marginHorizontal: 20 }]} onPress={() => props.navigation.navigate('')}>
                <Text style={styles.modalText1}>Get Verified</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Screen18;
