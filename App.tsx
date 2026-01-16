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

// CRITICAL: Validate all imports immediately to catch undefined components
console.log('🔍🔍🔍 IMMEDIATE IMPORT VALIDATION: Checking all screen imports...');
const allScreenImports = {
  Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10,
  Screen11, Screen12, Screen13, Screen14, Screen15, Screen16, Screen17, Screen21, Screen26,
  Screen27, Screen28, Screen29, Screen30, Screen32, Screen33, Screen34, Screen35, Screen36,
  Screen37, Screen38, Screen39, Screen40, Screen41, Screen42, Screen43, Screen44, Screen45,
  Screen46, Screen47, Screen48, Screen50, Screen51, Screen52, Screen53, Screen54, Screen56,
  Screen57, Screen58, Screen59, Screen60, Screen61, Screen62, Screen63, Screen64, Screen65,
  Screen66, Screen67, Screen68, Screen69, Screen70,
  SearchResultsScreen, AddSuccessStoryScreen, SuccessStoriesScreen, NotificationBell,
  CCAvenuePaymentScreen, PaymentStatusScreen, PaymentErrorScreen
};

let hasUndefinedImports = false;
Object.keys(allScreenImports).forEach(name => {
  const comp = allScreenImports[name];
  if (comp === undefined) {
    console.error(`❌❌❌ CRITICAL: Import "${name}" is UNDEFINED!`);
    console.error(`   This WILL cause "Element type is invalid" error!`);
    console.error(`   Check the file: ${name === 'Screen1' ? './src/screens/view/onboardings/saplash' : '...'}`);
    hasUndefinedImports = true;
  } else if (comp === null) {
    console.error(`❌❌❌ CRITICAL: Import "${name}" is NULL!`);
    hasUndefinedImports = true;
  } else if (typeof comp.then === 'function') {
    console.error(`❌❌❌ CRITICAL: Import "${name}" is a PROMISE (thenable)!`);
    console.error(`   Components must be loaded synchronously!`);
    hasUndefinedImports = true;
  }
});

if (hasUndefinedImports) {
  console.error('❌❌❌ CRITICAL: One or more screen imports are invalid!');
  console.error('   The app WILL crash with "Element type is invalid" error.');
  console.error('   Fix the imports above before continuing.');
} else {
  console.log('✅✅✅ All screen imports validated successfully!');
}

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

const resolveComponent = (Component, screenName) => {
  if (Component && typeof Component === 'object' && Component.default) {
    const resolved = Component.default?.default ?? Component.default;
    if (resolved) {
      console.warn(`⚠️ Screen "${screenName}" imported as a module object. Using default export instead.`);
      return resolved;
    }
  }
  return Component;
};

const isValidComponentType = (Component) => {
  if (!Component) return false;
  if (typeof Component === 'function') return true;
  if (typeof Component === 'object') {
    return Boolean(
      Component.$$typeof ||
      Component.render ||
      Component.prototype?.isReactComponent
    );
  }
  return false;
};

