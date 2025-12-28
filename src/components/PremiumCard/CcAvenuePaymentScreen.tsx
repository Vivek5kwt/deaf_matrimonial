import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, StyleSheet, BackHandler } from 'react-native';

const CCAvenuePaymentScreen = ({ route, navigation,props }) => {
  const { encRequest, accessCode, paymentUrl } = route.params;
  const webViewRef = useRef(null);

  // Handle Android back button
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (webViewRef.current) {
          props.webViewRef.current.goBack();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, []);

  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background:#fff;">
        <form id="ccavenueForm" method="post" action="${paymentUrl}">
          <input type="hidden" name="encRequest" value="${encRequest}" />
          <input type="hidden" name="access_code" value="${accessCode}" />
        </form>
        <script>
          document.getElementById('ccavenueForm').submit();
        </script>
      </body>
    </html>
  `;

  const handleNavigationStateChange = (navState) => {
    console.log('Navigating to:', navState.url);
  
    const currentUrl = navState.url.toLowerCase();
  
    // ✅ Successful Payment
    if (currentUrl.includes('/api/ccavenue/response') || currentUrl.includes('payment-success')) {
      navigation.replace('PaymentStatusScreen', { 
        status: 'completed',
        redirectUrl: navState.url 
      });
      return;
    }
  
    // ✅ Payment Cancelled (handles CCAvenue cancel routes)
    if (
      currentUrl.includes('cancel') ||
      currentUrl.includes('canceltransaction') ||
      currentUrl.includes('payment/cancel') ||
      currentUrl.includes('cancelled')
    ) {
      navigation.replace('Screen51', { 
        status: 'cancelled',
        redirectUrl: navState.url 
      });
      return;
    }
  
    // ✅ Payment Failed
    if (currentUrl.includes('failure') || currentUrl.includes('payment/failure')) {
      navigation.replace('Screen51', { 
        status: 'failed',
        redirectUrl: navState.url 
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        mixedContentMode="always"
        thirdPartyCookiesEnabled={true}
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#FF7E00" />
          </View>
        )}
        onNavigationStateChange={handleNavigationStateChange}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          navigation.replace('PaymentScreen', { 
            status: 'error',
            error: nativeEvent.description 
          });
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('HTTP error:', nativeEvent.statusCode);
          navigation.replace('PaymentScreen', { 
            status: 'http_error',
            code: nativeEvent.statusCode 
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)'
  }
});

export default CCAvenuePaymentScreen;