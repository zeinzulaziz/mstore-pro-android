/** @format */

import { StyleSheet } from 'react-native';
import { Color } from '@common';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Color.background,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
