/** @format */

import React, { PureComponent } from 'react';
import { View, SafeAreaView, StatusBar, Alert, ActivityIndicator, Text, Linking, TouchableOpacity } from 'react-native';
import { withTheme, Languages, Tools, Color, Fonts } from '@common';
import { Header } from '@components';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import MStoreMidtransAPI from '../../services/MStoreMidtransAPI';
import DirectPaymentMethods from '../../components/DirectPaymentMethods';
import WooCommerceOrderService from '../../services/WooCommerceOrderService';
import CustomMidtransAPI from '../../services/CustomMidtransAPI';
import styles from './styles';

class MidtransPaymentScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      paymentStatus: 'select_method', // select_method, processing, success, failed, webview
      snapToken: null,
      snapUrl: null,
      error: null,
      isDemo: false, // Flag untuk demo payment
      warning: null, // Warning message untuk demo payment
      selectedPaymentMethod: null,
      paymentResult: null,
    };
  }

  componentDidMount() {
    console.log('MidtransPaymentScreen mounted');
    // Use Snap API for WebView payment
    this.processSnapPayment();
  }

  processSnapPayment = async () => {
    console.log('🚀 Processing payment via custom Midtrans endpoint...');
    const { route } = this.props;
    const { orderData, onPaymentSuccess, onPaymentError } = route.params;
    
    this.setState({ isLoading: true });
    
    try {
      // Use Custom Midtrans API for direct Snap token generation
      const snapResult = await CustomMidtransAPI.createSnapTransaction(orderData);
      
        if (snapResult.success) {
          console.log('✅ Snap transaction created successfully via custom endpoint!');
          console.log('Token:', snapResult.token);
          console.log('Redirect URL:', snapResult.redirect_url);
          console.log('WooCommerce Order ID:', snapResult.woo_order_id);
          
          this.setState({
            isLoading: false,
            paymentStatus: 'webview',
            snapToken: snapResult.token,
            snapUrl: snapResult.redirect_url,
            isDemo: snapResult.is_demo || false,
            warning: snapResult.warning || null,
            wooOrderId: snapResult.woo_order_id
          });
        } else {
        console.error('❌ Failed to create Snap transaction:', snapResult.error);
        this.setState({
          isLoading: false,
          paymentStatus: 'failed',
          error: `Failed to create Snap transaction: ${snapResult.error}`
        });
      }
    } catch (error) {
      console.error('Error processing Snap payment:', error);
      this.setState({
        isLoading: false,
        paymentStatus: 'failed',
        error: error.message
      });
    }
  };

  onPaymentMethodSelected = (paymentMethod) => {
    console.log('Payment method selected:', paymentMethod);
    this.setState({
      selectedPaymentMethod: paymentMethod,
      paymentStatus: 'processing'
    });
  };

  onPaymentSuccess = (paymentResult) => {
    console.log('Payment successful:', paymentResult);
    this.setState({
      paymentStatus: 'success',
      paymentResult: paymentResult
    });

    // Refresh MyOrder list after successful payment
    if (this.props.fetchMyOrder && this.props.user?.user) {
      console.log('🔄 Refreshing MyOrder list...');
      this.props.fetchMyOrder(this.props.user.user);
    }

    const { route } = this.props;
    const { onPaymentSuccess } = route.params;
    
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentResult);
    }
  };

  onPaymentError = (error) => {
    console.error('Payment failed:', error);
    this.setState({
      paymentStatus: 'failed',
      error: error
    });

    const { route } = this.props;
    const { onPaymentError } = route.params;
    
    if (onPaymentError) {
      onPaymentError(error);
    }
  };

  fallbackToManualPayment = () => {
    const { route } = this.props;
    const { orderData, onPaymentSuccess, onPaymentError } = route.params;
    const { selectedPaymentMethod } = orderData;
    
    // Simple fallback - just show success for now
    this.setState({
      isLoading: false,
      paymentStatus: 'success'
    });
    
    setTimeout(() => {
      onPaymentSuccess({
        method: selectedPaymentMethod,
        transactionId: 'TXN_' + Date.now(),
        status: 'success',
        orderData
      });
    }, 2000);
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  onNavigationStateChange = (navState) => {
    console.log('Navigation state changed:', navState.url);
    
    // Check if URL indicates payment completion
    if (navState.url.includes('finish')) {
      this.handlePaymentSuccess({
        payment_method: this.props.route.params.orderData.selectedPaymentMethod?.id,
        transaction_id: 'TXN_' + Date.now(),
        url: navState.url
      });
    } else if (navState.url.includes('pending')) {
      this.handlePaymentPending({
        payment_method: this.props.route.params.orderData.selectedPaymentMethod?.id,
        transaction_id: 'TXN_' + Date.now(),
        url: navState.url
      });
    } else if (navState.url.includes('error')) {
      this.handlePaymentError({
        error_message: 'Payment failed',
        url: navState.url
      });
    }
  };

  onWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', data);
      
      if (data.status === 'webview_ready') {
        console.log('WebView is ready');
      } else if (data.status === 'success') {
        this.handlePaymentSuccess(data);
      } else if (data.status === 'pending') {
        this.handlePaymentPending(data);
      } else if (data.status === 'error') {
        this.handlePaymentError(data);
      } else if (data.status === 'payment_event') {
        console.log('Payment event:', data.result);
        // Handle specific payment events from Snap.js
        if (data.result && data.result.status_code === '200') {
          this.handlePaymentSuccess(data.result);
        } else if (data.result && data.result.status_code === '201') {
          this.handlePaymentPending(data.result);
        } else if (data.result && data.result.status_code === '400') {
          this.handlePaymentError(data.result);
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  handlePaymentSuccess = (data) => {
    const { route } = this.props;
    const { onPaymentSuccess } = route.params;
    
    onPaymentSuccess({
      method: data.payment_method,
      transactionId: data.transaction_id,
      status: 'success',
      orderData: this.props.route.params.orderData,
      midtransData: data
    });
  };

  handlePaymentPending = (data) => {
    const { route } = this.props;
    const { onPaymentSuccess } = route.params;
    
    onPaymentSuccess({
      method: data.payment_method,
      transactionId: data.transaction_id,
      status: 'pending',
      orderData: this.props.route.params.orderData,
      midtransData: data
    });
  };

  handlePaymentError = (data) => {
    const { route } = this.props;
    const { onPaymentError } = route.params;
    
    onPaymentError(data.error_message || 'Payment failed');
  };

  render() {
    const { theme, route } = this.props;
    const { orderData } = route.params;
    const { isLoading, paymentStatus, snapUrl, error } = this.state;
    const { selectedPaymentMethod } = orderData;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        
        {/* <Header
          title="Midtrans Payment"
          onBack={this.onBack}
          style={styles.header}
        /> */}

        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                Creating payment session...
              </Text>
            </View>
          ) : paymentStatus === 'webview' ? (
            <View style={styles.webviewContainer}>
              {this.state.isDemo && (
                <View style={styles.demoWarningContainer}>
                  <Text style={[styles.demoWarningTitle, { color: '#FF6B35' }]}>
                    ⚠️ Demo Payment Mode
                  </Text>
                  <Text style={[styles.demoWarningText, { color: theme.colors.text }]}>
                    {this.state.warning || 'This is a demo payment. No real transaction will be processed.'}
                  </Text>
                </View>
              )}
              <WebView
              source={{ uri: snapUrl }}
              style={styles.webview}
              onMessage={this.onWebViewMessage}
              onNavigationStateChange={this.onNavigationStateChange}
              injectedJavaScript={`
                // Midtrans Snap WebView Integration
                (function() {
                  // Listen for Midtrans payment events
                  window.addEventListener('message', function(event) {
                    try {
                      if (event.data && typeof event.data === 'object') {
                        window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
                      }
                    } catch (e) {
                      console.error('Error handling message:', e);
                    }
                  });
                  
                  // Listen for Snap.js events
                  if (typeof window.snap !== 'undefined') {
                    window.snap.on('payment', function(result) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        status: 'payment_event',
                        result: result
                      }));
                    });
                  }
                  
                  // Listen for URL changes that indicate payment status
                  let currentUrl = window.location.href;
                  const checkUrl = function() {
                    if (window.location.href !== currentUrl) {
                      currentUrl = window.location.href;
                      console.log('URL changed to:', currentUrl);
                      
                      if (currentUrl.includes('finish')) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          status: 'success',
                          payment_method: '${selectedPaymentMethod?.id}',
                          transaction_id: 'TXN_' + Date.now(),
                          url: currentUrl
                        }));
                      } else if (currentUrl.includes('pending')) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          status: 'pending',
                          payment_method: '${selectedPaymentMethod?.id}',
                          transaction_id: 'TXN_' + Date.now(),
                          url: currentUrl
                        }));
                      } else if (currentUrl.includes('error')) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          status: 'error',
                          error_message: 'Payment failed',
                          url: currentUrl
                        }));
                      }
                    }
                  };
                  
                  // Check URL every 500ms
                  setInterval(checkUrl, 500);
                  
                  // Also check on page load
                  window.addEventListener('load', checkUrl);
                  
                  // Notify that script is ready
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    status: 'webview_ready'
                  }));
                })();
              `}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              mixedContentMode="compatibility"
              thirdPartyCookiesEnabled={true}
              allowsBackForwardNavigationGestures={true}
            />
            </View>
          ) : paymentStatus === 'success' ? (
            <View style={styles.successContainer}>
              {this.state.paymentResult?.is_demo && (
                <View style={styles.demoWarningContainer}>
                  <Text style={[styles.demoWarningTitle, { color: '#FF6B35' }]}>
                    ⚠️ Demo Payment Mode
                  </Text>
                  <Text style={[styles.demoWarningText, { color: theme.colors.text }]}>
                    {this.state.paymentResult.warning || 'Payment channels not yet activated. This is a demo payment.'}
                  </Text>
                </View>
              )}
              
              <Text style={[styles.successText, { color: theme.colors.text }]}>
                ✅ Payment {this.state.paymentResult?.is_demo ? 'Demo' : 'Successful'}!
              </Text>
              <Text style={[styles.methodText, { color: theme.colors.text }]}>
                Method: {this.state.selectedPaymentMethod?.name}
              </Text>
              {this.state.paymentResult && (
                <View style={styles.paymentDetails}>
                  <Text style={[styles.paymentDetailsTitle, { color: theme.colors.text }]}>
                    Payment Details:
                  </Text>
                  <Text style={[styles.paymentDetailsText, { color: theme.colors.text }]}>
                    Order ID: {this.state.paymentResult.order_id}
                  </Text>
                  <Text style={[styles.paymentDetailsText, { color: theme.colors.text }]}>
                    Status: {this.state.paymentResult.status}
                  </Text>
                  {this.state.paymentResult.va_number && (
                    <Text style={[styles.paymentDetailsText, { color: theme.colors.text }]}>
                      Virtual Account: {this.state.paymentResult.va_number}
                    </Text>
                  )}
                </View>
              )}
              <TouchableOpacity style={styles.continueButton} onPress={this.onBack}>
                <Text style={styles.continueButtonText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : paymentStatus === 'failed' ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: theme.colors.text }]}>
                ❌ Payment Failed
              </Text>
              <Text style={[styles.errorMessage, { color: theme.colors.text }]}>
                {this.state.error || 'An error occurred while processing your payment.'}
              </Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={this.processSnapPayment}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={this.onBack}>
                <Text style={styles.backButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: theme.colors.text }]}>
                {error || 'Payment failed. Please try again.'}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency.currency,
  user: state.user, // Add user state for customer_id
});

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux/CartRedux');
  return {
    fetchMyOrder: (user) => actions.fetchMyOrder(dispatch, user),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(MidtransPaymentScreen));
