import React, { useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { arrow, DM, checkbox } from '../../../../../utils/constants/icons/icon';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import styles from '../../../../../styles/onboadings/styles';
import styles2 from '../../../../../styles/verification/verificationstyles';
import { girl1, girl2, girl3, girl4 } from '../../../../../utils/constants/images/image';

const profilesData = [
    {
        id: 1,
        name: 'Avneet Kaur',
        age: '31 yrs',
        work: 'Chef / Sommelier / Food Critic',
        location: 'Lives in Chinsurah, West Bengal',
        image: girl1?.IMG5,
    },
    {
        id: 2,
        name: 'Aditi Kapoor',
        age: '28 yrs',
        work: 'Accounting Professional',
        location: 'Lives in Rampur, Uttar Pradesh',
        image: girl2?.IMG6,
    },
    {
        id: 3,
        name: 'Janvi Grewal',
        age: '29 yrs',
        work: 'Not working',
        location: 'Lives in Rajasthan',
        image: girl3?.IMG7,
    },
    {
        id: 4,
        name: 'Mehak Rajput',
        age: '23 yrs',
        work: 'Not working',
        location: 'Lives in Greater Noida, Delhi',
        image: girl4?.IMG8,
    },
];

const Screen22 = (props: any) => {
    const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const toggleProfileSelection = (id: number) => {
        if (selectedProfiles.includes(id)) {
            setSelectedProfiles(selectedProfiles.filter((profileId) => profileId !== id));
        } else {
            setSelectedProfiles([...selectedProfiles, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedProfiles([]);
        } else {
            setSelectedProfiles(profilesData.map((profile) => profile.id));
        }
        setSelectAll(!selectAll);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>

            <View style={{ marginHorizontal: 20, marginTop: '5%' }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 20 }}>
                    <Image source={DM?.Icon18} resizeMode="stretch" style={styles1.profileimageDM1} />
                </TouchableOpacity>
            </View>

            <View style={{ borderWidth: 0.5, borderColor: '#BFBFBF', marginTop: 10, marginHorizontal: -20 }} />

            <View style={{ alignSelf: 'center', marginVertical: 10 }}>
                <Text style={styles1.textt3}>Let’s get started by Connecting </Text>
                <Text style={styles1.textt3}>with few of your Matches </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',marginRight:30, marginBottom: 10 }}>
                <Text style={{ marginRight: 10, fontFamily: 'Lexend-Regular' }}>Select All</Text>
                <TouchableOpacity onPress={toggleSelectAll}>
                <Image source={checkbox?.Icon39}

                        style={{
                            height: 24,
                            width: 24,
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: '#BFBFBF',
                            backgroundColor: selectAll ? '#FF7E00' : 'transparent',
                        }}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20,paddingHorizontal:20 }}>
                {profilesData.map((profile) => (
                    <View key={profile.id} style={styles2.imgcontainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: -8 }}>
                            <Image source={profile.image} style={styles2.girlimgstyle} />

                            <View>
                                <Text style={styles2.girlText}>{profile.name}</Text>
                                <Text style={styles2.girlTextlight}>{profile.age}</Text>
                                <Text style={styles2.girlTextlight}>{profile.work}</Text>
                                <Text style={styles2.girlTextlight2}>{profile.location}</Text>
                            </View>

                            <TouchableOpacity onPress={() => toggleProfileSelection(profile.id)} style={{ position: 'absolute', right: 10, top: 15 }}>
                                <Image source={checkbox?.Icon39}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        borderColor: '#BFBFBF',
                                        backgroundColor: selectedProfiles.includes(profile.id) ? '#FF7E00' : 'transparent',
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={{ padding: 20, backgroundColor: '#FFF', borderTopColor: '#BFBFBF' }}>
                <TouchableOpacity
                    style={{
                        alignSelf: 'center',
                        backgroundColor: '#F57C00',
                        borderRadius: 25,
                        paddingVertical: 10,
                        paddingHorizontal: 40,
                    }}
                    onPress={() => {
                        console.log('Selected Profiles:', selectedProfiles);
                        props.navigation.navigate('Screen23');
                    }}
                >
                    <Text style={{ color: '#FFF', fontSize: 16, fontFamily: 'Lexend-Medium' }}>Connect with selected</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Screen22;
