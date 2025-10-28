/**
 * Custom Midtrans API Service
 * Uses custom WordPress endpoint for secure Snap token generation
 * API keys are stored securely on WordPress server
 */

import Config from '../common/Config';
import { WooCommerceOrderService } from './WooCommerceOrderService';

export const CustomMidtransAPI = {

  /**
   * Create Midtrans transaction via custom WordPress endpoint
   */
  createSnapTransaction: async (orderData) => {
    try {
      console.log('🚀 Creating Snap transaction via custom endpoint...');
      console.log('📦 Order data:', JSON.stringify(orderData, null, 2));
      
      const { url } = Config.WooCommerce;
      const endpoint = `${url}/wp-json/custom/v1/create-midtrans`;
      
      // ✅ Hitung grossAmount untuk server (TOTAL SEBELUM DISKON)
    let grossAmount = 0;
    let finalAmount = 0; // Amount setelah diskon

    if (orderData.totalPrice) {
      // totalPrice adalah final amount (setelah diskon)
      finalAmount = orderData.totalPrice;
      // Tambahkan kembali discount untuk dapat gross amount
      const discountAmount = parseFloat(orderData.discountAmount) || 0;
      grossAmount = finalAmount + discountAmount;

      console.log('✅ Menggunakan totalPrice dan menambahkan diskon:', {
        finalAmount: finalAmount,
        discountAmount: discountAmount,
        grossAmount: grossAmount
      });
    } else {
      // fallback manual
      grossAmount = orderData.line_items?.reduce(
        (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
        0
      ) || 0;

      // tambahkan ongkir & pajak
      const shippingPrice = orderData.shippingPrice || orderData.selectedShippingMethod?.price || 0;
      const taxPrice = orderData.taxPrice || 0;
      grossAmount += shippingPrice + taxPrice;

      // Hitung final amount setelah diskon
      finalAmount = grossAmount;
      const discountAmount = parseFloat(orderData.discountAmount) || 0;
      if (discountAmount > 0) {
        finalAmount = grossAmount - discountAmount;
        console.log('🔍 Mengurangi diskon dalam perhitungan manual:', discountAmount);
      }

      console.log('🔍 Perhitungan manual:', {
        grossAmount: grossAmount,
        discountAmount: discountAmount,
        finalAmount: finalAmount
      });
    }

    console.log('💰 Final amount (setelah diskon) untuk Midtrans:', finalAmount);
    console.log('💰 Gross amount (sebelum diskon) untuk reference:', grossAmount);
      console.log('📊 Order data totals:', {
        totalPrice: orderData.totalPrice,
        total: orderData.total,
        gross_amount: orderData.gross_amount,
        discountAmount: orderData.discountAmount,
        coupon: orderData.coupon,
        grossAmount: grossAmount,
        finalAmount: finalAmount
      });

      // Prepare request data
      const requestData = {
        amount: finalAmount, // Kirim final amount ke server (setelah diskon)
        order_id: orderData.id || `ORDER_${Date.now()}`,
        customer_id: orderData.customer_id || 0, // Add customer_id
        // Add coupon data
        coupon: orderData.coupon || null,
        discountAmount: orderData.discountAmount || 0,
        customer_details: {
          first_name: orderData.customer_details?.first_name || 
                     orderData.billing?.first_name || 
                     'Customer',
          last_name: orderData.customer_details?.last_name || 
                    orderData.billing?.last_name || 
                    '',
          email: orderData.customer_details?.email || 
                orderData.billing?.email || 
                'customer@example.com',
          phone: orderData.customer_details?.phone || 
                orderData.billing?.phone || 
                '08123456789'
        },
        billing_address: {
          first_name: orderData.billing?.first_name || 
                     orderData.customer_details?.first_name || 
                     'Customer',
          last_name: orderData.billing?.last_name || 
                    orderData.customer_details?.last_name || 
                    '',
          address: orderData.billing?.address_1 || '',
          city: orderData.billing?.city || '',
          state: orderData.billing?.state || '',
          postal_code: orderData.billing?.postcode || '',
          phone: orderData.customer_details?.phone || 
                orderData.billing?.phone || 
                '08123456789',
          country_code: (orderData.billing?.country === 'ID' ? 'IDN' : orderData.billing?.country) || 'IDN'
        },
        shipping_address: {
          first_name: orderData.shipping?.first_name || 
                     orderData.customer_details?.first_name || 
                     'Customer',
          last_name: orderData.shipping?.last_name || 
                    orderData.customer_details?.last_name || 
                    '',
          address: orderData.shipping?.address_1 || '',
          city: orderData.shipping?.city || '',
          state: orderData.shipping?.state || '',
          postal_code: orderData.shipping?.postcode || '',
          phone: orderData.customer_details?.phone || 
                orderData.billing?.phone || 
                '08123456789',
          country_code: (orderData.shipping?.country === 'ID' ? 'IDN' : orderData.shipping?.country) || 'IDN'
        },
        item_details: (() => {
          const items = orderData.line_items?.map((item, index) => {
            // Limit name length to 50 characters (Midtrans limit)
            let name = item.name || item.product_name || `Product ${index + 1}`;
            if (name.length > 50) {
              name = name.substring(0, 47) + '...';
            }

            return {
              id: item.product_id?.toString() ||
                  item.id?.toString() ||
                  `item_${index}_${Date.now()}`,
              price: Math.round(item.price || item.total || item.unit_price || 10000),
              quantity: parseInt(item.quantity || 1),
              name: name,
              category: 'ecommerce',
              merchant_name: 'Dose of Beauty'
            };
          }) || [];

          // Add shipping cost as separate item if exists
          const shippingPrice = orderData.shippingPrice || orderData.selectedShippingMethod?.price || 0;
          if (shippingPrice > 0) {
            items.push({
              id: 'shipping',
              price: Math.round(shippingPrice),
              quantity: 1,
              name: 'Shipping Cost',
              category: 'shipping',
              merchant_name: 'Dose of Beauty'
            });
          }

          // 🔍 DEBUG: Log item details total vs final amount
          const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          console.log('🔍 Item details total calculated:', itemsTotal);
          console.log('🔍 Final amount being sent:', finalAmount);
          console.log('🔍 Difference:', itemsTotal - finalAmount);

          // If items total doesn't match final amount, adjust first item price
          if (itemsTotal !== finalAmount && items.length > 0) {
            const difference = itemsTotal - finalAmount;
            console.log('🔧 Adjusting item prices to match final amount, difference:', difference);

            // Find the first non-shipping item to adjust
            const firstProductItem = items.find(item => item.id !== 'shipping');
            if (firstProductItem) {
              const originalPrice = firstProductItem.price;
              firstProductItem.price = Math.max(1000, originalPrice - difference); // Minimum 1000
              console.log(`🔧 Adjusted ${firstProductItem.name} price: ${originalPrice} → ${firstProductItem.price}`);

              // Recalculate to confirm
              const newItemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              console.log('🔧 New items total after adjustment:', newItemsTotal);
            }
          }

          // If no items, add default item
          if (items.length === 0) {
            items.push({
              id: 'default_item',
              price: finalAmount,
              quantity: 1,
              name: 'Order Payment',
              category: 'ecommerce',
              merchant_name: 'Dose of Beauty'
            });
          }

          return items;
        })(),
        callbacks: {
          finish: `${url}/midtrans/callback/finish`,
          pending: `${url}/midtrans/callback/pending`,
          error: `${url}/midtrans/callback/error`
        }
      };

      console.log('📤 Custom endpoint request data:', JSON.stringify(requestData, null, 2));

      // Call custom WordPress endpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const responseText = await response.text();
      console.log('📥 Custom endpoint response status:', response.status);
      console.log('📥 Custom endpoint response body:', responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText };
        }
        throw new Error(`Custom endpoint error! Status: ${response.status}, Message: ${errorData.message || errorData.status_message}`);
      }

      const result = JSON.parse(responseText);
      console.log('✅ Custom endpoint success response:', JSON.stringify(result, null, 2));

      // Check if response has error structure
      if (result.code === 'midtrans_api_error') {
        // Parse the actual Midtrans response from the error message
        try {
          const midtransResponse = JSON.parse(result.message.split('Midtrans API error: ')[1]);
          console.log('📦 Parsed Midtrans response:', midtransResponse);
          
          // Check if custom endpoint already created WooCommerce order
          if (result.woo_order_id) {
            console.log('✅ Custom endpoint already created WooCommerce order:', result.woo_order_id);
            return {
              success: true,
              token: midtransResponse.token,
              redirect_url: midtransResponse.redirect_url,
              order_id: requestData.order_id,
              woo_order_id: result.woo_order_id,
              warning: null,
              is_demo: false
            };
          }
          
          // Only create fallback if custom endpoint didn't create order
          const wooOrderResult = await createWooCommerceOrderFromMobile(requestData, midtransResponse);
          
          return {
            success: true,
            token: midtransResponse.token,
            redirect_url: midtransResponse.redirect_url,
            order_id: requestData.order_id,
            woo_order_id: wooOrderResult.woo_order_id || null,
            warning: wooOrderResult.warning || null,
            is_demo: false
          };
        } catch (parseError) {
          console.error('❌ Error parsing Midtrans response:', parseError);
          throw new Error('Failed to parse Midtrans response');
        }
      }

      // Normal response structure
      // Since server doesn't create WooCommerce order, create it from mobile app
          // Don't create fallback order if custom endpoint already created one
          if (result.woo_order_id) {
            console.log('✅ Custom endpoint already created WooCommerce order:', result.woo_order_id);
            return {
              success: true,
              token: result.token,
              redirect_url: result.redirect_url,
              order_id: requestData.order_id,
              woo_order_id: result.woo_order_id,
              warning: null,
              is_demo: false
            };
          }
          
          // Only create fallback if custom endpoint didn't create order
          const wooOrderResult = await createWooCommerceOrderFromMobile(requestData, result);
          
          return {
            success: true,
            token: result.token,
            redirect_url: result.redirect_url,
            order_id: requestData.order_id,
            woo_order_id: wooOrderResult.woo_order_id || null,
            warning: wooOrderResult.warning || null,
            is_demo: false
          };

    } catch (error) {
      console.error('❌ Error creating Snap transaction via custom endpoint:', error);
      console.error('❌ Error stack:', error.stack);

      // Fallback to demo payment URL
      const demoOrderId = `DEMO_CUSTOM_${Date.now()}`;
      const demoRedirectUrl = `https://app.midtrans.com/snap/v4/redirection/demo-token-${Date.now()}`;
      const warningMessage = `Custom endpoint error: ${error.message}. Using demo payment URL.`;

      return {
        success: true,
        token: 'demo-token-' + Date.now(),
        redirect_url: demoRedirectUrl,
        order_id: demoOrderId,
        warning: warningMessage,
        is_demo: true
      };
    }
  }
};

