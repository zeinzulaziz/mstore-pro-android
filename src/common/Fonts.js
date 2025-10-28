/** @format */

import {Platform} from 'react-native';

const Fonts = {
  // Default font family for all text
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
  light: Platform.OS === 'ios' ? 'System' : 'Roboto-Light',
  
  // Font sizes
  sizes: {
    tiny: 12,
    small: 14,
    medium: 16,
    big: 18,
    large: 20,
    xlarge: 24,
    xxlarge: 28,
  },
  
  // Font weights
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export default Fonts;
