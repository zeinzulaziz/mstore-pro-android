import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {connect} from 'react-redux';
import base64 from 'base-64';
import Reactotron from 'reactotron-react-native';
import Modal from 'react-native-modalbox';
import {isObject} from 'lodash';

import CustomAPI from '@services/CustomAPI';
import {BlockTimer} from '@app/Omni';
import {StepIndicator} from '@components';
import {Languages, Images, Constants, Config, withTheme, Tools} from '@common';

import MyCart from './MyCart';
import Delivery from './Delivery';
import Payment from './Payment';
import FinishOrder from './FinishOrder';
import PaymentEmpty from './Empty';
import Buttons from './Buttons';
import styles from './styles';

class Cart extends PureComponent {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    user: PropTypes.object,
    onMustLogin: PropTypes.func.isRequired,
    finishOrder: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    onFinishOrder: PropTypes.func.isRequired,
    onViewProduct: PropTypes.func,
    cartItems: PropTypes.array,
    onViewHome: PropTypes.func,
  };

  static defaultProps = {
    cartItems: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
      // createdOrder: {},
      userInfo: null,
      order: '',
      isLoading: false,
      orderId: null,
      openModal: false,
      checkOutUrl: '',
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({title: Languages.ShoppingCart});
    
    // Ensure we always start at cart page (index 0)
    this.setState({currentIndex: 0}, () => {
      if (this.tabCartView) {
        this.tabCartView.goToPage(0);
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reset current index when update cart item
    if (this.props.cartItems && nextProps.cartItems) {
      if (nextProps.cartItems.length !== 0) {
        if (this.props.cartItems.length !== nextProps.cartItems.length) {
          // Only reset to cart page if we're not already there
          if (this.state.currentIndex !== 0) {
            this.setState({currentIndex: 0}, () => {
              if (typeof this.tabCartView !== 'undefined') {
                this.tabCartView.goToPage(0);
              }
            });
          }
        }
      }
    }
  }

  checkUserLogin = () => {
    const {user} = this.props.user;

    // check anonymous checkout
    if (!Config.Login.AnonymousCheckout) {
      if (user === null) {
        this.props.onMustLogin();
        return false;
      }
    }

    return true;
  };

  onNext = () => {
    // check validate before moving next
    let valid = true;
    switch (this.state.currentIndex) {
      case 0:
        // eslint-disable-next-line no-lone-blocks
        {
          if (Config.EnableOnePageCheckout) {
            const order = {
              line_items: Tools.getItemsToCheckout(this.props.cartItems),
              token:
                this.props.user && this.props.user.token
                  ? this.props.user.token
                  : null,
            };
            const params = base64.encode(
              encodeURIComponent(JSON.stringify(order)),
            );
            CustomAPI.getCheckoutUrl({order: params}, checkOutUrl => {
              this.setState({checkOutUrl, openModal: true}, () => {
                this.checkoutModal.open();
              });
            });
            return;
          }
          valid = this.checkUserLogin();
        }
        break;

      case 1:
        // From Delivery (index 1), process payment directly with Midtrans
        if (valid) {
          this.processMidtransPayment();
        }
        return;

      default:
        break;
    }
    
    // Only proceed with navigation if validation passed and tabCartView exists
    if (valid && this.tabCartView) {
      const nextPage = this.state.currentIndex + 1;
      // Ensure nextPage is within valid range
      if (nextPage >= 0 && nextPage <= 3) {
        this.tabCartView.goToPage(nextPage);
      }
    }
  };

  renderCheckOut = () => {
    // WebView modal is no longer needed since we use native screens
    return null;
  };

  _onClosedModal = () => {
    if (this.state.orderId != null) {
      this.setState({openModal: false});
      this.checkoutModal.close();
      this.tabCartView.goToPage(3);
    }
    this.setState({isLoading: false});
  };

  _onNavigationStateChange = status => {
    const {url} = status;

    if (
      url.indexOf(Config.WooCommerce.url) === 0 &&
      url.indexOf('order-received') !== -1
    ) {
      var orderId = ((status.url.match(/(order-received\/\d+)+(\/|\?|$)/) || [
        '',
      ])[0].match(/\d+/) || [''])[0];
      if (orderId) {
        this.setState({orderId});
        // params = params[1].split("&");
        // params.forEach((val) => {
        //   const now = val.split("=");
        //   if (now[0] == "key" && now["1"].indexOf("wc_order") == 0) {
        //     this.setState({ orderId: now["1"].indexOf("wc_order") });
        //   }
        // });
      }
    }
  };

  onShowNativeOnePageCheckOut = async order => {
    // Navigate to native order summary screen instead of webview
    this.props.navigation.navigate('OrderSummaryScreen', {
      orderData: order,
    });
  };

  onShowCheckOut = async order => {
    // Navigate to native order summary screen instead of webview
    Reactotron.log('order', order);
    this.props.navigation.navigate('OrderSummaryScreen', {
      orderData: order,
    });
  };

  onPrevious = () => {
    if (this.state.currentIndex === 0) {
      this.props.onBack();
      return;
    }
    this.tabCartView.goToPage(this.state.currentIndex - 1);
  };

  updatePageIndex = page => {
    const newIndex = isObject(page) ? page.i : page;
    // Ensure we only update if the page is different
    if (this.state.currentIndex !== newIndex) {
      this.setState({currentIndex: newIndex});
    }
  };

  onChangeTabIndex = page => {
    if (this.tabCartView && typeof page === 'number' && page >= 0 && page <= 3) {
      // Map visual index back to actual tab index
      // Visual index 0 -> Tab index 0 (Cart)
      // Visual index 1 -> Tab index 1 (Delivery)  
      // Visual index 2 -> Tab index 3 (FinishOrder - skip Payment)
      const actualTabIndex = page === 2 ? 3 : page;
      this.tabCartView.goToPage(actualTabIndex);
    }
  };

  processMidtransPayment = () => {
    const {userInfo} = this.state;
    const {user, payments, cartItems} = this.props;
    const paymentList = payments?.list || [];
    
    Reactotron.log('Processing Midtrans payment with methods:', paymentList);
    Reactotron.log('User state in processMidtransPayment:', user);
    Reactotron.log('User.user:', user?.user);
    Reactotron.log('User.user.id:', user?.user?.id);
    
    // Find Midtrans payment method
    const midtransPayment = paymentList.find(payment => 
      payment.id === 'midtrans' || 
      payment.id === 'midtrans_gopay_qris' || 
      payment.id === 'midtrans_shopeepay_qris' || 
      payment.id === 'midtrans_qris'
    );
    
    if (!midtransPayment) {
      Reactotron.log('No Midtrans payment method found, using first available');
      if (paymentList.length === 0) {
        Reactotron.log('No payment methods available at all');
        // Just move to FinishOrder
        if (this.tabCartView) {
          this.tabCartView.goToPage(3);
        }
        return;
      }
    }
    
    const selectedPayment = midtransPayment || paymentList[0];
    Reactotron.log('Using payment method:', selectedPayment);
    
    // Build order payload similar to Payment component
    const customerId = user?.user?.id || 0;
    Reactotron.log('Customer ID being used:', customerId);
    
    const payload = {
      token: user?.token || null,
      customer_id: customerId,
      set_paid: false,
      payment_method: selectedPayment.id,
      payment_method_title: selectedPayment.title,
      billing: {
        ...(user?.user?.billing || {}),
        email: userInfo?.email,
        phone: userInfo?.phone,
        first_name: userInfo?.first_name || '',
        last_name: userInfo?.last_name || '',
        address_1: userInfo?.address_1 || '',
        city: userInfo?.city || '',
        state: userInfo?.state || '',
        country: userInfo?.country || '',
        postcode: userInfo?.postcode || '',
      },
      shipping: {
        first_name: userInfo?.first_name || '',
        last_name: userInfo?.last_name || '',
        address_1: userInfo?.address_1 || '',
        city: userInfo?.city || '',
        state: userInfo?.state || '',
        country: userInfo?.country || '',
        postcode: userInfo?.postcode || '',
      },
      line_items: Tools.getItemsToCheckout(cartItems),
      customer_note: userInfo?.note || '',
      currency: this.props.currency?.code || 'IDR',
    };
    
    Reactotron.log('Order payload:', payload);
    
    // Navigate to order summary screen with Midtrans
    if (this.onShowNativeOnePageCheckOut) {
      this.onShowNativeOnePageCheckOut(payload);
    } else if (this.onShowCheckOut) {
      this.onShowCheckOut(payload);
    } else {
      // Fallback: just move to FinishOrder
      Reactotron.log('No checkout method available, moving to FinishOrder');
      if (this.tabCartView) {
        this.tabCartView.goToPage(3);
      }
    }
  };

  finishOrder = () => {
    const {onFinishOrder} = this.props;
    this.props.finishOrder();
    onFinishOrder();
    BlockTimer.execute(() => {
      this.tabCartView.goToPage(0);
    }, 1500);
  };

  render() {
    const {onViewProduct, navigation, cartItems, onViewHome} = this.props;
    const {currentIndex} = this.state;
    const {
      theme: {
        colors: {background} = {},
      } = {},
    } = this.props;

    const {openModal} = this.state;

    if (currentIndex === 0 && cartItems && cartItems.length === 0) {
      return <PaymentEmpty onViewHome={onViewHome} />;
    }
    const steps = [
      {label: Languages.MyCart, icon: Images.IconCart},
      {label: Languages.Delivery, icon: Images.IconPin},
      {label: Languages.Order, icon: Images.IconFlag},
    ];
    return (
      <View style={[styles.fill, {backgroundColor: background}]}>
        {/* WebView modal is no longer needed since we use native screens */}
        {/* {this.renderCheckOut()} */}
        <View style={styles.indicator}>
          <StepIndicator
            steps={steps}
            openModal={openModal}
            order={this.state.order}
            onChangeTab={this.onChangeTabIndex}
            currentIndex={currentIndex === 3 ? 2 : currentIndex} // Map FinishOrder index 3 to visual index 2
          />
        </View>
        <View style={styles.content}>
          <ScrollableTabView
            ref={tabView => {
              this.tabCartView = tabView;
            }}
            locked
            onChangeTab={this.updatePageIndex}
            style={{backgroundColor: background}}
            initialPage={0}
            tabBarPosition="overlayTop"
            prerenderingSiblingsNumber={1}
            renderTabBar={() => <View style={{padding: 0, margin: 0}} />}>
            <MyCart
              key="cart"
              onNext={this.onNext}
              onPrevious={this.onPrevious}
              navigation={navigation}
              onViewProduct={onViewProduct}
            />

            <Delivery
              key="delivery"
              onNext={formValues => {
                this.setState({userInfo: formValues});
                this.onNext();
              }}
              onPrevious={this.onPrevious}
            />
            <Payment
              ref={ref => (this.paymentRef = ref)}
              key="payment"
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              userInfo={this.state.userInfo}
              isLoading={this.state.isLoading}
              onShowCheckOut={this.onShowCheckOut}
              onShowNativeOnePageCheckOut={this.onShowNativeOnePageCheckOut}
            />

            <FinishOrder key="finishOrder" finishOrder={this.finishOrder} />
          </ScrollableTabView>

          {currentIndex === 0 && (
            <Buttons onPrevious={this.onPrevious} onNext={this.onNext} />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({carts, user, payments, currency}) => ({
  cartItems: carts.cartItems,
  user,
  payments,
  currency,
});
function mergeProps(stateProps, dispatchProps, ownProps) {
  const {dispatch} = dispatchProps;
  const CartRedux = require('@redux/CartRedux');

  return {
    ...ownProps,
    ...stateProps,
    emptyCart: () => CartRedux.actions.emptyCart(dispatch),
    finishOrder: () => CartRedux.actions.finishOrder(dispatch),
  };
}

export default connect(mapStateToProps, undefined, mergeProps)(withTheme(Cart));
