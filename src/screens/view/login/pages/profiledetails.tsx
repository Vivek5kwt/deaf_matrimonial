import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, SafeAreaView, Image, Text, TextInput, ScrollView, Keyboard } from 'react-native';
import { arrow, userinfo } from '../../../../utils/constants/icons/icon';
import styles from '../../../../styles/onboadings/styles';
import styles1 from '../../../../styles/onboadings/loginpages/styles';
import { getUserData, storeUserData } from '../../../../utils/constants/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Screen5 = (props: any) => {
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  const dayRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [date, setDate] = useState({ day: '', month: '', year: '' });
  const [warning, setWarning] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);

  // Validate name fields - allows letters and spaces only
  const isValidName = (text: string) => {
    return /^[A-Za-z\s]*$/.test(text);
  };

  const handleFirstNameChange = (text: string) => {
    if (isValidName(text)) {
      setFirstName(text);
    }
  };

  const handleLastNameChange = (text: string) => {
    if (isValidName(text)) {
      setLastName(text);
    }
  };

  const validateAndSetDay = (text: string) => {
    if (/^\d*$/.test(text) && text.length <= 2) {
      const enteredDay = parseInt(text, 10);
      if (text.length === 2 && (enteredDay < 1 || enteredDay > 31)) {
        setWarning('Please enter a valid day (01-31)');
      } else {
        setDate((prev) => ({ ...prev, day: text }));
        setWarning('');
      }
    }
  };

  const validateAndSetMonth = (text: string) => {
    if (/^\d*$/.test(text) && text.length <= 2) {
      const enteredMonth = parseInt(text, 10);
      if (text.length === 2 && (enteredMonth < 1 || enteredMonth > 12)) {
        setWarning('Please enter a valid month (01-12)');
      } else {
        setDate((prev) => ({ ...prev, month: text }));
        setWarning('');
      }
    }
  };

  const validateAndSetYear = (text: string) => {
    const currentYear = 2010;
    if (/^\d*$/.test(text) && text.length <= 4) {
      const enteredYear = parseInt(text, 10);
      if (text.length === 4 && (enteredYear < 1970 || enteredYear > currentYear)) {
        setWarning('Please enter a valid year (1970 to 2010)');
      } else {
        setDate((prev) => ({ ...prev, year: text }));
        setWarning('');
      }
    }
  };

  useEffect(() => {
    const { day, month, year } = date;
    const isDateValid = day && month && year && 
                       /^\d{2}$/.test(day) && 
                       /^\d{2}$/.test(month) && 
                       /^\d{4}$/.test(year);
    
    const isNameValid = firstName.trim() && lastName.trim() && 
                       isValidName(firstName) && 
                       isValidName(lastName);

    setIsButtonEnabled(isNameValid && isDateValid);
  }, [firstName, lastName, date]);

  const validateForm = () => {
    if (!firstName.trim()) {
      setWarning('Please enter your first name');
      return false;
    }
    if (!isValidName(firstName)) {
      setWarning('First name can only contain letters');
      return false;
    }
    if (!lastName.trim()) {
      setWarning('Please enter your last name');
      return false;
    }
    if (!isValidName(lastName)) {
      setWarning('Last name can only contain letters');
      return false;
    }
    if (!date.day || !date.month || !date.year) {
      setWarning('Please enter your complete date of birth');
      return false;
    }
    if (date.day.length !== 2 || date.month.length !== 2 || date.year.length !== 4) {
      setWarning('Please enter a valid date (DD-MM-YYYY)');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    setTriedSubmit(true);
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }

    setWarning('');
    setIsButtonEnabled(false);

    const userData = await getUserData();

    if (!userData || !userData.matriId) {
      setWarning('Matri ID not found. Please restart the registration process.');
      setIsButtonEnabled(true);
      return;
    }

    const requestBody = {
      firstname: firstName.trim(),
      lastname: lastName.trim(),
      birthdate: `${date.day}-${date.month}-${date.year}`,
      matri_id: userData.matriId,
    };

    try {
      const response = await fetch('http://82.29.161.246:8002/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.status === 201) {
        await storeUserData({
          matriId: data.matri_id || userData.matriId,
          firstName: data.user?.firstname || firstName.trim(),
          lastName: data.user?.lastname || lastName.trim(),
          indexId: data.user?.index_id,
        });

        props.navigation.navigate('Screen7');
      } else {
        setWarning(data?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setWarning('Something went wrong. Please try again.');
    } finally {
      setIsButtonEnabled(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={{ marginHorizontal: wp(5) }}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
            </TouchableOpacity>

            <View
              style={{
                alignSelf:'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: wp(15),
                padding: hp(2.5),
                backgroundColor: '#FDF1E3',
                borderColor: '#FDF1E3',
              }}
            >
              <Image source={userinfo?.Icon8} resizeMode="stretch" style={styles1.userinfoimage} />
            </View>
          </View>

          <View style={{ marginHorizontal: wp(5) }}>
            <Text style={styles1.textt}>Your Name</Text>
            <View style={styles1.inputContainerrr}>
              <TextInput
                style={styles1.textInput}
                placeholder="First Name"
                placeholderTextColor="#888"
                value={firstName}
                onChangeText={handleFirstNameChange}
                autoCapitalize="words"
                autoComplete="name-given"
                textContentType="givenName"
                returnKeyType="next"
                onSubmitEditing={() => {
                  lastNameRef.current?.focus();
                }}
              />
            </View>
            <View style={styles1.inputContainerrr}>
              <TextInput
                ref={lastNameRef}
                style={styles1.textInput}
                placeholder="Last Name"
                placeholderTextColor="#888"
                value={lastName}
                onChangeText={handleLastNameChange}
                autoCapitalize="words"
                autoComplete="name-family"
                textContentType="familyName"
                returnKeyType="next"
                onSubmitEditing={() => {
                  dayRef.current?.focus();
                }}
              />
            </View>

            <Text style={styles1.textt}>Date of Birth</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles1.dateInputWrapper}>
                <Text style={styles1.timetext}>Day</Text>
                <TextInput
                  ref={dayRef}
                  style={[styles1.dateInputtt]}
                  placeholder="DD"
                  placeholderTextColor="#888"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={date.day}
                  onChangeText={validateAndSetDay}
                  onBlur={() => {
                    if (date.day.length === 1) {
                      setDate(prev => ({ ...prev, day: `0${prev.day}` }));
                    }
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    monthRef.current?.focus();
                  }}
                />
              </View>
              <View style={styles1.dateInputWrapper}>
                <Text style={styles1.timetext}>Month</Text>
                <TextInput
                  ref={monthRef}
                  style={[styles1.dateInput]}
                  placeholder="MM"
                  placeholderTextColor="#888"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={date.month}
                  onChangeText={validateAndSetMonth}
                  onBlur={() => {
                    if (date.month.length === 1) {
                      setDate(prev => ({ ...prev, month: `0${prev.month}` }));
                    }
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    yearRef.current?.focus();
                  }}
                />
              </View>
              <View style={styles1.dateInputWrapper}>
                <Text style={styles1.timetext}>Year</Text>
                <TextInput
                  ref={yearRef}
                  style={[styles1.dateInputt]}
                  placeholder="YYYY"
                  placeholderTextColor="#888"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={date.year}
                  onChangeText={validateAndSetYear}
                  returnKeyType="done"
                  onSubmitEditing={handleNext}
                />
              </View>
            </View>

            {(warning !== '' && triedSubmit) && (
              <Text style={{ color: 'red', marginTop: hp(1), textAlign: 'center' }}>{warning}</Text>
            )}
          </View>

          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: wp(5),
              padding: hp(1.2),
              marginHorizontal: wp(13),
              backgroundColor: isButtonEnabled ? '#FF7E00' : '#DDD',
              borderColor: isButtonEnabled ? '#FF7E00' : '#CCC',
              marginTop: hp(10),
              marginBottom: hp(5),
            }}
            onPress={handleNext}
            disabled={!isButtonEnabled}
          >
            <Text style={{ 
              color: isButtonEnabled ? '#FFF' : '#888', 
              fontFamily:'Lexend-Medium',
              fontSize: wp(4) 
            }}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Screen5;