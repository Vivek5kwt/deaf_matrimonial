import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActiveIconProvider } from './src/redux/ActiveIconContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';

// Suppress Firebase deprecation warnings in App component as well
LogBox.ignoreLogs([
  'This method is deprecated',
  'React Native Firebase namespaced API',
  'migrating-to-v22',
]);
import {
  initializeFCM,
  getCurrentToken,
  setNavigationReference,
} from './src/utils/constants/notifications/notificationHandler'

import Screen1 from "./src/screens/view/onboardings/saplash";
import Screen2 from "./src/screens/view/onboardings/onboarding";//ok API done 
import Screen3 from "./src/screens/view/login/login";//ok API done
import Screen4 from "./src/screens/view/login/pages/profilefor";//ok APi done
import Screen5 from "./src/screens/view/login/pages/profiledetails";//ok API done
import Screen6 from "./src/screens/view/login/pages/religionetc";//ok API done
import Screen7 from "./src/screens/view/login/pages/verification/verification";//otp verifiation api done
import Screen8 from "./src/screens/view/login/pages/verification/statecity";//ok api done
import Screen9 from "./src/screens/view/login/pages/verification/maritaletc";//ok api done
import Screen10 from "./src/screens/view/login/pages/verification/qualification";//ok api done
import Screen11 from "./src/screens/view/login/pages/verification/incomework";//ok screennjump 15 api done
import Screen12 from "./src/screens/view/login/pages/verification/aboutyourself"; //ok entre from 12 api done
import Screen13 from "./src/screens/view/login/pages/verification/gallery";//ok Profile picture entre from 21 api done
import Screen14 from "./src/screens/view/login/pages/verification/verifymobile";//done set on screen7 api done
import Screen15 from "./src/screens/view/login/pages/verification/adiverification";//doccument upload verify //ok api done
import Screen16 from "./src/screens/view/login/pages/verification/hobbies";//ok api done
import Screen17 from "./src/screens/view/login/pages/verification/addfamily";//ok screen 18 and 19 no need.removed api done
import Screen21 from "./src/screens/view/login/pages/verification/partnerprefrence";//ok api done //go on screen 12 thrn 13 after that  Screen26  //on screen from 17th  .removed screen22 /
import Screen26 from "./src/screens/view/login/pages/home/home";
import Screen27 from "./src/screens/view/login/pages/home/pages/newjoiners";//Two Way matches
import Screen28 from "./src/screens/view/login/pages/home/pages/mymathes";//Preferred Matches',
import Screen29 from "./src/screens/view/login/pages/home/pages/search";
import Screen30 from "./src/screens/view/login/pages/home/pages/Daily"; //One Way matches
import Screen32 from "./src/screens/view/login/pages/home/View/ReasonForReporting"
import Screen34 from "./src/screens/view/chat/ActiveScreen"
import Screen35 from "./src/screens/view/chat/CallsScreen"//free
import Screen33 from "./src/screens/view/chat/RecentScreen" //chat live screen
import Screen36 from "./src/screens/view/MatchesScreen/MatchesScreen.tsx"//Free
import Screen37 from "./src/screens/view/ShortlistedScreen/ShortlistedScreen.tsx" //custom matches
import Screen38 from "./src/screens/view/RecentlyViewedScreen/RecentlyViewedScreen.tsx" //free
import Screen39 from "./src/screens/view/login/pages/home/pages/nearme.tsx";//Broader matches',
import Screen40 from "./src/screens/Inbox/Recived.tsx";
import Screen41 from "./src/screens/Inbox/Accepted.tsx";
import Screen42 from "./src/screens/Inbox/Contacts.tsx";
import Screen43 from "./src/screens/Inbox/Sent.tsx";
import Screen44 from "./src/screens/Inbox/More.tsx";
import Screen45 from "./src/screens/view/PrivacyPolicy&Term/TermScreen.tsx";
import Screen46 from "./src/screens/view/PrivacyPolicy&Term/PrivacyPolicy.tsx";
import Screen47 from "./src/screens/view/login/forgetPassword/forgot_pswd.tsx";
import Screen50 from "./src/screens/view/login/forgetPassword/pswd_done.tsx";
import Screen51 from "./src/screens/view/PremiumPlans/PremiumScreens.tsx"; //plans screen current plans 
import Screen52 from "./src/screens/view/settings/PhotoPrivacy.tsx";
import Screen53 from "./src/screens/view/settings/ContactView.tsx";
import Screen54 from "./src/screens/view/settings/ChangePassword.tsx";
import Screen56 from "./src/screens/view/settings/BlockUser.tsx";
import Screen57 from "./src/screens/view/Profiledetails/shortlist.tsx";
import Screen58 from "./src/screens/view/Profiledetails/BlockList.tsx";
import Screen59 from "./src/screens/view/Profiledetails/Viewedby.tsx";
import Screen60 from "./src/screens/view/Profiledetails/Ivisited.tsx";
import Screen61 from "./src/screens/view/Profiledetails/MoboNuMViewed.tsx";
import Screen62 from "./src/screens/view/Profiledetails/RequestPhotopasswrd.tsx";
import Screen63 from "./src/screens/view/Helpandsupport/Contact.tsx";
import Screen64 from "./src/screens/view/Helpandsupport/Faq.tsx";
import Screen65 from "./src/screens/view/Helpandsupport/Refund.tsx";
import Screen66 from "./src/screens/view/Pay/Pay.tsx";
import Screen67 from "./src/screens/view/profileEdit/EditProfile.tsx";
import Screen68 from "./src/screens/view/login/pages/home/pages/UserAboutdetails.tsx";
import SearchResultsScreen from "./src/screens/view/login/pages/home/pages/SearchResults.tsx";
import AddSuccessStoryScreen from "./src/screens/view/SuccessStoriesScreen/AddSuccessStoryScreen.tsx";
import SuccessStoriesScreen from "./src/screens/view/SuccessStoriesScreen/SuccessStoriesScreen.tsx";
import NotificationBell from "./src/screens/view/login/pages/notification/Notifications.js";
import Screen48 from "./src/screens/view/login/forgetPassword/otp_verify.tsx";
import Screen69 from "./src/screens/view/login/forgetPassword/set_password.tsx";
import Screen70 from "./src/screens/view/profileEdit/Editpartnerprefrence.tsx";
import CCAvenuePaymentScreen from "./src/components/PremiumCard/CcAvenuePaymentScreen.tsx";
import PaymentStatusScreen from "./src/components/PremiumCard/PaymentStatusScreen.tsx";
import PaymentErrorScreen from "./src/components/PremiumCard/PaymentErrorScreen.tsx";

