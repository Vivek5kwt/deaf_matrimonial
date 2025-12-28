import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

const Step2 = ({ onNext, onPrevious }) => {
  const [placeOfBirth, setPlaceOfBirth] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <Text style={styles.stepText}>2/5</Text>
          <View style={styles.dotsContainer}>
            {[...Array(5)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index < 2 && styles.activeDot, // Fill dots up to the current step
                ]}
              />
            ))}
          </View>
        </View>

        <View style={{ marginTop: "15%" }}>
          <Text style={styles.title}>Place of Birth</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your place of birth"
              value={placeOfBirth}
              onChangeText={(text) => setPlaceOfBirth(text)}
            />
            {placeOfBirth.length > 0 && (
              <TouchableOpacity
                style={styles.clearIcon}
                onPress={() => setPlaceOfBirth("")}
              >
                <Text style={styles.clearText}>✖</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.navButton, placeOfBirth ? styles.activeNavButton : {}]}
            onPress={onNext}
            disabled={!placeOfBirth}
          >
            <Text
              style={[
                styles.navButtonText,
                placeOfBirth ? styles.activeNavButtonText : {},
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 10,
    position:'absolute',
    
  },
  topBar: {
    marginBottom: 20,
    position: "absolute",
    right: 0,
    top: 10,
  },
  stepText: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Lexend-Medium",
    marginBottom: 10,
    position: "absolute",
    right: 5,
  },
  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
    top: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C4C4C4",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#FF6A00",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "Lexend-Medium",
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: "Lexend-Regular",
  },
  clearIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  clearText: {
    fontSize: 16,
    color: "#888",
  },
  buttonContainer: {
    flexDirection: "row",
    alignSelf:'center',
    marginTop:"90%",

  },
  navButton: {
    backgroundColor: "#DDD",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius:20,
  },
  activeNavButton: {
    backgroundColor: "#FF6A00",
    borderRadius:20,
    paddingHorizontal: 50,

  },
  navButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Lexend-Medium",
  },
  activeNavButtonText: {
    color: "#FFF",
  },
});

export default Step2;
