import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProfileList = ({ profiles }) => {
  return (
    <View>
      {profiles.map((profile, index) => (
        <View key={index} style={styles.profileContainer}>
          <Image source={{ uri: profile.image }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.details}>{profile.age}yrs, {profile.location}</Text>
          </View>
          <Text style={styles.status}>{profile.status}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  info: { flex: 1, marginLeft: 10 },
  name: { fontWeight: 'bold', fontSize: 16 },
  details: { fontSize: 14, color: '#777' },
  status: { fontSize: 14, color: 'green' },
});

export default ProfileList;
