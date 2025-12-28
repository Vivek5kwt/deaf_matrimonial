import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, FlatList, Animated } from 'react-native';
import HeaderTabs from '../../../components/chats/HeaderTabs';
import PermissionBox from '../../../components/chats/PermissionBox';
import BottomHeader from '../../../components/BottomHeader';
import { image2 } from '../../../utils/constants/images/image';

const Screen34 = () => {
  const [activeTab, setActiveTab] = useState('Active');

  const profiles = [
    { image: image2?.IMG15, name: 'Janhvi Kapoor', age: 24, location: 'Jhansi', status: 'Online' },
    { image: image2?.IMG15, name: 'Shivani', age: 23, location: 'Ludhiana', status: '1h ago' },
    { image: image2?.IMG15, name: 'Harman Kaur', age: 22, location: 'Chandigarh', status: 'Online' },
    { image: image2?.IMG15, name: 'Simran Kaur', age: 23, location: 'Bhopal', status: 'Online' },
  ];

  const activeProfilesCount = profiles.filter((profile) => profile.status === 'Online').length;

  const BlinkingDot = ({ isOnline }) => {
    const animation = new Animated.Value(0);

    useEffect(() => {
      const blink = () => {
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 750,
            useNativeDriver: true,
          }),
        ]).start(() => blink());
      };
      blink();
    }, [animation]);

    const opacity = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    if (!isOnline) return null;

    return <Animated.View style={[styles.blinkingDot, { opacity }]} />;
  };

  const renderProfile = ({ item }) => (
    <View style={styles.profileContainer}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.profileImage} />
        <BlinkingDot isOnline={item.status === 'Online'} />
      </View>
      <View style={styles.profileDetails}>
        <View style={styles.nameAndIconContainer}>
          <Text style={styles.profileName}>{item.name}</Text>
          <Image source={require('../../../assets/icons/phone1.png')} style={styles.callIcon} />
        </View>
        <Text style={styles.profileInfo}>{`${item.age}yrs, ${item.location}`}</Text>
      </View>
      <View style={styles.profileStatusContainer}>
        <Text style={[styles.profileStatus, item.status === 'Online' ? styles.onlineStatus : styles.offlineStatus]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 15 }}>
        <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} activeCount={activeProfilesCount} />
        <PermissionBox onChangePermission={() => console.log('Change permission pressed')} />
        <FlatList
          data={profiles}
          renderItem={renderProfile}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.profileList}
        />
      </View>

      <View style={styles.bottomHeaderContainer}>
        <BottomHeader />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 15, backgroundColor: '#fff' },
  profileList: { paddingHorizontal: 15, paddingBottom: 80 },
  profileContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  imageContainer: { position: 'relative' },
  profileImage: { width: 50, height: 50, borderRadius: 25 },
  blinkingDot: {
    width: 13,
    height: 13,
    backgroundColor: 'green',
    borderRadius: 10,
    position: 'absolute',
    right: 2,
    top: 40,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  profileDetails: { flex: 1, marginLeft: 15 },
  nameAndIconContainer: { flexDirection: 'row', alignItems: 'center' },
  profileName: { fontSize: 16, color: '#000', marginRight: 5, fontFamily: 'Lexend-Medium' },
  profileInfo: { fontSize: 14, color: '#555', fontFamily: 'Lexend-Regular' },
  profileStatusContainer: { justifyContent: 'center', alignItems: 'flex-end' },
  callIcon: { width: 12, height: 14 },
  profileStatus: { fontSize: 14 },
  onlineStatus: { color: '#28A745', fontFamily: 'Lexend-Regular' },
  offlineStatus: { color: '#BFBFBF', fontFamily: 'Lexend-Regular' },
  bottomHeaderContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});

export default Screen34;
