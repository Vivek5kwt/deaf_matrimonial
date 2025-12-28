import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const PlanDetailsScreen = () => {
  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const matriId = await AsyncStorage.getItem('matri_id');
        if (!matriId) throw new Error('Matri ID not found');

        const response = await fetch(`http://82.29.161.246:8002/api/current-plan/${matriId}`);
        const json = await response.json();

        if (json.success) {
          setPlanDetails(json.data);
        } else {
          throw new Error(json.message || 'Failed to fetch plan details');
        }
      } catch (error) {
        showModal(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, []);

  // ✅ Modal Show Function
  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#f57c00" style={styles.loader} />;
  }
  return (
    <>
      {planDetails ? (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Current Plan Details</Text>
          <Text style={styles.subtitle}>
            You can check your current membership plan detail and recommended suggestions below.
          </Text>
          
          <View style={styles.card}>
            <Text style={styles.planName}>{planDetails.plan_name}</Text>
            <Text style={styles.statusText}>
              Status: {planDetails.isExpired ? 'Expired' : 'Active'}
            </Text>

            <View style={styles.row}>
              <Text style={styles.label}>Activation Date</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{planDetails.activation_date}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Expiration Date</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{planDetails.expires_on}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Message Limit</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{planDetails.message_limit}</Text>
                <Text style={styles.remaining}>
                  {planDetails.remaining_messages} Remaining ({planDetails.messages_sent} sent)
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.container}>
          {/* <Text style={styles.errorText}>No plan details available.</Text> */}
        </View>
      )}

{/* <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <LottieView
        source={require('../../assets/animations/noplan.json')}
        autoPlay
        loop
        style={{ width: 150, height: 150,alignSelf:'center'}}
      />
      <Text style={styles.modalMessage}>{modalMessage}</Text>
      <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
        <Text style={styles.modalButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal> */}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Lexend-Medium',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontFamily: 'Lexend-Regular',
    

  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  planName: {
    fontSize: 20,
    fontFamily: 'Lexend-Medium',
    color: '#f57c00',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontFamily: 'Lexend-Medium',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    fontFamily: 'Lexend-Medium',

  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Lexend-Medium',
    color: '#333',
  },
  remaining: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
    fontFamily: 'Lexend-Medium',

  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Lexend-Medium',

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Lexend-Medium',

  },
  modalButton: {
    backgroundColor: '#f57c00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    width:'30%'
  },
  modalButtonText: {
    color: '#fff',
    fontFamily: 'Lexend-Medium',
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
  },
});

export default PlanDetailsScreen;