// Helper function to validate and wrap components
const validateComponent = (Component, screenName) => {
  const ResolvedComponent = resolveComponent(Component, screenName);
  // CRITICAL: Check for undefined/null first
  if (ResolvedComponent === undefined || ResolvedComponent === null) {
    console.error(`❌❌❌ Component for screen "${screenName}" is ${ResolvedComponent === undefined ? 'undefined' : 'null'}!`);
    console.error(`   This will cause "Element type is invalid" error.`);
    console.error(`   Check the import statement for ${screenName}`);
    return (props) => <ErrorScreen screenName={screenName} />;
  }
  
  // Check if it's a promise (thenable) - this is CRITICAL
  if (typeof ResolvedComponent.then === 'function') {
    console.error(`❌❌❌ Component for screen "${screenName}" is a promise (thenable). This is not supported!`);
    console.error(`   Components must be loaded synchronously, not via promises.`);
    return (props) => <ErrorScreen screenName={screenName} />;
  }

  if (!isValidComponentType(ResolvedComponent)) {
    console.error(`❌ Component for screen "${screenName}" is not a valid React component.`);
    console.error(`   Type: ${typeof ResolvedComponent}`);
    return (props) => <ErrorScreen screenName={screenName} />;
  }
  
  // Final check: ensure it's not undefined after all checks
  if (ResolvedComponent === undefined || ResolvedComponent === null) {
    console.error(`❌❌❌ Component for screen "${screenName}" became undefined after validation!`);
    return (props) => <ErrorScreen screenName={screenName} />;
  }
  
  return ResolvedComponent;
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

// Helper to ensure component is never undefined when passed to Stack.Screen
const ensureValidComponent = (component, screenName) => {
  const resolved = resolveComponent(component, screenName);
  if (!resolved) {
    console.error(`❌❌❌ CRITICAL: Component for "${screenName}" is ${resolved === undefined ? 'undefined' : 'null'} when creating Stack.Screen!`);
    return (props) => <ErrorScreen screenName={screenName} />;
  }
  if (!isValidComponentType(resolved)) {
    console.error(`❌❌❌ CRITICAL: Component for "${screenName}" is not a valid React component.`);
    console.error(`   Type: ${typeof resolved}`);
    return (props) => <ErrorScreen screenName={screenName} />;
  }
  return resolved;
};

const AppNavigator = ({ navigationRef }) => {
  // CRITICAL: Validate all components before rendering
  console.log('🔍🔍🔍 RUNTIME VALIDATION: Checking all screen components...');
  const screenNames = Object.keys(validatedScreens);
  let hasInvalidComponents = false;
  screenNames.forEach(name => {
    const comp = validatedScreens[name];
    if (comp === undefined || comp === null) {
      console.error(`❌❌❌ CRITICAL: Screen "${name}" is ${comp === undefined ? 'undefined' : 'null'}!`);
      console.error(`   This WILL cause "Element type is invalid" error!`);
      hasInvalidComponents = true;
    } else if (!isValidComponentType(comp)) {
      console.error(`❌❌❌ CRITICAL: Screen "${name}" is not a valid React component.`);
      console.error(`   Type: ${typeof comp}`);
      console.error(`   Value:`, comp);
      hasInvalidComponents = true;
    } else if (typeof comp.then === 'function') {
      console.error(`❌❌❌ CRITICAL: Screen "${name}" is a promise (thenable)!`);
      console.error(`   Components must be loaded synchronously!`);
      hasInvalidComponents = true;
    }
  });
  
  if (hasInvalidComponents) {
    console.error('❌❌❌ CRITICAL: One or more screen components are invalid!');
    console.error('   The app may crash with "Element type is invalid" error.');
    console.error('   Check the console above to see which screens are problematic.');
  } else {
    console.log('✅✅✅ All screen components validated successfully!');
  }

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
          headerBackTitleVisible: false,
        }}
      >
      <Stack.Screen
        name="Screen1"
        component={(() => {
          const comp = ensureValidComponent(validatedScreens.Screen1, 'Screen1');
          return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen1" /> : comp;
        })()}
        options={{ headerShown: false }}
        initialParams={{}}
      />
      {/* CRITICAL: Wrap all screen components with runtime validation */}
      <Stack.Screen name="Screen2" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen2, 'Screen2');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen2" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen3" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen3, 'Screen3');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen3" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen4" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen4, 'Screen4');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen4" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen5" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen5, 'Screen5');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen5" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen6" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen6, 'Screen6');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen6" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen7" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen7, 'Screen7');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen7" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen8" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen8, 'Screen8');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen8" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen9" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen9, 'Screen9');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen9" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen10" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen10, 'Screen10');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen10" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen11" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen11, 'Screen11');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen11" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen12" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen12, 'Screen12');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen12" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen13" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen13, 'Screen13');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen13" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen14" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen14, 'Screen14');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen14" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen15" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen15, 'Screen15');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen15" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen16" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen16, 'Screen16');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen16" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen17" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen17, 'Screen17');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen17" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen21" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen21, 'Screen21');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen21" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen26" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen26, 'Screen26');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen26" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen27" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen27, 'Screen27');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen27" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen28" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen28, 'Screen28');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen28" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen29" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen29, 'Screen29');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen29" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen30" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen30, 'Screen30');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen30" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen32" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen32, 'Screen32');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen32" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen33" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen33, 'Screen33');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen33" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen34" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen34, 'Screen34');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen34" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen35" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen35, 'Screen35');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen35" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen36" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen36, 'Screen36');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen36" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen37" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen37, 'Screen37');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen37" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen38" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen38, 'Screen38');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen38" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen39" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen39, 'Screen39');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen39" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen40" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen40, 'Screen40');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen40" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen41" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen41, 'Screen41');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen41" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen42" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen42, 'Screen42');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen42" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen43" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen43, 'Screen43');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen43" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen44" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen44, 'Screen44');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen44" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen45" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen45, 'Screen45');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen45" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen46" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen46, 'Screen46');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen46" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen47" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen47, 'Screen47');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen47" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen48" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen48, 'Screen48');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen48" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen50" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen50, 'Screen50');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen50" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen51" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen51, 'Screen51');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen51" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen52" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen52, 'Screen52');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen52" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen53" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen53, 'Screen53');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen53" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen54" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen54, 'Screen54');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen54" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen56" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen56, 'Screen56');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen56" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen57" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen57, 'Screen57');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen57" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen58" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen58, 'Screen58');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen58" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen59" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen59, 'Screen59');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen59" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen60" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen60, 'Screen60');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen60" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen61" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen61, 'Screen61');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen61" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen62" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen62, 'Screen62');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen62" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen63" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen63, 'Screen63');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen63" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen64" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen64, 'Screen64');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen64" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen65" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen65, 'Screen65');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen65" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen66" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen66, 'Screen66');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen66" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen67" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen67, 'Screen67');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen67" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen68" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen68, 'Screen68');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen68" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen69" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen69, 'Screen69');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen69" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="Screen70" component={(() => {
        const comp = ensureValidComponent(validatedScreens.Screen70, 'Screen70');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="Screen70" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="SearchResultsScreen" component={(() => {
        const comp = ensureValidComponent(validatedScreens.SearchResultsScreen, 'SearchResultsScreen');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="SearchResultsScreen" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="SuccessStories" component={(() => {
        const comp = ensureValidComponent(validatedScreens.SuccessStoriesScreen, 'SuccessStories');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="SuccessStories" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="AddSuccessStory" component={(() => {
        const comp = ensureValidComponent(validatedScreens.AddSuccessStoryScreen, 'AddSuccessStory');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="AddSuccessStory" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationBell" component={(() => {
        const comp = ensureValidComponent(validatedScreens.NotificationBell, 'NotificationBell');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="NotificationBell" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="CCAvenuePaymentScreen" component={(() => {
        const comp = ensureValidComponent(validatedScreens.CCAvenuePaymentScreen, 'CCAvenuePaymentScreen');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="CCAvenuePaymentScreen" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentStatusScreen" component={(() => {
        const comp = ensureValidComponent(validatedScreens.PaymentStatusScreen, 'PaymentStatusScreen');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="PaymentStatusScreen" /> : comp;
      })()} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentErrorScreen" component={(() => {
        const comp = ensureValidComponent(validatedScreens.PaymentErrorScreen, 'PaymentErrorScreen');
        return comp === undefined || comp === null ? (props) => <ErrorScreen screenName="PaymentErrorScreen" /> : comp;
      })()} options={{ headerShown: false }} /> 


    </Stack.Navigator>
  </NavigationContainer>
  );
};

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