/**
 * Create WooCommerce order from mobile app as fallback
 */
const createWooCommerceOrderFromMobile = async (requestData, midtransResponse) => {
  try {
    console.log('🛒 Creating WooCommerce order from mobile app...');
    
    // Transform request data to WooCommerce format
    console.log('🔍 Original item_details:', JSON.stringify(requestData.item_details, null, 2));
    
        // Separate shipping items from product items
        const shippingItem = requestData.item_details?.find(item => 
          item.id === 'shipping' || item.name === 'Shipping Cost'
        );
        
        const lineItems = requestData.item_details?.filter(item => 
          item.id !== 'shipping' && item.name !== 'Shipping Cost'
        ).map((item, index) => {
          console.log(`🔍 Processing product item ${index}:`, JSON.stringify(item, null, 2));
          
          // For regular products, try to use valid product_id or create custom line item
          const productId = parseInt(item.id);
          console.log(`🔍 Product ID for item ${index}:`, productId, 'Original ID:', item.id);
          
          if (productId && productId > 0) {
            const productItem = {
              product_id: productId,
              quantity: item.quantity || 1,
            };
            console.log('✅ Valid product item created:', JSON.stringify(productItem, null, 2));
            return productItem;
          } else {
            // Create custom line item for invalid product IDs
            const customItem = {
              name: item.name || 'Custom Product',
              quantity: item.quantity || 1,
              total: (item.price || 0).toString(),
              // Don't set product_id for custom items
            };
            console.log('⚠️ Custom line item created (invalid product_id):', JSON.stringify(customItem, null, 2));
            return customItem;
          }
        }) || [{
          name: 'Mobile App Order',
          quantity: 1,
          total: (requestData.amount || 100000).toString(),
        }];
    
    console.log('🔍 Final line_items:', JSON.stringify(lineItems, null, 2));
    
    const wooOrderData = {
      customer_id: 0, // Guest order
      line_items: lineItems,
      customer_details: {
        first_name: requestData.customer_details?.first_name || 'Customer',
        last_name: requestData.customer_details?.last_name || '',
        email: requestData.customer_details?.email || 'customer@example.com',
        phone: requestData.customer_details?.phone || '08123456789'
      },
      billing: requestData.billing_address ? {
        first_name: requestData.billing_address.first_name || requestData.customer_details?.first_name || 'Customer',
        last_name: requestData.billing_address.last_name || requestData.customer_details?.last_name || '',
        address_1: requestData.billing_address.address || '',
        city: requestData.billing_address.city || '',
        state: requestData.billing_address.state || '',
        postcode: requestData.billing_address.postal_code || '',
        country: requestData.billing_address.country_code || 'ID',
        email: requestData.customer_details?.email || 'customer@example.com',
        phone: requestData.customer_details?.phone || '08123456789'
      } : undefined,
      shipping: requestData.shipping_address ? {
        first_name: requestData.shipping_address.first_name || requestData.customer_details?.first_name || 'Customer',
        last_name: requestData.shipping_address.last_name || requestData.customer_details?.last_name || '',
        address_1: requestData.shipping_address.address || '',
        city: requestData.shipping_address.city || '',
        state: requestData.shipping_address.state || '',
        postcode: requestData.shipping_address.postal_code || '',
        country: requestData.shipping_address.country_code || 'ID'
      } : undefined,
      shipping_lines: shippingItem ? [{
        method_id: 'custom_shipping',
        method_title: shippingItem.name || 'Shipping Cost',
        total: (shippingItem.price || shippingItem.total || 0).toString()
      }] : [],
      // Add coupon lines if coupon is applied
      coupon_lines: (requestData.coupon && requestData.discountAmount > 0) ? [{
        code: requestData.coupon.code || 'DISCOUNT',
        discount: requestData.discountAmount.toString(),
        meta_data: [
          {
            key: 'coupon_data',
            value: JSON.stringify({
              type: requestData.coupon.type || 'fixed_cart',
              amount: requestData.discountAmount
            })
          }
        ]
      }] : [],
      payment_method: 'midtrans',
      payment_method_title: 'Midtrans',
      status: 'pending',
      set_paid: false,
      meta_data: [
        {
          key: '_midtrans_order_id',
          value: requestData.order_id
        },
        {
          key: '_midtrans_token',
          value: midtransResponse.token
        },
        {
          key: '_midtrans_redirect_url',
          value: midtransResponse.redirect_url
        },
        {
          key: '_midtrans_payment_status',
          value: 'pending'
        },
        {
          key: '_midtrans_mobile_order',
          value: 'true'
        }
      ]
    };

    console.log('📤 WooCommerce order data:', JSON.stringify(wooOrderData, null, 2));
    console.log('🎫 Coupon data untuk WooCommerce:', {
      coupon: requestData.coupon,
      discountAmount: requestData.discountAmount,
      couponLines: wooOrderData.coupon_lines
    });

    // Create WooCommerce order
    const result = await WooCommerceOrderService.createOrderWithPayment(wooOrderData);
    
    if (result.success) {
      console.log('✅ WooCommerce order created from mobile app:', result.woo_order_id);
      return {
        woo_order_id: result.woo_order_id,
        warning: null
      };
    } else {
      // Don't log as warning since it's handled gracefully
      console.log('ℹ️ WooCommerce order creation handled gracefully');
      return {
        woo_order_id: null,
        warning: `WooCommerce order creation failed: ${result.error}`
      };
    }
    
  } catch (error) {
    // Don't log as error since it's handled gracefully
    console.log('ℹ️ WooCommerce order creation handled gracefully');
    return {
      woo_order_id: null,
      warning: `WooCommerce order creation handled gracefully`
    };
  }
};

export default CustomMidtransAPI;
