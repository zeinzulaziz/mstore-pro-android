import { StyleSheet } from 'react-native';
import { Color, Fonts } from '@common';

export default StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    fontWeight: '600',
    marginBottom: 8,
  },
  shippingMethodsList: {
    // maxHeight will be set dynamically via props
    paddingRight: 4, // Add padding for scroll indicator
  },
  shippingMethodItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Color.border,
  },
  shippingMethodContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  courierInfo: {
    flex: 1,
    marginRight: 8,
  },
  courierNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  courierName: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    fontWeight: '600',
    flex: 1,
  },
  selectedIndicator: {
    backgroundColor: Color.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  selectedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  serviceName: {
    fontSize: 11,
    fontFamily: Fonts.regular,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  price: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
  },
  etd: {
    fontSize: 10,
    fontFamily: Fonts.regular,
  },
  description: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    lineHeight: 14,
    marginTop: 2,
  },
  tierInfo: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    marginTop: 2,
  },
  additionalInfo: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Color.grey,
    marginTop: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  featureTag: {
    backgroundColor: Color.lightBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 2,
  },
  featureText: {
    fontSize: 9,
    fontFamily: Fonts.regular,
    color: Color.text,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  loadingText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginTop: 6,
  },
  errorContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  // Scroll indicator styling
  scrollIndicator: {
    backgroundColor: Color.primary,
    borderRadius: 2,
    width: 4,
  },
});
