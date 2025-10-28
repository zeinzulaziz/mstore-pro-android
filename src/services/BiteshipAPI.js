import { Config } from '@common';

const BITESHIP_API_KEY = 'biteship_wocm.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV29vQ29tbWVyY2UgUHJlbWl1bSIsInVzZXJJZCI6IjY4YjAxNzZlMjRlOTE5MDAxMmQzZjVlMCIsImlhdCI6MTc1NzU3MjcwMX0.BbW28pBZogve4djZRwOJIANLCQyGStEtK63uDfXG-Sk';
const BITESHIP_BASE_URL = 'https://api.biteship.com/v1';

// No longer needed - using coordinates instead of area IDs

class BiteshipAPI {
  static async getShippingRates(origin, destination, items, courier = null) {
    try {
      // Use coordinates for accurate shipping calculation
      const payload = {
        origin_postal_code: origin.postal_code || '12190',
        destination_postal_code: destination.postal_code || '12190',
        origin_latitude: origin.latitude || -6.2088,
        origin_longitude: origin.longitude || 106.8456,
        destination_latitude: destination.latitude || -6.2088,
        destination_longitude: destination.longitude || 106.8456,
        couriers: courier ? courier : 'jne,sicepat,anteraja,tiki,pos,jnt,sap',
        items: items.map(item => ({
          name: item.name,
          value: item.value,
          weight: item.weight || 500, // Use actual product weight
          quantity: item.quantity || 1
        }))
      };

      console.log('Biteship API Request:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${BITESHIP_BASE_URL}/rates/couriers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BITESHIP_API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      console.log('Biteship API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Biteship API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Biteship API Success Response:', JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error('Biteship API Error:', error);
      throw error;
    }
  }

  static async getCouriers() {
    try {
      const response = await fetch(`${BITESHIP_BASE_URL}/couriers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${BITESHIP_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Biteship Couriers API Error:', error);
      throw error;
    }
  }

  static async createOrder(orderData) {
    try {
      const response = await fetch(`${BITESHIP_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BITESHIP_API_KEY}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Biteship Create Order Error:', error);
      throw error;
    }
  }

  static async trackOrder(waybillId, courierCode) {
    try {
      const response = await fetch(`${BITESHIP_BASE_URL}/trackings/${waybillId}/couriers/${courierCode}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${BITESHIP_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Biteship Tracking Error:', error);
      throw error;
    }
  }

  static async createLocation(locationData) {
    try {
      const payload = {
        name: locationData.name,
        contact_name: locationData.contact_name,
        contact_phone: locationData.contact_phone,
        address: locationData.address,
        note: locationData.note || '',
        postal_code: locationData.postal_code,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        type: locationData.type || 'destination'
      };

      console.log('Biteship Create Location Request:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${BITESHIP_BASE_URL}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BITESHIP_API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      console.log('Biteship Create Location Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Biteship Create Location Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Biteship Create Location Success Response:', JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error('Biteship Create Location Error:', error);
      throw error;
    }
  }
}

export default BiteshipAPI;
