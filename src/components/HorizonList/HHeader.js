/** @format */

import React from 'react';
import { View, Text, TouchableOpacity, I18nManager } from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import { Constants, Languages } from '@common';
import FlashSaleCountdown from '@components/FlashSaleCountdown';
import styles from './styles';

const HHeader = ({ showCategoriesScreen, config, viewAll, theme }) => {
  const text = theme?.colors?.text;

  // Only log in development mode
  if (__DEV__) {
    console.log('HHeader rendering for config.name:', config.name);
  }

  const isFlashSale = config.name === 'flashSale';

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={[styles.tagHeader, { color: text }]}>
          {Languages[config.name]}
        </Text>
        {isFlashSale && <FlashSaleCountdown theme={theme} />}
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

export default HHeader;
