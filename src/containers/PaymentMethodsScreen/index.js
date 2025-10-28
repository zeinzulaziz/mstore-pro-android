/** @format */

import React, { PureComponent } from 'react';
import { View, SafeAreaView, StatusBar, Text } from 'react-native';
import { withTheme, Languages } from '@common';
import { Header } from '@components';
import { connect } from 'react-redux';
import styles from './styles';

class PaymentMethodsScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedPaymentMethod: null,
    };
  }

  onBack = () => {
    this.props.navigation.goBack();
  };

  onSelectPaymentMethod = (selectedMethod) => {
    this.setState({ selectedPaymentMethod: selectedMethod });
  };

  onProceedToPayment = (selectedMethod) => {
    const { navigation, route } = this.props;
    const { orderData, onPaymentSuccess, onPaymentError } = route.params;

    // Here you would integrate with Midtrans SDK
    // For now, we'll simulate the payment process
    console.log('Processing payment with method:', selectedMethod);
    console.log('Order data:', orderData);

    // Simulate payment processing
    setTimeout(() => {
      if (selectedMethod.id === 'credit_card') {
        // Simulate credit card payment
        onPaymentSuccess({
          method: selectedMethod,
          transactionId: 'TXN_' + Date.now(),
          status: 'success',
        });
      } else {
        // For other methods, show payment instructions
        navigation.navigate('PaymentInstructionsScreen', {
          orderData,
          paymentMethod: selectedMethod,
          onPaymentSuccess,
          onPaymentError,
        });
      }
    }, 2000);
  };

  render() {
    const { theme, route, currency } = this.props;
    const { orderData } = route.params;
    const { selectedPaymentMethod } = this.state;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        
        <Header
          title={Languages.PaymentMethods || 'Payment Methods'}
          onBack={this.onBack}
          style={styles.header}
        />

        <View style={styles.content}>
          <Text style={[styles.title, { color: text }]}>
            {Languages.PaymentMethods || 'Payment Methods'}
          </Text>
          <Text style={[styles.description, { color: text }]}>
            Payment methods are now handled in the Midtrans Snap UI. Please proceed to payment to select your preferred payment method.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency,
});

export default connect(mapStateToProps)(withTheme(PaymentMethodsScreen));
