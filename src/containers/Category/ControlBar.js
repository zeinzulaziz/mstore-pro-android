/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { connect } from 'react-redux';

import { Color, Images, Styles, withTheme, Languages } from '@common';
import { DisplayMode } from '@redux/CategoryRedux';

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

const controlBarHeight = 50;

class ControlBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideSubCategory: true,
      modalVisible: false,
      selected: 1,
    };
  }

  shouldComponentUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return true;
  }

  changeModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };


  render() {
    const {
      switchDisplayMode,
      categories,
      isVisible,
      name,
      theme: {
        colors: { background, text },
        dark: isDark,
      },
    } = this.props;

    return (
      <View
        style={[
          styles.container,
          {
            height: isVisible ? controlBarHeight : 0,
            backgroundColor: background,
          },
        ]}
      >
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: text }]}>
            {decodeHtmlEntities(name)}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              onPress={() => switchDisplayMode(DisplayMode.CardMode)}
              style={styles.modeButton}
            >
              <Image
                source={Images.IconCard}
                style={[
                  styles.iconStyle,
                  categories.displayMode === DisplayMode.CardMode &&
                    styles.dark,
                  isDark && { tintColor: '#fff' },
                ]}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => switchDisplayMode(DisplayMode.ListMode)}
            style={styles.modeButton}
          >
            <Image
              source={Images.IconList}
              style={[
                styles.iconStyle,
                categories.displayMode === DisplayMode.ListMode && styles.dark,
                isDark && { tintColor: '#fff' },
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => switchDisplayMode(DisplayMode.GridMode)}
            style={styles.modeButton}
          >
            <Image
              source={Images.IconGrid}
              style={[
                styles.iconStyle,
                categories.displayMode === DisplayMode.GridMode && styles.dark,
                isDark && { tintColor: '#fff' },
              ]}
            />
          </TouchableOpacity>
        </View>
        {/* Sort functionality removed */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: controlBarHeight,
    backgroundColor: Color.category.navigationBarColor,
    borderColor: Color.lightDivide,
    borderTopWidth: 1,

    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5,

    ...Platform.select({
      ios: {
        borderBottomWidth: 1,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modeButton: {
    ...Styles.Common.ColumnCenter,
    borderColor: Color.lightDivide,
    borderLeftWidth: 1,
    width: controlBarHeight - 10,
    height: controlBarHeight - 10,
  },
  titleContainer: {
    ...Styles.Common.RowCenter,
    marginHorizontal: 0,
    flex: 1,
  },
  titleText: {
    color: Color.black,
    fontSize: 16,
    fontWeight: '600',
  },
  iconStyle: {
    resizeMode: 'contain',
    width: 18,
    height: 18,
    opacity: 0.2,
  },
  dark: {
    opacity: 0.9,
  },
});

ControlBar.propTypes = {
  switchDisplayMode: PropTypes.func.isRequired,
  isVisible: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    categories: state.categories,
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { actions } = require('@redux/CategoryRedux');

  return {
    ...ownProps,
    ...stateProps,
    switchDisplayMode: mode => {
      dispatch(actions.switchDisplayMode(mode));
    },
  };
};

export default connect(
  mapStateToProps,
  undefined,
  mergeProps,
)(withTheme(ControlBar));
