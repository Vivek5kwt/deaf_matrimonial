import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity } from 'react-native';
import { PlanSlider } from '../../../components/PremiumCard/PlanSlider';
import BottomHeader from '../../../components/BottomHeader';
import FAQCard from '../../../components/PremiumCard/Faqcard';
import PlanDetailsScreen from '../../../components/PremiumCard/PlanDetailsScreen';
import { arrow } from '../../../utils/constants/icons/icon';

const Screen51 = (props: any) => {
    return (
        <View style={styles.container}>
         
            <View style={styles.topcontainer}>
                <TouchableOpacity onPress={() => props.navigation.navigate("Screen26")}>
                    <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
                </TouchableOpacity>
                <Text style={styles.toptext}>Membership Plans</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.handcontainer}>
                    <Text style={styles.textt}>Select from our multiple membership</Text>
                    <Text style={styles.textt}>plan and find your</Text>
                    <Text style={styles.textt}> best life partner with membership benefits.</Text>
                </View>
                <View>
                    <PlanDetailsScreen />
                </View>
                <View style={styles.mainContent}>
                    <PlanSlider />
                </View>
            </ScrollView>

            <View style={styles.bottomHeader}>
                <BottomHeader />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    arrowstyle: {
        height: 18,
        width: 22,
        marginTop: 25,
        tintColor: 'white',
        left: -80
    },
    container: {
        flex: 1,
    },
    topcontainer: {
        backgroundColor: '#FF7E00',
        height: 70,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row'
    },
    toptext: {
        fontFamily: 'Lexend-Medium',
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        paddingTop: 20,
    },

    scrollContainer: {
        flex: 1,
        marginTop: 80, // To account for the fixed top container height
        marginBottom: 60, // To account for the fixed bottom header height
    },
    scrollContent: {
        flexGrow: 1,
        backgroundColor: 'white',
        paddingBottom: 20, // Ensure content doesn't overlap with BottomHeader
    },
    handcontainer: {
        backgroundColor: '#F6E7D4',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    handicon: {
        height: 71,
        width: 97,
    },
    handicon2: {
        height: 75,
        width: 95,
    },
    guaranteeContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    guaranteeBadge: {
        backgroundColor: '#FF7E00',
        paddingHorizontal: 25,
        paddingVertical: 5,
        borderRadius: 10,
        marginTop: 10,
    },
    textt: {
        fontFamily: 'Lexend-Medium',
        color: '#91C354',
        fontSize: 15,

    },
    texttt: {
        fontFamily: 'Lexend-Medium',
        color: '#FF7400',
        fontSize: 25,
        fontWeight: '500',
    },
    mainContent: {
        backgroundColor: 'white',
        padding: 10,
    },
    bottomHeader: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 10,
    },
});

export default Screen51;
