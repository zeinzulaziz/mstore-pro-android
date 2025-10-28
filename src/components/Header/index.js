/** @format */

import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { withTheme, Languages, Color, Fonts } from '@common';
import { Images } from '@common';
import styles from './styles';

const Header = ({ 
  title, 
  onBack, 
  style, 
  theme,
  hideBack = false,
  rightComponent
}) => {
  return (
    <View style={[styles.container, style, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      <View style={styles.headerContent}>
        {!hideBack && onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.colors.text }]}>←</Text>
          </TouchableOpacity>
        )}
        
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

export default withTheme(Header);
