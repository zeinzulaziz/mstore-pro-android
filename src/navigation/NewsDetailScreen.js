/** @format */

import React, {Component} from 'react';
import {View} from 'react-native';

import {PostDetail} from '@containers';

// eslint-disable-next-line react/prefer-stateless-function
class NewsDetailScreen extends Component {
  render() {
    const {route} = this.props;

    // Safety check for route and post data
    const post = route && route.params ? route.params.post : null;

    return (
      <View style={{flex: 1}}>
        {typeof route.params !== 'undefined' && post && (
          <PostDetail post={post} />
        )}
      </View>
    );
  }
}

export default NewsDetailScreen;
