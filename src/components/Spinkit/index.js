import React from 'react';
import {View, ActivityIndicator} from 'react-native';

import {Color} from '@common';
import styles from './styles';

const Spinkit = ({css}) => (
  <View style={[styles.spinner, typeof css !== 'undefined' ? css : null]}>
    <ActivityIndicator color={Color.spin} />
  </View>
);

export default React.memo(Spinkit);
