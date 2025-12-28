import React, { useState, useEffect } from 'react';
import {View,StatusBar,TouchableOpacity,
  Image,
  TextInput,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Icons (replace with your actual icon paths)
const arrowIcon = require('../../../../../../assets/icons/arrow.png');
const dropdownIcon = require('../../../../../../assets/icons/downn.png');
const checkIcon = require('../../../../../../assets/icons/Check1.png');

interface DropdownItem {
  id: string;
  name: string;
  status?: string;
  religion_id?: number;
}

const SearchScreen = (props: any) => {
  // State variables
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [heightRange, setHeightRange] = useState([58, 69]);
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentDropdown, setCurrentDropdown] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState<DropdownItem[]>([]);
  const [religions, setReligions] = useState<DropdownItem[]>([]);
  const [educations, setEducations] = useState<DropdownItem[]>([]);
  const [occupations, setOccupations] = useState<DropdownItem[]>([]);
  const [filteredCastes, setFilteredCastes] = useState<DropdownItem[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<DropdownItem[]>([]);
  const [physicalStatuses, setPhysicalStatuses] = useState<DropdownItem[]>([]);
  const [profileTypes, setProfileTypes] = useState<DropdownItem[]>([]);
  const [registerProfiles, setRegisterProfiles] = useState<DropdownItem[]>([]);
  const [states, setStates] = useState<DropdownItem[]>([]);
  const [matriId, setMatriId] = useState('');
  const [keywordSearch, setKeywordSearch] = useState('');
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);

  const [selectedItems, setSelectedItems] = useState<{ [key: string]: DropdownItem[] }>({
    religion: [],
    education: [],
    caste: [],
    maritalStatus: [],
    physicalStatus: [],
    profileType: [],
    registerProfile: [],
    occupation: [],
    state: []
  });

  const screenWidth = Dimensions.get('window').width;
  const sliderWidth = screenWidth * 0.85;

  // Load token and initial data
  useEffect(() => {
    const loadTokenAndData = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        console.log("🔍 Token from AsyncStorage:", token);
        setAuthToken(token);
        fetchInitialData();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadTokenAndData();
  }, []);
  
  // NEW: Clear Matri ID when other filters change
  useEffect(() => {
    if (matriId.trim() !== '') {
      clearMatriId();
    }
  }, [ageRange, heightRange, selectedItems, keywordSearch]);

  const clearMatriId = () => {
    setMatriId('');
  };

  const searchByMatriId = async () => {
    if (!matriId.trim()) {
      showCustomAlert('Please enter a Matri ID');
      return;
    }
    
    // NEW: Clear all other filters when searching by Matri ID
    clearAllFilters();
    
    setIsLoading(true);
    try {
      const url = `http://82.29.161.246:8002/api/search?matri_id=${matriId.trim()}`;
      console.log('🔍 Matri ID Search URL:', url);
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data?.data?.length > 0) {
        props.navigation.navigate('SearchResultsScreen', {
          profiles: response.data.data,
          searchParams: { matri_id: matriId },
        });
      } else {
        setShowNoResultsModal(true);
      }
    } catch (error) {
      console.error('❌ Matri ID Search Error:', error);
      showCustomAlert('Profile not found with this Matri ID');
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Function to clear all filters except Matri ID
  const clearAllFilters = () => {
    setAgeRange([18, 40]);
    setHeightRange([58, 69]);
    setKeywordSearch('');
    setSelectedItems({
      religion: [],
      education: [],
      caste: [],
      maritalStatus: [],
      physicalStatus: [],
      profileType: [],
      registerProfile: [],
      occupation: [],
      state: []
    });
  };

  // Filter castes when religion changes
  useEffect(() => {
    if (selectedItems.religion.length > 0) {
      const religionId = parseInt(selectedItems.religion[0].id);
      setSelectedItems(prev => ({
        ...prev,
        caste: []
      }));
      filterCastesByReligion(religionId);
    } else {
      setFilteredCastes([]);
      setSelectedItems(prev => ({
        ...prev,
        caste: []
      }));
    }
  }, [selectedItems.religion]);

  // Fetch all initial data
  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchReligions(),
        fetchEducations(),
        fetchOccupations(),
        fetchMaritalStatuses(),
        fetchPhysicalStatuses(),
        fetchProfileTypes(),
        fetchRegisterProfiles(),
        fetchStates(),
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  // API calls for dropdown options (keep all your existing API functions)
  const fetchStates = async () => {
    try {
      const response = await axios.get('http://82.29.161.246:8002/api/states');
      if (response.data.success && response.data.data) {
        setStates(response.data.data.map((item: any) => ({
          id: item.state_id.toString(),
          name: item.state_name,
          status: item.status,
        })));
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchOccupations = async () => {
    try {
      const response = await axios.get('http://82.29.161.246:8002/api/occupations');
      if (response.data.success && response.data.data) {
        setOccupations(response.data.data.map((item: any) => ({
          id: item.ocp_id.toString(),
          name: item.ocp_name,
          status: item.status
        })));
      }
    } catch (error) {
      console.error('Error fetching occupations:', error);
    }
  };

  const fetchReligions = async () => {
    try {
      const response = await axios.get('http://82.29.161.246:8002/api/religions');
      if (response.data.success && response.data.data) {
        setReligions(response.data.data.map((item: any) => ({
          id: item.religion_id.toString(),
          name: item.religion_name,
          status: item.status
        })));
      }
    } catch (error) {
      console.error('Error fetching religions:', error);
    }
  };

  const fetchEducations = async () => {
    try {
      const response = await axios.get('http://82.29.161.246:8002/api/education-details');
      if (response.data.success && response.data.data) {
        setEducations(response.data.data.map((item: any) => ({
          id: item.edu_id.toString(),
          name: item.edu_name
        })));
      }
    } catch (error) {
      console.error('Error fetching educations:', error);
    }
  };

  const filterCastesByReligion = async (religionId: number) => {
    if (!religionId) return;

    try {
      const response = await axios.get(`http://82.29.161.246:8002/api/castes/${religionId}`);
      if (response.data?.data) {
        const filtered = response.data.data.map((item: any) => ({
          id: item.caste_id.toString(),
          name: item.caste_name,
          religion_id: item.religion_id,
        }));
        setFilteredCastes(filtered);
      } else {
        setFilteredCastes([]);
      }
    } catch (error) {
      console.error('Error fetching castes by religion:', error);
      setFilteredCastes([]);
    }
  };

  // Static data for dropdowns (keep all your existing static data functions)
  const fetchMaritalStatuses = async () => {
    try {
      setMaritalStatuses([
        { id: 'never_married', name: 'Never Married' },
        { id: 'widowed', name: 'Widowed' },
        { id: 'divorced', name: 'Divorced' },
        { id: 'separated', name: 'Separated' }
      ]);
    } catch (error) {
      console.error('Error fetching marital statuses:', error);
    }
  };

  const fetchPhysicalStatuses = async () => {
    try {
      setPhysicalStatuses([
        { id: 'deaf', name: 'Deaf' },
        { id: 'hearing_impaired', name: 'Hearing Impaired' },
        { id: 'deaf_other_disability', name: 'Deaf + Other Disability' },
        { id: 'deaf_usher', name: 'Deaf + Usher' },
        { id: 'cochlear_implant', name: 'Cochlear Implant' },
        { id: 'normal', name: 'Normal' }
      ]);
    } catch (error) {
      console.error('Error fetching physical statuses:', error);
    }
  };

  const fetchProfileTypes = async () => {
    try {
      setProfileTypes([
        { id: 'profile_with_photo', name: 'With Photo' },
        { id: 'profile_with_horoscope', name: 'Profile With Horoscope' },
        { id: 'does_not_matter', name: 'Does not matter' }
      ]);
    } catch (error) {
      console.error('Error fetching profile types:', error);
    }
  };

  const fetchRegisterProfiles = async () => {
    try {
      setRegisterProfiles([
        { id: 'today_register_profile', name: 'Today Register Profile' },
        { id: 'last_three_days_register_profile', name: 'Last Three Days Register Profile' },
        { id: 'last_week_register_profile', name: 'Last Week Register Profile' },
        { id: 'last_month_register_profile', name: 'Last Month Register Profile' }
      ]);
    } catch (error) {
      console.error('Error fetching register profiles:', error);
    }
  };

  // Helper functions (keep all your existing helper functions)
  const formatHeight = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  const handleAgeChange = (values: number[]) => {
    setAgeRange(values);
  };

  const handleHeightChange = (values: number[]) => {
    setHeightRange(values);
  };

  const showCustomAlert = (message: string) => {
    Alert.alert(
      '',
      message,
      [
        {
          text: 'OK',
          style: 'default'
        }
      ],
      { cancelable: false }
    );
  };

  const validateSearch = () => {
    if (ageRange[0] > ageRange[1]) {
      showCustomAlert('Minimum age cannot be greater than maximum age');
      return false;
    }
    if (heightRange[0] > heightRange[1]) {
      showCustomAlert('Minimum height cannot be greater than maximum height');
      return false;
    }
    return true;
  };

  // Dropdown management (keep all your existing dropdown functions)
  const openDropdown = (dropdownName: string) => {
    setCurrentDropdown(dropdownName);

    switch (dropdownName) {
      case 'religion':
        setDropdownOptions(religions);
        break;
      case 'education':
        setDropdownOptions(educations);
        break;
      case 'caste':
        if (selectedItems.religion.length > 0) {
          setDropdownOptions(filteredCastes);
        } else {
          setDropdownOptions([]);
          showCustomAlert('Please select a religion first');
          return;
        }
        break;
      case 'maritalStatus':
        setDropdownOptions(maritalStatuses);
        break;
      case 'physicalStatus':
        setDropdownOptions(physicalStatuses);
        break;
      case 'profileType':
        setDropdownOptions(profileTypes);
        break;
      case 'registerProfile':
        setDropdownOptions(registerProfiles);
        break;
      case 'occupation':
        setDropdownOptions(occupations);
        break;
      case 'state':
        setDropdownOptions(states);
        break;
      default:
        setDropdownOptions([]);
    }

    setShowDropdown(true);
  };

  const toggleItemSelection = (item: DropdownItem) => {
    setSelectedItems((prev) => {
      if (["registerProfile", "profileType"].includes(currentDropdown)) {
        return {
          ...prev,
          [currentDropdown]: [item],
        };
      }
      
      const currentSelected = prev[currentDropdown] || [];
      const isSelected = currentSelected.some((selected) => selected.id === item.id);
  
      let newSelected;
      if (isSelected) {
        newSelected = currentSelected.filter((selected) => selected.id !== item.id);
      } else {
        newSelected = [...currentSelected, item];
      }
  
      return {
        ...prev,
        [currentDropdown]: newSelected,
      };
    });
  
    if (["registerProfile", "profileType"].includes(currentDropdown)) {
      closeDropdown();
    }
  };

  const getSelectedItemsLabel = (dropdownName: string) => {
    const selected = selectedItems[dropdownName] || [];
    if (selected.length === 0) return 'Doesn\'t Matter';

    if (selected.length > 2) {
      return `${selected.length} selected`;
    }

    return selected.map(item => item.name).join(', ');
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const clearSelection = (dropdownName: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [dropdownName]: []
    }));
  };

  // Search functionality
  const buildSearchParams = () => {
    const params: any = {};
  
    // ✅ Required filters
    params.age_from = ageRange[0];
    params.age_to = ageRange[1];
    params.height_from = formatHeightForAPI(heightRange[0]);
    params.height_to = formatHeightForAPI(heightRange[1]);
  
    // NEW: Only include matri_id if it's the only search criteria
    if (matriId.trim() && isMatriIdOnlySearch()) {
      params.matri_id = matriId.trim();
    }
  
    if (keywordSearch.trim()) params.keyword = keywordSearch.trim();
  
    if (selectedItems.profileType.length > 0) {
      params.profile_type = selectedItems.profileType[0].id.toLowerCase();
    }
  
    if (selectedItems.registerProfile.length > 0) {
      params.latest_register_profile = selectedItems.registerProfile[0].id.toLowerCase();
    }

    const addMultiParam = (key: string, items: DropdownItem[], param: string) => {
      if (items.length > 0) {
        params[param] = items.map(i => i.name.toLowerCase()).join(',');
      }
    };
  
    addMultiParam('maritalStatus', selectedItems.maritalStatus, 'm_status');
    addMultiParam('religion', selectedItems.religion, 'religion');
    addMultiParam('caste', selectedItems.caste, 'caste');
    addMultiParam('education', selectedItems.education, 'edu_detail');
    addMultiParam('occupation', selectedItems.occupation, 'occupations');
    addMultiParam('state', selectedItems.state, 'state');
    addMultiParam('Physical Status', selectedItems.physicalStatus, 'Physical Status');

    console.log('✅ Final Params:', params);
    return params;
  };

  // NEW: Check if only Matri ID is being used for search
  const isMatriIdOnlySearch = () => {
    return matriId.trim() !== '' && 
           ageRange[0] === 18 && 
           ageRange[1] === 40 && 
           heightRange[0] === 58 && 
           heightRange[1] === 69 && 
           keywordSearch.trim() === '' &&
           Object.values(selectedItems).every(arr => arr.length === 0);
  };
  
  // Helper function to format height for API
  const formatHeightForAPI = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}ft ${remainingInches}`;
  };
  
  const handleSearchNow = async (page = 1) => {
    if (!validateSearch()) return;
    if (!authToken) {
      showCustomAlert('Please login to perform search');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const params = buildSearchParams();
      params.page = page;
      
      // ✅ Manual query string without encoding
      const queryString = Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
  
      const url = `http://82.29.161.246:8002/api/search?${queryString}`;
      console.log('🌐 Final URL:', url);
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('📦 API Response:', response.data);
  
      if (response.data?.data?.length > 0) {
        props.navigation.navigate('SearchResultsScreen', {
          profiles: response.data.data,
          searchParams: params,
          paginationData: response.data,
        });
      } else {
        setShowNoResultsModal(true);
      }
    } catch (err) {
      console.error('❌ Search Error:', err);
      showCustomAlert('Something went wrong while searching');
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable Dropdown Component (keep your existing DropdownField component)
  const DropdownField = ({ label, dropdownName, disabled = false }: {
    label: string;
    dropdownName: string;
    disabled?: boolean;
  }) => (
    <View style={styles.dropdownContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {(selectedItems[dropdownName]?.length || 0) > 0 && (
          <TouchableOpacity onPress={() => clearSelection(dropdownName)}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={() => !disabled && openDropdown(dropdownName)}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <View style={[
          styles.dropdownValueContainer,
          disabled && styles.disabledDropdown
        ]}>
          <Text
            style={[
              styles.dropdownText,
              (selectedItems[dropdownName]?.length || 0) > 0 && styles.selectedDropdownText,
              disabled && styles.disabledDropdownText
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {disabled ? 'Select religion first' : getSelectedItemsLabel(dropdownName)}
          </Text>
          {!disabled && <Image source={dropdownIcon} style={styles.dropdownIcon} />}
        </View>
      </TouchableOpacity>
      {(selectedItems[dropdownName]?.length || 0) > 0 && (
        <View style={styles.chipsContainer}>
          {selectedItems[dropdownName]?.slice(0, 3).map((item, index) => (
            <View key={`${dropdownName}-${index}`} style={styles.chip}>
              <Text style={styles.chipText}>{item.name}</Text>
            </View>
          ))}
          {(selectedItems[dropdownName]?.length || 0) > 3 && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>+{(selectedItems[dropdownName]?.length || 0) - 3} more</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with back button and Matri ID search */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backButton}>
          <Image source={arrowIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter Matri ID Here"
          placeholderTextColor="#999"
          value={matriId}
          onChangeText={setMatriId}
          onSubmitEditing={searchByMatriId}
        />
        <TouchableOpacity 
          onPress={searchByMatriId}
          style={styles.searchIconButton}
        >
          <Text style={styles.searchText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Rest of your JSX remains exactly the same */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Personalize your search</Text>

        {/* Age Range Slider */}
        <View style={styles.card}>
          <Text style={styles.label}>Age</Text>
          <View style={styles.sliderTextContainer}>
            <Text style={styles.sliderValueText}>Min {ageRange[0]} yrs</Text>
            <Text style={styles.sliderValueText}>Max {ageRange[1]} yrs</Text>
          </View>
          <MultiSlider
            values={ageRange}
            sliderLength={sliderWidth}
            min={18}
            max={60}
            step={1}
            onValuesChange={handleAgeChange}
            selectedStyle={styles.selectedSlider}
            unselectedStyle={styles.unselectedSlider}
            markerStyle={styles.sliderMarker}
            containerStyle={styles.sliderStyle}
          />
        </View>

        {/* Height Range Slider */}
        <View style={styles.card}>
          <Text style={styles.label}>Height</Text>
          <View style={styles.sliderTextContainer}>
            <Text style={styles.sliderValueText}>Min {formatHeight(heightRange[0])}</Text>
            <Text style={styles.sliderValueText}>Max {formatHeight(heightRange[1])}</Text>
          </View>
          <MultiSlider
            values={heightRange}
            sliderLength={sliderWidth}
            min={53}
            max={84}
            step={1}
            onValuesChange={handleHeightChange}
            selectedStyle={styles.selectedSlider}
            unselectedStyle={styles.unselectedSlider}
            markerStyle={styles.sliderMarker}
            containerStyle={styles.sliderStyle}
          />
        </View>

        {/* All Dropdown Fields */}
        <View style={styles.card}>
          <DropdownField label="Marital Status" dropdownName="maritalStatus" />
        </View>

        <View style={styles.card}>
          <DropdownField label="Physical Status" dropdownName="physicalStatus" />
        </View>

        <View style={styles.card}>
          <DropdownField label="Religion" dropdownName="religion" />
        </View>

        <View style={styles.card}>
          <DropdownField label="Occupation" dropdownName="occupation" />
        </View>

        <View style={styles.card}>
          <DropdownField label="Education" dropdownName="education" />
          <View style={styles.divider} />
          <DropdownField
            label="Caste"
            dropdownName="caste"
            disabled={selectedItems.religion.length === 0}
          />
        </View>

        <View style={styles.card}>
          <DropdownField label="State" dropdownName="state" />
        </View>

        {/* Keyword Search */}
        <View style={styles.card}>
          <Text style={styles.label}>Keyword Search</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter keywords (e.g., profession, interests)"
            placeholderTextColor="#999"
            value={keywordSearch}
            onChangeText={setKeywordSearch}
          />
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchNow}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Search Now</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Dropdown Selection Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="slide"
        onRequestClose={closeDropdown}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select {currentDropdown}</Text>
            <FlatList
              data={dropdownOptions}
              renderItem={({ item }) => {
                const isSelected = selectedItems[currentDropdown]?.some(selected => selected.id === item.id) || false;
                return (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => toggleItemSelection(item)}
                  >
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                    {isSelected && <Image source={checkIcon} style={styles.checkIcon} />}
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id}
              style={styles.dropdownList}
              contentContainerStyle={{ paddingBottom: 60 }}
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeDropdown}
              >
                <Text style={styles.modalButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* No Results Found Modal */}
      <Modal
        visible={showNoResultsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNoResultsModal(false)}
      >
        <View style={styles.noResultsModalOverlay}>
          <View style={styles.noResultsModalContainer}>
            <Text style={styles.noResultsModalTitle}>No Matches Found</Text>
            <Text style={styles.noResultsModalText}>
              We couldn't find any profiles matching your search criteria.
              Try adjusting your filters or search keywords.
            </Text>
            <TouchableOpacity
              style={styles.noResultsModalButton}
              onPress={() => setShowNoResultsModal(false)}
            >
              <Text style={styles.noResultsModalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2.5),
    backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    padding: wp(1.25),
  },
  backIcon: {
    width: wp(6),
    height: hp(2.5),
  },
  searchInput: {
    flex: 1,
    height: hp(5),
    marginLeft: wp(2.5),
    paddingHorizontal: wp(3.75),
    backgroundColor: '#f0f0f0',
    borderRadius: wp(5),
    fontSize: wp(3.5),
    color: '#333',
    fontFamily: "Lexend-Medium",
    marginRight: wp(2.5),

  },
  scrollContainer: {
    padding: wp(3.75),
    paddingBottom: hp(2.5),
  },
  title: {
    fontSize: wp(4.75),
    fontFamily: "Lexend-Medium",
    color: '#333',
    marginBottom: hp(2.5),
    marginTop: hp(1.25),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: wp(2.5),
    padding: wp(3.75),
    marginBottom: hp(1.875),
    elevation: 1,
  },
  label: {
    fontSize: wp(4),
    fontFamily: "Lexend-Medium",
    color: '#333',
    marginBottom: hp(1.25),
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearText: {
    color: '#FF7E00',
    fontSize: wp(3),
    fontFamily: "Lexend-Medium",
  },
  sliderTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.25),
  },
  sliderValueText: {
    fontSize: wp(3.5),
    color: '#666',
    fontFamily: "Lexend-Medium",
  },
  selectedSlider: {
    backgroundColor: '#FF7E00',
    height: hp(0.375),
  },
  unselectedSlider: {
    backgroundColor: '#e0e0e0',
    height: hp(0.375),
  },
  sliderMarker: {
    backgroundColor: '#FF7E00',
    height: hp(3),
    width: wp(6),
    borderRadius: hp(1.5),
    borderWidth: wp(0.5),
    borderColor: '#fff',
    elevation: 2,
  },
  sliderStyle: {
    alignSelf: 'center',
  },
  dropdownContainer: {
    marginBottom: hp(1.25),
  },
  dropdownValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3.75),
    borderWidth: wp(0.25),
    borderColor: '#e0e0e0',
    borderRadius: wp(2),
  },
  dropdownText: {
    fontSize: wp(4),
    color: '#999',
    fontFamily: "Lexend-Medium",
    flex: 1,
    marginRight: wp(2.5),
  },
  selectedDropdownText: {
    color: '#333',
  },
  disabledDropdown: {
    backgroundColor: '#f5f5f5',
  },
  disabledDropdownText: {
    color: '#999',
  },
  dropdownIcon: {
    width: wp(4),
    height: hp(2),
  },
  divider: {
    height: hp(0.125),
    backgroundColor: '#f0f0f0',
    marginVertical: hp(1.25),
  },
  searchButton: {
    backgroundColor: '#FF7E00',
    borderRadius: hp(3.125),
    paddingVertical: hp(1.25),
    width: wp(60),
    alignItems: 'center',
    elevation: 3,
    marginTop: hp(1.25),
    alignSelf: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: wp(4),
    fontFamily: "Lexend-Medium",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    marginHorizontal: wp(5),
    borderRadius: wp(2.5),
    maxHeight: hp(70),
  },
  modalTitle: {
    fontSize: wp(4.5),
    fontFamily: "Lexend-Medium",
    padding: wp(3.75),
    borderBottomWidth: wp(0.25),
    borderBottomColor: '#f0f0f0',
    color: '#333',
  },
  dropdownList: {
    paddingHorizontal: wp(2.5),
  },
  dropdownItem: {
    padding: wp(3.75),
    borderBottomWidth: wp(0.25),
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemText: {
    fontSize: wp(4),
    color: '#333',
    fontFamily: "Lexend-Medium",
    flex: 1,
  },
  checkIcon: {
    width: wp(5),
    height: hp(2.5),
    tintColor: '#FF7E00',
  },
  modalFooter: {
    padding: wp(3.75),
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: wp(2.5),
    borderBottomRightRadius: wp(2.5),
  },
  modalButton: {
    backgroundColor: '#FF7E00',
    borderRadius: hp(3.125),
    padding: hp(1.5),
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: wp(4),
    fontFamily: "Lexend-Medium",
  },
  textInput: {
    borderWidth: wp(0.25),
    borderColor: '#e0e0e0',
    borderRadius: wp(2),
    padding: hp(1.5),
    fontSize: wp(3.5),
    fontFamily: "Lexend-Medium",
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(1.25),
  },
  chip: {
    backgroundColor: '#f0f0f0',
    borderRadius: hp(2),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    marginRight: wp(2),
    marginBottom: hp(1),
  },
  chipText: {
    fontSize: wp(3),
    color: '#333',
    fontFamily: "Lexend-Medium",
  },
  noResultsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsModalContainer: {
    width: wp(85),
    backgroundColor: '#fff',
    borderRadius: wp(2.5),
    padding: wp(5),
    alignItems: 'center',
    elevation: 5,
  },
  noResultsModalTitle: {
    fontSize: wp(4.5),
    fontFamily: "Lexend-Medium",
    marginBottom: hp(1.25),
    color: '#333',
  },
  noResultsModalText: {
    fontSize: wp(3.75),
    textAlign: 'center',
    marginBottom: hp(2.5),
    color: '#666',
    fontFamily: "Lexend-Medium",
  },
  noResultsModalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: hp(1.25),
    paddingHorizontal: wp(7.5),
    borderRadius: wp(1.25),
    fontFamily: "Lexend-Medium",
  },
  noResultsModalButtonText: {
    color: '#fff',
    fontSize: wp(4),
    fontFamily: "Lexend-Medium",
  },
  searchIconButton: {
    marginLeft:4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FF7E00', // Orange color
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchText: {
    color: '#fff',
    fontFamily: "Lexend-Medium",
    fontSize: wp("3%"),
  },

});

export default SearchScreen;