import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PaymentStatusScreen({ route, navigation }) {
  const { status, response } = route.params;

  useEffect(() => {
    if (status === 'completed') {
      const timer = setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Screen51' }],
        });
      }, 5000); // Increased timeout to 5 seconds to let user see the message

      return () => clearTimeout(timer);
    }
  }, [status, navigation]);

  const handleManualRedirect = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Screen51' }],
    });
  };

  return (
    <View style={styles.container}>
      {status === 'completed' ? (
        <>
          <Text style={styles.success}>🎉 Payment Successful!</Text>
          <Text style={styles.message}>
            {response?.message || 'Thank you! Your plan is now active.'}
          </Text>
          <Text style={styles.autoRedirect}>
            You will be redirected to dashboard in 5 seconds...
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleManualRedirect}
          >
            <Text style={styles.buttonText}>Go to Dashboard Now</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.failure}>❌ Payment Failed</Text>
          <Text style={styles.message}>
            {response?.message || 'Something went wrong. Please try again.'}
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.replace('PlanSlider')}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 20 
  },
  success: { 
    fontSize: 24, 
    color: 'green', 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  failure: { 
    fontSize: 24, 
    color: 'red', 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  message: { 
    fontSize: 16, 
    color: '#333', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  autoRedirect: { 
    fontSize: 14, 
    color: '#555', 
    marginBottom: 20 
  },
  button: {
    backgroundColor: '#FF7E00',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});