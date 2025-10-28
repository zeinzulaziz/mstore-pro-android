/** @format */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Text, View, TouchableOpacity, I18nManager} from 'react-native';
import {WishListIcon, ImageCache, ProductPrice} from '@components';
import css from './style';
import {withTheme} from '@common';

class SimpleLayout extends PureComponent {
  static propTypes = {
    post: PropTypes.object,
    type: PropTypes.string,
    // date: PropTypes.any,
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
      currency,
    } = this.props;

    const {
      theme: {
        colors: {background, text, lineColor},
      },
    } = this.props;

    const price = {
      alignItems: 'flex-start',
      marginLeft: 5,
    };
    const priceRTL = {
      alignItems: 'flex-end',
      marginRight: 5,
    };

    // Special layout for News type
    if (type === 'news') {
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

    // Default layout for other types
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          css.panelList,
          I18nManager.isRTL && {flexDirection: 'row-reverse'},
          {backgroundColor: background, borderColor: lineColor},
        ]}
        onPress={viewPost}>
        <View style={css.simpleContent}>
          <Text style={[css.simpleTitle, {color: text}]}>{title}</Text>
          {description && <Text style={css.simpleDesc}>{description}</Text>}
          <View>
            {typeof type === 'undefined' && (
              <ProductPrice
                currency={currency}
                product={post}
                style={I18nManager.isRTL ? priceRTL : price}
                hideDisCount
              />
            )}
            {category && (
              <TouchableOpacity onPress={viewCategory}>
                <Text style={css.category}>- {category}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ImageCache uri={imageURL} style={css.simpleImage} />
        {typeof type === 'undefined' && (
          <WishListIcon product={post} style={{top: 15}} />
        )}
      </TouchableOpacity>
    );
  }
}

export default withTheme(SimpleLayout);
