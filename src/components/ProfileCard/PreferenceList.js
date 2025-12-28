import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const preferences = [
  { label: 'Age', value: '23 to 28' },
  { label: 'Height', value: "4'5\"(134cm) to 5'5\"(165cm)" },
  { label: 'Marital Status', value: 'Never Married' },
  { label: 'Religion / Community', value: 'Hindu: Brahmin, etc.Hindu: Brahmin - Gour, Hindu: Brahmin-Kanyakubja, Hindu: Brahmin - Saryuparin....' },
  { label: 'Mother Tongue', value: 'Hindi, English' },
  { label: 'Country Living in', value: 'Australia, Canada, India, USA' },
  { label: 'Annual Income', value: 'Above INR 4 Lakh, AUD 40k' },
];

const PreferenceList = ({ checkmarkIcon, dividerIcon }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You match 7/7 of her Preferences</Text>
      {preferences.map((item, index) => (
        <View key={index}>
          <View style={styles.item}>
            <View style={styles.textContainer}>
              <Text style={styles.label}>{item.label}:</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
            <Image source={checkmarkIcon} style={styles.checkmarkIcon} />
          </View>
          {index < preferences.length - 1 && (
            <Image source={dividerIcon} style={styles.line} />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontFamily: "Lexend-Medium",
    marginBottom: 8,
    alignSelf:'center',
    color:"#434150",
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align text and icon
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontFamily: "Lexend-Medium",
  },
  value: {
    color: '#555',
    fontFamily: "Lexend-Medium",

  },
  checkmarkIcon: {
    width: 30,
    height: 30,
  },
   line: {
        width: "100%",
        height: 2.5,
        marginVertical:5
    },
});

export default PreferenceList;
