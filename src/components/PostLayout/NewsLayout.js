/** @format */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Text, View, TouchableOpacity} from 'react-native';
import {ImageCache} from '@components';
import css from './style';
import {withTheme} from '@common';

class NewsLayout extends PureComponent {
  static propTypes = {
    post: PropTypes.object,
    type: PropTypes.string,
    date: PropTypes.any,
    description: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.any,
    imageURL: PropTypes.string,
    viewPost: PropTypes.func,
    viewCategory: PropTypes.func,
  };

  render() {
    const {
      imageURL,
      post,
      type,
      title,
      description,
      date,
      viewPost,
      category,
      viewCategory,
    } = this.props;

    const {
      theme: {
        colors: {background, text, lineColor},
      },
    } = this.props;

    console.log('NewsLayout rendering with:', {type, title, date});

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          css.newsCard,
          {backgroundColor: background, borderColor: lineColor},
        ]}
        onPress={viewPost}>
        {/* Full width image */}
        <ImageCache uri={imageURL} style={css.newsImage} />
        
        {/* Content area */}
        <View style={css.newsContent}>
          {/* Date */}
          {date && (
            <Text style={[css.newsDate, {color: '#999'}]}>
              {new Date(date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          )}
          
          {/* Title */}
          <Text style={[css.newsTitle, {color: text}]}>{title}</Text>
          
          {/* Description */}
          {description && <Text style={css.newsDesc}>{description}</Text>}
        </View>
      </TouchableOpacity>
    );
  }
}

export default withTheme(NewsLayout);
