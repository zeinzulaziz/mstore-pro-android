/** @format */

import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { withTheme, Languages, Tools, Color, Fonts } from '@common';
import styles from './styles';
import WooCommerceOrderService from '../../services/WooCommerceOrderService';

class DirectPaymentMethods extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedMethod: null,
      paymentMethods: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.loadPaymentMethods();
  }

  loadPaymentMethods = () => {
    // Payment methods are now handled by WooCommerce Midtrans plugin
    // We'll show a simple message instead
    const paymentMethods = [
      {
        id: 'woocommerce_midtrans',
        name: 'Midtrans Payment',
        description: 'Secure payment via WooCommerce',
        icon: 'credit-card',
        enabled: true,
        status: 'active'
      }
    ];
    this.setState({ paymentMethods });
  };

  testWooCommerceAPI = async () => {
    console.log('🧪 Testing WooCommerce API...');
    try {
      const result = await WooCommerceOrderService.createOrderWithPayment({
        customer_id: 1,
        line_items: [{
          product_id: 1,
          quantity: 1,
          price: 10000
        }],
        customer_details: {
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          phone: '08123456789'
        }
      });
      
      Alert.alert(
        'WooCommerce API Test Result',
        result.success ? 
          '✅ WooCommerce API Test Successful!' : 
          `❌ WooCommerce API Test Failed: ${result.error}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'WooCommerce API Test Result',
        `❌ WooCommerce API Test Failed: ${error.message}`,
        [{ text: 'OK' }]
      );
    }
  };

  selectPaymentMethod = (method) => {
    if (!method.enabled) {
      Alert.alert(
        'Payment Method Not Available',
        method.note || 'This payment method is currently not available.',
        [{ text: 'OK' }]
      );
      return;
    }

    this.setState({ selectedMethod: method });
    
    if (this.props.onMethodSelected) {
      this.props.onMethodSelected(method);
    }
  };

  processPayment = async () => {
    const { selectedMethod } = this.state;
    const { orderData, onPaymentSuccess, onPaymentError } = this.props;

    if (!selectedMethod) {
      Alert.alert('Please select a payment method');
      return;
    }

    this.setState({ isLoading: true });

    try {
      console.log(`Processing payment with ${selectedMethod.name}...`);
      
      const result = await WooCommerceOrderService.createOrderWithPayment(orderData);
      
      if (result.success) {
        console.log('✅ Payment processed successfully:', result);
        
        if (onPaymentSuccess) {
          onPaymentSuccess({
            payment_method: selectedMethod,
            order_id: result.order_id,
            payment_url: result.payment_url,
            redirect_url: result.redirect_url,
            token: result.token
          });
        }
      } else {
        console.error('❌ Payment failed:', result);
        console.error('❌ Error details:', result.error);
        console.error('❌ Error type:', result.error_type);
        console.error('❌ Error details:', result.error_details);
        
        if (onPaymentError) {
          onPaymentError(result.error || 'Payment failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('❌ Error processing payment:', error);
      console.error('❌ Error stack:', error.stack);
      
      if (onPaymentError) {
        onPaymentError(error.message || 'An unexpected error occurred.');
      }
    } finally {
      this.setState({ isLoading: false });
    }
  };

  renderPaymentMethod = (method) => {
    const { selectedMethod } = this.state;
    const isSelected = selectedMethod?.id === method.id;
    const isEnabled = method.enabled;

    return (
      <TouchableOpacity
        key={method.id}
        style={[
          styles.paymentMethodCard,
          isSelected && styles.selectedPaymentMethod,
          !isEnabled && styles.disabledPaymentMethod
        ]}
        onPress={() => this.selectPaymentMethod(method)}
        disabled={!isEnabled}
      >
        <View style={styles.paymentMethodContent}>
          <View style={styles.paymentMethodInfo}>
            <Text style={[
              styles.paymentMethodName,
              !isEnabled && styles.disabledText
            ]}>
              {method.name}
            </Text>
            <Text style={[
              styles.paymentMethodDescription,
              !isEnabled && styles.disabledText
            ]}>
              {method.description}
            </Text>
            {method.status === 'pending' && (
              <Text style={styles.pendingText}>
                {method.note}
              </Text>
            )}
          </View>
          
          <View style={styles.paymentMethodStatus}>
            {isSelected && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedIndicatorText}>✓</Text>
              </View>
            )}
            {method.status === 'pending' && (
              <View style={styles.pendingIndicator}>
                <Text style={styles.pendingIndicatorText}>⏳</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { paymentMethods, selectedMethod, isLoading } = this.state;
    const { theme } = this.props;

    const activeMethods = paymentMethods.filter(method => method.enabled);
    const pendingMethods = paymentMethods.filter(method => !method.enabled);

    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        
        <ScrollView style={styles.paymentMethodsList}>
          {/* Active Payment Methods */}
          {activeMethods.length > 0 && (
            <View style={styles.paymentSection}>
              <Text style={styles.sectionSubtitle}>Available Now</Text>
              {activeMethods.map(this.renderPaymentMethod)}
            </View>
          )}

          {/* Pending Payment Methods */}
          {pendingMethods.length > 0 && (
            <View style={styles.paymentSection}>
              <Text style={styles.sectionSubtitle}>Coming Soon</Text>
              {pendingMethods.map(this.renderPaymentMethod)}
            </View>
          )}
        </ScrollView>

        {/* Test API Buttons */}
        <View style={styles.testContainer}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={this.testWooCommerceAPI}
          >
            <Text style={styles.testButtonText}>🧪 Test API Connection</Text>
          </TouchableOpacity>
          
        </View>

        {/* Process Payment Button */}
        {selectedMethod && (
          <View style={styles.processPaymentContainer}>
            <TouchableOpacity
              style={[
                styles.processPaymentButton,
                isLoading && styles.processPaymentButtonDisabled
              ]}
              onPress={this.processPayment}
              disabled={isLoading}
            >
              <Text style={styles.processPaymentButtonText}>
                {isLoading ? 'Processing...' : `Pay with ${selectedMethod.name}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

export default withTheme(DirectPaymentMethods);
