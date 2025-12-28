import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UpgradeFooter = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        To Start a Call, <Text style={styles.highlight}>Upgrade Now!</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#FFF5E1', alignItems: 'center' },
  message: { fontSize: 14, color: '#555',fontFamily:'Lexend-Medium' },
  highlight: { color: 'orange', fontFamily:'Lexend-Medium' },
});

export default UpgradeFooter;
