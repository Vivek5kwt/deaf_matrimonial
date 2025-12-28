import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, StatusBar, TouchableOpacity, Alert, Image, ScrollView, Modal, FlatList, TextInput, SafeAreaView, KeyboardAvoidingView,
} from 'react-native';
import { arrow, DM, greendot } from '../../../../../utils/constants/icons/icon';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import styles from '../../../../../styles/onboadings/styles';
import verificationstyles from '../../../../../styles/verification/verificationstyles';
import { getUserData } from '../../../../../utils/constants/storage';
import { Snackbar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Screen21 = (props: any) => {
    const [showCommunity, setShowCommunity] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPreference, setSelectedPreference] = useState<string | null>(null);
    const [partnerExpectation, setPartnerExpectation] = useState('');
    const [ageOptions, setAgeOptions] = useState<string[]>([]);
    const [heightOptions, setHeightOptions] = useState<string[]>([]);
    const [motherOptions, setMotherOptions] = useState<string[]>([]);
    const [educationOptions, setEducationOptions] = useState<string[]>([]);
    const [occupationsOptions, setoccupationsOptions] = useState<string[]>([]);
    const [incomesOptions, setIncomesOptions] = useState<string[]>([]);
    const [religionOptions, setReligionOptions] = useState<string[]>([]);
    const [religionIdMap, setReligionIdMap] = useState<{ [key: string]: number }>({});
    const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
    const [casteOptions, setCasteOptions] = useState<string[]>([]);
    const [casteIdMap, setCasteIdMap] = useState<{ [key: string]: number }>({});
    const [selectedValue, setSelectedValue] = useState<{ [key: string]: string[] }>({});

    // ID Mappings
    const [motherTongueIdMap, setMotherTongueIdMap] = useState<{ [key: string]: number }>({});
    const [educationIdMap, setEducationIdMap] = useState<{ [key: string]: number }>({});
    const [occupationIdMap, setOccupationIdMap] = useState<{ [key: string]: number }>({});
    const [cityIdMap, setCityIdMap] = useState<{ [key: string]: number }>({});

    // Search states
    const [stateSearchQuery, setStateSearchQuery] = useState('');
    const [citySearchQuery, setCitySearchQuery] = useState('');
    const [religionSearchQuery, setReligionSearchQuery] = useState('');
    const [casteSearchQuery, setCasteSearchQuery] = useState('');
    const [motherSearchQuery, setMotherSearchQuery] = useState('');
    const [educationSearchQuery, setEducationSearchQuery] = useState('');
    const [occupationSearchQuery, setOccupationSearchQuery] = useState('');
    const [incomeSearchQuery, setIncomeSearchQuery] = useState('');

    const [matriId, setMatriId] = useState<string | null>(null);

    const [stateOptions, setStateOptions] = useState<string[]>([]);
    const [stateIdMap, setStateIdMap] = useState<{ [key: string]: number }>({});
    const [selectedStates, setSelectedStates] = useState<string[]>([]);
    const [cityOptions, setCityOptions] = useState<string[]>([]);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Preferences Data
    const preferencesData = {
        ageRange: ageOptions.length > 0 ? ageOptions : [],
        heightRange: heightOptions.length > 0 ? heightOptions : [],
        maritalStatus: ['Does Not Matter', 'Never Married', 'Widower,Divorced', 'Awaiting Divorce'],
        physicalStatus: ['Does Not Matter', 'Deaf + Usher', 'Deaf + Other Disability', 'Hearing Impaired', 'Cochlear Implant', 'Deaf', 'Normal'],
        eatingHabits: ['Does Not Matter', 'Vegetarian', 'Non-Vegetarian', 'Eggetarian'],
        DrinkingHabits: ['Does Not Matter', 'Never Drinks', 'Drinks Socially', 'Drinks Regularly'],
        smokingHabits: ['Does Not Matter', 'Never Smokes', 'Smokes Occasionally ', 'Smokes Regularly'],
        religion: religionOptions.length > 0 ? religionOptions : [],
        caste: casteOptions.length > 0 ? casteOptions : [],
        mother: motherOptions.length > 0 ? motherOptions : [],
        education: educationOptions.length > 0 ? educationOptions : [],
        occupations: occupationsOptions.length > 0 ? occupationsOptions : [],
        incomes: incomesOptions.length > 0 ? incomesOptions : [],
        state: stateOptions.length > 0 ? stateOptions : [],
        city: cityOptions.length > 0 ? cityOptions : [],
        country: ['India'],
    };

    // Filter functions for search
    const filteredStates = stateOptions.filter(state =>
        state.toLowerCase().includes(stateSearchQuery.toLowerCase())
    );

    const filteredCities = cityOptions
        .filter(city => city.toLowerCase().includes(citySearchQuery.toLowerCase()))
        .sort((a, b) => a.localeCompare(b)); // Ensure filtered results are also sorted

    const filteredReligions = religionOptions.filter(religion =>
        religion.toLowerCase().includes(religionSearchQuery.toLowerCase())
    );

    const filteredCastes = casteOptions.filter(caste =>
        caste.toLowerCase().includes(casteSearchQuery.toLowerCase())
    );

    const filteredMotherTongues = motherOptions
    .filter(mother => mother.toLowerCase().includes(motherSearchQuery.toLowerCase()));

    const filteredEducations = educationOptions.filter(education =>
        education.toLowerCase().includes(educationSearchQuery.toLowerCase())
    );

    const filteredOccupations = occupationsOptions.filter(occupation =>
        occupation.toLowerCase().includes(occupationSearchQuery.toLowerCase())
    );

    const filteredIncomes = incomesOptions.filter(income =>
        income.toLowerCase().includes(incomeSearchQuery.toLowerCase())
    );

    useEffect(() => {
        const fetchMatriId = async () => {
            try {
                const userData = await getUserData();
                if (!userData?.matriId) {
                    Alert.alert('Error', 'Matri ID not found. Please restart the registration process.');
                } else {
                    setMatriId(userData.matriId);
                }
            } catch (error) {
                console.error('Error fetching Matri ID:', error);
            }
        };

        fetchMatriId();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Age Data
                const ageResponse = await fetch('http://82.29.161.246:8002/api/ages');
                const ageJson = await ageResponse.json();
                const ageData = ageJson.data.map((item: { age: string }) => item.age);
                setAgeOptions(ageData);

                // Fetch Height Data
                const heightResponse = await fetch('http://82.29.161.246:8002/api/heights');
                const heightJson = await heightResponse.json();

                const sortedHeights = heightJson.data.sort((a, b) => a.id - b.id);
                const heightData = sortedHeights.map((item: { height: string }) => item.height);
                setHeightOptions(heightData);

                // Fetch Mother Tongue Data with ID mapping
                const motherResponse = await fetch('http://82.29.161.246:8002/api/mothertongues');
                const motherJson = await motherResponse.json();
                const sortedMotherTongueData = motherJson.data
                .map((item: { mtongue_name: string }) => item.mtongue_name)
                .sort((a, b) => a.localeCompare(b)); 
                setMotherOptions(sortedMotherTongueData);

                const motherIdMapping = {};
                motherJson.data.forEach((item: { mtongue_name: string; mtongue_id: number }) => {
                    motherIdMapping[item.mtongue_name] = item.mtongue_id;
                });
                setMotherTongueIdMap(motherIdMapping);

                // Fetch Education Data with ID mapping
                const educationResponse = await fetch('http://82.29.161.246:8002/api/education-details');
                const educationJson = await educationResponse.json();
                const educationData = educationJson.data.map((item: { edu_name: string }) => item.edu_name);
                setEducationOptions(educationData);

                const educationIdMapping = {};
                educationJson.data.forEach((item: { edu_name: string; edu_id: number }) => {
                    educationIdMapping[item.edu_name] = item.edu_id;
                });
                setEducationIdMap(educationIdMapping);

                // Fetch Occupations Data with ID mapping
                const occupationsResponse = await fetch('http://82.29.161.246:8002/api/occupations');
                const occupationsJson = await occupationsResponse.json();
                const occupationsData = occupationsJson.data.map((item: { ocp_name: string }) => item.ocp_name);
                setoccupationsOptions(occupationsData);

                const occupationIdMapping = {};
                occupationsJson.data.forEach((item: { ocp_name: string; ocp_id: number }) => {
                    occupationIdMapping[item.ocp_name] = item.ocp_id;
                });
                setOccupationIdMap(occupationIdMapping);

                const incomesResponse = await fetch('http://82.29.161.246:8002/api/incomes');
                const incomesJson = await incomesResponse.json();
                const sortedIncomes = incomesJson.data
                    .sort((a, b) => a.id - b.id)
                    .map(item => item.income);
                setIncomesOptions(sortedIncomes);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await fetch('http://82.29.161.246:8002/api/states');
                const result = await response.json();

                if (result.success) {
                    const states = result.data.map((item: { state_name: string }) => item.state_name);
                    setStateOptions(states);

                    const mapping = {};
                    result.data.forEach((item: { state_name: string; state_code: string }) => {
                        mapping[item.state_name] = item.state_code;
                    });
                    setStateIdMap(mapping);
                }
            } catch (error) {
                console.error("Error fetching states:", error);
            }
        };

        fetchStates();
    }, []);
    useEffect(() => {
        const fetchCities = async () => {
            if (selectedStates.length > 0) {
                try {
                    const stateCodes = selectedStates.map(state => stateIdMap[state]);
    
                    const response = await fetch('http://82.29.161.246:8002/api/cities/multiple-states', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ state_codes: stateCodes }),
                    });
    
                    const result = await response.json();
    
                    if (result.success) {
                        let cityList = [];
                        const cityIdMapping = {};
                        
                        Object.values(result.data).forEach(state => {
                            state.forEach(city => {
                                cityList.push(city.city_name);
                                cityIdMapping[city.city_name] = city.city_id;
                            });
                        });
    
                        // Sort cities alphabetically before setting them
                        const sortedCities = [...new Set(cityList)].sort((a, b) => a.localeCompare(b));
                        
                        setCityOptions(sortedCities);
                        setCityIdMap(cityIdMapping);
    
                        setSelectedValue(prev => ({
                            ...prev,
                            city: []
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching cities:", error);
                }
            } else {
                setCityOptions([]);
            }
        };
    
        fetchCities();
    }, [selectedStates]);

    useEffect(() => {
        const fetchReligions = async () => {
            try {
                const response = await fetch('http://82.29.161.246:8002/api/religions');
                const result = await response.json();

                if (result.success) {
                    const religions = result.data.map((item: { religion_name: string }) => item.religion_name);
                    setReligionOptions(religions);

                    const mapping = {};
                    result.data.forEach((item: { religion_name: string; religion_id: number }) => {
                        mapping[item.religion_name] = item.religion_id;
                    });
                    setReligionIdMap(mapping);
                }
            } catch (error) {
                console.error("Error fetching religions:", error);
            }
        };

        fetchReligions();
    }, []);

    useEffect(() => {
        const fetchCastes = async () => {
            if (selectedReligions.length > 0) {
                try {
                    const religionIds = selectedReligions.map(religion => religionIdMap[religion]);

                    const response = await fetch('http://82.29.161.246:8002/api/castes/multiple', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ religion_ids: religionIds }),
                    });

                    const result = await response.json();

                    if (result.success) {
                        let casteList = [];
                        const casteIdMapping = {};

                        result.data.forEach(religion => {
                            religion.castes.forEach(caste => {
                                casteList.push(caste.caste_name);
                                casteIdMapping[caste.caste_name] = caste.caste_id;
                            });
                        });

                        setCasteOptions([...new Set([...casteList])]);
                        setCasteIdMap(casteIdMapping);

                        setSelectedValue(prev => ({
                            ...prev,
                            caste: []
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching castes:", error);
                }
            } else {
                setCasteOptions([]);
            }
        };

        fetchCastes();
    }, [selectedReligions]);

    const openModal = (key: string) => {
        setSelectedPreference(key);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedPreference(null);
        // Reset all search queries when modal closes
        setStateSearchQuery('');
        setCitySearchQuery('');
        setReligionSearchQuery('');
        setCasteSearchQuery('');
        setMotherSearchQuery('');
        setEducationSearchQuery('');
        setOccupationSearchQuery('');
        setIncomeSearchQuery('');
    };

    const requestData = {
        matri_id: matriId,
        part_frm_age: selectedValue.ageRange?.[0] || null,
        part_to_age: selectedValue.ageRange?.[1] || null,
        part_income: selectedValue.incomes?.join(',') || null,
        part_religion: selectedValue.religion?.map(name => religionIdMap[name]).join(',') || null,
        part_caste: selectedValue.caste?.map(name => casteIdMap[name]).join(',') || null,
        part_occu: selectedValue.occupations?.map(name => occupationIdMap[name]).join(',') || null,
        part_height: selectedValue.heightRange?.[0] || null,
        part_to_height: selectedValue.heightRange?.[1] || null,
        part_edu: selectedValue.education?.map(name => educationIdMap[name]).join(',') || null,
        part_country_living: selectedValue.country?.join(',') || null,
        part_state: selectedValue.state?.map(name => stateIdMap[name]).join(',') || null,
        part_city: selectedValue.city?.map(name => cityIdMap[name]).join(',') || null,
        part_marital_status: selectedValue.maritalStatus?.join(',') || null,
        part_smoke: selectedValue.smokingHabits?.join(',') || null,
        part_diet: selectedValue.eatingHabits?.join(',') || null,
        part_drink: selectedValue.DrinkingHabits?.join(',') || null,
        part_physical: selectedValue.physicalStatus?.join(',') || null,
        part_mtongue: selectedValue.mother?.map(name => motherTongueIdMap[name]).join(',') || null,
        part_expect: partnerExpectation.trim(),
    };

    const isFormValid = Object.keys(preferencesData).every((key) => selectedValue[key]?.length > 0) &&
        partnerExpectation.trim().length > 0;

    const submitPreferences = async () => {
        if (!matriId) {
            Alert.alert('Error', 'Matri ID is missing. Please try again.');
            return;
        }

        if (!isFormValid) return;

        try {
            console.log('📤 Sending Data:', requestData);

            const response = await fetch('http://82.29.161.246:8002/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();
            console.log('✅ API Response:', result);

            if (response.ok) {
                props.navigation.navigate('Screen13');
            } else {
                Alert.alert('Error', result.message || 'Something went wrong.');
                console.error('❌ Error submitting preferences:', result);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to the server.');
            console.error('❌ API request failed:', error);
        }
    };

    const maxSelectionLimits = {
        // ageRange: 2,
        // heightRange: 2,
        // maritalStatus: 2,
        // physicalStatus: 2,
        // eatingHabits: 2,
        // DrinkingHabits: 2,
        // smokingHabits: 2,
        // religion: 4,
        // caste: 4,
        // mother: 4,
        // education: 4,
        // occupations: 4,
        // incomes: 2,
        // country: 1,
        // state: 2,
        // city: 5,
    };

    const renderModal = (key: string, data: string[]) => {
        if (key === 'heightRange' || key === 'incomes') {
            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible && selectedPreference === key}
                    onRequestClose={closeModal}
                >
                    <View style={styles2.modalContainer}>
                        <View style={styles2.modalContent}>
                            <Text style={styles2.modalTitle}>{`Select ${key.replace(/([A-Z])/g, ' $1').trim()}`}</Text>

                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => {
                                    const isSelected = selectedValue[key]?.includes(item);
                                    return (
                                        <TouchableOpacity
                                            style={[styles2.modalItem, isSelected && { backgroundColor: '#d3f9d8' }]}
                                            onPress={() => {
                                                if (selectedValue[key]?.length >= (maxSelectionLimits[key] || Infinity) && !isSelected) {
                                                    setSnackbarMessage(`You can select a maximum of ${maxSelectionLimits[key]} options for ${key}.`);
                                                    setSnackbarVisible(true);
                                                    return;
                                                }

                                                setSelectedValue(prev => ({
                                                    ...prev,
                                                    [key]: isSelected
                                                        ? prev[key]?.filter(v => v !== item) || []
                                                        : [...(prev[key] || []), item]
                                                }));
                                            }}
                                        >
                                            <Text style={styles2.modalItemText}>
                                                {isSelected ? '✅ ' : ''} {item}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                            <TouchableOpacity style={styles2.closeModalButton} onPress={closeModal}>
                                <Text style={styles2.closeModalText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            );
        }

        if (['state', 'city', 'religion', 'caste', 'mother', 'education', 'occupations', 'incomes'].includes(key)) {

            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible && selectedPreference === key}
                    onRequestClose={closeModal}
                >
                    <View style={styles2.modalContainer}>
                        <View style={styles2.modalContent}>
                            <Text style={styles2.modalTitle}>{`Select ${key.replace(/([A-Z])/g, ' $1').trim()}`}</Text>

                            {/* Search Input */}
                            {key === 'state' && (
                                <TextInput
                                    placeholder="Search State"
                                    placeholderTextColor="#999"
                                    value={stateSearchQuery}
                                    onChangeText={setStateSearchQuery}
                                    style={styles2.searchInput}
                                />
                            )}
                            {key === 'city' && (
                                <TextInput
                                    placeholder="Search City"
                                    placeholderTextColor="#999"
                                    value={citySearchQuery}
                                    onChangeText={setCitySearchQuery}
                                    style={styles2.searchInput}
                                />
                            )}
                            {key === 'religion' && (
                                <TextInput
                                    placeholder="Search Religion"
                                    placeholderTextColor="#999"
                                    value={religionSearchQuery}
                                    onChangeText={setReligionSearchQuery}
                                    style={styles2.searchInput}
                                />
                            )}
                            {key === 'caste' && (
                                <TextInput
                                    placeholder="Search Caste"
                                    placeholderTextColor="#999"
                                    value={casteSearchQuery}
                                    onChangeText={setCasteSearchQuery}
                                    style={styles2.searchInput}
                                />
                            )}
                            {key === 'mother' && (
                                <TextInput
                                    placeholder="Search Mother Tongue"
                                    placeholderTextColor="#999"
                                    value={motherSearchQuery}
                                    onChangeText={setMotherSearchQuery}
                                    style={styles2.searchInput}
                                />
                            )}
                            {key === 'education' && (
                                <TextInput
                                    placeholder="Search Education"
                                    placeholderTextColor="#999"
                                    value={educationSearchQuery}
                                    onChangeText={setEducationSearchQuery}
                                    style={styles2.searchInput}
                                />
                            )}
                            {key === 'occupations' && (
                                <TextInput
                                    placeholder="Search Occupation"
                                    placeholderTextColor="#999"
                                    value={occupationSearchQuery}
                                    onChangeText={setOccupationSearchQuery}
                                    style={styles2.searchInput}
                                />
                            )}
                            {key === 'incomes' && (
                                <TextInput
                                    placeholder="Search Income"
                                    placeholderTextColor="#999"
                                    value={incomeSearchQuery}
                                    onChangeText={setIncomeSearchQuery}
                                    style={styles2.searchInput}
                                />
                            )}

                            <FlatList
                                data={
                                    key === 'state' ? filteredStates :
                                        key === 'city' ? filteredCities :
                                            key === 'religion' ? filteredReligions :
                                                key === 'caste' ? filteredCastes :
                                                    key === 'mother' ? filteredMotherTongues :
                                                        key === 'education' ? filteredEducations :
                                                            key === 'occupations' ? filteredOccupations :
                                                                key === 'incomes' ? filteredIncomes :
                                                                    [...data].sort((a, b) => a.localeCompare(b))
                                }
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => {
                                    const isSelected = selectedValue[key]?.includes(item);
                                    return (
                                        <TouchableOpacity
                                            style={[styles2.modalItem, isSelected && { backgroundColor: '#d3f9d8' }]}
                                            onPress={() => {
                                                if (selectedValue[key]?.length >= (maxSelectionLimits[key] || Infinity) && !isSelected) {
                                                    setSnackbarMessage(`You can select a maximum of ${maxSelectionLimits[key]} options for ${key}.`);
                                                    setSnackbarVisible(true);
                                                    return;
                                                }

                                                setSelectedValue(prev => {
                                                    const updatedValues = prev[key] || [];
                                                    const newValues = isSelected
                                                        ? updatedValues.filter((v) => v !== item)
                                                        : [...updatedValues, item];

                                                    if (key === 'religion') {
                                                        setSelectedReligions(newValues);
                                                    }

                                                    if (key === 'state') {
                                                        setSelectedStates(newValues);
                                                    }

                                                    return {
                                                        ...prev,
                                                        [key]: newValues,
                                                    };
                                                });
                                            }}
                                        >
                                            <Text style={styles2.modalItemText}>
                                                {isSelected ? '✅ ' : ''} {item}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                            <TouchableOpacity style={styles2.closeModalButton} onPress={closeModal}>
                                <Text style={styles2.closeModalText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            );
        }

        const sortedData = [...data].sort((a, b) => a.localeCompare(b));

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible && selectedPreference === key}
                onRequestClose={closeModal}
            >
                <View style={styles2.modalContainer}>
                    <View style={styles2.modalContent}>
                        <Text style={styles2.modalTitle}>{`Select ${key.replace(/([A-Z])/g, ' $1').trim()}`}</Text>

                        <FlatList
                            data={sortedData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => {
                                const isSelected = selectedValue[key]?.includes(item);
                                return (
                                    <TouchableOpacity
                                        style={[styles2.modalItem, isSelected && { backgroundColor: '#d3f9d8' }]}
                                        onPress={() => {
                                            if (selectedValue[key]?.length >= (maxSelectionLimits[key] || Infinity) && !isSelected) {
                                                setSnackbarMessage(`You can select a maximum of ${maxSelectionLimits[key]} options for ${key}.`);
                                                setSnackbarVisible(true);
                                                return;
                                            }

                                            setSelectedValue(prev => {
                                                const updatedValues = prev[key] || [];
                                                const newValues = isSelected
                                                    ? updatedValues.filter((v) => v !== item)
                                                    : [...updatedValues, item];

                                                if (key === 'religion') {
                                                    setSelectedReligions(newValues);
                                                }

                                                if (key === 'state') {
                                                    setSelectedStates(newValues);
                                                }

                                                return {
                                                    ...prev,
                                                    [key]: newValues,
                                                };
                                            });
                                        }}
                                    >
                                        <Text style={styles2.modalItemText}>
                                            {isSelected ? '✅ ' : ''} {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        <TouchableOpacity style={styles2.closeModalButton} onPress={closeModal}>
                            <Text style={styles2.closeModalText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={{ marginHorizontal: wp('5%'), height: 'auto' }}>
                    {/* Back Button */}
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
                    </TouchableOpacity>

                    {/* DM Profile */}
                    <TouchableOpacity style={{ marginTop: hp('2%') }}>
                        <Image source={DM?.Icon18} resizeMode="stretch" style={styles1.profileimageDM1} />
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={{ borderWidth: 1, borderColor: '#BFBFBF', marginTop: hp('1%'), marginHorizontal: wp('-5%') }}></View>
                    {/* Heading */}
                    <View style={{ alignSelf: 'center' }}>
                        <Text style={styles1.textt3}>Recommended Partner Preferences</Text>
                        <View style={{ alignItems: 'center', marginTop: hp('1%') }}>
                            <Text style={styles1.lightcolorB}>We have set these Preferences to show you the </Text>
                            <Text style={styles1.lightcolorB}>best Matches for your Profile.</Text>
                            <Text style={styles1.lightcolorBB1}>Tap on the field to edit.</Text>
                        </View>
                    </View>

                    {/* Basic Preference */}
                    <View style={{ borderWidth: 2, borderColor: '#00000040', borderRadius: wp('1%'), marginTop: hp('2%') }}>
                        <Text style={[styles1.textInput, { marginLeft: wp('5%'), marginTop: hp('1%'), fontSize: wp('5%'), color: '#469108', fontFamily: 'Lexend-Bold' }]}>Basic Preference</Text>
                        {/* Age Range */}
                        <TouchableOpacity onPress={() => openModal('ageRange')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Age Range</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.ageRange?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.ageRange?.join(' to ') || 'Tap to select the Age Range'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Height Range */}
                        <TouchableOpacity onPress={() => openModal('heightRange')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Height Range</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.heightRange?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.heightRange?.join(' to ') || 'Tap to select the Height Range'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openModal('maritalStatus')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Marital status</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.maritalStatus?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.maritalStatus?.join(',') || 'Tap to select the Marital status'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openModal('physicalStatus')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Physical status</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.physicalStatus?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.physicalStatus?.join(',') || 'Tap to select the Physical status'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openModal('eatingHabits')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Eating Habits</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.eatingHabits?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.eatingHabits?.join(',') || 'Tap to select the Eating Habits'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openModal('smokingHabits')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Smoking Habits</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.smokingHabits?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.smokingHabits?.join(',') || 'Tap to select the Smoking Habits'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openModal('DrinkingHabits')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Drinking Habits</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.DrinkingHabits?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.DrinkingHabits?.join(', ') || 'Tap to select Drinking Habits'}                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: '#00000040', borderRadius: wp('1%'), marginTop: hp('2%') }}>
                        <Text style={[styles1.textIn, { marginLeft: wp('5%'), marginTop: hp('1%'), fontSize: wp('5%'), color: '#469108', fontFamily: 'Lexend-Bold' }]}>
                            Location Preference
                        </Text>

                        {/* Country Living In */}
                        <TouchableOpacity onPress={() => openModal('country')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Country Living In</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.country?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.country?.join(',') || 'Tap to select Country'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openModal('state')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Residing state</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.state?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.state?.join(',') || 'Choose partners state'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => openModal('city')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Residing city</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.city?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.city?.join(',') || 'Choose partners city'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* Religion */}
                    <View style={{ borderWidth: 1, borderColor: '#00000040', borderRadius: wp('1%'), marginTop: hp('2%') }}>
                        <Text style={[styles1.textIn, { marginLeft: wp('5%'), marginTop: hp('1%'), fontSize: wp('5%'), color: '#469108', fontFamily: 'Lexend-Bold' }]}>Religion Preference </Text>

                        <TouchableOpacity onPress={() => openModal('religion')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Religion</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.religion?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.religion?.join(',') || 'Tap to select the details'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Caste */}
                        <TouchableOpacity onPress={() => openModal('caste')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcolorB, { marginLeft: wp('2.5%') }]}>Caste</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.caste?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.caste?.join(',') || 'Tap to select the details'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openModal('mother')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcoB, { marginLeft: wp('2.5%') }]}>Mother Tongue</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.mother?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.mother?.join(',') || 'Tap to select the details'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: '#00000040', borderRadius: wp('1%'), marginTop: hp('2%'), marginBottom: hp('1%') }}>
                        <Text style={[styles1.textIn, { marginLeft: wp('5%'), marginTop: hp('1%'), fontSize: wp('5%'), color: '#469108', fontFamily: 'Lexend-Bold' }]}>
                            Professional Preference
                        </Text>

                        {/* Education */}
                        <TouchableOpacity onPress={() => openModal('education')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={styles1.lightcolorB}>Education</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.education?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.education?.join(',') || 'Choose partners Education'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Occupation */}
                        <TouchableOpacity onPress={() => openModal('occupations')}>
                            <View style={{ flexDirection: 'row', marginLeft: wp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcolorB, { marginLeft: wp('2.5%') }]}>Occupation</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.occupations?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.occupations?.join(', ') || 'Choose partners Occupation'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openModal('incomes')}>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <View style={styles2.iconContainer}>
                                    <Image source={greendot?.Icon149} style={verificationstyles.shorticons} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={[styles1.lightcolorB, { marginLeft: wp('2.5%') }]}>Annual Income</Text>
                                    <Text
                                        style={[
                                            styles1.textIn,
                                            {
                                                marginLeft: wp('2.5%'),
                                                marginTop: hp('0.5%'),
                                                color: selectedValue.incomes?.length > 0 ? '#000' : '#ff7e03',
                                                flexShrink: 1,
                                            },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValue.incomes?.join(' to ') || 'Choose partners Income'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        <View style={styles.container}>
                            <ScrollView contentContainerStyle={{ paddingBottom: hp('1%') }}>
                                {/* ... Your existing components */}
                            </ScrollView>

                            {/* Input box at the bottom */}
                            <View style={styles2.inputContainer}>
                                <TextInput
                                    style={styles2.inputBox}
                                    placeholder="Partner Expectation..."
                                    placeholderTextColor="#569306"
                                    multiline={true}
                                    textAlignVertical="top"
                                    onChangeText={(text) => setPartnerExpectation(text)}
                                    value={partnerExpectation}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ScrollView>

            <TouchableOpacity
                style={{
                    alignSelf: 'center',
                    marginBottom: hp('2%'),
                    marginTop: hp('2%'),
                    backgroundColor: isFormValid ? '#F57C00' : '#E0E0E0',
                    borderRadius: wp('5%'),
                    paddingVertical: hp('1.2%'),
                    paddingHorizontal: wp('15%'),
                }}
                onPress={submitPreferences}
                disabled={!isFormValid}
            >
                <Text style={{ color: isFormValid ? '#FFF' : '#AAA', fontSize: wp('4%'), fontFamily: 'Lexend-Medium' }}>Next</Text>
            </TouchableOpacity>

            {/* Render Modals */}
            {Object.keys(preferencesData).map((key) =>
                renderModal(key, preferencesData[key])
            )}
        </View>
    );
};


const styles2 = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: wp('5%'),
        borderRadius: wp('2.5%'),
        width: wp('70%'),
        maxHeight: hp('60%'),
    },
    modalTitle: {
        fontSize: wp('4.5%'),
        fontFamily: 'Lexend-Medium',
        marginBottom: hp('1%'),
        color: '#F57C00',
    },
    modalItem: {
        padding: hp('1%'),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalItemText: {
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Regular',
        color: 'black'
    },
    closeModalButton: {
        marginTop: hp('1%'),
        padding: hp('1%'),
        borderRadius: wp('1%'),
        alignItems: 'center',
    },
    closeModalText: {
        color: '#F57C00',
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium'
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('1%'),
        width: wp('7.5%'),
    },
    inputContainer: {
        borderWidth: 1.9,
        borderColor: '#ff7b00',
        padding: wp('2.5%'),
        backgroundColor: '#fff',
        width: wp('90%'),
        alignSelf: 'center',
        borderRadius: wp('1%'),
        marginTop: hp('2%'),
    },
    inputBox: {
        minHeight: hp('5%'),
        maxHeight: hp('15%'),
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: wp('1%'),
        paddingHorizontal: wp('2.5%'),
        fontSize: wp('4%'),
        color: '#000',
        textAlignVertical: 'top',
        fontFamily: 'Lexend-Regular',
        alignContent: 'center',

    },
    searchInput: {
        height: hp(5.5),
        width: wp("60%"),
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        marginHorizontal: wp(4),
        marginBottom: hp(1),
        color: 'black',
        backgroundColor: '#f9f9f9',
        fontSize: wp(3.5),
        fontFamily: 'Lexend-Regular',
        alignSelf: 'center'


    },
});

export default Screen21;