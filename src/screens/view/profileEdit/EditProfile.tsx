import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Modal,
  FlatList,

} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Snackbar } from "react-native-paper";
import { arrow } from "../../../utils/constants/icons/icon";
import { storeUserData } from "../../../utils/constants/storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import SettingHeader from "./editscreenHeader";


const maritalStatusOptions = ['Never Married', 'Widower', 'Awaiting Divorce', 'Divorced'];
const profileByOptions = ["Self", "Relatives", "Guardian", "Sibling", "Friends"];
const genderOptions = ["Male", "Female"];
const EMPLOYMENT_OPTIONS = ['Government', 'Private', 'Business', 'Defence', 'Self Employed', 'Not Working'];
const numberOptions = ['1', '2', '3', '4+'];
const eatingHabits = ['Does Not Matter', 'Vegetarian', 'Non-Vegetarian', 'Eggetarian'];
const physicalStatus = ['Does Not Matter','Deaf + Usher','Deaf + Other Disability','Hearing Impaired', 'Cochlear Implant', 'Deaf', 'Normal'];
const DrinkingHabits = ['Does Not Matter', 'Never Drinks', 'Drinks Socially', 'Drinks Regularly'];
const smokingHabits = ['Does Not Matter', 'Never Smokes', 'Smokes Occasionally ', 'Smokes Regularly'];
const complexionOptions = ['Very fair', 'Fair', 'Wheatish', 'Wheatish brown', 'Dark'];

interface EditableSectionProps {
  title: string;
  initialData: Record<string, string>;
  onSave: (data: Record<string, string>) => void;

}

