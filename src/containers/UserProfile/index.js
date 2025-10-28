/** @format */

import React, {PureComponent} from 'react';
import {View, ScrollView, Text, Switch, Linking, Alert, Clipboard} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import _ from 'lodash';

import {
  UserProfileItem,
  IDCard,
  ModalBox,
  CurrencyPicker,
} from '@components';
import {Languages, Color, Tools, Config, withTheme} from '@common';
import {getNotification} from '@app/Omni';

import styles from './styles';

class UserProfile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pushNotification: false,
    };
  }

  componentDidMount() {
    this._getNotificationStatus();
    this._handleSwitchNotification(true);
    this._fetchCustomerPoints();
  }

  componentDidUpdate(prevProps) {
    const {userProfile} = this.props;
    const {userProfile: prevUserProfile} = prevProps;

    // Fetch customer points when user logs in
    if (userProfile.user && userProfile.user.id &&
        (!prevUserProfile.user || prevUserProfile.user.id !== userProfile.user.id)) {
      this._fetchCustomerPoints();
    }
  }

  _getNotificationStatus = async () => {
    const notification = await getNotification();

    this.setState({pushNotification: notification || false});
  };

  /**
   * TODO: refactor to config.js file
   */
  _getListItem = () => {
    const {currency, wishListTotal, userProfile, isDarkTheme} = this.props;
    const listItem = [...Config.ProfileSettings];
    console.log('ProfileSettings from Config:', listItem); // Debug log
    const items = [];
    let index = 0;

    for (let i = 0; i < listItem.length; i++) {
      const item = listItem[i];
      if (item.label === 'PushNotification') {
        item.icon = () => (
          <Switch
            onValueChange={this._handleSwitchNotification}
            value={this.state.pushNotification}
            trackColor={Color.blackDivide}
          />
        );
      }
      if (item.label === 'DarkTheme') {
        item.icon = () => (
          <Switch
            onValueChange={this._onToggleDarkTheme}
            value={isDarkTheme}
            trackColor={Color.blackDivide}
          />
        );
      }
      if (item.label === 'Currency') {
        item.value = currency.code;
      }
      if (item.label === 'DeleteAccount') {
        item.value = ''; // Empty value for DeleteAccount
      }

      if (item.label === 'WishList') {
        items.push({
          ...item,
          label: `${Languages.WishList} (${wishListTotal})`,
        });
      } else {
        items.push({
          ...item, 
          label: Languages[item.label],
          // Preserve web link properties
          isWebLink: item.isWebLink,
          webUrl: item.webUrl,
        });
      }
    }

    if (!userProfile.user) {
      index = _.findIndex(items, item => item.label === Languages.Address);
      if (index > -1) {
        items.splice(index, 1);
      }
    }

    if (!userProfile.user || Config.Affiliate.enable) {
      index = _.findIndex(items, item => item.label === Languages.MyOrder);
      if (index > -1) {
        items.splice(index, 1);
      }
    }
    
    // Add DeleteAccount item manually
    items.push({
      label: Languages.DeleteAccount,
      isWebLink: true,
      webUrl: 'https://doseofbeauty.id/my-account/delete-account/',
      value: '',
    });
    
    console.log('Final items:', items); // Debug log
    return items;
  };

  _onToggleDarkTheme = () => {
    this.props.toggleDarkTheme();
  };

  _handleSwitchNotification = value => {
    AsyncStorage.setItem('@notification', JSON.stringify(value), () => {
      this.setState({
        pushNotification: value,
      });
    });
  };

  _fetchCustomerPoints = () => {
    const {userProfile, fetchCustomerPoints} = this.props;
    const user = userProfile.user || {};

    if (user && user.id) {
      fetchCustomerPoints(user.id);
    }
  };

  _handlePress = item => {
    const {navigation} = this.props;
    const {routeName, isActionSheet, isWebLink, webUrl} = item;

    console.log('Item pressed:', item); // Debug log

    if (isWebLink && webUrl) {
      console.log('Opening web link:', webUrl); // Debug log
      this._openWebLink(webUrl);
      return;
    }

    if (routeName && !isActionSheet) {
      navigation.navigate(routeName, item.params);
    }

    if (isActionSheet) {
      this.currencyPicker.openModal();
    }
  };

  _openWebLink = async (url) => {
    console.log('_openWebLink called with URL:', url); // Debug log
    try {
      // Try to open URL directly without checking canOpenURL first
      // Sometimes canOpenURL returns false even for valid URLs
      await Linking.openURL(url);
      console.log('URL opened successfully'); // Debug log
    } catch (error) {
      console.log('Error opening URL:', error); // Debug log
      // Fallback: try with canOpenURL check
      try {
        const supported = await Linking.canOpenURL(url);
        console.log('URL supported (fallback):', supported); // Debug log
        if (supported) {
          await Linking.openURL(url);
          console.log('URL opened successfully (fallback)'); // Debug log
        } else {
          // Copy URL to clipboard as fallback
          Clipboard.setString(url);
          Alert.alert(
            'URL Copied', 
            'Cannot open URL directly. The URL has been copied to your clipboard. Please paste it in your browser.',
            [
              {text: 'OK', style: 'default'}
            ]
          );
        }
      } catch (fallbackError) {
        console.log('Fallback error:', fallbackError); // Debug log
        // Copy URL to clipboard as final fallback
        Clipboard.setString(url);
        Alert.alert(
          'URL Copied', 
          'Failed to open URL. The URL has been copied to your clipboard. Please paste it in your browser.',
          [
            {text: 'OK', style: 'default'}
          ]
        );
      }
    }
  };

  _handleIDCardPress = () => {
    // ID Card click no longer triggers logout or navigation
    // This method is now disabled - ID Card is just for display
    console.log('ID Card clicked - no action taken');
  };

  render() {
    const {userProfile, navigation, currency, changeCurrency} = this.props;
    const user = userProfile.user || {};
    const name = Tools.getName(user);
    const listItem = this._getListItem();
    const {
      theme: {
        colors: {background},
        dark,
      },
    } = this.props;

    return (
      <View style={[styles.container, {backgroundColor: background}]}>
        <ScrollView ref="scrollView">
          <IDCard />

          {userProfile.user && (
            <View style={[styles.profileSection(dark)]}>
              <Text style={styles.headerSection}>
                {Languages.AccountInformations.toUpperCase()}
              </Text>
              <UserProfileItem
                label={Languages.Name}
                onPress={this._handlePress}
                value={name}
              />
              <UserProfileItem label={Languages.Email} value={user.email} />
              {/* <UserProfileItem label={Languages.Address} value={user.address} /> */}
            </View>
          )}

          <View style={[styles.profileSection(dark)]}>
            {listItem.map((item, index) => {
              return (
                item && (
                  <UserProfileItem
                    icon
                    key={index.toString()}
                    onPress={() => this._handlePress(item)}
                    {...item}
                  />
                )
              );
            })}
          </View>
        </ScrollView>

        <ModalBox ref={c => (this.currencyPicker = c)}>
          <CurrencyPicker currency={currency} changeCurrency={changeCurrency} />
        </ModalBox>
      </View>
    );
  }
}

const mapStateToProps = ({user, language, currency, wishList, app}) => ({
  userProfile: user,
  language,
  currency,
  wishListTotal: wishList.wishListItems.length,
  isDarkTheme: app.isDarkTheme,
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const {dispatch} = dispatchProps;
  const {actions: CurrencyActions} = require('@redux/CurrencyRedux');
  const {toggleDarkTheme} = require('@redux/AppRedux');
  const {actions: CustomerPointsActions} = require('@redux/CustomerPointsRedux');
  return {
    ...ownProps,
    ...stateProps,
    changeCurrency: currency =>
      CurrencyActions.changeCurrency(dispatch, currency),
    toggleDarkTheme: () => {
      dispatch(toggleDarkTheme());
    },
    fetchCustomerPoints: (userId) => {
      dispatch(CustomerPointsActions.fetchCustomerPoints(userId));
    },
  };
}

export default connect(
  mapStateToProps,
  null,
  mergeProps,
)(withTheme(UserProfile));
