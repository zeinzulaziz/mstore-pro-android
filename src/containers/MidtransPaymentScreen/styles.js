/** @format */

import { StyleSheet } from 'react-native';
import { Color, Fonts } from '@common';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Color.primary,
  },
  content: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  demoWarningContainer: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    margin: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  demoWarningTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    fontWeight: '600',
    marginBottom: 4,
  },
  demoWarningText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  methodText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginTop: 10,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    color: Color.red,
  },
  
  // Payment Details Styles
  paymentDetails: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  
  paymentDetailsTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  
  paymentDetailsText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginBottom: 4,
  },
  
  // Button Styles
  continueButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
  },
  
  retryButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
  },
  
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
  },
  
  errorMessage: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginTop: 8,
    textAlign: 'center',
  },
});

