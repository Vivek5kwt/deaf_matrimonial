import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PaymentErrorScreen({ route, navigation }) {
  const { error, code } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Payment Error</Text>
      <Text style={styles.message}>
        {error
          ? `Error: ${error}`
          : code
            ? `Server responded with status code ${code}`
            : 'Something went wrong during your payment process.'}
      </Text>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => navigation.replace('PlanSlider')}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#FF7E00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
});
