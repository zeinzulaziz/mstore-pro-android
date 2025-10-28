/** @format */

import { StyleSheet } from 'react-native';

import { Constants, Color } from '@common';

export default StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  text: text => ({
    fontSize: 18,
    fontWeight: '400',
    color: '#ffffff',
    opacity: 0.8,
    fontFamily: Constants.fontFamily,
  }),
  selectedText: () => ({
    fontWeight: 'bold',
    color: '#ffffff',
    opacity: 1,
    // backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    width: '100%',
  }),
});
