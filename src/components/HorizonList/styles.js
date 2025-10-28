/** @format */

import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Constants, Fonts } from '@common';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  flatWrap: {
    flex: 1,
    paddingLeft: 0,
    marginTop: 0,
    marginBottom: 15,
  },
  flatlist: {
    flexDirection: 'row',
  },
  mainList: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,

    ...Platform.select({
      ios: {
        paddingTop: 10,
      },
      android: {
        paddingTop: 60,
      },
    }),
  },
  flatVertical: (theme) => ({
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: theme?.colors?.background || '#fff',
  }),
  isListing: {
    marginTop: 60,
  },
  more: {
    width,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  spinView: (theme) => ({
    width,
    backgroundColor: theme?.colors?.background || '#fff',
    flex: 1,
    height,
    paddingTop: 20,
  }),
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    backgroundColor: 'transparent',
    // borderBottomColor: 'none',
    // borderBottomWidth: 1,
    height: 40,
    justifyContent: 'center',
  },
  contentContainer: {
    paddingTop: 40,
  },
  title: {
    color: '#333333',
  },
  row: {
    height: 300,
    width: null,
    marginBottom: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  rowText: {
    color: 'white',
    fontSize: 18,
  },
  transparentTop: {
    backgroundColor: 'transparent',
  },
  // RenderHedearListView
  header: {
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  headerLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 0,
    flexDirection: 'row',
  },
  headerRight: {
    flex: 1 / 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 0,
    flexDirection: 'row',
  },
  headerRightText: {
    fontSize: 11,
    marginRight: 0,
    marginTop: 0,
    color: '#666',
    fontFamily: Fonts.regular,
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
    backgroundColor: 'transparent',
  },

  tagHeader: {
    fontSize: 20,
    color: '#2c3e50',
    fontFamily: Fonts.bold,
    fontWeight: '600',
  },

  headerLogo: {
    marginLeft: 0,

    ...Platform.select({
      ios: {
        paddingTop: 10,
      },
      android: {
        paddingTop: 0,
      },
    }),
  },
  headerDate: {
    fontSize: 14,
    // width: 120,
    paddingTop: 5,
    marginBottom: 0,
    fontWeight: '400',
    opacity: 0.8,
    fontFamily: Fonts.regular,
  },
  logo: {
    height: 50,
    width: 120,
    resizeMode: 'contain',
  },
});
