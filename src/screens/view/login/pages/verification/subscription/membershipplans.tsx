import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { callicon1, callicon2, callicon3, callicon4, orangephone } from '../../../../../../utils/constants/icons/icon';
import verificationstyles from '../../../../../../styles/verification/verificationstyles';
import styles from '../../../../../../styles/onboadings/styles';

const Screen25 = (props: any) => {
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleSelectPlan = (plan:any) => {
        setSelectedPlan(plan);
    };

    return (
        <View style={styles.container}>

            <View style={verificationstyles.header}>
                <Text style={verificationstyles.headerText}>Upgrade to Premium</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Screen26')}>
                    <Text style={verificationstyles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>
            <View style={{ borderWidth: 10, paddingVertical: 20, borderColor: "#FF7E00", marginHorizontal: 21, borderRadius: 10 }}></View>
            <View style={verificationstyles.content}>
                <Text style={verificationstyles.title}>
                    <Text style={verificationstyles.greenText}>SELECT </Text>
                    <Text style={verificationstyles.orangeText}>SHAADI</Text>
                </Text>
                <Text style={verificationstyles.subtitle}>
                    A Personalised Matchmaking Service for You
                </Text>

                <View style={verificationstyles.features}>
                    <View style={verificationstyles.featureItem}>
                        <Image source={callicon1?.Icon46} style={verificationstyles.icon} />
                        <Text style={verificationstyles.featureText}>Dedicated Advisor</Text>
                    </View>
                    <View style={verificationstyles.featureItem}>
                        <Image source={callicon2?.Icon47} style={verificationstyles.icon} />
                        <Text style={verificationstyles.featureText}>
                            Handpicked Matches as per your Preferences
                        </Text>
                    </View>
                    <View style={verificationstyles.featureItem}>
                        <Image source={callicon3?.Icon48} style={verificationstyles.icon} />
                        <Text style={verificationstyles.featureText}>Introductions and Meetings</Text>
                    </View>
                    <View style={verificationstyles.featureItem}>
                        <Image source={callicon4?.Icon49} style={verificationstyles.icon} />
                        <Text style={verificationstyles.featureText}>All Premium benefits include</Text>
                    </View>
                </View>

                <View style={verificationstyles.pricing}>
                    <TouchableOpacity
                        style={[
                            verificationstyles.priceBox,
                            selectedPlan === '3months' ? verificationstyles.selectedBox : verificationstyles.grayBox,
                        ]}
                        onPress={() => handleSelectPlan('3months')}
                    >
                        <View
                            style={[
                                verificationstyles.ribbon,
                                selectedPlan === '3months' ? verificationstyles.selectedRibbon : verificationstyles.grayRibbon,
                            ]}
                        >
                            <Text style={verificationstyles.priceDuration}>3 months</Text>
                        </View>
                        <Text
                            style={[
                                verificationstyles.price,
                                selectedPlan === '3months' ? verificationstyles.selectedText : {},
                            ]}
                        >
                            ₹ 32,500
                        </Text>
                        <Text
                            style={[
                                verificationstyles.pricePerMonth,
                                selectedPlan === '3months' ? verificationstyles.selectedText : {},
                            ]}
                        >
                            ₹ 10,834 per month
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={[
                            verificationstyles.priceBox,
                            selectedPlan === '9months' ? verificationstyles.selectedBox : verificationstyles.grayBox,
                        ]}
                        onPress={() => handleSelectPlan('9months')}
                    >
                        <View
                            style={[
                                verificationstyles.ribbon,
                                selectedPlan === '9months' ? verificationstyles.selectedRibbon : verificationstyles.grayRibbon,
                            ]}
                        >
                            <Text style={verificationstyles.priceDuration}>9 months</Text>
                        </View>
                        <Text
                            style={[
                                verificationstyles.price,
                                selectedPlan === '9months' ? verificationstyles.selectedText : {},
                            ]}
                        >
                            ₹ 9,000
                        </Text>
                        <Text
                            style={[
                                verificationstyles.pricePerMonth,
                                selectedPlan === '9months' ? verificationstyles.selectedText : {},
                            ]}
                        >
                            ₹ 9000 per month
                        </Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity style={verificationstyles.continueButton} onPress={() => props.navigation.navigate('Screen26')}>
                    <Text style={verificationstyles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
                <Text style={verificationstyles.informationText}>Need More information?</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Screen26')}>

                    <Text style={verificationstyles.consultationText}><Image source={orangephone?.Icon50} style={verificationstyles.icon} />  Request a free Select Partner consultation
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Screen25;
