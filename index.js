/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';

// Suppress Firebase deprecation warnings (harmless, will be addressed in future migration)
// These warnings are from React Native Firebase v23 and don't affect functionality
LogBox.ignoreLogs([
  /This method is deprecated/,
  /React Native Firebase namespaced API/,
  /migrating-to-v22/,
  /Please use `getApp\(\)` instead/,
  /deprecated.*Firebase/,
]);

// Also suppress console.warn for Firebase deprecation messages
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0]?.toString() || '';
  // Filter out Firebase deprecation warnings
  if (
    message.includes('deprecated') &&
    (message.includes('React Native Firebase') || 
     message.includes('namespaced API') ||
     message.includes('migrating-to-v22') ||
     message.includes('getApp()'))
  ) {
    return; // Suppress this warning
  }
  originalWarn.apply(console, args);
};

// ✅ CRITICAL: Initialize Firebase FIRST, before importing App component
// This ensures Firebase is ready before any screen components try to use it
console.log('Initializing Firebase before loading App...');
try {
  const { initializeApp, getApps } = require('@react-native-firebase/app');
  const firebaseConfig = {
    apiKey: "AIzaSyDzI3S7RcGRaFBBzAd70ZnTKKcJvKf-rsM",
    authDomain: "deaf-matrimonial-bed02.firebaseapp.com",
    databaseURL: "https://deaf-matrimonial-bed02-default-rtdb.firebaseio.com/",
    projectId: "deaf-matrimonial-bed02",
    storageBucket: "deafmatrimonial-d8ffd.firebasestorage.ap",
    messagingSenderId: "744077823025",
    appId: "1:744077823025:android:80069e3216e3e5a80c1910",
  };
  
  // Initialize Firebase synchronously if not already initialized
  // Note: initializeApp is synchronous in React Native Firebase
  if (getApps().length === 0) {
    initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized synchronously in index.js');
  } else {
    console.log('✅ Firebase already initialized');
  }
} catch (error) {
  console.warn('⚠️ Firebase initialization in index.js failed:', error.message);
  // Continue anyway - Firebase will be initialized in App.tsx
}

// ✅ CRITICAL: Register the app component AFTER Firebase initialization
// The app registration must happen synchronously and immediately
console.log('Registering app with name:', appName);

// Import App - if it fails, we'll catch it and show an error screen
let App;
let appLoadError = null;
try {
  App = require('./App').default;
} catch (error) {
  appLoadError = error;
  console.error('❌ Failed to load App component:', error.message);
  // Create a minimal fallback app that shows the error
  const React = require('react');
  const { View, Text } = require('react-native');
  App = () => {
    const errorMessage = appLoadError ? appLoadError.message : 'Unknown error';
    return React.createElement(View, { 
      style: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20, 
        backgroundColor: '#fff' 
      } 
    },
      React.createElement(Text, { 
        style: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#000' } 
      }, 'App Loading Error'),
      React.createElement(Text, { 
        style: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 10 } 
      }, errorMessage),
      React.createElement(Text, { 
        style: { fontSize: 12, color: '#999', textAlign: 'center' } 
      }, 'Check Metro bundler and device logs for details.')
    );
  };
}

// Register immediately - this must happen no matter what
AppRegistry.registerComponent(appName, () => App);
console.log('✅ App registered successfully with name:', appName);
