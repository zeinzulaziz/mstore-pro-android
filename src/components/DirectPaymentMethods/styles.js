/** @format */

import { StyleSheet, Dimensions } from 'react-native';
import { Color, Fonts } from '@common';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.text,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Color.textSecondary,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  
  paymentMethodsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  paymentSection: {
    marginBottom: 20,
  },
  
  paymentMethodCard: {
    backgroundColor: Color.white,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Color.border,
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  selectedPaymentMethod: {
    borderColor: Color.primary,
    borderWidth: 2,
    backgroundColor: Color.primaryLight,
  },
  
  disabledPaymentMethod: {
    opacity: 0.6,
    backgroundColor: Color.backgroundSecondary,
  },
  
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  paymentMethodInfo: {
    flex: 1,
  },
  
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Color.text,
    marginBottom: 4,
  },
  
  paymentMethodDescription: {
    fontSize: 14,
    color: Color.textSecondary,
    marginBottom: 4,
  },
  
  pendingText: {
    fontSize: 12,
    color: Color.warning,
    fontStyle: 'italic',
  },
  
  disabledText: {
    color: Color.textSecondary,
  },
  
  paymentMethodStatus: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
  },
  
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  selectedIndicatorText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  pendingIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Color.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  pendingIndicatorText: {
    color: Color.white,
    fontSize: 12,
  },
  
  processPaymentContainer: {
    padding: 20,
    backgroundColor: Color.white,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  
  processPaymentButton: {
    backgroundColor: Color.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  processPaymentButtonDisabled: {
    backgroundColor: Color.textSecondary,
  },
  
  processPaymentButtonText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Test Button Styles
  testContainer: {
    padding: 20,
    backgroundColor: Color.backgroundSecondary,
  },
  
  testButton: {
    backgroundColor: Color.warning,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  
  testButtonSecondary: {
    backgroundColor: Color.primary,
  },
  
  testButtonTertiary: {
    backgroundColor: Color.success,
  },
  
  testButtonQuaternary: {
    backgroundColor: Color.info,
  },
  
  testButtonText: {
    color: Color.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
