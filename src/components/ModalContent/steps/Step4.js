import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { iicon1, iicon10, iicon11, iicon12, iicon2, iicon3, iicon4, iicon5, iicon6, iicon7, iicon8, iicon9 } from "../../../utils/constants/icons/icon";

const zodiacSigns = [
  { name: "Aries", subtitle: "Mesh", icon: iicon1?.Icon115 },
  { name: "Taurus", subtitle: "Vrishabh", icon: iicon2?.Icon116  },
  { name: "Gemini", subtitle: "Mithun", icon: iicon3?.Icon117  },
  { name: "Cancer", subtitle: "Kark", icon: iicon4?.Icon118  },
  { name: "Leo", subtitle: "Simha", icon: iicon5?.Icon119  },
  { name: "Virgo", subtitle: "Kanya",icon: iicon6?.Icon120  },
  { name: "Libra", subtitle: "Tula", icon: iicon7?.Icon121  },
  { name: "Scorpio", subtitle: "Vrishchik", icon: iicon8?.Icon122},
  { name: "Sagittarius", subtitle: "Dhanu",icon: iicon9?.Icon123  },
  { name: "Capricorn", subtitle: "Makar",icon: iicon10?.Icon124  },
  { name: "Aquarius", subtitle: "Kumbh",icon: iicon11?.Icon125 },
  { name: "Pisces", subtitle: "Meen", icon: iicon12?.Icon126  },
];

const Step4 = ({ onNext }) => {
  const [selectedSign, setSelectedSign] = useState(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Step and Progress Indicator */}
      <View style={styles.topBar}>
      <View style={styles.stepContainer}>

        <Text style={styles.stepText}>4/5</Text>
        <View style={styles.dotsContainer}>
          {[...Array(5)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index < 4 && styles.activeDot, // Fill dots up to the current step
              ]}
            />
          ))}
                  </View>

        </View>
      </View>

      {/* Title and Subtitle */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Raashi</Text>
        <Text style={styles.subtitle}>This is based on lunar star sign.</Text>
      </View>

      {/* Zodiac Options */}
      <View style={styles.zodiacContainer}>
        {zodiacSigns.map((sign, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.zodiacCard,
              selectedSign === sign.name && styles.selectedCard,
            ]}
            onPress={() => setSelectedSign(sign.name)}
          >
            <Image source={sign.icon} style={styles.zodiacIcon} />
            <Text style={styles.zodiacName}>{sign.name}</Text>
            <Text style={styles.zodiacSubtitle}>{sign.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            selectedSign ? styles.activeNavButton : {},
          ]}
          onPress={onNext}
          disabled={!selectedSign}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  topBar: {
    marginBottom: 20,
    position: "absolute",
    right: 20,
    top: 10,
  },
  stepContainer: {
    alignItems: "flex-end",
  },
  stepText: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Lexend-Medium",
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: "row",
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
  titleContainer: {
    marginTop: 60,
  },
  title: {
    fontSize: 22,
    fontFamily: "Lexend-Medium",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Lexend-Regular",
    marginTop: 5,
  },
  zodiacContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  zodiacCard: {
    width: "30%",
    alignItems: "center",
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  selectedCard: {
    borderColor: "#FF6A00",
    borderWidth: 2,
    backgroundColor: "#FFE5D1",
  },
  zodiacIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginBottom: 8,
  },
  zodiacName: {
    fontSize: 14,
    fontFamily: "Lexend-Medium",
    color: "#000",
  },
  zodiacSubtitle: {
    fontSize: 12,
    fontFamily: "Lexend-Regular",
    color: "#888",
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  navButton: {
    backgroundColor: "#DDD",
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 20,
  },
  activeNavButton: {
    backgroundColor: "#FF6A00",
  },
  navButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Lexend-Medium",
  },
});

export default Step4;
