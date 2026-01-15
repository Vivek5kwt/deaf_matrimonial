import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
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
import Screen33 from "./src/screens/view/chat/RecentScreen.tsx" //chat live screen
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

// Fallback error component
const ErrorScreen = ({ screenName }) => {
  const { View, Text } = require('react-native');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>
        Screen Error
      </Text>
      <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
        Screen "{screenName}" failed to load. Check console for details.
      </Text>
    </View>
  );
};

// Helper function to validate and wrap components
const validateComponent = (Component, screenName) => {
  // CRITICAL: Check for undefined/null first
  if (Component === undefined || Component === null) {
    console.error(`❌❌❌ Component for screen "${screenName}" is ${Component === undefined ? 'undefined' : 'null'}!`);
    console.error(`   This will cause "Element type is invalid" error.`);
    console.error(`   Check the import statement for ${screenName}`);
    return (props) => <ErrorScreen screenName={screenName} />;
  }
  
  // Check if it's a promise (thenable) - this is CRITICAL
  if (typeof Component.then === 'function') {
    console.error(`❌❌❌ Component for screen "${screenName}" is a promise (thenable). This is not supported!`);
    console.error(`   Components must be loaded synchronously, not via promises.`);
    return (props) => <ErrorScreen screenName={screenName} />;
  }
  
  if (typeof Component !== 'function' && typeof Component !== 'object') {
    console.error(`❌ Component for screen "${screenName}" is invalid type:`, typeof Component);
    return (props) => <ErrorScreen screenName={screenName} />;
  }
  
  // Final check: ensure it's not undefined after all checks
  if (Component === undefined || Component === null) {
    console.error(`❌❌❌ Component for screen "${screenName}" became undefined after validation!`);
    return (props) => <ErrorScreen screenName={screenName} />;
  }
  
  return Component;
};

