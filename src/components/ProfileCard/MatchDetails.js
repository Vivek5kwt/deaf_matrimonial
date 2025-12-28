import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const details = [
  'She too has a Bachelor’s degree',
  'She too is from the Hindi community',
  'Check your Astro compatibility with Her',
];

const MatchDetails = ({ checkmarkIcon, dividerIcon }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Common Between the both of you</Text>
      {details.map((detail, index) => (
        <View key={index}>
          <View style={styles.item}>
            <Image source={checkmarkIcon} style={styles.checkmarkIcon} />
            <Text style={styles.text}>{detail}</Text>
          </View>
          {index < details.length - 1 && (
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
    fontSize: 16,
    fontFamily: "Lexend-Medium",
    marginVertical:10,
    color:'black'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmarkIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  text: {
    color: '#555',
    fontFamily: "Lexend-Medium",

  },
  line: {
    width: "100%",
    height: 2.5,
    marginVertical:5,

},
});

export default MatchDetails;
