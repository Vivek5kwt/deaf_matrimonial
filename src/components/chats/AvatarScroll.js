import React from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';

const AvatarScroll = ({ profiles }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {profiles.map((profile, index) => (
        <Image key={index} source={{ uri: profile.image }} style={styles.avatar} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', marginVertical: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginHorizontal: 5, borderWidth: 2, borderColor: '#4CAF50' },
});

export default AvatarScroll;
