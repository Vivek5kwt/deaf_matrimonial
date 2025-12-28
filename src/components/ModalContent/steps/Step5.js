import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Step5 = ({ onNext }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <View style={styles.container}>
      {/* Step Count */}
      <View style={styles.topBar}>
        <Text style={styles.stepText}>5/5</Text>
        <View style={styles.dotsContainer}>
          {[...Array(5)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index < 5 && styles.activeDot, // Fill dots up to the current step
              ]}
            />
          ))}
        </View>
      </View>

      <View style={{ marginTop: "15%" }}>
        <Text style={styles.title}>Nakshatra</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {["Dhanistha", "Shatabhishak", "Purva Bhadrapada"].map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionRow}
              onPress={() => setSelectedOption(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
              <View style={styles.outerCircle}>
                {selectedOption === option && <View style={styles.filledCircle} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.navButton, selectedOption ? styles.activeNavButton : {}]}
          onPress={onNext}
          // disabled={!selectedOption}
        >
          <Text
            style={[
              styles.navButtonText,
              selectedOption ? styles.activeNavButtonText : {},
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
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
  optionsContainer: {
    marginVertical: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ensures text and dot are on opposite sides
    marginBottom: 20,
    borderColor: "#CCC",
    borderRadius: 12, // Add rounded corners to the row
  },
  outerCircle: {
    width: 14, // Outer circle size
    height: 14,
    borderRadius: 11, // Full border radius for a round outer circle
    borderWidth: 1,
    borderColor: "#FF6A00", // Outer circle border color
    justifyContent: "center",
    alignItems: "center",
  },
  filledCircle: {
    width: 10, // Inner filled circle size
    height: 10,
    borderRadius: 10, // Full border radius for a round inner circle
    backgroundColor:  "#FF6A00"
  },
  optionText: {
    fontSize: 15,
    fontFamily: "Lexend-Regular",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignSelf: "center",
    marginTop:"80%"
  },
  navButton: {
    backgroundColor: "#DDD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
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

export default Step5;
