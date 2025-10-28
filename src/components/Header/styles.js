/** @format */

import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Color, Fonts } from '@common';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    backgroundColor: Color.background,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Color.text,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: Fonts.bold,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});
