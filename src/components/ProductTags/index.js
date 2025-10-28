import React from 'react';
import {View, Text} from 'react-native';

import {Languages, withTheme} from '@common';
import styles from './style';
import Item from '../ChipItem';

// Function to decode HTML entities
const decodeHtmlEntities = (text) => {
  if (!text) return text;
  return text
    .replace(/&amp;/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

class ProductTags extends React.PureComponent {
  state = {
    selectedId: -1,
  };

  static defaultProps = {
    tags: [],
  };

  render() {
    const {tags} = this.props;
    const {selectedId} = this.state;
    const {
      theme: {
        colors: {text},
      },
    } = this.props;

    return (
      <View>
        <View style={styles.header}>
          <Text style={[styles.text, {color: text}]}>
            {Languages.ProductTags}
          </Text>
        </View>
        <View style={styles.container}>
          {tags.map((item, index) => (
            <Item
              item={item}
              key={index}
              label={decodeHtmlEntities(item.name)}
              onPress={this.onPress}
              selected={selectedId == item.id}
            />
          ))}
        </View>
      </View>
    );
  }

  onPress = item => {
    this.setState({selectedId: item.id});
    this.props.onSelectTag(item);
  };
}

export default withTheme(ProductTags);
