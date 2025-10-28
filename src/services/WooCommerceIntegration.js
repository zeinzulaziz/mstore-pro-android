/** @format */

/**
 * WooCommerce Integration Service
 * Handles order creation and status synchronization with WooCommerce
 */

import Config from '../common/Config';
import { encode } from 'base-64';

export const WooCommerceIntegration = {

  /**
   * Create WooCommerce order after successful payment
   */
  createOrder: async (paymentResult, orderData) => {
    try {
      console.log('🛒 Creating WooCommerce order...');
      console.log('👤 Customer ID:', orderData.customer_id);
      console.log('📦 Order Data:', JSON.stringify(orderData, null, 2));
      
      const { url, consumerKey, consumerSecret } = Config.WooCommerce;
      const auth = encode(`${consumerKey}:${consumerSecret}`);
      
      const wooOrderData = {
        customer_id: orderData.customer_id || 0, // Ensure customer_id is set
        payment_method: 'midtrans',
        payment_method_title: 'Midtrans',
        set_paid: false, // Don't mark as paid initially, let Midtrans webhook handle it
        status: 'pending', // Set to pending initially
        billing: {
          first_name: orderData.customer_details?.first_name || 'Customer',
          last_name: orderData.customer_details?.last_name || '',
          email: orderData.customer_details?.email || 'customer@example.com',
          phone: orderData.customer_details?.phone || '08123456789',
          address_1: orderData.billing?.address_1 || '',
          city: orderData.billing?.city || '',
          state: orderData.billing?.state || '',
          postcode: orderData.billing?.postcode || '',
          country: orderData.billing?.country || 'ID'
        },
        shipping: {
          first_name: orderData.shipping?.first_name || orderData.customer_details?.first_name || 'Customer',
          last_name: orderData.shipping?.last_name || orderData.customer_details?.last_name || '',
          address_1: orderData.shipping?.address_1 || '',
          city: orderData.shipping?.city || '',
          state: orderData.shipping?.state || '',
          postcode: orderData.shipping?.postcode || '',
          country: orderData.shipping?.country || 'ID'
        },
            line_items: orderData.line_items?.filter(item => {
              // Filter out shipping items from line_items
              return item.id !== 'shipping' && item.product_id !== 'shipping' && item.name !== 'Shipping Cost';
            }).map(item => {
              // Only include product_id if it's a valid positive number
              const productId = parseInt(item.product_id);
              if (productId && productId > 0) {
                return {
                  product_id: productId,
                  quantity: item.quantity || 1,
                };
              } else {
                // Create custom line item without product_id
                return {
                  name: item.name || 'Custom Product',
                  quantity: item.quantity || 1,
                  total: (item.price || item.total || 0).toString(),
                };
              }
            }) || [],
        shipping_lines: (() => {
          // Check if there's a shipping item in line_items
          const shippingItem = orderData.line_items?.find(item => 
            item.id === 'shipping' || item.product_id === 'shipping' || item.name === 'Shipping Cost'
          );
          
          if (shippingItem) {
            console.log('📦 Found shipping item in line_items, moving to shipping_lines:', JSON.stringify(shippingItem, null, 2));
            return [{
              method_id: 'custom_shipping',
              method_title: shippingItem.name || 'Shipping Cost',
              total: (shippingItem.price || shippingItem.total || 0).toString()
            }];
          } else if (orderData.selectedShippingMethod) {
            console.log('📦 Using selectedShippingMethod for shipping_lines');
            return [{
              method_title: orderData.selectedShippingMethod.service_name || 'Shipping',
              method_id: orderData.selectedShippingMethod.courier_code || 'custom_shipping',
              total: orderData.selectedShippingMethod.price?.toString() || '0'
            }];
          } else {
            console.log('📦 No shipping method found');
            return [];
          }
        })(),
        meta_data: [
          { key: '_midtrans_payment_method', value: paymentResult.payment_method || 'midtrans' },
          { key: '_midtrans_order_id', value: paymentResult.order_id },
          { key: '_midtrans_transaction_id', value: paymentResult.data?.transaction_id || paymentResult.order_id },
          { key: '_midtrans_va_number', value: paymentResult.va_number || '' },
          { key: '_midtrans_payment_status', value: paymentResult.status || 'pending' },
          { key: '_midtrans_transaction_time', value: paymentResult.data?.transaction_time || new Date().toISOString() },
          { key: '_midtrans_is_demo', value: paymentResult.is_demo ? 'yes' : 'no' },
          { key: '_midtrans_redirect_url', value: paymentResult.redirect_url || '' },
          { key: '_midtrans_token', value: paymentResult.token || '' }
        ]
      };

      console.log('🛒 WooCommerce order data:', wooOrderData);

      const response = await fetch(`${url}/wp-json/wc/v3/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify(wooOrderData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Don't log as error since it's handled gracefully
        console.log('ℹ️ WooCommerce order creation handled gracefully');
        throw new Error(`WooCommerce order creation handled gracefully: ${errorText}`);
      }

      const createdOrder = await response.json();
      console.log('✅ WooCommerce order created successfully!');
      console.log('📋 Order ID:', createdOrder.id);
      console.log('👤 Customer ID:', createdOrder.customer_id);
      console.log('📊 Status:', createdOrder.status);
      console.log('💰 Total:', createdOrder.total);
      console.log('🔍 Full Order Data:', JSON.stringify(createdOrder, null, 2));

      return {
        success: true,
        order: createdOrder,
        order_id: createdOrder.id
      };

    } catch (error) {
      console.error('❌ Error creating WooCommerce order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Update WooCommerce order status
   */
  updateOrderStatus: async (orderId, status, paymentData) => {
    try {
      console.log(`🔄 Updating WooCommerce order ${orderId} status to ${status}...`);
      
      const { url, consumerKey, consumerSecret } = Config.WooCommerce;
      const auth = encode(`${consumerKey}:${consumerSecret}`);
      
      const updateData = {
        status: status,
        meta_data: [
          { key: '_midtrans_payment_status', value: paymentData.status },
          { key: '_midtrans_transaction_id', value: paymentData.transaction_id },
          { key: '_midtrans_updated_at', value: new Date().toISOString() }
        ]
      };

      const response = await fetch(`${url}/wp-json/wc/v3/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`WooCommerce order update failed: ${errorText}`);
      }

      const updatedOrder = await response.json();
      console.log('✅ WooCommerce order updated:', updatedOrder);

      return {
        success: true,
        order: updatedOrder
      };

    } catch (error) {
      console.error('❌ Error updating WooCommerce order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get WooCommerce order by ID
   */
  getOrder: async (orderId) => {
    try {
      console.log(`📋 Getting WooCommerce order ${orderId}...`);
      
      const { url, consumerKey, consumerSecret } = Config.WooCommerce;
      const auth = encode(`${consumerKey}:${consumerSecret}`);
      
      const response = await fetch(`${url}/wp-json/wc/v3/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${auth}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get WooCommerce order: ${errorText}`);
      }

      const order = await response.json();
      console.log('✅ WooCommerce order retrieved:', order);

      return {
        success: true,
        order: order
      };

    } catch (error) {
      console.error('❌ Error getting WooCommerce order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

};

export default WooCommerceIntegration;
