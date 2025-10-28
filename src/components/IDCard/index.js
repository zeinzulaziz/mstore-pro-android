/** @format */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
// import QRCode from 'react-native-qrcode-svg';
import {withTheme, Images, Tools} from '@common';
import * as CustomerPointsRedux from '@redux/CustomerPointsRedux';

const {width} = Dimensions.get('window');

const IDCard = ({theme, onPress}) => {
  // Get user data from Redux store
  const user = useSelector(state => state.user);
  const customerPoints = useSelector(state => state.customerPoints);
  const userData = user?.user || {
    first_name: '',
    last_name: '',
    name: 'Guest User',
    id: '000000',
    email: '',
    points: 0,
    avatar: null,
  };
  
  // Get user name from API if available, otherwise fallback to Tools.getName
  const userName = customerPoints.name || Tools.getName(userData);
  // Use id_member from API instead of user_id
  const userId = customerPoints.id_member || userData.id || userData.user_id || '000000';

  // Use points from API if available, otherwise fallback to userData.points
  const userPoints = customerPoints.points || userData.points || 0;

  // Debug logs for troubleshooting
  // console.log('IDCard - Customer Points Data:', customerPoints);
  // console.log('IDCard - QR Code URL:', customerPoints.qr_code_url);
  // console.log('IDCard - User name:', userName);
  // console.log('IDCard - User ID (id_member):', userId);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
        {/* Card Background with Gold Glitter Effect */}
        <LinearGradient
          colors={['#fae5a3', '#f0ce7e', '#fdfaf3']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.cardGradient}>
          
          {/* Gold Glitter Overlay */}
          <View style={styles.glitterOverlay}>
            {/* Subtle pattern for glitter effect */}
            <View style={styles.glitterPattern}>
              {Array.from({length: 20}).map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.glitterDot, 
                    {
                      top: Math.random() * 200,
                      left: Math.random() * 300,
                      opacity: 0.5 + Math.random() * 0.3,
                    }
                  ]} 
                />
              ))}
            </View>
          </View>
          
          {/* Card Content */}
          <View style={styles.cardContent}>
            {/* Left Side - Logo and Info */}
            <View style={styles.leftSection}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image 
                  source={Images.Logo} 
                  style={styles.logoImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.log('Logo loading error:', error);
                  }}
                />
              </View>

              {/* User Info */}
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.memberId}>ID Member #{userId}</Text>
              </View>

              {/* Rewards Section */}
              <View style={styles.rewardsContainer}>
                <View style={styles.rewardsBadge}>
                  <Text style={styles.rewardsLabel}>DoB Rewards</Text>
                  <Text style={styles.rewardsPoints}>{userPoints} points</Text>
                </View>
              </View>
            </View>

            {/* Right Side - QR Code */}
            <View style={styles.rightSection}>
              <View style={styles.qrContainer}>
                {customerPoints.qr_code_url ? (
                  <Image
                    source={{uri: customerPoints.qr_code_url}}
                    style={styles.qrImage}
                    resizeMode="contain"
                    onLoad={() => {
                      console.log('QR Code loaded successfully');
                    }}
                    onError={(error) => {
                      console.log('QR Code loading error:', error);
                    }}
                  />
                ) : (
                  <View style={styles.qrPlaceholder}>
                    <View style={styles.qrGrid}>
                      {Array.from({length: 64}).map((_, index) => (
                        <View
                          key={index}
                          style={[
                            styles.qrDot,
                            {backgroundColor: Math.random() > 0.5 ? '#000' : '#fff'},
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                )}
                              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    width: '100%',
    minWidth: '100%',
  },
  cardContainer: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: '100%',
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
    minHeight: 180,
  },
  glitterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    // Simulate glitter effect with multiple overlays
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    paddingRight: 15,
  },
  logoContainer: {
    marginBottom: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoImage: {
    width: 150,
    height: 50,
    // Keep original logo colors
  },
  userInfo: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  memberId: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.8,
  },
  rewardsContainer: {
    marginTop: 10,
  },
  rewardsBadge: {
    backgroundColor: '#FFFF00',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rewardsLabel: {
    fontSize: 10,
    color: '#8B4513',
    fontWeight: '400',
  },
  rewardsPoints: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#000000',
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrImage: {
    width: 120,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333333',
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  qrDot: {
    width: '12.5%',
    height: '12.5%',
  },
  // Gold Glitter Effect Styles
  glitterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  glitterPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glitterDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});

export default withTheme(IDCard);