// Validate all screen components
const validatedScreens = {
  Screen1: validateComponent(Screen1, 'Screen1'),
  Screen2: validateComponent(Screen2, 'Screen2'),
  Screen3: validateComponent(Screen3, 'Screen3'),
  Screen4: validateComponent(Screen4, 'Screen4'),
  Screen5: validateComponent(Screen5, 'Screen5'),
  Screen6: validateComponent(Screen6, 'Screen6'),
  Screen7: validateComponent(Screen7, 'Screen7'),
  Screen8: validateComponent(Screen8, 'Screen8'),
  Screen9: validateComponent(Screen9, 'Screen9'),
  Screen10: validateComponent(Screen10, 'Screen10'),
  Screen11: validateComponent(Screen11, 'Screen11'),
  Screen12: validateComponent(Screen12, 'Screen12'),
  Screen13: validateComponent(Screen13, 'Screen13'),
  Screen14: validateComponent(Screen14, 'Screen14'),
  Screen15: validateComponent(Screen15, 'Screen15'),
  Screen16: validateComponent(Screen16, 'Screen16'),
  Screen17: validateComponent(Screen17, 'Screen17'),
  Screen21: validateComponent(Screen21, 'Screen21'),
  Screen26: validateComponent(Screen26, 'Screen26'),
  Screen27: validateComponent(Screen27, 'Screen27'),
  Screen28: validateComponent(Screen28, 'Screen28'),
  Screen29: validateComponent(Screen29, 'Screen29'),
  Screen30: validateComponent(Screen30, 'Screen30'),
  Screen32: validateComponent(Screen32, 'Screen32'),
  Screen33: validateComponent(Screen33, 'Screen33'),
  Screen34: validateComponent(Screen34, 'Screen34'),
  Screen35: validateComponent(Screen35, 'Screen35'),
  Screen36: validateComponent(Screen36, 'Screen36'),
  Screen37: validateComponent(Screen37, 'Screen37'),
  Screen38: validateComponent(Screen38, 'Screen38'),
  Screen39: validateComponent(Screen39, 'Screen39'),
  Screen40: validateComponent(Screen40, 'Screen40'),
  Screen41: validateComponent(Screen41, 'Screen41'),
  Screen42: validateComponent(Screen42, 'Screen42'),
  Screen43: validateComponent(Screen43, 'Screen43'),
  Screen44: validateComponent(Screen44, 'Screen44'),
  Screen45: validateComponent(Screen45, 'Screen45'),
  Screen46: validateComponent(Screen46, 'Screen46'),
  Screen47: validateComponent(Screen47, 'Screen47'),
  Screen48: validateComponent(Screen48, 'Screen48'),
  Screen50: validateComponent(Screen50, 'Screen50'),
  Screen51: validateComponent(Screen51, 'Screen51'),
  Screen52: validateComponent(Screen52, 'Screen52'),
  Screen53: validateComponent(Screen53, 'Screen53'),
  Screen54: validateComponent(Screen54, 'Screen54'),
  Screen56: validateComponent(Screen56, 'Screen56'),
  Screen57: validateComponent(Screen57, 'Screen57'),
  Screen58: validateComponent(Screen58, 'Screen58'),
  Screen59: validateComponent(Screen59, 'Screen59'),
  Screen60: validateComponent(Screen60, 'Screen60'),
  Screen61: validateComponent(Screen61, 'Screen61'),
  Screen62: validateComponent(Screen62, 'Screen62'),
  Screen63: validateComponent(Screen63, 'Screen63'),
  Screen64: validateComponent(Screen64, 'Screen64'),
  Screen65: validateComponent(Screen65, 'Screen65'),
  Screen66: validateComponent(Screen66, 'Screen66'),
  Screen67: validateComponent(Screen67, 'Screen67'),
  Screen68: validateComponent(Screen68, 'Screen68'),
  Screen69: validateComponent(Screen69, 'Screen69'),
  Screen70: validateComponent(Screen70, 'Screen70'),
  SearchResultsScreen: validateComponent(SearchResultsScreen, 'SearchResultsScreen'),
  AddSuccessStoryScreen: validateComponent(AddSuccessStoryScreen, 'AddSuccessStoryScreen'),
  SuccessStoriesScreen: validateComponent(SuccessStoriesScreen, 'SuccessStoriesScreen'),
  NotificationBell: validateComponent(NotificationBell, 'NotificationBell'),
  CCAvenuePaymentScreen: validateComponent(CCAvenuePaymentScreen, 'CCAvenuePaymentScreen'),
  PaymentStatusScreen: validateComponent(PaymentStatusScreen, 'PaymentStatusScreen'),
  PaymentErrorScreen: validateComponent(PaymentErrorScreen, 'PaymentErrorScreen'),
};

// Wrapper component to ensure route.params is always an object
const withSafeRouteParams = (Component) => {
  // CRITICAL: Ensure Component is valid before wrapping
  if (!Component) {
    console.error('withSafeRouteParams: Component is undefined/null!');
    return (props) => <ErrorScreen screenName={props?.route?.name || 'Unknown'} />;
  }
  
  if (typeof Component !== 'function' && typeof Component !== 'object') {
    console.error('withSafeRouteParams: Invalid component type:', typeof Component, Component);
    return (props) => <ErrorScreen screenName={props?.route?.name || 'Unknown'} />;
  }
  
  // Check if it's a promise (thenable)
  if (Component && typeof Component.then === 'function') {
    console.error('withSafeRouteParams: Component is a promise (thenable). Not supported.');
    return (props) => <ErrorScreen screenName={props?.route?.name || 'Unknown'} />;
  }
  
  const WrappedComponent = (props) => {
    try {
      // Double-check Component is still valid
      if (!Component || (typeof Component !== 'function' && typeof Component !== 'object')) {
        console.error('withSafeRouteParams: Component became invalid during render');
        return <ErrorScreen screenName={props?.route?.name || 'Unknown'} />;
      }
      
      // Ensure route.params is always an object
      const safeProps = {
        ...props,
        route: {
          ...props.route,
          params: props.route?.params && typeof props.route.params === 'object' 
            ? props.route.params 
            : {},
        },
      };
      return React.createElement(Component, safeProps);
    } catch (error) {
      console.error('Error rendering component in withSafeRouteParams:', error);
      return <ErrorScreen screenName={props?.route?.name || 'Unknown'} />;
    }
  };
  
  // Copy displayName for better debugging
  WrappedComponent.displayName = Component?.displayName || Component?.name || 'WrappedComponent';
  
  return WrappedComponent;
};

