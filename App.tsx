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

const resolveComponent = (Component) => {
  return Component?.default ?? Component;
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
  try {
    const resolved = resolveComponent(component, screenName);
    if (!resolved) {
      console.error(`❌❌❌ CRITICAL: Component for "${screenName}" is ${resolved === undefined ? 'undefined' : 'null'} when creating Stack.Screen!`);
      console.error(`   Original component:`, component);
      return (props) => <ErrorScreen screenName={screenName} />;
    }
    if (!isValidComponentType(resolved)) {
      console.error(`❌❌❌ CRITICAL: Component for "${screenName}" is not a valid React component.`);
      console.error(`   Type: ${typeof resolved}`);
      console.error(`   Value:`, resolved);
      return (props) => <ErrorScreen screenName={screenName} />;
    }
    // Wrap component to catch render errors
    const WrappedComponent = (props) => {
      try {
        if (!resolved) {
          console.error(`❌❌❌ Component "${screenName}" became undefined during render!`);
          return <ErrorScreen screenName={screenName} />;
        }
        return React.createElement(resolved, props);
      } catch (error) {
        console.error(`❌❌❌ Error rendering screen "${screenName}":`, error);
        return <ErrorScreen screenName={screenName} />;
      }
    };
    WrappedComponent.displayName = `Wrapped(${screenName})`;
    return WrappedComponent;
  } catch (error) {
    console.error(`❌❌❌ Error validating component "${screenName}":`, error);
    return (props) => <ErrorScreen screenName={screenName} />;
  }
};

