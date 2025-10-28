/** @format */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, I18nManager } from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import { Constants, Languages } from '@common';
import FlashSaleCountdown from '@components/FlashSaleCountdown';
import styles from './styles';

const FlashSaleHeader = ({ showCategoriesScreen, config, viewAll, theme }) => {
  const [flashSaleActive, setFlashSaleActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const text = theme?.colors?.text;

  useEffect(() => {
    // Check flash sale status
    const fetchFlashSaleStatus = async () => {
      try {
        const response = await fetch('https://doseofbeauty.id/wp-json/flash-sale/v1/status');
        if (response.ok) {
          const data = await response.json();
          setFlashSaleActive(data.active);
        }
      } catch (error) {
        console.log('Error checking flash sale status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleStatus();

    // Refresh every 30 seconds
    const interval = setInterval(fetchFlashSaleStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Don't render header if flash sale is not active and loading is complete
  if (!loading && !flashSaleActive) {
    return null;
  }

  // Only log in development mode
  if (__DEV__) {
    console.log('FlashSaleHeader rendering:', { loading, flashSaleActive });
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={[styles.tagHeader, { color: text }]}>
          {Languages[config.name]}
        </Text>
        <FlashSaleCountdown
          theme={theme}
          isActive={flashSaleActive}
          skipFetch={true}
        />
      </View>
      <TouchableOpacity
        onPress={
          config.layout !== Constants.Layout.circleCategory
            ? viewAll
            : showCategoriesScreen
        }
        style={styles.headerRight}
      >
        <Text style={[styles.headerRightText, { color: text }]}>
          {Languages.seeAll}
        </Text>
        <Icon
          style={styles.icon}
          color={text}
          size={20}
          name={
            I18nManager.isRTL ? 'chevron-small-left' : 'chevron-small-right'
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default FlashSaleHeader;