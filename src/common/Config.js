/** @format */

import Images from './Images';
import Constants from './Constants';
import Icons from './Icons';

// Use environment variables for security
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || 'ck_b87630a219fd4f1569d0b0582414100a4b60142c';
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || 'cs_135ff1c9d7c51b0fa140faa70e8f721597ee7d4c';

export default {
  /**
   * Step 1: change to your website URL and the wooCommerce API consumeKey
   */
  WooCommerce: {
    url: 'https://doseofbeauty.id/',
    consumerKey,
    consumerSecret,
  },

  /**
   * Midtrans Payment Configuration
   * API keys are handled by WooCommerce Midtrans plugin
   * Mobile app only needs to call WooCommerce REST API
   */
  Midtrans: {
    // No API keys needed - handled by WooCommerce plugin
    // Mobile app only calls WooCommerce REST API
  },

  /**
     Step 2: Setting Product Images
     - ProductSize: Explode the guide from: update the product display size: https://mstore.gitbooks.io/mstore-manual/content/chapter5.html
     The default config for ProductSize is disable due to some problem config for most of users.
     If you have success config it from the Wordpress site, please enable to speed up the app performance
     - HorizonLayout: Change the HomePage horizontal layout - https://mstore.gitbooks.io/mstore-manual/content/chapter6.html
       Update Oct 06 2018: add new type of categories
       NOTE: name is define value --> change field in Language.js
       Moved to AppConfig.json
     */
  ProductSize: {
    enable: true,
  },

  HomeCategories: [
    {
      category: 196,
      image: require('@images/categories_icon/ic_shorts.png'),
      colors: ['#4facfe', '#00f2fe'],
      label: 'Skincare',
    },
    {
      category: 197,
      image: require('@images/categories_icon/ic_tshirt.png'),
      colors: ['#43e97b', '#38f9d7'],
      label: 'Makeup',
    },
    {
      category: 198,
      image: require('@images/categories_icon/ic_panties.png'),
      colors: ['#fa709a', '#fee140'],
      label: 'Haircare',
    },
    {
      category: 199,
      image: require('@images/categories_icon/ic_dress.png'),
      colors: ['#7F00FF', '#E100FF'],
      label: 'Bath & Body Care',
    },
    {
      category: 200,
      image: require('@images/categories_icon/ic_glasses.png'),
      colors: ['#30cfd0', '#330867'],
      label: 'Fragance',
    },    
    {
      category: 274,
      image: require('@images/categories_icon/ic_shorts.png'),
      colors: ['#4facfe', '#00f2fe'],
      label: 'Tool & Brushes',
    }
  ],
  /**
     step 3: Config image for the Payment Gateway
     Notes:
     - Only the image list here will be shown on the app but it should match with the key id from the WooCommerce Website config
     - It's flexible way to control list of your payment as well
     Ex. if you would like to show only cod then just put one cod image in the list
     * */
  Payments: {
    // cod: require('@images/payment_logo/cash_on_delivery.png'),
    // paypal: require('@images/payment_logo/PayPal.png'),
    // stripe: require('@images/payment_logo/stripe.png'),
    // Midtrans payment methods - these IDs should match your WooCommerce payment method IDs
    // 'midtrans_gopay_qris': require('@images/payment_logo/gopay_qris.png'),
    // 'midtrans_shopeepay_qris': require('@images/payment_logo/shopeepay_qris.png'),
    // 'midtrans_qris': require('@images/payment_logo/qris.png'),
    // Alternative possible IDs for Midtrans
    'midtrans': require('@images/payment_logo/midtrans.png'),
    // 'gopay': require('@images/payment_logo/gopay_qris.png'),
    // 'shopeepay': require('@images/payment_logo/shopeepay_qris.png'),
    // 'qris': require('@images/payment_logo/qris.png'),
  },

  /**
     Step 4: Advance config:
     - showShipping: option to show the list of shipping method
     - showStatusBar: option to show the status bar, it always show iPhoneX
     - LogoImage: The header logo
     - LogoWithText: The Logo use for sign up form
     - LogoLoading: The loading icon logo
     - appFacebookId: The app facebook ID, use for Facebook login
     - CustomPages: Update the custom page which can be shown from the left side bar (Components/Drawer/index.js)
     - WebPages: This could be the id of your blog post or the full URL which point to any Webpage (responsive mobile is required on the web page)
     - intro: The on boarding intro slider for your app
     - menu: config for left menu side items (isMultiChild: This is new feature from 3.4.5 that show the sub products categories)
     * */
  shipping: {
    visible: true,
    zoneId: 1, // depend on your woocommerce
    time: {
      free_shipping: '4 - 7 Days',
      flat_rate: '1 - 4 Days',
      local_pickup: '1 - 4 Days',
    },
  },
  showStatusBar: true,
  LogoImage: require('@images/logo-main.png'),
  LogoWithText: require('@images/logo_with_text.png'),
  LogoLoading: require('@images/ic_add.png'),

  showAdmobAds: false,
  AdMob: {
    deviceID: 'pub-2101182411274198',
    rewarded: 'ca-app-pub-2101182411274198/5096259336',
    interstitial: 'ca-app-pub-2101182411274198/8930161243',
    banner: 'ca-app-pub-2101182411274198/4100506392',
  },
  appFacebookId: '501847534057136',
  CustomPages: {contact_id: 10941},
  WebPages: {marketing: 'http://inspireui.com'},

  intro: [
    {
      key: 'page1',
      title: 'Welcome to Dose of Beauty',
      text: 'Your Daily Dose of Confidence.',
      icon: 'ios-basket',
      colors: ['#0FF0B3', '#036ED9'],
    },
    {
      key: 'page2',
      title: 'Secure Payment',
      text: 'All your payment infomation is top safety and protected',
      icon: 'ios-card',
      colors: ['#13f1fc', '#0470dc'],
    },
    {
      key: 'page3',
      title: 'High Performance',
      text: 'Saving your value time and buy product with ease',
      icon: 'ios-finger-print',
      colors: ['#b1ea4d', '#459522'],
    },
  ],

  /**
   * Config For Left Menu Side Drawer
   * @param goToScreen 3 Params (routeName, params, isReset = false)
   * BUG: Language can not change when set default value in Config.js ==> pass string to change Languages
   */
  menu: {
    // has child categories
    isMultiChild: true,
    // Unlogged
    listMenuUnlogged: [
      {
        text: 'Login',
        routeName: 'LoginScreen',
        params: {
          isLogout: false,
        },
        icon: Icons.MaterialCommunityIcons.SignIn,
      },
    ],
    // user logged in
    listMenuLogged: [
      {
        text: 'Logout',
        routeName: 'LoginScreen',
        params: {
          isLogout: true,
        },
        icon: Icons.MaterialCommunityIcons.SignOut,
      },
    ],
    // Default List
    listMenu: [
      {
        text: 'Shop',
        routeName: 'Home',
        icon: Icons.MaterialCommunityIcons.Home,
      },
      {
        text: 'News',
        routeName: 'NewsScreen',
        icon: Icons.MaterialCommunityIcons.News,
      },
      // {
      //   text: 'contactus',
      //   routeName: 'CustomPage',
      //   params: {
      //     id: 10941,
      //     title: 'contactus',
      //   },
      //   icon: Icons.MaterialCommunityIcons.Pin,
      // },
      {
        text: 'About',
        routeName: 'CustomPage',
        params: {
          url: 'https://doseofbeauty.id/',
        },
        icon: Icons.MaterialCommunityIcons.Email,
      },
    ],
  },

  // define menu for profile tab
  ProfileSettings: [
    {
      label: 'WishList',
      routeName: 'WishListScreen',
    },
    {
      label: 'MyOrder',
      routeName: 'MyOrders',
    },
    {
      label: 'Address',
      routeName: 'Address',
    },
    {
      label: 'Currency',
      isActionSheet: true,
    },
    // only support mstore pro
    {
      label: 'Languages',
      routeName: 'SettingScreen',
    },
    {
      label: 'DeleteAccount',
      isWebLink: true,
      webUrl: 'https://doseofbeauty.id/my-account/delete-account/',
    },
    // {
    //   label: 'PushNotification',
    // },
    {
      label: 'DarkTheme',
    }
  ],

  // Homepage Layout setting
  layouts: [
    {
      layout: Constants.Layout.card,
      image: Images.icons.iconCard,
      text: 'cardView',
    },
    {
      layout: Constants.Layout.simple,
      image: Images.icons.iconRight,
      text: 'simpleView',
    },
    {
      layout: Constants.Layout.twoColumn,
      image: Images.icons.iconColumn,
      text: 'twoColumnView',
    },
    {
      layout: Constants.Layout.threeColumn,
      image: Images.icons.iconThree,
      text: 'threeColumnView',
    },
    {
      layout: Constants.Layout.horizon,
      image: Images.icons.iconHorizal,
      text: 'horizontal',
    },
    {
      layout: Constants.Layout.advance,
      image: Images.icons.iconAdvance,
      text: 'advanceView',
    },
  ],

  // Default theme loading, this could able to change from the user profile (reserve feature)
  Theme: {
    isDark: false,
  },

  // new list category design
  CategoriesLayout: Constants.CategoriesLayout.card,

 // WARNING: Saat mengubah DefaultCurrency, uninstall dulu app di emulator/device agar Redux store lama tidak mempengaruhi
DefaultCurrency: {
  symbol: 'Rp',           // simbol mata uang
  name: 'Rupiah',         // nama mata uang
  code: 'IDR',            // kode mata uang
  name_plural: 'Rupiah',  // nama plural
  decimal: ',',           // pemisah desimal
  thousand: '.',          // pemisah ribuan
  precision: 0,           // Rupiah biasanya tanpa desimal
  format: '%s %v',        // format: simbol + spasi + nilai
},

DefaultCountry: {
  code: 'id',             // kode negara
  RTL: false,             // tidak pakai Right-To-Left
  language: 'Indonesian', // bahasa
  countryCode: 'ID',      // kode negara untuk API / checkout
  hideCountryList: false, // tampilkan daftar negara di checkout
},

  /**
   * Config notification onesignal, only effect for the Pro version
   */
  OneSignal: {
    appId: '43948a3d-da03-4e1a-aaf4-cb38f0d9ca51',
  },
  /**
   * Login required
   */
  Login: {
    RequiredLogin: false, // required before using the app
    AnonymousCheckout: false, // required before checkout or checkout anonymous
  },

  Layout: {
    HideHomeLogo: true,
    HideLayoutModal: false,
  },

  Affiliate: {enable: false},

  EnableOnePageCheckout: false,

  NativeOnePageCheckout: true,

  // using url from server to load AppConfig.json
  HomeCaching: {
    url: `https://demo.mstore.io/wp-json/wc/v2/flutter/cache?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`, // can change url to load another server
    enable: false, // disable load from server, and start load in local in `common/AppConfig.json`
  },
};
