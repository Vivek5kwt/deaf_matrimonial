import React, { useState } from 'react';
import { View, StatusBar, TouchableOpacity, Image, Text, ScrollView } from 'react-native';
import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import { arrow, backr, family } from '../../../../../utils/constants/icons/icon';

const Screen19 = (props: any) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null); 
    const [liveWithFamily, setLiveWithFamily] = useState<string | null>(null);

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
                    <Image source={family?.Icon29} resizeMode="stretch" style={styles1.userinfoimage} />
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: '5%', marginHorizontal: '5%', marginVertical: "5%" }}>
                <Text style={styles1.textt}>Add family details</Text>
                <Text style={styles1.lightcolorBB1}>This really helps find common connections</Text>
                <Text style={styles1.textt}>Your Family Location</Text>
                <Text style={styles1.lightcolorBB1}>Do you live with your family?</Text>

                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                    {['Yes', 'No'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={{
                                marginHorizontal: 5,
                                backgroundColor: liveWithFamily === option ? '#FF7E00' : 'white', 
                                borderRadius: 20,
                                padding:10,
                                alignItems: 'center',
                                paddingHorizontal:50,
                                borderWidth:1,
                                borderColor:'#BFBFBF'
                            }}
                            onPress={() => setLiveWithFamily(option)}
                        >
                            <Text
                                style={{
                                    color: liveWithFamily === option ? '#FFF' : '#BFBFBF',
                                    fontFamily:'Lexend-Regular'
                                }}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles1.textt}>Your Family’s Financial Status</Text>
                {['Elite', 'High', 'Middle', 'Aspiring'].map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 10,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 10,
                            padding: 10,
                            paddingHorizontal: 20,
                        }}
                        onPress={() => setSelectedOption(option)}
                    >
                        <View
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: selectedOption === option ? '#FF7E00' : '#ccc',
                                backgroundColor: selectedOption === option ? '#FF7E00' : 'transparent',
                                marginRight: 10,
                            }}
                        />
                        <Text style={styles1.lightcolorB}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.emgaborder122} onPress={() => props.navigation.navigate('Screen21')}>
                <Text style={styles.modalText1}>Continue</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Screen19;
