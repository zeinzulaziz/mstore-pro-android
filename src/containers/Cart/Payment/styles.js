/** @format */

import { StyleSheet, Dimensions } from 'react-native';
import { Color, Constants, Fonts } from '@common';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "white",
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  paymentOption: {
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  optionContainer: {
    width: (width - 30 - 16) / 2, // width - paddingHorizontal - margin between cards
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  btnOption: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e1e5e9',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedBtnOption: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f0ed',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#a96b4f',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a96b4f',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  imgOption: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  message: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    padding: 24,
    marginTop: 8,
    paddingTop: 16,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 0,
    borderRadius: 8,
  },
  formCard: {
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 10,
  },
  btnNextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnNext: {
    marginBottom: 20,
    backgroundColor: '#0091ea',
    height: 40,
    width: 200,
    borderRadius: 20,
  },
  btnNextText: {
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: Color.Text,
    fontFamily: Fonts.bold,
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 8,
    fontWeight: '600',
  },
  descriptionView: {
    marginTop: 20,
  },
  paymentLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: Fonts.regular,
  },
});
