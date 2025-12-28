# Preserve React Native bridge and UI components
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.modules.** { *; }
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactModule <methods>;
}
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Hermes specific rules
-keep public class com.facebook.hermes.unicode.** { *; }
-keepclassmembers class com.facebook.hermes.unicode.** { *; }

# Retrofit/OkHttp if used in your project
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn retrofit2.**
-keep class okhttp3.** { *; }
-keep class retrofit2.** { *; }

# WebView
-keepclassmembers class * extends android.webkit.WebView {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    void loadUrl(java.lang.String);
    void loadUrl(java.lang.String, java.util.Map);
}

# For React Native Navigation if used
-keep class com.reactnativenavigation.** { *; }
-dontwarn com.reactnativenavigation.**

# Firebase specific rules (if used)
-dontwarn com.google.firebase.**
-keep class com.google.firebase.** { *; }

# Prevent obfuscation of View names
-keepclassmembers class * extends android.view.View {
   public <init>(android.content.Context);
   public <init>(android.content.Context, android.util.AttributeSet);
   public <init>(android.content.Context, android.util.AttributeSet, int);
}

# Avoid issues with Java 8+ APIs
-dontwarn java.time.**
-keepclassmembers class * {
    @android.annotation.SuppressLint <methods>;
}

# Multidex support
-keep class androidx.multidex.** { *; }

# Firebase Auth
-keep class com.google.firebase.auth.** { *; }
-dontwarn com.google.firebase.auth.**

# Google Sign-In
-keep class com.google.android.gms.auth.api.signin.** { *; }
-dontwarn com.google.android.gms.**

# Firebase Core
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# React Native Firebase (Invertase)
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**