import React, { useEffect } from 'react';
import { View, StatusBar, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Screen1 = ({ navigation }) => {
  useEffect(() => {
    const checkUserLogin = async () => {
      const authToken = await AsyncStorage.getItem('auth_token');

      if (authToken) {
        navigation.replace('Screen26');
      } else {
        navigation.replace('Screen2');
      }
    };

    checkUserLogin();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar barStyle="dark-content" />
      <Text style={{ fontSize: 20 }}>Screen1 OK ✅</Text>
    </View>
  );
};

export default Screen1;
