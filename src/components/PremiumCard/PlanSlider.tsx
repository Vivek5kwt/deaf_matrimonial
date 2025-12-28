import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, FlatList, TouchableOpacity, ActivityIndicator, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('screen');

const checkIcon = require('../../assets/icons/Check1.png');
const crossIcon = require('../../assets/icons/delete.png');

export const getUserData = async () => {
  try {
    const matriId = await AsyncStorage.getItem('matri_id');
    const firstName = await AsyncStorage.getItem('firstName');
    const lastName = await AsyncStorage.getItem('lastName');
    const email = await AsyncStorage.getItem('email');
    const profilePicture = await AsyncStorage.getItem('profile_picture');
    const indexId = await AsyncStorage.getItem('index_id');
    const authToken = await AsyncStorage.getItem('auth_token');

    const userData = { matriId, firstName, lastName, email, profilePicture, indexId, authToken };
    return userData;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

export const PlanSlider: React.FC = () => {
  const navigation = useNavigation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [purchasedPlans, setPurchasedPlans] = useState<Record<string, boolean>>({});
  const flatListRef = useRef<FlatList>(null);
  const isMounted = useRef(true); // crash-safe ref

  useEffect(() => {
    isMounted.current = true;

    const fetchData = async () => {
      try {
        const plansResponse = await fetch('http://82.29.161.246:8002/api/membership-plans');
        const plansResult = await plansResponse.json();

        if (isMounted.current && plansResult.success) setPlans(plansResult.data);

        const userData = await getUserData();
        if (userData?.matriId) {
          const purchasedResponse = await fetch(`http://82.29.161.246:8002/api/user-plans/${userData.matriId}`);
          const purchasedResult = await purchasedResponse.json();

          if (isMounted.current && purchasedResult.success) {
            const purchasedMap = purchasedResult.data.reduce((acc: Record<string, boolean>, plan: any) => {
              acc[plan.plan_id] = true;
              return acc;
            }, {});
            setPurchasedPlans(purchasedMap);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted.current = false; // prevent state updates after unmount
    };
  }, []);

  const handleLabelPress = (index: number) => {
    setCurrentPlan(index);
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const handleContinue = async () => {
    try {
      const selectedPlan = plans[currentPlan];
      const userData = await getUserData();

      if (!userData || !userData.matriId || !userData.firstName || !userData.email) {
        Alert.alert('Error', 'Please complete your profile details first.');
        return;
      }

      if (isMounted.current) setLoading(true);

      const formData = new FormData();
      formData.append('amount', selectedPlan.plan_amount.toString());
      formData.append('p_plan', selectedPlan.plan_name.toLowerCase());
      formData.append('pname', `${userData.firstName} ${userData.lastName || ''}`.trim());
      formData.append('fstatus', isFeatured ? 'Featured' : 'Regular');
      formData.append('matri_id', userData.matriId);
      formData.append('pemail', userData.email);

      const response = await fetch('https://deafapi.ampleteck.com/api/payment/create', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' },
      });

      const textResponse = await response.text();
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (e) {
        console.error('Failed to parse response:', textResponse);
        throw new Error('Invalid server response');
      }

      if (!response.ok || !result.encRequest) {
        throw new Error(result.message || 'Failed to initiate payment');
      }

      navigation.navigate('CCAvenuePaymentScreen', {
        encRequest: result.encRequest,
        accessCode: result.access_code,
        paymentUrl: result.payment_url || 'https://test.ccavenue.com/transaction/transaction.do',
      });

    } catch (error: any) {
      console.error('Payment Error:', error.message, error.stack);
      Alert.alert('Payment Error', error.message || 'Failed to process payment');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const renderPrice = (plan: any) => {
    const basePrice = plan.plan_amount;
    const isGold = plan.plan_name.toLowerCase().includes('gold');
    const isPurchased = purchasedPlans[plan.plan_id];

    return (
      <View style={{ alignItems: 'center' }}>
        {!isPurchased ? (
          <>
            <Text style={styles.price}>₹{basePrice}</Text>
            {isGold && isFeatured && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.originalPrice}>+ ₹1000</Text>
                <Text style={styles.finalPrice}> = ₹{basePrice + 1000}</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.purchasedText}>Purchased</Text>
        )}
      </View>
    );
  };

  const renderPlanCard = (plan: any, index: number) => (
    <View style={[styles.cardContainer, currentPlan === index && styles.selectedCard]}>
      <View style={{ flexDirection: 'row', alignSelf: 'center', paddingVertical: 20 }}>
        <Text style={styles.planName}>{plan.plan_name.trim()}</Text>
        <Text style={styles.planName1}>{plan.plan_duration} days</Text>
      </View>
      <View style={{ borderTopWidth: 1, marginHorizontal: 40, borderColor: '#BFBFBF', marginTop: -15 }} />
      {renderPrice(plan)}

      <View style={styles.featureRow}>
        <Image source={checkIcon} style={styles.icon} />
        <Text style={styles.featureText}>Contacts: {plan.plan_contacts}</Text>
      </View>
      <View style={styles.featureRow}>
        <Image source={checkIcon} style={styles.icon} />
        <Text style={styles.featureText}>Messages: {plan.plan_msg}</Text>
      </View>
      <View style={styles.featureRow}>
        <Image source={plan.chat === 'Yes' ? checkIcon : crossIcon} style={styles.icon} />
        <Text style={plan.chat === 'Yes' ? styles.featureText : styles.inactiveFeatureText}>Text Chat</Text>
      </View>

      {plan.plan_name.toLowerCase().includes('gold') && !purchasedPlans[plan.plan_id] && (
        <View style={[styles.featureRow, { marginTop: 10 }]}>
          <Switch
            value={isFeatured}
            onValueChange={setIsFeatured}
            trackColor={{ false: '#767577', true: '#F57C00' }}
            thumbColor={isFeatured ? '#fff' : '#f4f3f4'}
          />
          <Text style={[styles.featureText, { marginLeft: 12 }]}>Featured Profile</Text>
        </View>
      )}

<TouchableOpacity
  style={[styles.button, purchasedPlans[plan.plan_id] ? styles.purchasedButton : null]}
  onPress={purchasedPlans[plan.plan_id] ? undefined : handleContinue}
  disabled={loading || purchasedPlans[plan.plan_id]}
>
  {!purchasedPlans[plan.plan_id] && loading ? (
    <ActivityIndicator size="small" color="#FFF" />
  ) : (
    <Text style={styles.buttonText}>
      {purchasedPlans[plan.plan_id] ? 'Purchased' : 'Continue'}
    </Text>
  )}
</TouchableOpacity>

    </View>
  );

  if (loading && plans.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF7E00" />
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.planSelector}>
        {plans.map((plan, index) => (
          <TouchableOpacity key={plan.plan_id} onPress={() => handleLabelPress(index)}>
            <Text style={[styles.selectorOption, currentPlan === index ? styles.activeOption : styles.inactiveOption]}>
              {plan.plan_name.charAt(0)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        ref={flatListRef}
        data={plans}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.plan_id.toString()}
        snapToInterval={width * 0.9 + 16}
        decelerationRate="fast"
        onScroll={({ nativeEvent }) => {
          const index = Math.round(nativeEvent.contentOffset.x / (width * 0.9 + 16));
          setCurrentPlan(index);
        }}
        renderItem={({ item, index }) => (
          <View style={{ width: width * 0.9, marginHorizontal: 8 }}>
            {renderPlanCard(item, index)}
          </View>
        )}
        style={{ marginTop: -90 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', marginBottom: -30 },
  planSelector: { flexDirection: 'row', marginVertical: 16, backgroundColor: '#FF7E00', width, alignSelf: 'center', justifyContent: 'center', paddingTop: 20, height: 170, marginTop: -10 },
  selectorOption: { width: 40, height: 40, borderRadius: 20, textAlign: 'center', textAlignVertical: 'center', marginHorizontal: 8, fontFamily: 'Lexend-Medium', fontSize: 16, borderWidth: 1 },
  activeOption: { backgroundColor: '#FFF', borderColor: '#F57C00', color: '#F57C00' },
  inactiveOption: { backgroundColor: '#F1F1F1', borderColor: '#CCC', color: '#333' },
  cardContainer: { paddingHorizontal: 60, borderRadius: 12, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, alignSelf: 'center', alignContent: 'center', paddingBottom: 30, padding: 20, marginVertical: 10 },
  selectedCard: { backgroundColor: '#F1F1F1' },
  planName: { fontSize: 18, color: '#333', alignSelf: 'center', fontFamily: 'Lexend-Medium' },
  planName1: { fontSize: 14, color: '#BFBFBF', alignSelf: 'center', marginLeft: 10, fontFamily: 'Lexend-Medium' },
  price: { fontSize: 24, color: '#333', alignSelf: 'center', marginVertical: 7, fontFamily: 'Lexend-Medium' },
  purchasedText: { fontSize: 18, color: '#4CAF50', alignSelf: 'center', marginVertical: 7, fontFamily: 'Lexend-Medium', fontWeight: 'bold' },
  originalPrice: { fontSize: 14, color: '#FF0000', fontFamily: 'Lexend-Medium' },
  finalPrice: { fontSize: 18, color: '#333', fontFamily: 'Lexend-Medium', fontWeight: 'bold' },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { width: 10, height: 10 },
  featureText: { fontSize: 14, color: '#333', marginLeft: 8, fontFamily: 'Lexend-Medium' },
  inactiveFeatureText: { fontSize: 14, color: '#CCC', marginLeft: 8, textDecorationLine: 'line-through', fontFamily: 'Lexend-Medium' },
  button: { marginTop: 16, paddingVertical: 8, backgroundColor: '#F57C00', borderRadius: 20, alignSelf: 'center', paddingHorizontal: 40 },
  purchasedButton: { backgroundColor: '#4CAF50' },
  buttonText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#FFF', fontFamily: 'Lexend-Medium' },
});
