/** @format */

import React, { PureComponent } from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { withTheme, Languages, Color, Tools } from '@common';
import { OrderSummary } from '@components';
import { connect } from 'react-redux';
import styles from './styles';

class OrderSummaryScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  onEditOrder = () => {
    // Navigate back to cart or shipping info
    this.props.navigation.goBack();
  };

  onProceedToPayment = (orderDataWithMethods) => {
    const { navigation } = this.props;
    
    this.setState({ isLoading: true });
    
    // Navigate directly to Midtrans payment screen
    navigation.navigate('MidtransPaymentScreen', {
      orderData: orderDataWithMethods,
      onPaymentSuccess: this.onPaymentSuccess,
      onPaymentError: this.onPaymentError,
    });
  };

  onPaymentSuccess = (paymentData) => {
    this.setState({ isLoading: false });
    // Navigate to success screen
    this.props.navigation.navigate('OrderSuccessScreen', {
      orderData: this.props.route.params.orderData,
      paymentData,
    });
  };

  onPaymentError = (error) => {
    this.setState({ isLoading: false });
    // Show error message
    console.error('Payment error:', error);
  };

  
  render() {
    const { theme, route, currency, cartItems } = this.props;
    const { orderData } = route.params;
    const { isLoading } = this.state;

    // Transform cartItems to match OrderSummary expected format
    console.log('🔍 Original cartItems:', JSON.stringify(cartItems, null, 2));
    console.log('🔍 Coupon data in render:', JSON.stringify(this.props.coupon, null, 2));

    const subTotal = this.calculateSubTotal();
    const discountAmount = this.calculateDiscountAmount();
    const shippingPrice = this.calculateShippingPrice();

    console.log('🔍 Calculated values:', { subTotal, discountAmount, shippingPrice });

    const finalTotalPrice = subTotal + shippingPrice - discountAmount;

    console.log('💰 OrderSummaryScreen - Final calculations:', {
      subTotal,
      shippingPrice,
      discountAmount,
      finalTotalPrice,
      coupon: this.props.coupon
    });

    const transformedOrderData = {
      ...orderData,
      customer_id: this.props.user?.user?.id || 0, // Add customer_id from user state
      line_items: cartItems.map((cartItem, index) => {
        console.log(`🔍 Processing cartItem ${index}:`, JSON.stringify(cartItem, null, 2));

        const product = cartItem.variation && cartItem.variation.price !== ''
          ? cartItem.variation
          : cartItem.product;

        // Validate product_id before using it
        const productId = cartItem.product?.id;
        const isValidProductId = productId && !isNaN(parseInt(productId)) && parseInt(productId) > 0;

        const lineItem = {
          product_id: isValidProductId ? parseInt(productId) : null, // Set to null if invalid
          quantity: cartItem.quantity,
          name: cartItem.product.name,
          price: Tools.getMultiCurrenciesPrice(product, currency),
          image: Tools.getImageVariation(cartItem.product, cartItem.variation),
          product: cartItem.product, // Include full product data for weight
          variation: cartItem.variation ? {
            id: cartItem.variation.id,
            attributes: cartItem.variation.attributes || {},
            weight: cartItem.variation.weight // Include variation weight
          } : null
        };

        console.log(`🔍 Line item ${index} created:`, JSON.stringify(lineItem, null, 2));
        console.log(`🔍 Product ID for line item ${index}:`, cartItem.product?.id, 'Type:', typeof cartItem.product?.id);

        return lineItem;
      }),
      // Calculate totals from cartItems
      subTotal: subTotal,
      shippingPrice: shippingPrice,
      taxPrice: 0, // You can add tax calculation if needed
      discountAmount: discountAmount,
      totalPrice: finalTotalPrice, // Use final calculated price
      coupon: this.props.coupon // Include coupon data for display purposes
    };

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        

        <OrderSummary
          orderData={transformedOrderData}
          currency={this.props.currency}
          onEditOrder={this.onEditOrder}
          onProceedToPayment={this.onProceedToPayment}
          isLoading={isLoading}
        />
      </SafeAreaView>
    );
  }

  calculateSubTotal = () => {
    const { cartItems, currency } = this.props;
    let total = 0;
    
    cartItems.forEach(cartItem => {
      const product = cartItem.variation && cartItem.variation.price !== '' 
        ? cartItem.variation 
        : cartItem.product;
      
      const price = Tools.getMultiCurrenciesPrice(product, currency);
      total += price * cartItem.quantity;
    });
    
    return total;
  };

  calculateShippingPrice = () => {
    // You can implement shipping calculation here
    // For now, return 0 or get from orderData
    return 0;
  };

  calculateDiscountAmount = () => {
    const { coupon } = this.props;

    console.log('🔍 Coupon data:', JSON.stringify(coupon, null, 2));

    if (!coupon || !coupon.code || coupon.amount === 0) {
      console.log('🔍 No valid coupon found, returning 0 discount');
      return 0;
    }

    // Calculate the subtotal first
    const subTotal = this.calculateSubTotal();
    console.log('🔍 Subtotal for discount calculation:', subTotal);

    // Calculate discount based on coupon type
    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = subTotal * (coupon.amount / 100);
      console.log('🔍 Percentage discount calculated:', discountAmount);
    } else {
      // Fixed amount discount
      discountAmount = coupon.amount;
      console.log('🔍 Fixed discount calculated:', discountAmount);
    }

    return discountAmount;
  };

  calculateTotalPrice = () => {
    return this.calculateSubTotal() + this.calculateShippingPrice() - this.calculateDiscountAmount();
  };
}

const mapStateToProps = (state) => ({
  currency: state.currency,
  cartItems: state.carts.cartItems,
  user: state.user, // Add user state to access customer_id
  coupon: state.products.coupon, // Add coupon state
});

export default connect(mapStateToProps)(withTheme(OrderSummaryScreen));
