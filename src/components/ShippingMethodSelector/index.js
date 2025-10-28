import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { withTheme, Tools, Languages, Color, Fonts } from '@common';
import styles from './styles';

class ShippingMethodSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedMethod: null,
    };
  }

  componentDidMount() {
    const { selectedShippingMethod } = this.props;
    if (selectedShippingMethod) {
      this.setState({ selectedMethod: selectedShippingMethod });
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedShippingMethod } = this.props;
    if (prevProps.selectedShippingMethod !== selectedShippingMethod) {
      this.setState({ selectedMethod: selectedShippingMethod });
    }
  }

  selectShippingMethod = (method, index) => {
    // Create the same identifier logic as in renderShippingMethod
    const serviceCode = method.service_code || 
                       method.courier_service_code || 
                       method.service_name || 
                       `service_${index}`;
    const itemId = `${method.courier_code}_${serviceCode}`;
    
    console.log('Selecting shipping method:', {
      courier: method.courier_name,
      service: method.service_name,
      courier_code: method.courier_code,
      service_code: method.service_code,
      courier_service_code: method.courier_service_code,
      serviceCode,
      itemId,
      price: method.price
    });
    this.setState({ selectedMethod: method });
    this.props.onSelectShippingMethod(method);
  };

  renderShippingMethod = ({ item, index }) => {
    const { theme } = this.props;
    const { colors: { text, background } } = theme;
    const { selectedMethod } = this.state;
    
    // Create unique identifier for each shipping method
    // Use multiple fallbacks to ensure uniqueness
    const serviceCode = item.service_code || 
                       item.courier_service_code || 
                       item.service_name || 
                       `service_${index}`;
    const itemId = `${item.courier_code}_${serviceCode}`;
    const selectedId = selectedMethod ? 
      `${selectedMethod.courier_code}_${selectedMethod.service_code || 
        selectedMethod.courier_service_code || 
        selectedMethod.service_name || 
        'unknown'}` : null;
    const isSelected = selectedId === itemId;
    
    // Debug logging for all items
    console.log('Shipping method item:', {
      index,
      courier: item.courier_name,
      service: item.service_name,
      service_code: item.service_code,
      courier_service_code: item.courier_service_code,
      serviceCode,
      itemId,
      selectedId,
      isSelected
    });

    return (
      <TouchableOpacity
        style={[
          styles.shippingMethodItem,
          { 
            backgroundColor: isSelected ? '#f8f9ff' : background,
            borderColor: isSelected ? Color.primary : Color.border,
            borderWidth: isSelected ? 2 : 1,
          }
        ]}
        onPress={() => this.selectShippingMethod(item, index)}
        activeOpacity={0.7}
      >
        <View style={styles.shippingMethodContent}>
          {/* Info Courier - Full Width */}
          <View style={styles.courierInfo}>
            <View style={styles.courierNameContainer}>
              <Text style={[styles.courierName, { color: text }]}>
                {item.courier_name || item.courier_code?.toUpperCase()}
              </Text>
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={[styles.serviceName, { color: Color.grey }]}>
              {item.courier_service_name || item.service_name || item.service_code}
            </Text>
            
            {/* Durasi Pengiriman */}
            {(item.duration || item.etd) && (
              <Text style={[styles.additionalInfo, { color: Color.grey }]}>
                ⏱️ {item.duration || `${item.etd} hari`}
              </Text>
            )}
            
            {/* Deskripsi Detail */}
            {item.description && (
              <Text style={[styles.description, { color: Color.grey }]}>
                📝 {item.description}
              </Text>
            )}
            
            {/* Tipe Layanan */}
            {item.service_type && (
              <Text style={[styles.additionalInfo, { color: Color.grey }]}>
                🚚 {item.service_type === 'standard' ? 'Layanan Standar' : 
                     item.service_type === 'express' ? 'Layanan Express' : 
                     item.service_type === 'overnight' ? 'Layanan Overnight' : 
                     item.service_type}
              </Text>
            )}
            
            {/* Tipe Pengiriman */}
            {item.shipping_type && (
              <Text style={[styles.additionalInfo, { color: Color.grey }]}>
                📦 {item.shipping_type === 'parcel' ? 'Paket' : 
                     item.shipping_type === 'document' ? 'Dokumen' : 
                     item.shipping_type}
              </Text>
            )}
            
            {/* Features Container */}
            <View style={styles.featuresContainer}>
              {/* Cash on Delivery */}
              {item.available_for_cash_on_delivery && (
                <View style={styles.featureTag}>
                  <Text style={styles.featureText}>💳 COD</Text>
                </View>
              )}
              
              {/* Proof of Delivery */}
              {item.available_for_proof_of_delivery && (
                <View style={styles.featureTag}>
                  <Text style={styles.featureText}>📋 POD</Text>
                </View>
              )}
              
              {/* Instant Waybill */}
              {item.available_for_instant_waybill_id && (
                <View style={styles.featureTag}>
                  <Text style={styles.featureText}>⚡ Instant</Text>
                </View>
              )}
              
              {/* Insurance */}
              {item.available_for_insurance && (
                <View style={styles.featureTag}>
                  <Text style={styles.featureText}>🛡️ Insurance</Text>
                </View>
              )}
              
              {/* Free Shipping */}
              {item.tier === 'free' && (
                <View style={styles.featureTag}>
                  <Text style={styles.featureText}>🆓 Gratis</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Price di Kanan */}
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: Color.primary }]}>
              {Tools.getCurrencyFormatted(item.price, this.props.currency)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { 
      shippingRates, 
      isLoading, 
      error, 
      maxHeight = 300, // Default max height, can be customized via props
      theme: { colors: { text, background } } 
    } = this.props;

    if (isLoading) {
      return (
        <View style={[styles.container, { backgroundColor: background }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>
            {Languages.ShippingMethods || 'Shipping Methods'}
          </Text>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Color.primary} />
            <Text style={[styles.loadingText, { color: text }]}>
              {Languages.LoadingShippingRates || 'Loading shipping rates...'}
            </Text>
          </View>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.container, { backgroundColor: background }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>
            {Languages.ShippingMethods || 'Shipping Methods'}
          </Text>
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: Color.red }]}>
              {error}
            </Text>
          </View>
        </View>
      );
    }

    if (!shippingRates || shippingRates.length === 0) {
      return (
        <View style={[styles.container, { backgroundColor: background }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>
            {Languages.ShippingMethods || 'Shipping Methods'}
          </Text>
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: Color.grey }]}>
              {Languages.NoShippingMethods || 'No shipping methods available'}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <Text style={[styles.sectionTitle, { color: text }]}>
          {Languages.ShippingMethods || 'Shipping Methods'}
        </Text>
        <ScrollView 
          style={[styles.shippingMethodsList, { maxHeight }]}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          indicatorStyle="default"
          scrollEventThrottle={16}
        >
          {shippingRates.map((item, index) => (
            <View key={`${item.courier_code}-${item.service_code || item.courier_service_code || index}-${index}`}>
              {this.renderShippingMethod({ item, index })}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

export default withTheme(ShippingMethodSelector);