const AppNavigator = ({ navigationRef }) => {
  // CRITICAL: Validate all components before rendering
  console.log('🔍🔍🔍 RUNTIME VALIDATION: Checking all screen components...');
  const screenNames = Object.keys(validatedScreens);
  let hasInvalidComponents = false;
  const invalidScreens: string[] = [];
  screenNames.forEach(name => {
    const comp = validatedScreens[name];
    if (comp === undefined || comp === null) {
      console.error(`❌❌❌ CRITICAL: Screen "${name}" is ${comp === undefined ? 'undefined' : 'null'}!`);
      console.error(`   This WILL cause "Element type is invalid" error!`);
      console.error(`   Stack trace:`, new Error().stack);
      invalidScreens.push(name);
      hasInvalidComponents = true;
    } else if (!isValidComponentType(comp)) {
      console.error(`❌❌❌ CRITICAL: Screen "${name}" is not a valid React component.`);
      console.error(`   Type: ${typeof comp}`);
      console.error(`   Value:`, comp);
      invalidScreens.push(name);
      hasInvalidComponents = true;
    } else if (typeof comp.then === 'function') {
      console.error(`❌❌❌ CRITICAL: Screen "${name}" is a promise (thenable)!`);
      console.error(`   Components must be loaded synchronously!`);
      invalidScreens.push(name);
      hasInvalidComponents = true;
    }
  });
  
  if (hasInvalidComponents) {
    console.error('❌❌❌ CRITICAL: One or more screen components are invalid!');
    console.error(`   Invalid screens: ${invalidScreens.join(', ')}`);
    console.error('   The app may crash with "Element type is invalid" error.');
    console.error('   Check the console above to see which screens are problematic.');
  } else {
    console.log('✅✅✅ All screen components validated successfully!');
  }

  // Pre-compute all screen components to avoid IIFE issues
  // Use Record type with explicit assertion to ensure TypeScript recognizes all properties
  const screenComponents = {} as Record<string, React.ComponentType<any>>;
  screenNames.forEach(name => {
    try {
      const comp = ensureValidComponent(validatedScreens[name], name);
      if (comp && (typeof comp === 'function' || typeof comp === 'object')) {
        screenComponents[name] = comp;
      } else {
        console.error(`❌ Failed to create component for "${name}", using ErrorScreen`);
        screenComponents[name] = (props: any) => <ErrorScreen screenName={name} />;
      }
    } catch (error) {
      console.error(`❌ Error creating component for "${name}":`, error);
      screenComponents[name] = (props: any) => <ErrorScreen screenName={name} />;
    }
  });
  
  // Handle special screen name mappings
  screenComponents.SuccessStories = screenComponents.SuccessStoriesScreen || ((props: any) => <ErrorScreen screenName="SuccessStories" />);
  screenComponents.AddSuccessStory = screenComponents.AddSuccessStoryScreen || ((props: any) => <ErrorScreen screenName="AddSuccessStory" />);
  
  // Helper function to get component with proper typing and validation
  const getScreenComponent = (name: string): React.ComponentType<any> => {
    const component = screenComponents[name];
    if (!component || component === undefined || component === null) {
      console.error(`❌❌❌ CRITICAL: Component "${name}" is ${component === undefined ? 'undefined' : component === null ? 'null' : 'falsy'}!`);
      console.error(`   Available keys:`, Object.keys(screenComponents));
      console.error(`   Stack trace:`, new Error().stack);
      // Return a valid component that will render an error screen
      const ErrorComponent = (props: any) => <ErrorScreen screenName={name} />;
      ErrorComponent.displayName = `ErrorScreen(${name})`;
      return ErrorComponent;
    }
    if (typeof component !== 'function' && typeof component !== 'object') {
      console.error(`❌❌❌ CRITICAL: Component "${name}" is not a valid React component. Type: ${typeof component}`);
      const ErrorComponent = (props: any) => <ErrorScreen screenName={name} />;
      ErrorComponent.displayName = `ErrorScreen(${name})`;
      return ErrorComponent;
    }
    // Double-check it's still valid
    if (component === undefined || component === null) {
      console.error(`❌❌❌ CRITICAL: Component "${name}" became invalid after validation!`);
      const ErrorComponent = (props: any) => <ErrorScreen screenName={name} />;
      ErrorComponent.displayName = `ErrorScreen(${name})`;
      return ErrorComponent;
    }
    return component;
  };
  
  // Log all screen components for debugging and validate they're all defined
  console.log('📋 Screen components initialized:', Object.keys(screenComponents).length);
  const undefinedScreens: string[] = [];
  Object.keys(screenComponents).forEach(name => {
    const comp = screenComponents[name];
    if (!comp || comp === undefined || comp === null) {
      console.error(`❌ Screen "${name}" is invalid:`, comp);
      undefinedScreens.push(name);
    }
  });
  if (undefinedScreens.length > 0) {
    console.error(`❌❌❌ CRITICAL: ${undefinedScreens.length} screens are undefined:`, undefinedScreens);
  }
  
  // Validate all required screens exist before rendering
  const requiredScreens = ['Screen1', 'Screen2', 'Screen3'];
  requiredScreens.forEach(name => {
    if (!screenComponents[name]) {
      console.error(`❌❌❌ CRITICAL: Required screen "${name}" is missing!`);
      screenComponents[name] = (props: any) => <ErrorScreen screenName={name} />;
    }
  });

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
        component={screenComponents['Screen1'] || ((props: any) => <ErrorScreen screenName="Screen1" />)}
        options={{ headerShown: false }}
        initialParams={{}}
      />
      {/* CRITICAL: Use pre-computed components directly, not through function calls */}
      <Stack.Screen name="Screen2" component={screenComponents['Screen2'] || ((props: any) => <ErrorScreen screenName="Screen2" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen3" component={screenComponents['Screen3'] || ((props: any) => <ErrorScreen screenName="Screen3" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen4" component={screenComponents['Screen4'] || ((props: any) => <ErrorScreen screenName="Screen4" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen5" component={screenComponents['Screen5'] || ((props: any) => <ErrorScreen screenName="Screen5" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen6" component={screenComponents['Screen6'] || ((props: any) => <ErrorScreen screenName="Screen6" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen7" component={screenComponents['Screen7'] || ((props: any) => <ErrorScreen screenName="Screen7" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen8" component={screenComponents['Screen8'] || ((props: any) => <ErrorScreen screenName="Screen8" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen9" component={screenComponents['Screen9'] || ((props: any) => <ErrorScreen screenName="Screen9" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen10" component={screenComponents['Screen10'] || ((props: any) => <ErrorScreen screenName="Screen10" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen11" component={screenComponents['Screen11'] || ((props: any) => <ErrorScreen screenName="Screen11" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen12" component={screenComponents['Screen12'] || ((props: any) => <ErrorScreen screenName="Screen12" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen13" component={screenComponents['Screen13'] || ((props: any) => <ErrorScreen screenName="Screen13" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen14" component={screenComponents['Screen14'] || ((props: any) => <ErrorScreen screenName="Screen14" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen15" component={screenComponents['Screen15'] || ((props: any) => <ErrorScreen screenName="Screen15" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen16" component={screenComponents['Screen16'] || ((props: any) => <ErrorScreen screenName="Screen16" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen17" component={screenComponents['Screen17'] || ((props: any) => <ErrorScreen screenName="Screen17" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen21" component={screenComponents['Screen21'] || ((props: any) => <ErrorScreen screenName="Screen21" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen26" component={screenComponents['Screen26'] || ((props: any) => <ErrorScreen screenName="Screen26" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen27" component={screenComponents['Screen27'] || ((props: any) => <ErrorScreen screenName="Screen27" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen28" component={screenComponents['Screen28'] || ((props: any) => <ErrorScreen screenName="Screen28" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen29" component={screenComponents['Screen29'] || ((props: any) => <ErrorScreen screenName="Screen29" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen30" component={screenComponents['Screen30'] || ((props: any) => <ErrorScreen screenName="Screen30" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen32" component={screenComponents['Screen32'] || ((props: any) => <ErrorScreen screenName="Screen32" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen33" component={screenComponents['Screen33'] || ((props: any) => <ErrorScreen screenName="Screen33" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen34" component={screenComponents['Screen34'] || ((props: any) => <ErrorScreen screenName="Screen34" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen35" component={screenComponents['Screen35'] || ((props: any) => <ErrorScreen screenName="Screen35" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen36" component={screenComponents['Screen36'] || ((props: any) => <ErrorScreen screenName="Screen36" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen37" component={screenComponents['Screen37'] || ((props: any) => <ErrorScreen screenName="Screen37" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen38" component={screenComponents['Screen38'] || ((props: any) => <ErrorScreen screenName="Screen38" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen39" component={screenComponents['Screen39'] || ((props: any) => <ErrorScreen screenName="Screen39" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen40" component={screenComponents['Screen40'] || ((props: any) => <ErrorScreen screenName="Screen40" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen41" component={screenComponents['Screen41'] || ((props: any) => <ErrorScreen screenName="Screen41" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen42" component={screenComponents['Screen42'] || ((props: any) => <ErrorScreen screenName="Screen42" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen43" component={screenComponents['Screen43'] || ((props: any) => <ErrorScreen screenName="Screen43" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen44" component={screenComponents['Screen44'] || ((props: any) => <ErrorScreen screenName="Screen44" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen45" component={screenComponents['Screen45'] || ((props: any) => <ErrorScreen screenName="Screen45" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen46" component={screenComponents['Screen46'] || ((props: any) => <ErrorScreen screenName="Screen46" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen47" component={screenComponents['Screen47'] || ((props: any) => <ErrorScreen screenName="Screen47" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen48" component={screenComponents['Screen48'] || ((props: any) => <ErrorScreen screenName="Screen48" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen50" component={screenComponents['Screen50'] || ((props: any) => <ErrorScreen screenName="Screen50" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen51" component={screenComponents['Screen51'] || ((props: any) => <ErrorScreen screenName="Screen51" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen52" component={screenComponents['Screen52'] || ((props: any) => <ErrorScreen screenName="Screen52" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen53" component={screenComponents['Screen53'] || ((props: any) => <ErrorScreen screenName="Screen53" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen54" component={screenComponents['Screen54'] || ((props: any) => <ErrorScreen screenName="Screen54" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen56" component={screenComponents['Screen56'] || ((props: any) => <ErrorScreen screenName="Screen56" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen57" component={screenComponents['Screen57'] || ((props: any) => <ErrorScreen screenName="Screen57" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen58" component={screenComponents['Screen58'] || ((props: any) => <ErrorScreen screenName="Screen58" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen59" component={screenComponents['Screen59'] || ((props: any) => <ErrorScreen screenName="Screen59" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen60" component={screenComponents['Screen60'] || ((props: any) => <ErrorScreen screenName="Screen60" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen61" component={screenComponents['Screen61'] || ((props: any) => <ErrorScreen screenName="Screen61" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen62" component={screenComponents['Screen62'] || ((props: any) => <ErrorScreen screenName="Screen62" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen63" component={screenComponents['Screen63'] || ((props: any) => <ErrorScreen screenName="Screen63" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen64" component={screenComponents['Screen64'] || ((props: any) => <ErrorScreen screenName="Screen64" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen65" component={screenComponents['Screen65'] || ((props: any) => <ErrorScreen screenName="Screen65" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen66" component={screenComponents['Screen66'] || ((props: any) => <ErrorScreen screenName="Screen66" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen67" component={screenComponents['Screen67'] || ((props: any) => <ErrorScreen screenName="Screen67" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen68" component={screenComponents['Screen68'] || ((props: any) => <ErrorScreen screenName="Screen68" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen69" component={screenComponents['Screen69'] || ((props: any) => <ErrorScreen screenName="Screen69" />)} options={{ headerShown: false }} />
      <Stack.Screen name="Screen70" component={screenComponents['Screen70'] || ((props: any) => <ErrorScreen screenName="Screen70" />)} options={{ headerShown: false }} />
      <Stack.Screen name="SearchResultsScreen" component={screenComponents['SearchResultsScreen'] || ((props: any) => <ErrorScreen screenName="SearchResultsScreen" />)} options={{ headerShown: false }} />
      <Stack.Screen name="SuccessStories" component={screenComponents['SuccessStoriesScreen'] || ((props: any) => <ErrorScreen screenName="SuccessStories" />)} options={{ headerShown: false }} />
      <Stack.Screen name="AddSuccessStory" component={screenComponents['AddSuccessStoryScreen'] || ((props: any) => <ErrorScreen screenName="AddSuccessStory" />)} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationBell" component={screenComponents['NotificationBell'] || ((props: any) => <ErrorScreen screenName="NotificationBell" />)} options={{ headerShown: false }} />
      <Stack.Screen name="CCAvenuePaymentScreen" component={screenComponents['CCAvenuePaymentScreen'] || ((props: any) => <ErrorScreen screenName="CCAvenuePaymentScreen" />)} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentStatusScreen" component={screenComponents['PaymentStatusScreen'] || ((props: any) => <ErrorScreen screenName="PaymentStatusScreen" />)} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentErrorScreen" component={screenComponents['PaymentErrorScreen'] || ((props: any) => <ErrorScreen screenName="PaymentErrorScreen" />)} options={{ headerShown: false }} /> 


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