const queryClient = new QueryClient();

const Stack = createNativeStackNavigator();

const AppNavigator = ({ navigationRef }) => {
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={undefined}
      // TEMPORARILY DISABLED TO DEBUG: linking={{
      //   prefixes: ['com.deaf.matrimonial'], // Your app's URL scheme
      //   config: {
      //     screens: {
      //       Screen40: 'inbox', // Map URL path to screen
      //     },
      //   },
      // }}
    >

      <Stack.Navigator
        initialRouteName="Screen1"
        screenOptions={{
          headerBackTitle: '',
        }}
      >
      <Stack.Screen
        name="Screen1"
        component={Screen1}
        options={{ headerShown: false }}
        initialParams={{}}
      />
      <Stack.Screen name="Screen2" component={Screen2} options={{ headerShown: false }} />
      <Stack.Screen name="Screen3" component={Screen3} options={{ headerShown: false }} />
      <Stack.Screen name="Screen4" component={Screen4} options={{ headerShown: false }} />
      <Stack.Screen name="Screen5" component={Screen5} options={{ headerShown: false }} />
      <Stack.Screen name="Screen6" component={Screen6} options={{ headerShown: false }} />
      <Stack.Screen name="Screen7" component={Screen7} options={{ headerShown: false }} />
      <Stack.Screen name="Screen8" component={Screen8} options={{ headerShown: false }} />
      <Stack.Screen name="Screen9" component={Screen9} options={{ headerShown: false }} />
      <Stack.Screen name="Screen10" component={Screen10} options={{ headerShown: false }} />
      <Stack.Screen name="Screen11" component={Screen11} options={{ headerShown: false }} />
      <Stack.Screen name="Screen12" component={Screen12} options={{ headerShown: false }} />
      <Stack.Screen name="Screen13" component={Screen13} options={{ headerShown: false }} />
      <Stack.Screen name="Screen14" component={Screen14} options={{ headerShown: false }} />
      <Stack.Screen name="Screen15" component={Screen15} options={{ headerShown: false }} />
      <Stack.Screen name="Screen16" component={Screen16} options={{ headerShown: false }} />
      <Stack.Screen name="Screen17" component={Screen17} options={{ headerShown: false }} />
      <Stack.Screen name="Screen21" component={Screen21} options={{ headerShown: false }} />
      <Stack.Screen name="Screen26" component={Screen26} options={{ headerShown: false }} />
      <Stack.Screen name="Screen27" component={Screen27} options={{ headerShown: false }} />
      <Stack.Screen name="Screen28" component={Screen28} options={{ headerShown: false }} />
      <Stack.Screen name="Screen29" component={Screen29} options={{ headerShown: false }} />
      <Stack.Screen name="Screen30" component={Screen30} options={{ headerShown: false }} />
      <Stack.Screen name="Screen32" component={Screen32} options={{ headerShown: false }} />
      <Stack.Screen name="Screen33" component={Screen33} options={{ headerShown: false }} />
      <Stack.Screen name="Screen34" component={Screen34} options={{ headerShown: false }} />
      <Stack.Screen name="Screen35" component={Screen35} options={{ headerShown: false }} />
      <Stack.Screen name="Screen36" component={Screen36} options={{ headerShown: false }} />
      <Stack.Screen name="Screen37" component={Screen37} options={{ headerShown: false }} />
      <Stack.Screen name="Screen38" component={Screen38} options={{ headerShown: false }} />
      <Stack.Screen name="Screen39" component={Screen39} options={{ headerShown: false }} />
      <Stack.Screen name="Screen40" component={Screen40} options={{ headerShown: false }} />
      <Stack.Screen name="Screen41" component={Screen41} options={{ headerShown: false }} />
      <Stack.Screen name="Screen42" component={Screen42} options={{ headerShown: false }} />
      <Stack.Screen name="Screen43" component={Screen43} options={{ headerShown: false }} />
      <Stack.Screen name="Screen44" component={Screen44} options={{ headerShown: false }} />
      <Stack.Screen name="Screen45" component={Screen45} options={{ headerShown: false }} />
      <Stack.Screen name="Screen46" component={Screen46} options={{ headerShown: false }} />
      <Stack.Screen name="Screen47" component={Screen47} options={{ headerShown: false }} />
      <Stack.Screen name="Screen48" component={Screen48} options={{ headerShown: false }} />
      <Stack.Screen name="Screen50" component={Screen50} options={{ headerShown: false }} />
      <Stack.Screen name="Screen51" component={Screen51} options={{ headerShown: false }} />
      <Stack.Screen name="Screen52" component={Screen52} options={{ headerShown: false }} />
      <Stack.Screen name="Screen53" component={Screen53} options={{ headerShown: false }} />
      <Stack.Screen name="Screen54" component={Screen54} options={{ headerShown: false }} />
      <Stack.Screen name="Screen56" component={Screen56} options={{ headerShown: false }} />
      <Stack.Screen name="Screen57" component={Screen57} options={{ headerShown: false }} />
      <Stack.Screen name="Screen58" component={Screen58} options={{ headerShown: false }} />
      <Stack.Screen name="Screen59" component={Screen59} options={{ headerShown: false }} />
      <Stack.Screen name="Screen60" component={Screen60} options={{ headerShown: false }} />
      <Stack.Screen name="Screen61" component={Screen61} options={{ headerShown: false }} />
      <Stack.Screen name="Screen62" component={Screen62} options={{ headerShown: false }} />
      <Stack.Screen name="Screen63" component={Screen63} options={{ headerShown: false }} />
      <Stack.Screen name="Screen64" component={Screen64} options={{ headerShown: false }} />
      <Stack.Screen name="Screen65" component={Screen65} options={{ headerShown: false }} />
      <Stack.Screen name="Screen66" component={Screen66} options={{ headerShown: false }} />
      <Stack.Screen name="Screen67" component={Screen67} options={{ headerShown: false }} />
      <Stack.Screen name="Screen68" component={Screen68} options={{ headerShown: false }} />
      <Stack.Screen name="Screen69" component={Screen69} options={{ headerShown: false }} />
      <Stack.Screen name="Screen70" component={Screen70} options={{ headerShown: false }} />
      <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SuccessStories" component={SuccessStoriesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddSuccessStory" component={AddSuccessStoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationBell" component={NotificationBell} options={{ headerShown: false }} />
      <Stack.Screen name="CCAvenuePaymentScreen" component={CCAvenuePaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentStatusScreen" component={PaymentStatusScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentErrorScreen" component={PaymentErrorScreen} options={{ headerShown: false }} /> 


    </Stack.Navigator>
  </NavigationContainer>
  );
};

const App = (props) => {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const navigationRef = React.useRef<any>(null);


  // Handle notification taps with deep linking
  const handleNotificationTap = useCallback((data) => {
    console.log('🔔 Notification tapped:', data);
    // Navigation handled by notificationHandler.js
  }, []);
  useEffect(() => {
    setNavigationReference(navigationRef);
  }, []);

  useEffect(() => {
    // Set a timeout to ensure app loads even if Firebase takes too long
    const timeout = setTimeout(() => {
      console.log('⏱️ Firebase initialization timeout - loading app anyway');
      setFirebaseInitialized(true);
    }, 3000); // 3 second timeout

    const initApp = async () => {
      try {
        const initialized = await initializeFCM(handleNotificationTap);
        const token = getCurrentToken();
        console.log('🔑 Current FCM Token:', token);
        clearTimeout(timeout);
        setFirebaseInitialized(true);
      } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        clearTimeout(timeout);
        // Still set to true to allow app to load even if Firebase fails
        setFirebaseInitialized(true);
      }
    };
    initApp();

    return () => clearTimeout(timeout);
  }, [handleNotificationTap]);


  // const onNotificationTap = (data) => {
  //   console.log('Notification tapped with data:', data);

  //   if (data.screen === 'inbox') {
  //     props.navigation.navigate('Screen40');
  //   }
  // };


  if (!firebaseInitialized) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
          {/* Loading screen - Firebase initializing */}
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ActiveIconProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigator navigationRef={navigationRef} />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ActiveIconProvider>
    </QueryClientProvider>
  );

};
export default App;
