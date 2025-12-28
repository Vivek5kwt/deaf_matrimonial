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

// Static options
const maritalStatusOptions = ['Never Married', 'Widower', 'Awaiting Divorce', 'Divorced'];
const profileByOptions = ["Self", "Relatives", "Guardian", "Sibling", "Friends"];
const genderOptions = ["Male", "Female"];

interface EditableSectionProps {
  title: string;
  initialData: Record<string, string>;
  onSave: (data: Record<string, string>) => void;
}

const Screen67 = (props: any) => {
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
      console.log('API Response:', response.data);

      showSnackbar("Section updated successfully!");
      fetchUserData(); // Data refresh
    } catch (error) {
      console.error("Error updating data:", error);
      showSnackbar("Failed to update section data");
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF7E00" />;
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

        <EditableSection
          title="Basic Details"
          initialData={{
            'First Name': userData.firstname || "N/A",
            'Last Name': userData.lastname || "N/A",
            Email: userData.email || "N/A",
            Gender: userData.gender || "N/A",
            'Marital Status': userData.m_status || "N/A",
            "Mobile Number": userData.mobile || "N/A",
            "Parents Mobile No": userData.phone || "N/A",
            'Profile By': userData.profileby || "N/A",
            'Mother Tounge': userData.m_tongue || "N/A",
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
    if (isEditing && title === "Religion Information") {
      fetchReligionOptions();
    }
  }, [isEditing]);
  
  const fetchReligionOptions = async () => {
    try {
      const response = await axios.get("http://82.29.161.246:8002/api/religions");
      if (response.data?.data) {
        setReligionOptions(response.data.data);
      } else {
        console.error("Religion data not found");
      }
    } catch (error) {
      console.error("Error fetching religions:", error);
    }
  };
  
  const handleReligionSelect = (religion: any) => {
    console.log("Selected Religion:", religion);
  
    setFormData((prev) => ({
      ...prev,
      "Religion Name": religion.religion_name,
      religion_id: religion.religion_id,
      "Caste Name": "Select Caste",
      caste_id: "",
    }));
  
    setSelectedReligion(religion.religion_id);
    setIsReligionModalVisible(false);
  
    fetchCasteOptions(religion.religion_id);
  };
  
  const fetchCasteOptions = async (religion_id: number) => {
    try {
      const response = await axios.get(`http://82.29.161.246:8002/api/castes/${religion_id}`);
      if (response.data?.data) {
        setCasteOptions(response.data.data);
      } else {
        setCasteOptions([]);
        console.warn("No castes found for the selected religion.");
      }
    } catch (error) {
      console.error("Error fetching castes:", error);
    }
  };
  
  const handleCasteSelect = (caste: any) => {
    console.log("Selected Caste:", caste);
  
    setFormData((prev) => ({
      ...prev,
      "Caste Name": caste.caste_name,
      caste_id: caste.caste_id,
    }));
  
    setIsCasteModalVisible(false);
  };
  
  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender: gender }));
    setIsGenderModalVisible(false);
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

  const handleMotherToungeSelect = (selectedTounge: any) => {
    setFormData((prev) => ({
      ...prev,
      ["m_tongue"]: selectedTounge,
      ["Mother Tounge"]: selectedTounge,
    }));
    setIsMotherToungeModalVisible(false);
  };


  const handleSave = () => {
    const finalData = { ...formData };

    // Rename keys for API compatibility
    if (finalData['Mother Tounge']) {
      finalData['m_tongue'] = finalData['Mother Tounge'];
      delete finalData['Mother Tounge'];
    }
    if (finalData['Birth Date']) {
      finalData['birthdate'] = finalData['Birth Date'];
      delete finalData['Birth Date'];
    }
    if (finalData['Mobile Number']) {
      finalData['mobile'] = finalData['Mobile Number'];
      delete finalData['Mobile Number'];
    }
    if (finalData['Parents Mobile No']) {
      finalData['phone'] = finalData['Parents Mobile No'];
      delete finalData['Parents Mobile No'];
    }
    if (finalData['First Name']) {
      finalData['firstname'] = finalData['First Name'];
      delete finalData['First Name'];
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

      {Object.keys(formData).filter((key) => key !== "state_id" && key !== "city_id").map((key, index) => (
        <View key={index} style={styles.detailRow}>
          ## <Text style={styles.label}>{key}:</Text>

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
                <TouchableOpacity onPress={() => setIsGenderModalVisible(true)}>
                  <Text style={styles.value}>{formData[key]}</Text>
                </TouchableOpacity>
                <Modal visible={isGenderModalVisible} transparent={true} animationType="slide">
                  <View style={styles.modalOverlay1}>
                    <View style={styles.modalcontainer1}>
                      {genderOptions.map((gender, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => handleGenderSelect(gender)}
                          style={styles.optionButton1}
                        >
                          <Text style={styles.optionText1}>{gender}</Text>
                        </TouchableOpacity>
                      ))}

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
                    <View style={styles.modalcontainer1}>
                      {maritalStatusOptions.map((status, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => handleStatusSelect(status)}
                          style={styles.optionButton1}
                        >
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
                    <View style={styles.modalcontainer1}>
                      {profileByOptions.map((option, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => handleProfileBySelect(option)}
                          style={styles.optionButton1}
                        >
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
                <Modal visible={isReligionModalVisible} transparent={true} animationType="slide">
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
                    if (casteOptions.length === 0) {
                      alert("No castes available for the selected religion.");
                      return;
                    }
                    setIsCasteModalVisible(true);
                  }}
                >
                  <Text style={styles.value}>
                    {formData[key] === "N/A" ? "Select Caste" : formData[key]}
                  </Text>
                </TouchableOpacity>
                <Modal visible={isCasteModalVisible} transparent={true} animationType="slide">
                  <View style={styles.modalOverlay1}>
                    <View style={styles.modalcontainer1}>
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
                        ListEmptyComponent={
                          <Text style={styles.optionText1}>
                            No castes available for the selected religion
                          </Text>
                        }
                      />
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
                        {motherToungeOptions.map((tounge) => (
                          <TouchableOpacity
                            key={tounge.mtongue_id}
                            onPress={() => handleMotherToungeSelect(tounge.mtongue_name)}
                            style={styles.optionButton1}
                          >
                            <Text style={styles.optionText1}>{tounge.mtongue_name}</Text>
                          </TouchableOpacity>
                        ))}
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
    height: 18,
    width: 22,
    marginTop: 30,
    tintColor: "white",
    marginRight: 80,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#FF7E00",
    padding: 15,
    flexDirection: "row",
    flex: 1,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    marginTop: 25,
    fontFamily: "Lexend-Medium"

  },
  section: {
    backgroundColor: "#fff",
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Lexend-Medium"

  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  detailRoww: {
    marginVertical: 5,
    marginTop: 5,
    marginRight: 20,
    paddingRight: 20,
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Lexend-Medium"

  },
  value: {
    fontSize: 14,
    color: "#777",
    fontFamily: "Lexend-Regular"

  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 14,
    padding: 5,
    color: "#333",
    flex: 1,
    textAlign: "right",
    fontFamily: "Lexend-Medium"

  },
  editButton: {
    backgroundColor: "#FF7E00",
    padding: 10,
    borderRadius: 5,
    fontFamily: "Lexend-Medium"

  },
  saveButton: {
    backgroundColor: "#499202",
    padding: 10,
    borderRadius: 5,
    fontFamily: "Lexend-Medium"

  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Lexend-Medium"

  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalCloseButton: {
    marginTop: 16,
    alignSelf: "flex-end",
  },
  ///////
  modalOverlay1: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Dark overlay for a better visual effect
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalcontainer1: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 10, // For shadow on Android
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  optionButton1: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText1: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontFamily: "Lexend-Medium"
  },
  optionText11: {
    fontSize: 16,
    color: "#FF7E00",
    textAlign: 'center',
    fontFamily: "Lexend-Medium"
  },
  aboutMeText1: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  aboutMeValue1: {
    fontFamily: 'Lexend-Regular',
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'justify',
  },
  aboutMeInput1: {
    height: 120,
    textAlignVertical: 'top',
    textAlign: 'justify',
  },
  emojiIcon1: {
    fontSize: 20,
    marginRight: 10,
  },
  selectedOption: {

  }
});

export default Screen67;