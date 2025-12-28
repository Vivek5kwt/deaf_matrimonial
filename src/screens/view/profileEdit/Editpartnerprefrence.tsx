import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView,
    Modal, FlatList, TextInput, ActivityIndicator
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { arrow, greendot } from '../../../utils/constants/icons/icon';
import { getUserData } from '../../../utils/constants/storage';
import SettingHeader from './editscreenHeader';
import { useNavigation } from "@react-navigation/native";

const Screen70 = (props: any) => {
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPreference, setSelectedPreference] = useState<string | null>(null);
    const [partnerExpectation, setPartnerExpectation] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [initialValues, setInitialValues] = useState<{ [key: string]: any }>({});

    // Options state
    const [ageOptions, setAgeOptions] = useState<string[]>([]);
    const [heightOptions, setHeightOptions] = useState<string[]>([]);
    const [motherOptions, setMotherOptions] = useState<string[]>([]);
    const [educationOptions, setEducationOptions] = useState<string[]>([]);
    const [occupationsOptions, setOccupationsOptions] = useState<string[]>([]);
    const [incomesOptions, setIncomesOptions] = useState<string[]>([]);
    const [religionOptions, setReligionOptions] = useState<string[]>([]);
    const [religionIdMap, setReligionIdMap] = useState<{ [key: string]: number }>({});
    const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
    const [casteOptions, setCasteOptions] = useState<string[]>([]);
    const [casteIdMap, setCasteIdMap] = useState<{ [key: string]: number }>({});
    const [stateOptions, setStateOptions] = useState<string[]>([]);
    const [stateIdMap, setStateIdMap] = useState<{ [key: string]: number }>({});
    const [selectedStates, setSelectedStates] = useState<string[]>([]);
    const [cityOptions, setCityOptions] = useState<string[]>([]);
    const [cityIdMap, setCityIdMap] = useState<{ [key: string]: number }>({});
    const [motherTongueIdMap, setMotherTongueIdMap] = useState<{ [key: string]: number }>({});
    const [educationIdMap, setEducationIdMap] = useState<{ [key: string]: number }>({});
    const [occupationIdMap, setOccupationIdMap] = useState<{ [key: string]: number }>({});

    // Selected values state
    const [selectedValue, setSelectedValue] = useState<{ [key: string]: string[] }>({
        ageRange: [],
        heightRange: [],
        maritalStatus: [],
        physicalStatus: [],
        eatingHabits: [],
        DrinkingHabits: [],
        smokingHabits: [],
        religion: [],
        caste: [],
        mother: [],
        education: [],
        occupations: [],
        incomes: [],
        country: [],
        state: [],
        city: [],
    });

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [matriId, setMatriId] = useState<string | null>(null);
    const [indexId, setIndexId] = useState<number | null>(null);

    // Preferences Data
    const preferencesData = {
        ageRange: ageOptions,
        heightRange: heightOptions,
        maritalStatus: ['Does Not Matter', 'Never Married', 'Widower/Divorced', 'Awaiting Divorce'],
        physicalStatus: ['Does Not Matter', 'Deaf + Usher', 'Deaf + Other Disability', 'Hearing Impaired', 'Cochlear Implant', 'Deaf', 'Normal'],
        eatingHabits: ['Does Not Matter', 'Vegetarian', 'Non-Vegetarian', 'Eggetarian'],
        DrinkingHabits: ['Does Not Matter', 'Never Drinks', 'Drinks Socially', 'Drinks Regularly'],
        smokingHabits: ['Does Not Matter', 'Never Smokes', 'Smokes Occasionally', 'Smokes Regularly'],
        religion: religionOptions,
        caste: casteOptions,
        mother: motherOptions,
        education: educationOptions,
        occupations: occupationsOptions,
        incomes: incomesOptions,
        state: stateOptions,
        city: cityOptions,
        country: ['India'],
    };

    // Check if any value has changed
    const hasChanges = () => {
        return JSON.stringify(selectedValue) !== JSON.stringify(initialValues) ||
            partnerExpectation !== (initialValues.partnerExpectation || '');
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch user data first
                const userData = await getUserData();
                if (!userData?.matriId || !userData?.indexId) {
                    throw new Error('User data not found');
                }

                setMatriId(userData.matriId);
                setIndexId(userData.indexId);

                // Fetch all data in parallel
                await Promise.all([
                    fetchAges(),
                    fetchHeights(),
                    fetchMotherTongues(),
                    fetchEducations(),
                    fetchOccupations(),
                    fetchIncomes(),
                    fetchStates(),
                    fetchReligions()
                ]);

                // Then fetch partner preferences after we have all ID maps
                await fetchPartnerPreferences(userData.indexId);

            } catch (error) {
                console.error('Error in fetchData:', error);
                Alert.alert('Error', 'Failed to load data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fetch all necessary data
    const fetchAges = async () => {
        const response = await fetch('http://82.29.161.246:8002/api/ages');
        const json = await response.json();
        setAgeOptions(json.data.map((item: { age: string }) => item.age));
    };

    const fetchHeights = async () => {
        const response = await fetch('http://82.29.161.246:8002/api/heights');
        const json = await response.json();
        setHeightOptions(json.data.map((item: { height: string }) => item.height));
    };

    const fetchMotherTongues = async () => {
        const response = await fetch('http://82.29.161.246:8002/api/mothertongues');
        const json = await response.json();
        setMotherOptions(json.data.map((item: { mtongue_name: string }) => item.mtongue_name));
        
        // Create ID map
        const mapping: { [key: string]: number } = {};
        json.data.forEach((item: { mtongue_name: string; mtongue_id: number }) => {
            mapping[item.mtongue_name] = item.mtongue_id;
        });
        setMotherTongueIdMap(mapping);
    };

    const fetchEducations = async () => {
        const response = await fetch('http://82.29.161.246:8002/api/education-details');
        const json = await response.json();
        setEducationOptions(json.data.map((item: { edu_name: string }) => item.edu_name));
        
        // Create ID map
        const mapping: { [key: string]: number } = {};
        json.data.forEach((item: { edu_name: string; edu_id: number }) => {
            mapping[item.edu_name] = item.edu_id;
        });
        setEducationIdMap(mapping);
    };

    const fetchOccupations = async () => {
        const response = await fetch('http://82.29.161.246:8002/api/occupations');
        const json = await response.json();
        setOccupationsOptions(json.data.map((item: { ocp_name: string }) => item.ocp_name));
        
        // Create ID map
        const mapping: { [key: string]: number } = {};
        json.data.forEach((item: { ocp_name: string; ocp_id: number }) => {
            mapping[item.ocp_name] = item.ocp_id;
        });
        setOccupationIdMap(mapping);
    };

    const fetchIncomes = async () => {
        const response = await fetch('http://82.29.161.246:8002/api/incomes');
        const json = await response.json();
        setIncomesOptions(json.data.map((item: { income: string }) => item.income));
    };

    const fetchStates = async () => {
        const response = await fetch('http://82.29.161.246:8002/api/states');
        const result = await response.json();
        if (result.success) {
            setStateOptions(result.data.map((item: { state_name: string }) => item.state_name));
            const mapping: { [key: string]: number } = {};
            result.data.forEach((item: { state_name: string; state_code: string }) => {
                mapping[item.state_name] = parseInt(item.state_code);
            });
            setStateIdMap(mapping);
        }
    };

    const fetchReligions = async () => {
        const response = await fetch('http://82.29.161.246:8002/api/religions');
        const result = await response.json();
        if (result.success) {
            setReligionOptions(result.data.map((item: { religion_name: string }) => item.religion_name));
            const mapping: { [key: string]: number } = {};
            result.data.forEach((item: { religion_name: string; religion_id: number }) => {
                mapping[item.religion_name] = item.religion_id;
            });
            setReligionIdMap(mapping);
        }
    };

    const fetchPartnerPreferences = async (indexId: number) => {
        try {
            const response = await fetch(`http://82.29.161.246:8002/api/edit-member/${indexId}`);
            const result = await response.json();
    
            if (response.ok && result.user) {
                const userData = result.user;
                const newValues: { [key: string]: string[] } = {
                    ageRange: [],
                    heightRange: [],
                    maritalStatus: [],
                    physicalStatus: [],
                    eatingHabits: [],
                    DrinkingHabits: [],
                    smokingHabits: [],
                    religion: [],
                    caste: [],
                    mother: [],
                    education: [],
                    occupations: [],
                    incomes: [],
                    country: [],
                    state: [],
                    city: [],
                };
    
                // Age Range
                if (userData.part_frm_age_names && userData.part_frm_age_names.length > 0) {
                    newValues.ageRange.push(userData.part_frm_age_names[0].name);
                }
                if (userData.part_to_age_names && userData.part_to_age_names.length > 0) {
                    newValues.ageRange.push(userData.part_to_age_names[0].name);
                }
    
                // Height Range
                if (userData.part_height_names && userData.part_height_names.length > 0) {
                    newValues.heightRange.push(userData.part_height_names[0].name);
                }
                if (userData.part_height_to_names && userData.part_height_to_names.length > 0) {
                    newValues.heightRange.push(userData.part_height_to_names[0].name);
                }
    
                // Marital Status
                if (userData.m_status) {
                    newValues.maritalStatus.push(userData.m_status);
                }
    
                // Physical Status
                if (userData.part_physical) {
                    newValues.physicalStatus.push(userData.part_physical);
                }
    
                // Eating Habits
                if (userData.part_diet) {
                    newValues.eatingHabits.push(userData.part_diet);
                }
    
                // Drinking Habits
                if (userData.part_drink) {
                    newValues.DrinkingHabits.push(userData.part_drink);
                }
    
                // Smoking Habits
                if (userData.part_smoke) {
                    newValues.smokingHabits.push(userData.part_smoke);
                }
    
                // Income
                if (userData.part_income_names && userData.part_income_names.length > 0) {
                    const incomeNames = userData.part_income_names.map((inc: any) => inc.name);
                    newValues.incomes = incomeNames;
                }
                
    
                // Country
                if (userData.part_country_living) {
                    newValues.country.push(userData.part_country_living);
                }
    
                // Religion
                if (userData.part_religion_names) {
                    const religionNames = userData.part_religion_names.map((rel: any) => rel.name);
                    newValues.religion = religionNames;
                    setSelectedReligions(religionNames);
                }
    
                // Caste
                if (userData.part_caste_names) {
                    const casteNames = userData.part_caste_names.map((caste: any) => caste.name);
                    newValues.caste = casteNames;
                }
    
                // Mother Tongue
                if (userData.part_mtongue_names) {
                    const mtongueNames = userData.part_mtongue_names.map((mt: any) => mt.name);
                    newValues.mother = mtongueNames;
                }
    
                // Education
                if (userData.part_edu_names) {
                    const eduNames = userData.part_edu_names.map((edu: any) => edu.name);
                    newValues.education = eduNames;
                }
    
                // Occupation
                if (userData.part_occu_names) {
                    const occuNames = userData.part_occu_names.map((occ: any) => occ.name);
                    newValues.occupations = occuNames;
                }
    
                // State
                if (userData.part_state_names) {
                    const stateNames = userData.part_state_names.map((state: any) => state.name);
                    newValues.state = stateNames;
                    setSelectedStates(stateNames);
                }
    
                // City
                if (userData.part_city_names) {
                    const cityNames = userData.part_city_names.map((city: any) => city.name);
                    newValues.city = cityNames;
                }
    
                setSelectedValue(newValues);
                setInitialValues({ ...newValues, partnerExpectation: userData.part_expect || '' });
                setPartnerExpectation(userData.part_expect || '');
            }
        } catch (error) {
            console.error('Error fetching partner preferences:', error);
        }
    };

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
                        let cityList: string[] = [];
                        const cityIdMapping: { [key: string]: number } = {};
                        
                        Object.values(result.data).forEach((state: any) => {
                            state.forEach((city: any) => {
                                cityList.push(city.city_name);
                                cityIdMapping[city.city_name] = city.city_id;
                            });
                        });
                        
                        const uniqueSortedCities = [...new Set(cityList)].sort((a, b) =>
                            a.localeCompare(b)
                        );
                        setCityOptions(uniqueSortedCities);
                                                setCityIdMap(cityIdMapping);
                    }
                } catch (error) {
                    console.error("Error fetching cities:", error);
                }
            } else {
                setCityOptions([]);
                setCityIdMap({});
            }
        };

        fetchCities();
    }, [selectedStates]);

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
                        let casteList: string[] = [];
                        const casteIdMapping: { [key: string]: number } = {};
                        
                        result.data.forEach((religion: any) => {
                            religion.castes.forEach((caste: any) => {
                                casteList.push(caste.caste_name);
                                casteIdMapping[caste.caste_name] = caste.caste_id;
                            });
                        });
                        
                        setCasteOptions([...new Set(casteList)]);
                        setCasteIdMap(casteIdMapping);
                    }
                } catch (error) {
                    console.error("Error fetching castes:", error);
                }
            } else {
                setCasteOptions([]);
                setCasteIdMap({});
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
    };

    const handleSelect = (item: string, key: string) => {
        setSelectedValue(prev => {
            let newValues = [...(prev[key] || [])];

            // For range fields (age, height)
            if (key === 'ageRange' || key === 'heightRange') {
                if (newValues.length >= 2) {
                    newValues = [item];
                } else {
                    newValues.push(item);
                    // Sort the range values
                    if (key === 'ageRange') {
                        newValues.sort((a, b) => parseInt(a) - parseInt(b));
                    } else if (key === 'heightRange') {
                        newValues.sort((a, b) => parseFloat(a) - parseFloat(b));
                    }
                }
            } 
            // For single selection fields
            else if ([
                'country'
              ].includes(key)) {
                newValues = [item]; // ✅ only restrict income and country
              }
              
            // For multi-selection fields
            else {
                if (newValues.includes(item)) {
                    newValues = newValues.filter(v => v !== item);
                } else {
                    newValues.push(item);
                }
            }

            // Handle cascading dropdowns
            if (key === 'religion') {
                setSelectedReligions(newValues);
                return { ...prev, [key]: newValues, caste: [] };
            }

            if (key === 'state') {
                setSelectedStates(newValues);
                return { ...prev, [key]: newValues, city: [] };
            }

            return { ...prev, [key]: newValues };
        });
    };

    const updatePreferences = async () => {
        if (!matriId || !indexId) {
            Alert.alert('Error', 'User data is missing');
            return;
        }
    
        setIsUpdating(true);
        try {
            // Prepare the data for the API request
            const requestData = {
                matri_id: matriId,
                part_frm_age: selectedValue.ageRange?.[0] ? 
                    ageOptions.findIndex(age => age === selectedValue.ageRange[0]) + 1 : null,
                part_to_age: selectedValue.ageRange?.[1] ? 
                    ageOptions.findIndex(age => age === selectedValue.ageRange[1]) + 1 : null,
                    part_income: selectedValue.incomes?.map(name =>
                        incomesOptions.findIndex(income => income === name) + 1
                    ).join(',') || null,

                part_religion: selectedValue.religion?.map(name => 
                    religionIdMap[name]).join(',') || null,
                part_caste: selectedValue.caste?.map(name => 
                    casteIdMap[name]).join(',') || null,
                part_occu: selectedValue.occupations?.map(name => 
                    occupationIdMap[name]).join(',') || null,
                part_height: selectedValue.heightRange?.[0] ? 
                    heightOptions.findIndex(height => height === selectedValue.heightRange[0]) + 1 : null,
                part_height_to: selectedValue.heightRange?.[1] ? 
                    heightOptions.findIndex(height => height === selectedValue.heightRange[1]) + 1 : null,
                part_edu: selectedValue.education?.map(name => 
                    educationIdMap[name]).join(',') || null,
                part_country_living: selectedValue.country?.join(',') || null,
                part_state: selectedValue.state?.map(name => 
                    stateIdMap[name]).join(',') || null,
                part_city: selectedValue.city?.map(name => 
                    cityIdMap[name]).join(',') || null,
                part_marital_status: selectedValue.maritalStatus?.join(',') || null,
                part_smoke: selectedValue.smokingHabits?.join(',') || null,
                part_diet: selectedValue.eatingHabits?.join(',') || null,
                part_drink: selectedValue.DrinkingHabits?.join(',') || null,
                part_physical: selectedValue.physicalStatus?.join(',') || null,
                part_mtongue: selectedValue.mother?.map(name => 
                    motherTongueIdMap[name]).join(',') || null,
                part_expect: partnerExpectation.trim(),
            };
    
            const response = await fetch(`http://82.29.161.246:8002/api/update/${indexId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });
    
            const result = await response.json();
            if (response.ok) {
                setInitialValues({ 
                    ...selectedValue, 
                    partnerExpectation 
                });
                setSnackbarMessage('Preferences updated successfully');
                setSnackbarVisible(true);
                await fetchPartnerPreferences(indexId);
            } else {
                throw new Error(result.message || 'Failed to update');
            }
        } catch (error: any) {
            setSnackbarMessage(error.message || 'Failed to update preferences');
            setSnackbarVisible(true);
        } finally {
            setIsUpdating(false);
        }
    };

    const renderModal = () => {
        if (!selectedPreference) return null;

        const data = preferencesData[selectedPreference as keyof typeof preferencesData] || [];
        const selectedItems = selectedValue[selectedPreference] || [];

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Select {selectedPreference.replace(/([A-Z])/g, ' $1').trim()}
                        </Text>

                        <FlatList
                            data={data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        selectedItems.includes(item) && { backgroundColor: '#d3f9d8' }
                                    ]}
                                    onPress={() => handleSelect(item, selectedPreference)}
                                >
                                    <Text style={styles.modalItemText}>
                                        {selectedItems.includes(item) ? '✓ ' : ''}{item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={closeModal}
                        >
                            <Text style={styles.closeModalText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#F57C00" />
                <Text style={styles.loadingText}>Loading Preferences...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Fixed Header */}
            <View style={styles.fixedHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => props.navigation.goBack()}
                >
                    <Image source={arrow?.Icon5} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile Details</Text>
            </View>

            <SettingHeader navigation={navigation} profileCounts={{}} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <PreferenceSection
                    title="Basic Preference"
                    items={[
                        { label: 'Age Range', key: 'ageRange' },
                        { label: 'Height Range', key: 'heightRange' },
                        { label: 'Marital Status', key: 'maritalStatus' },
                        { label: 'Physical Status', key: 'physicalStatus' },
                        { label: 'Eating Habits', key: 'eatingHabits' },
                        { label: 'Smoking Habits', key: 'smokingHabits' },
                        { label: 'Drinking Habits', key: 'DrinkingHabits' },
                    ]}
                    selectedValue={selectedValue}
                    openModal={openModal}
                />

                <PreferenceSection
                    title="Location Preference"
                    items={[
                        { label: 'Country', key: 'country' },
                        { label: 'State', key: 'state' },
                        { label: 'City', key: 'city' },
                    ]}
                    selectedValue={selectedValue}
                    openModal={openModal}
                />

                <PreferenceSection
                    title="Religion Preference"
                    items={[
                        { label: 'Religion', key: 'religion' },
                        { label: 'Caste', key: 'caste' },
                        { label: 'Mother Tongue', key: 'mother' },
                    ]}
                    selectedValue={selectedValue}
                    openModal={openModal}
                />

                <PreferenceSection
                    title="Professional Preference"
                    items={[
                        { label: 'Education', key: 'education' },
                        { label: 'Occupation', key: 'occupations' },
                        { label: 'Annual Income', key: 'incomes' },
                    ]}
                    selectedValue={selectedValue}
                    openModal={openModal}
                />

                {/* Partner Expectation */}
                <View style={styles.expectationContainer}>
                    <Text style={styles.sectionTitle}>Partner Expectation</Text>
                    <TextInput
                        style={styles.expectationInput}
                        placeholder="Describe your expectations..."
                        placeholderTextColor="#999"
                        multiline
                        value={partnerExpectation}
                        onChangeText={setPartnerExpectation}
                    />
                </View>
            </ScrollView>

            {/* Update Button */}
            <TouchableOpacity
                style={[
                    styles.updateButton,
                    (!hasChanges() || isUpdating) && { backgroundColor: '#E0E0E0' }
                ]}
                onPress={updatePreferences}
                disabled={!hasChanges() || isUpdating}
            >
                {isUpdating ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.updateButtonText}>
                        Update Preferences
                    </Text>
                )}
            </TouchableOpacity>

            {/* Modal */}
            {renderModal()}

            {/* Snackbar */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
};

const PreferenceSection = ({ title, items, selectedValue, openModal }: {
    title: string;
    items: { label: string, key: string }[];
    selectedValue: { [key: string]: string[] };
    openModal: (key: string) => void;
}) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>

        {items.map((item) => (
            <PreferenceItem
                key={item.key}
                label={item.label}
                value={selectedValue[item.key]?.join(', ') || 'Not selected'}
                onPress={() => openModal(item.key)}
            />
        ))}
    </View>
);

const PreferenceItem = ({ label, value, onPress }: {
    label: string;
    value: string;
    onPress: () => void;
}) => (
    <TouchableOpacity style={styles.preferenceItem} onPress={onPress}>
        <View style={styles.preferenceTextContainer}>
            <Text style={styles.preferenceLabel}>{label}</Text>
            <Text
                style={[
                    styles.preferenceValue,
                    value === 'Not selected' && { color: '#ff7e03' }
                ]}
                numberOfLines={2}
            >
                {value}
            </Text>
        </View>
        <Image source={greendot?.Icon149} style={styles.preferenceIcon} />
    </TouchableOpacity>
);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('10%'),
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: hp('2%'),
        fontSize: wp('4%'),
        color: '#555',
        fontFamily: 'Lexend-Regular',

    },
    backButton: {
        marginTop: hp('2%'),
        alignSelf: 'flex-start',
    },
    backIcon: {
        height: hp('2.2%'),
        width: wp('5.8%'),
        marginTop: hp('-0.9%'),
        tintColor: "white",
        marginRight: wp('14%'),
    },
    title: {
        color: "#fff",
        fontSize: wp('5.2%'),
        marginTop: hp('0.2%'),
        fontFamily: "Lexend-Medium",
    },
    subtitle: {
        fontSize: wp('3.8%'),
        fontFamily: 'Lexend-Regular',
        color: '#666',
        textAlign: 'center',
        marginBottom: hp('2%'),
    },
    sectionContainer: {
        backgroundColor: '#fff',
        borderRadius: wp('2%'),
        padding: wp('4%'),
        marginBottom: hp('2%'),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    sectionTitle: {
        fontSize: wp('4.5%'),
        fontFamily: 'Lexend-Bold',
        color: '#469108',
        marginBottom: hp('1.5%'),
    },
    preferenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp('1.5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    preferenceTextContainer: {
        flex: 1,
        marginRight: wp('2%'),
    },
    preferenceLabel: {
        fontSize: wp('3.8%'),
        fontFamily: 'Lexend-Medium',
        color: '#555',
    },
    preferenceValue: {
        fontSize: wp('3.8%'),
        fontFamily: 'Lexend-Regular',
        marginTop: hp('0.5%'),
        color: '#333',
    },
    preferenceIcon: {
        width: wp('4%'),
        height: wp('4%'),
    },
    expectationContainer: {
        backgroundColor: '#fff',
        borderRadius: wp('2%'),
        padding: wp('4%'),
        marginBottom: hp('2%'),
        elevation: 2,
    },
    expectationInput: {
        minHeight: hp('10%'),
        fontSize: wp('3.8%'),
        fontFamily: 'Lexend-Regular',
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: wp('2%'),
        padding: wp('2%'),
        textAlignVertical: 'top',
    },
    updateButton: {
        position: 'absolute',
        bottom: hp('2%'),
        alignSelf: 'center',
        backgroundColor: '#F57C00',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('20%'),
        borderRadius: wp('5%'),
    },
    updateButtonText: {
        color: '#fff',
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: wp('80%'),
        maxHeight: hp('60%'),
        borderRadius: wp('3%'),
        padding: wp('4%'),
    },
    modalTitle: {
        fontSize: wp('4.5%'),
        fontFamily: 'Lexend-Bold',
        color: '#F57C00',
        marginBottom: hp('2%'),
    },
    modalItem: {
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('2%'),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalItemText: {
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Regular',
        color: '#333',
    },
    closeModalButton: {
        marginTop: hp('2%'),
        backgroundColor: '#F57C00',
        padding: hp('1.5%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
    },
    closeModalText: {
        color: '#fff',
        fontSize: wp('4%'),
        fontFamily: 'Lexend-Medium',
    },
    header: {
        backgroundColor: "#FF7E00",
        padding: wp('4%'),
        flexDirection: "row",
        flex: 1,
    },
    fixedHeader: {
        backgroundColor: '#FF7E00',
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('4%'),
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        zIndex: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: wp('5%'),
        fontFamily: 'Lexend-Medium',
        marginLeft: wp('4%'),
    },
});

export default Screen70;