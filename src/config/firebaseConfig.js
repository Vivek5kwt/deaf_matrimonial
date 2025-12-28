import { initializeApp, getApps } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const firebaseConfig = {
  apiKey: "AIzaSyDzI3S7RcGRaFBBzAd70ZnTKKcJvKf-rsM",
  authDomain: "deaf-matrimonial-bed02.firebaseapp.com",
  databaseURL: "https://deaf-matrimonial-bed02-default-rtdb.firebaseio.com/",
  projectId: "deaf-matrimonial-bed02",
  storageBucket: "deafmatrimonial-d8ffd.firebasestorage.ap",
  messagingSenderId: "744077823025",
  appId: "1:744077823025:android:80069e3216e3e5a80c1910",
  
};

export const initFirebase = async () => {
  if (getApps().length === 0) {
    await initializeApp(firebaseConfig);
    console.log("Firebase initialized");
  }

  GoogleSignin.configure({
    webClientId: '744077823025-m8n02omtopu1ph2j34rnonqt7h845n6u.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });

  return auth();
};
