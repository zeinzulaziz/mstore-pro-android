import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

class GeolocationService {
  static async requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to location to calculate accurate shipping rates.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS permission handled by Info.plist
  }

  static async getCurrentPosition() {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          (error) => {
            console.error('Geolocation error:', error);
            reject(new Error('Unable to get current location'));
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      });
    } catch (error) {
      console.error('Geolocation service error:', error);
      throw error;
    }
  }

  static async getLocationWithFallback() {
    try {
      const position = await this.getCurrentPosition();
      return position;
    } catch (error) {
      // Fallback to default Jakarta coordinates
      console.warn('Using fallback coordinates for Jakarta');
      return {
        latitude: -6.2088,
        longitude: 106.8456,
        accuracy: null,
      };
    }
  }
}

export default GeolocationService;
