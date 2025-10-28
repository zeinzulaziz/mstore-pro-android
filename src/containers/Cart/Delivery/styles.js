/** @format */

import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Color, Fonts } from '@common';

const { width, height } = Dimensions.get('window');

const vh = height / 100;
export default StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
  },
  deliveryCart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  form: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  notes: {
    height: 400,
    marginBottom: 100,
  },
  input: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
    height: vh * 7,
  },
  firstInput: {
    alignItems: 'center',
    position: 'absolute',
    top: Platform.OS === 'ios' ? -20 : 10,
    right: 20,
    left: 20,
  },
  inputAndroid: {
    width: width - 50,
    height: vh * 7,
    paddingLeft: 10,
    marginTop: 10,
    position: 'relative',
  },
  lastInput: {
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? -20 : 10,
    right: 20,
    left: 20,
  },
  btnNextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  btnNext: {
    backgroundColor: '#0091ea',
    height: 40,
    width: 200,
    borderRadius: 20,
  },
  btnNextText: {
    fontWeight: 'bold',
  },
  picker: {
    width: width - 80,
  },
  formAddress: {
    borderColor: '#d4dce1',
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    height: 200,
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  shippingMethod: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  shippingDesc: {
    marginTop: 0,
    marginBottom: 20,
  },
  formContainer: {
    padding: 10,
    paddingBottom: 50,
  },
  locationContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  locationButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  locationButton: {
    backgroundColor: Color.primary,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  halfButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  mapButton: {
    backgroundColor: '#4CAF50',
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.regular,
    fontWeight: '600',
  },
  locationStatus: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    color: '#1976d2',
  },
  addressDetailsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    width: '100%',
  },
  addressDetailsTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Color.primary,
  },
  addressComponents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  addressComponent: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginBottom: 4,
    flex: 1,
    minWidth: '45%',
  },
});