const Screen67 = (props: any) => {
const navigation = useNavigation();
    
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const indexId = await AsyncStorage.getItem("index_id");

      if (!indexId) {
        showSnackbar("Error: Index ID not found");
        return;
      }

      const response = await axios.get(
        `http://82.29.161.246:8002/api/edit-member/${indexId}`
      );

      if (response.data?.user) {
        setUserData(response.data.user);
      } else {
        showSnackbar("Error: User data not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      showSnackbar("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  const profileCounts = {};

  const handleSave = async (updatedData: Record<string, string>) => {
    try {
      const indexId = await AsyncStorage.getItem("index_id");
      const token = await AsyncStorage.getItem("auth_token");

      if (!indexId || !token) {
        showSnackbar("Error: Missing index or token");
        return;
      }

      const response = await axios.post(
        `http://82.29.161.246:8002/api/update/${indexId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state with new data
      setUserData(prev => ({
        ...prev,
        ...updatedData
      }));

      showSnackbar("Section updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      // showSnackbar("Failed to update section data");
    }
  };
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7E00" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Profile Details</Text>
        </View>

        <SettingHeader navigation={navigation} profileCounts={profileCounts} />

        <EditableSection
          title="Basic Details"
          initialData={{
            'First Name': userData.firstname || "N/A",
            'Last Name': userData.lastname || "N/A",
            Email: userData.email || "N/A",
            Gender: userData.gender || "N/A",
            'Marital Status': userData.m_status || "N/A",
            "Mobile Number": userData.mobile || "N/A",
            "Parents Mobile No": userData.parent_mobile || "N/A",
            'Profile By': userData.profileby || "N/A",
            'Mother Tounge': userData?.mother_tongue_data?.mtongue_name || "N/A",
            'Birth Date': userData.birthdate || "N/A",

          }}
          onSave={handleSave}

        />

        <EditableSection
          title="About Me"
          initialData={{
            "👉": userData.profile_text || "N/A",
          }}
          onSave={handleSave}
        />

        <EditableSection
          title="Family Details"
          initialData={{
            'Father Occupation': userData.father_occupation || "N/A",
            'Mother Occupation': userData.mother_occupation || "N/A",
            'No of Brothers': userData.no_of_brothers || "N/A",
            'No of Sisters': userData.no_of_sisters || "N/A",
            'Married Brothers': userData.no_marri_brother || "N/A",
            'Married Sisters': userData.no_marri_sister || "N/A",

          }}
          onSave={handleSave}
        />

        <EditableSection
          title="Edu./Profession Prefrence"
          initialData={{
            Education: userData?.education?.edu_name || "N/A",
            'Employed In': userData.emp_in || "N/A",
            Occupation: userData.occupation_data?.ocp_name || "N/A",
            "Annual Income": userData?.income_data?.income || "N/A",

          }}
          onSave={handleSave}
        />
        <EditableSection
          title="Religion Preference"
          initialData={{
            Religion: userData.religion_data?.religion_name || "N/A",
            Caste: userData.caste_data?.caste_name || "N/A",
          }}
          onSave={handleSave}
        />

        <EditableSection
          title="Location Information"
          initialData={{
            'Country Name': userData.country?.country_name || "N/A",
            'State Name': userData.state?.state_name || "N/A",
            'City Name': userData.city_data?.city_name || "N/A",
          }}
          onSave={handleSave}
        />

        <EditableSection
          title="Habits And Hobbies"
          initialData={{
            'Eating Habits': userData.diet || "N/A",
            'Smoking Habits': userData.smoke || "N/A",
            'Drinking Habits': userData.drink || "N/A",
          }}
          onSave={handleSave}
        />

        <EditableSection
          title="Physical Attributes"
          initialData={{
            Height: userData.height || "N/A",
            Complexion: userData.complexion || "N/A",
            Weight: userData.weight || "N/A",
            'Physical Status': userData.physicalStatus || "N/A",

          }}
          onSave={handleSave}
        />

      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarMessage.includes("success") ? "#4CAF50" : "#f44336",
        }}
      >

        {snackbarMessage}
      </Snackbar>

    </KeyboardAvoidingView>
  );
};

const EditableSection: React.FC<EditableSectionProps> = ({ title, initialData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>(initialData);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isProfileByModalVisible, setIsProfileByModalVisible] = useState(false);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  const [isMotherToungeModalVisible, setIsMotherToungeModalVisible] = useState(false);
  const [motherToungeOptions, setMotherToungeOptions] = useState<string[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [isStateModalVisible, setIsStateModalVisible] = useState(false);
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isReligionModalVisible, setIsReligionModalVisible] = useState(false);
  const [isCasteModalVisible, setIsCasteModalVisible] = useState(false);
  const [selectedReligion, setSelectedReligion] = useState<string | null>(null);
  const [religionOptions, setReligionOptions] = useState<any[]>([]);
  const [casteOptions, setCasteOptions] = useState<any[]>([]);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [incomeOptions, setincomeOptions] = useState<string[]>([]);
  const [isOccupationModalVisible, setIsOccupationModalVisible] = useState(false);
  const [occupationOptions, setoccupationOptions] = useState<string[]>([]);
  const [isEmployedModalVisible, setIsEmployedModalVisible] = useState(false);
  const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
  const [educationOptions, seteducationOptions] = useState<string[]>([]);
  const [isBrotherCountOptions, setIsBrotherCountOptions] = useState(false);
  const [isSisterCountOptions, setIsSisterCountOptions] = useState(false);
  const [ismarriedSisterCountOptions, setMarriedSisterCountOptions] = useState(false);
  const [isMarriedBrotherCountOptions, setIsMarriedBrotherCountOptions] = useState(false);
  const [isEatingOptions, setIsEatingOptions] = useState(false);
  const [isSmokeOptions, setIsSmokeOptions] = useState(false);
  const [isDrinkOptions, setIsDrinkOptions] = useState(false);
  const [isHeightModalVisible, setIsHeightModalVisible] = useState(false);
  const [IsHeightOptions, setIsHeightOptions] = useState<string[]>([]);
  const [isSkinOptions, setIsSkinOptions] = useState(false);
  const [isPhysicalOptions, setIsPhysicalOptions] = useState(false);

  useEffect(() => {
    if (isEditing && title === "Location Information") {
      fetchStates();
    }
  }, [isEditing]);
  const fetchStates = async () => {
    try {
      const response = await axios.get("http://82.29.161.246:8002/api/states");
      if (response.data?.data) {
        setStates(response.data.data);
      } else {
        console.error("State data not found");
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleStateSelect = (state: any) => {
    console.log("Selected State:", state);

    setFormData((prev) => ({
      ...prev,
      'State Name': state.state_name, // Display only the state name
      state_id: state.state_id, // State ID for API
      'City Name': "Select City", // Reset city when state changes
      city_id: "",
    }));

    setSelectedState(state.state_id);
    setIsStateModalVisible(false);

    fetchCities(state.state_code); // Fetch cities based on state
  };


  const fetchCities = async (state_code: string) => {
    try {
      const response = await axios.get(`http://82.29.161.246:8002/api/cities/state/${state_code}`);
      if (response.data?.data) {
        setCities(response.data.data);
      } else {
        setCities([]);
        console.warn("No cities found for the selected state.");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCitySelect = (city: any) => {
    console.log("Selected City:", city);
    setFormData((prev) => ({
      ...prev,
      'City Name': city.city_name, // Update the city name in the UI
      city_id: city.city_id,      // Update the city ID for the API
    }));

    setIsCityModalVisible(false);
  };

  useEffect(() => {
    const fetchOccupationOptions = async () => {
      try {
        const responce = await axios.get("http://82.29.161.246:8002/api/occupations");
        if (responce.data && Array.isArray(responce.data.data)) {
          setoccupationOptions(responce.data.data);
          console.log("Occupation", responce.data.data);
          console.log(setoccupationOptions);
        } else {
          console.error("Unexpected response format:", responce);
        }
      } catch (error) {
        console.error("Error fetching Occupation options:", error);
      }
    };

    fetchOccupationOptions();
  }, []);

  const handleOccupationSelect = (selectedOccupation: any) => {
    setFormData((prev) => ({
      ...prev,
      occupation: selectedOccupation.ocp_id,  // Send the ID for API
      ocp_name: selectedOccupation.ocp_name, // For display
      Occupation: selectedOccupation.ocp_name // For UI
    }));
    setIsOccupationModalVisible(false);
  };
  useEffect(() => {
    const fetchEducationOptions = async () => {
      try {
        const responce = await axios.get("http://82.29.161.246:8002/api/education-details");
        if (responce.data && Array.isArray(responce.data.data)) {
          seteducationOptions(responce.data.data);
          console.log("Education", responce.data.data);
          console.log(seteducationOptions);
        } else {
          console.error("Unexpected response format:", responce);
        }
      } catch (error) {
        console.error("Error fetching Education options:", error);
      }
    };

    fetchEducationOptions();
  }, []);

  const handleEducationSelect = (selectedEducation: any) => {
    setFormData((prev) => ({
      ...prev,
      edu_detail: selectedEducation.edu_name,  // Send the ID for API
      edu_name: selectedEducation.edu_name, // For display
      Education: selectedEducation.edu_name // For UI
    }));
    setIsEducationModalVisible(false);
  };


  useEffect(() => {
    const fetchIncomeOptions = async () => {
      try {
        const response = await axios.get("http://82.29.161.246:8002/api/incomes");
        if (response.data && Array.isArray(response.data.data)) {
          setincomeOptions(response.data.data); // Corrected here
          console.log("incomes", response.data.data);
          console.log(setincomeOptions);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error fetching income options:", error);
      }
    };

    fetchIncomeOptions();
  }, []);

  const handleIncomeSelect = (selectedIncome: any) => {
    setFormData((prev) => ({
      ...prev,
      ["income"]: selectedIncome,
      ["Annual Income"]: selectedIncome,
    }));
    setIsIncomeModalVisible(false);
  };

  useEffect(() => {
    const fetchMotherToungeOptions = async () => {
      try {
        const response = await axios.get("http://82.29.161.246:8002/api/mothertongues");
        if (response.data && Array.isArray(response.data.data)) {
          setMotherToungeOptions(response.data.data); // Corrected here
          console.log("mtounge", response.data.data);
          console.log(motherToungeOptions);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error fetching mother tongue options:", error);
      }
    };

    fetchMotherToungeOptions();
  }, []);

  useEffect(() => {
    const fetchHeightOptions = async () => {
      try {
        const responce = await axios.get("http://82.29.161.246:8002/api/heights");
        if (responce.data && Array.isArray(responce.data.data)) {
          setIsHeightOptions(responce.data.data);
          console.log("Height", responce.data.data);
          console.log(setIsHeightOptions);
        } else {
          console.error("Unexpected response format:", responce);
        }
      } catch (error) {
        console.error("Error fetching Height options:", error);
      }
    };

    fetchHeightOptions();
  }, []);

  const handleHeightSelect = (selectedHeight: any) => {
    setFormData((prev) => ({
      ...prev,
      height: selectedHeight.height, // For display
      Height: selectedHeight.height // For UI
    }));
    setIsHeightModalVisible(false);
  };

  useEffect(() => {
    const fetchReligions = async () => {
      try {
        const response = await axios.get("http://82.29.161.246:8002/api/religions");
        if (response.data?.success && response.data.data) {
          setReligionOptions(response.data.data);

          // If initial data has a religion, find its ID
          if (initialData.Religion && initialData.Religion !== "N/A") {
            const foundReligion = response.data.data.find(
              (r: any) => r.religion_name.trim() === initialData.Religion.trim()
            );
            if (foundReligion) {
              setSelectedReligion(foundReligion.religion_id);
              setFormData(prev => ({
                ...prev,
                religion_id: foundReligion.religion_id
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching religions:", error);
      }
    };

    fetchReligions();
  }, []);
  useEffect(() => {
    const fetchCastes = async () => {
      if (!selectedReligion) return;

      try {
        const response = await axios.get(
          `http://82.29.161.246:8002/api/castes/${selectedReligion}`
        );

        console.log("Caste API Response:", response.data);

        if (response.data?.success && response.data.data?.length > 0) {
          setCasteOptions(response.data.data);

          // If initial data has a caste, find its ID
          if (initialData.Caste && initialData.Caste !== "N/A") {
            const foundCaste = response.data.data.find(
              (c: any) => c.caste_name.trim() === initialData.Caste.trim()
            );
            if (foundCaste) {
              setFormData((prev) => ({
                ...prev,
                caste_id: foundCaste.caste_id,
              }));
            }
          }
        } else {
          setCasteOptions([]);
        }
      } catch (error) {
        console.error("Error fetching castes:", error);
      }
    };

    fetchCastes();
  }, [selectedReligion]);

  const handleReligionSelect = (religion: any) => {
    console.log('Selected Religion:', religion);
    setFormData(prev => ({
      ...prev,
      Religion: religion.religion_name,
      religion_id: religion.religion_id,
      Caste: "Select Caste",
      caste_id: "",
    }));
    setSelectedReligion(religion.religion_id);
    setIsReligionModalVisible(false);
  };
  const handleCasteSelect = (caste: any) => {
    setFormData(prev => ({
      ...prev,
      Caste: caste.caste_name,
      caste_id: caste.caste_id,
    }));
    setIsCasteModalVisible(false);
  };
  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      Gender: gender,       // For display
      gender: gender        // For backend
    }));
  };

  const handleBrothercountSelect = (no_of_brothers: string) => {
    setFormData((prev) => ({
      ...prev,
      'No of Brothers': no_of_brothers,
      no_of_brothers: no_of_brothers

    }));
    setIsBrotherCountOptions(false);
  };

  const handleEatingSelect = (diet: string) => {
    setFormData((prev) => ({
      ...prev,
      'Eating Habits': diet,
      diet: diet

    }));
    setIsEatingOptions(false);
  };


  const handleSkinSelect = (complexion: string) => {
    setFormData((prev) => ({
      ...prev,
      'Complexion': complexion,
      complexion: complexion

    }));
    setIsSkinOptions(false);
  };


  const handlePhysicalSelect = (physicalStatus: string) => {
    setFormData((prev) => ({
      ...prev,
      'Physical Status': physicalStatus,
      physicalStatus: physicalStatus

    }));
    setIsPhysicalOptions(false);
  };


  const handleDrinkingSelect = (drink: string) => {
    setFormData((prev) => ({
      ...prev,
      'Drinking Habits': drink,
      drink: drink

    }));
    setIsDrinkOptions(false);
  };

  const handleSmokingSelect = (smoke: string) => {
    setFormData((prev) => ({
      ...prev,
      'Smoking Habits': smoke,
      smoke: smoke

    }));
    setIsSmokeOptions(false);
  };
  const handleSistercountSelect = (no_of_sisters: string) => {
    setFormData((prev) => ({
      ...prev,
      'No of Sisters': no_of_sisters,
      no_of_sisters: no_of_sisters

    }));
    setIsSisterCountOptions(false);
  };

  const handleMarriedBrothercountSelect = (no_marri_brother: string) => {
    setFormData((prev) => ({
      ...prev,
      'Married Brothers': no_marri_brother,
      no_marri_brother: no_marri_brother

    }));
    setIsMarriedBrotherCountOptions(false);
  };

  const handleMarriedSistercountSelect = (no_marri_sister: string) => {
    setFormData((prev) => ({
      ...prev,
      'Married Sisters': no_marri_sister,
      no_marri_sister: no_marri_sister

    }));
    setMarriedSisterCountOptions(false);
  };

  const handleStatusSelect = (status: string) => {
    setFormData((prev) => ({
      ...prev,
      'Marital Status': status, // For UI
      'm_status': status,       // For Backend
    }));
    setIsStatusModalVisible(false);
  };

  const handleProfileBySelect = (option: string) => {
    setFormData((prev) => ({ ...prev, 'Profile By': option, 'profileby': option }));
    setIsProfileByModalVisible(false);
  };

  const handleEmployedSelect = (emp_in: string) => {
    setFormData((prev) => ({ ...prev, 'Employed In': emp_in, 'emp_in': emp_in }));
    setIsEmployedModalVisible(false);
  };

  const handleMotherToungeSelect = (selectedTounge: any) => {
    setFormData((prev) => ({
      ...prev,
      ["m_tongue"]: selectedTounge,
      ["Mother Tounge"]: selectedTounge,
    }));
    setIsMotherToungeModalVisible(false);
  };
  const showSnackbar = (message: string) => {

    alert(message);
  };
  const birthDateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
  const weightRegex = /^(\d{1,3})\s*KG$/i; // Format: "80 KG", "100 KG", etc.

  const handleSave = () => {
    if (formData['Mobile Number'] && 
      (formData['Mobile Number'].length !== 10 || !/^\d+$/.test(formData['Mobile Number']))) {
    showSnackbar("Mobile number must be exactly 10 digits");
    return;
  }
  if (formData['Parents Mobile No'] && 
    (formData['Parents Mobile No'].length !== 10 || !/^\d+$/.test(formData['Parents Mobile No']))) {
  showSnackbar("Parents mobile number must be exactly 10 digits");
  return;
}

    // Validate email format
    if (formData['Email'] && (!formData['Email'].includes('@') || !formData['Email'].includes('.'))) {
      showSnackbar("Please enter a valid email address");
      return;
    }

    const finalData = { ...formData };

    const nameChanged = finalData['First Name'] !== initialData['First Name'] ||
      finalData['Last Name'] !== initialData['Last Name'];

    const emailChanged = finalData['Email'] !== initialData['Email'];

    if (finalData['Email']) {
      finalData['email'] = finalData['Email'];
      delete finalData['Email'];
    }
    if (finalData['Mother Tounge']) {
      finalData['m_tongue'] = finalData['Mother Tounge'];
      delete finalData['Mother Tounge'];
    }
    if (finalData['Annual Income']) {
      finalData['income'] = finalData['Annual Income'];
      delete finalData['Annual Income'];
    }

    if (finalData['Birth Date']) {
      if (birthDateRegex.test(finalData['Birth Date'])) {
        finalData['birthdate'] = finalData['Birth Date'];
        delete finalData['Birth Date'];
      } else {
        console.log("Invalid Birth Date format. Use dd-mm-yyyy");
      }
    }
    if (finalData['Mobile Number']) {
      finalData['mobile'] = finalData['Mobile Number'];
      delete finalData['Mobile Number'];
    }
    if (finalData['Parents Mobile No']) {
      finalData['parent_mobile'] = finalData['Parents Mobile No'];
      delete finalData['Parents Mobile No'];
    }
    if (finalData['First Name']) {
      finalData['firstname'] = finalData['First Name'];
      delete finalData['First Name'];
    }
    if (finalData['Weight']) {
      if (weightRegex.test(finalData['Weight'])) {
        finalData['weight'] = finalData['Weight'];
        delete finalData['Weight'];
      }
    }
    if (finalData['Father Occupation']) {
      finalData['father_occupation'] = finalData['Father Occupation'];
      delete finalData['Father Occupation'];
    }
    if (finalData['Mother Occupation']) {
      finalData['mother_occupation'] = finalData['Mother Occupation'];
      delete finalData['Mother Occupation'];
    }
    if (finalData['Country Name']) {
      finalData['country_name'] = finalData['Country Name'];
      delete finalData['Country Name'];
    }
    if (finalData['Last Name']) {
      finalData['lastname'] = finalData['Last Name'];
      delete finalData['Last Name'];
    }
    if (finalData['State Name']) {
      finalData['state_name'] = finalData['State Name'];
      delete finalData['State Name'];
    }
    if (finalData["👉"]) {
      finalData['profile_text'] = finalData['👉'];
      delete finalData["👉"];
    }
    if (finalData['City Name']) {
      finalData[''] = finalData['City Name'];
      if (formData.city_id) {
        finalData['city'] = formData.city_id;
      }
      delete finalData['City Name'];
    }
    if (finalData['Religion']) {
      // If religion_id exists, use it (otherwise, keep religion_name)
      if (formData.religion_id) {
        finalData['religion'] = formData.religion_id; // API expects 'religion' key
      }
      delete finalData['Religion'];
      delete finalData['religion_name']; // Remove unnecessary keys
    }

    if (finalData['Caste']) {
      // If caste_id exists, use it (otherwise, keep caste_name)
      if (formData.caste_id) {
        finalData['caste'] = formData.caste_id; // API expects 'caste' key
      }
      delete finalData['Caste'];
      delete finalData['caste_name']; // Remove unnecessary keys
    }
    if (finalData["Occupation"]) {
      finalData[''] = finalData["Occupation"];
      if (formData.ocp_id) {
        finalData['occupation'] = formData.ocp_id;
      }
      delete finalData["Occupation"];
    }
    if (finalData["Education"]) {
      finalData[''] = finalData["Education"];
      if (formData.edu_id) {
        finalData['edu_detail'] = formData.edu_id;
      }
      delete finalData["Education"];
    }
    if (nameChanged || emailChanged) {
      const updatedUserData = {
        firstName: finalData['firstname'] || finalData['First Name'],
        lastName: finalData['lastname'] || finalData['Last Name'],
        email: finalData['email'],
        // Include other fields you want to keep in local storage
      };

      // Get the token from AsyncStorage
      AsyncStorage.getItem('auth_token').then(token => {
        storeUserData(updatedUserData, token);
      }).catch(error => {
        console.error("Error getting token for local storage update:", error);
      });
    }

    onSave(finalData);
    setIsEditing(false);
  };



  return (
    <View style={styles.section}>
      
      <View style={styles.cardHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {isEditing ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>EDIT</Text>
          </TouchableOpacity>
        )}
      </View>

      {Object.keys(formData).filter(
        (key) =>
          key !== "state_id" &&
          key !== "city_id" &&
          key !== "religion_id" &&
          key !== "caste_id" &&
          key !== "income" &&
          key !== "ocp_name" &&
          key !== "occupation" &&
          key !== "emp_in" &&
          key !== "profileby" &&
          key !== "no_marri_sister" &&
          key !== "no_marri_brother" &&
          key !== "diet" &&
          key !== "drink" &&
          key !== "smoke" &&
          key !== "height" &&
          key !== "physicalStatus" &&
          key !== "complexion" &&
          key !== "edu_detail" &&
          key !== "edu_name" &&
          key !== "no_of_brothers" &&
          key !== "no_of_sisters"

      ).map((key, index) => (<View key={index} style={styles.detailRow}>
  <Text style={styles.label}>{key}:</Text>

        {isEditing ? (

          key === "About Me" ? (
            <View style={styles.detailRoww}>
              <Text style={styles.aboutMeText1}>{isEditing ? (
                <TextInput
                  style={[styles.input, styles.aboutMeInput1]}
                  value={formData["👉"]}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, ["👉"]: text }))}
                  multiline={true}
                  textAlignVertical="top"
                />
              ) : (
                <Text style={styles.aboutMeValue1}>
                  <Text style={styles.emojiIcon1}>👉</Text>{" "}
                  {formData["👉"]}
                </Text>
              )}
              </Text>
            </View>
          ) : key === "Gender" ? (
            <>
            <TouchableOpacity 
              onPress={() => setIsGenderModalVisible(true)}
              style={styles.valueContainer}
            >
              <Text style={styles.value}>{formData[key]}</Text>
            </TouchableOpacity>
            
            <Modal
  visible={isGenderModalVisible}
  transparent={true}
  animationType="fade" // Changed from 'slide' to 'fade' for better UX
  onRequestClose={() => setIsGenderModalVisible(false)}
>
  <TouchableOpacity 
    style={styles.modalOverlay1}
    activeOpacity={1}
    onPress={() => setIsGenderModalVisible(false)}
  >
    <TouchableOpacity 
      activeOpacity={1}
      style={styles.modalcontainer11}
      onPress={() => {}} // Empty to prevent closing when clicking inside
    >
      {genderOptions.map((gender, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => {
            handleGenderSelect(gender);
            setIsGenderModalVisible(false);
          }}
          style={styles.optionButton1}
        >
          <Text style={styles.optionText1}>{gender}</Text>
        </TouchableOpacity>
      ))}
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>
          </>
          ) : key === 'No of Brothers' ? (
            <>
              <TouchableOpacity onPress={() => setIsBrotherCountOptions(true)}>
                <Text style={styles.value}>{formData[key]}</Text>
              </TouchableOpacity>
              <Modal visible={isBrotherCountOptions} transparent={true} animationType="slide">
                <View style={styles.modalOverlay1}>
                  <View style={styles.modalcontainer11}>
                    {numberOptions.map((no_of_brothers, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => handleBrothercountSelect(no_of_brothers)}
                        style={styles.optionButton1} >
                      <Text style={styles.optionText1}>{no_of_brothers}</Text>
                      </TouchableOpacity>
                    ))}
                       

                  </View>
                </View>
              </Modal>
            </>
          )
            : key === 'Eating Habits' ? (
              <>
                <TouchableOpacity onPress={() => setIsEatingOptions(true)}>
                  <Text style={styles.value}>{formData[key]}</Text>
                </TouchableOpacity>
                <Modal visible={isEatingOptions} transparent={true} animationType="slide">
                  <View style={styles.modalOverlay1}>
                    <View style={styles.modalcontainer11}>
                      {eatingHabits.map((diet, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => handleEatingSelect(diet)}
                          style={styles.optionButton1} >
                          <Text style={styles.optionText1}>{diet}</Text>
                        </TouchableOpacity>
                      ))}
                       

                    </View>
                  </View>
                </Modal>
              </>
            ) : key === 'Physical Status' ? (
              <>
                <TouchableOpacity onPress={() => setIsPhysicalOptions(true)}>
                  <Text style={styles.value}>{formData[key]}</Text>
                </TouchableOpacity>
                <Modal visible={isPhysicalOptions} transparent={true} animationType="slide">
                  <View style={styles.modalOverlay1}>
                    <View style={styles.modalcontainer11}>
                      {physicalStatus.map((physicalStatus, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => handlePhysicalSelect(physicalStatus)}
                          style={styles.optionButton1} >
                          <Text style={styles.optionText1}>{physicalStatus}</Text>
                        </TouchableOpacity>
                      ))}
                       

                    </View>
                  </View>
                </Modal>
              </>

            ) : key === 'Complexion' ? (
              <>
                <TouchableOpacity onPress={() => setIsSkinOptions(true)}>
                  <Text style={styles.value}>{formData[key]}</Text>
                </TouchableOpacity>
                <Modal visible={isSkinOptions} transparent={true} animationType="slide">
                  <View style={styles.modalOverlay1}>
                    <View style={styles.modalcontainer11}>
                      {complexionOptions.map((complexion, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => handleSkinSelect(complexion)}
                          style={styles.optionButton1}>
                          <Text style={styles.optionText1}>{complexion}</Text>
                        </TouchableOpacity>
                      ))}
                        

                    </View>
                  </View>
                </Modal>
              </>
            ) : key === 'Smoking Habits' ? (
              <>
                <TouchableOpacity onPress={() => setIsSmokeOptions(true)}>
                  <Text style={styles.value}>{formData[key]}</Text>
                </TouchableOpacity>
                <Modal visible={isSmokeOptions} transparent={true} animationType="slide">
                  <View style={styles.modalOverlay1}>
                    <View style={styles.modalcontainer11}>
                      {smokingHabits.map((smoke, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => handleSmokingSelect(smoke)}
                          style={styles.optionButton1} >
                          <Text style={styles.optionText1}>{smoke}</Text>
                        </TouchableOpacity>
                      ))}
                       

                    </View>
                  </View>
                </Modal>
              </>
            )
              : key === 'Drinking Habits' ? (
                <>
                  <TouchableOpacity onPress={() => setIsDrinkOptions(true)}>
                    <Text style={styles.value}>{formData[key]}</Text>
                  </TouchableOpacity>
                  <Modal visible={isDrinkOptions} transparent={true} animationType="slide">
                    <View style={styles.modalOverlay1}>
                      <View style={styles.modalcontainer11}>
                        {DrinkingHabits.map((drink, i) => (
                          <TouchableOpacity
                            key={i}
                            onPress={() => handleDrinkingSelect(drink)}
                            style={styles.optionButton1} >
                            <Text style={styles.optionText1}>{drink}</Text>
                          </TouchableOpacity>
                        ))}
                         

                      </View>
                    </View>
                  </Modal>
                </>
              ) : key === 'No of Sisters' ? (
                <>
                  <TouchableOpacity onPress={() => setIsSisterCountOptions(true)}>
                    <Text style={styles.value}>{formData[key]}</Text>
                  </TouchableOpacity>
                  <Modal visible={isSisterCountOptions} transparent={true} animationType="slide">
                    <View style={styles.modalOverlay1}>
                      <View style={styles.modalcontainer11}>
                        {numberOptions.map((no_of_sisters, i) => (
                          <TouchableOpacity
                            key={i}
                            onPress={() => handleSistercountSelect(no_of_sisters)}
                            style={styles.optionButton1}>
                            <Text style={styles.optionText1}>{no_of_sisters}</Text>
                          </TouchableOpacity>
                        ))}
                          

                      </View>
                    </View>
                  </Modal>
                </>
              ) :
                key === 'Married Sisters' ? (
                  <>
                    <TouchableOpacity onPress={() => setMarriedSisterCountOptions(true)}>
                      <Text style={styles.value}>{formData[key]}</Text>
                    </TouchableOpacity>
                    <Modal visible={ismarriedSisterCountOptions} transparent={true} animationType="slide">
                      <View style={styles.modalOverlay1}>
                        <View style={styles.modalcontainer11}>
                          {numberOptions.map((no_marri_sister, i) => (
                            <TouchableOpacity
                              key={i}
                              onPress={() => handleMarriedSistercountSelect(no_marri_sister)}
                              style={styles.optionButton1} >
                              <Text style={styles.optionText1}>{no_marri_sister}</Text>
                            </TouchableOpacity>
                          ))}

                           
                        </View>
                      </View>
                    </Modal>
                  </>
                )
                  : key === 'Married Brothers' ? (
                    <>
                      <TouchableOpacity onPress={() => setIsMarriedBrotherCountOptions(true)}>
                        <Text style={styles.value}>{formData[key]}</Text>
                      </TouchableOpacity>
                      <Modal visible={isMarriedBrotherCountOptions} transparent={true} animationType="slide">
                        <View style={styles.modalOverlay1}>
                          <View style={styles.modalcontainer11}>
                            {numberOptions.map((no_marri_brother, i) => (
                              <TouchableOpacity
                                key={i}
                                onPress={() => handleMarriedBrothercountSelect(no_marri_brother)}
                                style={styles.optionButton1} >
                                <Text style={styles.optionText1}>{no_marri_brother}</Text>
                              </TouchableOpacity>
                            ))}
                             

                          </View>
                        </View>
                      </Modal>
                    </>
                  ) : key === 'Employed In' ? (
                    <>
                      <TouchableOpacity onPress={() => setIsEmployedModalVisible(true)}>
                        <Text style={styles.value}>{formData[key]}</Text>
                      </TouchableOpacity>
                      <Modal visible={isEmployedModalVisible} transparent={true} animationType="slide">
                        <View style={styles.modalOverlay1}>
                          <View style={styles.modalcontainer11}>
                            {EMPLOYMENT_OPTIONS.map((emp_in, i) => (
                              <TouchableOpacity
                                key={i}
                                onPress={() => handleEmployedSelect(emp_in)}
                                style={styles.optionButton1} >
                                <Text style={styles.optionText1}>{emp_in}</Text>
                              </TouchableOpacity>
                            ))}
                             

                          </View>
                        </View>
                      </Modal>
                    </>
                  ) : key === "Annual Income" ? (
                    <>
                      <TouchableOpacity onPress={() => setIsIncomeModalVisible(true)}>
                        <Text style={styles.value}>{formData[key] || "Annual Income"}</Text>
                      </TouchableOpacity>
                      <Modal
                        visible={isIncomeModalVisible}
                        transparent={true}
                        animationType="slide"
                      >
                        <View style={styles.modalOverlay1}>
                          <View style={styles.modalcontainer1}>
                            <FlatList
                              data={incomeOptions}
                              keyExtractor={(item, index) => String(index)}
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  onPress={() => handleIncomeSelect(item.income)}
                                  style={styles.optionButton1} >
                                  <Text style={styles.optionText1}>{item.income}</Text>
                                </TouchableOpacity>
                              )}
                               
                              ListEmptyComponent={
                                <Text style={{ textAlign: "center", marginTop: 20, color: "red", fontFamily: 'Lexend-Medium' }}>
                                  No Income Options Found
                                </Text>
                              }
                              contentContainerStyle={{ paddingBottom: 20 }} />

                              <TouchableOpacity
                                onPress={() => setIsIncomeModalVisible(false)}
                                style={styles.optionButton1} >
                              <Text style={styles.optionText11}>Close</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>

                    </>
                  )
                    : key === "Education" ? (
                      <>
                        <TouchableOpacity onPress={() => setIsEducationModalVisible(true)}>
                          <Text style={styles.value}>{formData[key] || "Occupation"}</Text>
                        </TouchableOpacity>
                        <Modal visible={isEducationModalVisible} transparent={true} animationType="slide">
                          <View style={styles.modalOverlay1}>
                            <View style={styles.modalcontainer1}>
                              <FlatList
                                data={educationOptions}
                                keyExtractor={(index) => String(index)}
                                renderItem={({ item }) => (
                                  <TouchableOpacity
                                    onPress={() => handleEducationSelect(item)}
                                    style={styles.optionButton1} >
                                    <Text style={styles.optionText1}>{item.edu_name}</Text>
                                  </TouchableOpacity>
                                )}
                                 
                                ListEmptyComponent={
                                  <Text style={{ textAlign: "center", marginTop: 20, color: "red", fontFamily: 'Lexend-Medium' }}>
                                    No Education Found
                                  </Text>
                                }
                              />

                              <TouchableOpacity
                                onPress={() => setIsEducationModalVisible(false)}
                                style={styles.optionButton1} >
                                <Text style={styles.optionText11}>Close</Text>
                              </TouchableOpacity>
                             
                            </View>
                          </View>
                        </Modal>

                      </>
                    ) : key === "Occupation" ? (
                      <>
                        <TouchableOpacity onPress={() => setIsOccupationModalVisible(true)}>
                          <Text style={styles.value}>{formData[key] || "Occupation"}</Text>
                        </TouchableOpacity>
                        <Modal visible={isOccupationModalVisible} transparent={true} animationType="slide">
                          <View style={styles.modalOverlay1}>
                            <View style={styles.modalcontainer1}>
                              <FlatList
                                data={occupationOptions}
                                keyExtractor={(item, index) => String(index)}
                                renderItem={({ item }) => (
                                  <TouchableOpacity
                                    onPress={() => handleOccupationSelect(item)}
                                    style={styles.optionButton1} >
                                    <Text style={styles.optionText1}>{item.ocp_name}</Text>
                                  </TouchableOpacity>
                                 
                                )}
                                ListEmptyComponent={
                                  <Text style={{ textAlign: "center", marginTop: 20, color: "red", fontFamily: 'Lexend-Medium' }}>
                                    No Occupations Found
                                  </Text>
                                }
                              />

                              <TouchableOpacity
                                onPress={() => setIsOccupationModalVisible(false)}
                                style={styles.optionButton1} >
                                <Text style={styles.optionText11}>Close</Text>
                              </TouchableOpacity>
                             
                            </View>
                          </View>
                        </Modal>

                      </>
                    ) : key === "Marital Status" ? (
                      <>
                        <TouchableOpacity onPress={() => setIsStatusModalVisible(true)}>
                          <Text style={styles.value}>{formData[key]}</Text>
                        </TouchableOpacity>
                        <Modal visible={isStatusModalVisible} transparent={true} animationType="slide">
                          <View style={styles.modalOverlay1}>
                            <View style={styles.modalcontainer11}>
                              {maritalStatusOptions.map((status, i) => (
                                <TouchableOpacity
                                  key={i}
                                  onPress={() => handleStatusSelect(status)} style={styles.optionButton1}>
                                  <Text style={styles.optionText1}>{status}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        </Modal>
                      </>
                    ) : key === 'Profile By' ? (
                      <>
                        <TouchableOpacity onPress={() => setIsProfileByModalVisible(true)}>
                          <Text style={styles.value}>{formData[key]}</Text>
                        </TouchableOpacity>
                        <Modal
                          visible={isProfileByModalVisible}
                          transparent={true}
                          animationType="slide"
                        >
                          <View style={styles.modalOverlay1}>
                            <View style={styles.modalcontainer11}>
                              {profileByOptions.map((option, i) => (
                                <TouchableOpacity
                                  key={i}
                                  onPress={() => handleProfileBySelect(option)}style={styles.optionButton1}>
                                <Text style={styles.optionText1}>{option}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        </Modal>
                      </>
                    ) : key === "Religion" ? (
                      <>
                        <TouchableOpacity onPress={() => setIsReligionModalVisible(true)}>
                          <Text style={styles.value}>{formData[key]}</Text>
                        </TouchableOpacity>
                        <Modal
                          visible={isReligionModalVisible}
                          transparent={true}
                          animationType="slide"
                        >
                          <View style={styles.modalOverlay1}>
                            <View style={styles.modalcontainer1}>
                              <FlatList
                                data={religionOptions}
                                keyExtractor={(item) => item.religion_id.toString()}
                                renderItem={({ item }) => (
                                  <TouchableOpacity
                                    style={styles.optionButton1}
                                    onPress={() => handleReligionSelect(item)}
                                  >
                                    <Text style={styles.optionText1}>{item.religion_name}</Text>
                                  </TouchableOpacity>
                                )}
                              />
                              <TouchableOpacity
                                style={styles.optionButton1}
                                onPress={() => setIsReligionModalVisible(false)}
                              >
                                <Text style={styles.optionText11}>Close</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Modal>
                      </>
                    ) : key === "Caste" ? (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            if (!selectedReligion) {
                              alert("Please select a religion first");
                              return;
                            }
                            setIsCasteModalVisible(true);
                          }}
                        >
                          <Text style={styles.value}>
                            {formData[key] === "N/A" ? "Select Caste" : formData[key]}
                          </Text>
                        </TouchableOpacity>
                        <Modal
                          visible={isCasteModalVisible}
                          transparent={true}
                          animationType="slide"
                        >
                          <View style={styles.modalOverlay1}>
                            <View style={styles.modalcontainer1}>
                              {casteOptions.length > 0 ? (
                                <FlatList
                                  data={casteOptions}
                                  keyExtractor={(item) => item.caste_id.toString()}
                                  renderItem={({ item }) => (
                                    <TouchableOpacity
                                      style={styles.optionButton1}
                                      onPress={() => handleCasteSelect(item)}
                                    >
                                      <Text style={styles.optionText1}>{item.caste_name}</Text>
                                    </TouchableOpacity>
                                  )}
                                />
                              ) : (
                                <Text style={styles.optionText1}>
                                  No castes available for selected religion
                                </Text>
                              )}
                              <TouchableOpacity
                                style={styles.optionButton1}
                                onPress={() => setIsCasteModalVisible(false)}
                              >
                                <Text style={styles.optionText11}>Close</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Modal>
                      </>
                    ) : key === "Mother Tounge" ?
                      (
                        <>
                          <TouchableOpacity onPress={() => setIsMotherToungeModalVisible(true)}>
                            <Text style={styles.value}>{formData[key] || "Select Mother Tongue"}</Text>
                          </TouchableOpacity>
                          <Modal
                            visible={isMotherToungeModalVisible}
                            transparent={true}
                            animationType="slide"
                          >
                            <View style={styles.modalOverlay1}>
                              <View style={styles.modalcontainer1}>
                                <FlatList
                                  data={motherToungeOptions}
                                  keyExtractor={(item) => item.mtongue_id.toString()}
                                  renderItem={({ item }) => (
                                    <TouchableOpacity
                                      onPress={() => handleMotherToungeSelect(item.mtongue_name)}
                                      style={styles.optionButton1}
                                    >
                                      <Text style={styles.optionText1}>{item.mtongue_name}</Text>
                                    </TouchableOpacity>
                                  )}
                                />
                                <TouchableOpacity
                                  onPress={() => setIsMotherToungeModalVisible(false)}
                                  style={styles.optionButton1}
                                >
                                  <Text style={styles.optionText11}>Close</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Modal>

                        </>

                      ) : key === "Height" ? (
                        <>
                          <TouchableOpacity onPress={() => setIsHeightModalVisible(true)}>
                            <Text style={styles.value}>{formData[key] || "Height"}</Text>
                          </TouchableOpacity>
                          <Modal visible={isHeightModalVisible} transparent={true} animationType="slide">
                            <View style={styles.modalOverlay1}>
                              <View style={styles.modalcontainer1}>
                                <FlatList
                                  data={IsHeightOptions}
                                  keyExtractor={(item, index) => String(index)}
                                  renderItem={({ item }) => (
                                    <TouchableOpacity
                                      onPress={() => handleHeightSelect(item)}
                                      style={styles.optionButton1}
                                    >
                                      <Text style={styles.optionText1}>{item.height}</Text>
                                    </TouchableOpacity>
                                  )}
                                  ListEmptyComponent={
                                    <Text style={{ textAlign: "center", marginTop: 20, color: "red", fontFamily: 'Lexend-Medium' }}>
                                      No Height Found
                                    </Text>
                                  }
                                />

                                <TouchableOpacity
                                  onPress={() => setIsHeightModalVisible(false)}
                                  style={styles.optionButton1}
                                >
                                  <Text style={styles.optionText11}>Close</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Modal>

                        </>
                      ) : key == 'State Name' ?
                        (
                          <>
                            <TouchableOpacity onPress={() => setIsStateModalVisible(true)}>
                              <Text style={styles.value}>{formData[key]}</Text>
                            </TouchableOpacity>
                            <Modal
                              visible={isStateModalVisible}
                              transparent={true}
                              animationType="slide"
                            >
                              <View style={styles.modalOverlay1}>
                                <View style={styles.modalcontainer1}>
                                  <FlatList
                                    data={states}
                                    keyExtractor={(item) => item.state_id.toString()}
                                    renderItem={({ item }) => (
                                      <TouchableOpacity
                                        style={styles.optionButton1}
                                        onPress={() => handleStateSelect(item)}
                                      >

                                        <Text style={styles.optionText1}>{item.state_name}</Text>
                                      </TouchableOpacity>
                                    )}
                                  />
                                  <TouchableOpacity
                                    style={styles.optionButton1}
                                    onPress={() => setIsStateModalVisible(false)}
                                  >
                                    <Text style={styles.optionText11}>Close</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </Modal>
                          </>
                        ) : key === 'City Name' ?
                          (
                            <>
                              <TouchableOpacity onPress={() => setIsCityModalVisible(true)}>
                                <Text style={styles.value}>{formData[key]}</Text>

                              </TouchableOpacity>
                              <Modal visible={isCityModalVisible} transparent={true} animationType="slide">
                                <View style={styles.modalOverlay1}>
                                  <View style={styles.modalcontainer1}>
                                    <FlatList
                                      data={cities}
                                      keyExtractor={(item) => String(item.city_id)}
                                      renderItem={({ item }) => (
                                        <TouchableOpacity
                                          style={styles.optionButton1}
                                          onPress={() => handleCitySelect(item)}
                                        >

                                          <Text style={styles.optionText1}>{item.city_name}</Text>
                                        </TouchableOpacity>
                                      )}
                                      ListEmptyComponent={
                                        <Text style={{ textAlign: "center", marginTop: 20, color: "red", fontFamily: 'Lexend-Medium' }}>
                                          No Cities Found
                                        </Text>
                                      }
                                    />

                                    <TouchableOpacity style={styles.optionButton1} onPress={() => setIsCityModalVisible(false)}>
                                      <Text style={styles.optionText11}>Close</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </Modal>
                            </>
                          ) : (
                            <TextInput
                              style={styles.input}
                              value={formData[key]}
                              onChangeText={(text) => setFormData((prev) => ({ ...prev, [key]: text }))}
                            />
                          )

        ) : (
          <Text style={styles.value}>{formData[key]}</Text>
        )}
      </View>
      ))}
    </View>
    
  );
};

const styles = StyleSheet.create({

  arrowstyle: {
    height: hp('2.2%'),
    width: wp('5.8%'),
    marginTop: hp('0.9%'),
    tintColor: "white",
    marginRight: wp('20%'),
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#FF7E00",
    padding: wp('4%'),
    flexDirection: "row",
    flex: 1,
  },
  headerText: {
    color: "#fff",
    fontSize: wp('5.2%'),
    marginTop: hp('0.2%'),
    fontFamily: "Lexend-Medium",
  },
  section: {
    backgroundColor: "#fff",
    marginVertical: hp('1.5%'),
    marginHorizontal: wp('4%'),
    borderRadius: wp('2%'),
    padding: wp('4%'),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp('1.2%'),
  },
  sectionTitle: {
    fontSize: wp('4.2%'),
    color: "#333",
    fontFamily: "Lexend-Medium",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp('0.6%'),
  },
  detailRoww: {
    marginVertical: hp('0.6%'),
    marginTop: hp('0.6%'),
    marginRight: wp('5%'),
    paddingRight: wp('5%'),
  },
  label: {
    fontSize: wp('3.8%'),
    color: "#555",
    fontFamily: "Lexend-Medium",
  },
  value: {
    fontSize: wp('3.8%'),
    color: "#777",
    fontFamily: "Lexend-Regular",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: wp('3.8%'),
    padding: wp('1.5%'),
    color: "#333",
    flex: 1,
    textAlign: "right",
    fontFamily: "Lexend-Medium",
  },
  editButton: {
    backgroundColor: "#FF7E00",
    padding: wp('3%'),
    borderRadius: wp('2%'),
  },
  saveButton: {
    backgroundColor: "#499202",
    padding: wp('3%'),
    borderRadius: wp('2%'),
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Lexend-Medium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: wp('80%'),
    backgroundColor: "#fff",
    borderRadius: wp('2%'),
    padding: wp('4%'),
  },
  modalItem: {
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalCloseButton: {
    marginTop: hp('2%'),
    alignSelf: "flex-end",
  },
  modalOverlay1: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalcontainer1: {
    width: wp('80%'),
    height: hp('70%'),
    backgroundColor: '#fff',
    borderRadius: wp('5%'),
    padding: wp('5%'),
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: wp('2%'),
    shadowOffset: { width: 0, height: hp('0.5%') },
  },
  modalcontainer11: {
    width: wp('80%'),
    backgroundColor: '#fff',
    borderRadius: wp('5%'),
    padding: wp('5%'),
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: wp('2%'),
    shadowOffset: { width: 0, height: hp('0.5%') },
  },
  optionButton1: {
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText1: {
    fontSize: wp('4.2%'),
    color: '#333',
    textAlign: 'center',
    fontFamily: "Lexend-Medium",
  },
  optionText11: {
    fontSize: wp('4.2%'),
    color: "#FF7E00",
    textAlign: 'center',
    fontFamily: "Lexend-Medium",
  },
  aboutMeText1: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
  },
  aboutMeValue1: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('4.2%'),
    color: '#666',
    lineHeight: hp('3%'),
    textAlign: 'justify',
  },
  aboutMeInput1: {
    height: hp('15%'),
    textAlignVertical: 'top',
    textAlign: 'justify',
    fontFamily: 'Lexend-Regular',
  },
  emojiIcon1: {
    fontSize: wp('5.2%'),
    marginRight: wp('2.5%'),
  },
  selectedOption: {
    // Kept empty for dynamic use
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingVertical: hp('0.6%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default Screen67;
