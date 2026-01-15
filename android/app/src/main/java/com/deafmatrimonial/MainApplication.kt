package com.deafmatrimonial

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.facebook.react.shell.MainReactPackage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage
import io.invertase.firebase.auth.ReactNativeFirebaseAuthPackage
import io.invertase.firebase.firestore.ReactNativeFirebaseFirestorePackage
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage
import com.azendoo.reactnativesnackbar.SnackbarPackage
import com.reactnative.ivpusic.imagepicker.PickerPackage
import io.invertase.notifee.NotifeePackage
import com.reactnativecommunity.clipboard.ClipboardPackage
import com.reactnativegooglesignin.RNGoogleSigninPackage
import com.swmansion.gesturehandler.RNGestureHandlerPackage
import com.th3rdwave.safeareacontext.SafeAreaContextPackage
import com.swmansion.rnscreens.RNScreensPackage

class MainApplication : Application(), ReactApplication {

  private val mReactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> {
          // In React Native 0.71, autolinking happens at Gradle level
          // The React Native Gradle plugin automatically adds packages to dependencies
          // We need to return at least the MainReactPackage for core modules
          // Manually add critical packages that aren't being autolinked properly
          val packages = mutableListOf<ReactPackage>()
          packages.add(MainReactPackage())
          // Manually add AsyncStorage package
          packages.add(AsyncStoragePackage())
          // Manually add Firebase App package (required for all Firebase modules)
          packages.add(ReactNativeFirebaseAppPackage())
          // Manually add Firebase Auth package
          packages.add(ReactNativeFirebaseAuthPackage())
          // Manually add Firebase Firestore package
          packages.add(ReactNativeFirebaseFirestorePackage())
          // Manually add Firebase Messaging package
          packages.add(ReactNativeFirebaseMessagingPackage())
          // Manually add Snackbar package
          packages.add(SnackbarPackage())
          // Manually add ImageCropPicker package
          packages.add(PickerPackage())
          // Manually add Notifee package
          packages.add(NotifeePackage())
          // Manually add Clipboard package
          packages.add(ClipboardPackage())
          // Manually add Google Sign-In package
          packages.add(RNGoogleSigninPackage())
          // Manually add Gesture Handler package (autolinking handles Gradle, but package registration is needed)
          packages.add(RNGestureHandlerPackage())
          // Manually add Safe Area Context package
          packages.add(SafeAreaContextPackage())
          // Manually add React Native Screens package (required for @react-navigation/native-stack)
          packages.add(RNScreensPackage())
          // Additional packages should be automatically added by the React Native Gradle plugin
          // through autolinking at build time
          return packages
        }
        override fun getJSMainModuleName(): String = "index"
        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override fun getReactNativeHost(): ReactNativeHost = mReactNativeHost

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }
}