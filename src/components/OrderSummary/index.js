/** @format */

import React, { PureComponent } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { withTheme, Tools, Languages, Color, Fonts } from '@common';
import { Button, ShippingMethodSelector } from '@components';
import { connect } from 'react-redux';
import BiteshipAPI from '@services/BiteshipAPI';
import styles from './styles';

class OrderSummary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appliedCoupon: null,
      quantities: {},
      calculatedSubTotal: 0,
      calculatedTotalPrice: 0,
    };
  }

  componentDidMount() {
    // Initialize quantities from order data
    const { orderData } = this.props;
    const quantities = {};
    if (orderData.line_items) {
      orderData.line_items.forEach((item, index) => {
        quantities[index] = item.quantity || 1;
      });
    }

    // Initialize coupon if available from orderData
    if (orderData.coupon && orderData.coupon.code) {
      console.log('🔍 Initializing coupon from orderData:', orderData.coupon);
      this.setState({
        appliedCoupon: {
          code: orderData.coupon.code,
          discount: orderData.discountAmount || 0,
          type: orderData.coupon.type
        }
      });
    }

    this.setState({ quantities }, () => {
      // Calculate initial totals
      this.calculateTotals();
    });

    // Initialize shipping state
    this.setState({
      shippingRates: [],
      selectedShippingMethod: null,
      shippingLoading: false,
      shippingError: null,
    });

    // Fetch shipping rates using delivery address
    this.fetchShippingRates();
  }

  updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    this.setState(prevState => ({
      quantities: {
        ...prevState.quantities,
        [index]: newQuantity
      }
    }), () => {
      // Recalculate totals after quantity change
      this.calculateTotals();
    });
  };

  calculateTotals = () => {
    const { orderData, currency } = this.props;
    const { quantities, selectedShippingMethod } = this.state;
    
    let subTotal = 0;
    let totalPrice = 0;
    let totalWeight = 0; // Calculate total weight
    
    orderData.line_items.forEach((item, index) => {
      const currentQuantity = quantities[index] || item.quantity || 1;
      const itemTotal = item.price * currentQuantity;
      subTotal += itemTotal;
      
      // Calculate weight for this item
      const productWeight = item.product?.weight || item.variation?.weight || 0.5; // Default 0.5kg
      const weightInGrams = Math.max(productWeight * 1000, 100); // Convert kg to grams
      totalWeight += weightInGrams * currentQuantity;
    });
    
    // Use selected shipping method price or fallback to orderData
    const shippingPrice = selectedShippingMethod ? selectedShippingMethod.price : (orderData.shippingPrice || 0);
    const taxPrice = orderData.taxPrice || 0;
    const discountAmount = orderData.discountAmount || 0;

    console.log('🔍 calculateTotals - OrderData:', {
      discountAmount,
      coupon: orderData.coupon,
      subTotal,
      shippingPrice,
      taxPrice
    });

    totalPrice = subTotal + shippingPrice + taxPrice - discountAmount;
    
    // Update orderData with new totals
    this.setState({
      calculatedSubTotal: subTotal,
      calculatedTotalPrice: totalPrice,
      totalWeight: totalWeight // Store total weight
    });
  };


  fetchShippingRates = async () => {
    const { orderData, selectedAddress } = this.props;
    
    // Check if we have delivery address data
    if (!selectedAddress || !selectedAddress.postcode) {
      console.warn('No delivery address found');
      return;
    }
    
    this.setState({ shippingLoading: true, shippingError: null });
    
    try {
      // Create destination location in Biteship
      let destinationLocationId = null;
      
      if (selectedAddress.latitude && selectedAddress.longitude) {
        try {
          const locationData = {
            name: `${selectedAddress.first_name} ${selectedAddress.last_name}`,
            contact_name: `${selectedAddress.first_name} ${selectedAddress.last_name}`,
            contact_phone: selectedAddress.phone || '08123456789',
            address: selectedAddress.address_1,
            note: selectedAddress.note || '',
            postal_code: selectedAddress.postcode,
            latitude: parseFloat(selectedAddress.latitude),
            longitude: parseFloat(selectedAddress.longitude),
            type: 'destination'
          };
          
          const locationResponse = await BiteshipAPI.createLocation(locationData);
          if (locationResponse && locationResponse.id) {
            destinationLocationId = locationResponse.id;
            console.log('Created Biteship location:', destinationLocationId);
          }
        } catch (locationError) {
          console.warn('Failed to create Biteship location:', locationError);
        }
      }

      // Default origin address (you can make this configurable)
      const origin = {
        postal_code: '12190', // Jakarta Selatan - bisa dikonfigurasi
        latitude: -6.2088, // Jakarta coordinates
        longitude: 106.8456,
      };

      // Get destination from delivery address with coordinates
      const destination = {
        postal_code: selectedAddress.postcode,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country,
        latitude: selectedAddress.latitude ? parseFloat(selectedAddress.latitude) : -6.2088,
        longitude: selectedAddress.longitude ? parseFloat(selectedAddress.longitude) : 106.8456,
      };

      // Prepare items for shipping calculation with actual product weights
      const items = orderData.line_items.map(item => {
        // Get weight from product data (WooCommerce provides weight in kg)
        const productWeight = item.product?.weight || item.variation?.weight || 0.5; // Default 0.5kg if no weight
        const weightInGrams = Math.max(productWeight * 1000, 100); // Convert kg to grams, minimum 100g
        
        return {
          name: item.name,
          description: item.name,
          value: item.price,
          length: 10,
          width: 10,
          height: 10,
          weight: weightInGrams, // Use actual product weight
          quantity: item.quantity || 1
        };
      });

      // Fetch shipping rates from Biteship
      const response = await BiteshipAPI.getShippingRates(origin, destination, items);
      
      if (response && response.pricing) {
        this.setState({
          shippingRates: response.pricing,
          shippingLoading: false,
          shippingError: null,
        });
      } else {
        // Fallback to dummy data for testing
        const dummyRates = [
          {
            courier_code: 'jne',
            courier_name: 'JNE',
            courier_service_name: 'JNE Reguler',
            service_code: 'reg',
            service_name: 'Reguler',
            description: 'Layanan pengiriman reguler dengan jangkauan luas ke seluruh Indonesia',
            price: 15000,
            etd: '2-3',
            duration: '2-3 days',
            service_type: 'standard',
            shipping_type: 'parcel',
            tier: 'free',
            available_for_cash_on_delivery: true,
            available_for_proof_of_delivery: true,
            available_for_instant_waybill_id: false,
            available_for_insurance: true
          },
          {
            courier_code: 'jne',
            courier_name: 'JNE',
            courier_service_name: 'JNE YES',
            service_code: 'yes',
            service_name: 'YES',
            description: 'Layanan pengiriman cepat JNE dengan jaminan keesokan hari',
            price: 25000,
            etd: '1',
            duration: '1 day',
            service_type: 'express',
            shipping_type: 'parcel',
            tier: 'free',
            available_for_cash_on_delivery: true,
            available_for_proof_of_delivery: true,
            available_for_instant_waybill_id: true,
            available_for_insurance: true
          },
          {
            courier_code: 'jne',
            courier_name: 'JNE',
            courier_service_name: 'JNE Tracking',
            service_code: 'tracking',
            service_name: 'Tracking',
            description: 'Layanan pengiriman JNE dengan tracking real-time',
            price: 20000,
            etd: '2',
            duration: '2 days',
            service_type: 'standard',
            shipping_type: 'parcel',
            tier: 'free',
            available_for_cash_on_delivery: false,
            available_for_proof_of_delivery: true,
            available_for_instant_waybill_id: true,
            available_for_insurance: true
          },
          {
            courier_code: 'tiki',
            courier_name: 'TIKI',
            courier_service_name: 'TIKI Reguler',
            service_code: 'reg',
            service_name: 'Reguler',
            description: 'Layanan pengiriman reguler dengan tracking yang akurat',
            price: 18000,
            etd: '2-3',
            duration: '2-3 days',
            service_type: 'standard',
            shipping_type: 'parcel',
            tier: 'free',
            available_for_cash_on_delivery: false,
            available_for_proof_of_delivery: true,
            available_for_instant_waybill_id: true,
            available_for_insurance: true
          },
          {
            courier_code: 'jnt',
            courier_name: 'J&T',
            courier_service_name: 'J&T EZ',
            service_code: 'ez',
            service_name: 'EZ',
            description: 'Layanan pengiriman cepat dengan harga terjangkau',
            price: 12000,
            etd: '1-2',
            duration: '1-2 days',
            service_type: 'express',
            shipping_type: 'parcel',
            tier: 'free',
            available_for_cash_on_delivery: true,
            available_for_proof_of_delivery: true,
            available_for_instant_waybill_id: true,
            available_for_insurance: false
          }
        ];
        
        this.setState({
          shippingRates: dummyRates,
          shippingLoading: false,
          shippingError: null,
        });
      }
    } catch (error) {
      console.error('Error fetching shipping rates:', error);
      
      // Fallback to dummy data when API fails
      const dummyRates = [
        {
          courier_code: 'jne',
          courier_name: 'JNE',
          courier_service_name: 'JNE Reguler',
          service_code: 'reg',
          service_name: 'Reguler',
          description: 'Layanan pengiriman reguler dengan jangkauan luas ke seluruh Indonesia',
          price: 15000,
          etd: '2-3',
          duration: '2-3 days',
          service_type: 'standard',
          shipping_type: 'parcel',
          tier: 'free',
          available_for_cash_on_delivery: true,
          available_for_proof_of_delivery: true,
          available_for_instant_waybill_id: false,
          available_for_insurance: true
        },
        {
          courier_code: 'jne',
          courier_name: 'JNE',
          courier_service_name: 'JNE YES',
          service_code: 'yes',
          service_name: 'YES',
          description: 'Layanan pengiriman cepat JNE dengan jaminan keesokan hari',
          price: 25000,
          etd: '1',
          duration: '1 day',
          service_type: 'express',
          shipping_type: 'parcel',
          tier: 'free',
          available_for_cash_on_delivery: true,
          available_for_proof_of_delivery: true,
          available_for_instant_waybill_id: true,
          available_for_insurance: true
        },
        {
          courier_code: 'tiki',
          courier_name: 'TIKI',
          courier_service_name: 'TIKI Reguler',
          service_code: 'reg',
          service_name: 'Reguler',
          description: 'Layanan pengiriman reguler dengan tracking yang akurat',
          price: 18000,
          etd: '2-3',
          duration: '2-3 days',
          service_type: 'standard',
          shipping_type: 'parcel',
          tier: 'free',
          available_for_cash_on_delivery: false,
          available_for_proof_of_delivery: true,
          available_for_instant_waybill_id: true,
          available_for_insurance: true
        },
        {
          courier_code: 'jnt',
          courier_name: 'J&T',
          courier_service_name: 'J&T EZ',
          service_code: 'ez',
          service_name: 'EZ',
          description: 'Layanan pengiriman cepat dengan harga terjangkau',
          price: 12000,
          etd: '1-2',
          duration: '1-2 days',
          service_type: 'express',
          shipping_type: 'parcel',
          tier: 'free',
          available_for_cash_on_delivery: true,
          available_for_proof_of_delivery: true,
          available_for_instant_waybill_id: true,
          available_for_insurance: false
        }
      ];
      
      this.setState({
        shippingRates: dummyRates,
        shippingLoading: false,
        shippingError: null, // Don't show error, use dummy data instead
      });
    }
  };

  onSelectShippingMethod = (shippingMethod) => {
    this.setState({ selectedShippingMethod: shippingMethod }, () => {
      // Recalculate totals with new shipping cost
      this.calculateTotals();
    });
  };


  
  renderQuantitySelector = (item, index) => {
    const { quantities } = this.state;
    const currentQuantity = quantities[index] || item.quantity || 1;
    
    return (
      <View style={styles.quantitySelector}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => this.updateQuantity(index, currentQuantity - 1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{currentQuantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => this.updateQuantity(index, currentQuantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderOrderItem = (item, index) => {
    const { theme } = this.props;
    const { colors: { text } } = theme;
    const { quantities } = this.state;
    const currentQuantity = quantities[index] || item.quantity || 1;
    
    return (
      <View key={index} style={styles.orderItem}>
        {/* Product Image - Left Side with Full Height */}
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/80x80' }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
        
        {/* Product Details and Controls - Right Side */}
        <View style={styles.productDetails}>
          {/* Product Name - Full width at top */}
          <Text style={[styles.productName, { color: text }]} numberOfLines={2}>
            {item.name}
          </Text>
          
          {/* Variant and Price - Aligned with title */}
          <View style={styles.productInfoLeft}>
            <Text style={[styles.productVariant, { color: text }]}>
              {item.variation && item.variation.attributes && Object.keys(item.variation.attributes).length > 0 
                ? Object.entries(item.variation.attributes)
                    .map(([key, value]) => `${value}`)
                    .join(', ')
                : 'Standard'
              }
            </Text>
            <Text style={[styles.productPrice, { color: text }]}>
              {Tools.getCurrencyFormatted(item.price, this.props.currency)}
            </Text>
          </View>
          
          {/* Bottom row for quantity and total */}
          <View style={styles.productInfoBottomRow}>
            <View style={styles.productInfoRight}>
              {/* Quantity Selector and Item Total */}
              <View style={styles.totalAndQuantityContainer}>
                {this.renderQuantitySelector(item, index)}
                <Text style={[styles.itemTotal, { color: text }]}>
                  {Tools.getCurrencyFormatted(item.price * currentQuantity, this.props.currency)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderCouponSection = () => {
    const { theme } = this.props;
    const { colors: { text } } = theme;
    const { appliedCoupon } = this.state;

    // Only show coupon section if there's an applied coupon
    if (!appliedCoupon) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>
          {Languages.PromotionCode || 'Promotion Code'}
        </Text>

        <View style={styles.appliedCouponContainer}>
          <View style={styles.appliedCouponInfo}>
            <Text style={[styles.appliedCouponCode, { color: text }]}>
              {appliedCoupon.code}
            </Text>
            <Text style={[styles.appliedCouponDiscount, { color: Color.accent }]}>
              -{Tools.getCurrencyFormatted(appliedCoupon.discount, this.props.currency)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {
      orderData,
      currency,
      theme: { colors: { text, background } },
      onEditOrder,
      onProceedToPayment,
      isLoading = false
    } = this.props;

    const {
      line_items = [],
      billing = {},
      shipping = {},
      taxPrice = 0,
      discountAmount = 0
    } = orderData;

    // Use calculated totals from state, fallback to orderData
    const subTotal = this.state.calculatedSubTotal || orderData.subTotal || 0;
    const shippingPrice = this.state.selectedShippingMethod?.price || orderData.shippingPrice || 0;
    const totalPrice = this.state.calculatedTotalPrice || orderData.totalPrice || 0;

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            {/* <Text style={[styles.headerTitle, { color: text }]}>
              {Languages.OrderSummary || 'Order Summary'}
            </Text> */}
            {/* <TouchableOpacity onPress={onEditOrder} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity> */}
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              {Languages.OrderItems || 'Order Items'}
            </Text>
            {line_items.map((item, index) => this.renderOrderItem(item, index))}
          </View>

          {/* Coupon Section */}
          {this.renderCouponSection()}

          {/* Shipping Methods */}
          <ShippingMethodSelector
            shippingRates={this.state.shippingRates || []}
            selectedShippingMethod={this.state.selectedShippingMethod || null}
            onSelectShippingMethod={this.onSelectShippingMethod}
            isLoading={this.state.shippingLoading || false}
            error={this.state.shippingError || null}
            currency={this.props.currency}
          />


          {/* Billing Address */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              {Languages.BillingAddress || 'Billing Address'}
            </Text>
            <View style={styles.addressContainer}>
              <Text style={[styles.addressText, { color: text }]}>
                {billing.first_name} {billing.last_name}
              </Text>
              <Text style={[styles.addressText, { color: text }]}>
                {billing.address_1}
              </Text>
              <Text style={[styles.addressText, { color: text }]}>
                {billing.city}, {billing.state} {billing.postcode}
              </Text>
              <Text style={[styles.addressText, { color: text }]}>
                {billing.country}
              </Text>
              <Text style={[styles.addressText, { color: text }]}>
                {billing.phone}
              </Text>
            </View>
          </View>

          {/* Shipping Address */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              {Languages.ShippingAddress || 'Shipping Address'}
            </Text>
            <View style={styles.addressContainer}>
              <Text style={[styles.addressText, { color: text }]}>
                {this.props.selectedAddress?.first_name || shipping.first_name} {this.props.selectedAddress?.last_name || shipping.last_name}
              </Text>
              <Text style={[styles.addressText, { color: text }]}>
                {this.props.selectedAddress?.address_1 || shipping.address_1}
              </Text>
              <Text style={[styles.addressText, { color: text }]}>
                {this.props.selectedAddress?.city || shipping.city}, {this.props.selectedAddress?.state || shipping.state} {this.props.selectedAddress?.postcode || shipping.postcode}
              </Text>
              <Text style={[styles.addressText, { color: text }]}>
                {this.props.selectedAddress?.country || shipping.country}
              </Text>
              {this.props.selectedAddress?.phone && (
                <Text style={[styles.addressText, { color: text }]}>
                  {this.props.selectedAddress.phone}
                </Text>
              )}
            </View>
          </View>

                 {/* Price Summary */}
                 <View style={styles.section}>
                   <Text style={[styles.sectionTitle, { color: text }]}>
                     {Languages.PriceSummary || 'Price Summary'}
                   </Text>

                   {/* Total Weight Display */}
                   <View style={styles.priceRow}>
                     <Text style={[styles.priceLabel, { color: text }]}>
                       Total Weight
                     </Text>
                     <Text style={[styles.priceValue, { color: text }]}>
                       {(this.state.totalWeight / 1000).toFixed(2)} kg
                     </Text>
                   </View>

                   <View style={styles.priceRow}>
                     <Text style={[styles.priceLabel, { color: text }]}>
                       {Languages.Subtotal || 'Subtotal'}
                     </Text>
                     <Text style={[styles.priceValue, { color: text }]}>
                       {Tools.getCurrencyFormatted(subTotal, currency)}
                     </Text>
                   </View>

            {discountAmount > 0 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: text }]}>
                  {Languages.Discount || 'Discount'}
                </Text>
                <Text style={[styles.priceValue, { color: Color.accent }]}>
                  -{Tools.getCurrencyFormatted(discountAmount, currency)}
                </Text>
              </View>
            )}

            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: text }]}>
                {Languages.Shipping || 'Shipping'}
              </Text>
              <Text style={[styles.priceValue, { color: text }]}>
                {Tools.getCurrencyFormatted(shippingPrice, currency)}
              </Text>
            </View>

            {taxPrice > 0 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: text }]}>
                  {Languages.Tax || 'Tax'}
                </Text>
                <Text style={[styles.priceValue, { color: text }]}>
                  {Tools.getCurrencyFormatted(taxPrice, currency)}
                </Text>
              </View>
            )}

            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: text }]}>
                {Languages.Total || 'Total'}
              </Text>
              <Text style={[styles.totalValue, { color: text }]}>
                {Tools.getCurrencyFormatted(totalPrice, currency)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Proceed to Payment Button */}
        <View style={styles.buttonContainer}>
          <Button
            text={Languages.ProceedToPayment || 'Proceed to Payment'}
            onPress={() => {
              const { selectedShippingMethod } = this.state;
              
              // Check if shipping method is selected
              if (!selectedShippingMethod) {
                alert('Please select a shipping method first.');
                return;
              }
              
              // 📤 Pastikan semua data penting ada untuk dikirim ke Midtrans
              const orderDataWithMethods = {
                ...orderData,
                selectedShippingMethod,
                shippingPrice: selectedShippingMethod.price,
                totalPrice: this.state.calculatedTotalPrice,
                // Pastikan properti penting ada
                discountAmount: orderData.discountAmount || 0,
                taxPrice: orderData.taxPrice || 0,
                subTotal: this.state.calculatedSubTotal || orderData.subTotal || 0
              };

              console.log('📦 Order data yang dikirim ke payment:', {
                totalPrice: orderDataWithMethods.totalPrice,
                discountAmount: orderDataWithMethods.discountAmount,
                shippingPrice: orderDataWithMethods.shippingPrice,
                taxPrice: orderDataWithMethods.taxPrice,
                subTotal: orderDataWithMethods.subTotal
              });
              
              onProceedToPayment(orderDataWithMethods);
            }}
            isLoading={false}
            style={[
              styles.proceedButton,
              {
                backgroundColor: this.state.selectedShippingMethod 
                  ? Color.primary 
                  : Color.grey,
                opacity: this.state.selectedShippingMethod 
                  ? 1 
                  : 0.5
              }
            ]}
            textStyle={styles.proceedButtonText}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedAddress: state.addresses?.selectedAddress || null,
  currency: state.currency,
});

export default connect(mapStateToProps)(withTheme(OrderSummary));
