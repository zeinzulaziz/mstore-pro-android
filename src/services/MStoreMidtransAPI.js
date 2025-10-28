/** @format */

/**
 * WooCommerce REST API Service
 * This service handles communication with WooCommerce REST API for order creation and Midtrans integration
 */

import Config from '../common/Config';
import { encode } from 'base-64';

export const MStoreMidtransAPI = {

  /**
   * Create order via WooCommerce REST API and get Midtrans payment URL
   */
  generateSnapToken: async (orderData) => {
    try {
      console.log('Creating order via WooCommerce REST API...');
      
      // WooCommerce REST API credentials
      const { url, consumerKey, consumerSecret } = Config.WooCommerce;
      const auth = encode(`${consumerKey}:${consumerSecret}`);
      
      // Prepare WooCommerce order data
      const wooOrderData = {
        payment_method: 'midtrans',
        payment_method_title: 'Midtrans',
        set_paid: false, // Don't mark as paid yet, Midtrans will handle this
        status: 'pending',
        
        // Customer details
        billing: {
          first_name: orderData.customer_details?.first_name || orderData.billing?.first_name || 'Customer',
          last_name: orderData.customer_details?.last_name || orderData.billing?.last_name || '',
          email: orderData.customer_details?.email || orderData.billing?.email || 'customer@example.com',
          phone: orderData.customer_details?.phone || orderData.billing?.phone || '08123456789',
          address_1: orderData.billing?.address_1 || '',
          city: orderData.billing?.city || '',
          state: orderData.billing?.state || '',
          postcode: orderData.billing?.postcode || '',
          country: orderData.billing?.country || 'ID'
        },
        
        // Shipping address
        shipping: {
          first_name: orderData.shipping?.first_name || orderData.billing?.first_name || 'Customer',
          last_name: orderData.shipping?.last_name || orderData.billing?.last_name || '',
          address_1: orderData.shipping?.address_1 || orderData.billing?.address_1 || '',
          city: orderData.shipping?.city || orderData.billing?.city || '',
          state: orderData.shipping?.state || orderData.billing?.state || '',
          postcode: orderData.shipping?.postcode || orderData.billing?.postcode || '',
          country: orderData.shipping?.country || orderData.billing?.country || 'ID'
        },
        
        // Line items
        line_items: orderData.line_items?.map(item => ({
          product_id: item.product_id || 0,
          quantity: item.quantity || 1,
          name: item.name || 'Product',
          price: item.price || 0
        })) || [],
        
        // Shipping method
        shipping_lines: orderData.selectedShippingMethod ? [{
          method_title: orderData.selectedShippingMethod.service_name || 'Shipping',
          method_id: orderData.selectedShippingMethod.courier_code || 'shipping',
          total: (orderData.selectedShippingMethod.price || 0).toString()
        }] : [],
        
        // Meta data for Midtrans
        meta_data: [
          {
            key: '_midtrans_payment_method',
            value: 'snap'
          }
        ]
      };
      
      console.log('WooCommerce order data:', wooOrderData);
      
      // Create order via WooCommerce REST API
      const orderResponse = await fetch(`${url}/wp-json/wc/v3/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify(wooOrderData)
      });
      
      console.log('WooCommerce order response status:', orderResponse.status);
      
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('WooCommerce Order Creation Error:', errorText);
        throw new Error(`WooCommerce API error! status: ${orderResponse.status}, message: ${errorText}`);
      }
      
      const createdOrder = await orderResponse.json();
      console.log('✅ WooCommerce order created:', createdOrder);
      
      // Get Midtrans payment URL from WooCommerce order
      const paymentUrl = createdOrder.payment_url;
      
      if (paymentUrl) {
        console.log('✅ WooCommerce order created successfully!');
        console.log('Order ID:', createdOrder.id);
        console.log('Payment URL:', paymentUrl);
        
        return {
          success: true,
          order_id: createdOrder.id,
          token: createdOrder.id.toString(), // Use order ID as token
          redirect_url: paymentUrl,
          woo_order: createdOrder,
          data: { order: createdOrder }
        };
      } else {
        // Fallback: Generate demo payment URL
        console.log('⚠️ No payment URL from WooCommerce, using demo payment URL');
        return {
          success: true,
          order_id: createdOrder.id,
          token: 'demo-token-' + Date.now(),
          redirect_url: 'https://app.midtrans.com/snap/v4/redirection/demo-token-' + Date.now(),
          woo_order: createdOrder,
          data: { order: createdOrder },
          warning: 'No payment URL from WooCommerce. Using demo payment URL.',
          is_demo: true
        };
      }
      
    } catch (error) {
      console.error('Error creating order via WooCommerce API:', error);
      
      // Fallback: Return demo payment URL for testing
      console.log('⚠️ WooCommerce API error, using fallback demo payment URL');
      
      let warningMessage = 'Using demo payment URL due to WooCommerce API error: ' + error.message;
      
      if (error.message.includes('401')) {
        warningMessage = 'WooCommerce authentication error (401). Using demo payment URL. Please check API credentials.';
      } else if (error.message.includes('500')) {
        warningMessage = 'WooCommerce server error (500). Using demo payment URL. Please try again later.';
      }
      
      return {
        success: true,
        token: 'demo-token-' + Date.now(),
        redirect_url: 'https://app.midtrans.com/snap/v4/redirection/demo-token-' + Date.now(),
        order_id: orderData.id || `ORDER_${Date.now()}`,
        woo_order: null,
        data: { token: 'demo-token-' + Date.now() },
        warning: warningMessage,
        is_demo: true // Flag untuk identify demo payment
      };
    }
  },

};

export default MStoreMidtransAPI;