const AppNavigator = ({ navigationRef }) => (
  <NavigationContainer
    ref={navigationRef}
    linking={{
      prefixes: ['com.deaf.matrimonial'], // Your app's URL scheme
      config: {
        screens: {
          Screen40: 'inbox', // Map URL path to screen
        },
      },
    }}
  >

    <Stack.Navigator
      initialRouteName="Screen1"
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="Screen1" 
        component={(() => {
          const comp = validatedScreens.Screen1;
          if (!comp || (typeof comp !== 'function' && typeof comp !== 'object')) {
            console.error('Screen1 component is invalid after validation!', comp);
            return (props) => <ErrorScreen screenName="Screen1" />;
          }
          return withSafeRouteParams(comp);
        })()} 
        options={{ headerShown: false }}
        initialParams={{}}
      />
      <Stack.Screen name="Screen2" component={validatedScreens.Screen2} options={{ headerShown: false }} />
      <Stack.Screen name="Screen3" component={validatedScreens.Screen3} options={{ headerShown: false }} />
      <Stack.Screen name="Screen4" component={validatedScreens.Screen4} options={{ headerShown: false }} />
      <Stack.Screen name="Screen5" component={validatedScreens.Screen5} options={{ headerShown: false }} />
      <Stack.Screen name="Screen6" component={validatedScreens.Screen6} options={{ headerShown: false }} />
      <Stack.Screen name="Screen7" component={validatedScreens.Screen7} options={{ headerShown: false }} />
      <Stack.Screen name="Screen8" component={validatedScreens.Screen8} options={{ headerShown: false }} />
      <Stack.Screen name="Screen9" component={validatedScreens.Screen9} options={{ headerShown: false }} />
      <Stack.Screen name="Screen10" component={validatedScreens.Screen10} options={{ headerShown: false }} />
      <Stack.Screen name="Screen11" component={validatedScreens.Screen11} options={{ headerShown: false }} />
      <Stack.Screen name="Screen12" component={validatedScreens.Screen12} options={{ headerShown: false }} />
      <Stack.Screen name="Screen13" component={validatedScreens.Screen13} options={{ headerShown: false }} />
      <Stack.Screen name="Screen14" component={validatedScreens.Screen14} options={{ headerShown: false }} />
      <Stack.Screen name="Screen15" component={validatedScreens.Screen15} options={{ headerShown: false }} />
      <Stack.Screen name="Screen16" component={validatedScreens.Screen16} options={{ headerShown: false }} />
      <Stack.Screen name="Screen17" component={validatedScreens.Screen17} options={{ headerShown: false }} />
      <Stack.Screen name="Screen21" component={validatedScreens.Screen21} options={{ headerShown: false }} />
      <Stack.Screen name="Screen26" component={validatedScreens.Screen26} options={{ headerShown: false }} />
      <Stack.Screen name="Screen27" component={validatedScreens.Screen27} options={{ headerShown: false }} />
      <Stack.Screen name="Screen28" component={validatedScreens.Screen28} options={{ headerShown: false }} />
      <Stack.Screen name="Screen29" component={validatedScreens.Screen29} options={{ headerShown: false }} />
      <Stack.Screen name="Screen30" component={validatedScreens.Screen30} options={{ headerShown: false }} />
      <Stack.Screen name="Screen32" component={validatedScreens.Screen32} options={{ headerShown: false }} />
      <Stack.Screen name="Screen33" component={validatedScreens.Screen33} options={{ headerShown: false }} />
      <Stack.Screen name="Screen34" component={validatedScreens.Screen34} options={{ headerShown: false }} />
      <Stack.Screen name="Screen35" component={validatedScreens.Screen35} options={{ headerShown: false }} />
      <Stack.Screen name="Screen36" component={validatedScreens.Screen36} options={{ headerShown: false }} />
      <Stack.Screen name="Screen37" component={validatedScreens.Screen37} options={{ headerShown: false }} />
      <Stack.Screen name="Screen38" component={validatedScreens.Screen38} options={{ headerShown: false }} />
      <Stack.Screen name="Screen39" component={validatedScreens.Screen39} options={{ headerShown: false }} />
      <Stack.Screen name="Screen40" component={validatedScreens.Screen40} options={{ headerShown: false }} />
      <Stack.Screen name="Screen41" component={validatedScreens.Screen41} options={{ headerShown: false }} />
      <Stack.Screen name="Screen42" component={validatedScreens.Screen42} options={{ headerShown: false }} />
      <Stack.Screen name="Screen43" component={validatedScreens.Screen43} options={{ headerShown: false }} />
      <Stack.Screen name="Screen44" component={validatedScreens.Screen44} options={{ headerShown: false }} />
      <Stack.Screen name="Screen45" component={validatedScreens.Screen45} options={{ headerShown: false }} />
      <Stack.Screen name="Screen46" component={validatedScreens.Screen46} options={{ headerShown: false }} />
      <Stack.Screen name="Screen47" component={validatedScreens.Screen47} options={{ headerShown: false }} />
      <Stack.Screen name="Screen48" component={validatedScreens.Screen48} options={{ headerShown: false }} />
      <Stack.Screen name="Screen50" component={validatedScreens.Screen50} options={{ headerShown: false }} />
      <Stack.Screen name="Screen51" component={validatedScreens.Screen51} options={{ headerShown: false }} />
      <Stack.Screen name="Screen52" component={validatedScreens.Screen52} options={{ headerShown: false }} />
      <Stack.Screen name="Screen53" component={validatedScreens.Screen53} options={{ headerShown: false }} />
      <Stack.Screen name="Screen54" component={validatedScreens.Screen54} options={{ headerShown: false }} />
      <Stack.Screen name="Screen56" component={validatedScreens.Screen56} options={{ headerShown: false }} />
      <Stack.Screen name="Screen57" component={validatedScreens.Screen57} options={{ headerShown: false }} />
      <Stack.Screen name="Screen58" component={validatedScreens.Screen58} options={{ headerShown: false }} />
      <Stack.Screen name="Screen59" component={validatedScreens.Screen59} options={{ headerShown: false }} />
      <Stack.Screen name="Screen60" component={validatedScreens.Screen60} options={{ headerShown: false }} />
      <Stack.Screen name="Screen61" component={validatedScreens.Screen61} options={{ headerShown: false }} />
      <Stack.Screen name="Screen62" component={validatedScreens.Screen62} options={{ headerShown: false }} />
      <Stack.Screen name="Screen63" component={validatedScreens.Screen63} options={{ headerShown: false }} />
      <Stack.Screen name="Screen64" component={validatedScreens.Screen64} options={{ headerShown: false }} />
      <Stack.Screen name="Screen65" component={validatedScreens.Screen65} options={{ headerShown: false }} />
      <Stack.Screen name="Screen66" component={validatedScreens.Screen66} options={{ headerShown: false }} />
      <Stack.Screen name="Screen67" component={validatedScreens.Screen67} options={{ headerShown: false }} />
      <Stack.Screen name="Screen68" component={validatedScreens.Screen68} options={{ headerShown: false }} />
      <Stack.Screen name="Screen69" component={validatedScreens.Screen69} options={{ headerShown: false }} />
      <Stack.Screen name="Screen70" component={validatedScreens.Screen70} options={{ headerShown: false }} />
      <Stack.Screen name="SearchResultsScreen" component={validatedScreens.SearchResultsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SuccessStories" component={validatedScreens.SuccessStoriesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddSuccessStory" component={validatedScreens.AddSuccessStoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationBell" component={validatedScreens.NotificationBell} options={{ headerShown: false }} />
      <Stack.Screen name="CCAvenuePaymentScreen" component={validatedScreens.CCAvenuePaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentStatusScreen" component={validatedScreens.PaymentStatusScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentErrorScreen" component={validatedScreens.PaymentErrorScreen} options={{ headerShown: false }} /> 


    </Stack.Navigator>
  </NavigationContainer>
);

const App = (props) => {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const navigationRef = React.useRef<NavigationContainerRef<any>>(null);


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
