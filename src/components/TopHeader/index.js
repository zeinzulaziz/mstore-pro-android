/** @format */

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {withTheme} from '@common';
import styles from './styles';

const {width} = Dimensions.get('window');

const TopHeader = ({theme, onSearchPress, onNotificationPress, onRefreshPress}) => {
  const [searchText, setSearchText] = useState('');
  const notificationCount = 5; // Dummy notification count

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress(searchText);
    }
  };

  return (
    <View style={styles.container}>
      {/* Radial Gradient Background */}
      <View style={styles.gradientBackground}>
        {/* Base color */}
        <View style={[styles.radialBase, {backgroundColor: '#ffe9c5'}]} />
        
        {/* Radial gradient effect using multiple layers */}
        <LinearGradient
          colors={['#f08e4b', 'rgba(249, 157, 96, 0.3)', 'transparent']}
          start={{x: 0.3, y: 0.2}}
          end={{x: 0.8, y: 0.8}}
          style={styles.radialGradient1}
        />
        <LinearGradient
          colors={['transparent', 'rgba(255, 233, 197, 0.8)', '#ffe9c5']}
          start={{x: 0.1, y: 0.1}}
          end={{x: 0.6, y: 0.6}}
          style={styles.radialGradient2}
        />
        <LinearGradient
          colors={['rgba(240, 142, 75, 0.6)', 'transparent', 'rgba(255, 233, 197, 0.4)']}
          start={{x: 0.4, y: 0.4}}
          end={{x: 1, y: 1}}
          style={styles.radialGradient3}
        />
      </View>
      
      {/* Header Content */}
      <View style={styles.headerContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('@images/logo_header.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="what are you looking for?"
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
            onFocus={handleSearchPress}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchPress}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => onRefreshPress && onRefreshPress()}>
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Notification Icon */}
        {/* <TouchableOpacity
          style={styles.notificationContainer}
          onPress={() => onNotificationPress && onNotificationPress()}>
          <Icon name="notifications" size={24} color="#fff" />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity> */}
      </View>
    </View>
  );
};


export default withTheme(TopHeader);
